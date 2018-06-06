/**
 *	. DATA - Data Handling
 *	. ModuleCompiler
 *		. ModuleCompilerFilterCollection			- Collection selector
 *		. ModuleCompilerPreferences					- Preferences: return type, minification
 *		. ModuleCompilerFileManager					- File handling
 *			. ModuleCompilerFileManagerGroupNav		- File group selector
 *			. ModuleCompilerFileManagerGroup		- File group handler 
 *			. ModuleCompilerFileManagerTree			- File group tree
 *		. ModuleCompilerResultManager				- return output
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

				collections[ obj.id ] = collection( obj.data, obj.id );

				break;
			
			}

		},


		collection = function ( collection, id ) {

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

			return {groups: groups, label: collection.label};

		},


		/**
		 * loads/inits file gathering process.
		 * @param  {Object} groupID     		the groupID
		 * @param  {Function} handler     		the callback function
		 * @param  {Object} preferences 		return preferences ('join', 'script' or 'closure') and minification
		 * @param  {Object|boolean} exclude     object containing excluded files
		 * @return {undefined}             	
		 */
		load = function (groupID, handler, preferences, exclude) {

			//console.log(exclude);

			var i, data = [], group = getCollectionGroup( groupID ), items = group.items, params;

			for (i = 0; i < items.length; i += 1) {

				data.push({
					exclude:	exclude && exclude[i],
					filter:		items[i].filter,
					join: 		items[i].join,
					name:		items[i].name,
					path:		(options.prefix || '') + items[i].path,
					prefix: 	preferences.returnType.match(/link/) && items[i][ preferences.returnType ] || '',
					top:		items[i].top
				});

			}

			params = $.extend(preferences, {data: data, type: group.type});

			console.log(options.process + '?' + $.param( params ));

			$.get( options.process,  params, handler, 'json');

		},


		getCollection = function (id) {

			return collections[ id ];

		},

		getCollectionGroup = function (id) {

			var ids = id.match(/^(.+)_([0-9]+)$/);

			return collections[ ids[1] ].groups[ ids[2] ];

		},

		getCollectionGroupReturnType = function (id) {

			var group = getCollectionGroup( id );

			return group.returnTypes;

		},


		init = function (){

			collections	= {};

		};


	_this.add			= add;
	_this.load			= load;
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
	
	
		core, datahandler, id, opts, ui_collections, ui_files, ui_preferences, ui_result,


		resize = function () {

			var winw = $(window).width(), winh = $(window).height(),

				navh = ui_collections.core.outerHeight( true );

			$('body').height( winh );

			core.height( winh );

			ui_result.resize( winh - navh );

			ui_files.resize( winh - navh );

		},
	

		eventDataCollectionsHandler = function (data) {

			ui_files.refresh( data.tree );

			ui_result.refresh( data.result );

			resize();

		},


		eventDataFilesHandler = function ( data ) {

			ui_result.refresh( data.result );

		},


		eventFilterHandler = function (event, data) {

			event.stopImmediatePropagation();

			switch (event.type) {

			case 'COLLECTIONS':

				ui_files.start( datahandler.collection( data.id ) );

				break;

			case 'GROUPS':

				id = data.id;

				ui_preferences.refresh( datahandler.returnTypes( id ) );

				datahandler.load( id, eventDataCollectionsHandler, ui_preferences.get() );

				break;

			case 'FILES':
			case 'TYPES':

				datahandler.load( id, eventDataFilesHandler, ui_preferences.get(), ui_files.get() );

				break;								

			}

		},


		eventWindowResizeHandler = function () {

			resize();

		},


		init = function () {
			
			opts			= $.extend(true, {}, defaults, options);

			datahandler		= new DATA({prefix: options.prefix, process: options.process});

			core			= $('<div/>').appendTo('body').addClass('core');
			

			ui_collections	= new ModuleCompilerFilterCollection({data: opts.data, handler: datahandler, target: core});

			ui_collections.core.on('COLLECTIONS', eventFilterHandler);


			ui_preferences	= new ModuleCompilerPreferences({target: core});

			ui_preferences.core.on('TYPES', eventFilterHandler);


			ui_files		= new ModuleCompilerFileManager({handler: datahandler, target: core});

			ui_files.core.on('FILES GROUPS', eventFilterHandler);


			ui_result		= new ModuleCompilerResultManager({target: core});


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

			var select_wrapper;

			core			= $('<div/>').appendTo( options.target ).addClass('collections');

			form			= $('<form/>').appendTo( core );

			select_wrapper	= $('<div/>').appendTo( form ).addClass('select-wrapper');

			select			= init_select( options.data ).appendTo( select_wrapper ).on('change', eventChangeHandler);

			_this.core		= core;

		};


	init();


};




/**
 * Filter for output type - script, join or closure compiler *
 */
