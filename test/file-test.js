var test = require('tape');
var jsmidgen = require('../lib/jsmidgen.js');
var file  = new jsmidgen.File();


test('File -> setTicks', function(t) {
	file.setTicks(1000);
	t.equal(file.HDR_SPEED, '\\x03\\xe8', '1000 ticks should translate to \x03\xe8');

	t.end();
});