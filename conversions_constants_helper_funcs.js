/// <reference path="./TSDef/p5.global-mode.d.ts" />
"use strict";

//TODO: 2 arrays for numerator and denominator of interval ratios and generalize to n tones by sorting by LCM(num,denom)
const intervalRatios = [1/1, 16/15, 9/8, 6/5, 5/4, 4/3, 45/32, 3/2, 8/5, 5/3, 9/5, 15/8];
const intervalsOrderedByConsonance= [0, 10, 8, 5, 4, 2, 11, 1, 6, 3, 7, 9]; 
const accidentalIntervals = [1, 3, 6, 8, 10];
const diatonicIntervals = [0, 2, 4, 5, 7, 9, 11];

/*
  COF := Circle of Fifths
  x is solution to linear congruence equation 7*x = n (mod 12)
  x := # of accidentals (from 0-11, must be shifted to range -6 to +6)
  n := note index
  Solutions hardcoded as array. This can be generalized using the linear congruence
  for 7 and 12 as arbitrary constants a and n
*/
let intervalsOrderedByCOF= []; 

/* mod redefinition needed because javascript % operator returns negative integers (not positive) for negative dividends */
function mod(n, m) {
    return ((n % m) + m) % m;
  }

/*-1 for the fact that conventional note numbering starts at 1 (not 0). -3 for shifting the 1st (0th) note from 0 to 9*/
const kbOffset = mod(-3, 12);

/* Takes in a conventionally named note number (1-88) and outputs the corresponding pitch class in integer notation */
function conventionalNoteToPitchClass(conventionalNote) {
    return mod(conventionalNote - 1 + kbOffset, 12);
    
}

function pitchClassToRelativeInterval(pitchClass) {
    return mod(pitchClass - globalKeySigRoot, 12);

}
function relativeIntervalToPitchClass(relativeInterval) {
    return mod(relativeInterval + globalKeySigRoot, 12);

}

/* Translates a note from integer notation to the standard musical notation */
function numToSymbol(noteNumber) {
    let noteSymbol, s;
    switch (noteNumber) {
        case 0:
            s = 'C';
            break;
        
        case 2:
            s = 'D';
            break;
       
        case 4:
            s = 'E';
            break;
        case 5:
            s = 'F';
            break;
     
        case 7:
            s = 'G';
            break;
      
        case 9:
            s = 'A';
            break;
       
        case 11:
            s = 'B';
            break;
        default:
            s = noteNumber;
    }
    return noteSymbol = s;
}

function specificIntervalToScaleDegree(semitones) {
    let scaleDegree, SD;
    switch (semitones) {
        case 0:
            SD = '1';
            break;
        case 2:
            SD = '2';
            break;
        case 4:
            SD = '3';
            break;
        case 5:
            SD = '4';
            break;
        case 7:
            SD = '5';
            break;
        case 9:
            SD = '6';
            break;
        case 11:
            SD = '7';
            break;
        default:
            SD = "";
    }
    return scaleDegree = SD;
}

function rootToKeySigSymbol(root) {
    let noteSymbol, s;
    switch (root) {
        case 0:
            s = 'C';
            break;
        case 1:
            s = 'Db';
            break;
        case 2:
            s = 'D';
            break;
        case 3:
            s = 'Eb';
            break;
        case 4:
            s = 'E';
            break;
        case 5:
            s = 'F';
            break;
        case 6:
            s = 'F#';
            break;
        case 7:
            s = 'G';
            break;
        case 8:
            s = 'Ab';
            break;
        case 9:
            s = 'A';
            break;
        case 10:
            s = 'Bb';
            break;
        case 11:
            s = 'B';
            break;
        default:
            s = root;
    }
    return noteSymbol = s;
}

function noteToFreq_(note) {
    return (440 * Math.pow(Math.pow(2, 1 / 12), note - 49));
}

function displaySymbol(pitchClass, xPos, yPos, size, color = 'black'){
    textAlign(CENTER, CENTER);
    textSize(size);
    noStroke();
    fill(color);
    let relativeInterval = pitchClassToRelativeInterval(pitchClass);

    if (radio_noteLabelingConvention.value() == 'absolute') {
        textAlign(CENTER, CENTER);
        text(numToSymbol(pitchClass), xPos, yPos);
    }
    else if (radio_noteLabelingConvention.value() == 'relative') {
        const scaleDegree = specificIntervalToScaleDegree(mod(relativeInterval, 12));
        if (scaleDegree) {
            text(scaleDegree, xPos, yPos + .16 * size);
            textAlign(CENTER, BASELINE);
            text('^', xPos, yPos);
        }
    }
}

/* TODO: INFER CONTEXT OF ACCIDENTALS

let diatonic_ring = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
let major_scale_offsets = [0, 2, 4, 5, 7, 9, 11];
let added_accidentals = [11, 

function scale_generator(int_root = 0, mode = 'ionian') {
    let scale = [7];
    for (let degree = 0; degree < scale.length(); degree++) {
        scale[degree] = major_offsets[mod(degree + int_root, 12)];
    }
}

//indexed 0-11 instead of -6 to +6
//Gb over F# 
let root_to_accidentals_LUT = [0, -5, 2, -3, 4, -1, -6, 1, -4, 3, -2, 5];

function number_to_note(note_number, root = globalKeySigRoot, mode){
    let note_letter = diatonic_ring[0];
    if 

}

*/