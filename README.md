# Music Visualizer Readme

1. Upload a song to analyze using the "Choose File" button or select the "Default Song" button.
2. Enter the BPM of the song in the text entry box.  
3. Adjust the "Amplitude Difference Exaggeration" slider to make notes stand out more.  
4. Adjust "Linear Scaling" slider to make spectrum bars fit on the screen. 
5. Click the key signature buttons to  change the coloring of the notes displayed.  

See the legend for the currently selected key signature and mapping of notes to colors.  

SPACE: play/pause song.  
LEFT_ARROW: jump -3 seconds  
RIGHT_ARROW: jump + 3 seconds  

**d**/k: **d**im accidentals   
**r**: **r**estart song  
**c**/n: **c**olor scheme cycle  
**a**/;: **a**bsolute (note names) vs. relative (Scale Degree) notation toggle
**s**/l: **s**harp added to key signature. Cycle forward 1 key signature.
**f**/j: **f**lat added to the key signature. Cycle backward 1 key signature.
"Left-handed mode" mirrors keyboard shortcuts (except 'r') on the keyboard.  

Colored rectangles are captured on each beat and indicate the loudest pitch class at that time.  
Left click on a Beat Rectangle to jump to that time in the song.  

"Consonance order" colors the notes based on the consonance of the interval they make with respect to the tonic.  
Consonance is defined as being LCM(num, den) where num and den are the numerator and denominator of the frequency ratio that the interval makes with respect to the tonic in Just Intonation tuning.

|Interval	    |num	|den	|LCM    |  
| ---------     | ----- | ----- | ----- |
|Unison         |   1	|1	    |1      | 
|Perfect 5th    |   3	|2	    |6      | 
|Perfect 4th    |	4	|3	    |12     | 
|Major 6th	    |   5	|3	    |15     | 
|Major 3rd	    |   5	|4	    |20     | 
|minor 3rd	    |   6	|5	    |30     | 
|minor 6th	    |   8	|5	    |40     | 
|minor 7th	    |   9	|5	    |45     | 
|Major 2nd	    |   9	|8	    |72     | 
|Major 7th	    |   15  |8	    |120    | 
|minor 2nd	    |   16  |15	    |240    | 
|tritone	    |   45	|32	    |1440   | 
  
camelCase is used for all identifiers except when Hungarian variable naming notation is used to indicate variable type. Hungarian notation is used with snake case separating [type]_[identifier].  