var ModuleCompilerPreferences = function (options) {

	"use strict";

	var core, form, _this = this,

		fields = [
			{name: 'returntype', values: [
				{name: 'returnType', type: 'radio', label: 'Link', value: 'link', checked: true},
				{name: 'returnType', type: 'radio', label: 'Join', value: 'join'},
				{name: 'returnType', type: 'radio', label: 'Closure', value: 'closure'}									
			]},
			{name: 'others', values: [
				{name: 'minify', type: 'checkbox', label: 'Minify'}
			]}
		],


	   /**
		* refreshes filter type UI 
		* @param {Array} [filter] - optional param indicating available filters
		*/
		refresh = function ( filter ) {
		
			var label, types = form.find('input[name=type]'), clss = 'disabled';

			types.each( function () {

				label = form.find('label[for=' + $(this).prop('id') + ']');

				if ( filter ) {

					if ( filter.indexOf( $(this).val() ) !== -1 ) {

						$(this).prop({disabled: false});

						label.removeClass( clss );

					} else {

						$(this).prop({disabled: true});

						label.addClass( clss );

					}

				} else {

					$(this).prop({disabled: true});

					label.addClass( clss );

				}

			});

		},

		
		get = function () {

			return {
				minify: 	val('*[name=minify]'),
				returnType: val('*[name=returnType]')
			};

		},


		val = function ( target ) {

			var element = form.find( target ), type = element.prop('type');

			if (type.match(/checkbox/)) {

				return element.is(':checked') ? 1 : 0;

			} else if (type.match(/radio/)) {

				return element.filter(':checked').val();

			}

			return element.val();
		},


		render = function ( data ) {

			var element, elements, fieldset, form, id, i, label, n;

			form = $('<form/>').appendTo(core);

			for ( n = 0; n < data.length; n += 1) {

				fieldset	= $('<fieldset/>').appendTo(form).prop({name: data[n].name});

				elements	= data[n].values;

				for( i = 0; i < elements.length; i += 1) {

					id		= 'option-' + n + '-' + i;

					element	= $('<input/>').appendTo(fieldset)

								.prop({name: elements[i].name, value: elements[i].value, type: elements[i].type, id: id})

								.on('change', eventChangeHandler);

					label	= $('<label/>').appendTo(fieldset).prop({'for': id}).html( elements[i].label );								

					if (elements[i].checked) {

						element.prop({checked: true});

					}

				}

			}

			return form;

		},


		eventChangeHandler = function(event, data) {

			event.stopImmediatePropagation();

			core.trigger('TYPES');

		},


		init = function () {

			core	= $('<div/>').appendTo( options.target ).addClass('preferences');

			//init_returntype();

			form	= render( fields );

			refresh();

			_this.core = core;

		};


	_this.refresh	= refresh;
	_this.get		= get;


	init();

};




/**
 * deals with file structures groups
 * @param {Object[]} options 				ModuleCompilerFileManager options
 * @param {Object} options.target 			DOM holder
 * @param {Object} options.handler 			[description]
 * @return {undefined}
 */
var ModuleCompilerFileManager = function ( options ) {

	"use strict";

	var core, group, inner, tree, _this = this,


		/**
		 * gets a multidimensional of one or more arrays of excluded files for
		 * each package's group
		 * @return {Object[]}	an array of excluded files
		 */
		get = function () {

			var e, exclude = [], i, inactive;

			for (i = 0; i < tree.length; i += 1) {

				inactive = tree[i].inactive();

				if (inactive) {

					exclude[i] = [];

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


	   /**
		* refreshes data objects
		* @param {Object} data	the collection data
		*/
		refresh = function ( data ) {

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


		resize = function ( height ) {

			var innerh = ( height - parseInt(core.css('padding'), 10) * 2 ) -  group.core.height();

			core.outerHeight( height );

			inner.outerHeight('').removeClass('has-scroll');

			if ( innerh < inner.outerHeight() ) {

				inner.outerHeight( innerh ).addClass('has-scroll');

			}

		},


	   /**
		* refresh file manager title + group navigation
		* @param {Object} collection - the collectionn data object
		*/
		start = function ( collection ) {

			group.refresh( collection.groups );

			core.attr('data-title', collection.label);

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
	_this.refresh	= refresh;
	_this.resize	= resize;
	_this.start		= start;

	init();

};



/**
 * Filter for file groups
 */
var ModuleCompilerFileManagerGroupNav = function (options) {

	"use strict";

	var active, core, data, nav_index, nav_select, _this = this,


		refresh = function ( groups ) {

			core.empty();

			active	= null;

			data	= groups;

			if( data.length > 1 ) {

				render( data );

			}

			select();

		},


	   /**
		* render group select box navigation and index 'position' indicator
		* @param {Array} data - the array containing group data
		*/
		render = function ( data ) {

			var i, index, option, select_wrapper;	

			select_wrapper	= $('<div/>').appendTo( core ).addClass('select-wrapper');

			nav_select		= $('<select/>').appendTo( select_wrapper ).on('change', eventSelectChangeHandler);

			nav_index		= $('<div/>').appendTo( core ).addClass('index');

			for (i = 0; i < data.length; i += 1) {

				option	= $('<option/>').appendTo( nav_select ).html( data[i].name ).val(i);

				index	= $('<div/>').appendTo( nav_index ).addClass('i');

			}

		},


	   /**
		* selects group by its data index
		* @param {number} [index=0] - the group index
		*/
		select = function ( index ) {

			var n = index === undefined ? 0 : index;

			if (n !== active) {

				if (data.length > 1) {

					show( n );

				}

				active = n;

				core.trigger('SELECT', {id: data[n].id});

			}

		},


		show = function ( index ) {

			nav_select.val( index );

			nav_index.children().removeClass('active')

			.filter(':nth-child(' + (index + 1) + ')').addClass('active');

		},


		//activates selection. turns value into integer - ie. for 'index' DOM targeting
		eventSelectChangeHandler = function (event) {

			var index = Number( nav_select.children('option:selected').val() );

			select( index );

		},


		init = function () {

			core		= $('<div/>').appendTo( options.target ).addClass('group-nav');

			_this.core	= core;

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

			console.log(data);

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
