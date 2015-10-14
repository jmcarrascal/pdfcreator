'use strict';

/* Controllers */

var app = angular.module('ngprodusimpa.controllers');

app.controller('MecanicoController', ['$scope', '$rootScope', '$routeParams', '$location', '$http', 'SesionesControl', 'MecanicoFactory', function($scope, $rootScope, $routeParams, $location, $http, SesionesControl, MecanicoFactory) {
	
	$rootScope.userSession     = [];
	$rootScope.userSession.rol =  SesionesControl.get('user.rol');
	
	$scope.submit = function () {
		$scope.message = null;
		$scope.error   = null;
		bloquearVista("Procesando...", null);
		MecanicoFactory.findRodado($.param({ nroChasis: $scope.nroChasis }), 
				function (data) {
  		            if (!isDefined(data.id)){
  		            	$scope.error = "No existe ningún registro con el nro. de chasis: "+$scope.nroChasis;
  		            } else {
  		            	$scope.rodado = data;
  		            	$location.path('/mecanico/DETAIL/'+$scope.rodado.id);
  		            }
  		            desbloquearVista();
		       }, function (error){
		    	    $scope.error = "Ocurrió un error. Por favor, vuelva a intentarlo.";
		    	    desbloquearVista();
		       }
		);
	};
	
	if ($routeParams.accion == "DETAIL"){
		
		$scope.rodado = MecanicoFactory.findRodadoById($.param({ id: $routeParams.id }));
		
		$scope.addError = function () {
			$scope.message = null;
			$scope.error   = null;
			$scope.successSaveError = null;
			$scope.errorSaveError   = null;
			$scope.newErrorForm = false;
			$scope.errorResult  = new Object();
			$scope.rodadoError  = new Object();
			$scope.rodadoError.rodado  = new Object();
			$scope.rodadoError.usuario = new Object();
			$scope.rodadoError.rodado.id  = $scope.rodado.id;
			$scope.rodadoError.usuario.id = SesionesControl.get("user.id");
			$scope.title = "Nuevo Error";
			$scope.url = "partials/mecanico/error/modal-new.html";
	  		$scope.ok_confirm = function(){
	  			bloquearVista("Procesando...", null);
	  			$scope.rodadoError.error = $scope.errorResult.data.originalObject;
	  			MecanicoFactory.createRodadoError($scope.rodadoError, 
				    function () {
	  					$scope.message = "Registro creado correctamente.";
	  					$scope['verifErrorGrid'].refresh();
	  				    desbloquearVista();
					}, function (error){
						$scope.error = error.data;
						desbloquearVista();
				});
	 		};
			$rootScope.openModalConfirm($scope);
		};
		
		$scope.back = function () {
			$location.path('/mecanico');
		};
		
		$scope.cancelErrorNew = function () {
			$scope.newErrorForm = false;
			$scope.metodoVerificacionNew = new Object();
			$scope.metodoVerificacionNew.nombre = "";
		};
		
		$scope.saveErrorNew = function () {
			bloquearVista("Procesando...", null);
			MecanicoFactory.createError($scope.errorNew, 
				    function () {
	  					$scope.successSaveError = "Registro creado correctamente.";
	  					$scope.cancelErrorNew();
	  				    desbloquearVista();
					}, function (error){
						$scope.errorSaveError = error.data;
						desbloquearVista();
				});
		};
		
		$scope.removeError = function (entity) {
			$scope.message = null;
			$scope.error   = null;
			$scope.title = "Eliminar Error";
			$scope.url = "partials/modal-confirm.html";
			$scope.msg_confirm = "¿Esta seguro que desea eliminar el error "+entity.descrip+"?";
	  		$scope.ok_confirm = function(){
	  			bloquearVista("Procesando...", null);
	  			MecanicoFactory.removeError($.param({ idErrorRodado: entity.idErrorRodado }), 
				    function () {
	  					$scope.message = "Registro eliminado correctamente.";
	  					$scope['verifErrorGrid'].refresh();
	  				    desbloquearVista();
					}, function (error){
						$scope.error = "Error al eliminar Error.";
						desbloquearVista();
				});
	 		};
			$rootScope.openModalConfirm($scope);
		};
		
		$scope.correctError = function (entity) {
			$scope.message = null;
			$scope.error   = null;
			$scope.correccion = new Object();
			$scope.title = "Corregir Error";
			$scope.url = "partials/mecanico/modal-correct.html";
			$scope.msg_confirm = "¿Esta seguro que desea corregir el error "+entity.descrip+"?";
	  		$scope.ok_confirm = function(){
	  			entity.observacion = $scope.correccion.observacion;
	  			entity.usuario.id  = SesionesControl.get("user.id");
	  			bloquearVista("Procesando...", null);
	  			MecanicoFactory.correctError(entity,
				    function () {
	  					$scope.message = "Item corregido.";
	  					$scope['verifErrorGrid'].refresh();
	  				    desbloquearVista();
					}, function (error){
						$scope.error = "Error al corregir item.";
						desbloquearVista();
				});
	 		};
			$rootScope.openModalConfirm($scope);
		};
		
		$scope.addNewError = function () {
			$scope.successSaveError = null;
			$scope.errorSaveError   = null;
			$scope.newErrorForm = true;
			$scope.errorNew = new Object();
			$scope.cleanErrorResult();
		};
		
		$scope.cleanErrorResult = function () {
			$scope.errorResult = new Object();
			$scope.$broadcast('angucomplete-alt:clearInput', 'errores');
		};
		
		$scope.show = function (entity) {
			bloquearVista("Procesando...", null);
			$scope.item = new Object();
			if (entity.idVerificacion != null){
				MecanicoFactory.getVerificacion($.param({ id: entity.idVerificacion }),
					    function (data) {
					      $scope.item.rodado    = data.rodado;
					      $scope.item.checklist = data.checklist;
					      $scope.item.usuario   = data.usuario;
					      $scope.item.fecha     = data.fecha;
					      desbloquearVista();
		  		        }
				); 
			} else {
				MecanicoFactory.getRodadoError($.param({ id: entity.idErrorRodado }),
					    function (data) {
					      $scope.item.rodado  = data.rodado;
					      $scope.item.error   = data.error;
					      $scope.item.usuario = data.usuario;
					      $scope.item.fecha   = data.fecha;
						  desbloquearVista();
		  		        }
				); 
			}
			$scope.title = "Información Item";
			$scope.url   = "partials/mecanico/modal-view.html";
			$rootScope.openModalConfirm($scope);
		};
		
		$scope.idusuario = SesionesControl.get('user.id');
		
		$scope.build_component_datagrid = function(name, columns_datagrid) {
			$scope[name] = {};
			$scope[name]['items'] = [];

			// FILTERING
			$scope[name]['filterOptions'] = {
				filterText : '',
				useExternalFilter : false
			};

			// PAGING
			$scope[name]['totalServerItems'] = 0;
			$scope[name]['pagingOptions'] = {
				pageSizes : [10, 50, 100],
				pageSize : 10,
				currentPage : 1
			};

			// SORTING
			$scope[name]['sortOptions'] = {
				fields : [$scope[name].filterOptions.filterText],
				directions : ["ASC"]
			};

			$scope.mySelections = [];

			// GRID OPTIONS
			$scope[name].gridOptions = {
				data : name + ".items",
				columnDefs : columns_datagrid,
				rowHeight : 35,
				enablePaging : true,
				enablePinning : false,
				pagingOptions : $scope[name].pagingOptions,
				filterOptions : $scope[name].filterOptions,
				keepLastSelected : true,
				multiSelect : false,
				enableColumnReordering : 'true',
				showColumnMenu : true,
				showFilter : true,
				showGroupPanel : false,
				showFooter : false,
				sortInfo : $scope[name].sortOptions,
				totalServerItems : name + ".totalServerItems",
				useExternalSorting : false,
				i18n : "es",
				resizable : true,
				selectedItems : $scope.mySelections
			};

			//REFRESH GRID
			$scope[name].refresh = function() {
				setTimeout(function() {
					var sb = [];
					for (var i = 0; i < $scope[name].sortOptions.fields.length; i++) {
						sb.push($scope[name].sortOptions.directions[i] === "desc" ? "-" : "+");
						sb.push($scope[name].sortOptions.fields[i]);
					}
					var filter_field = $scope[name].filterOptions.filterText;
					var filter_value = '';
					if ($scope[name].filterOptions.filterColumn == undefined) {

					} else {
						filter_value = $scope[name].filterOptions.filterColumn.name;
					}
					var p = {
						'filter_field' : filter_value,
						'filter_value' : $scope[name].filterOptions.filterText,
						'pageNumber' : $scope[name].pagingOptions.currentPage,
						'pageSize' : $scope[name].pagingOptions.pageSize,
						'sortInfo' : sb.join("")
					};
					
					$scope[name]['items'] = MecanicoFactory.getVerifErrorByRodado($.param({ id: $routeParams.id }));
					
				}, 100);
			};
		};

		var columnDefs = [{
			displayName : 'Descripción',
			field : 'descrip'
		}, {
			displayName : 'Operador/Mécanico',
			cellTemplate: '<div>{{row.getProperty(col.field).apellido}}, {{row.getProperty(col.field).nombre}}</div>',
			field : 'usuario'
		}, {
			displayName : 'Fecha',
			cellTemplate: '<div>{{row.getProperty(col.field) | date:"dd/MM/yyyy h:mma"}}</div>',
			field : 'fecha'
		}, {
			displayName: '', 
			cellTemplate: '<div><i class="fa fa-times-circle-o fa-2x"></i></div>',
			field: '' 
		}, {
			field : '',
			width : 100,
			cellClass : 'grid-align',
			cellTemplate : '<a ng-click=show(row.entity)> <i class="fa fa-eye fa-2x"></i></a>'+
						   '<a ng-click=correctError(row.entity)> <i class="fa fa-check-square-o fa-2x"></i></a>'+
						   '<a ng-click=removeError(row.entity) ng-show="row.entity.idVerificacion == null && row.entity.usuario.id == idusuario"> <i class="fa fa-trash-o fa-2x"></i></a>'
				            
		}];

		$scope.build_component_datagrid('verifErrorGrid', columnDefs);
		$scope['verifErrorGrid'].refresh();
		
	}
	
}]);

