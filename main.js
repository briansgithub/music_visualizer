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
const kbShift = mod(-1 + -3, 12);

/* Takes in a traditionally named note number (1-88) and outputs the corresponding pitch class in integer notation */
function normalizeNote(note) {
    return mod(note + kbShift, 12);
    
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

let projectFont;

let songName = "Hikoukigumo.mp3";
let BPM = 88;


let prevKeySig = 0;
let globalKeySigOffset = 0;
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

const enum_colorScheme = Object.freeze({
    linearChromatic: 0,
    circleOfFifths: 1,
    consonanceOrder: 2
})

let radio_colorScheme;
/* Beat rectangle constructor? */
function BeatRectangle(xPosition, loudestPitchClass, initKeySig)  {
    this.xPosition = xPosition;
    this.loudestPitchClass = loudestPitchClass;
    this.initKeySig = initKeySig;

    this.displayBeat = function() {
        let updatedColorHue = (360 / 12)*mod(this.loudestPitchClass + globalKeySigOffset, 12); //no +kbShift because "loudestPitchClass" normalized for C = 0
        colorMode(HSB);
        noStroke();
        fill(updatedColorHue, 100, 100, 1);
        rect(this.xPosition, 7, width/(songDuration/(60/BPM)), height/3-7);
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
    let legendXPos = width/ 6; 
    let legendYPos =(19 / 20) * height; 
    let legendWidth = width / 6;
    let legendHeight =height/ 20; 
    rectMode(CORNER);
    let legendBackground = rect(legendXPos, legendYPos, legendWidth, legendHeight);

    stroke('black');
    strokeWeight(1);

    let swatchSize = legendHeight / 3;
    textSize(swatchSize);
    let numTones = 12;
    for (let i = 0; i < numTones; i++) {
        let swatchXPos =  legendXPos +  i*legendWidth/(numTones) + legendWidth/(numTones*2);
        let swatchYPos = legendYPos + (2/3)*legendHeight;
        let noteHue = (360 / 12) * mod(i, 12); 
        rectMode(CENTER);
        fill(noteHue,100,100);
        rect(swatchXPos, swatchYPos, swatchSize);

        fill('black');
        textAlign(CENTER, CENTER);
        text(numToSymbol(mod(i-globalKeySigOffset,12)), swatchXPos , swatchYPos - 1.25 * swatchSize);
    }
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

    createElement('h4', 'Enter BPM: ');
    checkbox_beatDetect = createCheckbox('automatic beat detection (not yet implemented)', false);
    checkbox_beatDetect.changed(toggleBeatDetection);
    
    bpm_Input = createInput();
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
    document.createElement('test');
    button_Cb = createButton("Cb");
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
    button_Cs = createButton("C#");
    
    button_Cb.mousePressed(keySig11);
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
    button_Cs.mousePressed(keySig1);

    createElement('h4', 'Color Scheme: (not yet implemented)');
    radio_colorScheme = createRadio();
    radio_colorScheme.option('enum_colorScheme.linearChromatic', 'Linear, chromatic');
    radio_colorScheme.option('enum_colorScheme.circleOfFifths', 'Circle of 5ths');
    radio_colorScheme.option('enum_colorScheme.consonanceOrder', 'Consonance order');
    radio_colorScheme.selected('enum_colorScheme.linearChromatic');


    createElement('h4', 'Amplitude Difference Exaggeration and Linear Scaling sliders:');
    slider_exaggerationExponent = createSlider(0, 7, 1, 0.01);
    slider_barScale = createSlider(0, 4, 1 , 0.01);

    createElement('h4', 'Smoothing slider (broken): ');
    slider_smoothVal = createSlider(0, 1, 0.65, 0.01);     
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

    /* ------ TODO: CHOOSE COLOR CODING MODE ----- */
        //options: chromatically, linearly by index; circle of fiths ; consonance order
    /* ------ CHOOSE COLOR CODING MODE END ----- */

    /*--------------------- DRAW PIANO FREQUENCIES ------------------------*/
    // 'note' corresponds to a note on piano, STARTING AT 1 = A0. 

    for (let note = 1; note <= 88; note++) { //note will conventionally always assume starting indexing at 1 in this block. 
        let noteFreq = noteToFreq_(note); //Math.pow(Math.pow(2, 1 / 12), note - 49) * 440; underscore b/c "noteToFreq" is alrady defined somewhere in backend library code
        /*
        1 semitone == 100 cents ; 50 cents == 1/2 semitone
        2 root 12 divides the octave into 12 semitones. 
        2 root 1200 divides octave into 1200 tones (each semitone is divided into 100 smaller tones, so +/-50 1200-tones is +/-50 cents)
        (2-root-120)^(# of 1200-tones)
        */
        var noteSub50Cents = 440 * Math.pow(Math.pow(2, 1 / 1200), 100 * (note - 49) - 50); //Hz
        var notePlus50Cents = 440 * Math.pow(Math.pow(2, 1 / 1200), 100 * (note - 49) + 50); //Hz

        var freqVol = fft.getEnergy(noteSub50Cents, notePlus50Cents); // get the total energy +/- 50 cents around desired note
        currentSpectrum[note - 1] = freqVol;

        var freqVolScaled = freqVol;
        freqVolScaled = Math.pow(freqVol, slider_exaggerationExponent.value()); //scaled so tall bars are even taller and short bars are even shorter.

        var barHeight = map(freqVolScaled, 0, Math.pow(255, slider_exaggerationExponent.value()), 0, height / 2); //exponentially exaggerate differences between bars
        barHeight *= Math.pow(slider_barScale.value(), slider_exaggerationExponent.value()); // linearly scale up bar heights by scale factor and exaggerationExponent
        barHeight = -barHeight;


        colorMode(HSB);

        let noteHue = (360 / 12) * normalizeNote(note + globalKeySigOffset); //HSB(0,100,100,1) is red. 

        let noteBrightness = map(Math.log2(freqVol), 0, 8, 0, 100); //freqVol ranges from 0 to 255

        stroke(color(noteHue, 100, noteBrightness, 1));
        //stroke(strokeColor(note));
        strokeWeight(5);
        //TODO: Line/bar positions should be drawn without the use of magic numbers
        line((width / 2 - 20) / 88 * note, height - 50, (width / 2 - 20) / 88 * note, (height - 50) + barHeight);
        /*--------------------- END DRAW PIANO FREQUENCIES ------------------------*/


        /*--------------------- DRAW THE COLOR CODING LEGEND ------------------------*/




        /*Psuedocode for drawing key
        Save ColorSwatch objects into an array

        Draw white background
        Draw color swatch (colored squares with black outlines)
        draw text next to color swatch

        update the color key based on the radio button value 
        */

        /*--------------------- END DRAW THE COLOR CODING LEGEND ------------------------*/

        /*--- Draw the note labels ---*/
        textFont(projectFont);
        //strokeWeight(1);
        noStroke();
        fill('white');
        textSize(7);


        textAlign(CENTER, CENTER);       
        text(numToSymbol(normalizeNote(note)), (width/2 - 20) / 88 * note - 2, height - 37);
    }

    let spectrumMax = max(currentSpectrum); //loudest volume at this istant
    let loudestNotePitchClass; 
    for (let i = 0; i <= 87; i++) { 
        if (currentSpectrum[i] == spectrumMax) {
            loudestNotePitchClass = mod(i + 9, 12); //currentSpectrum array indexes at 0, whereas "note" indexes at 1
            //console.log(loudestNotePitch);
            break;
        }
    }


    /*---------------- DRAW REORGANIZED AMPLITUDE GRAPH -------------- */


    
    /*--------------------- DRAW AMPLITUDE GRAPH ------------------------*/
    var vol = amp.getLevel();
    amplitudeLog.push(vol);
    //fill('white');
    noFill();
    stroke('white');
    strokeWeight(2);
    line(0, height / 3, width, height / 3)

    strokeWeight(1);
    beginShape();
    for (let i = 0; i < amplitudeLog.length; i++) {
        var pointHeight = map(amplitudeLog[i], 0, 1, 0, 10 * height / 3); //display 2/3 of the way up the screen
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
    
    if (beatNo != prevBeatNo) {
        beatRecord.push(new BeatRectangle(songPos, loudestNotePitchClass, globalKeySigOffset));
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

function noteToFreq_(note){
   return ( 440*Math.pow(Math.pow(2, 1/12), note - 49) );
}

//I don't know why there's a 12-n, 5*n, 12-n, 5*n,... pattern
// 5*n = -7*n in mod_12. Is the modular arithmetic in the color expression going in reverse...?
// for odd number of accidentals, usually 6+
// odd accidentals  are normally their respective note number -6.
// even accidentals are normally the same number as their respective note between notes 0 thru 6
// even accidentals are normally 12 - the number of their respective note between notes 6 thru 12

function keySig0() { //C
    prevKeySig = globalKeySigOffset;
    globalKeySigOffset = 0;
    if (globalKeySigOffset != prevKeySig) {
        /*Update the beat record*/
    }
}
function keySig1() { //C#/Db
    globalKeySigOffset = mod(-1, 12);
}
function keySig2() { //D
    globalKeySigOffset = mod(-2, 12);
}
function keySig3() { //Eb
    globalKeySigOffset = mod(-3, 12);
}
function keySig4() { //E
    globalKeySigOffset = mod(-4, 12);
}
function keySig5() { //F
    globalKeySigOffset = mod(-5, 12);
}
function keySig6() { //F#/Gb
    globalKeySigOffset = mod(-6, 12);
}
function keySig7() { //G
    globalKeySigOffset = mod(-7, 12);
}
function keySig8() { //G#/Ab
    globalKeySigOffset = mod(-8, 12);
}
function keySig9() { //A
    globalKeySigOffset = mod(-9, 12);
}
function keySig10() { //Bb
    globalKeySigOffset = mod(-10, 12);
}
function keySig11() { // B/Cb
    globalKeySigOffset = mod(-11, 12);
}

function toggleBeatDetection() {
    if (checkbox_beatDetect.checked()) {
        //enable beat detection
    } else {
        //disable beat detection
    }
  }

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