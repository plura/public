var ModuleCompiler = function () {
		
	"use strict";
	
	var core, form, result,
	
		
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
				
			var a, b = [], i, n, 
				path	= core.find('*[name=path]').val(),
				prefix	= core.find('*[name=prefix]'),
				type	= core.find('*[name=type]:checked').val(),
				p;
				
			for (i = 0; i < CONFIG.PATH.length; i += 1) {

				if (path === CONFIG.PATH[i].value) {
						
					a = CONFIG.PATH[i].data instanceof Array ? CONFIG.PATH[i].data : [CONFIG.PATH[i].data];
						
					for (n = 0; n < a.length; n += 1) {
							
						b.push({
							path:	a[n].path || CONFIG.PATH[i].value,
							dir:	a[n].dir || null,
							prefix: a[n][type]
						});
							
					}
					
					form.params = {data: b};
						
					break;
						
				}
					
			}

		},
			
			
			
		data = function () {
				
			var obj = {
					
					fields:	[
						[
							{name: 'type', label: 'Closure', type: 'radio', value: 'closure', checked: 1},
							{name: 'type', label: 'Script',  type: 'radio', value: 'script'},
							{name: 'type', label: 'Join',    type: 'radio', value: 'join'}
						],
						{name: 'path',   label: 'Lib',    type: 'select', values: CONFIG.PATH}						
					],
					check:	[{id: 'path'}],
					params:	{json: 1},				
					path:	'tree.php',
					target:	core
				};


			return obj;
				
		},
	
	
		init = function () {

			core	= $('<div/>').appendTo('body').addClass('core');
			
			result	= $('<textarea/>').appendTo(core).addClass('result');
			
			form	= new plura.form.Form(data());
			
			form.core.on('FORM_PROCESS_ERROR FORM_PROCESS_SUCCESS FORM_VALIDATION_ERROR', eventFormHandler)
				
				.find('*[name=path], *[name=type]').on('change', eventChangeHandler);
			
		};
		

	init();
	

};

$(function () { new ModuleCompiler(); });