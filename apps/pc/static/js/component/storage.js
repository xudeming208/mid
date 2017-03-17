fml.define('component/storage', [], function(require, exports) {

	'use strict'
	var storage = {
		set: function(key, value, fun) {
			localStorage.setItem(key, value);
			typeof fun == 'function' && fun();
		},
		get: function(key, fun) {
			fun(localStorage.getItem(key));
		},
		remove: function(key) {
			localStorage.removeItem(key);
		},
		setSession: function(key, value, fun) {
			sessionStorage.setItem(key, value);
			typeof fun == 'function' && fun();
		},
		getSession: function(key, fun) {
			fun(sessionStorage.getItem(key));
		},
		removeSession: function(key) {
			sessionStorage.removeItem(key);
		}
	};

	return storage;
})