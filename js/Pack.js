/**
 * Useful for rapid initialization of deep structured packages 
 * Take for example Menu.js pertaining the following structure:
 * 
 * 'myapp.templates.structures.navigation'
 *
 * The Menu class could be easily integrated just by doing:
 *
 * pack('myapp.templates.structures.navigation').Menu = function () {
 *
 * 		[your code here]
 *	
 * }
 *
 */
var packs = function (path) {

	var i, paths = path.split('.'), pack = window;

	for (i = 0; i < paths.length;  i += 1) {

		pack[ paths[i] ] = pack[ paths[i] ] || {};

		pack = pack[ paths[i] ];

	}

	return pack;

};
