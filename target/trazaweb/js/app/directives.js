'use strict';

/* Directives */
    
var appDir = angular.module('ngprodusimpa.directives', []);

appDir.directive('myRefresh', function($location, $route){
    return function(scope, element, attrs) {
        element.bind('click', function(){
            if(element[0] && element[0].href && element[0].href === $location.absUrl()){
                $route.reload();
            }
        });
    };
});

appDir.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);

appDir.directive('dateTimePicker', function() {
	  return {
	    restrict: 'E',
	    replace: true,
	    scope: {
	      recipient: '='
	    },
	    template:
	      '<div>' +
	      '<input type="text" readonly data-date-format="yyyy-mm-dd hh:ii" name="recipientDateTime" data-date-time required>'+
	      '</div>',
	    link: function(scope, element, attrs, ngModel) {
	      var input = element.find('input');
	 
	      input.datetimepicker({
	        format: "mm/dd/yyyy hh:ii",
	        showMeridian: true,
	        autoclose: true,
	        todayBtn: true,
	        todayHighlight: true
	      });
	 
	      element.bind('blur keyup change', function(){
	        scope.recipient.datetime = input.val();
	      });
	    }
	  }
	});

appDir.directive('alertMessage', function() {
	  return {
		restrict: 'E',
		replace: true,
	    template:
	      '<div class="alert alert-success" ng-show="message != null">' +
	      '<a class="close" data-dismiss="alert">×</a>  '+
	      '<strong>{{message}}</strong>'+
	      '</div>'
	    
	  };
	});

appDir.directive('alertError', function() {
	  return {
		restrict: 'E',
		replace: true,
	    template:
	      '<div class="alert alert-danger" ng-show="error != null">' +
	      '<a class="close" data-dismiss="alert">×</a>  '+
	      '<strong>{{error}}</strong>'+
	      '</div>'
	  };
	});
	

