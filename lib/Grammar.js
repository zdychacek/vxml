'use strict';

var Class = require('class'),
	Rule = require('./Rule'),
	Item = require('./Item');

var Grammar = Class.extend({

	constructor: function (options /* id, mode, language, items */) {
		options || (options = {});

		this.mode = options.mode || 'voice';
		this.language = options.language || 'en-US';
		this.id = options.id;

		if (!this.id) {
			this.id = 'G_' + (++this.constructor.idCounter);
		}

		this.rule = new Rule(options.id);
		this.addItems(options.items || []);
	},

	statics: {
		idCounter: 0
	},

	addItems: function (items) {
		items.forEach(function (item) {
			this.addItem(item.text, item.tag);
		}, this);
	},

	addItem: function (text, tag) {
		this.rule.oneOfList.push(new Item(text, tag));
	},

	toXml: function () {
		var attrs = [
			'type="application/grammar-xml"',
			'root="' + this.id + '"',
			'mode="' + this.mode + '"',
			'xml:lang="' + this.language + '"',
			'version="1.0"'
		];

		return [
			'<grammar ',
			attrs.join(' ') + '>',
			this.rule.toXml(),
			'</grammar>'
		].join('');
	}
});

module.exports = Grammar;
