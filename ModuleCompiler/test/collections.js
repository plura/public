var TEST = [
			
		{value: 'test/framework1/package1/',	label: 'framework1/package1/',				data: {closure: 'http://my-domain.com/closure/js/',	script: 'test/framework1/package1/'}},
			
		{value: 'test/framework2/',				label: 'framework1 + framework2',			data: [
				
				{path: 'test/framework1/',		closure: 'http://my-domain.com/closure/js/',		script: 'test/framework1/'},
				
				{path: 'test/framework2/',		closure: 'http://other-domain.com/closure/js/',		script: 'test/framework2/'/*,									dir: '_custom/js/'*/}
			
			]
	
		},
			
			
		{value: 'package1+first',			label: 'framework1 + first',				data: {
				
				path:		'test/framework1/package1/',
				
				closure:	'http://my-domain.com/closure/js/',
				
				script:		'test/framework1/package1/',
			
				first:		['Package1Class3.js']
				
			}
			
		}

	];
