/// <reference path="./lib/p5.js" />
/// <reference path="./lib/addons/p5.sound.js" />
/// <reference path="./TSDef/p5.global-mode.d.ts" />
/// <reference path="conversionsAndConstants.js" />
/// <reference path="volumeGraph.js" />
/// <reference path="coloring.js" />
/// <reference path="legend.js" />
/// <reference path="spectrum.js" />
/// <reference path="cumulativeAmplitudes.js" />
/// <reference path="beatRecord.js" />

//TSDef provides typescript definitions for intellisense (function documentation, autocompletion)
"use strict";


//-----------------------------------------------------------------------------
let defaultBPM = 88;
let globalBPM = defaultBPM;

let prevKeySig = 0;
let globalKeySigRoot = 0;
let firstBeatDelay;
let bkgrBrightness = 0;
let fft;
let smoothVal = 0.5; 
//replaced smoothVal with slider_smoothVal.value() - Number between 0 and 1 for visual damping of spectrum

let amp;

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

let projectFont;
let song;
let songName = "Hikoukigumo.mp3";
let songDuration; 

function preload() {
    song = loadSound(songName);
    // song.reversed = true;
    projectFont = loadFont('Calibri.ttf');
}


let bpmPromptText;
let button_BPMEnter;
let checkbox_beatDetect;

let radio_noteLabelingConvention;
let radio_colorScheme;

//let slider_Volume;
//let slider_Speed;
//let slider_Pan;
let slider_smoothVal;

let button_toggle;
let button_restart;
let slider_barScale; // used to linearly scale bars
let slider_exaggerationExponent; //used as a power to make tall bars taller and short bars shorter.

let checkbox_dimAccidentals;

let input_BPM;
function updateBPM(){
    restartSong();
    globalBPM = input_BPM.value();
    console.log("BPM: " + globalBPM)
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

function setup() {
    createCanvas(1200, 600);
    background(bkgrBrightness);
    songDuration = song.duration();

    button_toggle = createButton("play/pause");
    button_toggle.mousePressed(toggleSong);

    button_restart = createButton("restart song");
    button_restart.mousePressed(restartSong);

    createElement('h4', 'Amplitude Difference Exaggeration and Linear Scaling sliders:');
    slider_exaggerationExponent = createSlider(0, 7, 1, 0.01);
    slider_barScale = createSlider(0, 4, 1 , 0.01);

    createElement('h4', 'Enter BPM: ');
    checkbox_beatDetect = createCheckbox('automatic beat detection (not yet implemented)', false);
    checkbox_beatDetect.changed(toggleBeatDetection);
    
    input_BPM = createInput(globalBPM);
    input_BPM.changed(updateBPM);

    button_BPMEnter = createButton('Enter');
    button_BPMEnter.mousePressed('updateBPM');
    
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
    button_D.mousePressed(keySig2)
    button_A.mousePressed(keySig9);
    button_E.mousePressed(keySig4);
    button_B.mousePressed(keySig11);
    //button_Cs.mousePressed(keySig1);

    createElement('plaintext', 'Legend Labels:');
    const radioParent_noteLabelingConventions = createDiv();
    radioParent_noteLabelingConventions.id = "radioParent_noteLabelingConventions";
    radio_noteLabelingConvention = createRadio('radioParent_noteLabelingConventions');
    radio_noteLabelingConvention.option('absolute', 'Note names')
    radio_noteLabelingConvention.option('relative', 'Scale Degrees')
    radio_noteLabelingConvention.selected('relative');

    createElement('h4', 'Color Scheme:');
    const radioParent_colorSchemes = createDiv();
    radioParent_colorSchemes.id = "radioParent_colorSchemes";
    radio_colorScheme = createRadio('radioParent_colorSchemes');
    radio_colorScheme.option('linearChromatic', 'Linear, chromatic');
    radio_colorScheme.option('consonanceOrder', 'Consonance order');
    radio_colorScheme.option('circleOfFifths', 'Circle of 5ths (not implemented)');
    radio_colorScheme.selected('consonanceOrder');
    checkbox_dimAccidentals = createCheckbox('Dim accidentals', true);

//    createElement('h4', 'Smoothing slider (broken): ');
//    slider_smoothVal = createSlider(0, 1, 0.65, 0.01);     

//    slider_Volume = createSlider(0, 2, 0.25, 0.01);
//    slider_Speed = createSlider(0, 3, 1, 0.01);

    fft = new p5.FFT(smoothVal, Math.pow(2, 12));
    amp = new p5.Amplitude();
    console.log(song);

}


function draw() {
    background(bkgrBrightness);
    let spectrum = fft.analyze();
    //    song.setVolume(slider_Volume.value());
    //    song.rate(slider_Speed.value());
    //    song.pan(slider_Pan.value());

    drawLegend();
    drawSpectrum();
    drawCumulativeAmplitudes();
    drawVolumeGraph();
    logBeat();
    drawBeats();

}

//I don't know why there's a 12-n, 5*n, 12-n, 5*n,... pattern
// 5*n = -7*n in mod_12. Is the modular arithmetic in the color expression going in reverse...?
// for odd number of accidentals, usually 6+
// odd accidentals  are normally their respective note number -6.
// even accidentals are normally the same number as their respective note between notes 0 thru 6
// even accidentals are normally 12 - the number of their respective note between notes 6 thru 12
function keySig0() { //C
    globalKeySigRoot = 0;
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
    } else {
    }
}

  //TODO: 2 arrays for numerator and denominator and generalize to n tones by sorting by LCM(num,denom)
