var ModuleCompiler = function (options) {
	
		
	"use strict";
	
	
	var defaults = {
			process: 'ModuleCompiler.php'
		},
	
	
		core, form, result, opts,
	
		
		eventFormHandler = function (event, data) {
			
			event.stopImmediatePropagation();
			
			var i, txt = '';
			
			switch(event.type) {
				
			case 'FORM_VALIDATION_ERROR':
			
				alert(data.alert);
			
				break;
				
			case 'FORM_PROCESS_ERROR':
			
				alert('oops');
			
				break;
				
				
			case 'FORM_PROCESS_SUCCESS':
				
				result.val(data.items);
			
				break;
				
			}
			
		},
			
			
		eventChangeHandler = function (event) {
				
			var data, i, n, params = [],
				
				collection	= core.find('*[name=collection]').val(),
				
				type		= core.find('*[name=type]:checked').val();
				
			for (i = 0; i < opts.data.length; i += 1) {

				if (collection === opts.data[i].value) {
						
					data = opts.data[i].data instanceof Array ? opts.data[i].data : [opts.data[i].data];
						
					for (n = 0; n < data.length; n += 1) {
							
						params.push({
							path:	(opts.prefix || '') + (data[n].path || opts.data[i].value),
							dir:	data[n].dir || null,
							prefix: data[n][type],
							first:	data[n].first || opts.data[i].first || null
						});
							
					}

					form.params = {data: params};
						
					break;
						
				}
					
			}

		},
			
			
			
		get_form = function () {
				
			var obj = {
					
					fields:	[
						[
							{name: 'type', label: 'Closure', type: 'radio', value: 'closure'},
							{name: 'type', label: 'Script',  type: 'radio', value: 'script', checked: 1},
							{name: 'type', label: 'Join',    type: 'radio', value: 'join'}
						],
						{name: 'collection',   label: 'Lib',    type: 'select', values: opts.data}						
					],
					check:	[{id: 'collection'}],
					params:	{json: 1},				
					path:	opts.process,
					target:	core
				};


			return obj;
				
		},
	
	
		init = function () {
			
			opts	= $.extend(true, {}, defaults, options);

			core	= $('<div/>').appendTo('body').addClass('core');
			
			result	= $('<textarea/>').appendTo(core).addClass('result');
			
			form	= new plura.form.Form(get_form());
			
			form.core.on('FORM_PROCESS_ERROR FORM_PROCESS_SUCCESS FORM_VALIDATION_ERROR', eventFormHandler)
				
				.find('*[name=collection], *[name=type]').on('change', eventChangeHandler);
			
		};
		

	init();
	

};
