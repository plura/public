var CONFIG = {
		
    PATH:	[
			{value: 'p.js/src/',									label: 'lib/p.js',						data: {closure: 'http://dev.plura.pt/closure/p/p.js/src/',			script: 'src/'}},
			
			{value: 'p.admin.js/src/',								label: 'lib/p.admin.js',				data: {closure: 'http://dev.plura.pt/closure/p/p.admin.js/src/',	script: 'src/'}},
			
			{value: 'p.wp/src/',									label: 'lib/p.wp.js',					data: {closure: 'http://dev.plura.pt/closure/p/p.admin.js/src/',	script: 'src/'}},		
			
			{value: '../apps/showcase/dev/js/',						label: 'apps/showcase',					data: {closure: 'http://dev.plura.pt/closure/showcase/dev/js/',		script: 'src/'}},			
			
			
			
			{value: 'temp',											label: 'app.pharma',					data: [
				{path: '../apps/showcase/src/',						closure: 'http://dev.plura.pt/closure/showcase/src/',	script: 'http://localhost/dev/code/apps/showcase/src/'},
				{path: '../../sites/2012/johnson/app.pt.pharma/',	closure: 'http://jjpharmafolder.com/_custom/js/',		script: '_custom/js/',									dir: '_custom/js/'}
			]},
			
			
			
			// S I T E S
			
			
			{value: 'www_ohmm_pt',									label: 'www.ohmm.pt',					data: {
				
				closure: 'http://www.ohmm.pt/wp/wp-content/themes/plura_www_ohmm_pt/_content/js/',	
			
				path:	'../../sites/2013/ohmm/site/wp/wp-content/themes/plura_www_ohmm_pt/_content/js/',
				
				script: 'http://localhost/dev/sites/2013/ohmm/site/wp/wp-content/themes/plura_www_ohmm_pt/_content/js/'}
				
			},
			
			
			{value: 'www_socgeografialisboa_pt',					label: 'www.socgeografialisboa.pt',		data: {
				closure: 'http://www.socgeografialisboa.pt/wp/wp-content/themes/plura_www_socgeografialisboa_pt_2014/_content/js/',	
			
				path:	'../../sites/2009/socgeografialisboa/site/wp/wp-content/themes/plura_www_socgeografialisboa_pt_2014/_content/js/',
				
				script: 'http://localhost/dev/sites/2009/socgeografialisboa/site/wp/wp-content/themes/plura_www_socgeografialisboa_pt_2014/_content/js/'}
				
			},			

			
			
			/*{value: 'temp',			label: 'app.pharma',			data: [
				{path: '../apps/showcase/src/',						closure: 'http://dev.plura.pt/closure/showcase/src/',	script: 'http://localhost/dev/apps/showcase/src/'},
				{path: '../../sites/2012/johnson/app.pt.pharma/',	closure: 'http://jjpharmafolder/custom/app/src/',		script: 'custom/app/src/',									dir: 'custom/app/src/'}
			]}*/
			/*{value: '../../2012/johnson/app.pt.pharma/',			label: 'app.pharma',		data: [
				{closure: 'http://jjpharmafolder/_dev/',			script: '_dev/', 			dir: '_dev/'},
				{closure: 'http://jjpharmafolder/custom/app/src/',	script: 'custom/app/src/',	dir: 'custom/app/src/'}
			]} */
		]
	
	};