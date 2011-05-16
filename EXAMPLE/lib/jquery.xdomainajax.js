/**
* jQuery.ajax mid - CROSS DOMAIN AJAX
* ---
* @author James Padolsey (http://james.padolsey.com)
* @version 0.11
* @updated 12-JAN-10
* ---
* Note: Read the README!
* ---
* @info http://james.padolsey.com/javascript/cross-domain-requests-with-jquery/
*/
jQuery.ajax=(function(_ajax){var protocol=location.protocol,hostname=location.hostname,exRegex=RegExp(protocol+'//'+hostname),YQL='http'+(/^https/.test(protocol)?'s':'')+'://query.yahooapis.com/v1/public/yql?callback=?',query='select * from html where url="{URL}" and xpath="*"';function isExternal(url){return!exRegex.test(url)&&/:\/\//.test(url);}
return function(o){var url=o.url;if(/get/i.test(o.type)&&!/json/i.test(o.dataType)&&isExternal(url)){o.url=YQL;o.dataType='json';o.data={q:query.replace('{URL}',url+(o.data?(/\?/.test(url)?'&':'?')+jQuery.param(o.data):'')),format:'xml'};if(!o.success&&o.complete){o.success=o.complete;delete o.complete;}
o.success=(function(_success){return function(data){if(_success){_success.call(this,{responseText:data.results[0].replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi,'')},'success');}};})(o.success);}
return _ajax.apply(this,arguments);};})(jQuery.ajax);