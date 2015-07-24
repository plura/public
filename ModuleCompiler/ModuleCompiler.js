var ModuleCompiler = function (options) {
	
		
	"use strict";
	
	
	var defaults = {
			process: 'ModuleCompiler.php'
		},
	
	
		core, opts, ui_filter_collections, ui_filter_files, ui_filter_types, ui_result,


		resize = function () {

			var winw = $(window).width(), winh = $(window).height(),

				navh = ui_filter_collections.core.outerHeight( true );

			$('body').height( winh );

			core.height( winh );

			ui_result.resize( winh - navh );

			ui_filter_files.resize( winh - navh );

		},
	


		refresh = function ( handler ) {

			var data, i, params = [], 

				collection	= ui_filter_collections.get(), 

				type		= ui_filter_types.get();

			data = collection instanceof Array ? collection : [ collection ];

			for (i = 0; i < data.length; i += 1) {
					
				params.push({
					path:	(options.prefix || '') + data[i].path,
					dir:	data[i].dir || null,
					prefix: data[i][type],
					first:	data[i].first || null
				});
							
			}

			$.get( options.process,  {data: params, type: type}, handler, 'json');

		},



		eventDataCollectionsHandler = function (data) {

			ui_filter_files.refresh( data.tree );

			ui_result.refresh( data.result );

		},


		eventDataTypeHandler = function (data) {

			ui_result.refresh( data.result );

		},


		eventFilterHandler = function (event, data) {

			event.stopImmediatePropagation();

			switch (event.type) {

			case 'COLLECTIONS':

				refresh( eventDataCollectionsHandler );

				break;

			case 'FILES':

				break;

			case 'TYPES':

				refresh( eventDataTypeHandler );			

				break;								

			}

		},

		eventWindowResizeHandler = function () {

			resize();

		},
			
		init = function () {
			
			opts					= $.extend(true, {}, defaults, options);

			core					= $('<div/>').appendTo('body').addClass('core');
			

			ui_filter_collections	= new ModuleCompilerFilterCollection({data: opts.data, target: core});

			ui_filter_collections.core.on('COLLECTIONS', eventFilterHandler);


			ui_filter_types			= new ModuleCompilerFilterType({target: core});

			ui_filter_types.core.on('TYPES', eventFilterHandler);


			ui_filter_files			= new ModuleCompilerFileManager({target: core});

			ui_filter_files.core.on('FILES', eventFilterHandler);


			ui_result		= new ModuleCompilerResultManager({target: core});


			$(window).resize( eventWindowResizeHandler );


			resize();
			
		};
		

	init();
	

};




var ModuleCompilerFilterCollection = function (options) {

	"use strict";

	var holder, form, select, _this = this,


		get = function () {

			return form.find('*[name=collection] option:selected').data();
		
		},


		eventChangeHandler = function (event, data) {

			event.stopImmediatePropagation();

			holder.trigger( 'COLLECTIONS' );

		},


		init_select = function (data, target) {

			var i, group, group_name, group_data, opt, opt_name;

			if (!target) {

				target = $('<select/>').prop({name: 'collection'}).append('<option/>');

			}

			for( i = 0; i < data.length; i += 1) {

				if (data[i].values || data[i] instanceof Array) {

                    group_name  = data[i].values && data[i].label ? data[i].label : 'group' + i;

                    group_data  = data[i].values || data[i];

                    group       = $('<optgroup/>').prop({label: group_name}).appendTo( target );

                    init_select( group_data, group );

				} else {

					opt_name	= data[i].label || data[i].value;

					opt			= $('<option/>').prop({value: opt_name}).appendTo( target ).html(opt_name).data( data[i].data );

				}

			}

			return target;      

		},



		init = function () {

			holder		= $('<div/>').appendTo( options.target ).addClass('collections');

			form		= $('<form/>').appendTo( holder );

			select		= init_select( options.data ).appendTo( form ).on('change', eventChangeHandler);

			_this.core	= holder;

		};


	_this.get = get;		


	init();


};




var ModuleCompilerFilterType = function (options) {

	"use strict";

	var holder, form, _this = this,

		
		get = function () {

			return form.find('*[name=type]:checked').val();

		},


		eventChangeHandler = function(event, data) {

			event.stopImmediatePropagation();

			form.trigger('TYPES');	

		},


		init = function () {

			var i, id, input, label, values = [['script', 'Script'], ['join', 'Join'], ['closure', 'Closure']];

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

			_this.core = form;

		};


	_this.get = get;


	init();

};




/**
 * deals with single/multiple file structures
 */
var ModuleCompilerFileManager = function ( options ) {

	"use strict";

	var holder, tree, _this = this,


		clean = function () {

			tree = [];

			holder.empty();

		},


		//refreshes data objects
		refresh = function (data) {

			var i;

			clean();

			for( i = 0; i < data.length; i +=1 ) {

				tree[i] = new ModuleCompilerFileManagerNav({
					data:	data[i],
					target:	holder
				});

				tree[i].core.on('FILES', eventTreeHandler);

			}

		},


		resize = function (height) {

			holder.height(height);

		},


		eventTreeHandler = function (event) {

			event.stopImmediatePropagation();

			var data = [], i, s, selected, t;

			for (i = 0; i < tree.length; i += 1) {

				selected = tree[i].selected();

				t = [];

				for (s in selected) {

					if (selected.hasOwnProperty(s)) {

						t.push( selected[i] );

					}

				}
				
				a[i] = t;

			}

			holder.trigger('CHANGE', data);

		},


		init = function () {

			holder		= $('<div/>').appendTo(options.target).addClass('files');

			_this.core	= holder;

		};


	_this.refresh	= refresh;
	_this.resize	= resize;


	init();

};


