/// <reference path="./lib/addons/p5.sound.js" />
// <reference path="./TSDef/p5.global-mode.d.ts" />

//"use strict";


//-----------------------------------------------------------------------------

/*
    Hungarian variable naming notation is used with snake case separating [type]_[identifier] and camelCase used for [identifier]
*/


/* mod redefinition needed because javascript % operator returns negative integers (not positive) for negative dividends */
function mod(n, m) {
    return ((n % m) + m) % m;
  }

/*-1 for the fact that traditional note numbering starts at 1 (not 0). -3 for shifting the 0 note up 3 semitones from A0 to C1 */
const kbOffset = mod(-3, 12);

/* Takes in a traditionally named note number (1-88) and outputs the corresponding pitch class in integer notation */
function tradNoteToPitchClass(tradNote) {
    return mod(tradNote-1 + kbOffset, 12);
    
}

/* Translates a note from integer notation to the standard musical notation */
function numToSymbol(noteNumber) {
    let noteSymbol;
    switch (noteNumber) {
        case 0:
            noteSymbol = 'C';
            break;
        case 2:
            noteSymbol = 'D';
            break;
        case 4:
            noteSymbol = 'E';
            break;
        case 5:
            noteSymbol = 'F';
            break;
        case 7:
            noteSymbol = 'G';
            break;
        case 9:
            noteSymbol = 'A';
            break;
        case 11:
            noteSymbol = 'B';
            break;
        default:
            noteSymbol = noteNumber;
    }
    return noteSymbol
}

function specificIntervalToScaleDegree(semitones) {
    let scaleDegree;
    switch (semitones) {
        case 0:
            scaleDegree = '1';
            break;
        case 2:
            scaleDegree = '2';
            break;
        case 4:
            scaleDegree = '3';
            break;
        case 5:
            scaleDegree = '4';
            break;
        case 7:
            scaleDegree = '5';
            break;
        case 9:
            scaleDegree = '6';
            break;
        case 11:
            scaleDegree = '7';
            break;
        default:
            scaleDegree = "";
    }
    return scaleDegree
}

function rootToKeySigSymbol(root) {
    let noteSymbol;
    switch (root) {
        case 0:
            noteSymbol = 'C';
            break;
        case 1:
            noteSymbol = 'Db';
            break;
        case 2:
            noteSymbol = 'D';
            break;
        case 3:
            noteSymbol = 'Eb';
            break;
        case 4:
            noteSymbol = 'E';
            break;
        case 5:
            noteSymbol = 'F';
            break;
        case 6:
            noteSymbol = 'F#';
            break;
        case 7:
            noteSymbol = 'G';
            break;
        case 8:
            noteSymbol = 'Ab';
            break;
        case 9:
            noteSymbol = 'A';
            break;
        case 10:
            noteSymbol = 'Bb';
            break;
        case 11:
            noteSymbol = 'B';
            break;
        default:
            noteSymbol = root;
    }
    return noteSymbol
}

let projectFont;

let songName = "Hikoukigumo.mp3";
let BPM = 88;


let prevKeySig = 0;
let globalKeySigRoot = 0;
let firstBeatDelay;
let song;
let songDuration; 
let bkgrBrightness = 0;
let fft;
let smoothVal = 0.5; 
//replaced smoothVal with slider_smoothVal.value() - Number between 0 and 1 for visual damping of spectrum
//nvm... reverting back to hardcoded value. Slider didn't work.

let amp;
let prevBeatNo = 0;
let beatNo = 0;
let beatRecord = []; // log of all the beatRectangle objects

let maxHSBValue = 300;



let radio_noteLabelingConvention;
let radio_colorScheme;
/* Beat rectangle constructor? */
function BeatRectangle(xPosition, loudestPitchClass)  {
    this.xPosition = xPosition;
    this.loudestPitchClass = loudestPitchClass;

    this.displayBeat = function () {
        let normalizedNote = mod(this.loudestPitchClass - globalKeySigRoot, 12) //no +kbShift because "loudestPitchClass" normalized for C = 0
        colorMode(HSB);
        noStroke();

        let updatedColorHue = applyColorScheme(normalizedNote); //marker
        let noteSaturation = 100;
        let alpha = 1;
        if(checkbox_dimAccidentals.checked() && accidentalIntervals.includes(normalizedNote)){
            noteSaturation = 0;
            alpha = .15;
        }
        fill(updatedColorHue, noteSaturation, 100, alpha);
        rect(this.xPosition, 7, width / (songDuration / (60 / BPM)), height / 3 - 7);
    }
}


