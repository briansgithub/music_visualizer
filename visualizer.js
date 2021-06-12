/// <reference path="../TSDef/p5.global-mode.d.ts" />
/// <reference path="../addons/p5.sound.js" />

//"use strict";
//-----------------------------------------------------------------------------
//TODO: figure out how to slow down the tempo without altering the frequencies of the MP3
//TODO: darken notes outside of the key signature?
//TODO: add a counter for the duration of the song that each pitch class is in the top 10 freqs
var projectFont;

var songName = "../songs/@simpleGifts2.mp3";
//TODO: replace BPMs with beat detection/a BPM calculation tool
var BPM = 96; //Hikoukigumo

//var BPM = 80; //Champion's Road
var prevKeySig = 0;
var keySig = 0;  //TODO: 0 thru 11. Subtracted from the HSB line color to normalize colors to scale degrees;. Add as buttons on the side?
var firstBeatDelay; //TODO: beats won't start until some delay into song. (phase shift). start the beat counter on the first beat

var song;
var songDuration; 
var bkgrBrightness = 0;
var fft;
//var smoothVal = 0.5; // REPLACED with slider_smoothVal.value() - Number between 0 and 1 for visual damping of spectrum

var amp;
var prevBeatNo = 0;
var beatNo = 0;
var beatRecord = new Array(); // log of all the beatRectangle objects
function BeatRectangle(xPosition, loudestPitchClass, initKeySig)  {
    this.xPosition = xPosition;
    this.loudestPitchClass = loudestPitchClass;
    this.initKeySig = initKeySig;
    this.displayBeat = function() {
        var updatedColorHue = (360 / 12)*((this.loudestPitchClass + keySig) % 12); //no +8 because "loudestNotePitch" normalized for C = 0
        colorMode(HSB);
        noStroke();
        fill(updatedColorHue, 100, 100, 1);
        rect(this.xPosition, 7, width/(songDuration/(60/BPM)), height/3-7);
    }
}

var slider_smoothVal;
var slider_Volume;
var slider_Speed;
var slider_Pan;
var button_Toggle;
var button_Restart;
var slider_barScale; // used to linearly scale bars
var slider_exaggerationExponent; //used as a power to make tall bars taller and short bars shorter.

var amplitudeLog = [];
var currentSpectrum = []; //88 notes with freq values of notes being played right now.

var button_Cb;
var button_Gb;
var button_Db;
var button_Ab;
var button_Eb;
var button_Bb;
var button_F;
var button_C;
var button_G;
var button_D;
var button_A;
var button_E;
var button_B;
var button_Cs;


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


function setup() {
    createCanvas(1200, 600);
    background(0);
    
    slider_smoothVal = createSlider(0, 1, 0.65, 0.01); //TODO: 0.6 is set as the smoothing value, but does not update the FFT object when this value changes
    slider_Volume = createSlider(0, 2, 0.25, 0.01);
    slider_Speed = createSlider(0, 3, 1, 0.01);
    slider_Pan = createSlider(-1, 1, 0, 0.01);
    slider_barScale = createSlider(0, 4, 1 , 0.01);
    slider_exaggerationExponent = createSlider(0, 7, 1, 0.01);

    /* //TODO: make labels for the DOM elments, like sliders
    
    textFont(calibri);
    noStroke();
    fill('white');
    textSize(7);
    text("Bar Scale", slider_barScale.width, height-10);
    console.log(slider_barScale.x);*/

    song.play();
    songDuration = song.duration();

    button_Toggle = createButton("play/pause");
    button_Toggle.mousePressed(toggleSong);

    button_Restart = createButton("restart song");
    button_Restart.mousePressed(restartSong);

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
    button_Cs = createButton("Cs");
    
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

    fft = new p5.FFT(slider_smoothVal.value(), Math.pow(2, 12)); //TODO: How does the number of bins affect the logic and graphics? It definitely affects the resolution of the lower frequency ranges. 12 seems like a good value.
    amp = new p5.Amplitude();
    console.log(song);

}


