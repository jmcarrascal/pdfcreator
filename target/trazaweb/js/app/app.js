'use strict';

// Declare app level module which depends on filters, and services
angular.module('ngprodusimpa',  ['ngRoute','ngCookies','ngSanitize','ngprodusimpa.filters', 'ngprodusimpa.services', 'ngprodusimpa.directives', 'ui.date', 'ui.mask', 'ngprodusimpa.controllers', 'ui.bootstrap.dropdown', 'ui.bootstrap.modal','ui.bootstrap.transition','ui.bootstrap.datepicker','ui.bootstrap.position','ui.bootstrap.tabs','ngGrid','ui.multiselect', 'angucomplete-alt', 'checklist-model']).
    config(['$routeProvider','$locationProvider', '$httpProvider',function ($routeProvider,$locationProvider,$httpProvider) {
        
    	$routeProvider.when('/', {templateUrl: 'partials/dashboard.html', controller: 'IndexController'});
    	$routeProvider.when('/dashboard', {templateUrl: 'partials/dashboard.html', controller: 'IndexController'});
    	
    	//ROL ADMIN
    	$routeProvider.when('/lineaproduccion', {templateUrl: 'partials/lineaproduccion/list.html', controller: 'LineaProduccionController'});
    	$routeProvider.when('/lineaproduccion/:accion/:id', {templateUrl: 'partials/lineaproduccion/detail.html', controller: 'PuestoController'});
    	$routeProvider.when('/puesto/:accion/:id', {templateUrl: 'partials/puesto/detail.html', controller: 'ChecklistController'});
    	$routeProvider.when('/usuario', {templateUrl: 'partials/usuario/list.html', controller: 'UsuarioController'});
    	$routeProvider.when('/metodoverificacion', {templateUrl: 'partials/metodoverif/list.html', controller: 'MetodoVerificacionController'});
    	$routeProvider.when('/codigo/:accion/:id', {templateUrl: 'partials/codigo/detail.html', controller: 'CodigoController'});
    	
    	//ROL OPERADOR
    	$routeProvider.when('/verificacion', {templateUrl: 'partials/verificacion/new.html', controller: 'VerificacionController'});
    	$routeProvider.when('/find_traza_remito', {templateUrl: 'partials/traza/new.html', controller: 'TrazaRemitoController'});
    	$routeProvider.when('/list_medicamento_recepcionar', {templateUrl: 'partials/traza/list.html', controller: 'MedicamentoRecepcionarController'});
    	
    	
    	//ROL SUPERVISOR
    	$routeProvider.when('/supervisacion', {templateUrl: 'partials/supervisacion/new.html', controller: 'SupervisacionController'});
    	$routeProvider.when('/supervisacion/:accion/:id', {templateUrl: 'partials/supervisacion/detail.html', controller: 'SupervisacionController'});
    	$routeProvider.when('/comentario/:id', {templateUrl: 'partials/supervisacion/comentario/list.html', controller: 'ComentarioController'});
    	
    	//ROL MECANICO
    	$routeProvider.when('/mecanico', {templateUrl: 'partials/mecanico/new.html', controller: 'MecanicoController'});
    	$routeProvider.when('/mecanico/:accion/:id', {templateUrl: 'partials/mecanico/detail.html', controller: 'MecanicoController'});
    	
    	//ROL AUDITOR
    	$routeProvider.when('/auditor', {templateUrl: 'partials/auditor/new.html', controller: 'AuditorController'});
    	$routeProvider.when('/auditor/:accion/:id', {templateUrl: 'partials/auditor/detail.html', controller: 'AuditorController'});
    	$routeProvider.when('/bloqueos', {templateUrl: 'partials/auditor/bloqueos/list.html', controller: 'BloqueosController'});
    	$routeProvider.when('/bloqueos/:accion/:id', {templateUrl: 'partials/auditor/bloqueos/detail.html', controller: 'BloqueoRodadoController'});
    	$routeProvider.when('/mastersample', {templateUrl: 'partials/auditor/mastersample/list.html', controller: 'MasterSamplePartController'});
    	
    	
//      $routeProvider.when('/access-denied', {redirectTo: '/login'});        
        $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginController'});      
        $routeProvider.otherwise({redirectTo: '/login'});        
    }]).
    config(['$httpProvider', '$compileProvider', function($httpProvider,$compileProvider) {
    	 $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|data):/);
        // Name of the SpringSecurity Header
        $httpProvider.defaults.xsrfHeaderName="X-CSRF-TOKEN";
        $httpProvider.defaults.transformRequest.push(function(data, headers) {
                if($httpProvider.defaults && $httpProvider.defaults.xsrfHeaderValue){
                        // Set request header with CSRF Token
                headers()[$httpProvider.defaults.xsrfHeaderName] = $httpProvider.defaults.xsrfHeaderValue;
                } 
        return data;
    });
        $httpProvider.defaults.transformResponse.push(function(data, headers) {
                // See if response contains CSRF Token
                var xsrfValue = headers($httpProvider.defaults.xsrfHeaderName);
              if (xsrfValue && $httpProvider.defaults) {
                  // Store found CSRF Token for future requests
                  $httpProvider.defaults.xsrfHeaderValue=xsrfValue;
                  $("head").append("<meta name='csrf-token' content='"+xsrfValue+"'/>");
              }
        return data;
    });
}]).
    config(function (datepickerConfig, datepickerPopupConfig) {
        //datepickerConfig.monthFormat = "MM";
    	//datepickerConfig.dayTitleFormat = 'dd-MM-yyyy';
        datepickerPopupConfig.dateFormat ="dd-MM-yyyy"; 
        datepickerPopupConfig.currentText = "Hoy";
        datepickerPopupConfig.toggleWeeksText = "Semanas";
        datepickerPopupConfig.clearText = "Limpiar";
        datepickerPopupConfig.closeText = "Hecho";
//        datepickerPopupConfig.toggleWeeksText = null;
      }).
    run(function($rootScope, $http, $route, $location, $window, $sanitize, LoginService, SesionesControl, PersistentControl, USER_PROFILES, ROOT_PATH, $modal) {
    	
    	/* Reset error when a new view is loaded */
		$rootScope.$on('$viewContentLoaded', function() {
			delete $rootScope.error;
		});
		
		
		$rootScope.$on('$routeChangeStart', function(scope, newRoute){
			if (! SesionesControl.isAuthenticated()) {		
				$location.path("/login");
			}
	    });
		$rootScope.userProfiles=USER_PROFILES;
		$rootScope.rootPath=ROOT_PATH;
		
		$rootScope.logout = function() {
			SesionesControl.clear();
			PersistentControl.unset('user.name');
			SesionesControl.unset('user.id');
			SesionesControl.unset('user.rol');
			SesionesControl.setAuthenticated(false);
		};
		
		$rootScope.currentYear=new Date().getFullYear();		
			
		$rootScope.getUsername=function(){
			if ($rootScope.username==undefined)
				$rootScope.username = PersistentControl.get('user.name');
			return $rootScope.username;
		};

		$rootScope.seleccione = "Seleccione..";		
				
		$rootScope.openModalConfirm = function ($scope) {
		    var modalInstance = $modal.open({
		      //templateUrl: 'partials/modal-confirm.html',
		      templateUrl: $scope.url,
		      controller: 'ModalConfirmCtrl',
		      scope: $scope,
		      resolve: {
		    	title: function () {
		          return $scope.title;
		        },
		        msg_confirm: function () {
		          return $scope.msg_confirm;
		        },
		       // ok_confirm: function() { return $scope.ok_confirm();}
		      }
		    });
		  };
		  			  
		  $rootScope.openModalError = function ($scope) {
			    var modalInstance = $modal.open({
			      templateUrl: $scope.url,
			      controller: 'ModalConfirmCtrl',
			      scope: $scope,
			      resolve: {
			    	title: function () {
			          return $scope.title;
			        },
			        msg_error: function () {
				          return $scope.msg_error;
				    },
			      }
			    });
			  };
			  
	  $rootScope.openModalSuccess = function ($scope) {
		    var modalInstance = $modal.open({
		      templateUrl: $scope.url,
		      controller: 'ModalConfirmCtrl',
		      scope: $scope,
		      resolve: {
		    	title: function () {
		          return $scope.title;
		        },
		        msg_success: function () {
			          return $scope.msg_success;
			    },
		      }
		    });
		  };
				  
	  $rootScope.openModalDownload = function ($scope) {
		    var modalInstance = $modal.open({
		      templateUrl: $scope.url,
		      controller: 'ModalDownloadCtrl',
		      scope: $scope,
		      resolve: {
		    	title: function () {
		          return $scope.title;
		        },
		        uri: function () {
		          return $scope.uri;
		        },
		        filename: function () {
			          return $scope.filename;
			    },
		      }
		    });
		  };
		  
		$rootScope.isAuthenticated = function(){
			return SesionesControl.isAuthenticated();
		};
		
		$rootScope.sanitizeString = function($value){
			return $sanitize($value);
		};
		
		$rootScope.clearMessages = function($scope){
			$scope.message=null;
			$scope.error=null;
		};
		
		if (SesionesControl.get('user.id') === undefined) {
			$location.path("/login");
		}		
		
	});






