var test = require('tape');
var jsmidgen = require('../lib/jsmidgen.js');
var file  = new jsmidgen.File();


test('File -> setTicks should set the correct HDR_SPEED on valid input', function(t) {
	file.setTicks(128);
	t.equal(file.HDR_SPEED, '\x00\x80', '128 ticks should translate to \x00\x80');

	file.setTicks(1000);
	t.equal(file.HDR_SPEED, '\x03\xe8', '1000 ticks should translate to \x03\xe8');

	t.end();
});

test('File -> setTicks should return on invalid input', function(t) {
	file.setTicks();
	t.equal(file.HDR_SPEED, '\x03è', 'setTicks should return on empty input');

	file.setTicks('not a number');
	t.equal(file.HDR_SPEED, '\x03è', 'setTicks should return on invalid input');

	t.end();
});