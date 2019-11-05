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


/**
 * creates a directory like array structure for files
 * @param  string|array $source 		source
 * @return array         				directory like array
 */
function get_tree_structure ( $source ): array {

	$tree	= array();

	$flat	= array();

	$paths	= is_string( $source ) ? array( $source ) : $source;

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



/**
 * prepares a string (or an array of strings) to be used in an regexp 
 * alternation formula.
 * @param  [string|array] $source 		a string or an array of strings
 * @return [string]         			[description]
 */		
function regexp_alternation ( $source ): string {

	$a = array();
		
	if ( is_string( $source ) ) {

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
function pathTo(string $to, string $from): string {

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
function pathTo_css_update( string $to, string $from, string $content ): string {

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

//ATTN: ['data'] is not being recognized as string anymore but as an array!?
if( is_array( $_REQUEST['data'] ) ) {

	$DATA = $_REQUEST['data'];

//else decode json string
} else {

	$DATA = json_decode( $_REQUEST['data'], true );

}





//iterate each group
foreach( $DATA as $n => $data) {

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
	if ( !empty( $data['exclude'] ) ) {

		$exclude_regexp = regexp_alternation( $data['exclude'] );

	}
	

	//top (first) files
	if ( !empty( $data['top'] ) ) {

		$top_regexp = regexp_alternation( $data['top'] );

	}


	//files filter
	if ( !empty( $data['filter'] ) ) {

		$filter_regexp = regexp_alternation( $data['filter'] );

	}	



	//iterate!
	foreach($objects as $name => $object){


		if (pathinfo($name, PATHINFO_EXTENSION) === $_REQUEST['type']) {


			$file_path = preg_replace("/\\\/", '/', $name);

			$file_path = preg_replace("/" . preg_quote($path->getPath() . '/', '/') . "/", '', $file_path);


			//if file is in the "excluded" list
			if (isset( $exclude_regexp ) && preg_match($exclude_regexp, $file_path) ) {

				continue;


			//if a filter exists, any file that does not match is excluded
			} elseif (isset( $filter_regexp ) && !preg_match( $filter_regexp, $file_path )) {

				continue;

			}



			switch ($_REQUEST['returnType']) {

					
			case 'closure':

				
				$item = "// @code_url " . $file_path . "?" . $date->getTimestamp();

					
				break;

			//create stylesheet/script
			case 'link':


				switch ($_REQUEST['type']) {

				case 'css':

					$item = "<link rel=\"stylesheet\" type=\"text/css\" href=\"" . $data['prefix'] . $file_path . "\" />";

					break;

				//js
				default:

					$item = "<script src=\"" . $data['prefix'] . $file_path . "\"></script>";

				}

					
				break;


			//join JavaScript or CSS files into a single plain text output
			case 'join':

					
				$filename	= $path->getPath() . '/' . $file_path;

					
				$handle		= fopen($filename, "r");

				
				$item		= fread($handle, filesize( $filename ) );

				
				//update file paths
				if ($_REQUEST['type'] === 'css' && !empty( $data['join'] ) ) {

					$item = pathTo_css_update($filename, $data['join'],  $item);

				}


				fclose($handle);

				
				break;
					
			}
			

			//check if a particular path should be included in the special 'top' (first) array
			if (isset( $top_regexp ) && preg_match( $top_regexp, $file_path )) {

				
				//get corresponding key in data['top'] to correctly sort order afterwards
				foreach ($data['top'] as $key => $value) {

					if (preg_match("#" . preg_quote( $value ) . "#", $file_path)) {

						$group_result_top[$key]	= $item;

						$group_files_top[$key]	= $file_path;

						break;

					}

				}
				
			
			} else {


				$group_result[]	= $item;

				$group_files[]	= $file_path;
			
			
			}

		}

	
	}


	//sort array by keys - they might be unordered (alphabetically). ie. [2, 0, 1]
	ksort( $group_files_top );

	ksort( $group_result_top );

	unset( $filter_regexp, $top_regexp );
	


	//merge files and create tree structure object
	$group_files	= array_merge( $group_files_top, $group_files );

	$tree[]			= array(
		'core'	=> get_tree_structure( $group_files ),
		'name'	=> !empty( $data['name'] ) ? $data['name'] : null,		
		'path'	=> $data['path']
	);



	switch ($_REQUEST['returnType']) {

	case 'join':

		$group_sep = $sep = "\n\n\n";

		break;	

	case 'closure':

		if ( $n === 0 ) {

			array_unshift(
			
				$group_result_top,
			
				"// ==ClosureCompiler==",
				"// @output_file_name default.js",
				"// @language_out ECMASCRIPT_2015",
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


/**
 * if minify option is set, use Google's Closure RESTful or CSSMinifier APIs
 * to generate a minified version of the joined result
 */
if ($_REQUEST['returnType'] === 'join' && $_REQUEST['minify']) {


	$src = implode('', $result);

	//CSSMinifier API params for css filetypes
	if ( $_REQUEST['type'] === 'css' ) {


		$ch_url	= 'https://cssminifier.com/raw';
		$ch_crt	= 'cssminifiercom.crt';

	    $params		= array(
	    	'input' => urlencode( $src )
	    );

	//Google Closure API params for js filetypes
	} else {


		$ch_url	= 'https://closure-compiler.appspot.com/compile';
		$ch_crt	= '-appspotcom.crt';	

		$params = array( 
			'compilation_level'		=> 'SIMPLE_OPTIMIZATIONS',
			'output_format'			=> 'text',
			'output_info'			=> 'compiled_code',
			'language_out'			=> 'ECMASCRIPT_2015',
			'js_code'				=> urlencode( $src ),
			
			/*'language'			=> 'ECMASCRIPT6_STRICT',
			'rewrite_polyfills'		=> false,
			'inject_libraries'		=> false
			'rewrite_polyfills' 	=> 'false',
			'--inject_libraries'	=> 'false'*/

		);


	}

	$ch_data = array();

	foreach( $params as $key => $value ) {

		$ch_data[] = $key . "=" . $value;

	}	


    // init the request, set some info, send it and finally close it
    $ch = curl_init( $ch_url );

    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, implode('&', $ch_data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: application/x-www-form-urlencoded'));    

    //The usage of https requires a 'trusted' CA certificate - saved as 'certificate with chain (PEM). For more
    //info check this link: http://unitstep.net/blog/2009/05/05/using-curl-in-php-to-access-https-ssltls-protected-sites/
	//You can also not-so-safe 'workaround' [via https://stackoverflow.com/a/4372730].
	//In that case, comment the following 3 lines of code and uncomment this one below.
	//curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);	
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
	curl_setopt($ch, CURLOPT_CAINFO, getcwd() . "/certificates/" . $ch_crt);    

    $result = curl_exec($ch);

    curl_close($ch);

} else {

	$result = implode($group_sep, $result);

}

echo json_encode(array(

	'tree'		=> $tree,
	'result'	=> $result,
	'success'	=> 1
	
));

?>