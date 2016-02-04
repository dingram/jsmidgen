var test = require('tape');
var jsmidgen = require('../lib/jsmidgen.js');

test('File -> setTicks should set the correct HDR_SPEED on valid input', function(t) {
	var file  = new jsmidgen.File({
		ticks: 1000
	});
	t.equal(file.ticks, 1000, 'ticks should be set to 1000');

	t.end();
});

test('File -> setTicks should throw error on invalid input ', function(t) {
	t.throws(function() {
		new jsmidgen.File({
			ticks: 'not a number'
		});
	});
	t.throws(function() {
		new jsmidgen.File({
			ticks: 85000
		});
	});

	t.throws(function() {
		new jsmidgen.File({
			ticks: 133.7
		});
	});

	t.end();
});