let swatchesArray = [];
let colorLegend = [];
function ColorSwatch(xPosition, initKeySig) {
    this.xPosition = xPosition;
    this.keySig = initKeySig;

    this.updateLegendColors = function(){

    }
}

function drawLegend() {
    colorMode(HSB);

    stroke('black');
    strokeWeight(2);
    fill('white');
    const legendXPos = width / 6;
    const legendYPos = (19 / 20) * height;
    const legendWidth = width / 6;
    const legendHeight = height / 20;
    rectMode(CORNER);
    let legendBackground = rect(legendXPos, legendYPos, legendWidth, legendHeight);

    /*----- Draw Key Signature Label -----*/
    const keySigXPos = legendXPos - legendHeight;
    rect(keySigXPos, legendYPos, legendHeight); 
    textSize(.5 * legendHeight);
    strokeWeight(0);
    textAlign(CENTER, CENTER);
    fill('black');
    text(rootToKeySigSymbol(globalKeySigRoot), keySigXPos + legendHeight / 2, legendYPos + legendHeight / 2); 
    /*----- End Draw Key Signature Label -----*/

    stroke('black');
    strokeWeight(1);

    let swatchSize = legendHeight / 3;
    textSize(swatchSize - .5);
    let numTones = 12;
    for (let i = 0; i < numTones; i++) {
        let swatchXPos = legendXPos + i * legendWidth / (numTones) + legendWidth / (numTones * 2);
        let swatchYPos = legendYPos + (2 / 3) * legendHeight;

        let noteHue = applyColorScheme(i);
        let noteSaturation = 100;
        let noteBrightness = 100;
        let alpha = 1;
        if (checkbox_dimAccidentals.checked() && accidentalIntervals.includes(i)) {
            noteSaturation = 0;
            noteBrightness = 25;
        }

        fill(noteHue, noteSaturation, noteBrightness, alpha);
        rectMode(CENTER);
        rect(swatchXPos, swatchYPos, swatchSize);

        fill('black');
        textAlign(CENTER, CENTER);
        const textHeight = swatchYPos - 1.25 * swatchSize;

        if (radio_noteLabelingConvention.value() == 'absolute') {
            text(numToSymbol(mod(i + globalKeySigRoot, 12)), swatchXPos, textHeight);
        }
        else if (radio_noteLabelingConvention.value() == 'relative') {
            const scaleDegree = specificIntervalToScaleDegree(mod(i, 12));
            if (scaleDegree) {
                text(scaleDegree, swatchXPos, textHeight + 1.5);
                textAlign(CENTER, BASELINE);
                text('^', swatchXPos, textHeight);
            }
        }

    }
    rectMode(CORNER);

}

function colorByLinearChromatic(note) {
    return (maxHSBValue / 12) * note; //HSB(0,100,100,1) is red. 
}

function colorByConsonanceOrder(note) {
    let noteSortedIndex = intervalsOrderedByConsonance[note];
    return (maxHSBValue / 12) * noteSortedIndex;
}

function colorByCircleOfFifths(note) {
    return maxHSBValue;
}

function applyColorScheme(pitchClass) {

    switch (radio_colorScheme.value()) {
        case "linearChromatic":
            noteHue = colorByLinearChromatic(pitchClass);
            break;
        case "circleOfFifths":
            noteHue = colorByCircleOfFifths(pitchClass);
            break;
        case "consonanceOrder":
            noteHue = colorByConsonanceOrder(pitchClass);
            break;
        default:
            noteHue = 0;
    }

    return noteHue;
}

let slider_smoothVal;
//let slider_Volume;
//let slider_Speed;
//let slider_Pan;
let button_Toggle;
let button_Restart;
let slider_barScale; // used to linearly scale bars
let slider_exaggerationExponent; //used as a power to make tall bars taller and short bars shorter.

let amplitudeLog = [];
let currentSpectrum = []; //88 notes with freq values of notes being played right now.

