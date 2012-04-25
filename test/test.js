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

track.setInstrument(0, 0x13);

track.addNoteOn(0, 'c4', 64);
track.addNoteOn(0, 'e4');
track.addNoteOn(0, 'g4');
track.addNoteOff(0, 'c4', 47);
track.addNoteOff(0, 'e4');
track.addNoteOff(0, 'g4');

track.addNoteOn(0, 'c4', 1);
track.addNoteOn(0, 'e4');
track.addNoteOn(0, 'g4');
track.addNoteOff(0, 'c4', 384);
track.addNoteOff(0, 'e4');
track.addNoteOff(0, 'g4');

fs.writeFileSync('test.mid', file.toBytes(), 'binary');

file = new Midi.File();
file
	.addTrack()

		.addNote(0, 'c4', 32)
		.addNote(0, 'd4', 32)
		.addNote(0, 'e4', 32)
		.addNote(0, 'f4', 32)
		.addNote(0, 'g4', 32)
		.addNote(0, 'a4', 32)
		.addNote(0, 'b4', 32)
		.addNote(0, 'c5', 32)

		.setInstrument(0, 0x13)

		.addNoteOn(0, 'c4', 64)
		.addNoteOn(0, 'e4')
		.addNoteOn(0, 'g4')
		.addNoteOff(0, 'c4', 47)
		.addNoteOff(0, 'e4')
		.addNoteOff(0, 'g4')

		.addNoteOn(0, 'c4', 1)
		.addNoteOn(0, 'e4')
		.addNoteOn(0, 'g4')
		.addNoteOff(0, 'c4', 384)
		.addNoteOff(0, 'e4')
		.addNoteOff(0, 'g4')
		;

fs.writeFileSync('test2.mid', file.toBytes(), 'binary');
