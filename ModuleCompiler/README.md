


Directories
===== 



[

	//simple collection
	{
		label:	'collection1'
		data:	{
			path: 	'path-to-collection1/'
			script:	'http://localhost/path-to-collection1/'
		}
	},


	//collection with multiple items
	{
		label:	'collection2'
		data:	[
			{
				path: 	'path-to-collection2/scripts1/',
				script:	'http://localhost/path-to-collection2/scripts1/'
			},
			{
				path: 	'path-to-collection2/scripts2/',
				script:	'http://localhost/path-to-collection2/scripts2/'
			}
		]
	},


	//simple collection with type indication
	{
		label:	'collection1',
		type:	'css',
		data:	{
			path: 	'path-to-collection1/'
			script:	'http://localhost/path-to-collection1/'
		}
	},


	//grouped collection, triggered by existence of an array inside data
	{
		label:	'grouped collection'
		data:	[

			[
				{
					label:	'group1a',
					data:	{
						path: 	'path-to-collection1/'
						script:	'http://localhost/path-to-collection1/'
					}
				},				
				{
					label:	'group1b',
					data:	{
						path: 	'path-to-collection1/'
						script:	'http://localhost/path-to-collection1/'
					}
				}
			],

			{
				label:	'group2',
				data:	{
					path: 	'path-to-collection1/'
					script:	'http://localhost/path-to-collection1/'
				}
			}

		]

	},


	//grouped collection, triggered by the parameter 'group'
	{
		label:	'grouped collection'
		data:	[

			{
				group: 'group1',
				items: {
					label:	'group1',
					data:	{
						path: 	'path-to-collection1/'
						script:	'http://localhost/path-to-collection1/'
					}
				}
			},			
			
			{
				label:	'group2',
				data:	{
					path: 	'path-to-collection1/'
					script:	'http://localhost/path-to-collection1/'
				}
			}

		]

	}	

	
	//select filter grouping
	{label: 'other types', values: [
	

		//simple collection with type indication (default is js)
		{
			label:	'collection1',
			type:	'css',
			data:	{
				path: 	'path-to-collection1/'
				script:	'http://localhost/path-to-collection1/'
			}
		}

	
	]}


]
