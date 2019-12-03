(function () {

	// load hardcoded song library (for now)
    var data = [
		{song: "Blackbird", artist: "The Beatles", genre: "Rock"},
		{song: "Dream On", artist: "Aerosmith", genre: "Rock"},
		{song: "Brown Eyed Girl", artist: "Van Morrison", genre: "Rock"},
		{song: "Take It Easy", artist: "The Eagles", genre: "Rock"},
		{song: "The Chain", artist: "Fleetwood Mac", genre: "Rock"},
		{song: "Piano Man", artist: "Billy Joel", genre: "Rock"},
		{song: "Rivers & Roads", artist: "The Head and the Heart", genre: "Indie"},
		{song: "White Horses", artist: "Darlingside", genre: "Indie"},
		{song: "Ophelia", artist: "The Lumineers", genre: "Indie"},
		{song: "Drive", artist: "Oh Wonder", genre: "Indie"},
		{song: "I And Love And You", artist: "The Avett Brothers", genre: "Folk"},
		{song: "Green Light", artist: "Lorde", genre: "Pop"},
		{song: "New Light", artist: "John Mayer", genre: "Pop"},
		{song: "Feel It Still", artist: "Portugal the Man", genre: "Pop"},
		{song: "Back Pocket", artist: "Vulfpeck", genre: "Funk"},
		{song: "Movement", artist: "Hozier", genre: "Rock"},
		{song: "Unwritten", artist: "Natasha Bedingfield", genre: "Pop"},
		{song: "Cecilia", artist: "Simon and Garfunkel", genre: "Rock"},
		{song: "A Long December", artist: "Counting Crows", genre: "Rock"},
		{song: "Love Song", artist: "Sara Bareilles", genre: "Pop"},
		{song: "The Cave", artist: "Mumford & Sons", genre: "Folk"},
		{song: "Lose Yourself", artist: "Eminem", genre: "Rap"},
		{song: "6 Summers", artist: "Anderson Paak", genre: "R&B"},
		{song: "Blank Space", artist: "Taylor Swift", genre: "Pop"},
		{song: "One Dance", artist: "Drake", genre: "R&B"},
		{song: "Crazy in Love", artist: "Beyonce", genre: "R&B"},
		{song: "Live Like You Were Dying", artist: "Tim McGraw", genre: "Country"},
		{song: "Fur Elise", artist: "Beethoven", genre: "Classical"},
		{song: "Eine Kleine Nachtmusik", artist: "Mozart", genre: "Classical"},
		{song: "Before He Cheats", artist: "Carrie Underwood", genre: "Country"},
		{song: "What a Wonderful World", artist: "Louis Armstrong", genre: "Jazz"},
		{song: "Eleanor Rigby", artist: "The Beatles", genre: "Rock"},
		{song: "Walk This Way", artist: "Aerosmith", genre: "Rock"},
		{song: "Yellow Submarine", artist: "The Beatles", genre: "Rock"},
		{song: "Here Comes the Sun", artist: "The Beatles", genre: "Rock"},
		{song: "Landslide", artist: "Fleetwood Mac", genre: "Rock"},
		{song: "She's Always a Woman", artist: "Billy Joel", genre: "Rock"},
		{song: "Another Story", artist: "The Head and the Heart", genre: "Indie"},
		{song: "The Ancestor", artist: "Darlingside", genre: "Indie"},
		{song: "The Company We Keep", artist: "Darlingside", genre: "Indie"}
	];

	console.log(data.length);


	// define svg width and height
	var width = 500, 
		height = 500;


	// create svg
	var svg = d3.select("#chart")
		.append("svg")
		.attr("height", height)
		.attr("width", width)
		.append("g")
		.attr("transform", "translate(0,0)")

	// initiate ability to toggle between graphs
	var selectBrowseType = d3.select("#browse-type").on("change", updateViz);


	// map each genre to a color
    var color = d3.scaleOrdinal()
        .domain(["Rock", "Pop", "Country", "Indie", "Funk", "Folk", "Rap", "R&B", "Classical", "Jazz"]) 
        .range(["gold", "lightgreen", "red", "orange", "purple", "green", "blue", "pink", "lightblue", "navy"]);

	// group data by artist
    // var artist = d3.nest()
    //     .key(function(d) { return d.artist; })
    //     .rollup(function(v) { return v.length; })
    //     .entries(data);

    // console.log(artist);
    // console.log(artist.length);

    // group data by genre
    // var genre = d3.nest()
    //     .key(function(d) { return d.genre; })
    //     .rollup(function(v) { return v.length; })
    //     .entries(data);

    // console.log(genre);


	// draw viz for the first time (song view)
	// updateViz(data);

	groupSong(data);

	// groupGenre();

	// groupArtist();

	function updateViz (data) {

		// get user's category selection
		var browseType = selectBrowseType.property("value");

		console.log(browseType);

	 // group data by artist
	 //    var artist = d3.nest()
	 //        .key(function(d) { return d.artist; })
	 //        .rollup(function(v) { return v.length; })
	 //        .entries(data);

	 //    console.log(artist);
	 //    console.log(artist.length);

     // group data by genre
	 //    var genre = d3.nest()
	 //        .key(function(d) { return d.genre; })
	 //        .rollup(function(v) { return v.length; })
	 //        .entries(data);

	 //    console.log(genre);


	    // user toggles
		if (browseType == "song")
			groupSong()

		if (browseType == "artist")
			groupArtist()

		else
			groupGenre();

	}

	function groupSong () {

		// create force simulation
		// bubbles move to center of svg without colliding
		var simulation = d3.forceSimulation()
			.force("x", d3.forceX(width / 2).strength(0.05))
			.force("y", d3.forceY(height / 2).strength(0.05))
			.force("collide", d3.forceCollide(25))

		// intialize tooltips for song labels on hover
		var tooltip = d3.select("#chart")
			.append("div")
			.style("opacity", 0)
			.style("position","absolute")
			.attr("class", "tooltip")
		    .style("background-color", "black")
		    .style("border-radius", "5px")
		    .style("padding", "10px")
		    .style("color", "white")

		// create tooltip functions
		var showTooltip = function(d) {
		    tooltip
		      .style("opacity", 1)
		      .html(d.song + " &#9679 " + d.artist)
		}
		var moveTooltip = function(d) {
		    tooltip
		      .style("left", (d3.mouse(this)[0]+30) + "px")
		      .style("top", (d3.mouse(this)[1]+30) + "px")
		}
		var hideTooltip = function(d) {
		    tooltip
		      .style("opacity", 0)
		}

        // append bubbles to svg
        // colored by genre
		var circles = svg.selectAll(".bubble")
			.data(data)
			.enter()
			.append("circle")
			.attr("class", "bubble")
			//.merge(circles)
			.attr("r", 20)
			.style("fill", function(d) { return color(d.genre); })
			.on("mouseover", showTooltip)
			.on("mousemove", moveTooltip)
			.on("mouseleave", hideTooltip)

	    circles.exit().remove();


		// call force simulation
		simulation.nodes(data)
			.on('tick', ticked)

		// ticked function drives movement of circles across svg
		function ticked() {
			circles
				.attr("cx", function(d) {
					return d.x
				})
				.attr("cy", function(d) {
					return d.y
				})
		}

	}


	function groupGenre () {

		// group data by genre
	    var genre = d3.nest()
	        .key(function(d) { return d.genre; })
	        .rollup(function(v) { return v.length; })
	        .entries(data);

	    console.log(genre);

		// scale radius by genre size
    	var radius = d3.scaleSqrt()
        	.domain(d3.extent(genre, (d) => { return d.value; })).nice()
        	.range([30, 100]);


		// create force simulation
		// bubbles move to center of svg without colliding
		var simulation = d3.forceSimulation()
			.force("x", d3.forceX(width / 2).strength(0.05))
			.force("y", d3.forceY(height / 2).strength(0.05))
			.force("collide", d3.forceCollide(function(d) { 
				return radius(d.value) + 5; 
			}))

		// var genre_songs = data;


        // append bubbles to svg
        // colored by genre and scaled by song count
		var circles = svg.selectAll(".bubble")
			.data(genre)
			.enter()
			.append("circle")
			.attr("class", "bubble")
			.attr("r", function(d) { return radius(d.value); })
			.style("fill", function(d) { return color(d.key); })
			.on("click", function (d) {

              	genre_songs = data.filter(function(v){

              		console.log(v.genre);

                	return v.genre == d.data.key;
              	})

              	console.log(d.data.key);

              	// groupSong(genre_songs);

            });

        console.log(circles);

		// append genre labels to svg
		var text = svg.selectAll('text')
			.data(genre)
			.enter()
			.append('text')
			.text(bubble => bubble.key)
			.style("text-anchor", "middle")
			.style("fill", "white")


		// call force simulation
		simulation.nodes(genre)
			.on('tick', ticked)

		// ticked function drives movement of circles & label text across svg
		function ticked() {
			circles
				.attr("cx", function(d) {
					return d.x
				})
				.attr("cy", function(d) {
					return d.y
				})
			text
				.attr("x", function(d) {
					return d.x
				})
				.attr("y", function(d) {
					return d.y
				})
		}

	}


	function groupArtist () {

		// group data by artist
	    var artist = d3.nest()
	        .key(function(d) { return d.artist; })
	        .rollup(function(v) { return v.length; })
	        .entries(data);

	    console.log(artist);
	    console.log(artist.length);


		// scale radius by artist group size
    	var radius = d3.scaleSqrt()
        	.domain(d3.extent(artist, (d) => { return d.value; })).nice()
        	.range([20, 60]);


		// create force simulation
		// bubbles move to center of svg without colliding
		var simulation = d3.forceSimulation()
			.force("x", d3.forceX(width / 2).strength(0.05))
			.force("y", d3.forceY(height / 2).strength(0.05))
			.force("collide", d3.forceCollide(function(d) { 
				return radius(d.value) + 5; 
			}))

		// intialize tooltips for artist labels on hover
		var tooltip = d3.select("#chart")
			.append("div")
			.style("opacity", 0)
			.style("position","absolute")
			.attr("class", "tooltip")
		    .style("background-color", "black")
		    .style("border-radius", "5px")
		    .style("padding", "10px")
		    .style("color", "white")

		// create tooltip functions
		var showTooltip = function(d) {
		    tooltip
		      .style("opacity", 1)
		      .html(d.key)
		}
		var moveTooltip = function(d) {
		    tooltip
		      .style("left", (d3.mouse(this)[0]+30) + "px")
		      .style("top", (d3.mouse(this)[1]+30) + "px")
		}
		var hideTooltip = function(d) {
		    tooltip
		      .style("opacity", 0)
		}


        // append bubbles to svg
		var circles = svg.selectAll(".bubble")
			.data(artist)
			.enter()
			.append("circle")
			.attr("class", "bubble")
			.attr("r", function(d) { return radius(d.value); })
			.style("fill", "lightgray")
			.on("mouseover", showTooltip)
			.on("mousemove", moveTooltip)
			.on("mouseleave", hideTooltip)


		// call force simulation
		simulation.nodes(artist)
			.on('tick', ticked)

		// ticked function drives movement of circles across svg
		function ticked() {
			circles
				.attr("cx", function(d) {
					return d.x
				})
				.attr("cy", function(d) {
					return d.y
				})
		}

	}


})();

