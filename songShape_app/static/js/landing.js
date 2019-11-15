"use strict";
(() => {
  const windowWidth = +window.innerWidth;
  const windowHeight = +window.innerHeight;
  const containerMargin = {
    top: windowHeight * 0.05,
    right: windowWidth * 0.05,
    bottom: windowHeight * 0.05,
    left: windowWidth * 0.05
  };
  const chartSpace = d3
    .select("#chartSpace")
    .attr("width", `${windowWidth}px`)
    .attr("height", `${windowHeight}px`);
  let data = [];
  // d3.json().then(
  launchD3();
  // );
  function launchD3() {
    welcome();
  }
  function welcome() {
    console.log(windowHeight, windowWidth);
    var welcomeGroup = chartSpace
      .append("div")
      .attr("id", "welcomeGroup")
      .style("transform", `translate(0,${windowHeight / 2}px)`);

    welcomeGroup
      .append("h1")
      .text("What does a song look like?")
      .attr("text-align", "left")
      .style("opacity", "0")
      .transition()
      .duration(2000)
      .style("opacity", "1");

    welcomeGroup
      .append("p")
      .text(
        "That's the riddle we set out to answer with this project. Through many different trials and iterations, this site is our attempt to share what we found with you. \n\nScroll down to begin."
      )
      .attr("text-align", "left")
      .style("opacity", "0")
      .transition()
      .duration(4000)
      .style("opacity", "1");
  }
})();
