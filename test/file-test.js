var test = require('tape');
var jsmidgen = require('../lib/jsmidgen.js');
var file  = new jsmidgen.File();


test('File -> setTicks should set the correct HDR_SPEED on valid input', function(t) {
	file.setTicks(1000);
	t.equal(file.ticks, 1000, 'ticks should be set to 1000');

	t.end();
});

test('File -> setTicks should throw error on invalid input ', function(t) {
	t.throws(function() {
		file.setTicks()
	});
	t.throws(function() {
		file.setTicks('not a number')
	});
	t.throws(function() {
		file.setTicks(85000)
	});

	t.end();
});