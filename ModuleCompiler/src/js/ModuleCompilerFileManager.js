/**
 * deals with file structures groups
 * @param {Object[]} options 				ModuleCompilerFileManager options
 * @param {Object} options.target 			DOM holder
 * @param {Object} options.handler 			[description]
 * @return {undefined}
 */
var ModuleCompilerFileManager = function ({handler, prefix, target}) {


	let core, groups, group_nav, inner;


	const

		_this = this,

		/**
		 * gets a multidimensional of one or more arrays of excluded files for
		 * each package's group
		 * @return {Object[]}	an array of excluded files
		 */
		get = function () {

			let exclude = [], inactive;

			groups.forEach( (group, index) => {

				inactive = group.inactive();

				if (inactive) {

					exclude[ index ] = [];

					for(const data of inactive.values()) {

						exclude[ index ].push( data.path || data );

					}

				} else {

					exclude[ index ] = false;

				}

			});

			return exclude;
			
		},


		clean = function () {

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
				
				groups[index].core.addEventListener('CHANGE', eventTreeHandler);

			});

		},


		/*resize = function ( height ) {

			var innerh = ( height - parseInt( $( core ).css('padding'), 10) * 2 ) -  $( group.core ).height();

			$( core ).outerHeight( height );

			$( inner ).outerHeight('').removeClass('has-scroll');

			if ( innerh < $( inner ).outerHeight() ) {

				$( inner ).outerHeight( innerh ).addClass('has-scroll');

			}

		},*/


	   /**
		* refresh file manager title + group navigation
		* @param {Object} collection - the collectionn data object
		*/
		start = collection => {

			group_nav.refresh( collection.groups );

			core.setAttribute('data-title', collection.label);

		},


		eventFileGroupSelectHandler = function (event) {

			event.stopImmediatePropagation();

			core.dispatchEvent( new CustomEvent('GROUPS', {detail: event.detail}) );

		},


		eventTreeHandler = function (event) {

			event.stopImmediatePropagation();

			core.dispatchEvent( new CustomEvent('FILES') );

		};




	( core = target.appendChild( document.createElement('div') ) ).classList.add(`${prefix}-files`);


	group_nav	= new ModuleCompilerFileManagerGroupNav({handler: handler, target: core});

	
	group_nav.core.addEventListener('SELECT', eventFileGroupSelectHandler);


	( inner = core.appendChild( document.createElement('div') ) ).classList.add('inner');


	_this.core		= core;
	_this.get		= get;
	_this.refresh	= refresh;
	_this.start		= start;


};