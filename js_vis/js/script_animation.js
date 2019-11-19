'use strict';

{ // start scope

// localhost:8000

// let csvFileName = "SevenNationArmy.csv"
let csvFileName = "../py/harmonic_result.csv"

// let mediaName = "SevenNationArmy.mp3"
let mediaName = "../data/TheCatConcerto.mp4"

//------------------------------------------------------------
// return an index such that csvData[0, index - 1] is used for visualization
//------------------------------------------------------------
function findUpperBoundTimeIndex(currentTimeInSec, csvData)
{
    let index = 0;

    for(; index < csvData.length; ++index)
    {
        let rowTime = parseFloat(csvData[index]["note_time"]) / 1000.0;
        if (currentTimeInSec < rowTime)
        {
            break;
        }
    }

    return index;
}

//------------------------------------------------------------
//------------------------------------------------------------
function findExtrema(myData)
{
    let minOctave = 100000;
    let maxOctave = 0;
    let minCount  = 100000;
    let maxCount  = 0;

    for(let i = 0; i < myData.length; ++i)
    {
        for(let j = 0; j < myData[i].values.length; ++j)
        {
            let octave = parseFloat(myData[i].values[j].key);
            if(octave < minOctave)
            {
                minOctave = octave;
            }

            if(octave > maxOctave)
            {
                maxOctave = octave;
            }

            let count = myData[i].values[j].value;

            if(count < minCount)
            {
                minCount = count;
            }

            if(count > maxCount)
            {
                maxCount = count;
            }
        }
    }

    return {"minOctave" : minOctave,
            "maxOctave" : maxOctave,
            "minCount"  : minCount ,
            "maxCount"  : maxCount};

}

//------------------------------------------------------------
// predefine color schemes
//------------------------------------------------------------
function pickColor(index)
{
    // const predefinedColors = ["#e6194b",
                              // "#f58231",
                              // "#ffe119",
                              // "#bfef45",
                              // "#3cb44b",
                              // "#42d4f4",
                              // "#4363d8",
                              // "#911eb4",
                              // "#f032e6",
                              // "#aaffc3",
                              // "#e6beff",
                              // "#fabebe"];

    const predefinedColors = ["#1e7c4b",
                            "#8ec13d",
                            "#c7e254",
                            "#f9db65",
                            "#ecbc39"];

    let colorIdx = index % predefinedColors.length;
    return predefinedColors[colorIdx];
}

//------------------------------------------------------------
//------------------------------------------------------------
function MusicPlot()
{
    this.checkBox = document.querySelector("#my-check-box");
    this.checkBox.checked = true;

    this.margin = {top: 30, right: 30, bottom: 30, left: 30};
    this.totalWidth = 300;
    this.totalHeight = 150;
    this.fullPlotWidth = 800;
    this.fullPlotHeight = 800;
    this.width  = this.totalWidth  - this.margin.left - this.margin.right;
    this.height = this.totalHeight - this.margin.top  - this.margin.bottom;

    this.extrema = null;
    this.extremaCached = null;

    this.xScale = null;
    this.yScale = null;
    this.xAxis  = null;
    this.yAxis  = null;
    this.areaGenerator = null;
    this.svgTop = null;
    this.mySvgs = null;
    this.myGroups = null;
    this.myData = null;
    this.plotCollection = null;
    this.myText = null;

    this.numHalfGaussian = 20;
    this.binSize = 0.02;
    this.numOctave = -1;
    this.numElementPerOctave = -1;

    this.totalMusicTimeInSec = 0.0;

    this.debugCounter = 0;

    this.colorWhenUpdated = "#000000";
    this.colorWhenNotUpdated = "#f58231";

    //------------------------------------------------------------
    // selectedData
    //     key
    //     values
    //         key
    //         value
    //
    // this.myData
    //     "noteName"
    //     "noteUpdated"
    //     "octaveList"
    //         "octaveMain"
    //         "countMain"
    //         "octaveUpdated"
    //         "octaveData"
    //             "octavePoint"
    //             "count"
    //------------------------------------------------------------
    this.initializeData = (selectedData) => {
        this.myData = new Array(selectedData.length).fill(null);

        // preallocate
        this.myData.forEach((d, i, dArraySelf) => {
            let dObj = {};
            dObj["noteName"] = selectedData[i].key;

            dObj["noteUpdated"] = false;

            let octaveList = new Array(this.numOctave).fill(null);
            octaveList.forEach((dd, j, ddArraySelf) => {
                let ddObj = {};

                ddObj["octaveMain"] = this.extrema.minOctave + j;
                ddObj["countMain"]  = 0;
                ddObj["octaveUpdated"] = false;

                let octaveData = new Array(this.numElementPerOctave).fill(null);
                octaveData.forEach((ddd, k, dddArraySelf) => {
                    let dddObj = {};

                    dddObj["octavePoint"] = ddObj["octaveMain"] + (k - this.numHalfGaussian) * this.binSize;
                    dddObj["count"] = 0;

                    dddArraySelf[k] = dddObj;
                });

                ddObj["octaveData"] = octaveData;

                ddArraySelf[j] = ddObj;
            });

            dObj["octaveList"] = octaveList;

            dArraySelf[i] = dObj;
        });

        this.gaussianizeData(selectedData);
    };

    //------------------------------------------------------------
    // selectedData
    //     key
    //     values
    //         key
    //         value
    //
    // this.myData
    //     "noteName"
    //     "noteUpdated"
    //     "octaveList"
    //         "octaveMain"
    //         "countMain"
    //         "octaveUpdated"
    //         "octaveData"
    //             "octavePoint"
    //             "count"
    //------------------------------------------------------------
    this.gaussianizeData = (selectedData) => {
        // zero
        this.myData.forEach((d, i, dSelfArray) => {
            dSelfArray[i]["noteUpdated"] = false;
            d["octaveList"].forEach((dd, j, ddSelfArray) => {
                ddSelfArray[j]["octaveUpdated"] = false;
                dd["octaveData"].forEach((ddd) => {
                    ddd["count"] = 0;
                });
            });
        });

        // gaussianize
        selectedData.forEach((dSelected) => {
            let elRef = this.myData.find((dMy) => {
                return dMy["noteName"] == dSelected.key;
            });

            // according to Array.find(), if the target is not found, elRef is undefined
            if(elRef !== undefined)
            {
                dSelected.values.forEach((dx) => {
                    let elRef2 = elRef["octaveList"].find((ddMy) => {
                        return ddMy["octaveMain"].toString() == dx.key;
                    });

                    if(elRef2 !== undefined)
                    {
                        if(dx.value != elRef2["countMain"])
                        {
                            elRef2["octaveUpdated"] = true;
                        }

                        elRef2["countMain"] = dx.value;

                        let idx = 0;
                        for(let k = -this.numHalfGaussian; k <= this.numHalfGaussian; ++k)
                        {
                            let up = elRef2["octaveData"][idx]["octavePoint"] - elRef2["octaveMain"];
                            up = up * up;
                            const sigma = 0.1;
                            let down = 2.0 * sigma * sigma;
                            let temp = - up / down;
                            let currentCount = elRef2["countMain"] * Math.exp(temp);

                            elRef2["octaveData"][idx]["count"] = currentCount;
                            ++idx;
                        }

                    }
                });

                // the some() method tests whether at least one element in the array passes
                // the test implemented by the provided function. It returns a Boolean value.
                elRef["noteUpdated"] = elRef["octaveList"].some((d) => {
                    return d["octaveUpdated"];
                });
            }
        });
    };

    //------------------------------------------------------------
    //------------------------------------------------------------
    this.initializePlot = (csvRawData) => {
        // initialize plot
        // myData transforms data into the following form:
        // note_name --- octave --- count
        // both note_name and octave are sorted in ascending order
        let selectedData = d3.nest()
            .key((d) => { return d.note_name;}).sortKeys(d3.ascending)
            .key((d) => { return parseFloat(d.octave);}).sortKeys(d3.ascending)
            .rollup((leaves) => {
                return d3.sum(leaves, (d) => {
                    return d.magnitude;
                });
            })
            .entries(csvRawData);

        console.log(selectedData);

        // get total music time
        this.totalMusicTimeInSec = parseFloat(csvRawData[csvRawData.length - 1]["note_time"]) / 1000.0;

        // get global min and max octave and count values
        this.extrema = findExtrema(selectedData);
        this.extremaCached = {"minOctave" : this.extrema.minOctave ,
                              "maxOctave" : this.extrema.maxOctave ,
                              "minCount"  : this.extrema.minCount  ,
                              "maxCount"  : this.extrema.maxCount  };



        this.numOctave = this.extrema.maxOctave - this.extrema.minOctave + 1;
        this.numElementPerOctave = 2 * this.numHalfGaussian + 1;

        this.initializeData(selectedData);

        this.xScale = d3.scaleLinear()
                       .domain([this.extrema.minOctave, this.extrema.maxOctave])
                       .range([0, this.width]);

        this.yScale = d3.scaleLinear()
                       .domain([0, this.extrema.maxCount])
                       .range([this.height, 0]);

        // axis
        this.xAxis = d3.axisBottom(this.xScale)
                    .ticks(this.numOctave);
        this.yAxis = d3.axisLeft(this.yScale);

        // // this.areaGenerator = d3.line()
                        // // .x((d) => {
                            // // return this.xScale(parseFloat(d.key));
                        // // })
                        // // .y((d) => {
                            // // return this.yScale(d.value);
                        // // });

        // here the d parameter in (d) refers to the element
        //             "octavePoint"
        //             "count"
        this.areaGenerator = d3.area()
                        .x((d) => {
                            return this.xScale(parseFloat(d["octavePoint"]));
                        })
                        .y1((d) => {
                            return this.yScale(d["count"]);
                        })
                        .y0(this.yScale(0.0));

        this.svgTop = d3.select("#plot-div")
                    .append("svg")
                    .attr("width", this.fullPlotWidth)
                    .attr("height", this.fullPlotHeight);

        this.mySvgs = this.svgTop.selectAll("g").data(this.myData);

        this.myGroups = this.mySvgs
            .enter()
            .append("g")
              .attr("class", "noteName")
              .attr("width", this.totalWidth)
              .attr("height", this.totalHeight)
              .attr("transform", (d, i) => {
                    let rotateAngle = 360.0 / this.myData.length * i;
                    let xTranslate = this.fullPlotWidth / 2;
                    let yTranslate = this.fullPlotHeight / 2 - this.totalHeight;
                    return "translate(" + xTranslate + ", " + yTranslate + ") rotate(" + rotateAngle +" 0 " + this.totalHeight + ")";
              });

        this.myText = this.myGroups.append("text")
              .attr("class", "axisLabel")
              .text((d) => {
                  return d["noteName"];
              })
              .attr("transform", "translate(" + this.totalWidth + "," + (this.margin.top + this.height) + ")");

        this.myGroups.append("g")
              .attr("class", "xAxis")
              .attr("transform", "translate(" + this.margin.left + "," + (this.margin.top + this.height) + ")")
              .call(this.xAxis);

        // set up plotCollection
        // here the d parameter in (d) refers to the element
        //     "noteName"
        //     "noteUpdated"
        //     "octaveList"
        //         "octaveMain"
        //         "countMain"
        //         "octaveUpdated"
        //         "octaveData"
        //             "octavePoint"
        //             "count"
        this.plotCollection = this.myGroups.append("g")
                              .attr("class", "plot")
                              .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
                            .selectAll("path")
                            .data((d) => {
                                return d["octaveList"];
                            })
                            .enter()
                            .append("path");

        let domResult = document.querySelector("#plot-div");
        console.log(domResult);

        // set up plotCollection
        // here the d parameter in (d) refers to the element
        //         "octaveMain"
        //         "countMain"
        //         "octaveUpdated"
        //         "octaveData"
        //             "octavePoint"
        //             "count"
        this.plotCollection.attr("d", (d, i) => { // define path details https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
                        let pathData = this.areaGenerator(d["octaveData"]);
                        return pathData;
                    })
                .attr("stroke", (d, i) => { // each line is assigned a predefined color
                    if(d["octaveUpdated"])
                    {
                        return this.colorWhenUpdated;
                    }
                    else
                    {
                        return pickColor(i);
                    }
                })
                .attr("stroke-width", 1)
                .attr("fill", (d, i) => { // each line is assigned a predefined color
                    if(d["octaveUpdated"])
                    {
                        return this.colorWhenUpdated;
                    }
                    else
                    {
                        return pickColor(i);
                    }
                })
                // .attr("fill", "none")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round");
    };

    //------------------------------------------------------------
    //------------------------------------------------------------
    this.updatePlot = (csvNewData) => {
        let selectedData = d3.nest()
            .key((d) => { return d.note_name;}).sortKeys(d3.ascending)
            .key((d) => { return parseFloat(d.octave);}).sortKeys(d3.ascending)
            .rollup((leaves) => {
                return d3.sum(leaves, (d) => {
                    return d.magnitude;
                });
            })
            .entries(csvNewData);

        if(!this.checkBox.checked)
        {
            // get global min and max octave and count values
            let result = findExtrema(selectedData);
            this.extrema.minCount = result.minCount;
            this.extrema.maxCount = result.maxCount;
        }
        else
        {
            this.extrema.minCount = this.extremaCached["minCount" ];
            this.extrema.maxCount = this.extremaCached["maxCount" ];
        }

        this.gaussianizeData(selectedData);

        this.yScale = d3.scaleLinear()
                       .domain([0, this.extrema.maxCount])
                       .range([this.height, 0]);

        this.mySvgs.data(this.myData);

        this.plotCollection.attr("d", (d, i) => { // define path details https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
                        let pathData = this.areaGenerator(d["octaveData"]);
                        return pathData;
                    })
                .attr("stroke", (d, i) => { // each line is assigned a predefined color
                    if(d["octaveUpdated"])
                    {
                        return this.colorWhenUpdated;
                    }
                    else
                    {
                        return pickColor(i);
                    }
                })
                .attr("fill", (d, i) => { // each line is assigned a predefined color
                    if(d["octaveUpdated"])
                    {
                        return this.colorWhenUpdated;
                    }
                    else
                    {
                        return pickColor(i);
                    }
                });

        this.myText.attr("font-size", (d) => {
                        if(d["noteUpdated"])
                        {
                            return "40px";
                        }
                        else
                        {
                            return "20px";
                        }
                    })
                    .attr("font-weight", (d) => {
                        if(d["noteUpdated"])
                        {
                            return "bold";
                        }
                        else
                        {
                            return "normal";
                        }
                    });
    }
}

//------------------------------------------------------------
//------------------------------------------------------------
function AnimationController()
{
    this.fpsText              = document.querySelector("#fps");
    this.timeElapsedText      = document.querySelector("#time-elapsed");
    this.systemSampleRateText = document.querySelector("#system-sample-rate");
    this.timeStart              = null;
    this.timeElapsedInMillisec  = 0.0;
    this.timeIntervalInMillisec = 0.0;
    this.timeOld                = 0.0;
    this.musicLengthText      = document.querySelector("#music-length");

    this.plotRefreshRate = 10;
    this.plotRefreshTimeInMillisec = 1.0 / this.plotRefreshRate * 1000.0;
    this.plotRefreshAccumulatedTimeInMillisec = 0.0;

    this.update = (timeStamp) => {
        if(!this.timeStart) {
            this.timeStart = timeStamp;
        }

        this.timeElapsedInMillisec = timeStamp - this.timeStart;
        this.timeElapsedText.textContent = (this.timeElapsedInMillisec / 1000.0).toFixed(1);

        this.timeIntervalInMillisec = timeStamp - this.timeOld;
        this.fpsText.textContent = (1.0 / this.timeIntervalInMillisec * 1000.0).toFixed(0);
        this.timeOld = timeStamp;

        this.plotRefreshAccumulatedTimeInMillisec += this.timeIntervalInMillisec;
    };

    this.canPlayAnimation = () => {
        if(this.plotRefreshAccumulatedTimeInMillisec > this.plotRefreshTimeInMillisec)
        {
            this.plotRefreshAccumulatedTimeInMillisec = 0.0;
            return true;
        }
        else
        {
            return false;
        }
    };
}

//------------------------------------------------------------
//------------------------------------------------------------
function MediaController(fileName)
{
    this.mediaEle = document.querySelector("#my-media");
    this.mediaEle.src = fileName;
    this.mediaEle.autoplay = false;
    this.mediaEle.preload = 'auto';
}

//------------------------------------------------------------
//------------------------------------------------------------
window.addEventListener("load", (event) => {
    let myBtn = document.querySelector("#start");
    myBtn.disabled = true;

    const mediaC = new MediaController(mediaName);
    mediaC.mediaEle.addEventListener("canplaythrough", (event) => {
        myBtn.disabled = false;
    });

    const musicPlot = new MusicPlot();

    const ac = new AnimationController();

    myBtn.addEventListener("click", (event) => {
        myBtn.textContent = "loading ...";

        // asynchronous function, returns immediately
        let temp = d3.csv(csvFileName);

        // once the large csv file is loaded into memory
        temp.then((csvRawData) => {
            myBtn.textContent = "loaded"
            mediaC.mediaEle.play();

            musicPlot.initializePlot(csvRawData);

            ac.musicLengthText.textContent = musicPlot.totalMusicTimeInSec.toFixed(1);

            function startAnalysis(timeStamp) {
                ac.update(timeStamp);

                let index = findUpperBoundTimeIndex(ac.timeElapsedInMillisec / 1000.0, csvRawData);
                let csvNewData = csvRawData.slice(0, index);

                // update plot at specified refresh rate
                if(ac.canPlayAnimation())
                {
                    musicPlot.updatePlot(csvNewData);
                }

                // play animation if music has not ended
                if(ac.timeElapsedInMillisec < musicPlot.totalMusicTimeInSec * 1000)
                {
                    requestAnimationFrame(startAnalysis);
                }
            }

            window.requestAnimationFrame(startAnalysis);
        }); // end then()
    }); // end button addEventListener()
}); // end window addEventListener()

} // end scope

