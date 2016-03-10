var Midi = {};

(function(exported) {

	var DEFAULT_VOLUME   = exported.DEFAULT_VOLUME   = 90;
	var DEFAULT_DURATION = exported.DEFAULT_DURATION = 128;
	var DEFAULT_CHANNEL  = exported.DEFAULT_CHANNEL  = 0;

	/* ******************************************************************
	 * Utility functions
	 ****************************************************************** */

	var Util = {

		midi_letter_pitches: { a:21, b:23, c:12, d:14, e:16, f:17, g:19 },

		/**
		 * Convert a symbolic note name (e.g. "c4") to a numeric MIDI pitch (e.g.
		 * 60, middle C).
		 *
		 * @param {string} n - The symbolic note name to parse.
		 * @returns {number} The MIDI pitch that corresponds to the symbolic note
		 * name.
		 */
		midiPitchFromNote: function(n) {
			var matches = /([a-g])(#+|b+)?([0-9]+)$/i.exec(n);
			var note = matches[1].toLowerCase(), accidental = matches[2] || '', octave = parseInt(matches[3], 10);
			return (12 * octave) + Util.midi_letter_pitches[note] + (accidental.substr(0,1)=='#'?1:-1) * accidental.length;
		},

		/**
		 * Ensure that the given argument is converted to a MIDI pitch. Note that
		 * it may already be one (including a purely numeric string).
		 *
		 * @param {string|number} p - The pitch to convert.
		 * @returns {number} The resulting numeric MIDI pitch.
		 */
		ensureMidiPitch: function(p) {
			if (typeof p == 'number' || !/[^0-9]/.test(p)) {
				// numeric pitch
				return parseInt(p, 10);
			} else {
				// assume it's a note name
				return Util.midiPitchFromNote(p);
			}
		},

		midi_pitches_letter: { '12':'c', '13':'c#', '14':'d', '15':'d#', '16':'e', '17':'f', '18':'f#', '19':'g', '20':'g#', '21':'a', '22':'a#', '23':'b' },
		midi_flattened_notes: { 'a#':'bb', 'c#':'db', 'd#':'eb', 'f#':'gb', 'g#':'ab' },

		/**
		 * Convert a numeric MIDI pitch value (e.g. 60) to a symbolic note name
		 * (e.g. "c4").
		 *
		 * @param {number} n - The numeric MIDI pitch value to convert.
		 * @param {boolean} [returnFlattened=false] - Whether to prefer flattened
		 * notes to sharpened ones. Optional, default false.
		 * @returns {string} The resulting symbolic note name.
		 */
		noteFromMidiPitch: function(n, returnFlattened) {
			var octave = 0, noteNum = n, noteName, returnFlattened = returnFlattened || false;
			if (n > 23) {
				// noteNum is on octave 1 or more
				octave = Math.floor(n/12) - 1;
				// subtract number of octaves from noteNum
				noteNum = n - octave * 12;
			}

			// get note name (c#, d, f# etc)
			noteName = Util.midi_pitches_letter[noteNum];
			// Use flattened notes if requested (e.g. f# should be output as gb)
			if (returnFlattened && noteName.indexOf('#') > 0) {
				noteName = Util.midi_flattened_notes[noteName];
			}
			return noteName + octave;
		},

		/**
		 * Convert beats per minute (BPM) to microseconds per quarter note (MPQN).
		 *
		 * @param {number} bpm - A number in beats per minute.
		 * @returns {number} The number of microseconds per quarter note.
		 */
		mpqnFromBpm: function(bpm) {
			var mpqn = Math.floor(60000000 / bpm);
			var ret=[];
			do {
				ret.unshift(mpqn & 0xFF);
				mpqn >>= 8;
			} while (mpqn);
			while (ret.length < 3) {
				ret.push(0);
			}
			return ret;
		},

		/**
		 * Convert microseconds per quarter note (MPQN) to beats per minute (BPM).
		 *
		 * @param {number} mpqn - The number of microseconds per quarter note.
		 * @returns {number} A number in beats per minute.
		 */
		bpmFromMpqn: function(mpqn) {
			var m = mpqn;
			if (typeof mpqn[0] != 'undefined') {
				m = 0;
				for (var i=0, l=mpqn.length-1; l >= 0; ++i, --l) {
					m |= mpqn[i] << l;
				}
			}
			return Math.floor(60000000 / mpqn);
		},

		/**
		 * Converts an array of bytes to a string of hexadecimal characters. Prepares
		 * it to be converted into a base64 string.
		 *
		 * @param {Array} byteArray - Array of bytes to be converted.
		 * @returns {string} Hexadecimal string, e.g. "097B8A".
		 */
		codes2Str: function(byteArray) {
			return String.fromCharCode.apply(null, byteArray);
		},

		/**
		 * Converts a string of hexadecimal values to an array of bytes. It can also
		 * add remaining "0" nibbles in order to have enough bytes in the array as the
		 * `finalBytes` parameter.
		 *
		 * @param {string} str - string of hexadecimal values e.g. "097B8A"
		 * @param {number} [finalBytes] - Optional. The desired number of bytes
		 * (not nibbles) that the returned array should contain.
		 * @returns {Array} An array of nibbles.
		 */
		str2Bytes: function (str, finalBytes) {
			if (finalBytes) {
				while ((str.length / 2) < finalBytes) { str = "0" + str; }
			}

			var bytes = [];
			for (var i=str.length-1; i>=0; i = i-2) {
				var chars = i === 0 ? str[i] : str[i-1] + str[i];
				bytes.unshift(parseInt(chars, 16));
			}

			return bytes;
		},

		/**
		 * Translates number of ticks to MIDI timestamp format, returning an array
		 * of bytes with the time values. MIDI has a very particular way to express
		 * time; take a good look at the spec before ever touching this function.
		 *
		 * @param {number} ticks - Number of ticks to be translated.
		 * @returns {number} Array of bytes that form the MIDI time value.
		 */
		translateTickTime: function(ticks) {
			var buffer = ticks & 0x7F;

			while (ticks = ticks >> 7) {
				buffer <<= 8;
				buffer |= ((ticks & 0x7F) | 0x80);
			}

			var bList = [];
			while (true) {
				bList.push(buffer & 0xff);

				if (buffer & 0x80) { buffer >>= 8; }
				else { break; }
			}
			return bList;
		},

	};

	/* ******************************************************************
	 * Event class
	 ****************************************************************** */

	/**
	 * Construct a MIDI event.
	 *
	 * Parameters include:
	 *  - time [optional number] - Ticks since previous event.
	 *  - type [required number] - Type of event.
	 *  - channel [required number] - Channel for the event.
	 *  - param1 [required number] - First event parameter.
	 *  - param2 [optional number] - Second event parameter.
	 */
	var MidiEvent = function(params) {
		if (!this) return new MidiEvent(params);
		if (params &&
				(params.type    !== null || params.type    !== undefined) &&
				(params.channel !== null || params.channel !== undefined) &&
				(params.param1  !== null || params.param1  !== undefined)) {
			this.setTime(params.time);
			this.setType(params.type);
			this.setChannel(params.channel);
			this.setParam1(params.param1);
			this.setParam2(params.param2);
		}
	};

	// event codes
	MidiEvent.NOTE_OFF           = 0x80;
	MidiEvent.NOTE_ON            = 0x90;
	MidiEvent.AFTER_TOUCH        = 0xA0;
	MidiEvent.CONTROLLER         = 0xB0;
	MidiEvent.PROGRAM_CHANGE     = 0xC0;
	MidiEvent.CHANNEL_AFTERTOUCH = 0xD0;
	MidiEvent.PITCH_BEND         = 0xE0;


	/**
	 * Set the time for the event in ticks since the previous event.
	 *
	 * @param {number} ticks - The number of ticks since the previous event. May
	 * be zero.
	 */
	MidiEvent.prototype.setTime = function(ticks) {
		this.time = Util.translateTickTime(ticks || 0);
	};

	/**
	 * Set the type of the event. Must be one of the event codes on MidiEvent.
	 *
	 * @param {number} type - Event type.
	 */
	MidiEvent.prototype.setType = function(type) {
		if (type < MidiEvent.NOTE_OFF || type > MidiEvent.PITCH_BEND) {
			throw new Error("Trying to set an unknown event: " + type);
		}

		this.type = type;
	};

	/**
	 * Set the channel for the event. Must be between 0 and 15, inclusive.
	 *
	 * @param {number} channel - The event channel.
	 */
	MidiEvent.prototype.setChannel = function(channel) {
		if (channel < 0 || channel > 15) {
			throw new Error("Channel is out of bounds.");
		}

		this.channel = channel;
	};

	/**
	 * Set the first parameter for the event. Must be between 0 and 255,
	 * inclusive.
	 *
	 * @param {number} p - The first event parameter value.
	 */
	MidiEvent.prototype.setParam1 = function(p) {
		this.param1 = p;
	};

	/**
	 * Set the second parameter for the event. Must be between 0 and 255,
	 * inclusive.
	 *
	 * @param {number} p - The second event parameter value.
	 */
	MidiEvent.prototype.setParam2 = function(p) {
		this.param2 = p;
	};

	/**
	 * Serialize the event to an array of bytes.
	 *
	 * @returns {Array} The array of serialized bytes.
	 */
	MidiEvent.prototype.toBytes = function() {
		var byteArray = [];

		var typeChannelByte = this.type | (this.channel & 0xF);

		byteArray.push.apply(byteArray, this.time);
		byteArray.push(typeChannelByte);
		byteArray.push(this.param1);

		// Some events don't have a second parameter
		if (this.param2 !== undefined && this.param2 !== null) {
			byteArray.push(this.param2);
		}
		return byteArray;
	};

	/* ******************************************************************
	 * MetaEvent class
	 ****************************************************************** */

	/**
	 * Construct a meta event.
	 *
	 * Parameters include:
	 *  - time [optional number] - Ticks since previous event.
	 *  - type [required number] - Type of event.
	 *  - data [optional array|string] - Event data.
	 */
	var MetaEvent = function(params) {
		if (!this) return new MetaEvent(params);
		var p = params || {};
		this.setTime(params.time);
		this.setType(params.type);
		this.setData(params.data);
	};

	MetaEvent.SEQUENCE   = 0x00;
	MetaEvent.TEXT       = 0x01;
	MetaEvent.COPYRIGHT  = 0x02;
	MetaEvent.TRACK_NAME = 0x03;
	MetaEvent.INSTRUMENT = 0x04;
	MetaEvent.LYRIC      = 0x05;
	MetaEvent.MARKER     = 0x06;
	MetaEvent.CUE_POINT  = 0x07;
	MetaEvent.CHANNEL_PREFIX = 0x20;
	MetaEvent.END_OF_TRACK   = 0x2f;
	MetaEvent.TEMPO      = 0x51;
	MetaEvent.SMPTE      = 0x54;
	MetaEvent.TIME_SIG   = 0x58;
	MetaEvent.KEY_SIG    = 0x59;
	MetaEvent.SEQ_EVENT  = 0x7f;

	/**
	 * Set the time for the event in ticks since the previous event.
	 *
	 * @param {number} ticks - The number of ticks since the previous event. May
	 * be zero.
	 */
	MetaEvent.prototype.setTime = function(ticks) {
		this.time = Util.translateTickTime(ticks || 0);
	};

	/**
	 * Set the type of the event. Must be one of the event codes on MetaEvent.
	 *
	 * @param {number} t - Event type.
	 */
	MetaEvent.prototype.setType = function(t) {
		this.type = t;
	};

	/**
	 * Set the data associated with the event. May be a string or array of byte
	 * values.
	 *
	 * @param {string|Array} d - Event data.
	 */
	MetaEvent.prototype.setData = function(d) {
		this.data = d;
	};

	/**
	 * Serialize the event to an array of bytes.
	 *
	 * @returns {Array} The array of serialized bytes.
	 */
	MetaEvent.prototype.toBytes = function() {
		if (!this.type) {
			throw new Error("Type for meta-event not specified.");
		}

		var byteArray = [];
		byteArray.push.apply(byteArray, this.time);
		byteArray.push(0xFF, this.type);

		// If data is an array, we assume that it contains several bytes. We
		// apend them to byteArray.
		if (Array.isArray(this.data)) {
			byteArray.push(this.data.length);
			byteArray.push.apply(byteArray, this.data);
		} else if (typeof this.data == 'number') {
			byteArray.push(1, this.data);
		} else if (this.data !== null && this.data !== undefined) {
			// assume string; may be a bad assumption
			byteArray.push(this.data.length);
			var dataBytes = this.data.split('').map(function(x){ return x.charCodeAt(0) });
			byteArray.push.apply(byteArray, dataBytes);
		} else {
			byteArray.push(0);
		}

		return byteArray;
	};

	/* ******************************************************************
	 * Track class
	 ****************************************************************** */

	/**
	 * Construct a MIDI track.
	 *
	 * Parameters include:
	 *  - events [optional array] - Array of events for the track.
	 */
	var Track = function(config) {
		if (!this) return new Track(config);
		var c = config || {};
		this.events = c.events || [];
	};

	Track.START_BYTES = [0x4d, 0x54, 0x72, 0x6b];
	Track.END_BYTES   = [0x00, 0xFF, 0x2F, 0x00];

	/**
	 * Add an event to the track.
	 *
	 * @param {MidiEvent|MetaEvent} event - The event to add.
	 * @returns {Track} The current track.
	 */
	Track.prototype.addEvent = function(event) {
		this.events.push(event);
		return this;
	};

	/**
	 * Add a note-on event to the track.
	 *
	 * @param {number} channel - The channel to add the event to.
	 * @param {number|string} pitch - The pitch of the note, either numeric or
	 * symbolic.
	 * @param {number} [time=0] - The number of ticks since the previous event,
	 * defaults to 0.
	 * @param {number} [velocity=90] - The volume for the note, defaults to
	 * DEFAULT_VOLUME.
	 * @returns {Track} The current track.
	 */
	Track.prototype.addNoteOn = Track.prototype.noteOn = function(channel, pitch, time, velocity) {
		this.events.push(new MidiEvent({
			type: MidiEvent.NOTE_ON,
			channel: channel,
			param1: Util.ensureMidiPitch(pitch),
			param2: velocity || DEFAULT_VOLUME,
			time: time || 0,
		}));
		return this;
	};

	/**
	 * Add a note-off event to the track.
	 *
	 * @param {number} channel - The channel to add the event to.
	 * @param {number|string} pitch - The pitch of the note, either numeric or
	 * symbolic.
	 * @param {number} [time=0] - The number of ticks since the previous event,
	 * defaults to 0.
	 * @param {number} [velocity=90] - The velocity the note was released,
	 * defaults to DEFAULT_VOLUME.
	 * @returns {Track} The current track.
	 */
	Track.prototype.addNoteOff = Track.prototype.noteOff = function(channel, pitch, time, velocity) {
		this.events.push(new MidiEvent({
			type: MidiEvent.NOTE_OFF,
			channel: channel,
			param1: Util.ensureMidiPitch(pitch),
			param2: velocity || DEFAULT_VOLUME,
			time: time || 0,
		}));
		return this;
	};

	/**
	 * Add a note-on and -off event to the track.
	 *
	 * @param {number} channel - The channel to add the event to.
	 * @param {number|string} pitch - The pitch of the note, either numeric or
	 * symbolic.
	 * @param {number} dur - The duration of the note, in ticks.
	 * @param {number} [time=0] - The number of ticks since the previous event,
	 * defaults to 0.
	 * @param {number} [velocity=90] - The velocity the note was released,
	 * defaults to DEFAULT_VOLUME.
	 * @returns {Track} The current track.
	 */
	Track.prototype.addNote = Track.prototype.note = function(channel, pitch, dur, time, velocity) {
		this.noteOn(channel, pitch, time, velocity);
		if (dur) {
			this.noteOff(channel, pitch, dur, velocity);
		}
		return this;
	};

	/**
	 * Add a note-on and -off event to the track for each pitch in an array of pitches.
	 *
	 * @param {number} channel - The channel to add the event to.
	 * @param {array} chord - An array of pitches, either numeric or
	 * symbolic.
	 * @param {number} dur - The duration of the chord, in ticks.
	 * @param {number} [velocity=90] - The velocity of the chord,
	 * defaults to DEFAULT_VOLUME.
	 * @returns {Track} The current track.
	 */
	Track.prototype.addChord = Track.prototype.chord = function(channel, chord, dur, velocity) {
		if (!Array.isArray(chord) && !chord.length) {
			throw new Error('Chord must be an array of pitches');
		}
		chord.forEach(function(note) {
			this.noteOn(channel, note, 0, velocity);
		}, this);
		chord.forEach(function(note, index) {
			if (index === 0) {
				this.noteOff(channel, note, dur);
			} else {
				this.noteOff(channel, note);
			}
		}, this);
		return this;
	};

	/**
	 * Set instrument for the track.
	 *
	 * @param {number} channel - The channel to set the instrument on.
	 * @param {number} instrument - The instrument to set it to.
	 * @param {number} [time=0] - The number of ticks since the previous event,
	 * defaults to 0.
	 * @returns {Track} The current track.
	 */
	Track.prototype.setInstrument = Track.prototype.instrument = function(channel, instrument, time) {
		this.events.push(new MidiEvent({
			type: MidiEvent.PROGRAM_CHANGE,
			channel: channel,
			param1: instrument,
			time: time || 0,
		}));
		return this;
	};

	/**
	 * Set the tempo for the track.
	 *
	 * @param {number} bpm - The new number of beats per minute.
	 * @param {number} [time=0] - The number of ticks since the previous event,
	 * defaults to 0.
	 * @returns {Track} The current track.
	 */
	Track.prototype.setTempo = Track.prototype.tempo = function(bpm, time) {
		this.events.push(new MetaEvent({
			type: MetaEvent.TEMPO,
			data: Util.mpqnFromBpm(bpm),
			time: time || 0,
		}));
		return this;
	};

	/**
	 * Serialize the track to an array of bytes.
	 *
	 * @returns {Array} The array of serialized bytes.
	 */
	Track.prototype.toBytes = function() {
		var trackLength = 0;
		var eventBytes = [];
		var startBytes = Track.START_BYTES;
		var endBytes   = Track.END_BYTES;

		var addEventBytes = function(event) {
			var bytes = event.toBytes();
			trackLength += bytes.length;
			eventBytes.push.apply(eventBytes, bytes);
		};

		this.events.forEach(addEventBytes);

		// Add the end-of-track bytes to the sum of bytes for the track, since
		// they are counted (unlike the start-of-track ones).
		trackLength += endBytes.length;

		// Makes sure that track length will fill up 4 bytes with 0s in case
		// the length is less than that (the usual case).
		var lengthBytes = Util.str2Bytes(trackLength.toString(16), 4);

		return startBytes.concat(lengthBytes, eventBytes, endBytes);
	};

	/* ******************************************************************
	 * File class
	 ****************************************************************** */

	/**
	 * Construct a file object.
	 *
	 * Parameters include:
	 *  - ticks [optional number] - Number of ticks per beat, defaults to 128.
	 *    Must be 1-32767.
	 *  - tracks [optional array] - Track data.
	 */
	var File = function(config){
		if (!this) return new File(config);

		var c = config || {};
		if (c.ticks) {
			if (typeof c.ticks !== 'number') {
				throw new Error('Ticks per beat must be a number!');
				return;
			}
			if (c.ticks <= 0 || c.ticks >= (1 << 15) || c.ticks % 1 !== 0) {
				throw new Error('Ticks per beat must be an integer between 1 and 32767!');
				return;
			}
		}

		this.ticks = c.ticks || 128;
		this.tracks = c.tracks || [];
	};

	File.HDR_CHUNKID     = "MThd";             // File magic cookie
	File.HDR_CHUNK_SIZE  = "\x00\x00\x00\x06"; // Header length for SMF
	File.HDR_TYPE0       = "\x00\x00";         // Midi Type 0 id
	File.HDR_TYPE1       = "\x00\x01";         // Midi Type 1 id

	/**
	 * Add a track to the file.
	 *
	 * @param {Track} track - The track to add.
	 */
	File.prototype.addTrack = function(track) {
		if (track) {
			this.tracks.push(track);
			return this;
		} else {
			track = new Track();
			this.tracks.push(track);
			return track;
		}
	};

	/**
	 * Serialize the MIDI file to an array of bytes.
	 *
	 * @returns {Array} The array of serialized bytes.
	 */
	File.prototype.toBytes = function() {
		var trackCount = this.tracks.length.toString(16);

		// prepare the file header
		var bytes = File.HDR_CHUNKID + File.HDR_CHUNK_SIZE;

		// set Midi type based on number of tracks
		if (parseInt(trackCount, 16) > 1) {
			bytes += File.HDR_TYPE1;
		} else {
			bytes += File.HDR_TYPE0;
		}

		// add the number of tracks (2 bytes)
		bytes += Util.codes2Str(Util.str2Bytes(trackCount, 2));
		// add the number of ticks per beat (currently hardcoded)
		bytes += String.fromCharCode((this.ticks/256),  this.ticks%256);;

		// iterate over the tracks, converting to bytes too
		this.tracks.forEach(function(track) {
			bytes += Util.codes2Str(track.toBytes());
		});

		return bytes;
	};

	/* ******************************************************************
	 * Exports
	 ****************************************************************** */

	exported.Util = Util;
	exported.File = File;
	exported.Track = Track;
	exported.Event = MidiEvent;
	exported.MetaEvent = MetaEvent;

})( Midi );

if (typeof module != 'undefined' && module !== null) {
	module.exports = Midi;
} else if (typeof exports != 'undefined' && exports !== null) {
	exports = Midi;
} else {
	this.Midi = Midi;
}
