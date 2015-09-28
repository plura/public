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



/**
 * returns the relative path between to file or directories path
 * @param string to			target file or dir
 * @param string from	 	from target file or dir
 * @return string			relative path between two file or directory paths
 */
function pathTo($to, $from) {

	$crumbs		= array();

	$to			= realpath( $to );

	$from		= realpath( preg_replace('/([^\/]+$)/', "", $from ) );

	$temp_from	= explode(DIRECTORY_SEPARATOR, $from);

	//b/c temp_from will be sliced, its length will reduce w/ each loop too. that's why its length must be saved 
    $n			= count( $temp_from ); 

	for ($i = 0; $i < $n; $i += 1) {

		$reg = '/' . preg_quote( implode(DIRECTORY_SEPARATOR, $temp_from) ) . '/';

	    if (preg_match( $reg, $to) ) {
                        
	        $temp_to_remain = preg_replace( $reg, '', $to);

	        break;        
	                        
	    }

	    array_splice($temp_from, -1);
	                
	    array_push($crumbs, '..');
               
	}
  

	$path = implode('/', $crumbs) . str_replace('\\', '/', $temp_to_remain);

	
	return preg_replace('/^\/?/', '', $path);
                
}



/**
 * searches for properties with url values (ie. url(path) | url('path') | url("path") );
 * @param string from		compiled css file path
 * @param string to	 		target css file
 * @param string content	target css file content
 * @return string
 */
function pathTo_css_update( $to, $from, $content ) {

	if (!file_exists( $from )) {

		return $content;

	} else {

		$to = preg_replace('/[^\/]+$/', '', $to);

		return preg_replace_callback("/(url\((?:'|\")?)([^'\"]+)((?:'|\")?\))/", function ($matches) use ($to, $from) {

			if (!file_exists( $to . $matches[2] ) ) {

				return $matches[0];

			}

			return $matches[1] . pathTo($to . $matches[2], $from) . $matches[3];

		}, $content);

	}

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


		if (pathinfo($name, PATHINFO_EXTENSION) === $data['type']) {


			$file_path = preg_replace("/\\\/", '/', $name);

			$file_path = preg_replace("/" . preg_quote($path->getPath() . '/', '/') . "/", '', $file_path);

			
			if (isset($exclude_regexp) && preg_match($exclude_regexp, $file_path) ) {

				continue;

			}




			switch ($_GET['returnType']) {

					
			case 'closure':

				
				$item = "// @code_url " . $file_path . "?" . $date->getTimestamp();

					
				break;

					
			case 'link':

				switch ($data['type']) {

				case 'css':

					$item = "<link rel=\"stylesheet\" type=\"text/css\" href=\"" . $file_path . "\" />";

				//js
				default:

					$item = "<script src=\"" . $file_path . "\"></script>";

				}

					
				break;

					
			case 'join':

					
				$filename	= $path->getPath() . '/' . $file_path;

					
				$handle		= fopen($filename, "r");

				
				$item		= fread($handle, filesize( $filename ) );

				
				//update file paths
				if ($data['type'] === 'css' && !empty($data['join'])) {

					$item = pathTo_css_update($filename, $data['join'],  $item);

				}


					
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



	switch ($_GET['returnType']) {

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

	case 'link':

		array_unshift(
		
			$group_result_top,

			"<!-- " . ( !empty( $data['name'] ) ? $data['name'] . " : " : "" ) . $data['path'] . " -->"
		
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