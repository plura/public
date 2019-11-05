var ModuleCompilerResultManager = function ({prefix, target}) {

	let core, textarea;

	const 

		_this = this,

		refresh = data => {

			textarea.value = data;

		};


	( core = target.appendChild( document.createElement('div') ) ).classList.add(`${prefix}-result`);

	textarea = core.appendChild( document.createElement('textarea') );



	_this.refresh	= refresh;

};