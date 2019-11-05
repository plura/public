/**
 * Filter for file groups
 */
var ModuleCompilerFileManagerGroupNav = function({target}) {


	let active, core, data, map, nav_index, nav_select;


	const

		_this = this,

		refresh = groups => {

			//empty
			while (core.firstChild) {
			
				core.removeChild( core.firstChild );
			
			}

			active	= null;

			data	= groups;

			if( data.length > 1 ) {

				render( data );

			}

			select();

		},


	   /**
		* render group select box navigation and index 'position' indicator
		* @param {Array} data - the array containing group data
		*/
		render = data => {

			let values = [], element;

			map = new Map();

			( nav_index = document.createElement('div') ).classList.add('index');

			data.forEach( (option, index) => {

				values.push({name: option.name, value: index});

				( element = nav_index.appendChild( document.createElement('div') ) ).classList.add('i');

				map.set(element, index);

			});


			nav_select = new ModuleCompilerForm({
				data: [{type: 'select', values: values, change: eventSelectChangeHandler, blank: false}],
				target: core
			});


			core.appendChild( nav_index );

		},


	   /**
		* selects group by its data index. By default selects the first element
		* @param {number} [index=0] - the group index
		*/
		select = (index = 0) => {

			if (index !== active) {

				if (data.length > 1) {

					show( index );

				}

				active = index;

				//dispatches selected id
				core.dispatchEvent( new CustomEvent('SELECT', {detail: data[ index ]}) );

			}

		},


		show = index => {

			nav_select.core.querySelector('select').value = index;

			[ ...nav_index.children ].forEach( (element, n) => {

				if( index === n ) {

					element.classList.add('active');

					element.removeEventListener('click', eventNavChangeHandler);

				} else {

					element.classList.remove('active');

					element.addEventListener('click', eventNavChangeHandler);

				}

			});

		},


		eventNavChangeHandler = event => {

			select( map.get( event.currentTarget ) );

		},

		//activates selection. turns value into integer - ie. for 'index' DOM targeting
		eventSelectChangeHandler = ({element}) => {

			select( Number( element.value ) );

		};



	( core = target.appendChild( document.createElement('div') ) ).classList.add('files-group-nav');

	_this.core		= core;
	_this.refresh	= refresh;


};