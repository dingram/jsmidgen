var jsm = require('../lib/jsmidgen.js');
console.log('Listing notes by MIDI pitches...');
for (var i=21; i<109; i++) {
	console.log(i, jsm.Util.noteFromMidiPitch(i));
}
console.log('Done!');
console.log('Reference: http://newt.phys.unsw.edu.au/jw/notes.html');