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
/// <reference path="main.js" />
"use strict";

function mousePressed() {
    for (let i = 0; i < beatRecord.length; i++) {
        beatRecord[i].clicked();
    }
}

/*
The keyPressed() function is called once every time a key is pressed. 
The keyCode for the key that was pressed is stored in the keyCode variable.

For non-ASCII keys, use the keyCode variable. 
You can check if the keyCode equals BACKSPACE, DELETE, ENTER, RETURN, TAB, ESCAPE, SHIFT, CONTROL, OPTION, ALT, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW.

For ASCII keys, the key that was pressed is stored in the key variable. 
However, it does not distinguish between uppercase and lowercase. 
For this reason, it is recommended to use keyTyped() to read the key variable, in which the case of the variable will be distinguished.

Because of how operating systems handle key repeats, holding down a key may cause multiple calls to keyTyped() (and keyReleased() as well). 
The rate of repeat is set by the operating system and how each computer is configured.

Browsers may have different default behaviors attached to various key events. 
To prevent any default behavior for this event, add "return false" to the end of the method.
*/
function keyPressed() {
    switch (key) {
        case ' ':
            toggleSong();
            break;
        case 'd':
            if (checkbox_dimAccidentals.checked()) {
                checkbox_dimAccidentals.checked(false);
            } else {
                checkbox_dimAccidentals.checked(true);
            }
            break;
        default:
            console.log('Unrecognized \'key\' pressed');
    }

    let jumpDur = 3; //seconds
    switch (keyCode) {
        case LEFT_ARROW:
            if (song.currentTime() > jumpDur) {
                song.jump(song.currentTime() - jumpDur);
            }
            break;
        case RIGHT_ARROW:
            if (song.duration() - song.currentTime() > jumpDur) {
                song.jump(song.currentTime() + jumpDur);
            }
            break;
        default:
            console.log('Unrecognized \'keyCode\' pressed');
    }
    //return false; //blocks default browser keypress behavior
}