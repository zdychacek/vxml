'use strict';

var Helpers = require('./core/Helpers'),
	Grammar = require('./Grammar'),
	BuiltinGrammar = require('./BuiltinGrammar');

var GrammarHelper = {
	grammarToXml: function (grammar) {
		return grammar.toXml();
	},

	builtinToXml: function (grammar) {
		var sgrammar = grammar.type;

		if (grammar.type == 'digits') {
			if (grammar.length > 0) {
				sgrammar += '?length=' + grammar.length;
			}
			else {
				if (grammar.minLength > 0) {
					if (grammar.maxLength > 0) {
						sgrammar += '?minlength=' + grammar.minLength + ';maxlength=' + grammar.maxLength;
					}
					else {
						sgrammar += '?minlength=' + grammar.minLength;
					}
				}
				else {
					if (grammar.maxLength > 0) {
						sgrammar += '?maxlength=' + grammar.maxLength;
					}
				}
			}
		}

		return sgrammar;
	}
};

module.exports = GrammarHelper;
