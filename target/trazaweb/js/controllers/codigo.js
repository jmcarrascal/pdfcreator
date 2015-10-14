'use strict';

/* Controllers */

var app = angular.module('ngprodusimpa.controllers');

app.controller('CodigoController', ['$scope', '$rootScope', '$routeParams', '$location', '$http', 'LineaProduccionFactory', 'CodigoFactory', 'SesionesControl',
                                    function($scope, $rootScope, $routeParams, $location, $http, LineaProduccionFactory, CodigoFactory, SesionesControl) {
	
	$rootScope.userSession     = [];
	$rootScope.userSession.rol =  SesionesControl.get('user.rol');
	
	$scope.lineaProduccion = LineaProduccionFactory.show({ id: $routeParams.id });
	
	$scope.create = function () {
		$scope.newCodigoForm = false;
		$scope.btnConfirm = false;
		$scope.codigos = CodigoFactory.all();
		$scope.title = "Nuevo Código";
		$scope.url = "partials/codigo/modal-new.html";
  		$scope.ok_confirm = function(codigo){
  			bloquearVista("Procesando...", null);
  			var lineaProduccionCodigo = {};
  			lineaProduccionCodigo.lineaProduccion = $scope.lineaProduccion;
  			lineaProduccionCodigo.codigo          = codigo;
  			LineaProduccionFactory.addCodigo(lineaProduccionCodigo, 
			    function () {
  					$scope.message = "Registro creado correctamente.";
  					$scope['codigoGrid'].refresh();
  				    desbloquearVista();
				}, function (error){
					$scope.error = error.data;
					desbloquearVista();
			});
 		};
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.addNewCodigo = function(){
		$scope.codigoNew     = new Object();
		$scope.newCodigoForm = true;
	};
	
	$scope.cancelCodigoNew = function(){
		$scope.newCodigoForm = false;
	};
	
	$scope.enabledConfirm = function(){
		$scope.btnConfirm = true;
	};
	
	$scope.saveCodigoNew = function(){
		$scope.successSaveCodigo = null;
		$scope.errorSaveCodigo   = null;
		bloquearVista("Procesando...", null);
		CodigoFactory.create($scope.codigoNew, 
		    function (response) {
					$scope.successSaveCodigo = "Registro creado correctamente.";
					$scope.codigos = CodigoFactory.all();
					$scope.cancelCodigoNew();
					$scope.btnConfirm = false;
				    desbloquearVista();
			}, function (error){
				$scope.errorSaveCodigo = error.data;
				desbloquearVista();
		});
	};
	
	$scope.remove = function(entity){
		$scope.message = null;
		$scope.error   = null;
		$scope.title = "Eliminar Código";
		$scope.url = "partials/modal-confirm.html";
		$scope.msg_confirm = "¿Esta seguro que desea eliminar el codigo "+entity.codigo+" - "+entity.descripcion+" de la Línea de Producción "+$scope.lineaProduccion.nombre+"?";
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			var lineaProduccionCodigo = {};
  			lineaProduccionCodigo.lineaProduccion = $scope.lineaProduccion;
  			lineaProduccionCodigo.codigo          = entity;
  			LineaProduccionFactory.removeCodigo(lineaProduccionCodigo, 
			    function () {
  					$scope.message = "Registro eliminado correctamente.";
  					$scope['codigoGrid'].refresh();
  				    desbloquearVista();
				}, function (error){
					$scope.error = "Error al eliminar el código.";
					desbloquearVista();
			});
 		};
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.edit = function(entity){
		$scope.title = "Editar Código";
		$scope.url = "partials/codigo/modal-edit.html";
		$scope.codigo = entity;
  		$scope.ok_confirm = function(){
  			console.log($scope.codigo);
  			bloquearVista("Procesando...", null);
  			CodigoFactory.update($scope.codigo, 
			    function () {
  					$scope.message = "Registro actualizado correctamente.";
  					$scope['codigoGrid'].refresh();
  				    desbloquearVista();
				}, function (error){
					$scope.error = "Error al actualizar Código.";
					$scope['codigoGrid'].refresh();
					desbloquearVista();
			});
 		};
		$rootScope.openModalConfirm($scope);
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
				
				$scope[name]['items'] = CodigoFactory.getAllByLineaProduccion($.param({ idLineaProduccion: $routeParams.id }));
				
			}, 100);
		};
	};

	var columnDefs = [{
		displayName : 'Código',
		field : 'codigo'
	}, {
		displayName : 'Descripción',
		field : 'descripcion'
	}, {
		field : '',
		width : 60,
		cellClass : 'grid-align',
		cellTemplate : '<a ng-click=edit(row.entity)> <i class="fa fa-pencil-square-o  fa-2x"></i></a>'+
			           '<a ng-click=remove(row.entity)> <i class="fa fa-trash-o fa-2x"></i></a>'
	}];

	$scope.build_component_datagrid('codigoGrid', columnDefs);
	$scope['codigoGrid'].refresh();
	
}]);