let button_Cb;
let button_Gb;
let button_Db;
let button_Ab;
let button_Eb;
let button_Bb;
let button_F;
let button_C;
let button_G;
let button_D;
let button_A;
let button_E;
let button_B;
let button_Cs;


/*PSEUDOCODE:

IF 't' is pressed, call bpmCalc function
    function bpmCalc(){
    - if 'SPACE'is pressed, push the current millis() to the array 
    - press 't' again to end the function.
    - for all beats, take the differece between consecutive beats. 
    - Average all of these values. 
    BPM = 60/ avgBeatMillis
    }

*/

function preload() {
    song = loadSound(songName);
   // song.reversed = true;
   projectFont = loadFont('Calibri.ttf');
}


function updateBPM(){
    restartSong();
    BPM = bpm_Input.value();
    console.log("BPM: " + BPM)
}

let bpm_PromptText;
let bpm_input;
let bpm_Button;
let checkbox_beatDetect;

function setup() {
    createCanvas(1200, 600);
    background(bkgrBrightness);
    songDuration = song.duration();

    button_Toggle = createButton("play/pause");
    button_Toggle.mousePressed(toggleSong);

    button_Restart = createButton("restart song");
    button_Restart.mousePressed(restartSong);

    createElement('h4', 'Amplitude Difference Exaggeration and Linear Scaling sliders:');
    slider_exaggerationExponent = createSlider(0, 7, 1, 0.01);
    slider_barScale = createSlider(0, 4, 1 , 0.01);

    createElement('h4', 'Enter BPM: ');
    checkbox_beatDetect = createCheckbox('automatic beat detection (not yet implemented)', false);
    checkbox_beatDetect.changed(toggleBeatDetection);
    
    bpm_Input = createInput('88');
    bpm_Input.changed(updateBPM);

    bpm_Button = createButton('Enter');
    bpm_Button.mousePressed('updateBPM');
    
    /* 
    
    textFont(calibri);
    noStroke();
    fill('white');
    textSize(7);
    text("Bar Scale", slider_barScale.width, height-10);
    console.log(slider_barScale.x);*/


    createElement('h4', 'Select a key signature:');

    //button_Cb = createButton("Cb");
    button_Gb = createButton("Gb");
    button_Db = createButton("Db");
    button_Ab = createButton("Ab");
    button_Eb = createButton("Eb");
    button_Bb = createButton("Bb");
    button_F = createButton("F");
    button_C = createButton("C");
    button_G = createButton("G");
    button_D = createButton("D");
    button_A = createButton("A");
    button_E = createButton("E");
    button_B = createButton("B");
    //button_Cs = createButton("C#");
    
    //button_Cb.mousePressed(keySig11);
    button_Gb.mousePressed(keySig6);
    button_Db.mousePressed(keySig1);
    button_Ab.mousePressed(keySig8);
    button_Eb.mousePressed(keySig3);
    button_Bb.mousePressed(keySig10);
    button_F.mousePressed(keySig5);
    button_C.mousePressed(keySig0);
    button_G.mousePressed(keySig7);
    button_D.mousePressed(keySig2);
    button_A.mousePressed(keySig9);
    button_E.mousePressed(keySig4);
    button_B.mousePressed(keySig11);
    //button_Cs.mousePressed(keySig1);

    const radioParent_noteLabelingConventions = createDiv();
    radioParent_noteLabelingConventions.id = "radioParent_noteLabelingConventions";
    createElement('plaintext', 'Legend Labels:');
    radio_noteLabelingConvention = createRadio('radioParent_noteLabelingConventions');
    radio_noteLabelingConvention.option('absolute', 'Note names')
    radio_noteLabelingConvention.option('relative', 'Scale Degrees')
    radio_noteLabelingConvention.selected('relative');

    const radioParent_colorSchemes = createDiv();
    radioParent_colorSchemes.id = "radioParent_colorSchemes";

    createElement('h4', 'Color Scheme:');
    radio_colorScheme = createRadio('radioParent_colorSchemes');
    radio_colorScheme.option('linearChromatic', 'Linear, chromatic');
    radio_colorScheme.option('consonanceOrder', 'Consonance order');
    radio_colorScheme.option('circleOfFifths', 'Circle of 5ths (not implemented)');
    radio_colorScheme.selected('consonanceOrder');
    checkbox_dimAccidentals = createCheckbox('Dim accidentals', true);



//amplitude sliders location

//    createElement('h4', 'Smoothing slider (broken): ');
//    slider_smoothVal = createSlider(0, 1, 0.65, 0.01);     

//    slider_Volume = createSlider(0, 2, 0.25, 0.01);
//    slider_Speed = createSlider(0, 3, 1, 0.01);
//    slider_Pan = createSlider(-1, 1, 0, 0.01);

    fft = new p5.FFT(smoothVal, Math.pow(2, 12));
    amp = new p5.Amplitude();
    console.log(song);

}


