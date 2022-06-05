/// <reference path="../lib/addons/p5.sound.js" />
// <reference path="../TSDef/p5.global-mode.d.ts" />

//"use strict";
//-----------------------------------------------------------------------------

var song;
var slider;
var sliderRate;
var sliderPan;

var button;
var fft;


function toggleSong() {
    if (song.isPlaying()) {
        song.pause();
    } else {
        song.play();
    }
}

function loaded() {
    button = createButton("play");
    button.mousePressed(toggleSong);
}

function setup() {
    createCanvas(800, 600);

    song = loadSound("Hikoukigumo.mp3", loaded);

    sliderVolume = createSlider(0, 1, 0.5, 0.01);
    sliderRate = createSlider(0, 3, 1, 0.01);
    sliderPan = createSlider(-1, 1, 0, 0.01);
    song.play();

    fft = new p5.FFT(0.5, Math.pow(2, 12));

    //song.setVolume(0.5);

}

function draw() {
    background(50);
    //  console.log(ball1.vel);
    song.setVolume(sliderVolume.value());
    song.rate(sliderRate.value());
    song.pan(sliderPan.value());

    var spectrum = fft.analyze();
    for (var x = 0; x < spectrum.length; x++) {
        var amp = spectrum[x];
        var y = map(amp, 0, 256, height, 0);
        line(x, height - 10, x, y - 10);
        strokeWeight(5);
    }
    stroke(255);
    noFill();

    stroke(255);
    noFill();
    //line(0, 0, width / 2, height / 2);
    console.log(fft);
    console.log(spectrum);
    console.log(spectrum.length);
}

