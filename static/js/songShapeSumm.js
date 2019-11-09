"use strict";

(() => {
  let data = [];
  let songName = [];
  let x = [];
  let y = [];
  // let songs = d3.csv("https://raw.githubusercontent.com/Jasparr77/SongShape/master/songList.csv", (songs)=>{return songs})
  let songs = [
    "AaronCopland_FanfareForTheCommonMan_summ.csv",
    "BenHarper_AnotherLonelyDayAcoustic_summ.csv",
    "Bonobo_BambroKoyoGanda_summ.csv",
    "Bonobo_Jets_summ.csv",
    "Bonobo_Kerala_summ.csv",
    "Bonobo_Migration_summ.csv",
    "Bonobo_TenTigers_summ.csv",
    "BreakOfReality_SpectrumOfTheSky_summ.csv",
    "BrettDennen_Blessed_summ.csv",
    "BrettDennen_DesertSunrise_summ.csv",
    "BrettDennen_She'sMine_summ.csv",
    "ChildishGambino_Redbone_summ.csv",
    "ChildishGambino_StandTall_summ.csv",
    "DukeEllington_Oclupaca_summ.csv",
    "EnnioMorricone_TheEcstasyOfGold_summ.csv",
    "EnnioMorricone_ThemeFromTheGood,TheBad&TheUgly_summ.csv",
    "Florence+TheMachine_DogDaysAreOver_summ.csv",
    "Flume_Helix_summ.csv",
    "Flume_NeverBeLikeYou_summ.csv",
    "HiatusKaiyote_Fingerprints_summ.csv",
    "HiatusKaiyote_Molasses_summ.csv",
    "JimiHendrix_CastlesMadeOfSand_summ.csv",
    "JimiHendrix_LittleWing_summ.csv",
    "JimiHendrix_VillanovaJunction_summ.csv",
    "JohnColtrane_CentralParkWest_summ.csv",
    "JohnColtrane_GiantSteps_summ.csv",
    "JohnColtrane_InASentimentalMood_summ.csv",
    "JohnColtrane_MyFavoriteThings_summ.csv",
    "LittleBrother_BeAlright_summ.csv",
    "LouisArmstrong_BlueberryHill_summ.csv",
    "LouisArmstrong_WhatAWonderfulWorld_summ.csv",
    "M83_AnotherWaveFromYou_summ.csv",
    "M83_Outro_summ.csv",
    "M83_SteveMcQueen_summ.csv",
    "M83SteveMcQueen_summ.csv",
    "Matt&Kim_Daylight_summ.csv",
    "MiikeSnow_Animal_summ.csv",
    "MiikeSnow_Black&Blue_summ.csv",
    "MiikeSnow_Burial_summ.csv",
    "MiikeSnow_SongForNoOne_summ.csv",
    "MyMorningJacket_VictoryDance_summ.csv",
    "NaiPalm_Atari_summ.csv",
    "NaiPalm_CrossfireSoIntoYou_summ.csv",
    "NaiPalm_Homebody_summ.csv",
    "NaiPalm_Molasses_summ.csv",
    "NaiPalm_WhenTheKnife_summ.csv",
    "StPaulAndTheBrokenBones_AllIEverWonder_summ.csv",
    "StPaulAndTheBrokenBones_MidnightOnTheEarth_summ.csv",
    "WhiteStripes_SevenNationArmy_summ.csv"
  ];
  console.log(songs);
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
      .then(d => {
        function anglePrep(d) {
          return (d / 180) * Math.PI;
        }

        var pointData = d3
          .nest()
          .key(function(d) {
            return d["MIDI Note"];
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
              mean: d3.sum(leaves, function(d) {
                return d["Mean"];
              }),
              median: d3.sum(leaves, function(d) {
                return d["Median"];
              })
            };
          })
          .entries(d);

        launchD3(pointData, title);
      })
      .catch(err => console.error(err));
  }

  function handleResize() {
    var bodyWidth = Math.floor(window.innerWidth / 10);
    var bodyHeight = Math.floor(window.innerHeight * 0.8);

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

    //   div = d3
    //     .select("#staticBody")
    //     .append("div")
    //     .attr("class", "tooltip")
    //     .style("opacity", 0)
    //     .style("position", "absolute")
    //     .style("text-align", "center")
    //     .style("background", "whitesmoke")
    //     .style("padding", "8px")
    //     .style("border-radius", "8px")
    //     .style("pointer-events", "none");
    return x, y;
  }

  function launchD3(d, title) {
    handleResize();
    var songContainer = d3
      .selectAll("#staticBody")
      .append("svg")
      .attr("id", title)
      .attr("height", "200px")
      .attr("width", "200px");
    songContainer
      .append("text")
      .text(title)
      .attr("transform", "translate(0,40)");

    songContainer
      .selectAll(".noteCircle")
      .data(d)
      .enter()
      .append("circle")
      .attr("class", "noteCircle")
      .attr("id", d => {
        return d.key;
      })
      .attr("cx", function(d) {
        return x(d.value["x"]);
      })
      .attr("cy", function(d) {
        return y(d.value["y"]);
      })
      .attr("r", function(d) {
        return `${d.value["mean"] / 2}vw`;
      })
      .attr("fill", "black")
      .attr("stroke", "white")
      .attr("fill-opacity", function(d) {
        return d.value["mean"];
      });
  }
})();
