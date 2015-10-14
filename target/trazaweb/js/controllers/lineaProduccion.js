'use strict';

/* Controllers */

var app = angular.module('ngprodusimpa.controllers');

app.controller('LineaProduccionController', ['$scope', '$rootScope', '$routeParams', '$location', '$http', 'LineaProduccionFactory', 'OperadorLineaProduccionFactory', 'UsuarioFactory', 'SesionesControl', 
                                   function($scope, $rootScope, $routeParams, $location, $http, LineaProduccionFactory, OperadorLineaProduccionFactory, UsuarioFactory, SesionesControl) {
	
	$rootScope.userSession     = [];
	$rootScope.userSession.rol =  SesionesControl.get('user.rol');
	
	$scope.operadores = UsuarioFactory.getOperadores($.param({ locked: false }));
	
	$scope.create = function () {
		$scope.read    = false;
		$scope.message = null;
		$scope.error   = null;
		$scope.lineaProduccion = new Object;
		$scope.lineaProduccion.nombre = null;
		$scope.lineaProduccion.descripcion = "";
		$scope.title = "Nueva Línea Producción";
		$scope.url = "partials/lineaproduccion/modal-new.html";
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			LineaProduccionFactory.create($scope.lineaProduccion, 
			    function () {
  					$scope.message = "Registro creado correctamente.";
  					$scope['line'].refresh();
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
		$scope.title = "Eliminar Línea de Producción";
		$scope.url = "partials/modal-confirm.html";
		$scope.msg_confirm = "¿Esta seguro que desea eliminar la Línea de Producción "+entity.nombre+"?";
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			LineaProduccionFactory.remove(entity, 
			    function () {
  					$scope.message = "Registro eliminado correctamente.";
  					$scope['line'].refresh();
  				    desbloquearVista();
				}, function (error){
					$scope.error = "Error al eliminar Línea de Producción. Tiene puestos asociados.";
					desbloquearVista();
			});
 		};
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.edit = function(entity){
		$scope.read    = false;
		$scope.message = null;
		$scope.error   = null;
		$scope.lineaProduccion = entity;
		$scope.title = "Editar Línea Producción";
		$scope.url = "partials/lineaproduccion/modal-new.html";
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			LineaProduccionFactory.update($scope.lineaProduccion, 
			    function () {
  					$scope.message = "Registro actualizado correctamente.";
  					$scope['line'].refresh();
  				    desbloquearVista();
				}, function (error){
					$scope.error = "Error al actualizar Línea de Producción.";
					$scope['line'].refresh();
					desbloquearVista();
			});
 		};
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.show = function(entity){
		$scope.read    = true;
		$scope.message = null;
		$scope.error   = null;
		$scope.lineaProduccion = entity;
		$scope.title = "Línea Producción - "+entity.nombre;
		$scope.url = "partials/lineaproduccion/modal-new.html";
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.detail = function(entity){
		$location.path('/lineaproduccion/DETAIL/'+entity.id);
	};
	
	$scope.codigos = function(entity){
		$location.path('/codigo/LINEAPRODUCCION/'+entity.id);
	};
	
	$scope.adminOperadores = function(entity){
		$scope.messageOperadores = null;
		$scope.errorOperadores   = null;
		$scope.operadorLineaProduccion = new Object();
		$scope.operadorLineaProduccion.usuario = new Object();
		$scope.operadorLineaProduccion.lineaProduccion = entity;
		LineaProduccionFactory.getOperadoresLineaProduccion($.param({ idLineaProduccion: entity.id }), function(data){
			 $scope.operadoresLineaProduccion = data;
			 $scope.title = "Línea de Producción: "+entity.nombre;
			 $scope.url = "partials/lineaproduccion/modal-operador.html";
	 		 $rootScope.openModalConfirm($scope);
		});
	};
	
	$scope.addOperador = function(){
			$scope.messageOperadores = null;
			$scope.errorOperadores   = null;
			bloquearVista("Procesando...", null);
			OperadorLineaProduccionFactory.create($scope.operadorLineaProduccion,
			    function () {
						$scope.operadoresLineaProduccion = LineaProduccionFactory.getOperadoresLineaProduccion($.param({ idLineaProduccion: $scope.operadorLineaProduccion.lineaProduccion.id }));
						$scope.messageOperadores = "Se asignó el operador a la línea de Produccíon: "+$scope.operadorLineaProduccion.lineaProduccion.nombre+" correctamente.";
					    desbloquearVista();
				}, function (error){
					$scope.errorOperadores = error.data;
					desbloquearVista();
			});
	};
	
	$scope.removeOperador = function(operadorLineaProduccion){
		$scope.messageOperadores = null;
		$scope.errorOperadores   = null;
		bloquearVista("Procesando...", null);
		OperadorLineaProduccionFactory.remove(operadorLineaProduccion,
			    function () {
						$scope.operadoresLineaProduccion = LineaProduccionFactory.getOperadoresLineaProduccion($.param({ idLineaProduccion: $scope.operadorLineaProduccion.lineaProduccion.id }));
						$scope.messageOperadores = "Se elimino el operador a la línea de Produccíon: "+$scope.operadorLineaProduccion.lineaProduccion.nombre+" correctamente.";
					    desbloquearVista();
				}, function (error){
					$scope.errorOperadores = error.data;
					desbloquearVista();
		});
		
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
				
				$scope[name]['items'] = LineaProduccionFactory.all();
				
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
		width : 180,
		cellClass : 'grid-align',
		cellTemplate : '<a ng-click=show(row.entity)> <i class="fa fa-eye fa-2x"></i></a>'+
					   '<a ng-click=detail(row.entity)> <i class="fa fa-list-alt fa-2x"></i></a>'+
		               '<a ng-click=edit(row.entity)> <i class="fa fa-pencil-square-o  fa-2x"></i></a>'+
			           '<a ng-click=remove(row.entity)> <i class="fa fa-trash-o fa-2x"></i></a>'+
			           '<a ng-click=codigos(row.entity)> <i class="fa fa-barcode fa-2x"></i></a>'+
			           '<a ng-click=adminOperadores(row.entity)> <i class="fa fa-user fa-2x"></i></a>'
	}];

	$scope.build_component_datagrid('line', columnDefs);
	$scope['line'].refresh();
	
}]);

