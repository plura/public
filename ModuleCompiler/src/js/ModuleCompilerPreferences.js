/**
 * Filter for output type - script, join or closure compiler *
 */
var ModuleCompilerPreferences = function ({prefix, target}) {

	let core, form;

	const 

		_this = this,
	
		get = () => {

			let params = {'returnType': val('[name=returnType]:checked') };

			if( params.returnType.match(/join/) ) {

				params = { ...params,
					'minify': el('[name=minify]').checked ? 1 : 0
				};

			}
	
			return params;

		},


		//check if external load is necessary aka "minify" option is checked
		wait = () => get().minify,



		refresh = ({type, returnTypes} = {}) => {

			//disable returnTypes not included in the 'returnTypes' available values
			if( returnTypes ) {

				el('[name=returnType]', true).forEach( element => {

					element.disabled = !returnTypes.includes( element.value );

				});

			}


			//toggles visibility of non-main fieldset in accordance to main fieldset radio checked value
			el('[type=set]:not([name=main])', true).forEach( element => {

				if( val('[name=returnType]:checked') === element.getAttribute('name') ) {

					element.classList.add('on');

				} else {

					element.classList.remove('on');

				}

			});


			//JS type: es6 disabled if minify is unchecked
			el('[name="join"] [name=es6]').disabled = !el('[name="join"] [name=minify]').checked;


			//de-activate fields that do not belong to certain types (ie. CSS)
			if( type ) {

				el('[name="join"] [name=es6]').classList[ type.match(/js/) ? 'remove' : 'add' ]('off');
				
			}



			//disable / de-activate labels according to target's disabled/de-activated status
			form.core.querySelectorAll('[id]').forEach( element => {

				let label = el(`label[for=${ element.id }]`), conditions;

				if( label ) {

					conditions = [ [element.disabled ? 'add' : 'remove', 'disabled'] ];

					if( type ) {

						conditions.push( [ element.classList.contains('off') ? 'add' : 'remove', 'off' ] );

					}

					conditions.forEach( condition => label.classList[ condition[0] ]( condition[1] )  );

				}

			});

		},


		//get element
		el = (selector, all = false) => form.core[ all ? 'querySelectorAll' : 'querySelector' ]( selector ),


		//get value
		val = selector => el( selector ).value,


		eventChangeHandler = event => {

			refresh();

			let load = get('minify').checked;

			core.dispatchEvent( new CustomEvent('PREFERENCES', {detail: {load: load} }) );

		};



	( core = target.appendChild( document.createElement('div') ) ).classList.add(`${prefix}-preferences`);


	form = new ModuleCompilerForm({target: core, data: [

			{
				type: 'set', name: 'main', tag: 'div', fields: [
					{name: 'returnType', type: 'radio', label: {name: 'Link', align: 'right'}, value: 'link', checked: true, change: eventChangeHandler},
					{name: 'returnType', type: 'radio', label: {name: 'Join', align: 'right'}, value: 'join', change: eventChangeHandler},
					{name: 'returnType', type: 'radio', label: {name: 'Closure', align: 'right'}, value: 'closure', change: eventChangeHandler}
				]
			},
			{
				type: 'set', name: 'join', tag: 'div', fields: [
					{name: 'minify', type: 'checkbox', label: {name: 'Minify', align: 'right'}, change: eventChangeHandler},
					{name: 'es6', type: 'checkbox', label: {name: 'ES6', align: 'right'}, checked: true, change: eventChangeHandler}
				]
			}

		]

	});


	refresh();


	_this.core		= core;
	_this.get		= get;
	_this.refresh	= (type, returnTypes) => refresh({type: type, returnTypes: returnTypes});
	_this.wait		= wait;



};