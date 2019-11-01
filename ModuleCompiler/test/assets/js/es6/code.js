document.addEventListener('DOMContentLoaded', () => {

	let form = document.createElement('form'),

		input1 = form.appendChild( document.createElement('div') ),

		input2 = form.appendChild( document.createElement('div') ),

		attr = (obj, props) => Object.entries( obj ).forEach( ([key, value] ) => obj.setAttribute(key, value) ),

		classes = ['class1', 'class2', 'class3'];


	[ input1, input2 ].forEach( element => {

		element.classList.add( ...classes );

		['change', 'focus'].forEach( eventType => element.addEventListener(eventType, event => {

			console.log( event.type );

		} ) );

	});


	attr( input1, {type: 'text', placeholder: 'Name'});

	attr( input2, {type: 'text', placeholder: 'Email'});



});