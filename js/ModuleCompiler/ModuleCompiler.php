<?php

//type=script&path=package1%2Bfirst&json=1&data%5B0%5D%5Bpath%5D=test%2Fframework1%2Fpackage1%2F&data%5B0%5D%5Bdir%5D=&data%5B0%5D%5Bprefix%5D=test%2Fframework1%2Fpackage1%2F&data%5B0%5D%5Bfirst%5D%5B%5D=Package1Class3.js 

$result		= array();

$result_top	= array();
	

foreach($_GET['data'] as $data) {
	
	
	//check if dir exists
	$dir		= isset( $data['dir'] ) ? '/' . $data['dir'] : '';
	
	
	//init recursive directory iteratior
	$path		= new RecursiveDirectoryIterator( $data['path'] . $dir );
	
	
	//init recursive item iterator
	$objects	= new RecursiveIteratorIterator( $path, RecursiveIteratorIterator::SELF_FIRST );
	
	
	//cache preventor
	$date		= new DateTime();
	

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

					
				/*print $contents; exit; */
				
				
				break;

					
			}
			
			
			//print $data['first'] . ":" + $f . "<br/>";
			
			//check if a particular path should be included in the special 'top' array
			
			if (!empty($data['first']) && preg_match( '#' . preg_quote( implode( $data['first'] ) ) . '#', $f )) {
				
				//print "yes";	
				array_push($result_top, $item);
				
				
			} else {
				
				
				array_push($result, $item);	
				
				
			}

			
		}

	
	}
		

}



switch ($_GET['type']) {
	

case 'closure':

	
	array_unshift(
	
		$result_top,
	
		"// ==ClosureCompiler==",
		"// @output_file_name default.js",
		"// ==/ClosureCompiler=="
	
	);
	
	//$result = "// ==ClosureCompiler==\n// @output_file_name default.js\n" . $result . "// ==/ClosureCompiler==";

	
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