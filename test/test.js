var Midi = require('../lib/jsmidgen.js');
var fs = require('fs');

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

track.addNoteOn(0, 'c4', 128);
track.addNoteOn(0, 'e4');
track.addNoteOn(0, 'g4');
track.addNoteOff(0, 'c4', 128);
track.addNoteOff(0, 'e4');
track.addNoteOff(0, 'g4');

fs.writeFileSync('test.mid', file.toBytes(), 'binary');
