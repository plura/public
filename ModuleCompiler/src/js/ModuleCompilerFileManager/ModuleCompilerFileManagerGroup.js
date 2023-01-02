const ModuleCompilerFileManagerGroup = function ({data, target}) {


	var core, status, status_visibility,

		ui_ctrls, ui_ctrls_check, ui_ctrls_visibility, ui_tree;


	const 

		_this = this,


		render_controls = () => {


			( ui_ctrls = core.appendChild( document.createElement('div') ) ).classList.add('controls');

			( ui_ctrls_check = ui_ctrls.appendChild( document.createElement('div') ) ).classList.add( ...['control', 'controls-check'] );

			ui_ctrls_check.addEventListener('click', eventControlsCheckHandler);

			ui_ctrls_check.textContent = data.name || data.path;

			check( true, false );


			( ui_ctrls_visibility = ui_ctrls.appendChild( document.createElement('div') ) ).classList.add( ...['control', 'controls-visibility'] );

			ui_ctrls_visibility.addEventListener('click', eventControlsVisibilityHandler);


			visible( true );

		},



		/**
		 * Toggles tree status. If traverse is true it will activate or de-activate status, otherwise 
		 * only changes trigger's toggle status style
		 * @param  {Boolean} on       	indicates toggle status
		 * @param  {Boolean} traverse 	if true, activates-dectivates tree
		 * @param  {Boolean} event 		if true, activates-dectivates tree
		 */
		check = ( on, traverse = true, event = true ) => {

			if (on) {

				ui_ctrls_check.classList.add('on');

			} else {

				ui_ctrls_check.classList.remove('on');

			}

			if( traverse ) {
			
				ui_tree.activate( on, event );

			}

			status = on;

		},


		/**
		 * Visibility trigger click event
		 * @param  {Boolean} on  	visibility status
		 */
		visible = on => {

			if (on) {

				[core, ui_ctrls_visibility].forEach( element => element.classList.add('on') );

			} else {

				[core, ui_ctrls_visibility].forEach( element => element.classList.remove('on') );

			}

			status_visibility = on;

		},


		/**
		 * Tree active status trigger click event
		 * @param  {Object} event 	event object
		 */
		eventControlsCheckHandler = event => check( !status ),


		/**
		 * Tree visibility status trigger click event
		 * @param  {Object} event 	event object
		 */
		eventControlsVisibilityHandler = event => visible( !status_visibility ),


		/**
		 * Event triggered by file manager tree changes. It will prevent its traversing,
		 * therefore avoiding circular, infinite loop
		 * @param  {Object} event 	event object
		 */
		eventTreeHandler = event => check( ui_tree.active(), false );






	( core = target.appendChild( document.createElement('div') ) ).classList.add( ...['files-group', 'on'] );


	ui_ctrls	= render_controls();

	ui_tree		= new ModuleCompilerFileManagerGroupTree({data: data.core, target: core});

	ui_tree.core.addEventListener('GROUP_TREE_CHANGE', eventTreeHandler );

	
	_this.active	= ui_tree.active;

	_this.check		= check;

	_this.core		= core;

	_this.visible	= visible;

};