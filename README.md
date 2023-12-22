Gridquencer for Ableton
=======================

A recode of a sequencer using the Ableton Push controller to allow for quick generation of polymetric sequences. 

A re-imagining of the use of grid controllers for sequencing of polymetric, polyrhtyhmic, and polyphasic sequences. Sequences are represented as regions across the grid controller that are fitted to the amount of subdivisions in a beat. Regions may be freely defined at any point in the grid and subsequently resized or moved by the user. 


USE

Put the device onto a track. When that track is selected the device will take over the pads of the Push controller.


TODO
  - phase shift a sequence
  - implement mode switching (sequence, shift, move, select, mute)
  - create a heuristics to apply to note generation
  - load sequences from a track? 
  - Associate pads with note ids
  - Think about rests in a sequence 
  - move regions? 
  - adjust a note
  - use controlSurface API for connecting to Push instead of MIDI messages
  - write sequences into ableton clips
  - read clips into griquencer sequences

SORT OF COMPLETE FEATURES
  - adjust lights when sequence plays
  - colours: active beat, inactive beat
  - modify a region to adjust its form
  - manage each region to a specific sequencer

BUGS
  - modifying a clip should check for overlap
  - what if a region overlaps multipe regions?



REFERENCES
- https://forum.ableton.com/viewtopic.php?f=35&t=222861
- http://www.edsko.net/2020/12/26/trichords-part1/
- http://www.edsko.net/2020/12/27/trichords-part2/
- https://maxforlive.com/resources/M4L-Production-Guidelines.pdf
- https://cycling74.com/tutorials/ableton-push-programming-tutorials/
- https://cycling74.com/forums/using-control_surface-grab_control-is-not-putting-midi-out-where-i-expect-it-push2
- https://cycling74.com/forums/push-2-observe-control
- https://cycling74.com/forums/setting-and-getting-the-selected_track-from-liveapi

