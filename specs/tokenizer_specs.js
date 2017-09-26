/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : tokenizer_specs.js
* Created at  : 2017-09-26
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

var expect    = require("expect"),
	tokenizer = require("../dist/tokenizer");

describe("Tokenizer", () => {

	it("Should be Delimiter", () => {
		tokenizer.init("/");
		var token  = tokenizer.next(),
			tokens = [];

		while (token) {
			tokens.push(token);
			token = tokenizer.next();
		}

		expect(tokens.length).toBe(1);
		expect(tokens[0].type).toBe("Delimiter");
		expect(tokens[0].pattern).toBe("\\/");
	});

	it("Should be Explicit value", () => {
		tokenizer.init("path");
		var token  = tokenizer.next(),
			tokens = [];

		while (token) {
			tokens.push(token);
			token = tokenizer.next();
		}

		expect(tokens.length).toBe(1);
		expect(tokens[0].type).toBe("Explicit");
		expect(tokens[0].pattern).toBe("path");
	});

	it("Should be Grouping", () => {
		tokenizer.init("[]");
		var token  = tokenizer.next(),
			tokens = [];

		while (token) {
			tokens.push(token);
			token = tokenizer.next();
		}

		expect(tokens.length).toBe(2);
		expect(tokens[0].type).toBe("GroupingOpen");
		expect(tokens[0].delimiter).toBe("[");
		expect(tokens[1].type).toBe("GroupingClose");
		expect(tokens[1].delimiter).toBe("]");
	});

	it("Should be Segment, using colon syntax", () => {
		tokenizer.init(":id(\\d+)");
		var token  = tokenizer.next(),
			tokens = [];

		while (token) {
			tokens.push(token);
			token = tokenizer.next();
		}

		expect(tokens.length).toBe(1);
		expect(tokens[0].type).toBe("Segment");
		expect(tokens[0].key).toBe("id");
		expect(tokens[0].pattern).toBe("(\\d+)");
	});

	it("Should be Segment, using curly syntax", () => {
		tokenizer.init("{ id : int }");
		var token  = tokenizer.next(),
			tokens = [];

		while (token) {
			tokens.push(token);
			token = tokenizer.next();
		}

		expect(tokens.length).toBe(1);
		expect(tokens[0].type).toBe("Segment");
		expect(tokens[0].key).toBe("id");
		expect(tokens[0].pattern).toBe("(\\d+)");
		expect(typeof tokens[0].parser).toBe("function");
	});
});
