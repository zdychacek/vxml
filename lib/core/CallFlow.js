'use strict';

var Q = require('q'),
	co = require('co'),
	Class = require('class');

var CallFlow = Class.extend({
	constructor: function () {
		this._init();

		// publics
		this.$sessionId = null;
	},

	_init: function () {
		// privates
		this._states = {};
		this._currState = null;
		this._startState = null;
		this._isResolved = false;

		// remember first state added
		this._firstAddedState = null;
		this._completedFinalState = false;
	},

	getStatus: function () {
		if (!Object.keys(this._states).length) {
			return 'empty';
		}
		if (!this._currState) {
			return 'notStarted';
		}
		else {
			if (this._completedFinalState) {
				return 'completed';
			}
			else {
				return 'active';
			}
		}
	},

	getCurrState: function () {
		return this._currState;
	},

	getNestedCFStatus: function () {
		if (!this._currState || !this._currState.nestedCF) {
			return 'empty';
		}
		else {
			return this._currState.nestedCF.getStatus();
		}
	},

	restart: function () {
		this._isResolved = false;
		this._currState = null;
		this._completedFinalState = false;
	},

	addStates: function (states) {
		if (Array.isArray(states)) {
			states.forEach(function (state) {
				this.addState(state);
			}, this);
		}
	},

	addState: function (state, initialState) {
		var statesIds = Object.keys(this._states);

		if (~statesIds.indexOf(state.id)) {
			throw new Error('CallFlow#addState(): State with id \'' + state.id + '\' already exists in callflow.');
		}

		if (!statesIds.length) {
			this._firstAddedState = state;
		}

		this._states[state.id] = state;

		// add reference to callFlow in which this state belongs to
		state._parentCallFlow = this;

		if (typeof state.createModel === 'function') {
			state.voiceModel = state.createModel.call(state, this);
			state.voiceModel.id = state.id;
		}

		if (initialState) {
			this._startState = state;
		}

		return this;
	},

	fireEventInNestedCF: function (event, data, statesStack) {
		var currState = this._currState;

		return currState.nestedCF.fireEvent(event, data, statesStack).then(function () {
			currState.voiceModel = currState.nestedCF.getCurrState().voiceModel;
		});
	},

	fireEvent: function (event, data, statesStack) {
		var cf = this;

		!statesStack && (statesStack = []);

		function _do () {
			var status = cf.getNestedCFStatus();

			if (status == 'completed' || status == 'empty') {
				if (status == 'completed') {
					cf._currState.nestedCF.restart();
				}

				// fire onExit listeners
				return cf._currState._onExit.execute(cf, cf._currState, event, data).then(function () {
					var targetId = cf._currState.getEventTarget(event, data),
						nextState = cf._states[targetId];

					// transition to next state
					if (nextState) {
						cf._currState = nextState;

						// fire onEntry listeners
						return cf._currState._onEntry.execute(cf, cf._currState, event, data).then(function () {
							if (cf._currState.nestedCF) {
								return cf._currState.nestedCF.resolve().then(function () {
									//if there are composite states run them
									if (cf.getNestedCFStatus() != 'empty') {
										return cf.fireEventInNestedCF(event, data, statesStack);
									}
								});
							}
						});
					}
				});
			}
		}

		return this.resolve().then(function () {
			if (!cf._currState) {
				if (cf._startState) {
					cf._currState = cf._startState;

					statesStack && statesStack.push(cf._currState);

					if (!cf._currState || !cf._currState.nestedCF || cf._currState.nestedCF.getStatus() == 'empty') {
						return cf._currState._onEntry.execute(cf, cf._currState, event, data);
					}
					else {
						return cf.fireEventInNestedCF(event, data, statesStack);
					}
				}
			}
			else {
				/*var log = ['id:', cf._currState.id, 'isFinal:', cf._currState.isFinal()];

				if (cf._currState.nestedCF) {
					log.push('status:');
					log.push(cf._currState.nestedCF.getStatus());
				}

				console.log.apply(console, log);*/

				if (cf._currState.isFinal()) {
					return cf._currState._onExit.execute(cf, cf._currState, event, data).then(function () {
						cf._completedFinalState = true;

						if (statesStack) {
							/*var log = statesStack.map(function (s) {
								return s.id;
							});
							console.log.apply(console, log);*/

							var lastStateInStack = statesStack.pop();

							if (lastStateInStack &&
								lastStateInStack._parentCallFlow &&
								lastStateInStack._parentCallFlow._currState.isFinal()
							) {
								return lastStateInStack._parentCallFlow.fireEvent(event, data);
							}
						}
					});
				}
				else {
					var status = cf.getNestedCFStatus();

					statesStack && statesStack.push(cf._currState);

					if (status == 'active') {
						return cf.fireEventInNestedCF(event, data, statesStack).then(function () {
							return _do();
						});
					}
					else {
						return _do();
					}
				}
			}
		});
	},

	resolve: function () {
		var deferred = Q.defer(),
			cf = this;

		if (this._isResolved) {
			deferred.resolve(this);
		}
		else {
			if (this.create.constructor.name !== 'GeneratorFunction') {
				throw new Error('CallFlow#create must be generator function.');
			}
			co(function* () {
				try {
					this._init();
					yield this.create();
				}
				catch (ex) {
					deferred.reject(ex);
				}
			}).call(this, deferred.resolve);
		}

		// set first added state, if no state was set explicitly
		deferred.promise.then(function () {
			cf._isResolved = true;

			if (!cf._startState) {
				cf._startState = cf._firstAddedState;
			}
		});

		return deferred.promise;
	},

	create: function* () {
		throw new Error('CallFlow#create(): CallFlow must implement \'create\' generator function.');
	}
});

module.exports = CallFlow;
