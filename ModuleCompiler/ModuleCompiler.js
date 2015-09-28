/**
 *	. ModuleCompiler
 *		. ModuleCompilerFilterCollection
 *		. ModuleCompilerFilterReturn
 *		. ModuleCompilerFileManager
 *			. ModuleCompilerFileManagerGroupNav
 *			. ModuleCompilerFileManagerGroup
 *			. ModuleCompilerFileManagerTree
 *		. ModuleCompilerResultManager
 */



/**
 *	. ModuleCompiler
 */
var DATA = function (options) {

	"use strict";

	var collections, _this = this,


		add = function ( obj ) {

			switch (obj.type) {

			case 'collection':

				collections[ obj.id ] = collection_groups( obj.data, obj.id );

				break;
			
			}

		},


		collection_groups = function ( collection, id ) {

			var groups = [], i, n, data = collection.data,

				defaultFileType		= 'js',
				defaultGroupName	= 'Group',
				defaultReturnTypes	= ['join', 'link'];

			//only for collections with "grouped" data
			if (data instanceof Array && (data[0] instanceof Array || (data[0].group && data[0].items))) {

				for( i = 0; i < data.length; i += 1) {
						
					groups.push({
						id: 	id + '_' + i,
						type: 	data[i].type || collection.type || defaultFileType,
						name: 	data[i].group || defaultGroupName + ' ' + i,
						items: 	data[i] instanceof Array ? data[i] : ( data[i].items instanceof Array ? data[i].items : [data[i].items] )
					});

				}

			} else {

				groups.push({
					id: 	id + '_' + 0,
					type: 	collection.type || defaultFileType,
					name: 	defaultGroupName + ' 0',
					items: 	data instanceof Array ? data : [data]
				});

			}

			//check for available return types
			for (i = 0; i < groups.length; i += 1) {

				groups[i].returnTypes = [].concat( defaultReturnTypes );

				for (n = 0; n < groups[i].items.length; n += 1) {

					if (groups[i].items[n].closure) {

						groups[i].returnTypes.push('closure');

						break;

					}

				}

			}

			return groups;

		},


	   /**
		* inits file gathering process.
		* @param {Object} groupID - the groupID
		* @param {Function} handler - the callback function
		* @param {string} returnType - the result return type: 'join', 'script' or 'closure'
		* @param {Object=} exclude - object containing excluded files
		*/
		get = function (groupID, handler, returnType, exclude) {

			var i, params = [], group = getCollectionGroup( groupID ), data = group.items;

			for (i = 0; i < data.length; i += 1) {

				params.push({
					first:		data[i].first,
					join: 		data[i].join,
					name:		data[i].name,
					path:		(options.prefix || '') + data[i].path,
					type: 		group.type,
					exclude:	exclude && exclude[i] 
				});

			}

			//console.log(options.process + '?' + $.param({data: params, type: returnType}));

			$.get( options.process,  {data: params, returnType: returnType}, handler, 'json');

		},


		getCollection = function (id) {

			return collections[ id ];

		},

		getCollectionGroup = function (id) {

			var ids = id.match(/^(.+)_([0-9]+)$/);

			return collections[ ids[1] ][ ids[2] ];

		},

		getCollectionGroupReturnType = function (id) {

			var group = getCollectionGroup( id );

			return group.returnTypes;

		},


		init = function (){

			collections	= {};

		};


	_this.add			= add;
	_this.load			= get;
	_this.collection	= getCollection;
	_this.group			= getCollectionGroup;
	_this.returnTypes	= getCollectionGroupReturnType;


	init();

};



