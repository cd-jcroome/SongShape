(function () {

	// load hardcoded song library (for now)
    var data = [
		{song: "Blackbird", artist: "The Beatles", genre: "Rock", acousticness: 0.88, danceability: 0.05},
		{song: "Dream On", artist: "Aerosmith", genre: "Rock", acousticness: 0.10, danceability: 0.24},
		{song: "Brown Eyed Girl", artist: "Van Morrison", genre: "Rock", acousticness: 0.40, danceability: 0.68},
		{song: "Take It Easy", artist: "The Eagles", genre: "Rock", acousticness: 0.65, danceability: 0.32},
		{song: "The Chain", artist: "Fleetwood Mac", genre: "Rock", acousticness: 0.70, danceability: 0.22},
		{song: "Piano Man", artist: "Billy Joel", genre: "Rock", acousticness: 0.50, danceability: 0.50},
		{song: "Rivers & Roads", artist: "The Head and the Heart", genre: "Indie", acousticness: 0.67, danceability: 0.11},
		{song: "White Horses", artist: "Darlingside", genre: "Indie", acousticness: 0.78, danceability: 0.10},
		{song: "Ophelia", artist: "The Lumineers", genre: "Indie", acousticness: 0.71, danceability: 0.42},
		{song: "Drive", artist: "Oh Wonder", genre: "Indie", acousticness: 0.57, danceability: 0.17},
		{song: "I And Love And You", artist: "The Avett Brothers", genre: "Folk", acousticness: 0.75, danceability: 0.10},
		{song: "Green Light", artist: "Lorde", genre: "Pop", acousticness: 0.12, danceability: 0.85},
		{song: "New Light", artist: "John Mayer", genre: "Pop", acousticness: 0.33, danceability: 0.72},
		{song: "Feel It Still", artist: "Portugal the Man", genre: "Pop", acousticness: 0.15, danceability: 0.98},
		{song: "Back Pocket", artist: "Vulfpeck", genre: "Funk", acousticness: 0.09, danceability: 0.82},
		{song: "Movement", artist: "Hozier", genre: "Rock", acousticness: 0.38, danceability: 0.33},
		{song: "Unwritten", artist: "Natasha Bedingfield", genre: "Pop", acousticness: 0.11, danceability: 0.87},
		{song: "Cecilia", artist: "Simon and Garfunkel", genre: "Rock", acousticness: 0.39, danceability: 0.61},
		{song: "A Long December", artist: "Counting Crows", genre: "Rock", acousticness: 0.54, danceability: 0.35},
		{song: "Love Song", artist: "Sara Bareilles", genre: "Pop", acousticness: 0.32, danceability: 0.55},
		{song: "The Cave", artist: "Mumford & Sons", genre: "Folk", acousticness: 0.60, danceability: 0.29},
		{song: "Lose Yourself", artist: "Eminem", genre: "Rap", acousticness: 0.05, danceability: 0.70},
		{song: "6 Summers", artist: "Anderson Paak", genre: "R&B", acousticness: 0.09, danceability: 0.77},
		{song: "Blank Space", artist: "Taylor Swift", genre: "Pop", acousticness: 0.15, danceability: 0.96},
		{song: "One Dance", artist: "Drake", genre: "R&B", acousticness: 0.02, danceability: 0.80},
		{song: "Crazy in Love", artist: "Beyonce", genre: "R&B", acousticness: 0.12, danceability: 0.99},
		{song: "Live Like You Were Dying", artist: "Tim McGraw", genre: "Country", acousticness: 0.59, danceability: 0.30},
		{song: "Fur Elise", artist: "Beethoven", genre: "Classical", acousticness: 0.50, danceability: 0.24},
		{song: "Eine Kleine Nachtmusik", artist: "Mozart", genre: "Classical", acousticness: 0.51, danceability: 0.27},
		{song: "Before He Cheats", artist: "Carrie Underwood", genre: "Country", acousticness: 0.38, danceability: 0.60},
		{song: "What a Wonderful World", artist: "Louis Armstrong", genre: "Jazz", acousticness: 0.68, danceability: 0.23},
		{song: "Eleanor Rigby", artist: "The Beatles", genre: "Rock", acousticness: 0.72, danceability: 0.29},
		{song: "Walk This Way", artist: "Aerosmith", genre: "Rock", acousticness: 0.23, danceability: 0.84},
		{song: "Yellow Submarine", artist: "The Beatles", genre: "Rock", acousticness: 0.40, danceability: 0.58},
		{song: "Here Comes the Sun", artist: "The Beatles", genre: "Rock", acousticness: 0.81, danceability: 0.45},
		{song: "Landslide", artist: "Fleetwood Mac", genre: "Rock", acousticness: 0.88, danceability: 0.21},
		{song: "She's Always a Woman", artist: "Billy Joel", genre: "Rock", acousticness: 0.90, danceability: 0.15},
		{song: "Another Story", artist: "The Head and the Heart", genre: "Indie", acousticness: 0.72, danceability: 0.18},
		{song: "The Ancestor", artist: "Darlingside", genre: "Indie", acousticness: 0.89, danceability: 0.13},
		{song: "The Company We Keep", artist: "Darlingside", genre: "Indie", acousticness: 0.64, danceability: 0.23}
	];

	console.log(data.length);
	console.log(data);

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


	// draw viz for the first time (song view)
	updateViz();

	// groupSong();

	// groupGenre();

	// groupArtist();


	function updateViz () {

		// get user's category selection
		var browseType = selectBrowseType.property("value");

		console.log(browseType);

		// initialize dynamic data & variables
		var display_data;

		var radius = d3.scaleSqrt();

		// initialize force simulation
		var simulation = d3.forceSimulation()
			.force("x", d3.forceX(width / 2).strength(0.05))
			.force("y", d3.forceY(height / 2).strength(0.05))
			.force("collide", d3.forceCollide(function(d) { 
				return radius(d.value) + 5; 
			}));

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

	    // user toggle among rollup views
		if (browseType == "song") {

			// group data by song
		    var song = d3.nest()
		        .key(function(d) { return d.song; })
		        .rollup(function(v) { return v.length; })
		        .entries(data);

			display_data = song;

			// scale radius (constant for song view)
	    	radius
	        	.domain([1,2])
	        	.range([20,20]);

		}

		else if (browseType == "artist") {

			// group data by artist
		    var artist = d3.nest()
		        .key(function(d) { return d.artist; })
		        .rollup(function(v) { return v.length; })
		        .entries(data);

		    console.log(artist);
		    console.log(artist.length);

		    display_data = artist;

			// scale radius by artist group size
	    	radius
	        	.domain(d3.extent(artist, (d) => { return d.value; })).nice()
	        	.range([20, 100]);

		}

		else {
		
			// group data by genre
		    var genre = d3.nest()
		        .key(function(d) { return d.genre; })
		        .rollup(function(v) { return v.length; })
		        .entries(data);

		    console.log(genre);
		    console.log(genre.length);

		    display_data = genre;

			// scale radius by genre group size
	    	radius
	        	.domain(d3.extent(genre, (d) => { return d.value; })).nice()
	        	.range([20, 100]);

		};


		// call force simulation
		simulation.nodes(display_data)
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


		// append bubbles to svg
		var circles = svg.selectAll(".bubble")
			.data(display_data)
			.join(
				enter => enter
					.append("circle")
					.attr("class", "bubble")
					.attr("r", function(d) { return radius(d.value); })
					.attr("fill", d => {

						if (browseType == "song") {
							return "purple"
						}
						else if (browseType == "artist") {
							return "gold"
						}
						else {
							return "lightblue"
						}
					}),
				update => update
					.transition()
					.attr("r", function(d) { return radius(d.value); })
					.attr("fill", d => {

						if (browseType == "song") {
							return "purple"
						}
						else if (browseType == "artist") {
							return "gold"
						}
						else {
							return "lightblue"
						}
					}),
				exit => exit.remove()
				)
			.on("mouseover", showTooltip)
			.on("mousemove", moveTooltip)
			.on("mouseleave", hideTooltip);

		circles
			.on("click", d => {

				var filtered_data;

				if (browseType == "artist" || browseType == "genre") {
					filtered_data = data.filter(v => { 
						console.log(d.key) 
	                    return d.key == v.data.key; 
	                })

					console.log(filtered_data)

                	updateViz(filtered_data)
				}
				else { 
					// browseType == "song"
					// click out to detailed viz
				}

            });

	}





////////////// SEPARATE FUNCTIONS //////////////
////////////////// not in use //////////////////


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

////////////////////////////////////////////////


})();

