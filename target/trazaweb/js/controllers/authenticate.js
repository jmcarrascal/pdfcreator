var app = angular.module('ngprodusimpa.controllers');


app.controller('LoginController', ['$scope', '$rootScope', '$routeParams', '$location', '$http', 'LoginService', 'SesionesControl','PersistentControl', function($scope, $rootScope, $routeParams, $location, $http, LoginService,SesionesControl,PersistentControl) {
	$scope.login = function() {
		var userSanitized = $rootScope.sanitizeString($scope.username);
		var passSanitized = $rootScope.sanitizeString($scope.password); 
		LoginService.authenticate($.param({username: userSanitized, password: passSanitized}), 
				function(user) {
					SesionesControl.set('user.id', user.id);
					SesionesControl.set('user.rol', user.rol);
					PersistentControl.set('user.name', user.name);
					SesionesControl.setAuthenticated(true);
					
					$rootScope.username=user.name;			
					$location.path("/dashboard");
				}, 
				function (error){
					$rootScope.error="Fallo en la autenticación! Ingrese nuevamente su usuario y password";
					$location.path("/login");
				});
	};
	
}]);

app.controller('IndexController', ['$scope', '$rootScope','$location', 'SesionesControl', function ($scope, $rootScope, $location, SesionesControl){
	
	$rootScope.userSession     = [];
	$rootScope.userSession.rol =  SesionesControl.get('user.rol');
	if ($rootScope.isAuthenticated()== "false"){
		$location.path('/login');
	}
}]);