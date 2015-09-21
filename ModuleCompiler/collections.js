var TEST = [
		
		//package w/ single group	
		{
			value:	'test/js/framework1/package1/',
			label:	'framework1/package1/',
			data:	{
				path:		'test/js/framework1/package1/',
				closure:	'http://my-domain.com/closure/js/',
				script:		'test/js/framework1/package1/'
			}

		},
		

		//package w/ multiple groups
		{
			value: 'test/js/framework2/',
			label: 'framework2 [package1 + package2]',
			data:	[
				
				{
					path:		'test/js/framework2/package1/',
					closure:	'http://my-domain.com/closure/js/',
					script:		'test/js/framework2/package1/'
				},
				
				{
					path:		'test/js/framework2/package2/',
					closure:	'http://other-domain.com/closure/js/',
					script:		'test/js/framework2/package2/'/*,									dir: '_custom/js/'*/
				}
			
			]
	
		},
					

		//package w/ single group including precedence ["first"]
		{
			value: 'package1 + first',
			label: 'framework1 + first',
			data:	{			
				path:		'test/js/framework1/package1/',				
				closure:	'http://my-domain.com/closure/js/',
				script:		'test/js/framework1/package1/',
				first:		['Package1Class3.js']				
			}
			
		},


		//css package
		{
			label: 	'CSS package',
			data:	{			
				first:	['images.css'],
				join: 	'test/js/framework1/',
				path:	'test/css/',				
				script:	'test/css/',
				type: 	'css'				
			}
			
		}
	];
