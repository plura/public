var TEST = [
		
		//package w/ single group	
		{
			value:	'test/assets/js/framework1/package1/',
			label:	'framework1/package1/',
			data:	{
				path:		'test/assets/js/framework1/package1/',
				link:		'test/assets/js/framework1/package1/'
			}

		},
		

		//package w/ multiple groups
		{
			value: 'test/assets/js/framework2/',
			label: 'framework2 [package1 + package2]',
			data:	[
				
				{
					path:		'test/assets/js/framework2/package1/',
					closure:	'http://my-domain.com/closure/js/',
					link:		'test/assets/js/framework2/package1/'
				},
				
				{
					path:		'test/assets/js/framework2/package2/',
					closure:	'http://other-domain.com/closure/js/',
					link:		'test/assets/js/framework2/package2/'
				}
			
			]
	
		},
					

		//package w/ single group including precedence ["first"]
		{
			value: 'package1 + first',
			label: 'framework1 + first',
			data:	{			
				path:		'test/assets/js/framework1/package1/',				
				closure:	'http://my-domain.com/closure/js/',
				link:		'test/assets/js/framework1/package1/',
				first:		['Package1Class3.js']				
			}
			
		},


		//css package
		{
			label: 	'CSS package',
			type: 	'css',			
			data:	{			
				first:	['images.css'],
				join: 	'test/compiled/',
				path:	'test/assets/css/',				
				link:	'test/assets/css/'		
			}
			
		},


		//package w/ multiple filtered groups
		{
			value: 'test/assets/js/framework2/',
			label: 'framework2 [package1 + package2]',
			data:	[

				[
		
					{
						path:		'test/assets/js/framework2/package1/',
						closure:	'http://my-domain.com/closure/js/',
						link:		'test/assets/js/framework2/package1/'
					},
					
					{
						path:		'test/assets/js/framework2/package2/',
						closure:	'http://other-domain.com/closure/js/',
						link:		'test/assets/js/framework2/package2/',
					}

				],

				//css package
				{
					group: 	'CSS package',
					type: 	'css',					
					items:	{			
						first:	['images.css'],
						join: 	'test/assets/js/framework1/',
						path:	'test/assets/css/',				
						link:	'test/assets/css/'		
					}
					
				}
			
			]
	
		}


	];
