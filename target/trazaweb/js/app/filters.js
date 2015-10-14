'use strict';

/* Filters */

var appDir = angular.module('ngprodusimpa.filters', []);

appDir.filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }]);


appDir.filter('formatDate',function(){
	return function(data){
		var result=formatDate(String(data));
		return result;};  
});

appDir.filter('titlecase', function () {
	return function(input) {
	    if (input != "") {
		var words=input.split(' ');
	    for (var i=0; i<words.length; i++) {
	      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
	    }
	    return words.join(' ');
	    } 
	else {return ""}
	 }
});