'use strict';

/* Controllers */

var app = angular.module('ngprodusimpa.controllers');

app.controller('MasterSamplePartController', ['$scope', '$rootScope', '$routeParams', '$location', '$http', 'SesionesControl', 'MasterSamplePartFactory', 
                                      function($scope, $rootScope, $routeParams, $location, $http, SesionesControl, MasterSamplePartFactory) {
	
	$rootScope.userSession     = [];
	$rootScope.userSession.rol = SesionesControl.get('user.rol');
	
	$scope.filters           = {};
	$scope.filters.historial = false;
	
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
				
				$scope.getMasterSampleParts();
				
			}, 100);
		};
	};

	var columnDefs = [{
		displayName : 'Fecha',
		cellTemplate: '<div>{{row.getProperty(col.field) | date:"dd/MM/yyyy"}}</div>',
		field : 'fechaDesde'
	}, {
		displayName : 'Nro. Chasis',
		cellTemplate: '<div>{{row.getProperty(col.field).nroChasis}}</div>',
		field:'rodado'
	}, {
		displayName : 'Descripción',
		field : 'descripcion'
	}, {
		displayName : 'Nro. Parte',
		field : 'nroParte'
	}, {
		displayName:'Proveedor', 
		field:'proveedor' 
	}, {
		displayName:'Proveedor Nro.', 
		field:'proveedorNro' 
	}, {
		displayName:'Fecha Hasta', 
		cellTemplate: '<div>{{row.getProperty(col.field) | date:"dd/MM/yyyy"}}</div>',
		field : 'fechaHasta'
	}, {
		field : '',
		width : 130,
		cellClass : 'grid-align',
		cellTemplate : '<a ng-click=show(row.entity)> <i class="fa fa-eye fa-2x"></i></a>'+
		               '<a ng-click=edit(row.entity)> <i class="fa fa-pencil-square-o  fa-2x"></i></a>'+
		               '<a ng-click=remove(row.entity)> <i class="fa fa-trash-o fa-2x"></i></a>'+
		               '<a ng-click=unLock(row.entity)> <i class="fa fa-unlock fa-2x"></i></a>'
	}];

	$scope.build_component_datagrid('masterSamplePartGrid', columnDefs);
	$scope['masterSamplePartGrid'].refresh();	
	
	$scope.changeHistorial = function (){
		$scope.filters.historial = !$scope.filters.historial;
		$scope['masterSamplePartGrid'].refresh();
	};
	
	$scope.clearfilters = function () {
		$scope.filters.fechaDesde = null;
		$scope.filters.fechaHasta = null;
		$scope.filters.nroChasis  = null;
		$scope.filters.historial  = false;
		$scope['masterSamplePartGrid'].refresh();
	};
	
	$scope.resetRodado = function (){
		$scope.masterSamplePart.rodado = null;
		$("#rodados_value").val("");
	};
	
	$scope.getMasterSampleParts = function (){
		$scope['masterSamplePartGrid']['items'] = MasterSamplePartFactory.query($scope.filters);	
	};
	
	$scope.create = function () {
		$scope.read    = false;
		$scope.message = null;
		$scope.error   = null;
		$scope.title = "Nuevo Master Sample Part";
		$scope.url = "partials/auditor/mastersample/modal-new.html";
		$scope.masterSamplePart = {};
  		$scope.ok_confirm = function(){
  			$scope.masterSamplePart.rodado = $scope.masterSamplePart.rodado.originalObject;
  			bloquearVista("Procesando...", null);
  			MasterSamplePartFactory.create($scope.masterSamplePart, 
			    function () {
  					$scope.message = "Registro creado correctamente.";
  					$scope['masterSamplePartGrid'].refresh();
  				    desbloquearVista();
				}, function (error){
					$scope.error = error.data;
					desbloquearVista();
			});
 		};
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.show = function(entity) {
		bloquearVista("Procesando...", null);
		$scope.read    = true;
		$scope.title = "Master Sample Part";
		$scope.url = "partials/auditor/mastersample/modal-new.html";
		$scope.masterSamplePart = entity;
		desbloquearVista();
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.edit = function (entity) {
		$scope.read    = false;
		$scope.message = null;
		$scope.error   = null;
		$scope.title = "Editar Master Sample Part";
		$scope.url = "partials/auditor/mastersample/modal-new.html";
		$scope.masterSamplePart = entity;
  		$scope.ok_confirm = function(){
  			if (isDefined($scope.masterSamplePart.rodado.originalObject)){
  				$scope.masterSamplePart.rodado = $scope.masterSamplePart.rodado.originalObject;
  			}
  			bloquearVista("Procesando...", null);
  			MasterSamplePartFactory.update($scope.masterSamplePart, 
			    function () {
  					$scope.message = "Registro actualizado correctamente.";
  					$scope['masterSamplePartGrid'].refresh();
  				    desbloquearVista();
				}, function (error){
					$scope.error = "Error al actualizar Master Sample Part";
					desbloquearVista();
			});
 		};
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.remove = function(entity){
		$scope.message = null;
		$scope.error   = null;
		$scope.title = "Eliminar Master Sample Part";
		$scope.url = "partials/modal-confirm.html";
		$scope.msg_confirm = "¿Esta seguro que desea eliminar Master Sample Part "+entity.rodado.nroChasis+" - "+entity.nroParte+"?";
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			MasterSamplePartFactory.remove(entity, 
			    function () {
  					$scope.message = "Registro eliminado correctamente.";
  					$scope['masterSamplePartGrid'].refresh();
  				    desbloquearVista();
				}, function (error){
					$scope.error = "Error al eliminar Master Sample Part.";
					desbloquearVista();
			});
 		};
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.unLock = function(entity){
		$scope.read    = false;
		$scope.message = null;
		$scope.error   = null;
		$scope.title = "Master Sample Part";
		$scope.url = "partials/auditor/mastersample/modal-unlock.html";
		$scope.msg_confirm = "¿Esta seguro que desea liberar Master Sample Part "+entity.rodado.nroChasis+" - "+entity.nroParte+"?";
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			entity.fechaHasta = new Date();
  			MasterSamplePartFactory.update(entity, 
			    function () {
  					$scope.message = "Registro liberado correctamente.";
  					$scope['masterSamplePartGrid'].refresh();
  				    desbloquearVista();
				}, function (error){
					$scope.error = "Error al liberar Master Sample Part.";
					desbloquearVista();
			});
 		};
		$rootScope.openModalConfirm($scope);
	};
	
}]);

