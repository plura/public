/**
 *	. ModuleCompiler
 */
const ModuleDataManager = function ({data, handler, prefix, process}) {

	
	let collections, collectionsGroups, filter;


	const

		_this = this,


		/**
		 * Create request object to retrieve data
		 * @param  {string}    path   	process path url
		 * @param  {...[type]} params 	[description]
		 * @return {Object}           	Request object
		 */
		getRequest = function( path, ...params ) {

			let data = new FormData();

			params.forEach( paramsGroup => {

				for( let key in paramsGroup ) {

					if( paramsGroup.hasOwnProperty(key) ) {

						let value = paramsGroup[key];

						if( typeof value === 'object' ) {

							value = JSON.stringify( value );

						}

						data.append( key, value );

					}

				}

			});

			return new Request(path, {body: data, method: 'POST'});

		},



		init = async function(data) {


			if( typeof data === 'object' ) {

				filter = parse( data );

			} else if( typeof data === 'string' ) {

				filter = await fetch( data )

							.then( response => response.json() )

							.then( response => parse(response) );

			}

			if( handler ) {

				handler( _this );

			}

		},



		/**
		 * loads/inits file gathering process.
		 * @param  {Object} groupID     		the groupID
		 * @param  {Function} handler     		the callback function
		 * @param  {Object} preferences 		return preferences ('join', 'script' or 'closure') and minification
		 * @param  {Object|boolean} exclude     object containing excluded files
		 * @return {undefined}             	
		 */
		load = (groupID, handler, preferences, groupItemsData) => {

			let data = [], group = collectionsGroups.get( groupID ), request;


			group.items.forEach( (item, index) => {

				//if groupitemsData is defined, exclude any group item without data (active files)
				if( !groupItemsData || groupItemsData[ index ] ) {
	
					data.push({
						exclude:	groupItemsData && groupItemsData[ index ].exclude,
						filter:		item.filter,
						join: 		item.join,
						name:		item.name,
						path:		(prefix || '') + item.path,
						prefix: 	preferences.returnType.match(/link/) && item[ preferences.returnType ] || '',
						top:		item.top
					});

				}

			});


			request = getRequest( process, preferences, {data: data, type: group.type} );


			fetch( request )

			.then( response => response.json() )

			.then( data => handler( data ) );

		},



		parse = (collectionsData, collectionGroupID) => {

			let filter_items = [];

			
			collectionsData.forEach( (collection, index) => {


				let id = `${collectionGroupID ? `${ collectionGroupID }_` : 'i'}${ index }`;


				//collection group (if object is an array or has a 'values' property)
				if( collection.values || collection instanceof Array ) {


					let values = parse( collection.values || collection, id );

					filter_items.push({name: collection.label, values: values});


				//collection
				} else {


					let groups = [], data = collection.data,

						defaultFileType		= 'js',
						defaultGroupName	= 'Group',
						defaultReturnTypes	= ['join', 'link'];

					//only for collections with "grouped" data
					if (data instanceof Array && (data[0] instanceof Array || (data[0].group && data[0].items))) {


						data.forEach( (groupData, groupIndex) => {
						
							groups.push({
								id: 	id + '_' + groupIndex,
								type: 	groupData.type || collection.type || defaultFileType,
								name: 	groupData.group || defaultGroupName + ' ' + groupIndex,
								items: 	groupData instanceof Array ? groupData : ( groupData.items instanceof Array ? groupData.items : [groupData.items] )
							});

						});

					} else {

						groups.push({
							id: 	id + '_' + 0,
							type: 	collection.type || defaultFileType,
							name: 	defaultGroupName + ' 0',
							items: 	data instanceof Array ? data : [data]
						});

					}


					groups.forEach( group => {

						//map groups
						collectionsGroups.set( group.id, group );

						//check for available return types
						group.returnTypes = [].concat( defaultReturnTypes );

						for (let n = 0; n < group.items.length; n += 1) {

							if ( group.items[n].closure ) {

								group.returnTypes.push('closure');

								break;

							}

						}

					});

					
					//populates map with collection
					collections.set(id, {groups: groups, label: collection.label});


					//populates array to be used for filter purposes (ie. select filter)
					filter_items.push({name: collection.label, value: id});

				}

			});


			return filter_items;

		};



	collections			= new Map();

	collectionsGroups	= new Map();


	_this.load			= load;
	_this.filter		= () => filter;
	_this.collection	= id => collections.get( id );
	_this.returnTypes	= id => collectionsGroups.get( id ).returnTypes;
	_this.type			= id => collectionsGroups.get( id ).type;


	if( data ) {

		init( data );

	}


};