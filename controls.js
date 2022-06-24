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
        beatRecord[i].clicked(mouseX, mouseY);
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
    let retval;
    //    const rh = !checkbox_leftHandMode.checked();
    const rh = true;

    let jumpDur = 3; //seconds
    switch (key) {
        case ' ':
            toggleSong();
            retval = false;
            break;
        case (rh ? 'a' : ';'):
            //radio.selected() is bugged, per https://github.com/processing/p5.js/pull/5604
            let labelFormat = radio_noteLabelingConvention.value() == 'absolute' ? 'relative' : 'absolute';
            radio_noteLabelingConvention.selected(labelFormat);
            retval = false;
            break;
        case (rh ? 'c' : 'n'):
            let index = colorSchemes.indexOf(radio_colorScheme.value());
            radio_colorScheme.selected(colorSchemes[++index % colorSchemes.length]);
            updateColors();
            retval = false;
            break;
        case (rh ? 'd' : 'k'):
            if (checkbox_dimAccidentals.checked()) {
                checkbox_dimAccidentals.checked(false);
            } else {
                checkbox_dimAccidentals.checked(true);
            }
            //updateColors(); necessary, because for some reason, the function "checkbox_dimAccidentals.changed(...);" only activates when the checkbox is changed using mouse click
            updateColors();
            retval = false;
            break;
        case 'e':
            slider_exaggerationExponent.value(slider_exaggerationExponent.value() + .05);
            retval = false;
            break;
        case 'E':
            slider_barScale.value(slider_barScale.value() + .05);
            retval = false;
            break;
        case (rh ? 'f' : 'j'):
            globalKeySigRoot = mod(globalKeySigRoot - 7, 12);
            updateColors();
            retval = false;
            break;
        case ('h'):
            if (checkbox_hoverScrub.checked()) {
                checkbox_hoverScrub.checked(false);
            } else {
                checkbox_hoverScrub.checked(true);
            }
            retval = false;
            break;
        case 'q':
            if (song.currentTime() > jumpDur) {
                song.jump(song.currentTime() - jumpDur);
            }
            retval = false;
            break;
        case 'r':
            restartSong();
            break;
        case (rh ? 's' : 'l'):
            globalKeySigRoot = mod(globalKeySigRoot + 7, 12);
            updateColors();
            retval = false;
            break;
        case 'w':
            slider_exaggerationExponent.value(slider_exaggerationExponent.value() - .05);
            retval = false;
            break;
        case 'W':
            slider_barScale.value(slider_barScale.value() - .05);
            retval = false;
            break;
        default:
            console.log('Unrecognized \'key\' pressed');
    }

    switch (keyCode) {
        case LEFT_ARROW:
            if (song.currentTime() > jumpDur) {
                song.jump(song.currentTime() - jumpDur);
            }
            retval = false;
            break;
        case RIGHT_ARROW:
            if (song.duration() - song.currentTime() > jumpDur) {
                song.jump(song.currentTime() + jumpDur);
            }
            retval = false;
            break;
        default:
            console.log('Unrecognized \'keyCode\' pressed');
    }
    return retval; //blocks default browser keypress behavior
}