function draw() {
    background(bkgrBrightness);


    //    song.setVolume(slider_Volume.value());
    //    song.rate(slider_Speed.value());
    //    song.pan(slider_Pan.value());

    var spectrum = fft.analyze();



    /*--------------------- DRAW PIANO FREQUENCIES ------------------------*/
    // 'note' corresponds to a note on piano, STARTING AT 1 = A0. 

    /*tradNote is the note number in traditional numbering from 1 to 88*/
    for (let tradNoteNum = 1; tradNoteNum <= 88; tradNoteNum++) { //note will conventionally always assume starting indexing at 1 in this block. 
        let noteFreq = noteToFreq_(tradNoteNum); //Math.pow(Math.pow(2, 1 / 12), note - 49) * 440; underscore b/c "noteToFreq" is alrady defined somewhere in backend library code
        /*
        1 semitone == 100 cents ; 50 cents == 1/2 semitone
        2 root 12 divides the octave into 12 semitones. 
        2 root 1200 divides octave into 1200 tones (each semitone is divided into 100 smaller tones, so +/-50 1200-tones is +/-50 cents)
        (2-root-120)^(# of 1200-tones)
        */
        let noteSub50Cents = 440 * Math.pow(Math.pow(2, 1 / 1200), 100 * (tradNoteNum - 49) - 50); //Hz
        let notePlus50Cents = 440 * Math.pow(Math.pow(2, 1 / 1200), 100 * (tradNoteNum - 49) + 50); //Hz

        let freqVol = fft.getEnergy(noteSub50Cents, notePlus50Cents); // get the total energy +/- 50 cents around desired note
        currentSpectrum[tradNoteNum - 1] = freqVol;
        

        let freqVolScaled = freqVol;
        freqVolScaled = Math.pow(freqVol, slider_exaggerationExponent.value()); //scaled so tall bars are even taller and short bars are even shorter.

        let barHeight = map(freqVolScaled, 0, Math.pow(255, slider_exaggerationExponent.value()), 0, height / 2); //exponentially exaggerate differences between bars
        barHeight *= Math.pow(slider_barScale.value(), slider_exaggerationExponent.value()); // linearly scale up bar heights by scale factor and exaggerationExponent
        barHeight = -barHeight;


        colorMode(HSB);
        let noteHue;
        let relativeInterval = tradNoteToPitchClass(tradNoteNum - globalKeySigRoot);

        noteHue = applyColorScheme(relativeInterval);
        let noteSaturation = 100;
        let noteBrightness = map(Math.log2(freqVol), 0, 8, 0, 100); //freqVol ranges from 0 to 255
        let alpha = 1;
        if (checkbox_dimAccidentals.checked() && accidentalIntervals.includes(relativeInterval)) {
            noteSaturation = 0;
            alpha = .15;
        }
        stroke(color(noteHue, noteSaturation, noteBrightness, alpha));
        //stroke(strokeColor(note));
        strokeWeight(5);
        line((width / 2 - 20) / 88 * tradNoteNum, height - 50, (width / 2 - 20) / 88 * tradNoteNum, (height - 50) + barHeight);
        /*--------------------- END DRAW PIANO FREQUENCIES ------------------------*/


        /*--- Draw the note labels ---*/
        textFont(projectFont);
        //strokeWeight(1);
        noStroke();
        fill('white');
        textSize(7);

        textAlign(CENTER, CENTER);
        text(numToSymbol(tradNoteToPitchClass(tradNoteNum)), (width / 2 - 20) / 88 * tradNoteNum - 2, height - 37);
        /*--- End Draw the note labels ---*/
    }

    /*----- DRAW CUMULATIVE AMPLITUDE GRAPH ----- */
    /* ----- Sum amplitudes of same pitch classes*/
    let pitchClassVolumes = new Array(12).fill(0);

    for (let i = 0; i <= 87; i++) {
        pitchClassVolumes[tradNoteToPitchClass(i + 1)] += currentSpectrum[i];
    }
    
    let maxCumulativeVolume = max(pitchClassVolumes);

    colorMode(HSB);

    for (let pitchClass = 0; pitchClass < pitchClassVolumes.length; pitchClass++) {
        let pitchClassHue = applyColorScheme(pitchClass);
        let pitchClassSaturation = 100;
        let pitchClassBrightness = 100
        let alpha = 1;
        if (checkbox_dimAccidentals.checked() && accidentalIntervals.includes(pitchClass)) {
            noteSaturation = 0;
            alpha = .15;
        }

        let barHeight = map(pitchClassVolumes[pitchClass], 0, maxCumulativeVolume, 0, height / 2); 
        barHeight = -barHeight;
        
        stroke(color(pitchClassHue, pitchClassSaturation, pitchClassBrightness, alpha));
        strokeWeight(5);
        line((width / 2)*(1+ pitchClass/88), height - 50, (width / 2)*(1+ pitchClass/88), (height - 50) + barHeight);


        /*--- Draw Pitch Class labels ---*/
        textFont(projectFont);
        //strokeWeight(1);
        noStroke();
        fill('white');
        textSize(7);

        textAlign(CENTER, CENTER);
        text(numToSymbol(pitchClass), (width / 2)*(1+ pitchClass/88), height - 37);
        /*--- End Draw Pitch Class labels ---*/
    }

    /*---------------- END DRAW CUMULATIVE AMPLITUDE GRAPH -------------- */


    /*--------------------- DRAW AMPLITUDE GRAPH ------------------------*/
    var vol = amp.getLevel();
    if (song.isPlaying()) {
        amplitudeLog.push(vol);
    }
    //fill('white');
    noFill();
    stroke('white');
    strokeWeight(2);
    line(0, height / 3, width, height / 3)

    strokeWeight(1);
    beginShape();
    for (let i = 0; i < amplitudeLog.length; i++) {
        var pointHeight = map(amplitudeLog[i], 0, 1, 0, 3 * height / 3); //display 2/3 of the way up the screen
        pointHeight = -pointHeight;
        pointHeight += height / 3;
        vertex(i, pointHeight);

        //        bkgrBrightness = map(amplitudeLog[i], 0, 1, 0, 50);
        //        bkgrBrightness = Math.round(bkgrBrightness);
    }
    endShape();

    if (amplitudeLog.length > width) {
        amplitudeLog.splice(0, 1);
    }

    /*--------------------- DRAW THE BEAT RECTANGLES ------------------------*/
    //the song's current position, mapped to the width of the screen
    var songPos = map(song.currentTime(), 0, song.buffer.duration, 0, width);

    //HSB Defaults: colorMode(HSB, hue=360, saturation=100, brightness=100, alpha=1)
    colorMode(HSB);

    let currentColor;
    beatNo = Math.trunc(song.currentTime() / (60/BPM));
    let spectrumMax = max(currentSpectrum); //loudest volume at this istant
    let loudestPitchClass;
    for (let i = 0; i <= 87; i++) {
        if (currentSpectrum[i] == spectrumMax) {
            loudestPitchClass = tradNoteToPitchClass(i + 1); 
            break;
        }
    }
    if (beatNo != prevBeatNo) {
        beatRecord.push(new BeatRectangle(songPos, loudestPitchClass));
        //console.log("Loudest pitch class: " + beatRecord[beatRecord.length-1].loudestPitchClass);
        //console.log("initKeySig: " + beatRecord[beatRecord.length-1].initKeySig);
        //console.log("keySig: " + beatRecord[beatRecord.length-1].keySig);
    }

    //console.log(beatRectangleNow);

    for (let i = 0; i < beatRecord.length; i++) {
        beatRecord[i].displayBeat();
    }

    prevBeatNo = beatNo;
        //console.log(Math.trunc(song.currentTime() / (60 / BPM)));

    drawLegend();

}


