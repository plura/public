/**
 * Filter for file groups
 */
const ModuleCompilerFileManagerGroupsNav = function({target}) {


	let active, core, data, map, status, status_visibility,

		ui_nav_index, ui_nav_select, ui_ctrls, ui_ctrls_check, ui_ctrls_visibility;


	const

		_this = this,

		refresh = groups => {

			//empty
			while ( core.firstChild ) {
			
				core.removeChild( core.firstChild );
			
			}

			active	= null;

			data	= groups;

			if( data.length > 1 ) {

				render_set_nav( data );

			}

			render_set_groups_controls();

			select();

		},



		/**
		 * refreshes collection sets' select and bullet navigation
		 * @param  {number} index 	nav index
		 * @return {[type]}       	[description]
		 */
		refresh_nav = index => {

			ui_nav_select.core.querySelector('select').value = index;

			[ ...ui_nav_index.children ].forEach( (element, n) => {

				if( index === n ) {

					element.classList.add('active');

					element.removeEventListener('click', eventNavChangeHandler);

				} else {

					element.classList.remove('active');

					element.addEventListener('click', eventNavChangeHandler);

				}

			});

		},



	   /**
		* render group select box navigation and index 'position' indicator
		* @param {Array} data - the array containing group data
		*/
		render_set_nav = data => {

			let values = [], element;

			map = new Map();

			( ui_nav_index = document.createElement('div') ).classList.add('index');

			data.forEach( (option, index) => {

				values.push({name: option.name, value: index});

				( element = ui_nav_index.appendChild( document.createElement('div') ) ).classList.add('i');

				map.set(element, index);

			});


			ui_nav_select = new ModuleCompilerForm({
				data: [{type: 'select', values: values, change: eventSelectChangeHandler, blank: false}],
				target: core
			});


			core.appendChild( ui_nav_index );


		},



		render_set_groups_controls = () => {

			( ui_ctrls = document.createElement('div') ).classList.add('controls');

			( ui_ctrls_check = ui_ctrls.appendChild( document.createElement('div') ) ).classList.add( ...['control', 'controls-check'] );

			ui_ctrls_check.addEventListener('click', eventControlsCheckHandler);

			check( true, false );


			//ui_ctrls_check.textContent = data.name || data.path;


			( ui_ctrls_visibility = ui_ctrls.appendChild( document.createElement('div') ) ).classList.add( ...['control', 'controls-visibility'] );

			ui_ctrls_visibility.addEventListener('click', eventControlsVisibilityHandler);

			show( true, false );

		},



	   /**
		* selects group by its data index. By default selects the first element
		* @param {number} [index=0] - the set index
		*/
		select = (index = 0) => {

			if (index !== active) {

				if (data.length > 1) {

					refresh_nav( index );

				}

				active = index;

				//dispatches selected id
				core.dispatchEvent( new CustomEvent('GROUPS_SELECT', {bubbles: true, detail: data[ index ]}) );

			}

			//if collection set has more than one module/group add global check/visible controls.
			//Otherwise remove them
			if( data[index].items.length > 1 ) {

				core.appendChild( ui_ctrls );

			} else if( ui_ctrls.isConnected ) {

				core.removeChild( ui_ctrls );

			}

		},



		/**
		 * Toggles tree status. If event is true it will trigger an event, otherwise 
		 * only changes trigger's toggle status style.
		 * only changes trigger's toggle status style
		 * @param  {Boolean}  on       	indicates toggle status
		 * @param  {Boolean} event 		if true, triggers event
		 */
		check = ( on, event = true ) => {

			if ( on ) {

				ui_ctrls_check.classList.add('on');

			} else {

				ui_ctrls_check.classList.remove('on');

			}

			status = on;

			if( event ) {

				core.dispatchEvent( new CustomEvent('GROUPS_CHECK', { detail: { check: status } } ) );

			}

		},


		/**
		 * Visibility trigger click event. If event is true it will trigger an event, otherwise 
		 * only changes trigger's toggle status style.
		 * @param  {Boolean} on  	visibility status
		 * @param  {Boolean} event 	if true, triggers event
		 */
		show = ( on, event = true ) => {

			if ( on ) {

				ui_ctrls_visibility.classList.add('on');

			} else {

				ui_ctrls_visibility.classList.remove('on');

			}

			status_visibility = on;

			if( event ) {

				core.dispatchEvent( new CustomEvent('GROUPS_VISIBILITY', { detail: { visibility: status_visibility } } ) );

			}

		},



		eventNavChangeHandler = event => select( map.get( event.currentTarget ) ),


		//activates selection. turns value into integer - ie. for 'index' DOM targeting
		eventSelectChangeHandler = ({element}) => select( Number( element.value ) ),


		/**
		 * Global trees active status trigger click event
		 * @param  {Object} event 	event object
		 */
		eventControlsCheckHandler = event => check( !status ),


		/**
		 * Global trees visibility status trigger click event
		 * @param  {Object} event 	event object
		 */
		eventControlsVisibilityHandler = event => show( !status_visibility );



	( core = target.appendChild( document.createElement('div') ) ).classList.add('files-group-nav');

	_this.core		= core;
	
	_this.check		= check;

	_this.refresh	= refresh;

	_this.show		= show;


};