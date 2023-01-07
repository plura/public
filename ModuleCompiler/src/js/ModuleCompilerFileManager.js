/**
 * deals with file structures groups
 * @param {Object[]} options 				ModuleCompilerFileManager options
 * @param {Object} options.target 			DOM holder
 * @param {Object} options.handler 			[description]
 * @return {undefined}
 */
const ModuleCompilerFileManager = function ({prefix, target}) {


	let core, groups, group_nav, inner;


	const

		_this = this,

		/**
		 * gets a multidimensional array of one or more arrays of 
		 * excluded files for each package's group
		 * @return {Object[]}	an array of excluded files
		 */
		get = () => {

			let data = [], inactive;

			groups.forEach( (group, index) => {

				if( group.active() ) {
	
					inactive = group.active( false );

					data[index] = {};

					if ( inactive ) {

						data[ index ].exclude = [];

						for(const value of inactive.values()) {

							data[ index ].exclude.push( value.path || value );

						}

					}

				} else {

					data[ index ] = false;

				}

			});

			return data;
			
		},


		clean = () => {

			groups = [];

			while (inner.firstChild) {
			
				inner.removeChild( inner.firstChild );
			
			}

		},


	   /**
		* refreshes data objects
		* @param {Object} data	the collection data
		*/
		refresh = data => {

			clean();

			data.forEach( (item, index) => {

				groups[index] = new ModuleCompilerFileManagerGroup({
					data:	item,
					target:	inner
				});
				

				['GROUP_TREE_CHANGE', 'GROUP_VISIBILITY'].forEach(

					eventType => groups[index].core.addEventListener(eventType, eventGroupHandler)

				);

			});

		},



	   /**
		* refresh file manager title + group navigation
		* @param {Object} collection - the collectionn data object
		*/
		start = collection => {

			group_nav.refresh( collection.groups );

			core.setAttribute('data-title', collection.label);

		},


		eventFileGroupNavHandler = event => {

			event.stopImmediatePropagation();

			switch( event.type ) {

			case 'GROUPS_CHECK':

				//Traverse all groups WITHOUT triggering an event (last false param in foreach loop function).
				//Before, only the first group data was handled/loaded
				groups.forEach( group => group.check( event.detail.check, true, false ) );

				//after handling groups checking, trigger FILES event for data handling/loading
				core.dispatchEvent( new CustomEvent('FILES') );

				break;

			//checks/unchecks all groups visibility
			case 'GROUPS_VISIBILITY':

				groups.forEach( group => group.show( event.detail.visibility ) );

				break;

			}

		},


		//Triggers 'FILES' event, indicating changes in the files' tree structure occurred. 
		//ModuleCompiler will catch this event and refresh data accordingly
		//It also updates group nav global check trigger (ie. if no module is active)
		eventGroupHandler = event => {

			event.stopImmediatePropagation();

			switch( event.type ) {

			case 'GROUP_TREE_CHANGE':

				let inactive = [];

				groups.forEach( group => {

					if( !group.active() ) {

						inactive.push( group );

					}

				} );

				group_nav.check( inactive.length !== groups.length, false );

				core.dispatchEvent( new CustomEvent('FILES') );

				break;

			case 'GROUP_VISIBILITY':

				let invisible = [];

				groups.forEach( group => {

					if( !group.visible() ) {

						invisible.push( group );

					}

				} );

				group_nav.show( invisible.length !== groups.length, false );

				break;

			}

		};




	( core = target.appendChild( document.createElement('div') ) ).classList.add(`${prefix}-files`);


	group_nav	= new ModuleCompilerFileManagerGroupsNav({target: core});

	
	['GROUPS_CHECK', 'GROUPS_VISIBILITY'].forEach( eventType => group_nav.core.addEventListener(eventType, eventFileGroupNavHandler) );


	( inner = core.appendChild( document.createElement('div') ) ).classList.add('inner');


	_this.core		= core;

	_this.get		= get;

	_this.refresh	= refresh;

	_this.start		= start;


};