function restartSong(){
    background(0);
    song.jump(0); //doesn't work when the song is paused
    beatRecord = [];
    amplitudeLog = [];
}

function toggleSong() {
    if (song.isPlaying()) {
        song.pause();
    } else {
        song.play();
    }
}
function noteToFreq_(note) {
    return (440 * Math.pow(Math.pow(2, 1 / 12), note - 49));
}
//I don't know why there's a 12-n, 5*n, 12-n, 5*n,... pattern
// 5*n = -7*n in mod_12. Is the modular arithmetic in the color expression going in reverse...?
// for odd number of accidentals, usually 6+
// odd accidentals  are normally their respective note number -6.
// even accidentals are normally the same number as their respective note between notes 0 thru 6
// even accidentals are normally 12 - the number of their respective note between notes 6 thru 12
function keySig0() { //C
    prevKeySig = globalKeySigRoot;
    globalKeySigRoot = 0;
    if (globalKeySigRoot != prevKeySig) {
        /*Update the beat record*/
    }
}
function keySig1() { //C#/Db
    globalKeySigRoot = 1;
}
function keySig2() { //D
    globalKeySigRoot = 2;
}
function keySig3() { //Eb
    globalKeySigRoot = 3;
}
function keySig4() { //E
    globalKeySigRoot = 4;
}
function keySig5() { //F
    globalKeySigRoot = 5;
}
function keySig6() { //F#/Gb
    globalKeySigRoot = 6;
}
function keySig7() { //G
    globalKeySigRoot = 7;
}
function keySig8() { //G#/Ab
    globalKeySigRoot = 8;
}
function keySig9() { //A
    globalKeySigRoot = 9;
}
function keySig10() { //Bb
    globalKeySigRoot = 10;
}
function keySig11() { // B/Cb
    globalKeySigRoot = 11;
}

