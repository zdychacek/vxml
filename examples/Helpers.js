'use strict';

var Q = require('q');

var Helpers = {
	delay: function (milliseconds) {
		var deferred = Q.defer();
		setTimeout(deferred.resolve, milliseconds);
		return deferred.promise;
	}
};

module.exports = Helpers;