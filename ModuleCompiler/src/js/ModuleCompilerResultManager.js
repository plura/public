const ModuleCompilerResultManager = function({prefix, target}) {

	var active, core, tree;

	const

		_this = this,

		_label = {
			compiled_code:	'Compiled Code',
			errors:			'Errors',
			result:			'Result',
			warnings:		'Warnings',
			statistics:		'Statistics'
		},


		activate = (element, status=true) => {

			if( !status || ( status && element !== active )  ) {

				if( status ) {


					if(active) {

						activate(active, false);

					}

					active = element;

				}

				activate_style( element, status );

			}

		},


		activate_style = (element, status) => {

			let nav = tree.get( element ).nav.classList, content = tree.get( element ).content.classList;

			if( status ) {

				nav.add('active');

				content.add('on');

			} else {

				nav.remove('active');

				content.remove('on');

			}

		},


		empty = () => {

			active = undefined;

			tree = new Map();

			while (core.firstChild) {

				core.removeChild(core.firstChild);

			}


		},



		refresh = data => {

			let content = typeof data === 'string' ? {result: data} : data;

			render( content );

			//activate first
			activate( tree.keys().next().value );

		},



		render = data => {

			empty();

			let ui_nav, ui_nav_item, ui_nav_item_trigger, ui_content, ui_content_item, ui_content_item_textarea;

			( ui_nav = core.appendChild( document.createElement('ul') ) ).classList.add(`${prefix}-result-nav`);

			( ui_content = core.appendChild( document.createElement('div') ) ).classList.add(`${prefix}-result-content`);

			
			Object.entries( data ).forEach( ([key, value]) => {

				//create nav item
				( ui_nav_item = ui_nav.appendChild( document.createElement('li') ) ).classList.add(`${prefix}-result-nav-item`);


				//add nav item trigger
				( ui_nav_item_trigger = ui_nav_item.appendChild( document.createElement('a') ) ).textContent = _label[key] || key;

				ui_nav_item_trigger.setAttribute('href', '#');

				ui_nav_item_trigger.addEventListener('click', event => activate( event.currentTarget ) );


				//create content holder item
				( ui_content_item = ui_content.appendChild( document.createElement('div') ) ).classList.add(`${prefix}-result-content-item`);


				( ui_content_item_textarea = ui_content_item.appendChild( document.createElement('textarea') ) ).textContent = value;


				tree.set( ui_nav_item_trigger, {nav: ui_nav_item, content: ui_content_item} );

			});


		};


	( core = target.appendChild( document.createElement('div') ) ).classList.add( `${prefix}-result` );


	_this.refresh = refresh;

};