var ModuleCompiler = function (options) {
		
	"use strict";
	
	var defaults = {
			process: 'ModuleCompiler.php'
		},
	
	
		core, datahandler, id, opts, ui_filter_collections, ui_filter_files, ui_filter_return, ui_result,


		resize = function () {

			var winw = $(window).width(), winh = $(window).height(),

				navh = ui_filter_collections.core.outerHeight( true );

			$('body').height( winh );

			core.height( winh );

			ui_result.resize( winh - navh );

			ui_filter_files.resize( winh - navh );

		},
	

		eventDataCollectionsHandler = function (data) {

			ui_filter_files.refresh( data.tree );

			ui_result.refresh( data.result );

		},


		eventDataFilesHandler = function ( data ) {

			ui_result.refresh( data.result );

		},


		eventFilterHandler = function (event, data) {

			event.stopImmediatePropagation();

			switch (event.type) {

			case 'COLLECTIONS':

				ui_filter_files.nav( datahandler.collection( data.id ) );

				break;

			case 'GROUPS':

				id = data.id;

				ui_filter_return.refresh( datahandler.returnTypes( id ) );

				datahandler.load( id, eventDataCollectionsHandler, ui_filter_return.get() );

				break;

			case 'FILES':
			case 'TYPES':

				datahandler.load( id, eventDataFilesHandler, ui_filter_return.get(), ui_filter_files.get() );

				break;								

			}

		},

		eventWindowResizeHandler = function () {

			resize();

		},
			
		init = function () {
			
			opts					= $.extend(true, {}, defaults, options);

			datahandler				= new DATA({prefix: options.prefix, process: options.process});

			core					= $('<div/>').appendTo('body').addClass('core');
			

			ui_filter_collections	= new ModuleCompilerFilterCollection({data: opts.data, handler: datahandler, target: core});

			ui_filter_collections.core.on('COLLECTIONS', eventFilterHandler);


			ui_filter_return			= new ModuleCompilerFilterReturn({target: core});

			ui_filter_return.core.on('TYPES', eventFilterHandler);


			ui_filter_files			= new ModuleCompilerFileManager({handler: datahandler, target: core});

			ui_filter_files.core.on('FILES GROUPS', eventFilterHandler);


			ui_result				= new ModuleCompilerResultManager({target: core});


			$(window).resize( eventWindowResizeHandler );


			resize();
			
		};
		

	init();
	
};




/**
 * Filter for collections
 *
 */
var ModuleCompilerFilterCollection = function (options) {

	"use strict";

	var core, form, select, _this = this,


		//gets the selected id and returns the desired collection data
		getID = function () {

			return form.find('*[name=collection] option:selected').data( 'id' );
		
		},


		eventChangeHandler = function (event, data) {

			event.stopImmediatePropagation();

			core.trigger( 'COLLECTIONS', {id: getID()} );

		},


	   /**
		* creates select for collection & grouped collections
		* @param {Object} data			the collection data
		* @param {Object} [target]		the DOM target object
		* @param {number} [parentID]	the id which will be used to target/save the collection data
		*/
		init_select = function (data, target, parentID) {

			var i, id, group, group_name, group_data, opt, opt_name, pID = parentID ? parentID + '_' : 'i';

			if (!target) {

				target = $('<select/>').prop({name: 'collection'}).append('<option/>');

			}

			for( i = 0; i < data.length; i += 1) {

				id = pID + i;				

				if (data[i].values || data[i] instanceof Array) {

                    group_name  	= data[i].values && data[i].label ? data[i].label : 'group' + i;

                    group_data  	= data[i].values || data[i];

                    group       	= $('<optgroup/>').prop({label: group_name}).appendTo( target );

                    init_select( group_data, group, id );

				} else {

					opt_name		= data[i].label || data[i].value;

					opt				= $('<option/>').prop({value: opt_name}).appendTo( target ).html( opt_name ).data( 'id', id );

					options.handler.add({data: data[i], id: id, type: 'collection'});

				}

			}

			return target;      

		},


		init = function () {

			core		= $('<div/>').appendTo( options.target ).addClass('collections');

			form		= $('<form/>').appendTo( core );

			select		= init_select( options.data ).appendTo( form ).on('change', eventChangeHandler);

			_this.core	= core;

		};


	init();


};




/**
 * Filter for output type - script, join or closure compiler *
 */