function toggleBeatDetection() {
    if (checkbox_beatDetect.checked()) {
        //enable beat detection
    } else {
        //disable beat detection
    }
  }

  let intervalRatios = [1/1, 16/15, 9/8, 6/5, 5/4, 4/3, 45/32, 3/2, 8/5, 5/3, 9/5, 15/8];
  let intervalsOrderedByConsonance= [0, 10, 8, 5, 4, 2, 11, 1, 6, 3, 7, 9]; 

  /*
    COF := Circle of Fifths
    x is solution to linear congruence equation 7*x = n (mod 12)
    x := # of accidentals (from 0-11, must be shifted to range -6 to +6)
    n := note index
    Solutions hardcoded as array. This can be generalized using the linear congruence
    for 7 and 12 as arbitrary constants a and n
  */
  let intervalsOrderedByCOF= []; 
  let accidentalIntervals = [1, 3, 6, 8, 10];

  //TODO: 2 arrays for numerator and denominator and generalize to n tones by sorting by LCM(num,denom)

/* DISPLAY THE FREQUENCY SPECTRUM
    var spectrum = fft.analyze();
    for (var x = 0; x < spectrum.length; x++) {
        var amp = spectrum[x];
        var y = map(amp, 0, 256, height, 0);
        line(5*x, height - 10, 5*x, y - 10);
        strokeWeight(5);
    }

    stroke(255);
    noFill();

    stroke(255);
    noFill();
    //line(0, 0, width / 2, height / 2);
    //console.log(fft);
    //    console.log(spectrum);
    //    console.log(spectrum.length);
    */


/*
//Function currently disabled
//Something isn't working with this function... the default case always ends up getting returned. 
function strokeColor(note) {
    var defaultCase = false;
    let retval;
    switch (mod(note, 12)) {
        case 1: //A
            retval = color('midnightblue');
            break;
        case 2:
            retval = color('white');
            defaultCase = true;
            break;
        case 3: //B
            retval = color('blue');
            break;
        case 4: //C
            retval = color('darkorange');
            break;
        case 5:
            retval = color('white');
            defaultCase = true;
            break;
        case 6: //D
            retval = color('blue');
            break;
        case 7:
            retval = color('cyan');
            break;
        case 8: //E
            retval = color('yellow');
            break;
        case 9: //F
            retval = color('purple');
            break;
        case 10:
            retval = color('white');
            break;
        case 11: //G
            retval = color('green');
            break;
    }

    if (defaultCase = true) {
        retval = color('white');
    }
    
    return retval;
}
*/