<?php

class Download {

//a small class to wrap a CURL, it takes an array with two values: the hostname and the rest of the query
//returns data on success and false on fail

	function url($url){
		$session = curl_init($url);
	    curl_setopt($session, CURLOPT_RETURNTRANSFER,1);
	    curl_setopt($session, CURLOPT_FOLLOWLOCATION, TRUE);
		curl_setopt($session, CURLOPT_HTTPHEADER, array("Content-Type: application/rdf+xml"));
		$data = curl_exec($session);
		$responseHeader = curl_getinfo($session, CURLINFO_HTTP_CODE);
		curl_close($session);

		if ($responseHeader == 200){
			$return = $data;
		}
		else {
			$return = false;
		}
		unset($url);
		unset($session);
		unset($data);
		unset($responseHeader);
		return $return;
	}
}

//Using the xISBN service, get an OCLCNumber in order to return an OCLC Work ID
function getOWI($data){
//create instance of Download class and find an OCLC Number associated with the submitted isbn
	$d = new Download();
	$url = 'http://xisbn.worldcat.org/webservices/xid/isbn/'.urlencode($data).'?method=getEditions&format=xml&fl=oclcnum';
	$isbndata = $d->url($url);
//match the OCLC Number
	preg_match('/oclcnum="([^"\s]+)"/i',$isbndata,$m);
	if ($m[1]) {
//Request the metadata associated with the OCLC Number, including the OCLC Work Number; if found return this
		$owi = $d->url('http://xisbn.worldcat.org/webservices/xid/oclcnum/'.urlencode($m[1]).'?method=getMetadata&format=xml&fl=owi');
		preg_match('/owi="([^"]+)"/i',$owi,$m);
		if ($m[1]){echo $m[1];}
		else {return 0;}
	}
	else {return 0;}
	
}

getOWI(htmlspecialchars($_GET['isbn']));

?>

