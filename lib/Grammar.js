'use strict';

var Class = require('class'),
	Rule = require('./Rule'),
	Item = require('./Item');

var Grammar = Class.extend({
	constructor: function (options /* builtinGrammar, loc, src, id, utterances */) {
		options || (options = {});

		if (options.builtinGrammar) {
			this.builtin = options.builtinGrammar;
		}
		else {
			this._setDefaults();
		}

		if (options.loc) {
			this._location = options.loc;
		}

		if (options.src) {
			this._source = options.src;
		}

		if (options.id) {
			this.root = options.id;
			this.rule = new Rule(options.id);

			(options.utterances || []).forEach(function (utterance) {
				this.rule.oneOfList.push(new Item(utterance));
			}, this);
		}
	},

	getSource: function () {
		if (!this._location) {
			return this._source;
		}
		else {
			return this._location.getUrl() + this._source; 
		}
	},

	getType: function () {
		if (this.gType == 'gsl') {
			return 'text/gsl';
		}
		else {
			return 'application/grammar-xml';
		}
	},

	isBuiltIn: function () {
		return !!this.builtin;
	},

	isExternalRef: function () {
		return !!this.source;
	},

	toXml: function () {
		var buffer = ['<grammar'],
			attrs = [];

		attrs.push('type="' + this.getType() + '"');
		attrs.push('root="' + this.root + '"');
		attrs.push('xml:lang="' + this.language + '"');
		attrs.push('version="1.0"');
		buffer.push(' ' + attrs.join(' ') + '>');

		buffer.push(this.rule.toXml());

		buffer.push('</grammar>');

		return buffer.join('');
	},

	// privates
	_setDefaults: function () {
		this.gType = 'xml';
		this.mode = 'voice';
		this.language = 'en-US';
		this._source = '';
		this._location = null;
	}
});

module.exports = Grammar;