var ModuleCompilerFilterReturn = function (options) {

	"use strict";

	var holder, form, _this = this,


	   /**
		* refreshes filter type UI 
		* @param {Array} [filter] - optional param indicating available filters
		*/
		refresh = function ( filter ) {

			var label, labels = form.find('label'), types = form.find('input'), clss = 'disabled';

			if ( filter ) {

				types.each( function () {

					label = form.find('label[for=' + $(this).prop('id') + ']');

					if ( filter.indexOf( $(this).val() ) !== -1 ) {

						$(this).prop({disabled: false});

						label.removeClass( clss );

					} else {

						$(this).prop({disabled: true});

						label.addClass( clss );

					}

				});

			} else {

				labels.addClass( clss );

				types.prop({disabled: true});

			}

		},

		
		get = function () {

			return form.find('*[name=type]:checked').val();

		},


		eventChangeHandler = function(event, data) {

			event.stopImmediatePropagation();

			holder.trigger('TYPES');

		},


		init = function () {

			var i, id, input, label, values = [['link', 'Link'], ['join', 'Join'], ['closure', 'Closure']];

			holder	= $('<div/>').appendTo( options.target ).addClass('types');

			form	= $('<form/>').appendTo(holder);

			for(i = 0; i < values.length; i+=1) {

				id = 'option-' + i;

				input = $('<input/>').prop({type: 'radio', name: 'type', id: id}).val( values[i][0] )

						.on('change', eventChangeHandler).appendTo(form);

				label = $('<label/>').html( values[i][1] ).prop({'for': id}).appendTo(form);

				if (!i) {

					input.prop("checked", true);

				}
			
			}

			refresh();

			_this.core = holder;

		};


	_this.refresh	= refresh;
	_this.get		= get;


	init();

};




/**
 * deals with file structures groups
 */
var ModuleCompilerFileManager = function ( options ) {

	"use strict";

	var core, group, inner, tree, _this = this,


		get = function () {

			var e, exclude = [], i, inactive;

			for (i = 0; i < tree.length; i += 1) {

				inactive	= tree[i].inactive();

				if (inactive) {

					exclude[i]	= [];

					for ( e in inactive ) {

						if (inactive.hasOwnProperty(e)) {

							exclude[i].push( inactive[e].data.path || inactive[e].data );

						}

					}

				} else {

					exclude[i] = false;

				}

			}

			return exclude;
			
		},


		clean = function () {

			tree = [];

			inner.empty();

		},


		nav = function ( data ) {

			group.refresh( data );

		},		


	   /**
		* refreshes data objects
		* @param {Object} data	the collection data
		*/
		refresh = function (data) {

			var i;

			clean();

			for( i = 0; i < data.length; i +=1 ) {

				tree[i] = new ModuleCompilerFileManagerGroup({
					data:	data[i],
					target:	inner
				});

				tree[i].core.on('CHANGE', eventTreeHandler);

			}

		},



		resize = function (height) {

			core.outerHeight(height);

		},





		eventFileGroupSelectHandler = function (event, data) {

			event.stopImmediatePropagation();

			core.trigger('GROUPS', data);

		},


		eventTreeHandler = function (event) {

			event.stopImmediatePropagation();

			core.trigger('FILES');

		},


		init = function () {

			core		= $('<div/>').appendTo(options.target).addClass('files');

			group		= new ModuleCompilerFileManagerGroupNav({handler: options.handler, target: core});

			group.core.on('SELECT', eventFileGroupSelectHandler);

			inner		= $('<div/>').appendTo( core ).addClass('inner');

			_this.core	= core;

		};

	_this.get		= get;
	_this.nav		= nav;
	_this.refresh	= refresh;
	_this.resize	= resize;


	init();

};



/**
 * Filter for file groups
 */
