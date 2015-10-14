'use strict';

/* Controllers */

var app = angular.module('ngprodusimpa.controllers', []);
/*
 * var Date diaa; var Date diab;
 */

// Clear browser cache (in development mode)
// http://stackoverflow.com/questions/14718826/angularjs-disable-partial-caching-on-dev-machine
app.run(function ($rootScope, $templateCache) {
    $rootScope.$on('$viewContentLoaded', function () {
        // $templateCache.removeAll();
    });
});

app.controller('ModalConfirmCtrl', ['$scope', '$modalInstance', 'msg_confirm', function ($scope, $modalInstance, msg_confirm) {
	$scope.msg_confirm = msg_confirm;
	
	$scope.ok = function () {
	    $modalInstance.dismiss('ok');
	    
	  };
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);

app.controller('ModalDownloadCtrl', ['$scope', '$modalInstance', 'uri', 'filename', function ($scope, $modalInstance, uri, filename) {
	$scope.uri      = uri;
	$scope.filename = filename;
	
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);