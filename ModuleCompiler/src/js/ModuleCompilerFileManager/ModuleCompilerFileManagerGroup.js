
var ModuleCompilerFileManagerGroup = function ({data, target}) {


	var core, ui_ctrls, ui_ctrls_check, ui_ctrls_visibility, ui_tree;


	const 

		_this = this,


		render_controls = function () {


			( ui_ctrls = core.appendChild( document.createElement('div') ) ).classList.add('controls');

			( ui_ctrls_check = ui_ctrls.appendChild( document.createElement('div') ) ).classList.add( ...['controls-check', 'on'] );

			ui_ctrls_check.addEventListener('click', eventControlsCheckHandler);

			ui_ctrls_check.textContent = data.name || data.path;


			( ui_ctrls_visibility = ui_ctrls.appendChild( document.createElement('div') ) ).classList.add( ...['controls-visibility', 'on'] );

			ui_ctrls_visibility.addEventListener('click', eventControlsVisibilityHandler);

		},



		/**
		 * Toggles tree status. If traverse is true it will activate or de-activate status, otherwise 
		 * only changes trigger's toggle status style
		 * @param  {Boolean}  on       	indicates toggle status
		 * @param  {Boolean} traverse 	if true, activates-dectivates tree
		 */
		check = function ( on, traverse = true ) {

			if (on) {

				ui_ctrls_check.classList.add('on');

			} else {

				ui_ctrls_check.classList.remove('on');

			}

			if( traverse ) {
			
				ui_tree.activate( on );

			}

		},


		/**
		 * Visibility trigger click event
		 * @param  {Boolean} on  	visibility status
		 */
		visible = function ( on ) {

			if (on) {

				[core, ui_ctrls_visibility].forEach( element => element.classList.add('on') );

			} else {

				[core, ui_ctrls_visibility].forEach( element => element.classList.remove('on') );

			}

		},


		/**
		 * Tree active status trigger click event
		 * @param  {Object} event 	event object
		 */
		eventControlsCheckHandler = function( event ) {

			check( !ui_ctrls_check.classList.contains('on') );

		},


		/**
		 * [eventControlsVisibilityHandler description]
		 * @param  {Object} event 	event object
		 */
		eventControlsVisibilityHandler = function( event ) {

			visible( !ui_ctrls_visibility.classList.contains('on') );

		},


		/**
		 * Event triggered by file manager tree changes. It will prevent its traversing,
		 * therefore avoiding circular, infinite loop
		 * @param  {Object} event 	event object
		 */
		eventTreeHandler = event => {

			check( ui_tree.active(), false );

		};






	( core = target.appendChild( document.createElement('div') ) ).classList.add( ...['files-group', 'on'] );


	ui_ctrls	= render_controls();

	ui_tree		= new ModuleCompilerFileManagerTree({data: data.core, target: core});

	ui_tree.core.addEventListener('CHANGE', eventTreeHandler );

	
	_this.core		= core;
	_this.inactive	= () => ui_tree.inactive();

};