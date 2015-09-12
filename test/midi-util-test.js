var test = require('tape');
var Util = require('../lib/jsmidgen.js').Util;

test('Midi letter -> pitches', function(t) {
	var pitch = Util.midi_letter_pitches;

	t.equal(pitch.a, 21, 'Pitch for a should be 21');
	t.equal(pitch.b, 23, 'Pitch for b should be 23');
	t.equal(pitch.c, 12, 'Pitch for c should be 12');
	t.equal(pitch.d, 14, 'Pitch for d should be 14');
	t.equal(pitch.e, 16, 'Pitch for e should be 16');
	t.equal(pitch.f, 17, 'Pitch for f should be 17');
	t.equal(pitch.g, 19, 'Pitch for g should be 19');

	t.end();
});

// Check pitchFromNote against a wide range to ensure no additional functionality breaks it
test('Midi pitchFromNote', function(t) {
	var pitchFromNote = Util.midiPitchFromNote;

	t.equal(pitchFromNote('a1'), 33, 'Pitch of a1 is 33');
	t.equal(pitchFromNote('b2'), 47, 'Pitch of b2 is 47');
	t.equal(pitchFromNote('c3'), 48, 'Pitch of c3 is 48');
	t.equal(pitchFromNote('c#3'), 49, 'Pitch of c#3 is 49');
	t.equal(pitchFromNote('d4'), 62, 'Pitch of d4 is 62');
	t.equal(pitchFromNote('e5'), 76, 'Pitch of e5 is 76');
	t.equal(pitchFromNote('f6'), 89, 'Pitch of f6 is 89');
	t.equal(pitchFromNote('f#6'), 90, 'Pitch of f#6 is 90');
	t.equal(pitchFromNote('g7'), 103, 'Pitch of g7 is 103');
	t.equal(pitchFromNote('g#7'), 104, 'Pitch of g#7 is 104');

	// Check pitch with flattened notes
	t.equal(pitchFromNote('bb1'), 34, 'Pitch of a#1 is 34');
	t.equal(pitchFromNote('eb4'), 63, 'Pitch of d#4 is 63');

	// Check pitch with unconventional notes
	t.equal(pitchFromNote('fb4'), 64, 'Pitch for unconventional note fb4 is the same as e4');
	t.equal(pitchFromNote('e#4'), 65, 'Pitch for unconventional note e#4 is the same as f4');

	// Check pitch with cross octave numbers
	t.equal(pitchFromNote('b#2'), 48, 'Pitch for b#2 is the same as c3');
	t.equal(pitchFromNote('cb3'), 47, 'Pitch for cb3 is the same as b2');
	t.end();
});

test('Midi -> Util -> ensureMidiPitch', function(t) {
	var ensureMidiPitch = Util.ensureMidiPitch;

	t.equal(ensureMidiPitch(2), 2, 'Number input is accepted');
	t.equal(ensureMidiPitch('c3'), 48, 'A string of note name and octave is accepted');

	t.end();
});

test('Midi -> Util -> noteFromMidiPitch', function(t) {
	var noteFromMidiPitch = Util.noteFromMidiPitch;

	t.equal(noteFromMidiPitch(33), 'a1' , 'Note for Midi pitch 33 is a1')
	t.equal(noteFromMidiPitch(47), 'b2' , 'Note for Midi pitch 47 is b2')
	t.equal(noteFromMidiPitch(48), 'c3' , 'Note for Midi pitch 48 is c3')
	t.equal(noteFromMidiPitch(49), 'c#3' , 'Note for Midi pitch 49 is c#3')
	t.equal(noteFromMidiPitch(62), 'd4' , 'Note for Midi pitch 62 is d4')
	t.equal(noteFromMidiPitch(76), 'e5' , 'Note for Midi pitch 76 is e5')
	t.equal(noteFromMidiPitch(89), 'f6' , 'Note for Midi pitch 89 is f6')
	t.equal(noteFromMidiPitch(90), 'f#6' , 'Note for Midi pitch 90 is f#6')
	t.equal(noteFromMidiPitch(103), 'g7' , 'Note for Midi pitch 103 is g7')
	t.equal(noteFromMidiPitch(104), 'g#7' , 'Note for Midi pitch 104 is g#7')

	// Check with returnFlattened set to true
	t.equal(noteFromMidiPitch(34, true), 'bb1' , 'Note for Midi pitch 34 is bb1')
	t.equal(noteFromMidiPitch(63, true), 'eb4' , 'Note for Midi pitch 63 is eb4')
	t.end();
});

test('Midi -> Util -> mpqnFromBpm', function(t) {
	var mpqnFromBpm = Util.mpqnFromBpm;
	var mpqn = mpqnFromBpm(120);

	t.deepEquals(mpqn, [7, 161, 32], 'mpqnFromBpm returns expected array');

	t.end();
});

test('Midi -> Util -> bpmFromMpqn', function(t) {
	var bpm = Util.bpmFromMpqn(500000);

	t.equal(bpm, 120, 'bpmFromMpqn returns expected BPM');

	t.end();
});

test('Midi -> Util -> codes2Str', function(t) {
	t.equal(Util.codes2Str([65, 66, 67]), 'ABC', 'codes2Str returns expected output');

	t.end();
});

test('Midi -> Util -> str2Bytes', function(t) {
	t.equal(Util.str2Bytes('c')[0], 12, 'str2Bytes returns expected output');

	t.end();
});

test('Midi -> Util -> translateTickTime', function(t) {
	t.deepEquals(Util.translateTickTime(16), [16], 'translateTickTime translates tick to MIDI timestamp as expected');
	t.deepEquals(Util.translateTickTime(32), [32], 'translateTickTime translates tick to MIDI timestamp as expected');
	t.deepEquals(Util.translateTickTime(128), [129, 0], 'translateTickTime translates tick to MIDI timestamp as expected');
	t.deepEquals(Util.translateTickTime(512), [132, 0], 'translateTickTime translates tick to MIDI timestamp as expected');

	t.end();
});
