const ModuleCompilerForm = function({data, target}) {


	let form, map;


	const 

		_this = this,


		render = (data, target) => {

			data.forEach( elementData => {

				let element;

				//if obj is an array, create a fieldset and populate it elements
				if( elementData instanceof Array || elementData.type.match(/(field)?set/) ) {

					element = target.appendChild( document.createElement( elementData.tag || 'fieldset' ) );

					render( elementData.fields || elementData, element );

				//otherwise render form element
				} else {

					switch( elementData.type ) {

					case 'select':

						element = renderSelect({elementData: elementData.values, blank: elementData.blank});

						break;

					default:

						element = document.createElement('input');

					}

					element.classList.add('p-modulecompiler-form-element');

				}

			
				target.appendChild( element );

				
				if( !u( elementData.label ) ) {

					renderLabel(elementData.label, element);

				}


				renderProp( element, elementData );


			});

		},


		/**
		 * [description]
		 * @param  {Object} elementData     	element data
		 * @param  {Object} elementParent   	parent, if not indicated it will refer to the root element, select
		 * @param  {string} elementParentID		parentID
		 * @return {Object}						returns select element
		 */
		renderSelect = ({elementData, elementParent, elementParentID, blank = true}) => {

			let element = elementParent || document.createElement('select');


			if(!elementParent && blank) {

				element.appendChild( document.createElement('option') );

			}


			elementData.forEach( (data, index) => {

				let el, el_id = `${ elementParentID ? `${elementParentID}_` : 'i' }${ index }`, el_name, el_data;

				if (data.values || data instanceof Array) {

                    el_name	= data.values && (data.label || data.name) ? data.label || data.name : `group${ index }`;

                    el_data	= data.values || data;

                    ( el = element.appendChild( document.createElement('optgroup') ) ).setAttribute('label', el_name);


                    renderSelect({elementData: el_data, elementParent: el, elementParentID: el_id});

				
				} else {

					el_name	= val( [data.label, data.name, data.value, data] );

					( el = element.appendChild( document.createElement('option') ) ).value = val( [ data.value, el_name ] );

					el.textContent = el_name;

					map.set(el, el_id);

				}

			} );

			return element;

		},




		renderLabel = (label, field, labelAlign = ModuleCompilerFormLabelAlign.LEFT) => {

			let align = label.align || labelAlign,

				obj = document.createElement('label'),

				id = `p-modulecompiler-form-element-${ Date.now() + Math.floor( Math.random() * 256) }`;

			attr(field, {'id': id});

			attr(obj, {'for': id, 'align-type': align});

			obj.textContent = label.name || label;

			switch (align) {

			case ModuleCompilerFormLabelAlign.LEFT:

				field.parentNode.insertBefore(obj, field);

				break;

			case ModuleCompilerFormLabelAlign.LEFT_WRAP:

				( field.parentNode.appendChild( obj ) ).appendChild( field );

				break;        		

			case ModuleCompilerFormLabelAlign.RIGHT:

				field.parentNode.insertBefore(obj, field.nextSibling);

				break;

			case ModuleCompilerFormLabelAlign.RIGHT_WRAP:
		        
		         ( field.parentNode.appendChild( obj ) ).prepend( field );

				break;

			}

			obj.classList.add(`align-${align}`);

			return obj;

		},



		renderProp = (element, elementData) => {

			let prop = {};

			if( !elementData.type || elementData.type.match(/((field)?set|checkbox|radio|text)/) ) {

				if( !elementData.type.match(/(field)?set/) || elementData.tag ) {

					prop.type = elementData.type || 'text';

				}

			}

			if( !u( elementData.name ) ) {

				prop.name = elementData.name;

			}

			if( !u( elementData.change ) ) {

				element.addEventListener('change', event => elementData.change({data: elementData, form: form, element: element, obj: _this}));

			}

			if( !u( elementData.value )  ) {

				prop.value = elementData.value;

			}

			if( elementData.type.match(/(checkbox|radio)/) && elementData.checked ) {

				prop.checked = true;

			}


			attr(element, prop);


		},



		attr = (element, prop) => Object.entries( prop ).forEach( ([key, value]) => element.setAttribute(key, value) ),


		u = value => value === undefined,


		val = data => {

			let el;

			for(const value of data ) {

				el = value;

				if( el !== undefined ) {

					return el;

				}

			}

			return el;

		};






	if( data ) {

		map = new Map();

		_this.core = form = target.appendChild( document.createElement('form') );

		render( data, form );

	}


};