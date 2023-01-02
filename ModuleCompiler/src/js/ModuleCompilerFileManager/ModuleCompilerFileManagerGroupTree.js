/**
 * creates files structure tree
 */
const ModuleCompilerFileManagerGroupTree = function ({data, target}) {


	let core, map, map_inactive, map_active, map_leaf;

	const 

		_this = this,


	   /**
		* sets active status. adds or deletes leaf nodes from the 'active' aggregator object
		* @param {string} id - the id that identifies the node.
		* @param {boolean} [status=true] - the boolean value that indicates node activation or de-activation.
		*/		
		activate = (id, status = true ) => {

			if ( status && !map_active.has( id ) ) {
				
				map_active.set(id, map.get( id ).data );

				map_inactive.delete( id );

			} else if(!status && !map_inactive.has( id ) ) {

				map_inactive.set(id, map.get( id ).data );

				map_active.delete(id);

			}

			//if node has parents, set its active status
			if( map.get( id ).parents ) {

				map.get( id ).parents.forEach( parentID => {

					if( status || ( !status && !has_active_children( parentID ) ) ) {

						activate_branch(parentID, status, false);

					}

				});

			}

			active_style(id, status);

		},


		activate_branch = (id, status = true, traverse = true) => {

			if( traverse ) {

				map.get( id ).children.forEach( nodeID => {

					if( is_leaf( nodeID ) ) {

						activate( nodeID, status );

					} else {

						activate_branch( nodeID, status );

					}

				});

			}

			active_style(id, status);

		},


	   /**
		* adds active style to nodes
		* @param {string} id - the id that identifies the node.
		* @param {boolean} [status=true] - the boolean value that indicates node style activation or de-activation.
		*/			
		active_style = (id, status) => {

			if (status) {

				map.get( id ).node.classList.add('on');

			} else {

				map.get( id ).node.classList.remove('on');

			}

		},


	   /**
		* Selects/unselects all nodes in the tree
		* @param {boolean=} status	boolean value indicating selection/unselection
		* @param {boolean=} event 	if true, triggers an event. disabling events is useful for multiple groups trees activation/de-activation
		*/	
		activateAll = ( status = true, event = true ) => {

			data.forEach( (dataItem, index) => toggle(`i${ index }`, status ) );

			if( event ) {console.log('werewr');

				core.dispatchEvent( new CustomEvent('GROUP_TREE_CHANGE', {bubbles: true, detail: get_info()}) );

			}

		},


	   /**
		* Get active (true || undefined) or inactive (false)
		* @param {status=} boolean - boolean value indicating active/inactive return
		*/		
		get_active = (status = true) => {

			if( (status && map_active.size) || (!status && map_inactive.size) ) {

				return status ? map_active : map_inactive;
			
			}

			return false;

		},


		get_info = () => {

			return {
				active:		get_active(), 
				inactive:	get_active( false ),
				leaf:		map_leaf.size,
				selected:	map_active.size
			};

		},	


		/**
		 * Check if branch has active children
		 * @param  {string} id 		node id
		 * @return {Boolean}    	true if has active children, false otherwise
		 */
		has_active_children = id => {

			let children = map.get( id ).children, i;

			for(i = 0; i < children.length; i += 1) {

				if( map_active.has( children[i] ) ) {

					return true;

				}

			}

			return false;

		},


	   /**
		* Toggle leaf and branches [and activates branches' children accordingly]
		* @param {number} id - nodeID
		* @param {boolean} [status] - optional boolean value to force activation/deactivation of leaf/branch
		*/
		toggle = (id, status) => {

			let s = status !== undefined ? status : ( is_leaf( id ) ? !map_active.has( id ) : !map.get( id ).node.classList.contains('on') );

			if( is_leaf(id) ) {

				activate( id, s );
				
			} else {

				activate_branch(id, s);	

			}

		},


	   /**
		* recursive function used to render the tree
		* @param {Object} data - node data to be parsed
		* @param {number} [parentID] - parentID, used for recursive purposes
		*/
		render = (data, parentID) => {

			let nodeID, pID = parentID ? parentID + '_' : 'i',

				ui_holder, ui_branch, ui_node, ui_trigger;

			ui_holder = document.createElement('ul');

			data.forEach( (nodeData, index) => {

				nodeID = pID + index;
				
				( ui_node = ui_holder.appendChild( document.createElement('li') ) ).classList.add( ...['node', nodeID] );

				( ui_trigger = ui_node.appendChild( trigger( nodeData ) ) ).classList.add('trigger');
				

				map.set(nodeID, {data: nodeData, node: ui_node});

				map.set(ui_node, nodeID);


				if (nodeData.children) {

					( ui_branch = ui_node.appendChild( render(nodeData.children, nodeID) ) ).classList.add('branch');

					ui_trigger.addEventListener('click', eventTreeBranchClickHandler);


				} else {

					ui_node.addEventListener('click', eventTreeLeafClickHandler);

					ui_node.classList.add('leaf');

					map_leaf.set(ui_node, nodeData);

				}



				//activates root ids. branches will activate children b/c the recursive 
				//function already created them
				if(!parentID) {

					toggle( nodeID );

				} else {

					//push parents
					nodeID.split('_').slice(0, -1).forEach( (val, index, array) =>

						( map.get( nodeID ).parents = map.get( nodeID ).parents || [] ).push( array.slice(0, index + 1).join('_') )

					);

					//push children ids to parent, to easily traverse in the future
					( map.get( parentID ).children = map.get( parentID ).children || [] ).push( nodeID );

				}				


			} );


			return ui_holder;

		
		},


		/**
		 * Renders trigger
		 * @param  {Object} data 	element data
		 * @return {Object}      	DOM element
		 */
		trigger = data => {

			let label = typeof data === 'string' ? data : data.name || data.vanity,

				dom	= document.createElement('span');

			dom.textContent = label;

			if (data.path) {

				dom.setAttribute('data-path', data.path);

			}

			return dom;

		},



		/**
		 * Checks if node is a 'leaf'
		 * @param  {string}  id  	nodeID
		 * @return {Boolean}    	true if 'leaf', false if 'branch'
		 */
		is_leaf = id => !map.get( id ).children,


	
		eventTreeBranchClickHandler = event => {

			let id = map.get( event.currentTarget.parentNode );

			toggle( id );

			core.dispatchEvent( new CustomEvent('GROUP_TREE_CHANGE', {bubbles: true, detail: get_info()}) );

		},



		eventTreeLeafClickHandler = event => {

			let id = map.get( event.currentTarget );

			toggle( id );

			core.dispatchEvent( new CustomEvent('GROUP_TREE_CHANGE', {bubbles: true, detail: get_info()}) );

		},



		init = () => {

			map						= new Map();

			map_inactive			= new Map();

			map_active 				= new Map();

			map_leaf				= new Map();
			
			( core = target.appendChild( render( data ) ) ).classList.add('tree');

			_this.core				= core;

		};


	_this.activate	= activateAll;

	_this.active	= get_active;

	init();


};