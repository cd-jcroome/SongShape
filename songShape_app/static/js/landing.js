"use strict";
(() => {
  const scroller = scrollama();
  const windowWidth = +window.innerWidth;
  const windowHeight = +window.innerHeight;
  const containerMargin = {
    top: windowHeight * 0.05,
    right: windowWidth * 0.05,
    bottom: windowHeight * 0.05,
    left: windowWidth * 0.05
  };
  var stepHeight = windowHeight;
  var stepWidth = windowWidth * 0.95;

  const chartSpace = d3
    .select("#scroll")
    .attr("width", `${windowWidth}px`)
    .attr("height", `${windowHeight}px`);
  var text = chartSpace.select(".scroll__text");
  var step = text.selectAll(".step");

  let data = [];
  // d3.json().then(
  launchD3();
  // );
  function launchD3() {
    buildSections();

    init();
  }
  function welcome() {
    var welcomeText = welcomeGroup
      .append("g")
      .style("transform", `translate(0,${windowHeight / 2}px)`);

    welcomeText
      .append("h1")
      .text("What does a song look like?")
      .attr("text-align", "left")
      .style("opacity", "0")
      .transition()
      .duration(2000)
      .style("opacity", "1");

    welcomeText
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
  function methodology() {}
  function legend() {}
  function universe() {}

  function buildSections() {
    var welcomeGroup = chartSpace
      .append("div")
      .attr("id", "welcomeGroup")
      .attr("class", "step")
      .attr("data-step", "a")
      .style("height", `${stepHeight}px`)
      .style("width", `${stepWidth}px`);

    var methodologyGroup = chartSpace
      .append("div")
      .attr("id", "methodology Group")
      .attr("class", "step")
      .attr("data-step", "b")
      .style("height", `${stepHeight}px`)
      .style("width", `${stepWidth}px`);

    var legendGroup = chartSpace
      .append("div")
      .attr("id", "legendGroup")
      .attr("class", "step")
      .attr("data-step", "c")
      .style("height", `${stepHeight}px`)
      .style("width", `${stepWidth}px`);

    var universeGroup = chartSpace
      .append("div")
      .attr("id", "universeGroup")
      .attr("class", "step")
      .attr("data-step", "d")
      .style("height", `${stepHeight}px`)
      .style("width", `${stepWidth}px`);
  }

  function handleStepEnter(response) {
    // response = { element, direction, index }
    switch (response.index) {
      case 0: // welcome
        welcome();
        break; // methodology
      case 1:
        break; // legend
      case 2:
        break; // universe viz
      case 3:
        break;
      case 4:
        break;
    }
  }

  function handleContainerEnter(response) {
    // response = { direction }
  }

  function handleContainerExit(response) {
    // response = { direction }
  }

  function setupStickyfill() {
    d3.selectAll(".sticky").each(function() {
      Stickyfill.add(this);
    });
  }

  function init() {
    setupStickyfill();

    // 1. force a resize on load to ensure proper dimensions are sent to scrollama
    handleResize();

    // 2. setup the scroller passing options
    // this will also initialize trigger observations
    // 3. bind scrollama event handlers (this can be chained like below)
    scroller
      .setup({
        container: "#scroll",
        graphic: ".scroll__graphic",
        text: ".scroll__text",
        step: ".scroll__text .step",
        offset: ".74",
        debug: false
      })
      .onStepEnter(handleStepEnter)
      .onContainerEnter(handleContainerEnter)
      .onContainerExit(handleContainerExit);
    // setup resize event
    window.addEventListener("resize", handleResize);
  }
})();
