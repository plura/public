/**
 * Indicates loading status
 * @param {Object} options.app    [description]
 * @param {string} options.prefix [description]
 * @param {Object} options.target [description]
 */
const ModuleCompilerSystemStatus = function({app, prefix, target}) {

	let core, status;

	const

		_this = this,

		set = (type, status = true) => {

			core.classList[ status ? 'add' : 'remove']('on');

			app.core.classList[ status ? 'add' : 'remove' ]( `status-${type}` );

		};


	( core = target.appendChild( document.createElement('div') ) ).classList.add( `${prefix}-systemstatus` );

	( status = core.appendChild( document.createElement('div') ) ).classList.add( `${prefix}-systemstatus-indicator` );


	_this.set = set;

};