'use strict';

/* Controllers */

var app = angular.module('ngprodusimpa.controllers');

app.controller('VerificacionController', ['$scope', '$rootScope', '$routeParams', '$location', '$http', 'SesionesControl', 'VerificacionFactory', function($scope, $rootScope, $routeParams, $location, $http, SesionesControl, VerificacionFactory) {
	
	$rootScope.userSession     = [];
	$rootScope.userSession.rol =  SesionesControl.get('user.rol');
	
	$scope.submit = function () {
		$scope.message = null;
		$scope.error   = null;
		bloquearVista("Procesando...", null);
		VerificacionFactory.findOrCreate($.param({ nroChasis: $scope.nroChasis, idusuario: SesionesControl.get('user.id') }), 
				function (data) {
  		            $scope.rodado  = data.rodado;
  		            $scope.puestos = data.puestos;
  		            if (data.puestos.length == 0){
  		            	$scope.error = "No tiene asignado ningún puesto válido para el nro. de chasis: "+$scope.nroChasis;
  		            } else {
  		            	$scope.codigoSelected    = {};
  		            	$scope.codigoSelected.id = null;
  		            	$scope.puestoSelected    = {};
	            		$scope.puestoSelected.id      = data.puestos[0].id;
	            		$scope.lineaProduccionCodigos = data.puestos[0].lineaProduccion.lineaProduccionCodigos;
  		            	$scope.title = "Puesto";
  		            	$scope.url = "partials/verificacion/modal-puesto.html";
  		            	$scope.ok_confirm = function(){
  		            		$scope.confirmPuesto();
  		            	};
  		            	$rootScope.openModalConfirm($scope);
  		            }
  		            desbloquearVista();
		       }, function (error){
		    	    $scope.error = "Ocurrió un error. Por favor, vuelva a intentarlo.";
		    	    desbloquearVista();
		       }
		);
	};
	
	$scope.getCodigosLineaProduccion = function() {
		angular.forEach($scope.puestos, function(puesto, key) {
	        if (puesto.id == $scope.puestoSelected.id){
	        	$scope.lineaProduccionCodigos = puesto.lineaProduccion.lineaProduccionCodigos;
	        	$scope.codigoSelected    = {};
	        	$scope.codigoSelected.id = null;
	        }
		});
	};
	
	$scope.getPuestoSelected = function() {
		angular.forEach($scope.puestos, function(puesto, key) {
	        if (puesto.id == $scope.puestoSelected.id){
	        	$scope.puesto = puesto;
	        }
		});
	};
	
	$scope.setCodigoSelected = function(){
		angular.forEach($scope.lineaProduccionCodigos, function(lpc, key) {
	        if (lpc.codigo.id == $scope.codigoSelected.id){
	        	$scope.codigoSelected.descripcion = lpc.codigo.descripcion;
	        }
		});
	};
	
	$scope.getCodigoRodado = function() {
		if (isDefined($scope.rodado.codigo) && isDefined($scope.rodado.codigo.descripcion)){
			return $scope.rodado.codigo.descripcion;
		} else {
			return $scope.codigoSelected.descripcion;
		}
	};
	
	$scope.confirmPuesto = function () {
		$scope.getPuestoSelected();
  		bloquearVista("Procesando...", null);
  		$scope.checklistVerificados = [];
  		VerificacionFactory.getChecklistByPuesto($.param({ idPuesto: $scope.puestoSelected.id }),
  				function (data){
  			        $scope.checklistList = data;
  			        if ($scope.checklistList.length > 0){
  			        	$scope.indiceActual = 0;
  			        	$scope.indiceFinal  = $scope.checklistList.length-1;
  			        	$scope.checklistAct = $scope.checklistList[$scope.indiceActual];
  			        	$scope.title = "Puesto: "+$scope.puesto.orden+" - "+$scope.puesto.nombre+" Etapa: "+$scope.checklistAct.etapa+" - Nro. Chasis: "+$scope.nroChasis+" - "+$scope.getCodigoRodado();
  			        	$scope.url = "partials/verificacion/modal-checklist.html";
  			        	$rootScope.openModalConfirm($scope);
  			        } else {
  			        	$scope.error = "El puesto seleccionado no tiene ningún checklist asociado";
  			        }
  			        desbloquearVista();
  		        }
  		);
	};
	 	
  	$scope.btnCheck = function (ok) {
  		bloquearVista("Procesando...", null);
  		var verificacion = new Object();
		verificacion.idchecklist = $scope.checklistAct.id;
		verificacion.ok = ok;
		$scope.checklistVerificados.push(verificacion);
		if ($scope.indiceActual < $scope.indiceFinal){
		    $scope.indiceActual++;
		    $scope.checklistAct = $scope.checklistList[$scope.indiceActual];
		    desbloquearVista();
		    $rootScope.openModalConfirm($scope);
		} else {
			desbloquearVista();
			$scope.finalizarPuesto();
		}
  	};
	
  	$scope.finalizarPuesto = function () {
  		$scope.title = "Puesto: "+$scope.puesto.orden+" - "+$scope.puesto.nombre;
    	$scope.url   = "partials/verificacion/modal-confirm.html";
    	$scope.msg_confirm = "¿Desea finalizar?";
    	if ($scope.puesto.checkInfo){
    		$scope.msg_confirm = "¿Desea finalizar? Por favor complete los siguientes campos:";
    	} 
    	$scope.ok_confirm  = function(){
    		bloquearVista("Procesando...", null);
    		var verifPuestoRodado = new Object();
    		verifPuestoRodado.checklists  = $scope.checklistVerificados; 
    		verifPuestoRodado.rodado      = $scope.rodado;
    		verifPuestoRodado.puesto      = $scope.puesto;
    		verifPuestoRodado.idusuario   = SesionesControl.get("user.id");
    		verifPuestoRodado.checkCodigo = false;
    		if ($scope.codigoSelected.id != null){
    			verifPuestoRodado.checkCodigo   = true;
    			verifPuestoRodado.rodado.codigo = $scope.codigoSelected;
    		}
    		
  			VerificacionFactory.save(verifPuestoRodado, 
			    function () {
  					$scope.message   = "Puesto Finalizado correctamente. Número de Chasis "+$scope.nroChasis;
  					$scope.nroChasis = null;
  				    desbloquearVista();
				}, function (error){
					$scope.errorCheckInfo = "Error al finalizar Puesto.";
					desbloquearVista();
			});
 		};
 		$rootScope.openModalConfirm($scope);
  	};
  	
	$scope.$watch('rodado.nroMotor', function () {
    	if (isDefined($scope.rodado) && isDefined($scope.rodado.nroMotor) && ($scope.rodado.nroMotor !== "")) {
    		VerificacionFactory.getRodadoByMotor($.param({ nroMotor: $scope.rodado.nroMotor }), function (data) {
    			if (isDefined(data.id)){
    				$scope.errorCheckInfoMotor = "El número de Motor ya existe!";
    				$scope.validateInfoMotor   = null;
    			} else {
    				$scope.errorCheckInfoMotor = null;
    				$scope.validateInfoMotor   = true;
    			}
    		});
        } 
    });
	
	$scope.$watch('rodado.nroLlave', function () {
    	if (isDefined($scope.rodado) && isDefined($scope.rodado.nroLlave) && ($scope.rodado.nroLlave !== "")) {
    		VerificacionFactory.getRodadoByLlave($.param({ nroLlave: $scope.rodado.nroLlave }), function (data) {
    			if (isDefined(data.id)){
    				$scope.errorCheckInfoLlave = "El número de Llave ya existe!";
    				$scope.validateInfoLLave   = null;
    			} else {
    				$scope.errorCheckInfoLlave = null;
    				$scope.validateInfoLLave   = true;
    			}
    		});
        } 
    });
  	
}]);

