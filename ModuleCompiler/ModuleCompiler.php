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

//http://localhost/dev/code/public/ModuleCompiler/ModuleCompiler.php?data%5B0%5D%5Bpath%5D=..%2F..%2Fjs%2Fp.admin.js%2Fsrc%2Fjs%2F&data%5B0%5D%5Bdir%5D=&data%5B0%5D%5Bprefix%5D=http%3A%2F%2Flocalhost%2Fdev%2Fcode%2Fjs%2Fp.admin.js%2Fsrc%2Fjs%2F&data%5B0%5D%5Bfirst%5D%5B%5D=Admin.js&data%5B0%5D%5Bexclude%5D%5B%5D=Admin.js&data%5B0%5D%5Bexclude%5D%5B%5D=admin%2Fconstants%2FRegExp.js&type=script


//http://localhost/dev/code/public/ModuleCompiler/ModuleCompiler.php?data%5B0%5D%5Bpath%5D=..%2F..%2Fjs%2Fp.admin.js%2Fsrc%2Fjs%2F&data%5B0%5D%5Bdir%5D=&data%5B0%5D%5Bprefix%5D=&data%5B0%5D%5Bfirst%5D%5B%5D=Admin.js&data%5B0%5D%5Bexclude%5D=&type=join

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

foreach($_GET['data'] as $data) {

	//store files path for tree structure parsing
	$files		= array();

	$files_top	= array();
	
	
	//check if dir exists
	//$dir		= isset( $data['dir'] ) ? '/' . $data['dir'] : '';
	
	
	//init recursive directory iterator
	$path		= new RecursiveDirectoryIterator( $data['path'] );// . $dir );
	

	//init recursive item iterator
	$objects	= new RecursiveIteratorIterator( $path, RecursiveIteratorIterator::SELF_FIRST );
	
	
	//cache preventor
	$date		= new DateTime();


	//exclude
	if (isset($data['exclude'])) {

		$exclude = array();

		foreach ($exclude as $e) {

			$exclude[] = preg_quote( $e );

		}

	}


	//exclude files
	if (isset($data['exclude']) && !empty($data['exclude'])) {

		$exclude_regexp = multi_regexp( $data['exclude'] );

	}

	
	//firsts
	if (isset($data['first']) && !empty($data['first'])) {

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

					if (preg_match("#" . preg_quote($value) . "#", $file_path)) {

						$result_top[$key]	= $item;

						$files_top[$key]	= $file_path;

						break;

					}

				}
				
			
			} else {


				$result[]	= $item;

				$files[]	= $file_path;
				
			
			}

		}

	
	}


	//sort array by keys - they might be unordered. ie. [2, 0, 1]
	ksort($files_top);	



	$files	= array_merge( $files_top, $files );

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


/*print_r(array(

	'tree'		=> $tree,
	'result'	=> implode($sep, $r),
	'success'	=> 1
	
)); exit;*/



echo json_encode(array(

	'tree'		=> $tree,
	'result'	=> implode($sep, $r),
	'success'	=> 1
	
));

?>