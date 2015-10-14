'use strict';

/* Controllers */

var app = angular.module('ngprodusimpa.controllers');

app.controller('SupervisacionController', ['$scope', '$rootScope', '$routeParams', '$location', '$http', 'SesionesControl', 'SupervisacionFactory', function($scope, $rootScope, $routeParams, $location, $http, SesionesControl, SupervisacionFactory) {
	
	$rootScope.userSession     = [];
	$rootScope.userSession.rol =  SesionesControl.get('user.rol');
	
	$scope.submit = function () {
		$scope.message = null;
		$scope.error   = null;
		bloquearVista("Procesando...", null);
		SupervisacionFactory.findRodado($.param({ nroChasis: $scope.nroChasis }), 
				function (data) {
  		            if (!isDefined(data.id)){
  		            	$scope.error = "No existe ningún registro con el nro. de chasis: "+$scope.nroChasis;
  		            } else {
  		            	$scope.rodado = data;
  		            	$location.path('/supervisacion/DETAIL/'+$scope.rodado.id);
  		            }
  		            desbloquearVista();
		       }, function (error){
		    	    $scope.error = "Ocurrió un error. Por favor, vuelva a intentarlo.";
		    	    desbloquearVista();
		       }
		);
	};
	
	if ($routeParams.accion == "DETAIL"){
		
		$scope.rodado = SupervisacionFactory.findRodadoById($.param({ id: $routeParams.id }));
		
		$scope.show = function (entity) {
			$scope.verificacion  = entity;
			$scope.title = "Nro. de Chasis: "+entity.rodado.nroChasis+" - Nro de Motor: "+entity.rodado.nroMotor;
			$scope.url = "partials/supervisacion/modal-view.html";
			$rootScope.openModalConfirm($scope);
		};
		
		$scope.viewComments = function (entity) {
			$location.path('/comentario/'+entity.id);
		};
		
		$scope.addComment = function (entity) {
			$scope.read    = false;
			$scope.message = null;
			$scope.error   = null;
			$scope.verificacionObservacion = new Object;
			$scope.verificacionObservacion.verificacion = new Object();
			$scope.verificacionObservacion.usuario = new Object();
			$scope.verificacionObservacion.verificacion.id = entity.id;
			$scope.verificacionObservacion.usuario.id = SesionesControl.get("user.id");
			$scope.title = "Nueva Observación";
			$scope.url = "partials/supervisacion/comentario/modal-new.html";
	  		$scope.ok_confirm = function(){
	  			bloquearVista("Procesando...", null);
	  			SupervisacionFactory.createVerificacionObservacion($scope.verificacionObservacion, 
				    function () {
	  					$scope.message = "Registro creado correctamente.";
	  				    desbloquearVista();
					}, function (error){
						$scope.error = error.data;
						desbloquearVista();
				});
	 		};
			$rootScope.openModalConfirm($scope);
		};
		
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
					
					$scope.getVerificaciones();
					
				}, 100);
			};
		};

		var columnDefs = [{
			displayName : 'Parámetro',
			field : 'checklist.parametro'
		}, {
			displayName : 'Especificaciones',
			field : 'checklist.especificacions'
		}, {
			displayName : 'Criterio de Aceptación',
			field : 'checklist.criterioAceptacion'
		}, {
			displayName:'OK', cellTemplate: '<div ng-show="row.getProperty(col.field) == true"><i class="fa fa-check-circle-o fa-2x"></i></div><div ng-show="row.getProperty(col.field) == false"><i class="fa fa-times-circle-o fa-2x"></i></div>',
			field:'ok' 
		}, {
			field : '',
			width : 100,
			cellClass : 'grid-align',
			cellTemplate : '<a ng-click=show(row.entity)> <i class="fa fa-eye fa-2x"></i></a>'+
						   '<a ng-click=viewComments(row.entity)> <i class="fa fa-comments-o fa-2x"></i></a>'+
						   '<a ng-click=addComment(row.entity)> <i class="fa fa-comment-o fa-2x"></i></a>'
				            
		}];

		$scope.build_component_datagrid('verificacionGrid', columnDefs);
		$scope['verificacionGrid'].refresh();
		
		$scope.back = function () {
			$location.path('/supervisacion');
		};
		
		$scope.filterVerificaionCheck = function (ok) {
			$scope.ok = ok;
			$scope['verificacionGrid'].refresh();
		};
		
		$scope.clearfilterVerificaionCheck = function () {
			$scope.ok = undefined;
			$scope['verificacionGrid'].refresh();
		};
		
		$scope.getVerificaciones = function (){
			if (isDefined($scope.ok)){
				$scope['verificacionGrid']['items'] = SupervisacionFactory.getVerificacionesByRodado($.param({ id: $routeParams.id, ok: $scope.ok }));
			} else {
				$scope['verificacionGrid']['items'] = SupervisacionFactory.getVerificacionesByRodado($.param({ id: $routeParams.id }));	
			}
		};
	}
	
}]);

