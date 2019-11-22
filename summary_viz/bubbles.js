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
		{song: "Tim McGraw", artist: "Live Like You Were Dying", genre: "Country"},
		{song: "Fur Elise", artist: "Beethoven", genre: "Classical"},
		{song: "Eine Kleine Nachtmusik", artist: "Mozart", genre: "Classical"},
		{song: "Before He Cheats", artist: "Carrie Underwood", genre: "Country"},
		{song: "What a Wonderful World", artist: "Louis Armstrong", genre: "Jazz"}
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


	// group data by genre
    var genre = d3.nest()
        .key(function(d) { return d.genre; })
        .rollup(function(v) { return v.length; })
        .entries(data);

    console.log(genre);


	// map each genre to a color
    var color = d3.scaleOrdinal()
        .domain(genre.keys()) 
        .range(["gold", "lightgreen", "red", "orange", "purple", "green", "blue", "pink", "lightblue", "navy"]);


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


	createViz(genre);


	function createViz () {

        // append bubbles to svg
        // colored by genre and scaled by song count
		var circles = svg.selectAll(".bubble")
			.data(genre)
			.enter()
			.append("circle")
			.attr("class", "bubble")
			.attr("r", function(d) { return radius(d.value); })
			.style("fill", function(d) { return color(d.key); })
		
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

})();


// https://www.youtube.com/watch?v=lPr60pexvEM

