'use strict';

/* Controllers */

var app = angular.module('ngprodusimpa.controllers');

app.controller('BloqueosController', ['$scope', '$rootScope', '$routeParams', '$location', '$http', 'SesionesControl', 'BloqueosFactory', 'ReportManagerFactory', 
                                      function($scope, $rootScope, $routeParams, $location, $http, SesionesControl, BloqueosFactory, ReportManagerFactory) {
	
	$rootScope.userSession     = [];
	$rootScope.userSession.rol = SesionesControl.get('user.rol');
	
	$scope.filters = {};
	$scope.causaBloqueoList = BloqueosFactory.getCausasBloqueo();
	
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
				
				$scope.getBloqueos();
				
			}, 100);
		};
	};

	var columnDefs = [{
		displayName : 'Fecha',
		cellTemplate: '<div>{{row.getProperty(col.field) | date:"dd/MM/yyyy"}}</div>',
		field : 'fecha'
	}, {
		displayName : 'Descripción',
		field : 'descripcion'
	}, {
		displayName : 'Pedido/WO Nº',
		field : 'pedidoWoNro'
	}, {
		displayName : 'Cliente/Proveedor',
		field : 'clienteProveedor'
	}, {
		displayName:'Causa', 
		cellTemplate: '<div>{{row.getProperty(col.field).descripcion}} {{row.getProperty("causa")}}</div>',
		field:'causaBloqueo' 
	}, {
		displayName:'Acciones tomadas', 
		field:'accionesTomadas' 
	}, {
		displayName:'Fue Informado', 
		field:'informado' 
	}, {
		field : '',
		width : 150,
		cellClass : 'grid-align',
		cellTemplate : '<a ng-click=show(row.entity)> <i class="fa fa-eye fa-2x"></i></a>'+
		               '<a ng-click=detail(row.entity)> <i class="fa fa-list-alt fa-2x"></i></a>'+
		               '<a ng-click=edit(row.entity)> <i class="fa fa-pencil-square-o  fa-2x"></i></a>'+
		               '<a ng-click=remove(row.entity)> <i class="fa fa-trash-o fa-2x"></i></a>'+
		               '<a ng-click=exportPdf(row.entity)> <i class="fa fa-print fa-2x"></i></a>'		
	}];

	$scope.build_component_datagrid('bloqueosGrid', columnDefs);
	$scope['bloqueosGrid'].refresh();	
	
	$scope.clearfilters = function () {
		$scope.filters.fechaDesde     = null;
		$scope.filters.fechaHasta     = null;
		$scope.filters.idCausaBloqueo = null;
		$scope.filters.descripcion    = null;
		$scope.filters.pedidoWoNro    = null;
		$scope.filters.causa          = null;
		$scope['bloqueosGrid'].refresh();
	};	
	
	$scope.checkedCausaBloqueoSelected = function(causaBloqueo){
		$scope.filters.causa = null;
		if (causaBloqueo == null){
			$scope.filters.idCausaBloqueo = null;
		} else {
			$scope.filters.idCausaBloqueo = causaBloqueo.id;	
		}
	};
	
	$scope.checkedCausaBloqueoModal = function(causaBloqueo){
		$scope.bloqueo.causa = null;
		if (causaBloqueo == null){
			$scope.bloqueo.causaBloqueo = null;
		} else {
			$scope.bloqueo.causaBloqueo = causaBloqueo;	
		}
	};
	
	$scope.getBloqueos = function (){
		$scope['bloqueosGrid']['items'] = BloqueosFactory.query($scope.filters);	
	};
	
	$scope.create = function () {
		$scope.read    = false;
		$scope.newedit = true;
		$scope.message = null;
		$scope.error   = null;
		$scope.title = "Nuevo Bloqueo";
		$scope.url = "partials/auditor/bloqueos/modal-new.html";
		$scope.bloqueo = {};
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			BloqueosFactory.create($scope.bloqueo, 
			    function () {
  					$scope.message = "Registro creado correctamente.";
  					$scope['bloqueosGrid'].refresh();
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
		$scope.newedit = false;
		$scope.title = "Bloqueo";
		$scope.url = "partials/auditor/bloqueos/modal-new.html";
		$scope.bloqueo = entity;
		desbloquearVista();
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.edit = function (entity) {
		$scope.read    = false;
		$scope.newedit = true;
		$scope.message = null;
		$scope.error   = null;
		$scope.title = "Editar Bloqueo";
		$scope.url = "partials/auditor/bloqueos/modal-new.html";
		$scope.bloqueo = entity;
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			BloqueosFactory.update($scope.bloqueo, 
			    function () {
  					$scope.message = "Registro actualizado correctamente.";
  					$scope['bloqueosGrid'].refresh();
  				    desbloquearVista();
				}, function (error){
					$scope.error = "Error al actualizar el bloqueo";
					desbloquearVista();
			});

 		};
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.remove = function(entity){
		$scope.message = null;
		$scope.error   = null;
		$scope.title = "Eliminar Bloqueo";
		$scope.url = "partials/modal-confirm.html";
		$scope.msg_confirm = "¿Esta seguro que desea eliminar el bloqueo?";
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			BloqueosFactory.remove(entity, 
			    function () {
  					$scope.message = "Registro eliminado correctamente.";
  					$scope['bloqueosGrid'].refresh();
  				    desbloquearVista();
				}, function (error){
					$scope.error = "Error al eliminar bloqueo. Tiene artículos asociados.";
					desbloquearVista();
			});
 		};
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.exportPdf = function (entity) {
		var f = function(){
 			ReportManagerFactory.bloqueoPDF($.param({ idBloqueo: entity.id }),
 	    			function(result){
 	    		         var uri = "data:application/pdf;content-disposition=attachment;base64,"+result.value;
 	    		         desbloquearVista();
 	                     window.open(uri);
 	    	         });
			};
			
			bloquearVista("Generando...",f); 
	};
	
	$scope.detail = function(entity){
		$location.path('/bloqueos/DETAIL/'+entity.id);
	};
	
}]);

