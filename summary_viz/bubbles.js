'use strict';

(function() {

window.addEventListener("load", (event) => {
    let bubbleManager = new BubbleManager();
    bubbleManager.initialize();

    //------------------------------------------------------------
    //------------------------------------------------------------
    function BubbleManager()
    {
        // define svg width and height
        this.width = 500;
        this.height = 500;

        this.radius = null;

        this.svg = null;

        this.selectBrowseType = null;
        this.selectSortType = null;

        this.color = null;
        this.colorTemp = null;

        // initialize dynamic data & variables
        // each object in this.display_data has the following data subset
        //     key: used to uniquely identify the current data
        //     value: used to determine the bubble radius
        //     index
        //     x: positiion x component
        //     y: positiion y component
        //     vx: velocity x component
        //     vy: velocity y component
        // where index, x, y, vx, vy are automatically added by d3's simulation.nodes()
        this.display_data = null;
        this.browseType = null;
        this.sortType = null;

        // this is for onclick "artist/genre to song" drill-down
        this.song_filter = false;

        this.circles = null;

        this.simulation = null;

        this.tooltip = null;

        this.radiusKey = null;

        // create tooltip functions
        this.showTooltip = (d) => {
            this.tooltip
              .style("opacity", 1)
              .html(d.key);
        };

        this.moveTooltip = (d) => {
            let coord = d3.mouse(document.body);
            this.tooltip
              .style("left", (coord[0] + 30) + "px")
              .style("top", (coord[1] + 30) + "px");
        };

        this.hideTooltip = (d) => {
            this.tooltip
              .style("opacity", 0);
        };

        // load hardcoded song library (for now)
        // variable "data" coincides with d3's data() function name
        // so rename it "rawData"
        this.rawData = [
            {song: "Blackbird", artist: "The Beatles", genre: "Rock", acousticness: 0.88, danceability: 0.05, year: 1968},
            {song: "Dream On", artist: "Aerosmith", genre: "Rock", acousticness: 0.10, danceability: 0.24, year: 1973},
            {song: "Brown Eyed Girl", artist: "Van Morrison", genre: "Rock", acousticness: 0.40, danceability: 0.68, year: 1967},
            {song: "Take It Easy", artist: "The Eagles", genre: "Rock", acousticness: 0.65, danceability: 0.32, year: 1972},
            {song: "The Chain", artist: "Fleetwood Mac", genre: "Rock", acousticness: 0.70, danceability: 0.22, year: 1977},
            {song: "Piano Man", artist: "Billy Joel", genre: "Rock", acousticness: 0.50, danceability: 0.50, year: 2011},
            {song: "Rivers & Roads", artist: "The Head and the Heart", genre: "Indie", acousticness: 0.67, danceability: 0.11, year: 2011},
            {song: "White Horses", artist: "Darlingside", genre: "Indie", acousticness: 0.78, danceability: 0.10, year: 2015},
            {song: "Ophelia", artist: "The Lumineers", genre: "Indie", acousticness: 0.71, danceability: 0.42, year: 2016},
            {song: "Drive", artist: "Oh Wonder", genre: "Indie", acousticness: 0.57, danceability: 0.17, year: 2015},
            {song: "I And Love And You", artist: "The Avett Brothers", genre: "Folk", acousticness: 0.75, danceability: 0.10, year: 2009},
            {song: "Green Light", artist: "Lorde", genre: "Pop", acousticness: 0.12, danceability: 0.85, year: 2017},
            {song: "New Light", artist: "John Mayer", genre: "Pop", acousticness: 0.33, danceability: 0.72, year: 2018},
            {song: "Feel It Still", artist: "Portugal the Man", genre: "Pop", acousticness: 0.15, danceability: 0.98, year: 2017},
            {song: "Back Pocket", artist: "Vulfpeck", genre: "Funk", acousticness: 0.09, danceability: 0.82, year: 2015},
            {song: "Movement", artist: "Hozier", genre: "Rock", acousticness: 0.38, danceability: 0.33, year: 2018},
            {song: "Unwritten", artist: "Natasha Bedingfield", genre: "Pop", acousticness: 0.11, danceability: 0.87, year: 2004},
            {song: "Cecilia", artist: "Simon and Garfunkel", genre: "Rock", acousticness: 0.39, danceability: 0.61, year: 1970},
            {song: "A Long December", artist: "Counting Crows", genre: "Rock", acousticness: 0.54, danceability: 0.35, year: 1996},
            {song: "Love Song", artist: "Sara Bareilles", genre: "Pop", acousticness: 0.32, danceability: 0.55, year: 2007},
            {song: "The Cave", artist: "Mumford & Sons", genre: "Folk", acousticness: 0.60, danceability: 0.29, year: 2009},
            {song: "Lose Yourself", artist: "Eminem", genre: "Rap", acousticness: 0.05, danceability: 0.70, year: 2002},
            {song: "6 Summers", artist: "Anderson Paak", genre: "R&B", acousticness: 0.09, danceability: 0.77, year: 2018},
            {song: "Blank Space", artist: "Taylor Swift", genre: "Pop", acousticness: 0.15, danceability: 0.96, year: 2014},
            {song: "One Dance", artist: "Drake", genre: "R&B", acousticness: 0.02, danceability: 0.80, year: 2016},
            {song: "Crazy in Love", artist: "Beyonce", genre: "R&B", acousticness: 0.12, danceability: 0.99, year: 2003},
            {song: "Live Like You Were Dying", artist: "Tim McGraw", genre: "Country", acousticness: 0.59, danceability: 0.30, year: 2004},
            {song: "Fur Elise", artist: "Beethoven", genre: "Classical", acousticness: 0.50, danceability: 0.24, year: 1867},
            {song: "Eine Kleine Nachtmusik", artist: "Mozart", genre: "Classical", acousticness: 0.51, danceability: 0.27, year: 1787},
            {song: "Before He Cheats", artist: "Carrie Underwood", genre: "Country", acousticness: 0.38, danceability: 0.60, year: 2005},
            {song: "What a Wonderful World", artist: "Louis Armstrong", genre: "Jazz", acousticness: 0.68, danceability: 0.23, year: 1967},
            {song: "Eleanor Rigby", artist: "The Beatles", genre: "Rock", acousticness: 0.72, danceability: 0.29, year: 1966},
            {song: "Walk This Way", artist: "Aerosmith", genre: "Rock", acousticness: 0.23, danceability: 0.84, year: 1975},
            {song: "Yellow Submarine", artist: "The Beatles", genre: "Rock", acousticness: 0.40, danceability: 0.58, year: 1966},
            {song: "Here Comes the Sun", artist: "The Beatles", genre: "Rock", acousticness: 0.81, danceability: 0.45, year: 1969},
            {song: "Landslide", artist: "Fleetwood Mac", genre: "Rock", acousticness: 0.88, danceability: 0.21, year: 1975},
            {song: "She's Always a Woman", artist: "Billy Joel", genre: "Rock", acousticness: 0.90, danceability: 0.15, year: 1977},
            {song: "Another Story", artist: "The Head and the Heart", genre: "Indie", acousticness: 0.72, danceability: 0.18, year: 2013},
            {song: "The Ancestor", artist: "Darlingside", genre: "Indie", acousticness: 0.89, danceability: 0.13, year: 2012},
            {song: "The Company We Keep", artist: "Darlingside", genre: "Indie", acousticness: 0.64, danceability: 0.23, year: 2012}
        ];

        //------------------------------------------------------------
        //------------------------------------------------------------
        this.initialize = () => {
            // console.log(this.rawData.length);
            // console.log(this.rawData);

            // reload page when clicking the button
            d3.select("#reloadButton").on("click", () => {
                // reload the current page without the browser cache
                window.location.reload(true);
            });

            // create svg
            this.svg = d3.select("#chart")
                .append("svg")
                .attr("height", this.height)
                .attr("width", this.width)
                .append("g")
                .attr("transform", "translate(0,0)");

            // initialize ability to toggle between song, artist, genre views
            // whenever browse type is explicitly toggled, reset this.display_data to this.rawData
            this.selectBrowseType = d3.select("#browse-type").on("change", (d) => {
                this.song_filter = false;
                this.display_data = this.rawData;
                this.updateViz();
            });

            this.selectSortType = d3.select("#sort-type").on("change", (d) => {
                this.song_filter = false;
                this.display_data = this.rawData;
                this.updateViz();
            });

            // map each genre to a color
            this.color = d3.scaleOrdinal()
                .domain(["Rock", "Pop", "Country", "Indie", "Funk", "Folk", "Rap", "R&B", "Classical", "Jazz"])
                .range(["#F7D554", "#BAD65E", "#1DB954", "#FC8847", "#EA4A3C", "#408A8F", "#820096", "#96007F", "#3F71A3", "#85002A"]);
            this.colorTemp = {"Rock"     : "#F7D554",
                              "Pop"      : "#BAD65E",
                              "Country"  : "#1DB954",
                              "Indie"    : "#FC8847",
                              "Funk"     : "#EA4A3C",
                              "Folk"     : "#408A8F",
                              "Rap"      : "#C71C77",
                              "R&B"      : "#850096",
                              "Classical": "#3F71A3",
                              "Jazz"     : "#85002A"};

            // initialize dynamic data & variables
            this.display_data = this.rawData;

            // initialize song filter boolean
            this.song_filter = false;

            // draw viz for the first time (song view)
            this.updateViz();
        };

        //------------------------------------------------------------
        //------------------------------------------------------------
        this.updateViz = () => {
            this.radius = d3.scaleSqrt();

            // get user's "browse by" selection
            if (this.song_filter === false) {
                this.browseType = this.selectBrowseType.property("value");
            } else {
                this.browseType = "song";
            }

            // get user's "sort by" selection
            // NOTE: Only when "sort by" is set to "default" is
            // "browse by" selection honored. In all other cases where
            // "sort by" is non-default, "browse by" selection is ignored!
            this.sortType = this.selectSortType.property("value");

            // honor "browse by" selection
            if(this.sortType == "default")
            {
                // user toggle among rollup views
                if (this.browseType == "song") {
                    if (this.song_filter === false) {
                        this.display_data = this.deepCopyRawData();
                    }

                    // console.log(this.display_data);

                    // scale radius (constant for song view)
                    this.radius
                        .domain([1,2])
                        .range([20,20]);

                }

                else if (this.browseType == "artist") {

                    this.display_data = this.rawData;

                    // group data by artist
                    let artist = d3.nest()
                        .key((d) => { return d.artist; }).sortKeys(d3.ascending)
                        .rollup((v) => { return v.length; })
                        .entries(this.display_data);

                    // console.log(artist);
                    // console.log(artist.length);

                    this.display_data = artist;

                    // scale radius by artist group size
                    this.radius
                        .domain(d3.extent(artist, (d) => { return d.value; })).nice()
                        .range([20, 100]);

                }

                else { // this.browseType == "genre"

                    this.display_data = this.rawData;

                    // group data by genre
                    let genre = d3.nest()
                        .key((d) => { return d.genre; }).sortKeys(d3.ascending)
                        .rollup((v) => { return v.length; })
                        .entries(this.display_data);

                    // console.log(genre);
                    // console.log(genre.length);

                    this.display_data = genre;

                    // scale radius by genre group size
                    this.radius
                        .domain(d3.extent(genre, (d) => { return d.value; })).nice()
                        .range([20, 100]);

                }
            }
            // ignore "browse by" selection
            else
            {
                this.display_data = this.deepCopyRawData();

                // scale radius by d[this.sortType] magnitude
                this.radius
                    .domain(d3.extent(this.display_data, (d) => { return d[this.sortType]; }))
                    .range([5, 40]);
            }

            // remove all existing tooltips
            d3.selectAll(".tooltip").remove();

            // initialize tooltips for song labels on hover
            this.tooltip = d3.select("#chart")
                .append("div")
                .style("opacity", 0)
                .style("position","absolute")
                .attr("class", "tooltip")
                .style("background-color", "black")
                .style("border-radius", "5px")
                .style("padding", "10px")
                .style("color", "white");

            // remove all existing bubbles
            this.svg.selectAll(".bubble").remove();

            // append bubbles to svg
            this.circles = this.svg.selectAll(".bubble")
                .data(this.display_data)
                .join(
                    enter => enter
                        .append("circle")
                        .attr("class", "bubble")
                        .attr("r", (d) => {
                            return this.radius(d.value);
                         })
                        .attr("fill", (d, i) => {
                            if(this.sortType == "default")
                            {
                                if (this.browseType == "song")
                                {
                                    let genreName = d["genre"];
                                    return this.colorTemp[genreName];
                                }
                                else if (this.browseType == "artist")
                                {
                                    return "#A9A9A9";
                                }
                                else // this.browseType == "genre"
                                {
                                    let genreName = d["key"];
                                    return this.colorTemp[genreName];
                                }
                            }
                            else
                            {
                                let genreName = d["genre"];
                                return this.colorTemp[genreName];
                            }
                        }),
                    update => update
                        .attr("r", (d) => { return this.radius(d.value); }),
                    exit => exit.remove()
                    );

            // hover functionality
            this.circles
                .on("mouseenter", this.showTooltip)
                .on("mousemove", this.moveTooltip)
                .on("mouseleave", this.hideTooltip);

            // click functionality
            this.circles
                .on("click", d => {

                    if (this.browseType == "artist") {

                        this.display_data = this.rawData.filter(v => {
                            return d.key == v.artist;
                        });

                        for(let i = 0; i < this.display_data.length; ++i)
                        {
                            this.display_data[i]["value"] = 1.0;
                            this.display_data[i]["key"] = this.display_data[i]["song"];
                        }

                        // console.log(this.display_data);

                        this.song_filter = true;

                        this.updateViz();
                    }
                    if (this.browseType == "genre") {

                        this.display_data = this.rawData.filter(v => {
                            return d.key == v.genre;
                        });

                        for(let i = 0; i < this.display_data.length; ++i)
                        {
                            this.display_data[i]["value"] = 1.0;
                            this.display_data[i]["key"] = this.display_data[i]["song"];
                        }

                        // console.log(this.display_data);

                        this.song_filter = true;

                        this.updateViz();
                    }
                    else {
                        // this.browseType == "song"
                        // click out to detailed viz
                    }

                });


            // initialize force simulation
            this.simulation = d3.forceSimulation()
                .force("x", d3.forceX(this.width / 2).strength(0.05))
                .force("y", d3.forceY(this.height / 2).strength(0.05))
                .force("collide", d3.forceCollide((d) => {
                    return this.radius(d.value) + 5;
                }));

            // call force simulation
            this.simulation.nodes(this.display_data)
                .on('tick', (d) => {
                    this.circles
                    .attr("cx", (d) => {
                        return d.x
                    })
                    .attr("cy", (d) => {
                        return d.y
                    });
                });
        };

        this.deepCopyRawData = () => {
            // javascript's Array.sort() method performs sorting
            // "in place", which is too intrusive. to avoid
            // meddling with this.rawData, here Array.sort()
            // is only applied to a deep copy.

            let deepCopy = JSON.parse(JSON.stringify(this.rawData));

            if(this.sortType == "default" && this.browseType == "song")
            {
                // for each element in deepCopy
                // add a "value" property whose value equals 1.0
                // add a "key" property whose value equals song name
                for(let i = 0; i < deepCopy.length; ++i)
                {
                    deepCopy[i]["value"] = 1.0;
                    deepCopy[i]["key"] = deepCopy[i]["song"];
                }
            }
            else if(this.sortType != "default")
            {
                // for each element in deepCopy
                // add a "value" property whose value equals this.sortType
                // add a "key" property whose value equals song name
                for(let i = 0; i < deepCopy.length; ++i)
                {
                    deepCopy[i]["value"] = deepCopy[i][this.sortType];
                    deepCopy[i]["key"] = deepCopy[i]["song"];
                }

                // reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
                // sort deepCopy "in place" in ascending order
                deepCopy.sort((a, b) => {
                    if (a[this.sortType] < b[this.sortType])
                    {
                        return -1;
                    }

                    if (a[this.sortType] > b[this.sortType])
                    {
                        return 1;
                    }

                    // a must be equal to b
                    return 0;
                });
            }
            else
            {
                throw new Error("SHOULD NOT CALL this.deepCopyRawData() IN OTHER CONDITIONS");
            }

            return deepCopy;
        };
    }

}); // end click event listener

})(); // end IIFE scope

