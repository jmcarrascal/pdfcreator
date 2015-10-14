'use strict';

/* Controllers */

var app = angular.module('ngprodusimpa.controllers');

app.controller('ChecklistController', ['$scope', '$rootScope', '$routeParams', '$location', '$http', 'PuestoFactory', 'ChecklistFactory', 'MetodoVerificacionFactory', 'SesionesControl', 
                                    function($scope, $rootScope, $routeParams, $location, $http, PuestoFactory, ChecklistFactory, MetodoVerificacionFactory, SesionesControl) {
	
	$rootScope.userSession     = [];
	$rootScope.userSession.rol =  SesionesControl.get('user.rol');
	
	PuestoFactory.show({ id: $routeParams.id }, function(data){
		$scope.puesto = data;
		
		$scope.back = function(){
    		$location.path('/lineaproduccion/DETAIL/'+$scope.puesto.lineaProduccion.id);
    	};
	});
	
	MetodoVerificacionFactory.all({}, function (data){
    	$scope.metodosVerificacion = data;
    });
	
	$scope.create = function () {
		$scope.read = false;
		$scope.message = null;
		$scope.error   = null;
		$scope.messageMetodoVerificacion = null;
		$scope.errorMetodoVerificacion   = null;
		$scope.metodoVerificacionNew     = new Object();
		$scope.metodoVerificacionNew.descripcion = "";
		$scope.checklist = new Object;
		$scope.checklist.puesto             = $scope.puesto;
		$scope.checklist.metodoVerificacion = new Object();
		$scope.checklist.frecuencia         = 100;
		$scope.newMetodoVerificacionForm    = false;
		
		$scope.title = "Nuevo Checklist";
		$scope.url = "partials/checklist/modal-new.html";
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			ChecklistFactory.create($scope.checklist, 
			    function () {
  					$scope.message = "Registro creado correctamente.";
  					$scope['checklistGrid'].refresh();
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
		$scope.title = "Eliminar Checklist";
		$scope.url = "partials/modal-confirm.html";
		$scope.msg_confirm = "¿Esta seguro que desea eliminar el checklist "+entity.etapa+" - "+entity.parametro+"?";
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			ChecklistFactory.remove(entity, 
			    function () {
  					$scope.message = "Registro eliminado correctamente.";
  					$scope['checklistGrid'].refresh();
  				    desbloquearVista();
				}, function (error){
					$scope.error = "Error al eliminar Checklist. Tiene verificaciones asociadas.";
					desbloquearVista();
			});
 		};
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.edit = function(entity){
		$scope.read = false;
		$scope.message = null;
		$scope.error   = null;
		$scope.messageMetodoVerificacion = null;
		$scope.errorMetodoVerificacion   = null;
		$scope.metodoVerificacionNew     = new Object();
		$scope.metodoVerificacionNew.descripcion = "";
		$scope.checklist = entity;
		
		$scope.title = "Editar Checklist";
		$scope.url = "partials/checklist/modal-new.html";
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			ChecklistFactory.update($scope.checklist, 
			    function () {
  					$scope.message = "Registro actualizado correctamente.";
  					$scope['checklistGrid'].refresh();
  				    desbloquearVista();
				}, function (error){
					$scope.error = "Error al actualizar Checklist.";
					$scope['checklistGrid'].refresh();
					desbloquearVista();
			});
 		};
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.show = function(entity){
		$scope.read = true;
		$scope.message = null;
		$scope.error   = null;
		$scope.messageMetodoVerificacion = null;
		$scope.errorMetodoVerificacion   = null;
		$scope.checklist = entity;
		$scope.title = "Checklist - Etapa: "+entity.etapa+" - Parámetro: "+entity.parametro;
		$scope.url = "partials/checklist/modal-new.html";
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.newMetodoVerificacion = function(){
		$scope.messageMetodoVerificacion = null;
		$scope.errorMetodoVerificacion   = null;
		$scope.newMetodoVerificacionForm = true;
	};
	
	$scope.saveMetodoVerificacion = function(){
		$scope.messageMetodoVerificacion = null;
		$scope.errorMetodoVerificacion   = null;
		MetodoVerificacionFactory.create($scope.metodoVerificacionNew, 
			    function (response) {
					$scope.metodoVerificacionNew.nombre = "";
					$scope.messageMetodoVerificacion = "Método de Verificación creado correctamente.";
					$scope.newMetodoVerificacionForm = false;
					$scope.checklist.metodoVerificacion.id = response.id;
					MetodoVerificacionFactory.all({}, function (data){
				    	$scope.metodosVerificacion = data;
				    });
  				    desbloquearVista();
				}, function (error){
					$scope.errorMetodoVerificacion = error.data;
					desbloquearVista();
		});
	};
	
	$scope.cancelMetodoVerificacion = function(){
		$scope.metodoVerificacionNew.nombre = "";
		$scope.newMetodoVerificacionForm = false;
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
				
				$scope[name]['items'] = ChecklistFactory.getAllByPuesto($.param({ idPuesto: $routeParams.id }));
				
			}, 100);
		};
	};

	var columnDefs = [{
		displayName : 'Etapa',
		field : 'etapa'
	}, {
		displayName : 'Grado',
		field : 'grado'
	}, {
		displayName : 'Parámetro',
		field : 'parametro'
	}, {
		displayName : 'Especificaciones',
		field : 'especificaciones'
	}, {
		displayName : 'Criterio Aceptación',
		field : 'criterioAceptacion'
	}, {
		displayName : 'Método Verificación',
		field : 'metodoVerificacion.nombre'
	}, {
		displayName : 'Frecuencia',
		field : 'frecuencia'
	}, {
		field : '',
		width : 100,
		cellClass : 'grid-align',
		cellTemplate : '<a ng-click=show(row.entity)> <i class="fa fa-eye fa-2x"></i></a>'+
		               '<a ng-click=edit(row.entity)> <i class="fa fa-pencil-square-o  fa-2x"></i></a>'+
			           '<a ng-click=remove(row.entity)> <i class="fa fa-trash-o fa-2x"></i></a>'
	}];

	$scope.build_component_datagrid('checklistGrid', columnDefs);
	$scope['checklistGrid'].refresh();
	
}]);

