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

test('Midi pitches -> letter', function(t) {
	var letter = Util.midi_pitches_letter;

	t.equal(letter[12], 'c', 'Letter for pitch 12 should be c');
	t.equal(letter[13], 'c#', 'Letter for pitch 12 should be c#');
	t.equal(letter[14], 'd', 'Letter for pitch 12 should be d');
	t.equal(letter[15], 'd#', 'Letter for pitch 12 should be d#');
	t.equal(letter[16], 'e', 'Letter for pitch 12 should be e');
	t.equal(letter[17], 'f', 'Letter for pitch 12 should be f');
	t.equal(letter[18], 'f#', 'Letter for pitch 12 should be f#');
	t.equal(letter[19], 'g', 'Letter for pitch 12 should be g');
	t.equal(letter[20], 'g#', 'Letter for pitch 12 should be g#');
	t.equal(letter[21], 'a', 'Letter for pitch 12 should be a');
	t.equal(letter[22], 'a#', 'Letter for pitch 12 should be a#');
	t.equal(letter[23], 'b', 'Letter for pitch 12 should be b');

	t.end();
});

test('Midi flattened notes', function(t) {
	var flattened = Util.midi_flattened_notes;

	t.equal(flattened['a#'], 'bb', 'a# flattened is bb');
	t.equal(flattened['c#'], 'db', 'c# flattened is db');
	t.equal(flattened['d#'], 'eb', 'd# flattened is eb');
	t.equal(flattened['f#'], 'gb', 'f# flattened is gb');
	t.equal(flattened['g#'], 'ab', 'g# flattened is ab');

	t.end();
});

