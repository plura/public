var ModuleCompilerResultManager = function ({prefix, target}) {

	let core, inner, textarea;

	const 

		_this = this,

		refresh = function(data) {

			textarea.value = data;

		};


console.log(prefix);


	( core = target.appendChild( document.createElement('div') ) ).classList.add(`${prefix}-result`);

	textarea = core.appendChild( document.createElement('textarea') );




	_this.refresh	= refresh;

};