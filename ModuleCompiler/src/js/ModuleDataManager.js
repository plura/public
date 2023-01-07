/**
 *	. ModuleCompiler
 */
const ModuleDataManager = function ({data, handler, prefix, process}) {

	
	let alias, collections, collectionsGroups, filter;


	const

		_this = this,


		/**
		 * Create request object to retrieve data
		 * @param  {string}    path   	process path url
		 * @param  {...[type]} params 	[description]
		 * @return {Object}           	Request object
		 */
		getRequest = ( path, ...params ) => {

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



		init = async data => {

			alias				= {

				keys: new Map(),

				groups: new Map()

			};

			collections			= new Map();

			collectionsGroups	= new Map();

			if( typeof data === 'object' ) {

				filter = parse( data );

			} else if( typeof data === 'string' ) {

				filter = await fetch( data )

							.then( response => response.json() )

							.then( response => parse( response ) );

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
				//use recursive parse to retrieve its collections
				if( collection.values || Array.isArray( collection ) ) {


					let values = parse( collection.values || collection, id );

					filter_items.push({name: collection.label, values: values});


				//collection
				} else {


					let groups = [], group, data = collection.data,

						defaultFileType		= 'js',
						defaultGroupName	= 'Group',
						defaultReturnTypes	= ['join', 'link'];


					//only for collections with "grouped" data
					//1 - if data is a Array AND
					//2 - first data item is an array OR an object with either a 'group' or 'items' property
					if ( Array.isArray( data ) && ( Array.isArray( data[0] ) || ( data[0].group && data[0].items ) ) ) {

						data.forEach( (groupData, groupIndex) => {

							group = {
								id: 	id + '_' + groupIndex,
								type: 	groupData.type || collection.type || defaultFileType,
								name: 	groupData.group || defaultGroupName + ' ' + groupIndex,
								items: 	Array.isArray( groupData ) ? groupData : ( Array.isArray( groupData.items ) ? groupData.items : [ groupData.items ] )
							};
						
							groups.push( group );

							check4alias( group );

						});

					} else {

						group = {
							id: 	id + '_' + 0,
							type: 	collection.type || defaultFileType,
							name: 	defaultGroupName + ' 0',
							items:  Array.isArray( data ) ? data : [ data ]
						};

						groups.push( group );

						check4alias( group );

					}


					groups.forEach( group => {

						//map groups
						collectionsGroups.set( group.id, group );

						//check for available return types
						group.returnTypes = [].concat( defaultReturnTypes );

						/*group.items.forEach( item => {



						});*/

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


			//after parsing/traversing is completed (undefined 'collectionGroupID' indicates root level)
			//check for alias and replace them with correct value
			if( collectionGroupID === undefined ) {

				alias.groups.forEach( ( groups, alias_key ) => {

					if( alias.keys.has( alias_key ) ) {

						groups.forEach( obj => {

							obj.group.items[ obj.index ] = alias.keys.get( alias_key );

						});

					} else {

						console.log(`ModuleCompiler: alias '${alias_key}' not found.`);

					}

				});				

			}

			return filter_items;

		},



		check4alias = group => {

			//loop items
			group.items.forEach( (item, index) => {

				//if item is a string, save its info (parent group and item index) 
				//for later replacement with corresponding alias
				if( typeof item === 'string' ) {

					let groups = alias.groups;

					if( !groups.has( item ) ) {

						groups.set( item, [] );

					} 

					groups.set( item, [ ...groups.get( item ), {group: group, index: index} ] );

				//if item as an alias 'key', save its info to be used in replacements
				} else if( item.alias ) {

					alias.keys.set( item.alias, item );

				}

			});

		};




	_this.load			= load;
	_this.filter		= () => filter;
	_this.collection	= id => collections.get( id );
	_this.returnTypes	= id => collectionsGroups.get( id ).returnTypes;
	_this.type			= id => collectionsGroups.get( id ).type;


	if( data ) {

		init( data );

	}


};