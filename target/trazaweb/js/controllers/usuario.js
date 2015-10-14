'use strict';

/* Controllers */

var app = angular.module('ngprodusimpa.controllers');

app.controller('UsuarioController', ['$scope', '$rootScope', '$routeParams', '$location', '$http', 'UsuarioFactory', 'RolFactory', 'SesionesControl', function($scope, $rootScope, $routeParams, $location, $http, UsuarioFactory, RolFactory, SesionesControl) {
	
	$rootScope.userSession     = [];
	$rootScope.userSession.rol =  SesionesControl.get('user.rol');
	
	$scope.roles = RolFactory.all(); 
	
	$scope.create = function () {
		$scope.action  = "NEW";
		$scope.message = null;
		$scope.error   = null;
		$scope.usuario = new Object;
		$scope.usuario.locked = false;
		$scope.usuario.rol = new Object();
		$scope.title = "Nuevo Usuario";
		$scope.url = "partials/usuario/modal-new.html";
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			UsuarioFactory.create($scope.usuario, 
			    function () {
  					$scope.message = "Registro creado correctamente.";
  					$scope['usuarioGrid'].refresh();
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
		$scope.title = "Eliminar Usuario";
		$scope.url = "partials/modal-confirm.html";
		$scope.msg_confirm = "¿Esta seguro que desea eliminar el usuario "+entity.apellido+", "+entity.nombre+"?";
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			UsuarioFactory.remove(entity, 
			    function () {
  					$scope.message = "Registro eliminado correctamente.";
  					$scope['usuarioGrid'].refresh();
  				    desbloquearVista();
				}, function (error){
					$scope.error = "Error al eliminar Usuario. Tiene lineas de producción y/o verificaciones asociadas.";
					desbloquearVista();
			});
 		};
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.edit = function(entity){
		$scope.action  = "EDIT";
		$scope.read    = false;
		$scope.message = null;
		$scope.error   = null;
		$scope.usuario = entity;
		$scope.title   = "Editar Usuario";
		$scope.url     = "partials/usuario/modal-new.html";
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			UsuarioFactory.update($scope.usuario, 
			    function () {
  					$scope.message = "Registro actualizado correctamente.";
  					$scope['usuarioGrid'].refresh();
  				    desbloquearVista();
				}, function (error){
					$scope.error = "Error al actualizar Usuario.";
					$scope['usuarioGrid'].refresh();
					desbloquearVista();
			});
 		};
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.show = function(entity){
		$scope.action  = "SHOW";
		$scope.message = null;
		$scope.error   = null;
		$scope.usuario = entity;
		$scope.title = "Usuario - "+entity.apellido+", "+entity.nombre;
		$scope.url = "partials/usuario/modal-new.html";
		$rootScope.openModalConfirm($scope);
	};
	
	$scope.changePassw = function(entity){
		$scope.message = null;
		$scope.error   = null;
		$scope.passwordNew = [];
		$scope.passwordNew.valor = null;
		$scope.title   = "Cambiar Password - Usuario: "+entity.apellido+", "+entity.nombre;
		$scope.url     = "partials/usuario/modal-changepassw.html";
  		$scope.ok_confirm = function(){
  			bloquearVista("Procesando...", null);
  			UsuarioFactory.changePassw($.param({ id: entity.id, password: $scope.passwordNew.valor }), 
			    function () {
  					$scope.message = "Se modificó el password correctamente.";
  				    desbloquearVista();
				}, function (error){
					$scope.error = "Error al modificar password.";
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
				
				$scope[name]['items'] = UsuarioFactory.all();
				
			}, 100);
		};
	};

	var columnDefs = [{
		displayName : 'Apellido',
		field : 'apellido'
	}, {
		displayName : 'Nombre',
		field : 'nombre'
	}, {
		displayName : 'Username',
		field : 'username'
	}, {
		displayName : 'Rol',
		field : 'rol.nombre'
	}, {
		displayName : 'Último acceso', cellTemplate: '<div>{{row.getProperty(col.field) | date:"dd/MM/yyyy h:mma"}}</div>',
		field : 'lastLogin'
	}, {
		displayName:'Activo', cellTemplate: '<div ng-show="row.getProperty(col.field) == false"><i class="fa fa-check-circle-o fa-2x"></i></div><div ng-show="row.getProperty(col.field) == true"><i class="fa fa-times-circle-o fa-2x"></i></div>',
		field:'locked' 
	}, {
		field : '',
		width : 130,
		cellClass : 'grid-align',
		cellTemplate : '<a ng-click=show(row.entity)> <i class="fa fa-eye fa-2x"></i></a>'+
		               '<a ng-click=edit(row.entity)> <i class="fa fa-pencil-square-o  fa-2x"></i></a>'+
			           '<a ng-click=remove(row.entity)> <i class="fa fa-trash-o fa-2x"></i></a>'+
			           '<a ng-click=changePassw(row.entity)> <i class="fa fa-unlock-alt fa-2x"></i></a>' 
	}];

	$scope.build_component_datagrid('usuarioGrid', columnDefs);
	$scope['usuarioGrid'].refresh();
	
}]);

