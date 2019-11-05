/**
 * [ModuleCompiler description]
 * @param {[type]} options.data    [description]
 * @param {[type]} options.prefix  [description]
 * @param {String} options.process [description]
 */
var ModuleCompiler = function ({data, prefix, process = 'ModuleCompiler.php'}) {
		
	
	let core, datahandler, id, ui_collections, ui_files, ui_preferences, ui_result, ui_systemstatus;


	const 

		_this = this,

		PRFX = 'p-app-modulecompiler',


		render = () => {

			if(!core) {

				( _this.core = core = document.body.appendChild( document.createElement('div') ) ).classList.add(PRFX);

			}


			ui_collections	= new ModuleCompilerFilterCollection({data: datahandler.filter(), prefix: PRFX, target: core});

			ui_collections.core.addEventListener('COLLECTIONS', eventFilterHandler);



			ui_preferences	= new ModuleCompilerPreferences({target: core, prefix: PRFX});

			ui_preferences.core.addEventListener('PREFERENCES', eventFilterHandler);


			ui_files		= new ModuleCompilerFileManager({prefix: PRFX, target: core});

			['FILES', 'GROUPS'].forEach( eventType => ui_files.core.addEventListener(eventType, eventFilterHandler) );



			ui_result		= new ModuleCompilerResultManager({prefix: PRFX, target: core});


			ui_systemstatus	= new ModuleCompilerSystemStatus({app: _this, prefix: PRFX, target: core});			

		},




		eventDataCollectionsHandler = data => {

			ui_files.refresh( data.tree );

			ui_result.refresh( data.result );

		},


		eventDataFilesHandler = data => {

			ui_result.refresh( data.result );

			ui_systemstatus.set('loading', false);

		},


		eventFilterHandler = event => {

			event.stopImmediatePropagation();

			switch (event.type) {

			case 'COLLECTIONS':

				ui_files.start( datahandler.collection( event.detail ) );

				break;

			case 'GROUPS':

				id = event.detail.id;

				ui_preferences.refresh( datahandler.type( id ), datahandler.returnTypes( id ) );

				datahandler.load( id, eventDataCollectionsHandler, ui_preferences.get() );

				break;

			case 'FILES':
			case 'PREFERENCES':

				ui_systemstatus.set('loading', ui_preferences.wait() );

				datahandler.load( id, eventDataFilesHandler, ui_preferences.get(), ui_files.get() );

				break;								

			}

		};



	datahandler	= new ModuleDataManager({data: data, handler: render, prefix: prefix, process: process});

	
};