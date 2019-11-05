/**
 * Filter for collections
 *
 */
var ModuleCompilerFilterCollection = function ({data, prefix, target}) {

	let core, form;

	const 

		_this = this,

		c = ({element}) => {

			core.dispatchEvent( new CustomEvent('COLLECTIONS', {detail: element.value}) );

		};


	( core  = target.appendChild( document.createElement('div') ) ).classList.add(`${prefix}-collections`);

	form = new ModuleCompilerForm({target: core, data: [{

		type: 'select', values: data, change: c

	}] });

	_this.core		= core;


};