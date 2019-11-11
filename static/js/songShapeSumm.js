"use strict";

(() => {
  let data = [];
  let songName = [];
  let x = [];
  let y = [];
  let color = [];
  // let songs = d3.csv("https://raw.githubusercontent.com/Jasparr77/SongShape/master/songList.csv", (songs)=>{return songs})
  let songs = [
    "AaronCopland_FanfareForTheCommonMan",
    "BenHarper_AnotherLonelyDayAcoustic",
    "Bonobo_BambroKoyoGanda",
    "Bonobo_Jets",
    "Bonobo_Kerala",
    "Bonobo_Migration",
    "Bonobo_TenTigers",
    "BreakOfReality_SpectrumOfTheSky",
    "BrettDennen_Blessed",
    "BrettDennen_DesertSunrise",
    "BrettDennen_She'sMine",
    "ChildishGambino_Redbone",
    "ChildishGambino_StandTall",
    "DukeEllington_Oclupaca",
    "EnnioMorricone_TheEcstasyOfGold",
    "EnnioMorricone_ThemeFromTheGood,TheBad&TheUgly",
    "Florence+TheMachine_DogDaysAreOver",
    "Flume_Helix",
    "Flume_NeverBeLikeYou",
    "HiatusKaiyote_Fingerprints",
    "HiatusKaiyote_Molasses",
    "JimiHendrix_CastlesMadeOfSand",
    "JimiHendrix_LittleWing",
    "JimiHendrix_VillanovaJunction",
    "JohnColtrane_CentralParkWest",
    "JohnColtrane_GiantSteps",
    "JohnColtrane_InASentimentalMood",
    "JohnColtrane_MyFavoriteThings",
    "LittleBrother_BeAlright",
    "LouisArmstrong_BlueberryHill",
    "LouisArmstrong_WhatAWonderfulWorld",
    "M83_AnotherWaveFromYou",
    "M83_Outro",
    "M83_SteveMcQueen",
    "Matt&Kim_Daylight",
    "MiikeSnow_Animal",
    "MiikeSnow_Black&Blue",
    "MiikeSnow_Burial",
    "MiikeSnow_SongForNoOne",
    "MyMorningJacket_VictoryDance",
    "NaiPalm_Atari",
    "NaiPalm_CrossfireSoIntoYou",
    "NaiPalm_Homebody",
    "NaiPalm_Molasses",
    "NaiPalm_WhenTheKnife",
    "StPaulAndTheBrokenBones_AllIEverWonder",
    "StPaulAndTheBrokenBones_MidnightOnTheEarth",
    "WhiteStripes_SevenNationArmy"
  ];
  let chartGroup = d3.select(".staticBody");

  let noteDataScale = d3
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

  
  for (var i = 0; i < songs.length; i++) {
    const title = songs[i];
    d3.csv(
      "https://raw.githubusercontent.com/Jasparr77/songShape/master/" +
        "/output/librosa_128/" +
        title +
        "_summ.csv",
      d => {
        return d;
      }
    )
      .then(
        d => {

        function anglePrep(d) {
          return (d / 180) * Math.PI;
        }

        // transform the data
        var pointData = d3
          .nest()
          .key(function(d) {
            return d["Note"]+"_"+d["MIDI Note"];
          })
          .rollup(function(leaves) {
            return {
              x: d3.sum(leaves, function(d) {
                // x coordinate for note
                return (
                  Math.sin(anglePrep(noteDataScale(d["Note"]))) *
                  ((d["Octave"] == 0 ? 0.05 : d["Octave"]) / 10)
                );
              }),
              y: d3.sum(leaves, function(d) {
                // y coordinate for note
                return (
                  Math.cos(anglePrep(noteDataScale(d["Note"]))) *
                  ((d["Octave"] == 0 ? 0.05 : d["Octave"]) / 10)
                );
              }),
              harmonic: d3.sum(leaves, function(d) {
                return d["Harmonic Mean"];
              }),
              percussive: d3.sum(leaves, function(d) {
                return d["Percussive Mean"];
              })
            };
          })
          .entries(d);

        launchD3(pointData, title);
      })
      .catch(err => console.error(err));
  }
// TODO: figure out best sizing for window, pass those values throush to actual d3 viz.
  function handleResize() {
    var bodyWidth = Math.floor(window.innerWidth / 4);
    var bodyHeight = Math.floor(window.innerHeight / 4);

    var minDim = Math.min(bodyWidth, bodyHeight);

    var yRange = minDim;
    var xRange = minDim;

    chartGroup.style("width", xRange + "px").style("height", yRange + "px");

    x = d3
      .scaleLinear()
      .domain([-1.1, 1.1])
      .range([0, xRange]);

    y = d3
      .scaleLinear()
      .domain([-1.1, 1.1])
      .range([yRange, 0]);

    return x, y;
  }

  function launchD3(d, title, color) {
    handleResize();

    color = d3
      .scaleSequential(d3.interpolateRainbow)

    const notes = d3.scaleLinear() 
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
      .range([color(0),color(.08333),color(.16667),color(.25),color(.33333),color(.41667),color(.5),color(.58333),color(.666667),color(.75),color(.83333),color(.9166667)])
    
    console.log(d)

    var songContainer = d3
      .selectAll("#staticBody")
      .append("svg")
      .attr("id", title)
      .attr("height", "300px")
      .attr("width", "300px");
    
    songContainer
      .selectAll(".noteCircle_p")
      .data(d)
      .enter()
      .append("circle")
      .attr("class", "noteCircle_p")
      .attr("id", d => {
        return d.key;
      })
      .attr("cx", function(d) {
        return x(d.value["x"]*2);
      })
      .attr("cy", function(d) {
        return y(d.value["y"]*2);
      })
      .attr("r", function(d) {
        return `${d.value["percussive"]}vw`;
      })
      .attr("fill", "purple")
      // .attr("stroke", "white")
      .attr("fill-opacity", function(d) {
        return d.value["percussive"];
      });

    songContainer
      .selectAll(".noteCircle_h")
      .data(d)
      .enter()
      .append("circle")
      .attr("class", "noteCircle_h")
      .attr("id", d => {
        return d.key;
      })
      .attr("cx", function(d) {
        return x(d.value["x"]*2);
      })
      .attr("cy", function(d) {
        return y(d.value["y"]*2);
      })
      .attr("r", function(d) {
        return `${d.value["harmonic"]}vw`;
      })
      .attr("fill", function(d){return notes( d.key.split("_",1))})
      .attr("stroke", function(d){return notes( d.key.split("_",1))})
      .attr("fill-opacity", function(d) {
        return d.value["harmonic"]*0.1;
      });

      songContainer
      .append("text")
      .text(title)
      .attr("transform", "translate(0,40)")
      .style("font-family","helvetica")
      .style("font-size","1vw")

  }
})();
