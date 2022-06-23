# Music Visualizer ReadMe

1. Upload a song to analyze using the "Choose File" button or select the "Default Song" button.
2. Enter the BPM of the song in the text entry box.  
3. Adjust the "Amplitude Difference Exaggeration" slider to make notes stand out more.  
4. Adjust "Linear Scaling" slider to make spectrum bars fit on the screen. 
5. Click the key signature buttons to  change the coloring of the notes displayed.  

See the legend for the currently selected key signature and mapping of notes to colors.  

| Shortcut | LH Mode Shortcut| Action |  
| -------- | --------------- | ------ |
|SPACE|SPACE| play/pause song|  
|← |← | jump -3 seconds  |
|→ |→ | jump + 3 seconds |  
|**D** | K | **D**im accidentals|  
|**R** | R | **R**estart song|  
|**C** | N | **C**olor scheme cycle|  
|**A** | ; | **A**bsolute (note names) vs. relative (Scale Degree) notation toggle|  
|**S** | L | **S**harp added to key signature. Cycle forward 1 key signature.|  
|**F** | J | **F**lat added to the key signature. Cycle backward 1 key signature.|  

"Left-handed mode" mirrors all of the keyboard shortcuts (except 'r') on the keyboard.  

Colored rectangles are captured on each beat and indicate the loudest pitch class at that time.  
Left click on a Beat Rectangle to jump to that time in the song.  


"Linear, chromatic" coloring: starts with red on the tonic and gets more blue closer to the Major 7th.

"Circle of Fifths" coloring: redder pitch classes have a more sharp key signature. Bluer pitch classes have a more flat key signature. Magenta note has +/- 6 sharps/flats. 

"Consonance order" coloring: colors the notes based on the consonance of the interval they make with respect to the tonic.  
Consonance is defined here as the least common multiple of the numerator and denominator of the frequency ratio with respect to the tonic which define the interval in Just Intonation tuning.

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
