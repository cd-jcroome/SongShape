"use strict";

(()=>{
    let data = [];
    let songName = [];
    let x =[];
    let y = [];
    // let songs = d3.csv("https://raw.githubusercontent.com/Jasparr77/SongShape/master/songList.csv", (songs)=>{return songs})
    let songs = [
        "Bonobo_BambroKoyoGanda",
        "Bonobo_Jets",
        "Bonobo_Kerala",
        "Bonobo_Migration",
        "Bonobo_TenTigers",
        "ChildishGambino_Redbone",
        "ChildishGambino_StandTall",
        "Flume_Helix",
        "Flume_NeverBeLikeYou",
        "M83_AnotherWaveFromYou",
        "M83_Outro",
        "M83SteveMcQueen",
        "NaiPalm_Atari",
        "NaiPalm_CrossfireSoIntoYou",
        "NaiPalm_Homebody",
        "NaiPalm_Molasses",
        "NaiPalm_WhenTheKnife",
        "StPaulAndTheBrokenBones_AllIEverWonder",
        "StPaulAndTheBrokenBones_MidnightOnTheEarth"
    ]
    console.log(songs)
    let chartGroup = d3.select(".staticBody")

    let noteDataScale = d3.scaleOrdinal().domain([
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
        const title = songs[i]
        d3.csv("https://raw.githubusercontent.com/Jasparr77/songShape/master/" +
        "/output/librosa_128/"+title+"_summ.csv",(d)=>{
            return d;
        }).then((d)=>{      
            
            function anglePrep(d){return (d / 180) * Math.PI;};

            var pointData = d3
            .nest()
            .key(function(d) {
              return d["MIDI Note"];
            })
            .rollup(function(leaves) {
              return {
                x: d3.sum(leaves, function(d) {
                  // x coordinate for note
                  return Math.sin(anglePrep(noteDataScale(d["Note"]))) * ((d["Octave"]==0?.05:d["Octave"])/10);
                }),
                y: d3.sum(leaves, function(d) {
                  // y coordinate for note
                  return Math.cos(anglePrep(noteDataScale(d["Note"]))) * ((d["Octave"]==0?.05:d["Octave"])/10);
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

            launchD3(pointData,title);

        }).catch(err => console.error(err))
    }
    
    function handleResize() {
        var bodyWidth = Math.floor(window.innerWidth / 10);
        var bodyHeight = Math.floor(window.innerHeight * 0.8);
      
        var minDim = Math.min(bodyWidth, bodyHeight);
      
        var yRange = minDim ;
        var xRange = minDim ;
      
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

    function launchD3(d,title){
        handleResize();
        var songContainer = d3.selectAll("#staticBody").append("svg").attr("id",title).attr("height","200px").attr("width","200px")
        songContainer.append("text").text(title).attr("transform","translate(0,40)")

        songContainer
        .selectAll(".noteCircle")
        .data(d)
        .enter()
        .append("circle")
        .attr("class", "noteCircle")
        .attr("id",d=>{
          return d.key
        })
        .attr("cx", function(d) {
          return x(d.value["x"]);
        })
        .attr("cy", function(d) {
          return y(d.value["y"]);
        })
        .attr("r", function(d) {
          return `${d.value["mean"]/2}vw`
        })
        .attr("fill", "black")
        .attr("stroke","white")
        .attr("fill-opacity", function(d) {
          return d.value["mean"];
        })
    }

})();