var ModuleCompilerFileManagerNav = function ( options ) {

	"use strict";

	var active, core, tree, _this = this,

		//toggle branch [and children]
		toggle = function (id) {

			activate( id, !active[id] );

			core.trigger('CHANGE', {selected: active});

		},


		//toggle branch [and activates children accordingly]
		open = function (id) {

			var on 			= tree[id].hasClass('on'),
				children	= tree[id].find('.node');

			activate( id, !on);

			if (children.length) {

				children.each( function () {

					activate( $(this).data('id'), !on);

				});

			}

			core.trigger('CHANGE', {selected: active});

		},


		//sets active status. adds or deletes leaf nodes from the 'active' aggregator object
		activate = function (id, status) {

			var s = status === undefined ? true : status;

			if (s) {

				if (is_leaf(id)){
				
					active[id] = tree[id];

					tree[id].parentsUntil('.tree', '.node:not(.leaf)').each( function() {

						activate( $(this).data('id') );

					});

				}

			} else {

				if (is_leaf(id)) {
				
					delete active[id];

				}

			}

			active_style(id, s);

		},


		//adds active style to nodes
		active_style = function (id, status) {

			if (status) {

				tree[id].addClass('on');

			} else {

				tree[id].removeClass('on');

			}

		},



		render = function (data, id) {

			var i, nodeID, parentID = id ? id + '_' : 'i',

				ui_holder = $('<ul/>'), ui_branch, ui_leaf, ui_trigger;

			for(i = 0; i < data.length; i += 1 ) {

				nodeID = parentID + i;

				ui_leaf = $('<li/>').appendTo( ui_holder ).addClass( 'node ' + nodeID ).data('id', nodeID);

				ui_trigger = trigger( data[i] ).appendTo( ui_leaf ).addClass('trigger');

				if (data[i].children) {

					ui_branch = render(data[i].children, nodeID).appendTo( ui_leaf ).addClass('branch');

					ui_trigger.click( eventBranchClickHandler );

				} else {

					ui_leaf.addClass('leaf').on('click', eventLeafClickHandler);

				}

				tree[nodeID] = ui_leaf;

				activate( nodeID );

			}

			return ui_holder;

		},



		trigger = function( data ) {

			var label = typeof data === 'string' ? data : data.vanity;

			return $('<span/>').html( label );

		},



		is_leaf = function (id) {

			return tree[id].hasClass('leaf');

		},


	
		eventBranchClickHandler = function (event) {

			var id = $(event.currentTarget).parent().data('id');

			open( id );

		},



		eventLeafClickHandler = function (event) {

			var id = $(event.currentTarget).data('id');

			toggle( id );

		},



		init = function () {

			tree		= {};

			active		= {};

			core		= render(options.data).appendTo( options.target ).addClass('tree');

			_this.core	= core;

		};


	init();


};




var ModuleCompilerResultManager = function (options) {

	"use strict";

	var core, textarea, _this = this,

		refresh = function(data) {

			textarea.val( data );

		},

		resize = function (height) {

			core.height( height );

		},

		init = function () {

			core	 = $('<div/>').appendTo( options.target ).addClass('result');

			textarea = $('<textarea/>').appendTo( core );

		};


	_this.refresh	= refresh;
	_this.resize	= resize;


	init();

};






/*var ModuleCompilerCollectionManager = function ( options ) {

	"use strict";


	var form, holder, _this = this,

		eventFilterCollectionHandler = function (event, data) {
			
			event.stopImmediatePropagation();
					
			switch(event.type) {
				
			case 'FORM_VALIDATION_ERROR':
			
				alert(data.alert);
			
				break;
				
			case 'FORM_PROCESS_ERROR':
			
				alert('oops');
			
				break;
				
				
			case 'FORM_PROCESS_SUCCESS':

				holder.trigger('RESULT', {result: data.result, tree: data.tree} );
			
				break;
				
			}
			
		},
			
			
		eventFilterCollectionChangeHandler = function (event) {
				
			var data, i, params = [],

				//get collection data saved in select <option/> object
				collection_data = form.core.find('*[name=collection] option:selected').data(),
			
				type			= form.core.find('*[name=type]:checked').val();
			

			//clean other params
			form.params = {data: null};

			data		= collection_data instanceof Array ? collection_data : [ collection_data ];
				
			for (i = 0; i < data.length; i += 1) {
					
				params.push({
					path:	(options.prefix || '') + data[i].path,
					dir:	data[i].dir || null,
					prefix: data[i][type],
					first:	data[i].first || null
				});
							
			}

			form.params = {data: params};

		},	


		init  = function () {

			holder	= $('<div/>').appendTo( options.target ).addClass('collections');

			form	= new plura.form.Form({
					
				fields:	[
					[
						{name: 'type', label: 'Closure', type: 'radio', value: 'closure'},
						{name: 'type', label: 'Script',  type: 'radio', value: 'script', checked: 1},
						{name: 'type', label: 'Join',    type: 'radio', value: 'join'}
					],
					{name: 'collection',   label: 'Lib',  type: 'select', values: options.data}						
				],
				check:	[{id: 'collection'}],
				params:	{json: 1},				
				path:	options.path,
				target:	holder
			
			});
			
			
			form.core.on('FORM_PROCESS_ERROR FORM_PROCESS_SUCCESS FORM_VALIDATION_ERROR', eventFilterCollectionHandler)
			
			.find('*[name=collection], *[name=type]').on('change', eventFilterCollectionChangeHandler);

			_this.core = holder;

		};



	init();


};*/
