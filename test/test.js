var Midi = require('../lib/jsmidgen.js');
var fs = require('fs');

var file = new Midi.File();
var track = new Midi.Track();
file.addTrack(track);

track.addNote(0, 0x3C, 64);
track.addNote(0, 0x3E, 64);
track.addNote(0, 0x40, 64);
track.addNote(0, 0x41, 64);
track.addNote(0, 0x43, 64);
track.addNote(0, 0x45, 64);
track.addNote(0, 0x47, 64);
track.addNote(0, 0x48, 64);

track.addNoteOn(0, 0x3C, 128);
track.addNoteOn(0, 0x40);
track.addNoteOn(0, 0x43);
track.addNoteOff(0, 0x3C, 128);
track.addNoteOff(0, 0x40);
track.addNoteOff(0, 0x43);

fs.writeFileSync('test.mid', file.toBytes(), 'binary');
