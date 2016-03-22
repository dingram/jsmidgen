# jsmidgen, a pure-JavaScript MIDI file library

## Introduction

jsmidgen (pronounced jay-smidgen or jer-smidgen) is a library that can be used
to generate MIDI files in JavaScript. It currently provides output as a string,
but there are plans to provide multiple output formats, including base64 and
data URI.

## Example Usage

The MIDI file structure is made up of one or more tracks, which contain one or
more events. These events can be note on/off events, instrument changes, tempo
changes, or more exotic things. A basic example is shown below:

    var fs = require('fs');
    var Midi = require('jsmidgen');

    var file = new Midi.File();
    var track = new Midi.Track();
    file.addTrack(track);

    track.addNote(0, 'c4', 64);
    track.addNote(0, 'd4', 64);
    track.addNote(0, 'e4', 64);
    track.addNote(0, 'f4', 64);
    track.addNote(0, 'g4', 64);
    track.addNote(0, 'a4', 64);
    track.addNote(0, 'b4', 64);
    track.addNote(0, 'c5', 64);

    fs.writeFileSync('test.mid', file.toBytes(), 'binary');

This example will create a MIDI file that will play an ascending C major scale,
starting at middle C.

## Fluid API

This library also has rudimentary support for a fluid (chained) style:

    file = new Midi.File();
    file
      .addTrack()

        .note(0, 'c4', 32)
        .note(0, 'd4', 32)
        .note(0, 'e4', 32)
        .note(0, 'f4', 32)
        .note(0, 'g4', 32)
        .note(0, 'a4', 32)
        .note(0, 'b4', 32)
        .note(0, 'c5', 32)

        // church organ
        .instrument(0, 0x13)

        // by skipping the third arguments, we create a chord (C major)
        .noteOn(0, 'c4', 64)
        .noteOn(0, 'e4')
        .noteOn(0, 'g4')

        // by skipping the third arguments again, we stop all notes at once
        .noteOff(0, 'c4', 47)
        .noteOff(0, 'e4')
        .noteOff(0, 'g4')

        //alternatively, a chord may be created with the addChord function
        .addChord(0, ['c4', 'e4', 'g4'], 64)

        .noteOn(0, 'c4', 1)
        .noteOn(0, 'e4')
        .noteOn(0, 'g4')
        .noteOff(0, 'c4', 384)
        .noteOff(0, 'e4')
        .noteOff(0, 'g4')
        ;

    fs.writeFileSync('test2.mid', file.toBytes(), 'binary');

Note the use of `setInstrument()` to change to a church organ midway through,
and the use of `addNoteOn()`/`addNoteOff()` to produce chords.

## Reference

### Midi.File

 - `addTrack()` - Add a new Track object to the file and return the new track
 - `addTrack(track)` - Add the given Track object to the file and return the file

### Midi.Track

Note: time and duration are specified in "ticks", and there is a hardcoded
value of 128 ticks per beat. This means that a quarter note has a duration of 128.

 - `addNote(channel, pitch, duration[, time[, velocity]])`

   **Add a new note with the given channel, pitch, and duration**
   - If `time` is given, delay that many ticks before starting the note
   - If `velocity` is given, strike the note with that velocity
 - `addNoteOn(channel, pitch[, time[, velocity]])`

   **Start a new note with the given channel and pitch**
   - If `time` is given, delay that many ticks before starting the note
   - If `velocity` is given, strike the note with that velocity
 - `addNoteOff(channel, pitch[, time[, velocity]])`

   **End a note with the given channel and pitch**
   - If `time` is given, delay that many ticks before ending the note
   - If `velocity` is given, strike the note with that velocity
 - `addChord(channel, chord[, velocity])`

   **Add a chord with the given channel and pitches**
   - Accepts an array of pitches to play as a chord
   - If `velocity` is given, strike the chord with that velocity
 - `setInstrument(channel, instrument[, time])`

   **Change the given channel to the given instrument**
   - If `time` is given, delay that many ticks before making the change
 - `setTempo(bpm[, time])`

   **Set the tempo to `bpm` beats per minute**
   - If `time` is given, delay that many ticks before making the change
