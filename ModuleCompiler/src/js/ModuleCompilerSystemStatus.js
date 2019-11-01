var ModuleCompilerSystemStatus = function({app, prefix, target}) {

	var core, status;

	const

		_this = this,

		set = (type, status = true) => {

			core.classList[ status ? 'add' : 'remove']('on');

			app.core.classList[ status ? 'add' : 'remove' ]( `status-${type}` );

		};


	( core = target.appendChild( document.createElement('div') ) ).classList.add( `${prefix}-systemstatus` );

	( status = core.appendChild( document.createElement('div') ) ).classList.add( `${prefix}-systemstatus-indicator` );


	_this.set = set;


}