var ModuleCompilerFileManagerGroupNav = function (options) {

	"use strict";

	var active, core, data, select_obj, _this = this,


		refresh = function ( groups ) {

			core.empty();

			active	= null;

			data	= groups;

			if( data.length ) {

				render( data );

			}

			select();

		},


		render = function ( data ) {

			var i, node, select_wrapper;	

			select_wrapper	= $('<div/>').appendTo( core ).addClass('select-wrapper');

			select_obj		= $('<select/>').appendTo( select_wrapper ).on('change', eventSelectChangeHandler);

			for (i = 0; i < data.length; i += 1) {

				node = $('<option/>').appendTo( select_obj ).html( data[i].name ).val(i);

			}

		},


		select = function ( index ) {

			var n = index === undefined ? 0 : index;

			if (n !== active) {

				if (data.length) {

					show( n );

				}

				active = n;

				core.trigger('SELECT', {id: data[n].id});

			}

		},


		show = function ( index ) {

			select_obj.val( index );

		},


		eventSelectChangeHandler = function (event) {

			var index = select_obj.children('option:selected').val();

			select( index );

		},


		init = function () {

			core = $('<div/>').appendTo( options.target ).addClass('nav');

			_this.core = core;

		};


	_this.refresh = refresh;


	init();

};



var ModuleCompilerFileManagerGroup = function (options) {

	"use strict";

	var core, ui_ctrls, ui_ctrls_check, ui_ctrls_visibility, ui_tree, _this = this,


		render_controls = function () {

			var txt				= options.data.name || options.data.path;

			ui_ctrls			= $('<div/>').appendTo(core).addClass('controls');

			ui_ctrls_check		= $('<div/>').appendTo(ui_ctrls).addClass('controls-check on').click(eventControlsCheckHandler).html( txt );

			ui_ctrls_visibility	= $('<div/>').appendTo(ui_ctrls).addClass('controls-visibility on').click(eventControlsVisibilityHandler);

		},



		check = function ( on ) {

			if (on) {

				ui_ctrls_check.addClass('on');

			} else {

				ui_ctrls_check.removeClass('on');

			}

			ui_tree.activate( on );

		},



		visible = function ( on ) {

			if (on) {

				core.addClass('on');

				ui_ctrls_visibility.addClass('on');

			} else {

				core.removeClass('on');

				ui_ctrls_visibility.removeClass('on');

			}

		},


		eventControlsCheckHandler = function( event ) {

			check( !ui_ctrls_check.hasClass('on') );

		},

		eventControlsVisibilityHandler = function( event ) {

			visible( !ui_ctrls_visibility.hasClass('on') );

		},

		init = function () {

			core		= $('<div/>').addClass('files-group on').appendTo( options.target );

			ui_ctrls	= render_controls();

			ui_tree		= new ModuleCompilerFileManagerTree({data: options.data.core, target: core});

			_this.core	= core;

		};


	_this.inactive = function () { return ui_tree.inactive(); };


	init();

};




/**
 * creates files structure tree
 */
