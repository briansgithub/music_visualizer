/// <reference path="./TSDef/p5.global-mode.d.ts" />
"use strict";

//TODO: 2 arrays for numerator and denominator of interval ratios and generalize to n tones by sorting by LCM(num,denom)
const intervalRatios = [1/1, 16/15, 9/8, 6/5, 5/4, 4/3, 45/32, 3/2, 8/5, 5/3, 9/5, 15/8];
const intervalsOrderedByConsonance= [0, 10, 8, 5, 4, 2, 11, 1, 6, 3, 7, 9]; 
const accidentalIntervals = [1, 3, 6, 8, 10];

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

function noteToFreq_(note) {
    return (440 * Math.pow(Math.pow(2, 1 / 12), note - 49));
}
