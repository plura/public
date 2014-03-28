<?php if (!isset($_GET['json'])) { ?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>

<script src="p.js/src/constants.js"></script>
<script src="p.js/src/core/Loader.js"></script>
<script src="p.js/src/event/Touch.js"></script>
<script src="p.js/src/form/Form.js"></script>
<script src="p.js/src/form/FormManager.js"></script>
<script src="p.js/src/form/Upload.js"></script>
<script src="p.js/src/form/upload/File.js"></script>
<script src="p.js/src/fx/Center.js"></script>
<script src="p.js/src/fx/Parallax.js"></script>
<script src="p.js/src/fx/Resize.js"></script>
<script src="p.js/src/layout/LoaderBar.js"></script>
<script src="p.js/src/layout/Nav.js"></script>
<script src="p.js/src/layout/ProgressBar.js"></script>
<script src="p.js/src/layout/Refresh.js"></script>
<script src="p.js/src/layout/Slideshow.js"></script>
<script src="p.js/src/layout/Social.js"></script>
<script src="p.js/src/layout/Table.js"></script>
<script src="p.js/src/media/Audio.js"></script>
<script src="p.js/src/media/Video.js"></script>
<script src="p.js/src/net/Client.js"></script>
<script src="p.js/src/net/URLManager.js"></script>
<script src="p.js/src/templates/alert/Slide.js"></script>
<script src="p.js/src/templates/structures/Content.js"></script>
<script src="p.js/src/templates/structures/Menu.js"></script>
<script src="p.js/src/templates/structures/Tabs.js"></script>
<script src="p.js/src/utils/Cache.js"></script>
<script src="p.js/src/utils/Extend.js"></script>
<script src="p.js/src/utils/Flat.js"></script>
<script src="p.js/src/utils/Hidden.js"></script>
<script src="p.js/src/utils/String.js"></script>


<script src="tree.path.js"></script>
<script src="tree.js"></script>

<style type="text/css"><!--

label, select								{ font: normal 14px Arial, Helvetica, sans-serif; }

label, input[type=radio], select, fieldset	{ float:left; }

fieldset									{ border:none; }

label										{ margin: 0 10px 0 0; }

select										{ width: 200px; }

input[type=radio], select					{ margin: 0 50px 0 0; }

.result 									{ width: 900px; height: 600px; position:absolute; top:100px; left:100px; z-index:auto; border:1px solid #000; }

--></style>
</head>

<body>
</body>
</html>

<?php } else {
	
    $result		= "";
	
	foreach($_GET['data'] as $data) {
	
		//check if dir exists
		$dir		= isset($data['dir']) ? '/' . $data['dir'] : '';
	
		//init recursive directory iteratior
		$path		= new RecursiveDirectoryIterator($data['path'] . $dir);
	
		//init recursive item iterator
		$objects	= new RecursiveIteratorIterator($path, RecursiveIteratorIterator::SELF_FIRST);
	
		//cache preventor
		$date		= new DateTime();

		//iterate!
		foreach($objects as $name => $object){
		
			if (pathinfo($name, PATHINFO_EXTENSION) === 'js') {

				$f = preg_replace("/\\\/", '/', $name);
			
				$f = preg_replace("/" . preg_quote($path->getPath() . '/', '/') . "/", '', $f);
			
				switch ($_GET['type']) {
					
				case 'closure':
				
					$f = "// @code_url " . $data['prefix'] . $f . "?" . $date->getTimestamp() . "\n";
					
					break;
					
				case 'script':
				
					$f = "<script src=\"" . $data['prefix'] . $f . "\"></script>\n";
					
					break;
					
				case 'join':
					
					$filename	= $path->getPath() . $f;
					
					$handle		= fopen($filename, "r");
					
					$f	= fread($handle, filesize($filename)) . "\n\n\n";
					
					fclose($handle);
					
					/*print $contents;
					
				
				
				
					exit;
				*/
				
				
					break;
					
				}
			

				$result	.= $f;
			
			}
	
		}
		
		
	
	}
	

	if ($_GET['type'] === 'closure') {
		
		$result = "// ==ClosureCompiler==\n// @output_file_name default.js\n" . $result . "// ==/ClosureCompiler==";
		
	}
	
	print json_encode(array('items' => $result, 'success' => 1));

} ?>