function draw() {
    background(bkgrBrightness);

    song.setVolume(slider_Volume.value());
    song.rate(slider_Speed.value());
    song.pan(slider_Pan.value());

    var spectrum = fft.analyze();

    /*--------------------- DRAW PIANO FREQUENCIES ------------------------*/
    //Note corresponds to note on piano, STARTING AT 1 = A. 

    for (var note = 1; note <= 88; note++) { //note will conventionally always assume starting indexing at 1 in this block. 
        var noteFreq = noteToFreq_(note); //Math.pow(Math.pow(2, 1 / 12), note - 49) * 440; underscore b/c "noteToFreq" is used somewhere in backend code
        //50 cents == 1/2 semitone
        //2 root 12 divides the octave into 12 semitones. 2 root 120 divides octave into 120 tones. 
        var noteSub50Cents = 440 * Math.pow(Math.pow(2, 1 / 120), 10 * (note - 49) - 5); //Hz
        var notePlus50Cents = 440 * Math.pow(Math.pow(2, 1 / 120), 10 * (note - 49) + 5); //Hz

        var freqVol = fft.getEnergy(noteSub50Cents, notePlus50Cents); // get the total energy +- 5 cents around desired note
        currentSpectrum[note - 1] = freqVol;

        var freqVolScaled = freqVol;
        freqVolScaled = Math.pow(freqVol, slider_exaggerationExponent.value()); //scaled so tall bars are even taller and short bars are even shorter.

        var barHeight = map(freqVolScaled, 0, Math.pow(255, slider_exaggerationExponent.value()), 0, height / 2); //exponentially exaggerate differences between bars
        barHeight *= Math.pow(slider_barScale.value(), slider_exaggerationExponent.value()); // linearly scale up bar heights by scale factor and exaggerationExponent
        barHeight = -barHeight;


        colorMode(HSB);
        let noteHue = (360 / 12) * ((note + 8 + keySig) % 12); //HSB(0,100,100,1) is red. If A is 9, since "note" begins indexing at 1, then + 8 brings index 1 to 9, which normalizes to C as index 0 in mod 12

        let noteBrightness = map(Math.log2(freqVol), 0, 8, 0, 100); //freqVol ranges from 0 to 255

        stroke(color(noteHue, 100, noteBrightness, 1));
        //stroke(strokeColor(note));
        strokeWeight(5);
        line((width/2 - 20) / 88 * note, height - 50, (width/2 - 20) / 88 * note, (height - 50) + barHeight);


        textFont(projectFont);
        //strokeWeight(1);
        noStroke();
        fill('white');
        textSize(7);

        var noteLetter;
        switch ((note + 8) % 12) {
            case 0:
                noteLetter = 'C';
                break;
            case 2:
                noteLetter = 'D';
                break;
            case 4:
                noteLetter = 'E';
                break;
            case 5:
                noteLetter = 'F';
                break;
            case 7:
                noteLetter = 'G';
                break;
            case 9:
                noteLetter = 'A';
                break;
            case 11:
                noteLetter = 'B';
                break;
            default:
                noteLetter = (note + 8) % 12; //not sure why this is +8, since (note 1) = A = 9. Possibly related to 1st note on piano indexed at 1.
        }
        text(noteLetter, (width/2 - 20) / 88 * note - 2, height - 37);
    }

    let spectrumMax = max(currentSpectrum); //loudest volume at this istant
    var loudestNotePitch; //loudest frequency at this instant
    for (let i = 0; i <= 87; i++) { //search the currentSpectrum for the loudest pitch
        if (currentSpectrum[i] == spectrumMax) {
            loudestNotePitch = (i + 9) % 12; //i indexes at 0, whereas "note" indexes at 1
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
    beatNo = Math.trunc(song.currentTime() / (60 / BPM));
    
    if (beatNo != prevBeatNo) {
        beatRecord.push(new BeatRectangle(songPos, loudestNotePitch, keySig));
        //console.log("Loudest pitch class: " + beatRecord[beatRecord.length-1].loudestPitchClass);
        //console.log("initKeySig: " + beatRecord[beatRecord.length-1].initKeySig);
        //console.log("keySig: " + beatRecord[beatRecord.length-1].keySig);
    }

    //console.log(beatRectangleNow);

    for (let i = 0; i < beatRecord.length; i++) {
        beatRecord[i].displayBeat();
    }

    prevBeatNo = beatNo;
    //TODO: update beat colors to match global key sig
    //console.log(Math.trunc(song.currentTime() / (60 / BPM)));
    //TODO scale width of bar to depend on the BPM

}


function restartSong(){
    background(0);
    beatRecord = [];
    amplitudeLog = [];
    song.jump(0); //doesn't work when the song is paused

}

function toggleSong() {
    if (song.isPlaying()) {
        song.pause();
    } else {
        song.play();
    }
}

function noteToFreq_(note){
   return ( 440*Math.pow(Math.pow(2, 1 / 12), note - 49) );
}

//Function currently disabled
//Something isn't working with this function... the default case always ends up getting returned. 
function strokeColor(note) {
    var defaultCase = false;
    let retval;
    switch (note % 12) {
        case 1: //A
            retval = color('midnightblue');
            break;
        case 2:
            retval = color('white');
            defaultcase = true;
            break;
        case 3: //B
            retval = color('blue');
            break;
        case 4: //C
            retval = color('darkorange');
            break;
        case 5:
            retval = color('white');
            defaultcase = true;
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

    /*
    if (defaultCase = true) {
        retval = color('white');
    }
    */
    
    return retval;
}

//I don't know why there's a 12-n, 5*n, 12-n, 5*n,... pattern
// 5*n = -7*n in mod_12. Is the modular arithmetic in the color expression going in reverse...?
// for odd number of accidentals, usually 6+
// odd accidentals  are normally their respective note number -6.
// even accidentals are normally the same number as their respective note between notes 0 thru 6
// even accidentals are normally 12 - the number of their respective note between notes 6 thru 12

function keySig0(){ //C
    prevKeySig = keySig;
    keySig = 0;
    if(keySig != prevKeySig){
/*Update the beat record*/

    }
}
function keySig1(){ //C#/Db
    keySig = 12-1;
}
function keySig2(){ //D
    keySig = 5*2;
}
function keySig3(){ //Eb
    keySig = 12-3;
}
function keySig4(){ //E
    keySig = 5*4;
}
function keySig5(){ //F
    keySig = 12-5;
}
function keySig6(){ //F#/Gb
    keySig = 5*6;
}
function keySig7(){ //G
    keySig = 12-7;
}
function keySig8(){ //G#/Ab
    keySig = 5*8;
}
function keySig9(){ //A
    keySig = 12-9;
}
function keySig10(){ //Bb
    keySig = 5*10;
}
function keySig11(){ // B/Cb
    keySig = 12-11;
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
