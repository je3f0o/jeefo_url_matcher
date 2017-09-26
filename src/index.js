/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
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

var assign    = require("jeefo_utils/object/assign"),
	tokenizer = require("./tokenizer"),

build_url = function (params, tokens, is_ingroup) {
	var i = 0, url = '', value;

	for (; i < tokens.length; ++i) {
		switch (tokens[i].type) {
			case "OptionalGroup" :
				if (params[tokens[i].index]) {
					url += params[tokens[i].index];
				}
				break;
			case "Segment" :
				value = params[tokens[i].key];
				if (value) {
					url += value;
				} else if (is_ingroup) {
					return '';
				}
				break;
			case "Explicit" :
				url += tokens[i].value;
				break;
			default:
				console.log("Unhandled token", tokens[i]);
		}
	}

	return url;
};

var parse_tokens = function (instance, tokenizer, tokens, last_token) {
	var token = tokenizer.next(), pattern = '', index, group_tokens;

	for (; token; token = tokenizer.next()) {
		switch (token.type) {
			case "Delimiter" :
				if (last_token && last_token.type === "Explicit") {
					last_token.value += '/';
				} else {
					last_token = { type : "Explicit", value : '/' };
					tokens.push(last_token);
				}
				break;
			case "Explicit" :
				if (last_token && last_token.type === "Explicit") {
					last_token.value += token.pattern;
				} else {
					last_token = { type : "Explicit", value : token.pattern };
					tokens.push(last_token);
				}
				break;
			case "GroupingOpen" :
				index        = instance.param_index;
				group_tokens = [];

				instance.param_index += 1;
				token.pattern = parse_tokens(instance, tokenizer, group_tokens);

				last_token = {
					type   : "OptionalGroup",
					index  : index,
					tokens : group_tokens
				};

				tokens.push(last_token);
				break;
			case "GroupingClose" :
				return `(${ pattern })?`;
			case "Segment" :
				last_token = {
					key    : token.key,
					type   : "Segment",
					index  : instance.param_index++,
					parser : token.parser
				};
				tokens.push(last_token);
				break;
			default:
				console.error("UNDEFINED TOKEN", token);
		}

		pattern += token.pattern;
	}

	return pattern;
};

var set_params = function (params, match, tokens) {
	var i = tokens.length, value;

	while (i--) {
		switch (tokens[i].type) {
			case "OptionalGroup" :
				value = match[tokens[i].index];
				if (value) {
					params[tokens[i].index] = value;
					set_params(params, match, tokens[i].tokens);
				}
				break;
			case "Segment" :
				value = match[tokens[i].index];
				params[tokens[i].key] = tokens[i].parser ? tokens[i].parser(value) : value;
				break;
		}
	}
};

var UrlPattern = function (url_pattern, parent) {
	var self = this, tokens = [], last_token;

	if (parent) {
		self.url_pattern   = `${ parent.url_pattern }${ url_pattern }`;
		self.param_index   = parent.param_index;
		self.regex_pattern = parent.regex_pattern;

		for (var i = parent.tokens.length - 2; i >= 0; --i) {
			tokens[i] = parent.tokens[i];
		}
		tokens[parent.tokens.length - 1] = last_token = assign({}, parent.tokens[parent.tokens.length - 1]);
	} else {
		self.url_pattern   = url_pattern;
		self.param_index   = 1;
		self.regex_pattern = '';
	}

	tokenizer.init(url_pattern);
	self.regex_pattern += parse_tokens(self, tokenizer, tokens, last_token);

	self.regex  = new RegExp(`^${ self.regex_pattern }$`);
	self.tokens = tokens;
};

UrlPattern.prototype = {
	match : function (url) {
		var matches = url.match(this.regex), params;

		if (matches) {
			params = {};
			set_params(params, matches, this.tokens);
		}
		
		return params;
	},
	url : function (params) {
		return build_url(params, this.tokens);
	}
};

module.exports = UrlPattern;
