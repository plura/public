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

//http://localhost/dev/code/public/ModuleCompiler/ModuleCompiler.php?type=script&collection=p.admin.js&json=1&data%5B0%5D%5Bpath%5D=..%2F..%2Fjs%2Fp.admin.js%2Fsrc%2Fjs%2F&data%5B0%5D%5Bdir%5D=&data%5B0%5D%5Bprefix%5D=http%3A%2F%2Flocalhost%2Fdev%2Fcode%2Fjs%2Fp.admin.js%2Fsrc%2Fjs%2F&data%5B0%5D%5Bfirst%5D%5B%5D=Admin.js

$result				= array();

$result_top			= array();

$tree				= array();


//creates a directory like array structure for files
function get_tree_structure ( $source ) {

	$tree	= array();

	$flat	= array();

	$paths	= is_string( $source ) ? array($source) : $source;

	foreach ($paths as $value) {

		//turn path into array
		$path = explode('/', $value);

		if (count($path) > 1) {

			$file = array_pop( $path );

			for ($i = 0; $i < count( $path ); $i += 1) {

				//create unique path sequence key
				$key = implode( array_slice( $path, 0, $i + 1), '/' ) . '/';

				//if key does not exist in reference array create one
				if ( !isset( $flat[$key] ) ) {

					$flat[$key] = array('vanity' => $path[$i], 'path' => $key, 'children' => array());

					//link first path key to the output array
					if (!$i) {

						$tree[] = &$flat[$key];	

					} else {

						//add [if existant] subsequent nodes to the previous sequence key related array's children
						$flat[$prev_key]['children'][] = &$flat[$key];

					}

				}

				//save current key as previous for the next loop iteration
				$prev_key = $key;

			}

			$flat[$key]['children'][] = $value;

		} else {

			$tree[] = $value;

		}

	}

	return $tree;

};



//INIT DATA PARSING

foreach($_GET['data'] as $data) {

	//store files for tree structure parsing
	$files		= array();
	
	
	//check if dir exists
	$dir		= isset( $data['dir'] ) ? '/' . $data['dir'] : '';
	
	
	//init recursive directory iterator
	$path		= new RecursiveDirectoryIterator( $data['path'] . $dir );
	
	
	//init recursive item iterator
	$objects	= new RecursiveIteratorIterator( $path, RecursiveIteratorIterator::SELF_FIRST );
	
	
	//cache preventor
	$date		= new DateTime();

	//firsts
	if (isset($data['first']) && !empty($data['first'])) {

		$firsts = array();

		if (is_string( $data['first'] ) ) {

			$data['first'] = array($data['first']);

		}

		foreach ($data['first'] as $first) {
			
			array_push($firsts, preg_quote( $first ) );
		
		}

		$firsts_regexp = '#(' . implode("|", $firsts) . ')#';

	}



	//iterate!
	foreach($objects as $name => $object){



		if (pathinfo($name, PATHINFO_EXTENSION) === 'js') {



			$f = preg_replace("/\\\/", '/', $name);

			$f = preg_replace("/" . preg_quote($path->getPath() . '/', '/') . "/", '', $f);

			
			//echo $f . "<br/>";

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
			if (isset($data['first']) && !empty($data['first']) && preg_match( $firsts_regexp, $f )) {

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

			//add file path for tree structure parsing [next]
			$files[] = $f;

		}

	
	}


	$tree[] = get_tree_structure( $files );
	

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

	'tree'		=> $tree,
	'result'	=> implode($sep, $r),
	'success'	=> 1
	
));

?>