var container = d3.select("#staticBody");

var margin = { top: window.innerWidth * 0.14, right: 80, bottom: 60, left: 80 };

container
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("position", "absolute")
  .style("text-align", "center")
  .style("background", "whitesmoke")
  .style("padding", "8px")
  .style("border-radius", "8px")
  .style("pointer-events", "none")
  .style("z-index", "9999");

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
  "https://raw.githubusercontent.com/Jasparr77/hobby-dataviz-d3/master/songShape/output/SevenNationArmy.csv",
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
    var instruments = [
      "Overdriven Guitar",
      "Distortion Guitar",
      "Lead 2 (sawtooth)",
      "Electric Bass (pick)",
      "Drums"
    ];
    var color = d3
      .scaleOrdinal()
      .domain(instruments)
      .range(["#FF0000", "#FF0000", "#CC0066", "#000", "#FFF"]);

    var opacity = d3
      .scaleOrdinal()
      .domain(instruments)
      .range([".1", ".1", ".1", ".1", "0"]);

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
        return d[""] + "|" + d["instrument"];
      })
      .rollup(function(leaves) {
        return {
          x: d3.sum(leaves, function(d) {
            return (
              Math.sin(anglePrep(d["angle"])) * (1 - 0.1 * Number(d["octave"]))
            );
          }), // x coordinate for note
          y: d3.sum(leaves, function(d) {
            return (
              Math.cos(anglePrep(d["angle"])) * (1 - 0.1 * Number(d["octave"]))
            );
          }), // y coordinate for note
          channel: d3.max(leaves, function(d) {
            return Number(d["channel"]);
          }),
          time: d3.max(leaves, function(d) {
            return Number(d["note_seconds"]);
          })
        };
      })
      .entries(data);

    var lineData = d3
      .nest()
      .key(function(d) {
        return d["channel_chunk"] + "|" + d["instrument"];
      })
      .key(function(d) {
        return d[""];
      })
      .rollup(function(leaves) {
        return {
          x: d3.sum(leaves, function(d) {
            return (
              Math.sin(anglePrep(d["angle"])) * (1 - 0.1 * Number(d["octave"]))
            );
          }), // x coordinate for note
          y: d3.sum(leaves, function(d) {
            return (
              Math.cos(anglePrep(d["angle"])) * (1 - 0.1 * Number(d["octave"]))
            );
          }), // y coordinate for note
          channel: d3.max(leaves, function(d) {
            return Number(d["channel"]);
          }),
          time: d3.max(leaves, function(d) {
            return Number(d["note_seconds"]);
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
        return x(Math.sin(anglePrep(d["angle"])) * 0.95);
      })
      .attr("y", function(d) {
        return y(Math.cos(anglePrep(d["angle"])) * 0.95);
      })
      .text(function(d) {
        return d["note_name"];
      });
    // add circles

    chartGroup
      .selectAll(".circleFifths")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "circleFifths")
      .attr("cx", x(0))
      .attr("cy", y(0))
      .attr("r", function(d) {
        return (xRange / 2) * (1 - 0.1 * Number(d["octave"]));
      })
      .attr("fill", "none")
      .attr("text", function(d) {
        return d["octave"];
      })
      .attr("stroke", "lightgrey")
      .attr("opacity", 1)
      .attr("stroke-width", ".02vw");

    //   shapes
    chartGroup
      .selectAll(".line")
      .data(lineData)
      .enter()
      .append("path")
      .attr("class", function(d) {
        return d["key"] + " songPath";
      })
      .attr("d", function(d) {
        return songPath(d.values);
      })
      .attr("fill", function(d) {
        return color(d["key"].split("|")[1]);
      })
      .attr("fill-opacity", 0)
      .attr("stroke", function(d) {
        return color(d["key"].split("|")[1]);
      })
      .attr("stroke-opacity", function(d) {
        return opacity(d["key"].split("|")[1]);
      })
      .attr("stroke-width", ".25vw")
      .on("mouseover", function(d) {
        d3.select(this)
          .attr("stroke-opacity", 0.8)
          .attr("stroke-width", "1vw");
        div
          .transition()
          .duration(400)
          .style("opacity", 0.9);
        div
          .html(d["key"].split("|")[1])
          .style("left", d3.event.pageX - margin.left + "px")
          .style("top", d3.event.pageY - margin.bottom + "px");
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .attr("stroke-opacity", 0.25)
          .attr("stroke-width", ".05vw");
        div
          .transition()
          .duration(400)
          .style("opacity", 0);
      });

    //   dots
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
      .attr("fill", function(d) {
        return color(d["key"].split("|")[1]);
      })
      .attr("fill-opacity", 0.2)
      .attr("stroke", "none")
      .transition()
      .delay(function(d) {
        return d.value["time"] * 1000;
      })
      .attr("fill-opacity", 1)
      .attr("stroke", "white")
      .attr("stroke-width", ".04vw")
      .attr("r", ".6vw")
      .transition()
      .attr("fill-opacity", "0")
      .attr("stroke", "none")
      .attr("r", ".2vw");

    chartGroup
      .append("rect")
      .attr("x", 0)
      .attr("y", yRange - 74)
      .attr("height", 74)
      .attr("width", 90)
      .attr("fill", "grey");
    chartGroup
      .append("text")
      .style("font-size", "24px")
      .attr("x", 1)
      .attr("y", yRange - 50)
      .style("fill", "lightgrey")
      .text("Legend");
    chartGroup
      .append("text")
      .attr("x", 2)
      .attr("y", yRange - 35)
      .style("fill", "black")
      .text("Bass");
    chartGroup
      .append("text")
      .attr("x", 2)
      .attr("y", yRange - 20)
      .style("fill", "red")
      .text("Lead Guitar");
    chartGroup
      .append("text")
      .attr("x", 2)
      .attr("y", yRange - 5)
      .style("fill", "white")
      .text("Drums");
  }
);
// https://math.stackexchange.com/questions/260096/find-the-coordinates-of-a-point-on-a-circle
