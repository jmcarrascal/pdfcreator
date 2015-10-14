'use strict';

/* Controllers */

var app = angular.module('ngprodusimpa.controllers');

app.controller('PuestoController', ['$scope', '$rootScope', '$routeParams', '$location', '$http', 'LineaProduccionFactory', 'PuestoFactory', 'SesionesControl',
                                    function($scope, $rootScope, $routeParams, $location, $http, LineaProduccionFactory, PuestoFactory, SesionesControl) {
	
	$rootScope.userSession     = [];
	$rootScope.userSession.rol =  SesionesControl.get('user.rol');
	
	$scope.lineaProduccion = LineaProduccionFactory.show({ id: $routeParams.id });
	
	$scope.create = function () {
		$scope.read = false;
		$scope.message = null;
		$scope.error   = null;
		$scope.puesto = new Object;
		$scope.puesto.lineaProduccion = $scope.lineaProduccion;
		$scope.puesto.descripcion = "";
		$scope.title = "Nuevo Puesto";
		$scope.url = "partials/puesto/modal-new.html";
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			PuestoFactory.create($scope.puesto, 
			    function () {
  					$scope.message = "Registro creado correctamente.";
  					$scope['puestoGrid'].refresh();
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
		$scope.title = "Eliminar Puesto";
		$scope.url = "partials/modal-confirm.html";
		$scope.msg_confirm = "¿Esta seguro que desea eliminar el puesto "+entity.orden+" - "+entity.nombre+"?";
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			PuestoFactory.remove(entity, 
			    function () {
  					$scope.message = "Registro eliminado correctamente.";
  					$scope['puestoGrid'].refresh();
  				    desbloquearVista();
				}, function (error){
					$scope.error = "Error al eliminar Puesto. Tiene checklist y/o operador asociados.";
					desbloquearVista();
			});
 		};
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.edit = function(entity){
		$scope.read = false;
		$scope.message = null;
		$scope.error   = null;
		$scope.puesto = entity;
		$scope.title = "Editar Puesto";
		$scope.url = "partials/puesto/modal-new.html";
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			PuestoFactory.update($scope.puesto, 
			    function () {
  					$scope.message = "Registro actualizado correctamente.";
  					$scope['puestoGrid'].refresh();
  				    desbloquearVista();
				}, function (error){
					$scope.error = "Error al actualizar Puesto.";
					$scope['puestoGrid'].refresh();
					desbloquearVista();
			});
 		};
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.show = function(entity){
		$scope.read    = true;
		$scope.message = null;
		$scope.error   = null;
		$scope.puesto  = entity;
		$scope.title = "Puesto - Orden: "+entity.orden+" - Nombre: "+entity.nombre;
		$scope.url = "partials/puesto/modal-new.html";
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.detail = function(entity){
		$location.path('/puesto/DETAIL/'+entity.id);
	};
	
	$scope.back = function(){
		$location.path('/lineaproduccion');
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
				
				$scope[name]['items'] = PuestoFactory.getAllByLineaProduccion($.param({ idLineaProduccion: $routeParams.id }));
				
			}, 100);
		};
	};

	var columnDefs = [{
		displayName : 'Orden',
		field : 'orden'
	}, {
		displayName : 'Nombre',
		field : 'nombre'
	}, {
		displayName : 'Descripción',
		field : 'descripcion'
	}
	,{
		field : '',
		width : 130,
		cellClass : 'grid-align',
		cellTemplate : '<a ng-click=show(row.entity)> <i class="fa fa-eye fa-2x"></i></a>'+
			           '<a ng-click=detail(row.entity)> <i class="fa fa-list-alt fa-2x"></i></a>'+
		               '<a ng-click=edit(row.entity)> <i class="fa fa-pencil-square-o  fa-2x"></i></a>'+
			           '<a ng-click=remove(row.entity)> <i class="fa fa-trash-o fa-2x"></i></a>'
	}];

	$scope.build_component_datagrid('puestoGrid', columnDefs);
	$scope['puestoGrid'].refresh();
	
}]);

