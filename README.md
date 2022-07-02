# Music Visualizer ReadMe
https://briansgithub.github.io/music_visualizer/

## Overview 
The the primary objective of this project allow you to pick apart the melodies and chord progressions in songs of your choice so that you can understand what is musically going on within the song.  
The secondary objective of this project is to provide an engaging way to get exposure to seeing and hearing scale degrees in a simple, consistent way so that you can interpret songs regardless of which key the songs are played in. Basically, this program is for practicing ear training and getting exposure to music theory using songs of your choice.  

## Motivation
Sheet music and Synthesia piano “tutorial” videos are displayed in an absolute, literal way: that is, they will show you exactly which notes to play on a piano — C, D, E, F, F#, etc. This doesn’t let you transfer what you learn about one song to music to your understanding of music as a whole. You have to be proficient enough at reading sheet music or already skilled enough as a musicion in order to interpret the the notes in the context of the song (in which case, this program probably won’t be too useful for you). Thinking in terms of scale degrees allows you to generalize the patterns that you hear so that you can learn music at a higher level and to be able to recognize the same patterns in other songs and scales.  
 This is best accomplished when you are curious about a specific song or melody and ask questions like  
* “I just heard something catchy. What scale degrees were just played?”
* “What is the key signature of this song?” – Play with the key signature buttons to try and figure it out before looking it up. When "Dim accidentals" is selected, the key signature with the fewest dimmed accidentals is probably the key signature (or relative major of the key signature). When "Consonance Order" color scheme is selected, the key signature with the most red/orange notes (scale degrees one and five) is probably close to the right key signature, assuming the song is in a major key. 
* “What is the bass note being played?” (The lowest frequency note will give you a good indication what the most important scale degree that is currently being played)
* How does the bass note relate to the current key signature? 
 
