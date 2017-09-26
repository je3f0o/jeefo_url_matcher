/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : url_pattern_specs.js
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

var expect     = require("expect"),
	UrlPattern = require("../dist/index");

describe("UrlMatcher", () => {

	it("Should match '/users/15' using '/users/:id'", () => {
		var pattern = new UrlPattern("/users/:id"), params = pattern.match("/users/15");
		expect(params.id).toBe("15");
		expect(pattern.url(params)).toBe("/users/15");
	});

	it("Should match '/users/15' using '/users/{ id : /\\d+/ }'", () => {
		var pattern = new UrlPattern("/users/{ id : /\\d+/ }"), params = pattern.match("/users/15");
		expect(params.id).toBe("15");
		expect(pattern.url(params)).toBe("/users/15");
	});

	it("Should match '/users/15' using '/users/:id(\\d+)'", () => {
		var pattern = new UrlPattern("/users/:id(\\d+)"), params = pattern.match("/users/15");
		expect(params.id).toBe("15");
		expect(pattern.url(params)).toBe("/users/15");
	});

	it("Should match '/users/15' using '/users[/:resource]/{ id : int }'", () => {
		var pattern = new UrlPattern("/users[/:resource]/{ id : int }"), params = pattern.match("/users/15", true);
		expect(params.id).toBe(15);
		expect(pattern.url(params)).toBe("/users/15");
	});

	it("Should match '/users/15' using '/users[/optional]/{ id : int }'", () => {
		var pattern = new UrlPattern("/users[/optional]/{ id : int }"), params = pattern.match("/users/15", true);
		expect(params.id).toBe(15);
		expect(pattern.url(params)).toBe("/users/15");
	});

	it("Should match '/users/group/15' using '/users[/group]/{ id : int }'", () => {
		var pattern = new UrlPattern("/users[/group]/{ id : int }"), params = pattern.match("/users/group/15", true);
		expect(params.id).toBe(15);
		expect(pattern.url(params)).toBe("/users/group/15");
	});

});