// Check pitchFromNote against a wide range to ensure no additional functionality breaks it
test('Midi pitchFromNote', function(t) {
	var pitchFromNote = Util.midiPitchFromNote;

	t.equal(pitchFromNote('c0'), 12, 'Pitch of c0 is 12');
	t.equal(pitchFromNote('c#0'), 13, 'Pitch of c#0 is 13');
	t.equal(pitchFromNote('d0'), 14, 'Pitch of d0 is 14');
	t.equal(pitchFromNote('d#0'), 15, 'Pitch of d#0 is 15');
	t.equal(pitchFromNote('e0'), 16, 'Pitch of e0 is 16');
	t.equal(pitchFromNote('f0'), 17, 'Pitch of f0 is 17');
	t.equal(pitchFromNote('f#0'), 18, 'Pitch of f#0 is 18');
	t.equal(pitchFromNote('g0'), 19, 'Pitch of g0 is 19');
	t.equal(pitchFromNote('g#0'), 20, 'Pitch of g#0 is 20');
	t.equal(pitchFromNote('a0'), 21, 'Pitch of a0 is 21');
	t.equal(pitchFromNote('a#0'), 22, 'Pitch of a#0 is 22');
	t.equal(pitchFromNote('b0'), 23, 'Pitch of b0 is 23');
	t.equal(pitchFromNote('c1'), 24, 'Pitch of c1 is 24');
	t.equal(pitchFromNote('c#1'), 25, 'Pitch of c#1 is 25');
	t.equal(pitchFromNote('d1'), 26, 'Pitch of d1 is 26');
	t.equal(pitchFromNote('d#1'), 27, 'Pitch of d#1 is 27');
	t.equal(pitchFromNote('e1'), 28, 'Pitch of e1 is 28');
	t.equal(pitchFromNote('f1'), 29, 'Pitch of f1 is 29');
	t.equal(pitchFromNote('f#1'), 30, 'Pitch of f#1 is 30');
	t.equal(pitchFromNote('g1'), 31, 'Pitch of g1 is 31');
	t.equal(pitchFromNote('g#1'), 32, 'Pitch of g#1 is 32');
	t.equal(pitchFromNote('a1'), 33, 'Pitch of a1 is 33');
	t.equal(pitchFromNote('a#1'), 34, 'Pitch of a#1 is 34');
	t.equal(pitchFromNote('b1'), 35, 'Pitch of b1 is 35');
	t.equal(pitchFromNote('c2'), 36, 'Pitch of c2 is 36');
	t.equal(pitchFromNote('c#2'), 37, 'Pitch of c#2 is 37');
	t.equal(pitchFromNote('d2'), 38, 'Pitch of d2 is 38');
	t.equal(pitchFromNote('d#2'), 39, 'Pitch of d#2 is 39');
	t.equal(pitchFromNote('e2'), 40, 'Pitch of e2 is 40');
	t.equal(pitchFromNote('f2'), 41, 'Pitch of f2 is 41');
	t.equal(pitchFromNote('f#2'), 42, 'Pitch of f#2 is 42');
	t.equal(pitchFromNote('g2'), 43, 'Pitch of g2 is 43');
	t.equal(pitchFromNote('g#2'), 44, 'Pitch of g#2 is 44');
	t.equal(pitchFromNote('a2'), 45, 'Pitch of a2 is 45');
	t.equal(pitchFromNote('a#2'), 46, 'Pitch of a#2 is 46');
	t.equal(pitchFromNote('b2'), 47, 'Pitch of b2 is 47');
	t.equal(pitchFromNote('c3'), 48, 'Pitch of c3 is 48');
	t.equal(pitchFromNote('c#3'), 49, 'Pitch of c#3 is 49');
	t.equal(pitchFromNote('d3'), 50, 'Pitch of d3 is 50');
	t.equal(pitchFromNote('d#3'), 51, 'Pitch of d#3 is 51');
	t.equal(pitchFromNote('e3'), 52, 'Pitch of e3 is 52');
	t.equal(pitchFromNote('f3'), 53, 'Pitch of f3 is 53');
	t.equal(pitchFromNote('f#3'), 54, 'Pitch of f#3 is 54');
	t.equal(pitchFromNote('g3'), 55, 'Pitch of g3 is 55');
	t.equal(pitchFromNote('g#3'), 56, 'Pitch of g#3 is 56');
	t.equal(pitchFromNote('a3'), 57, 'Pitch of a3 is 57');
	t.equal(pitchFromNote('a#3'), 58, 'Pitch of a#3 is 58');
	t.equal(pitchFromNote('b3'), 59, 'Pitch of b3 is 59');
	t.equal(pitchFromNote('c4'), 60, 'Pitch of c4 is 60');
	t.equal(pitchFromNote('c#4'), 61, 'Pitch of c#4 is 61');
	t.equal(pitchFromNote('d4'), 62, 'Pitch of d4 is 62');
	t.equal(pitchFromNote('d#4'), 63, 'Pitch of d#4 is 63');
	t.equal(pitchFromNote('e4'), 64, 'Pitch of e4 is 64');
	t.equal(pitchFromNote('f4'), 65, 'Pitch of f4 is 65');
	t.equal(pitchFromNote('f#4'), 66, 'Pitch of f#4 is 66');
	t.equal(pitchFromNote('g4'), 67, 'Pitch of g4 is 67');
	t.equal(pitchFromNote('g#4'), 68, 'Pitch of g#4 is 68');
	t.equal(pitchFromNote('a4'), 69, 'Pitch of a4 is 69');
	t.equal(pitchFromNote('a#4'), 70, 'Pitch of a#4 is 70');
	t.equal(pitchFromNote('b4'), 71, 'Pitch of b4 is 71');
	t.equal(pitchFromNote('c5'), 72, 'Pitch of c5 is 72');
	t.equal(pitchFromNote('c#5'), 73, 'Pitch of c#5 is 73');
	t.equal(pitchFromNote('d5'), 74, 'Pitch of d5 is 74');
	t.equal(pitchFromNote('d#5'), 75, 'Pitch of d#5 is 75');
	t.equal(pitchFromNote('e5'), 76, 'Pitch of e5 is 76');
	t.equal(pitchFromNote('f5'), 77, 'Pitch of f5 is 77');
	t.equal(pitchFromNote('f#5'), 78, 'Pitch of f#5 is 78');
	t.equal(pitchFromNote('g5'), 79, 'Pitch of g5 is 79');
	t.equal(pitchFromNote('g#5'), 80, 'Pitch of g#5 is 80');
	t.equal(pitchFromNote('a5'), 81, 'Pitch of a5 is 81');
	t.equal(pitchFromNote('a#5'), 82, 'Pitch of a#5 is 82');
	t.equal(pitchFromNote('b5'), 83, 'Pitch of b5 is 83');
	t.equal(pitchFromNote('c6'), 84, 'Pitch of c6 is 84');
	t.equal(pitchFromNote('c#6'), 85, 'Pitch of c#6 is 85');
	t.equal(pitchFromNote('d6'), 86, 'Pitch of d6 is 86');
	t.equal(pitchFromNote('d#6'), 87, 'Pitch of d#6 is 87');
	t.equal(pitchFromNote('e6'), 88, 'Pitch of e6 is 88');
	t.equal(pitchFromNote('f6'), 89, 'Pitch of f6 is 89');
	t.equal(pitchFromNote('f#6'), 90, 'Pitch of f#6 is 90');
	t.equal(pitchFromNote('g6'), 91, 'Pitch of g6 is 91');
	t.equal(pitchFromNote('g#6'), 92, 'Pitch of g#6 is 92');
	t.equal(pitchFromNote('a6'), 93, 'Pitch of a6 is 93');
	t.equal(pitchFromNote('a#6'), 94, 'Pitch of a#6 is 94');
	t.equal(pitchFromNote('b6'), 95, 'Pitch of b6 is 95');
	t.equal(pitchFromNote('c7'), 96, 'Pitch of c7 is 96');
	t.equal(pitchFromNote('c#7'), 97, 'Pitch of c#7 is 97');
	t.equal(pitchFromNote('d7'), 98, 'Pitch of d7 is 98');
	t.equal(pitchFromNote('d#7'), 99, 'Pitch of d#7 is 99');
	t.equal(pitchFromNote('e7'), 100, 'Pitch of e7 is 100');
	t.equal(pitchFromNote('f7'), 101, 'Pitch of f7 is 101');
	t.equal(pitchFromNote('f#7'), 102, 'Pitch of f#7 is 102');
	t.equal(pitchFromNote('g7'), 103, 'Pitch of g7 is 103');
	t.equal(pitchFromNote('g#7'), 104, 'Pitch of g#7 is 104');
	t.equal(pitchFromNote('a7'), 105, 'Pitch of a7 is 105');
	t.equal(pitchFromNote('a#7'), 106, 'Pitch of a#7 is 106');
	t.equal(pitchFromNote('b7'), 107, 'Pitch of b7 is 107');
	t.equal(pitchFromNote('c8'), 108, 'Pitch of c8 is 108');
	t.equal(pitchFromNote('c#8'), 109, 'Pitch of c#8 is 109');
	t.equal(pitchFromNote('d8'), 110, 'Pitch of d8 is 110');
	t.equal(pitchFromNote('d#8'), 111, 'Pitch of d#8 is 111');
	t.equal(pitchFromNote('e8'), 112, 'Pitch of e8 is 112');
	t.equal(pitchFromNote('f8'), 113, 'Pitch of f8 is 113');
	t.equal(pitchFromNote('f#8'), 114, 'Pitch of f#8 is 114');
	t.equal(pitchFromNote('g8'), 115, 'Pitch of g8 is 115');
	t.equal(pitchFromNote('g#8'), 116, 'Pitch of g#8 is 116');
	t.equal(pitchFromNote('a8'), 117, 'Pitch of a8 is 117');
	t.equal(pitchFromNote('a#8'), 118, 'Pitch of a#8 is 118');
	t.equal(pitchFromNote('b8'), 119, 'Pitch of b8 is 119');
	t.equal(pitchFromNote('c9'), 120, 'Pitch of c9 is 120');
	t.equal(pitchFromNote('c#9'), 121, 'Pitch of c#9 is 121');
	t.equal(pitchFromNote('d9'), 122, 'Pitch of d9 is 122');
	t.equal(pitchFromNote('d#9'), 123, 'Pitch of d#9 is 123');
	t.equal(pitchFromNote('e9'), 124, 'Pitch of e9 is 124');
	t.equal(pitchFromNote('f9'), 125, 'Pitch of f9 is 125');
	t.equal(pitchFromNote('f#9'), 126, 'Pitch of f#9 is 126');
	t.equal(pitchFromNote('g9'), 127, 'Pitch of g9 is 127');
	t.equal(pitchFromNote('g#9'), 128, 'Pitch of g#9 is 128');
	t.equal(pitchFromNote('a9'), 129, 'Pitch of a9 is 129');
	t.equal(pitchFromNote('a#9'), 130, 'Pitch of a#9 is 130');
	t.equal(pitchFromNote('b9'), 131, 'Pitch of b9 is 131');
	t.equal(pitchFromNote('c10'), 132, 'Pitch of c10 is 132');

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

	t.equal(noteFromMidiPitch(21), 'a0' , 'Note for Midi pitch 21 is a0')
	t.equal(noteFromMidiPitch(22), 'a#0' , 'Note for Midi pitch 22 is a#0')
	t.equal(noteFromMidiPitch(23), 'b0' , 'Note for Midi pitch 23 is b0')
	t.equal(noteFromMidiPitch(24), 'c1' , 'Note for Midi pitch 24 is c1')
	t.equal(noteFromMidiPitch(25), 'c#1' , 'Note for Midi pitch 25 is c#1')
	t.equal(noteFromMidiPitch(26), 'd1' , 'Note for Midi pitch 26 is d1')
	t.equal(noteFromMidiPitch(27), 'd#1' , 'Note for Midi pitch 27 is d#1')
	t.equal(noteFromMidiPitch(28), 'e1' , 'Note for Midi pitch 28 is e1')
	t.equal(noteFromMidiPitch(29), 'f1' , 'Note for Midi pitch 29 is f1')
	t.equal(noteFromMidiPitch(30), 'f#1' , 'Note for Midi pitch 30 is f#1')
	t.equal(noteFromMidiPitch(31), 'g1' , 'Note for Midi pitch 31 is g1')
	t.equal(noteFromMidiPitch(32), 'g#1' , 'Note for Midi pitch 32 is g#1')
	t.equal(noteFromMidiPitch(33), 'a1' , 'Note for Midi pitch 33 is a1')
	t.equal(noteFromMidiPitch(34), 'a#1' , 'Note for Midi pitch 34 is a#1')
	t.equal(noteFromMidiPitch(35), 'b1' , 'Note for Midi pitch 35 is b1')
	t.equal(noteFromMidiPitch(36), 'c2' , 'Note for Midi pitch 36 is c2')
	t.equal(noteFromMidiPitch(37), 'c#2' , 'Note for Midi pitch 37 is c#2')
	t.equal(noteFromMidiPitch(38), 'd2' , 'Note for Midi pitch 38 is d2')
	t.equal(noteFromMidiPitch(39), 'd#2' , 'Note for Midi pitch 39 is d#2')
	t.equal(noteFromMidiPitch(40), 'e2' , 'Note for Midi pitch 40 is e2')
	t.equal(noteFromMidiPitch(41), 'f2' , 'Note for Midi pitch 41 is f2')
	t.equal(noteFromMidiPitch(42), 'f#2' , 'Note for Midi pitch 42 is f#2')
	t.equal(noteFromMidiPitch(43), 'g2' , 'Note for Midi pitch 43 is g2')
	t.equal(noteFromMidiPitch(44), 'g#2' , 'Note for Midi pitch 44 is g#2')
	t.equal(noteFromMidiPitch(45), 'a2' , 'Note for Midi pitch 45 is a2')
	t.equal(noteFromMidiPitch(46), 'a#2' , 'Note for Midi pitch 46 is a#2')
	t.equal(noteFromMidiPitch(47), 'b2' , 'Note for Midi pitch 47 is b2')
	t.equal(noteFromMidiPitch(48), 'c3' , 'Note for Midi pitch 48 is c3')
	t.equal(noteFromMidiPitch(49), 'c#3' , 'Note for Midi pitch 49 is c#3')
	t.equal(noteFromMidiPitch(50), 'd3' , 'Note for Midi pitch 50 is d3')
	t.equal(noteFromMidiPitch(51), 'd#3' , 'Note for Midi pitch 51 is d#3')
	t.equal(noteFromMidiPitch(52), 'e3' , 'Note for Midi pitch 52 is e3')
	t.equal(noteFromMidiPitch(53), 'f3' , 'Note for Midi pitch 53 is f3')
	t.equal(noteFromMidiPitch(54), 'f#3' , 'Note for Midi pitch 54 is f#3')
	t.equal(noteFromMidiPitch(55), 'g3' , 'Note for Midi pitch 55 is g3')
	t.equal(noteFromMidiPitch(56), 'g#3' , 'Note for Midi pitch 56 is g#3')
	t.equal(noteFromMidiPitch(57), 'a3' , 'Note for Midi pitch 57 is a3')
	t.equal(noteFromMidiPitch(58), 'a#3' , 'Note for Midi pitch 58 is a#3')
	t.equal(noteFromMidiPitch(59), 'b3' , 'Note for Midi pitch 59 is b3')
	t.equal(noteFromMidiPitch(60), 'c4' , 'Note for Midi pitch 60 is c4')
	t.equal(noteFromMidiPitch(61), 'c#4' , 'Note for Midi pitch 61 is c#4')
	t.equal(noteFromMidiPitch(62), 'd4' , 'Note for Midi pitch 62 is d4')
	t.equal(noteFromMidiPitch(63), 'd#4' , 'Note for Midi pitch 63 is d#4')
	t.equal(noteFromMidiPitch(64), 'e4' , 'Note for Midi pitch 64 is e4')
	t.equal(noteFromMidiPitch(65), 'f4' , 'Note for Midi pitch 65 is f4')
	t.equal(noteFromMidiPitch(66), 'f#4' , 'Note for Midi pitch 66 is f#4')
	t.equal(noteFromMidiPitch(67), 'g4' , 'Note for Midi pitch 67 is g4')
	t.equal(noteFromMidiPitch(68), 'g#4' , 'Note for Midi pitch 68 is g#4')
	t.equal(noteFromMidiPitch(69), 'a4' , 'Note for Midi pitch 69 is a4')
	t.equal(noteFromMidiPitch(70), 'a#4' , 'Note for Midi pitch 70 is a#4')
	t.equal(noteFromMidiPitch(71), 'b4' , 'Note for Midi pitch 71 is b4')
	t.equal(noteFromMidiPitch(72), 'c5' , 'Note for Midi pitch 72 is c5')
	t.equal(noteFromMidiPitch(73), 'c#5' , 'Note for Midi pitch 73 is c#5')
	t.equal(noteFromMidiPitch(74), 'd5' , 'Note for Midi pitch 74 is d5')
	t.equal(noteFromMidiPitch(75), 'd#5' , 'Note for Midi pitch 75 is d#5')
	t.equal(noteFromMidiPitch(76), 'e5' , 'Note for Midi pitch 76 is e5')
	t.equal(noteFromMidiPitch(77), 'f5' , 'Note for Midi pitch 77 is f5')
	t.equal(noteFromMidiPitch(78), 'f#5' , 'Note for Midi pitch 78 is f#5')
	t.equal(noteFromMidiPitch(79), 'g5' , 'Note for Midi pitch 79 is g5')
	t.equal(noteFromMidiPitch(80), 'g#5' , 'Note for Midi pitch 80 is g#5')
	t.equal(noteFromMidiPitch(81), 'a5' , 'Note for Midi pitch 81 is a5')
	t.equal(noteFromMidiPitch(82), 'a#5' , 'Note for Midi pitch 82 is a#5')
	t.equal(noteFromMidiPitch(83), 'b5' , 'Note for Midi pitch 83 is b5')
	t.equal(noteFromMidiPitch(84), 'c6' , 'Note for Midi pitch 84 is c6')
	t.equal(noteFromMidiPitch(85), 'c#6' , 'Note for Midi pitch 85 is c#6')
	t.equal(noteFromMidiPitch(86), 'd6' , 'Note for Midi pitch 86 is d6')
	t.equal(noteFromMidiPitch(87), 'd#6' , 'Note for Midi pitch 87 is d#6')
	t.equal(noteFromMidiPitch(88), 'e6' , 'Note for Midi pitch 88 is e6')
	t.equal(noteFromMidiPitch(89), 'f6' , 'Note for Midi pitch 89 is f6')
	t.equal(noteFromMidiPitch(90), 'f#6' , 'Note for Midi pitch 90 is f#6')
	t.equal(noteFromMidiPitch(91), 'g6' , 'Note for Midi pitch 91 is g6')
	t.equal(noteFromMidiPitch(92), 'g#6' , 'Note for Midi pitch 92 is g#6')
	t.equal(noteFromMidiPitch(93), 'a6' , 'Note for Midi pitch 93 is a6')
	t.equal(noteFromMidiPitch(94), 'a#6' , 'Note for Midi pitch 94 is a#6')
	t.equal(noteFromMidiPitch(95), 'b6' , 'Note for Midi pitch 95 is b6')
	t.equal(noteFromMidiPitch(96), 'c7' , 'Note for Midi pitch 96 is c7')
	t.equal(noteFromMidiPitch(97), 'c#7' , 'Note for Midi pitch 97 is c#7')
	t.equal(noteFromMidiPitch(98), 'd7' , 'Note for Midi pitch 98 is d7')
	t.equal(noteFromMidiPitch(99), 'd#7' , 'Note for Midi pitch 99 is d#7')
	t.equal(noteFromMidiPitch(100), 'e7' , 'Note for Midi pitch 100 is e7')
	t.equal(noteFromMidiPitch(101), 'f7' , 'Note for Midi pitch 101 is f7')
	t.equal(noteFromMidiPitch(102), 'f#7' , 'Note for Midi pitch 102 is f#7')
	t.equal(noteFromMidiPitch(103), 'g7' , 'Note for Midi pitch 103 is g7')
	t.equal(noteFromMidiPitch(104), 'g#7' , 'Note for Midi pitch 104 is g#7')
	t.equal(noteFromMidiPitch(105), 'a7' , 'Note for Midi pitch 105 is a7')
	t.equal(noteFromMidiPitch(106), 'a#7' , 'Note for Midi pitch 106 is a#7')
	t.equal(noteFromMidiPitch(107), 'b7' , 'Note for Midi pitch 107 is b7')
	t.equal(noteFromMidiPitch(108), 'c8' , 'Note for Midi pitch 108 is c8')

	t.end();
});

test('Midi -> Util -> mpqnFromBpm', function(t) {
	var mpqnFromBpm = Util.mpqnFromBpm;
	var mpqn = mpqnFromBpm(120);

	t.equal(mpqn[0], 7, 'mpqnFromBpm returns expected array');
	t.equal(mpqn[1], 161, 'mpqnFromBpm returns expected array');
	t.equal(mpqn[2], 32, 'mpqnFromBpm returns expected array');

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
	t.equal(Util.translateTickTime(16)[0], 16, 'translateTickTime translates tick to MIDI timestamp as expected');
	t.equal(Util.translateTickTime(32)[0], 32, 'translateTickTime translates tick to MIDI timestamp as expected');
	t.deepEquals(Util.translateTickTime(128), [129, 0], 'translateTickTime translates tick to MIDI timestamp as expected');
	t.deepEquals(Util.translateTickTime(512), [132, 0], 'translateTickTime translates tick to MIDI timestamp as expected');

	t.end();
});
