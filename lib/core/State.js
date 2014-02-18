'use strict';

var Class = require('class'),
	Transition = require('./Transition'),
	Actions = require('./Actions');

var State = Class.extend({
	constructor: function (id, target, event) {
		// privates
		this._transitions = [];
		this._parentCallFlow = null;
		this._onEntry = new Actions();
		this._onExit = new Actions();

		// publics
		this.id = id || null;
		this.voiceModel = null;
		this.nestedCF = null;

		if (target) {
			this.addTransition(event || 'continue', target);
		}

		if (this.onEntry) {
			this.addOnEntryAction(this.onEntry);
		}

		if (this.onExit) {
			this.addOnExitAction(this.onExit);
		}
	},

	statics: {
		create: function (id, voiceModel, target) {
			var state = new this(id, target);
			state.voiceModel = voiceModel;

			// set an id to state
			if (!state.voiceModel.id) {
				state.voiceModel.id = id;
			}

			return state;
		}
	},

	isFinal: function () {
		return this._transitions.length == 0 && (!this.nestedCF || this.nestedCF && (this.nestedCF.getStatus() != 'active'));
	},

	getCurrentId: function () {
		return this.id;
	},

	addTransition: function (event, target, condition) {
		if (target instanceof State) {
			target = target.id;
		}

		this._transitions.push(new Transition({
			event: event,
			target: target,
			condition: condition
		}));

		return this;
	},

	addOnEntryAction: function (action) {
		this._onEntry.add(action);

		return this;
	},

	addOnExitAction: function (action) {
		this._onExit.add(action);

		return this;
	},

	addNestedCallFlow: function (nestedCF) {
		this.nestedCF = nestedCF;

		return this;
	},

	getEventTarget: function (event, result) {
		var target = 'error';

		for (var i = 0, l = this._transitions.length; i < l; i++) {
			var trans = this._transitions[i];

			if (trans.event == event) {
				if (!trans.condition) {
					target = trans.target;
					break;
				}
				else if (typeof trans.condition === 'function' && trans.condition(result, this)) {
					target = trans.target;
					break;
				}
			}
		}

		return target;
	},

	resolve: function () {
		return this.nestedCF.resolve();
	},

	getParentCallFlow: function () {
		return this._parentCallFlow;
	},

	setModel: function (model) {
		this.voiceModel = model;
	},

	removeTransitions: function () {
		this._transitions = [];
	}
});

module.exports = State;
