var container = d3.select("#staticBody");

var margin = { top: window.innerWidth * 0.14, right: 80, bottom: 60, left: 80 };

container.append("svg").attr("class", "chart");

var tooltip = d3.select(".tooltip");
var formHolder = d3.select("#formholder");
var chartGroup = d3.select(".chart");

function handleResize() {
  bodyWidth = Math.floor(window.innerWidth * 0.95);
  bodyHeight = Math.floor(window.innerHeight * 0.8);

  minDim = Math.min(bodyWidth, bodyHeight);

  yRange = minDim / 1.25;
  xRange = minDim / 1.25;

  chartGroup.style("width", xRange + "px").style("height", yRange + 40 + "px");

  div = d3
    .select("#staticBody")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("text-align", "center")
    .style("background", "whitesmoke")
    .style("padding", "8px")
    .style("border-radius", "8px")
    .style("pointer-events", "none");
}
d3.csv(
  "https://raw.githubusercontent.com/Jasparr77/hobby-dataviz-d3/dev/" +
    "songShape/output/librosa/BrettDennen_DesertSunrise.csv",
  function(data) {
    console.log(data);
    handleResize();

    var x = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([0, xRange]);

    var y = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([yRange, 0]);

    var songPath = d3
      .line()
      .curve(d3.curveNatural)
      .x(function(d) {
        return x(d.value["x"]);
      })
      .y(function(d) {
        return y(d.value["y"]);
      });

    var noteDataScale = d3
      .scaleOrdinal()
      .domain([
        "C",
        "C#/Db",
        "D",
        "D#/Eb",
        "E",
        "F",
        "F#/Gb",
        "G",
        "G#/Ab",
        "A",
        "A#/Bb",
        "B"
      ])
      .range([0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]);

    var noteData = [
      { note_name: "C", angle: 0 },
      { note_name: "G", angle: 30 },
      { note_name: "D", angle: 60 },
      { note_name: "A", angle: 90 },
      { note_name: "E", angle: 120 },
      { note_name: "B", angle: 150 },
      { note_name: "F#", angle: 180 },
      { note_name: "C#", angle: 210 },
      { note_name: "G#", angle: 240 },
      { note_name: "D#", angle: 270 },
      { note_name: "A#", angle: 300 },
      { note_name: "F", angle: 330 }
    ];

    anglePrep = function(d) {
      return (d / 180) * Math.PI;
    };

    var pointData = d3
      .nest()
      .key(function(d) {
        return d["Note"] + "|" + d["Time"];
      })
      .rollup(function(leaves) {
        return {
          x: d3.sum(leaves, function(d) {
            // x coordinate for note
            return Math.sin(anglePrep(noteDataScale(d["Note"]))) * d["value"];
          }),
          y: d3.sum(leaves, function(d) {
            // y coordinate for note
            return Math.cos(anglePrep(noteDataScale(d["Note"]))) * d["value"];
          }),
          strength: d3.sum(leaves, function(d) {
            return d["value"];
          }),
          time: d3.sum(leaves, function(d) {
            return d["Time"];
          })
        };
      })
      .entries(data);

    lastRecord = data.length - 1;

    chartGroup
      .selectAll(".notePoint")
      .data(noteData)
      .enter()
      .append("text")
      .attr("class", "notePoint")
      .attr("dy", ".31em")
      .attr("x", function(d) {
        return x(Math.sin(anglePrep(d["angle"])));
      })
      .attr("y", function(d) {
        return y(Math.cos(anglePrep(d["angle"])));
      })
      .text(function(d) {
        return d["note_name"];
      });

    // dots
    chartGroup
      .selectAll(".noteCircle")
      .data(pointData)
      .enter()
      .append("circle")
      .attr("class", "noteCircle")
      .attr("cx", function(d) {
        return x(d.value["x"]);
      })
      .attr("cy", function(d) {
        return y(d.value["y"]);
      })
      .attr("r", ".3vw")
      .attr("fill", "purple")
      .attr("fill-opacity", "0")
      .transition()
      .delay(function(d) {
        return d.value["time"] * 20;
      })
      .duration(20)
      .attr("fill-opacity", function(d) {
        return d.value["strength"];
      })
      // .attr("stroke", "none")
      .transition()
      .duration(20)
      .attr("fill-opacity", "0");
    // .attr("fill-opacity", 1)
    // .attr("stroke", "white")
    // .attr("stroke-width", ".04vw")
    // .attr("r", ".4vw")
    // .attr("stroke", "none")
    // .attr("r", ".2vw");
  }
);
// https://math.stackexchange.com/questions/260096/find-the-coordinates-of-a-point-on-a-circle
