# Music Visualizer ReadMe

1. Upload a song to analyze using the "Choose File" button or select the "Default Song" button.
2. Enter the BPM of the song in the text entry box.  
3. Adjust the "Amplitude Difference Exaggeration" slider to make notes stand out more.  
4. Adjust "Linear Scaling" slider to make spectrum bars fit on the screen. 
5. Click the key signature buttons to  change the coloring of the notes displayed.  

Colored rectangles are captured on each beat. The color indicates the loudest pitch class at that time.  
See the legend for the mapping of notes to colors and the currently selected key signature.  

Interactions: 
* Left click on a Beat Rectangle to jump to that time in the song.  
* Hover over objects to inspect their pitch class. 

| Shortcut | Action |  
| -------- | ------ |
|SPACE| Play/Pause song|  
|→ | Jump + 3 seconds. |  
|← | Jump -3 seconds. |
|**a** | **A**bsolute (note names) vs. relative (Scale Degree) notation toggle|  
|**c** | **C**olor scheme cycle|  
|**d** | **D**im accidentals|  
|**e** | **E**xaggerate the difference between bar heights.|
|Shift + **e** | Linearly scale up bar heights.|
|**f** | **F**lat added to the key signature. Cycle backward 1 key signature.|  
|**q** | Jump -3 seconds. Same as ←|  
|**r** | **R**estart song|  
|**s** | **S**harp added to key signature. Cycle forward 1 key signature.|  
|**w** | **W**eaken the difference between bar heights.|
|Shift + **W** | Linearly scale down bar heights.|

Color Schemes: 
* "Linear, chromatic" coloring: starts with red on the tonic and gets more blue closer to the Major 7th.
* "Consonance order" coloring: colors the notes based on the consonance of the interval they make with respect to the tonic note. Consonance is approximated as when multiples of the smaller wavelength fit exactly within a multiple of the larger wavelength. The fewer wavelengths required before the nodes of the two waves overalap, the more consonant the interval. Specifically, consonance is defined here as the least common multiple of the numerator and denominator of the frequency ratio with respect to the tonic which define the interval in Just Intonation tuning. 
* "Circle of Fifths" coloring: redder pitch classes have a more sharp key signature. Bluer pitch classes have a more flat key signature. Magenta note has +/- 6 sharps/flats. 

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
  
Amplitude graph is overlaid on the beat record only for reference and aesthetics.  
Snake_case is used only when Hungarian Notation is used to indicate variable type in the form [type]_[identifier].  

Hover Scrub added for now in lieu of an easy way to adjust tempo. 
