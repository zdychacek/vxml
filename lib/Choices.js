'use strict';

var Class = require('class'),
	Grammar = require('./Grammar');

var Choices = Class.extend({

	constructor: function (choices) {
		choices || (choices = {});

		this._dtmfGrammar = null;
		this._voiceGrammar = null;

		this._buildGrammars(choices);
	},

	_buildGrammars: function (choices) {
		choices.forEach(function (choice) {
			var items = null,
				tag = choice.tag;

			if (typeof choice === 'string') {
				items = [ choice ]	;
			}
			else {
				items = choice.items;
			}

			items.forEach(function (item) {
				if (item.startsWith('dtmf-')) {
					if (!this._dtmfGrammar) {
					 this._dtmfGrammar = new Grammar({ mode: 'dtmf' });
					}
					this._dtmfGrammar.addItem(item.replace('dtmf-', ''), tag);
				}
				else {
					if (!this._voiceGrammar) {
					 this._voiceGrammar = new Grammar({ mode: 'voice' });
					}
					this._voiceGrammar.addItem(item, tag);
				}
			}, this);
		}, this);
	},

	toXml: function () {
		var buffer = [];

		if (this._dtmfGrammar) {
			buffer.push(this._dtmfGrammar.toXml());
		}

		if (this._voiceGrammar) {
			buffer.push(this._voiceGrammar.toXml());
		}

		return buffer.join('');
	}
});

module.exports = Choices;
