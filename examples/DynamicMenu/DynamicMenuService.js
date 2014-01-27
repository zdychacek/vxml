'use strict';

var menus = {},
	numbers = [ 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine' ];

// vytvoreni menu
var myMenu = {
	name: 'myMenu',
	options: []
};

myMenu.options.push({
	number: 1,
	promptMsg: 'To do this',
	transitionTarget: 'doThis'
});
myMenu.options.push({
	number: 2,
	promptMsg: 'To do that',
	transitionTarget: 'doThat'
});
myMenu.options.push({
	number: 3,
	promptMsg: 'To do whatever',
	transitionTarget: 'doWhatever'
});

// registrace menu
menus[myMenu.name] = myMenu;

var DynamicMenuService = {
	getMenu: function (menu) {
		return menus[menu];
	},

	getSelectionPrompt: function (selectNum) {
		return ', press ' + numbers[selectNum] + '.';
	}
};

module.exports = DynamicMenuService;
