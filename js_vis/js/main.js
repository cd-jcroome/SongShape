'use strict';

import {findUpperBoundTimeIndex} from './utility.js';
import {AnimationController}     from './animation_controller.js';
import {MediaController}         from './media_controller.js';
import {MusicPlot}               from './music_plot.js';
import {Preprocessor}            from './preprocessor.js';

{ // start scope

// localhost:8000

let csvFileName = "../py/RobertoDiMarino_CelticSuite_harmonic_result.csv";

let mediaName = "../data/RobertoDiMarino_CelticSuite.mp3";


//------------------------------------------------------------
//------------------------------------------------------------
window.addEventListener("load", (event) => {
    let myBtn = document.querySelector("#start");
    myBtn.disabled = true;

    const mediaC = new MediaController(mediaName);
    mediaC.mediaEle.addEventListener("canplaythrough", (event) => {
        myBtn.disabled = false;
    });

    const prep = new Preprocessor();
    const musicPlot = new MusicPlot();
    const ac = new AnimationController();
    musicPlot.preprocessor = prep;

    myBtn.addEventListener("click", (event) => {
        myBtn.textContent = "loading ...";

        // asynchronous function, returns immediately
        let temp = d3.csv(csvFileName);

        // once the large csv file is loaded into memory
        temp.then((csvRawData) => {
            myBtn.textContent = "loaded";

            prep.preprocess(csvRawData, ac.plotRefreshRate);

            musicPlot.initializePlot(csvRawData);

            mediaC.mediaEle.play();

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
                else
                {
                    console.log("music plot:" + musicPlot.countIntervalMax);
                    console.log("preprocessor: " + prep.countIntervalMax);
                }
            }

            window.requestAnimationFrame(startAnalysis);
        }); // end then()
    }); // end button addEventListener()
}); // end window addEventListener()

} // end scope