## Regions of information on the page:  
### Frequency Spectrum 
![FFT_spectrum](https://raw.githubusercontent.com/briansgithub/music_visualizer/main/ReadMe%20Images/spectrum_bars.png)

* The frequency breakdown of what is currently being played, binned into the **88 notes on a piano**. 
  #### Interactions
   * Hover over a bar to see what note/scale degree its color represents. 
   * Click on a bar to change the currently selected key signature to that note/scale.
   * Use 'd' key to dim accidentals. 
### Cumulative Amplitudes
![cumulative_pitch_classes](https://raw.githubusercontent.com/briansgithub/music_visualizer/main/ReadMe%20Images/cumulative_bars.png)
* 12 bars: sums the volumes of all of the same notes. E.g., the volumes of all ‘C’ notes are summed into the same bar. Volumes of all ‘D’ notes are summed into the same bar.  Always displayed in scale degree order
  #### Interactions
   * Hover over a bar to see what note/scale degree its color represents. 
   * Click on a bar to change the currently selected key signature to that note/scale 
   * Use 'd' key to dim accidentals. 
### Beat Rectangles 
![beat_rectangles](https://raw.githubusercontent.com/briansgithub/music_visualizer/main/ReadMe%20Images/beat_rectangles.png)
* Based on the manually entered BPM. I recommend using a BPM that is at least twice the BPM of the song (Nyquist Rate), so that you never miss sampling a beat! 
* A new rectangle is created at the sampling rate entered in the BPM input box. The color of the rectangle indicates the loudest pitch that was being played at that instant in time. 
  #### Interactions 
   * Click on a rectangle to jump to that time in the song
   * Hover over a rectangle to see what note/scale degree its color represents. 
### Amplitude Graph 
* Overlaid on top of the beat rectangles.
* This is not too useful, but can be used to  see what part of the song is currently playing and distinguish different sections of the song. 
* Usually, the notes played on a beat are more important, so pay attention to the scale degrees played when there are spikes in the graph.
### Legend
Scale degree notation, dimmed accidentals
![legend_relative_dimmed accidentals](https://raw.githubusercontent.com/briansgithub/music_visualizer/main/ReadMe%20Images/legend1.png)  
Note names notation, dimmed accidentals
![legend_absolute_dimmed_accidentals](https://raw.githubusercontent.com/briansgithub/music_visualizer/main/ReadMe%20Images/legend2.png)  
Note names notation, undimmed accidentals
![legend_absolute_undimmed_accidentals](https://raw.githubusercontent.com/briansgithub/music_visualizer/main/ReadMe%20Images/legend3.png)
  * Displays the current major key signature selected. Labels can be switched between absolute notation (i.e, note names) and relative notation (i.e., scale degrees) using the ‘a’ key. 
  * Scale degrees are traditionally notated with a caret or “hat” above them, like $\hat{1}, \hat{2}, \hat{3}, \hat{4}, \hat{5}, \hat{6}, \hat{7}$.  
  * Absolute note labels currently use **integer notation** (see image below) to label the black notes on the piano (so sorry) due to limited text space and also because I haven’t gotten around to discriminating between enharmonic equivalent notes (e.g., C# and Db, E# and F) based on scale/context.

![integer_notation](https://raw.githubusercontent.com/briansgithub/music_visualizer/main/ReadMe%20Images/integer_notation.png)

## Instructions: 
1. Upload a song to analyze using the "Choose File" button or select the "Default Song" button.
2. Enter the BPM of the song in the text entry box. Or enter a different desired sample rate. Twice the BPM of the song is a good choice.  
3. Adjust the "Amplitude Difference Exaggeration" slider to make notes stand out more.  
4. Adjust "Linear Scaling" slider to make spectrum bars fit on the screen. 
5. A third slider is provided to make the notes in the cumulative bar graph stand out from each other more. 
6. Click the key signature buttons to change the coloring of the notes displayed.  
7. Explore the song using the mouse and keyboard shortcuts for the left hand. 
8. Use 'q' to add markers to loop a section of the song to analyze.  

## Keyboard Shortcuts: 
| Shortcut | Action |  
| -------- | ------ |
|SPACE| Play/Pause song|  
|→ | Jump + 3 seconds. |  
|← | Jump -3 seconds. |
|**a** | **A**bsolute (note names) vs. relative (Scale Degree) notation toggle|  
|**c** | **C**olor scheme cycle|  
|**d** | **D**im accidentals|  
|**e** | Linearly scale up bar heights.|
|Shift + **e** | **E**xaggerate the difference between bar heights.|
|**f** | **F**lat added to the key signature. Cycle backward 1 key signature.|  
|**q** | Insert loop markers.|  
|**r** | **R**estart song|  
|**s** | **S**harp added to key signature. Cycle forward 1 key signature.|  
|**w** | Linearly scale down bar heights.|
|Shift + **w** | **W**eaken the difference between bar heights.|

## Color Schemes: 
  ### Consonance Order
  * Note colors are based on the consonance of the interval that they make with respect to the tonic note. See below for how I define consonance. 
  * This is the color scheme I prefer. 
  ### Linear, chromatic 
  * Starts with red on the tonic and gets closer to blue as the scale ascends. Loops back to red on the tonic again. 
  ### Circle of Fifths
  * Redder pitch classes have a more sharp key signature. Bluer pitch classes have a more flat key signature. Magenta note has +/- 6 sharps/flats.
  * Not a very useful color scheme in my opinion, but I left it in.  

## Consonance
Consonance is approximated as when multiples of the smaller wavelength fit exactly within a multiple of the larger wavelength. The fewer wavelengths required before the nodes of the two waves overalap, the more consonant the interval. Specifically, consonance is defined here as the least common multiple of the numerator and denominator of the frequency ratio with respect to the tonic which define the interval in Just Intonation tuning. 
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
  
## Misc
* Snake_case is used only when Hungarian-like notation is used to indicate variable type in the form [type]_[identifier].  
* Hover Scrub added for now in lieu of an easy way to adjust tempo. 

## Todo:
* Implement minor scales and modes
* Implement ability to change tempo
* Indicate what the most prominant 3 pitch classes being played are to help identify chords. 
* Equalizer
* Prevent spectrum bars from clipping
* Proper note labels
