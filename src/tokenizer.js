/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : tokenizer.js
* Created at  : 2017-08-06
* Updated at  : 2017-09-27
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

var Tokenizer  = require("jeefo_tokenizer"),
	DELIMITERS = [
		'/', '?', ':', '#', '&', '[', ']', '{', '}', ' ', '('
	].join(''),

	tokenizer = new Tokenizer();

tokenizer.
register({
	is : function (character) {
		switch (character) { case ':' : case '{' : return true; }
	},
	protos : {
		type       : "Segment",
		precedence : 1,
		initialize : require("./segment")
	}
}).
register({
	is     : function (character) { return character === '/'; },
	protos : {
		type       : "Delimiter",
		precedence : 1,
		initialize : function () {
			this.type    = this.type;
			this.pattern = "\\/";
		}
	}
}).
register({
	protos : {
		type       : "Explicit",
		initialize : function (character, streamer) {
			var start = streamer.cursor.index;

			character = streamer.next();

			while (character && DELIMITERS.indexOf(character) === -1) {
				character = streamer.next();
			}

			this.type    = this.type;
			this.pattern = streamer.seek(start);

			streamer.cursor.index -= 1;
		}
	}
}).
register({
	is     : function (character) { return character === '['; },
	protos : {
		type       : "GroupingOpen",
		precedence : 1,
		initialize : function () {
			this.delimiter = '[';
		},
	}
}).
register({
	is     : function (character) { return character === ']'; },
	protos : {
		type       : "GroupingClose",
		precedence : 1,
		initialize : function () {
			this.delimiter = ']';
		},
	}
});

module.exports = tokenizer;
