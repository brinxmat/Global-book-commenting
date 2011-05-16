/*

This software is provided as a demonstration of the concept of distributed 
FRBR-work-level book commenting, and consists of two parts: a Javascript, 
which identifies ISBNs and posts these to the second part, a web service 
in PHP which queries the OCLC xISBN web service.

The Javascript portion has two dependencies: jQuery 
<http://code.jquery.com/jquery-1.6.1.js> and 
<https://github.com/jamespadolsey/jQuery-Plugins/tree/master/cross-domain-ajax/>

To use it, just include the required libraries before the </body> tag and put 
<div id="disqus_thread"></div> somewhere in the body.

Copyright (C) 2011 by Rurik Thomas Greenall

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

//Set up the discussion forum, here, we're using Disqus; set the ID passed to this function as the comment ID
function setDisqusID(newId) {
  	var id = newId;
  	if (id != null){
		var disqus_shortname = 'isbntestlinks';
	    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
	    dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
	    var n = (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
	}
	else {
		alert("Failed to initialize commenting platform");
	}
}

//function scans for ISBN-10 and ISBN-13 in the body of a document returning any matches
(function matchISBN(){
	//match isbn-10 and isbn-13 with and without separators in the entire document text
	var re = [];
	re[0] = /\b(?=.{13})\d{1,5}(-| )\d{1,7}\1\d{1,6}\1[\dxX]\b/g;
	re[1] = /\b(?=.{17})\d{3}(-| )\d{1,5}\1\d{1,7}\1\d{1,6}\1[\d|xX]\b/g;
	re[2] = /\b(?=.{10})[0-9]{9}[\dxX]\b/;
	re[3] = /\b(?=.{13})[0-9]{12}[\d|xX]\b/;

	var match = [];
	for (var i = 0; i<re.length; i++) {
		m = document.body.innerHTML.match(re[i]); 
		if (m){
			match.push(m);
		}
	}

//Pass the matches to the web service that provides a work number, here, we're using the provided OCLC script
	if (match[0]){
		for (var i = 0; i<match.length; i++){
			var isbn = match[i];
			isbn = isbn[0].replace(/[-\s].*/i,"");
			url = 'oclc.php?isbn=' + escape(isbn);
//Try to retrieve the work ID
			$.ajax({
			    url: url,
			    type: 'GET',
			    success: function(res) {
				    if (res != null && typeof(res)=='object'){
				    	res = res.responseText;
				    }
				    var id = res;				
					if (id){
						disqus_identifier = id;
						setDisqusID(String(id));
						return 0;
					}
				}
			});
		}
	}
	else {
		alert ('Failed to find any ISBNs');
		return 1;
	}

//	return match;
})();
