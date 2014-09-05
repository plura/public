<?php

/**
 * Module Compiler 1.0
 *
 * Copyright (c) 2014 Plura
 *
 * Date: 2014-09-05 12:00:00 (Fri, 05 Sep 2014)
 * Revision: 6246
 *
 */

$result				= array();

$result_top			= array();

foreach($_GET['data'] as $data) {
	
	
	//check if dir exists
	$dir		= isset( $data['dir'] ) ? '/' . $data['dir'] : '';
	
	
	//init recursive directory iteratior
	$path		= new RecursiveDirectoryIterator( $data['path'] . $dir );
	
	
	//init recursive item iterator
	$objects	= new RecursiveIteratorIterator( $path, RecursiveIteratorIterator::SELF_FIRST );
	
	
	//cache preventor
	$date		= new DateTime();


	//firsts
	if (isset($data['first'])) {


		$firsts = array();

		if (is_string($data['first'])) {

			$data['first'] = array($data['first']);

		}

		foreach ($data['first'] as $first) {
			
			array_push($firsts, preg_quote($first));
		
		}

		$firsts_regexp = '#(' . implode("|", $firsts) . ')#';

	}



	//iterate!
	foreach($objects as $name => $object){

		
		if (pathinfo($name, PATHINFO_EXTENSION) === 'js') {


			$f = preg_replace("/\\\/", '/', $name);

			
			$f = preg_replace("/" . preg_quote($path->getPath() . '/', '/') . "/", '', $f);

			
			switch ($_GET['type']) {

					
			case 'closure':

				
				$item = "// @code_url " . $data['prefix'] . $f . "?" . $date->getTimestamp();

					
				break;

					
			case 'script':

				
				$item = "<script src=\"" . $data['prefix'] . $f . "\"></script>";

					
				break;

					
			case 'join':

					
				$filename	= $path->getPath() . $f;

					
				$handle		= fopen($filename, "r");

				
				$item		= fread($handle, filesize($filename));

					
				fclose($handle);
				
				break;

					
			}
			

			//check if a particular path should be included in the special 'top' array
			if (isset($data['first']) && preg_match( $firsts_regexp, $f )) {

				//get corresponding key in data['first'] to correctly sort order afterwards
				foreach ($data['first'] as $key => $value) {

					if (preg_match("#" . preg_quote($value) . "#", $f)) {

						$result_top[$key] = $item;

						break;

					}

				}
				
			} else {
				
				
				array_push($result, $item);	
				
				
			}

			
		}

	
	}
		

}



//sort array by keys - they might be unordered. ie. [2, 0, 1]
ksort($result_top);



switch ($_GET['type']) {
	

case 'closure':

	
	array_unshift(
	
		$result_top,
	
		"// ==ClosureCompiler==",
		"// @output_file_name default.js",
		"// ==/ClosureCompiler=="
	
	);

	$sep = "\n";
	

	break;
	

case 'join':


	$sep = "\n\n\n";


	break;	

	
case 'script':


	$sep = "\n";


	break;
	

default:



}



$r = array_merge( $result_top, $result );


echo json_encode(array(

	'items'		=> implode($sep, $r),
	'success'	=> 1
	
));

?>