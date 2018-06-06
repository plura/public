var TEST = [
		
		//package w/ single group	
		{
			value:	'test/assets/js/framework1/package1/',
			label:	'single group package',							//framework1/package1/',
			data:	{
				path:		'test/assets/js/framework1/package1/',
				link:		'test/assets/js/framework1/package1/'
			}

		},
		

		//package w/ multiple groups
		{
			value: 'test/assets/js/framework2/',
			label: 'multiple groups package',							//'framework2 [package1 + package2]',
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
			label: 'single group package with precedence ["first"]',	//'framework1 + first',
			data:	{			
				path:		'test/assets/js/framework1/package1/',				
				closure:	'http://my-domain.com/closure/js/',
				link:		'test/assets/js/framework1/package1/',
<<<<<<< HEAD
				top:		['Package1Class3.js']				
=======
				first:		['Package1Class3.js']				
>>>>>>> cfa9fed6e555b2da8f567aa0a61db9fb9360244c
			}
			
		},


		//single group package with file filtering
		{
			value:	'test/assets/js/framework1/package1/',
			label:	'single group package with file filtering',			//framework1/package1/',
			data:	{
				path:		'test/assets/js/framework1/package1/',
				link:		'test/assets/js/framework1/package1/',
				filter:		['Package1Class2SubClass2.js']
			}

		},


		//css package
		{
			label: 	'CSS package',
			type: 	'css',			
			data:	{			
				top:	['images.css'],
				join: 	'test/compiled/',
				path:	'test/assets/css/',				
				link:	'test/assets/css/'		
			}
			
		},


		//package w/ multiple filtered groups
		{
			value: 'test/assets/js/framework2/',
			label: 'package w/ multiple filtered groups',				//'framework2 [package1 + package2]',
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
						top:	['images.css'],
						join: 	'test/assets/js/framework1/',
						path:	'test/assets/css/',				
						link:	'test/assets/css/'		
					}
					
				}
			
			]
	
		}


	];
