<?php

function replace_dangerous_char($filename, $strict = 'loose') {
	static $search  = array('/', '\\', '"', '\'', '?', '*', '>', '<', '|', ':', '$', '(', ')', '^', '[', ']', '#');
	static $replace = array('-', '-',  '-', '_',  '-', '-', '',  '-', '-', '-', '-', '-', '-', '-', '-', '-', '-');
	static $search_strict  = array('-');
	static $replace_strict = array('_');
	
	$filename = trim($filename);
	// Replacing other remaining dangerous characters.
	$filename = str_replace($search, $replace, $filename);
	if ($strict == 'strict') {
		$filename = str_replace($search_strict, $replace_strict, $filename);
		$filename = preg_replace('/[^0-9A-Za-z_.-]/', '', $filename);
	}
	// Length is limited, so the file name to be acceptable by some operating systems.
	return substr($filename, 0, 250);
}
function get_package_type($file_path, $file_name) {

	//get name of the zip file without the extension
	$file_info = pathinfo($file_name);
	$filename = $file_info['basename']; //name including extension
	$extension = $file_info['extension']; //extension only

	if (!empty($_POST['ppt2lp']) && !in_array(strtolower($extension), array(
				'dll',
				'exe'
			))) {
		return 'oogie';
	}
	if (!empty($_POST['woogie']) && !in_array(strtolower($extension), array(
				'dll',
				'exe'
			))) {
		return 'woogie';
	}

	$file_base_name = str_replace('.' . $extension, '', $filename); //filename without its extension
	
	require_once ("lib/pclzip/pclzip.lib.php");
	$zipFile = new pclZip($file_path);
	// Check the zip content (real size and file extension)
	$zipContentArray = $zipFile->listContent();
	$package_type = '';
	$at_root = false;
	$manifest = '';

	//the following loop should be stopped as soon as we found the right imsmanifest.xml (how to recognize it?)
	if (is_array($zipContentArray) && count($zipContentArray) > 0) {
		foreach ($zipContentArray as $thisContent) {
			if (preg_match('~.(php.*|phtml)$~i', $thisContent['filename'])) {
				//New behaviour: Don't do anything. These files will be removed in scorm::import_package
			} elseif (stristr($thisContent['filename'], 'imsmanifest.xml') !== FALSE) {
				$manifest = $thisContent['filename']; //just the relative directory inside scorm/
				$package_type = 'scorm';
				break; //exit the foreach loop
			} elseif (preg_match('/aicc\//i', $thisContent['filename']) != false || strtolower(pathinfo($thisContent['filename'], PATHINFO_EXTENSION)) == 'crs') {
				//if found an aicc directory... (!= false means it cannot be false (error) or 0 (no match))
				//or if a file has the .crs extension
				$package_type = 'aicc';
				//break;//don't exit the loop, because if we find an imsmanifest afterwards, we want it, not the AICC
			}
		}
	}
	return $package_type;
}
?>