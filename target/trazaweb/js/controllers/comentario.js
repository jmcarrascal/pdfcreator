'use strict';

/* Controllers */

var app = angular.module('ngprodusimpa.controllers');

app.controller('ComentarioController', ['$scope', '$rootScope', '$routeParams', '$location', '$http', 'SesionesControl', 'SupervisacionFactory', function($scope, $rootScope, $routeParams, $location, $http, SesionesControl, SupervisacionFactory) {
	
	$rootScope.userSession     = [];
	$rootScope.userSession.rol =  SesionesControl.get('user.rol');
	
	$scope.verificacion = SupervisacionFactory.getVerificacion($.param({ id: $routeParams.id })); 
	
	$scope.create = function () {
		$scope.read    = false;
		$scope.message = null;
		$scope.error   = null;
		$scope.verificacionObservacion = new Object;
		$scope.verificacionObservacion.verificacion = new Object();
		$scope.verificacionObservacion.usuario = new Object();
		$scope.verificacionObservacion.verificacion.id = $routeParams.id;
		$scope.verificacionObservacion.usuario.id = SesionesControl.get("user.id");
		$scope.title = "Nueva Observación";
		$scope.url = "partials/supervisacion/comentario/modal-new.html";
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			SupervisacionFactory.createVerificacionObservacion($scope.verificacionObservacion, 
			    function () {
  					$scope.message = "Registro creado correctamente.";
  					$scope['observacionGrid'].refresh();
  				    desbloquearVista();
				}, function (error){
					$scope.error = error.data;
					desbloquearVista();
			});
 		};
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.show = function(entity){
		$scope.read    = true;
		$scope.message = null;
		$scope.error   = null;
		$scope.verificacionObservacion = entity;
		$scope.title = "Ver Observación";
		$scope.url   = "partials/supervisacion/comentario/modal-new.html";
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.edit = function(entity){
		$scope.read    = false;
		$scope.message = null;
		$scope.error   = null;
		$scope.verificacionObservacion = entity;
		$scope.verificacionObservacion.usuario = new Object();
		$scope.verificacionObservacion.usuario.id = SesionesControl.get("user.id");
		$scope.title = "Editar Observación";
		$scope.url   = "partials/supervisacion/comentario/modal-new.html";
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			SupervisacionFactory.updateVerificacionObservacion($scope.verificacionObservacion, 
			    function () {
  					$scope.message = "Registro actualizado correctamente.";
  					$scope['observacionGrid'].refresh();
  				    desbloquearVista();
				}, function (error){
					$scope.error = "Error al actualizar Observación.";
					$scope['observacionGrid'].refresh();
					desbloquearVista();
			});
 		};
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.back = function () {
		$location.path('/supervisacion/DETAIL/'+$scope.verificacion.rodado.id);
	};
	
	$scope.remove = function(entity){
		$scope.message = null;
		$scope.error   = null;
		$scope.title = "Eliminar Observación";
		$scope.url = "partials/modal-confirm.html";
		$scope.msg_confirm = "¿Esta seguro que desea eliminar la observación "+entity.observacion+"?";
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			SupervisacionFactory.removeVerificacionObservacion(entity, 
			    function () {
  					$scope.message = "Registro eliminado correctamente.";
  					$scope['observacionGrid'].refresh();
  				    desbloquearVista();
				}, function (error){
					$scope.error = "Error al eliminar Observación.";
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
				
				$scope[name]['items'] = SupervisacionFactory.getObservacionesByVerificacion($.param({ id: $routeParams.id }));
				
			}, 100);
		};
	};

	var columnDefs = [{
		displayName : 'Observación',
		field : 'observacion'
	}, {
		displayName : 'Supervisor', 
		cellTemplate: '<div>{{row.getProperty(col.field).apellido}}, {{row.getProperty(col.field).nombre}}</div>',
		field : 'usuario'
	}, {
		displayName : 'Fecha', 
		cellTemplate: '<div>{{row.getProperty(col.field) | date:"dd/MM/yyyy h:mma"}}</div>',
		field : 'fecha'
	}, {
		field : '',
		width : 100,
		cellClass : 'grid-align',
		cellTemplate : '<a ng-click=show(row.entity)> <i class="fa fa-eye fa-2x"></i></a>'+
		               '<a ng-click=edit(row.entity)> <i class="fa fa-pencil-square-o  fa-2x"></i></a>'+
			           '<a ng-click=remove(row.entity)> <i class="fa fa-trash-o fa-2x"></i></a>'
	}];

	$scope.build_component_datagrid('observacionGrid', columnDefs);
	$scope['observacionGrid'].refresh();
	
}]);