var ModuleCompilerFileManagerTree = function ( options ) {

	"use strict";

	var active, core, inactive, tree, tree_leaf_count, tree_leaf_active_count, _this = this,


	   /**
		* sets active status. adds or deletes leaf nodes from the 'active' aggregator object
		* @param {string} id - the id that identifies the node.
		* @param {boolean} [status=true] - the boolean value that indicates node activation or de-activation.
		*/		
		activate = function (id, status) {

			var s = status === undefined ? true : status;

			if ( is_leaf(id) ) {			

				if (s) {
					
					active[id] = tree[id].data();

					tree_leaf_active_count += 1;

					delete inactive[id];

					tree[id].parentsUntil('.tree', '.node:not(.leaf)').each( function() {

						activate( $(this).data('id') );

					});	

				} else {

					inactive[id] = tree[id].data();

					tree_leaf_active_count -= 1;					
				
					delete active[id];

				}

			}

			active_style(id, s);

		},


	   /**
		* adds active style to nodes
		* @param {string} id - the id that identifies the node.
		* @param {boolean} [status=true] - the boolean value that indicates node style activation or de-activation.
		*/			
		active_style = function (id, status) {

			if (status) {

				tree[id].addClass('on');

			} else {

				tree[id].removeClass('on');

			}

		},


	   /**
		* Selects/unselects all nodes in the tree
		* @param {boolean=} status - boolean value indicating selection/unselection
		*/	
		activateAll = function ( status ) {

			var i, s = status === undefined ? true : status;

			for (i = 0; i < options.data.length; i += 1) {

				toggle( 'i' + i, s );

			}

			core.trigger('CHANGE', get_info() );

		},


	   /**
		* Get active (true || undefined) or inactive (false)
		* @param {status=} boolean - boolean value indicating active/inactive return
		*/		
		get_active = function (status) {

			var a = status === undefined ? true : status;

			if ( (a && tree_leaf_active_count) || (!a && tree_leaf_active_count < tree_leaf_count) ) {

				return a ? active : inactive;

			}

			return false;

		},


		get_info = function () {

			return {
				active:		get_active(), 
				inactive:	get_active( false ),
				leaf:		tree_leaf_count,
				selected:	tree_leaf_active_count
			};

		},			


	   /**
		* Toggle leaf and branches [and activates branches' children accordingly]
		* @param {number} id - nodeID
		* @param {boolean} [status] - optional boolean value to force activation/deactivation of leaf/branch
		*/
		toggle = function (id, status) {

			var children, s = status !== undefined ? status : ( is_leaf( id ) ? !active[id] : !tree[id].hasClass('on') );

			activate( id, s );

			if ( !is_leaf(id) ) {

				children = tree[id].find('.node');

				if (children.length) {

					children.each( function () {

						activate( $(this).data('id'), s);

					});					

				}

			}

		},


	   /**
		* recursive function used to render the tree
		* @param {Object} data - node data to be parsed
		* @param {number} [parentID] - parentID, used for recursive purposes
		*/
		render = function (data, parentID) {

			var i, nodeID, nodeData, pID = parentID ? parentID + '_' : 'i',

				ui_holder = $('<ul/>'), ui_branch, ui_leaf, ui_trigger;

			for(i = 0; i < data.length; i += 1 ) {

				nodeID		= pID + i;

				nodeData	= {id: nodeID, data: data[i]};

				ui_leaf		= $('<li/>').appendTo( ui_holder ).addClass( 'node ' + nodeID ).data( nodeData );

				ui_trigger	= trigger( data[i] ).appendTo( ui_leaf ).addClass('trigger');

				if (data[i].children) {

					ui_branch = render(data[i].children, nodeID).appendTo( ui_leaf ).addClass('branch');

					ui_trigger.click( eventTreeBranchClickHandler );

				} else {

					ui_leaf.addClass('leaf').on('click', eventTreeLeafClickHandler);

					tree_leaf_count += 1;

				}

				tree[nodeID] = ui_leaf;

				activate( nodeID );

			}

			return ui_holder;

		},


		trigger = function( data ) {

			var label = typeof data === 'string' ? data : data.name || data.vanity,

				dom	= $('<span/>').html( label );

			if (data.path) {

				dom.attr('data-path', data.path);

			}

			return dom;

		},



		is_leaf = function (id) {

			return tree[id].hasClass('leaf');

		},


	
		eventTreeBranchClickHandler = function (event) {

			toggle( $(event.currentTarget).parent().data('id') );

			core.trigger('CHANGE', get_info() );

		},



		eventTreeLeafClickHandler = function (event) {

			toggle( $(event.currentTarget).data('id') );

			core.trigger('CHANGE', get_info() );			

		},



		init = function () {

			tree					= {};

			tree_leaf_count			= 0;

			tree_leaf_active_count	= 0;

			active					= {};

			inactive				= {};

			core					= render( options.data ).appendTo( options.target ).addClass('tree');

			_this.core				= core;

		};


	_this.activate	= activateAll;
	_this.active	= function () { return get_active(); };
	_this.inactive	= function () { return get_active( false ); };

	init();


};




var ModuleCompilerResultManager = function (options) {

	"use strict";

	var core, inner, textarea, _this = this,

		refresh = function(data) {

			textarea.val( data );

		},

		resize = function (height) {

			core.outerHeight( height );

		},

		init = function () {

			core	 	= $('<div/>').appendTo( options.target ).addClass('result');

			inner		= $('<div/>').appendTo( core ).addClass('inner');			

			textarea	= $('<textarea/>').appendTo( inner );

		};


	_this.refresh	= refresh;
	_this.resize	= resize;


	init();

};
