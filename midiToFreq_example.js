/*

/// <reference path="../TSDef/p5.global-mode.d.ts" />
/// <reference path="../addons/p5.sound.js" />

"use strict";
//-----------------------------------------------------------------------------

let midiNotes = [60, 64, 67, 72];
let noteIndex = 0;
let midiVal, freq;

function setup() {
  let cnv = createCanvas(100, 100);
  cnv.mousePressed(startSound);
  osc = new p5.TriOsc();
  env = new p5.Envelope();
}

function draw() {
  background(220);
  text('tap to play', 10, 20);
  if (midiVal) {
    text('MIDI: ' + midiVal, 10, 40);
    text('Freq: ' + freq, 10, 60);
  }
}

function startSound() {
  // see also: userStartAudio();
  osc.start();

  midiVal = midiNotes[noteIndex % midiNotes.length];
  freq = midiToFreq(midiVal);
  osc.freq(freq);
  env.ramp(osc, 0, 1.0, 0);

  noteIndex++;
}
*/