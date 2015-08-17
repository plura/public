var TEST = [
		
		//package w/ single group	
		{
			value:	'test/framework1/package1/',
			label:	'framework1/package1/',
			data:	{
				path:		'test/framework1/package1/',
				closure:	'http://my-domain.com/closure/js/',
				script:		'test/framework1/package1/'
			}

		},
		

		//package w/ multiple groups
		{
			value: 'test/framework2/',
			label: 'framework2 [package1 + package2]',
			data:	[
				
				{
					path:		'test/framework2/package1/',
					closure:	'http://my-domain.com/closure/js/',
					script:		'test/framework2/package1/'
				},
				
				{
					path:		'test/framework2/package2/',
					closure:	'http://other-domain.com/closure/js/',
					script:		'test/framework2/package2/'/*,									dir: '_custom/js/'*/
				}
			
			]
	
		},
					

		//package w/ single group including precedence ["first"]
		{
			value: 'package1 + first',
			label: 'framework1 + first',
			data:	{			
				path:		'test/framework1/package1/',				
				closure:	'http://my-domain.com/closure/js/',
				script:		'test/framework1/package1/',
				first:		['Package1Class3.js']				
			}
			
		}

	];
