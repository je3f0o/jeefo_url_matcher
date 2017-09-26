/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : parsers.js
* Created at  : 2017-09-27
* Updated at  : 2017-09-27
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/

var store = {
	int : {
		pattern : "\\d+",
		parser  : function (value) {
			return +value;
		}
	}
};

exports.register = function (name, definition) {
	store[name] = definition;
};

exports.get = function (name) {
	return store[name];
};
