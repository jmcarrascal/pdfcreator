'use strict';

/* Controllers */

var app = angular.module('ngprodusimpa.controllers');

app.controller('MetodoVerificacionController', ['$scope', '$rootScope', '$routeParams', '$location', '$http', 'MetodoVerificacionFactory', 'SesionesControl', function($scope, $rootScope, $routeParams, $location, $http, MetodoVerificacionFactory, SesionesControl) {
	
	$rootScope.userSession     = [];
	$rootScope.userSession.rol =  SesionesControl.get('user.rol');
	
	$scope.create = function () {
		$scope.read    = false;
		$scope.message = null;
		$scope.error   = null;
		$scope.metodoVerificacion = new Object;
		$scope.title = "Nuevo Método Verificación";
		$scope.url = "partials/metodoverif/modal-new.html";
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			MetodoVerificacionFactory.create($scope.metodoVerificacion, 
			    function () {
  					$scope.message = "Registro creado correctamente.";
  					$scope['metodoVerificacionGrid'].refresh();
  				    desbloquearVista();
				}, function (error){
					$scope.error = error.data;
					desbloquearVista();
			});

 		};
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.remove = function(entity){
		$scope.message = null;
		$scope.error   = null;
		$scope.title = "Eliminar Método Verificación";
		$scope.url = "partials/modal-confirm.html";
		$scope.msg_confirm = "¿Esta seguro que desea eliminar el Método de Verificación "+entity.nombre+"?";
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			MetodoVerificacionFactory.remove(entity, 
			    function () {
  					$scope.message = "Registro eliminado correctamente.";
  					$scope['metodoVerificacionGrid'].refresh();
  				    desbloquearVista();
				}, function (error){
					$scope.error = "Error al eliminar Método de Verificación. Tiene Checklist asociados";
					desbloquearVista();
			});
 		};
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.edit = function(entity){
		$scope.read    = false;
		$scope.message = null;
		$scope.error   = null;
		$scope.metodoVerificacion = entity;
		$scope.title = "Editar Método Verificación";
		$scope.url = "partials/metodoverif/modal-new.html";
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			MetodoVerificacionFactory.update($scope.metodoVerificacion, 
			    function () {
  					$scope.message = "Registro actualizado correctamente.";
  					$scope['metodoVerificacionGrid'].refresh();
  				    desbloquearVista();
				}, function (error){
					$scope.error = "Error al actualizar Método de Verificación.";
					$scope['metodoVerificacionGrid'].refresh();
					desbloquearVista();
			});
 		};
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.show = function(entity){
		$scope.read    = true;
		$scope.message = null;
		$scope.error   = null;
		$scope.metodoVerificacion = entity;
		$scope.title = "Método Verificación - "+entity.nombre;
		$scope.url = "partials/metodoverif/modal-new.html";
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
			showColumnMenu : false,
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
				
				$scope[name]['items'] = MetodoVerificacionFactory.all();
				
			}, 100);
		};
	};

	var columnDefs = [{
		displayName : 'Nombre',
		field : 'nombre'
	}, {
		displayName : 'Descripción',
		field : 'descripcion'
	},{
		field : '',
		width : 100,
		cellClass : 'grid-align',
		cellTemplate : '<a ng-click=show(row.entity)> <i class="fa fa-eye fa-2x"></i></a>'+
		               '<a ng-click=edit(row.entity)> <i class="fa fa-pencil-square-o  fa-2x"></i></a>'+
			           '<a ng-click=remove(row.entity)> <i class="fa fa-trash-o fa-2x"></i></a>'
	}];

	$scope.build_component_datagrid('metodoVerificacionGrid', columnDefs);
	$scope['metodoVerificacionGrid'].refresh();
	
}]);

