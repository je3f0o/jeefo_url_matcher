/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : segment.js
* Created at  : 2017-09-26
* Updated at  : 2017-09-27
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/

var parsers = require("./parsers");

var DELIMITERS = ' /:{}[]()';

var parse_key = function (character, streamer) {
	var start_index = streamer.cursor.index;

	character = streamer.next();
	while (character && DELIMITERS.indexOf(character) === -1) {
		character = streamer.next();
	}

	return streamer.seek(start_index);
};

var is_regex, _start_index;

var parse_regex = function (streamer, until) {
	var character = streamer.next();

	_start_index = streamer.cursor.index;

	while (character && character >= ' ' && character !== until) {
		if (character === '\\') {
			streamer.next();
		}
		character = streamer.next();
	}
};

var parse_pattern = function (streamer) {
	var character = streamer.next(true);

	if (character === '/') {
		is_regex = true;
		parse_regex(streamer, '/');
	} else {
		is_regex     = false;
		_start_index = streamer.cursor.index;

		while (character && DELIMITERS.indexOf(character) === -1) {
			character = streamer.next();
		}
	}
};

var curly_segment = function (instance, character, streamer) {

	character = streamer.next(true);
	instance.key = parse_key(character, streamer);

	character = streamer.current();
	if (character === ' ') {
		character = streamer.next(true);
	}

	switch (character) {
		case ':' :
			parse_pattern(streamer);

			var name = streamer.seek(_start_index);
			if (is_regex) {
				instance.pattern = '(' + name + ')';

				character = streamer.next(true);
			} else {
				var parser = parsers.get(name);
				if (! parser) {
					throw new Error("Invalid token");
				}

				instance.pattern = '(' + parser.pattern + ')';

				if (parser.parser) {
					instance.parser = parser.parser;
				}

				character = streamer.current();
				if (character === ' ') {
					character = streamer.next(true);
				}
			}

			if (character !== '}') {
				throw new SyntaxError("Invalid token");
			}
			break;
		case '}' :
			instance.pattern = "([^\\/]+)";
			break;
		default:
			throw new SyntaxError("Invalid token");
	}
};

module.exports = function segment (character, streamer) {
	this.type = this.type;

	if (character === '{') {
		curly_segment(this, character, streamer);
		return;
	}

	character = streamer.next();
	this.key = parse_key(character, streamer);

	character = streamer.current();
	if (character === '(') {
		parse_regex(streamer, ')');
		this.pattern = '(' + streamer.seek(_start_index) + ')';
	} else {
		this.pattern = "([^\\/]+)";
		streamer.cursor.index -= 1;
	}
};
