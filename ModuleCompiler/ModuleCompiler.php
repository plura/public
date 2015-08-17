<?php

/**
 * Module Compiler 1.0
 *
 * Copyright (c) 2015 Plura
 *
 * Date: 2015-08-17 17:35:00 (Mon, 17 Aug 2015)
 * Revision: 6246
 *
 */


$result		= array();

$tree		= array();


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

			$flat[$key]['children'][] = array( 'path' => $value, 'name' => $file );

		} else {

			$tree[] = $value;

		}

	}

	return $tree;

};



function multi_regexp ( $source ) {

	$a = array();
		
	if (is_string( $source ) ) {

		$source = array( $source );

	}

	foreach ($source as $s) {

		$a[] = preg_quote( $s );
	
	}

	return '#(' . implode("|", $a) . ')#';

}



//INIT DATA PARSING

foreach($_GET['data'] as $n => $data) {

	//store files path for tree structure parsing
	$group_files		= array();

	$group_files_top	= array();


	//store results
	$group_result		= array();
	
	$group_result_top	= array();	
	
	
	//check if dir exists
	//$dir		= isset( $data['dir'] ) ? '/' . $data['dir'] : '';
	
	
	//init recursive directory iterator
	$path		= new RecursiveDirectoryIterator( $data['path'] );// . $dir );
	

	//init recursive item iterator
	$objects	= new RecursiveIteratorIterator( $path, RecursiveIteratorIterator::SELF_FIRST );
	
	
	//cache preventor
	$date		= new DateTime();



	//exclude files
	if (!empty($data['exclude'])) {

		$exclude_regexp = multi_regexp( $data['exclude'] );

	}

	

	//firsts
	if (!empty($data['first'])) {

		$first_regexp = multi_regexp( $data['first'] );

	}



	//iterate!
	foreach($objects as $name => $object){


		if (pathinfo($name, PATHINFO_EXTENSION) === 'js') {


			$file_path = preg_replace("/\\\/", '/', $name);

			$file_path = preg_replace("/" . preg_quote($path->getPath() . '/', '/') . "/", '', $file_path);

			
			if (isset($exclude_regexp) && preg_match($exclude_regexp, $file_path) ) {

				continue;

			}



			switch ($_GET['type']) {

					
			case 'closure':

				
				$item = "// @code_url " . $data['prefix'] . $file_path . "?" . $date->getTimestamp();

					
				break;

					
			case 'script':


				$item = "<script src=\"" . $data['prefix'] . $file_path . "\"></script>";

					
				break;

					
			case 'join':

					
				$filename	= $path->getPath() . '/' . $file_path;

					
				$handle		= fopen($filename, "r");

				
				$item		= fread($handle, filesize( $filename ) );

					
				fclose($handle);

				
				break;
					
			}
			

			//check if a particular path should be included in the special 'top' array
			if (isset( $first_regexp ) && preg_match( $first_regexp, $file_path )) {

				
				//get corresponding key in data['first'] to correctly sort order afterwards
				foreach ($data['first'] as $key => $value) {

					if (preg_match("#" . preg_quote( $value ) . "#", $file_path)) {

						$group_result_top[$key]	= $item;

						$group_files_top[$key]	= $file_path;

						break;

					}

				}
				
			
			} else {


				$group_result[]		= $item;

				$group_files[]	= $file_path;
				
			
			}

		}

	
	}


	//sort array by keys - they might be unordered (alphabetically). ie. [2, 0, 1]
	ksort( $group_files_top );

	ksort( $group_result_top );
	


	//merge files and create tree structure object
	$group_files	= array_merge( $group_files_top, $group_files );

	$tree[]			= array(
		'core'	=> get_tree_structure( $group_files ),
		'name'	=> !empty( $data['name'] ) ? $data['name'] : null,		
		'path'	=> $data['path']
	);



	switch ($_GET['type']) {

	case 'join':

		$group_sep = $sep = "\n\n\n";

		break;	

	case 'closure':

		if ( $n === 0 ) {

			array_unshift(
			
				$group_result_top,
			
				"// ==ClosureCompiler==",
				"// @output_file_name default.js",
				"// ==/ClosureCompiler=="
			
			);

		}

		$group_sep = $sep = "\n";

		break;

	case 'script':

		array_unshift(
		
			$group_result_top,

			"<!-- " . ( !empty( $data['name'] ) ? $data['name'] . " : " : "" ) . $data['path'] . "-->"
		
		);	

		$sep 		= "\n";
		$group_sep	= "\n\n";

		break;

	}


	$result[] = implode( $sep, array_merge( $group_result_top, $group_result ) );
	

}

echo json_encode(array(

	'tree'		=> $tree,
	'result'	=> implode($group_sep, $result),
	'success'	=> 1
	
));

?>