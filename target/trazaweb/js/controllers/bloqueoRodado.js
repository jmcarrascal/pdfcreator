'use strict';

/* Controllers */

var app = angular.module('ngprodusimpa.controllers');

app.controller('BloqueoRodadoController', ['$scope', '$rootScope', '$routeParams', '$location', '$http', 'SesionesControl', 'BloqueosFactory', 'ReportManagerFactory',  
                                           function($scope, $rootScope, $routeParams, $location, $http, SesionesControl, BloqueosFactory, ReportManagerFactory) {
	
	$rootScope.userSession     = [];
	$rootScope.userSession.rol = SesionesControl.get('user.rol');
	
	$scope.filters       = {};
	$scope.checkboxModel = {};
	$scope.bloqueo   = BloqueosFactory.show($.param({ id: $routeParams.id }));
	$scope.historial = false;
	$scope.lineaProduccionList = BloqueosFactory.getLineaProduccionAll();
	
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
			multiSelect : true,
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
			selectedItems : $scope.mySelections,
			showSelectionCheckbox: true,
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
				$scope[name]['items'] = BloqueosFactory.getRodados($.param({ idBloqueo: $routeParams.id, historial: $scope.historial, fechaDesde: $scope.unLockFechaDesde, fechaHasta: $scope.unLockFechaHasta }));
				
			}, 100);
		};
	};

	var columnDefs = [{
		displayName : 'Nro. Chasis',
		field : 'rodado.nroChasis'
	}, {
		displayName : 'Nro. Motor',
		field : 'rodado.nroMotor'
	}, {
		displayName : 'Nro. Llave',
		field : 'rodado.nroLlave'
	}, {
		displayName : 'Código',
		field : 'rodado.codigo.codigo'
	}, {
		displayName:'Fecha Bloqueo', 
		cellTemplate: '<div>{{row.getProperty(col.field) | date:"dd/MM/yyyy"}}</div>',
		field : 'fechaBloqueo'
	}, {
		displayName:'Fecha Desbloqueo', 
		cellTemplate: '<div>{{row.getProperty(col.field) | date:"dd/MM/yyyy"}}</div>',
		field : 'fechaDesbloqueo' 
	}];

	$scope.build_component_datagrid('bloqueoRodadoGrid', columnDefs);
	$scope['bloqueoRodadoGrid'].refresh();
	
	$scope.back = function(){
		$location.path('/bloqueos');
	};
	
	$scope.changeHistorial = function (){
		$scope.historial = !$scope.historial;
		$scope['bloqueoRodadoGrid'].refresh();
	};
	
	$scope.searchFiltersUnlock = function (){
		$scope['bloqueoRodadoGrid'].refresh();
	};
	
	$scope.clearFiltersUnlock = function (){
		$scope.unLockFechaDesde = null;
		$scope.unLockFechaHasta = null;
		$scope.searchFiltersUnlock();
	};
	
	$scope.addRodados = function (){
		$scope.rodadoList = [];
		$scope.checkboxModel.rodadosSelected = [];
		$scope.checkboxModel.checkAll = false;
		$scope.message    = null;
		$scope.error      = null;
		$scope.url        = "partials/auditor/bloqueos/modal-add-articulos.html";
		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			var bloqueoRodados = {};
  			bloqueoRodados.bloqueo = $scope.bloqueo;
  			bloqueoRodados.rodados = $scope.checkboxModel.rodadosSelected;
  			BloqueosFactory.addBloqueoRodados(bloqueoRodados, 
			    function () {
  					$scope.message = "Artículos bloqueados correctamente.";
  					$scope['bloqueoRodadoGrid'].refresh();
  				    desbloquearVista();
				}, function (error){
					$scope.error = "Error al bloquear artículos. Por favor, vuelva a intentarlo.";
					desbloquearVista();
			});
 		};
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.unLock = function (){
	    bloquearVista("Procesando...", null);
		BloqueosFactory.unLockRodados($scope.mySelections, 
		    function () {
				$scope.message = "Artículos desbloqueados correctamente.";
				$scope.mySelections = [];
				$scope['bloqueoRodadoGrid'].refresh();
			    desbloquearVista();
			}, function (error){
				$scope.error = "Error al desbloquear artículos. Por favor, vuelva a intentarlo.";
				desbloquearVista();
		});
	};
	
	$scope.searchRodados = function(){
		bloquearVista("Procesando...", null);
		BloqueosFactory.getRodadosByFilters($scope.filters, function (data) {
			$scope.checkboxModel.rodadosSelected = [];
			$scope.checkboxModel.checkAll = false;
			$scope.rodadoList = data;
			desbloquearVista();
		});
	};
	
	$scope.changeCheckedAll = function (){
	    if ($scope.checkboxModel.checkAll){
	    	$scope.checkboxModel.rodadosSelected = angular.copy($scope.rodadoList);
	    } else {
	    	$scope.checkboxModel.rodadosSelected = [];
	    }
	};
	
	$scope.exportPdf = function () {
		var f = function(){
 			ReportManagerFactory.bloqueoPDF($.param({ idBloqueo: $routeParams.id }),
 	    			function(result){
 	    		         var uri = "data:application/pdf;content-disposition=attachment;base64,"+result.value;
 	    		         desbloquearVista();
 	                     window.open(uri);
 	    	         });
			};
			
			bloquearVista("Generando...",f); 
	};

}]);

