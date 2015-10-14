'use strict';

/* Controllers */

var app = angular.module('ngprodusimpa.controllers');

app.controller('TrazaRemitoController', [
		'$scope',
		'$rootScope',
		'$routeParams',
		'$location',
		'$http',
		'SesionesControl',
		'MedicamentosARecepcionarFactory',
		function($scope, $rootScope, $routeParams, $location, $http,
				SesionesControl, MedicamentosARecepcionarFactory) {

			$rootScope.userSession = [];
			$rootScope.userSession.rol = SesionesControl.get('user.rol');
			$('#nroRemito').focus();
			$scope.nroRemito = "";
			$scope.submit = function() {
				$scope.message = null;
				$scope.error = null;
				bloquearVista("Procesando...", null);
				console.log($scope.nroRemito);
				MedicamentosARecepcionarFactory
						.findRemitoARecepcionar({
							'remito' : $scope.nroRemito
						}, function(data) {
							$rootScope.medicamentosRecepcionar = data;
							desbloquearVista();
							if (data == undefined || data == null || data == [] || data == ''){
								$scope.error = "No se encontro el remito: " + $scope.nroRemito ;
							}else{
								$location.path("/list_medicamento_recepcionar");
							}
						}, function(error) {
							$scope.error = error.data;
							desbloquearVista();
						});

			};

		} ]);
