'use strict';

/* Services */

/*
 http://docs.angularjs.org/api/ngResource.$resource

 Default ngResources are defined as

 'get':    {method:'GET'},
 'save':   {method:'POST'},
 'query':  {method:'GET', isArray:true},
 'remove': {method:'DELETE'},
 'delete': {method:'DELETE'}
 'audit':  {method:'GET'},

 */

var services = angular.module('ngprodusimpa.services', ['ngResource']);

services.constant('USER_PROFILES', {
	 administrador: '1',
	 operador:      '2',
	 supervisor:    '3',
	 mecanico:      '4',
	 auditor:       '5'
});

//services.constant('ROOT_PATH', 'http://192.168.124.13:8080/produsimpa');
services.constant('ROOT_PATH', 'http://localhost:8080/trazaweb');


services.factory('LoginService', function($resource) {
	return $resource('rest/user/:action', {},
			{
				authenticate: {
					method: 'POST',
					params: {'action' : 'authenticate'},
					headers : {'Content-Type': 'application/x-www-form-urlencoded'}
				}
			}
		);
});

services.factory('AuthenticateService', function($resource) {
	return $resource('rest/user/authenticate/:action', {}, {
		authenticate: { 
			method: 'POST', 
			params: {'action' : 'hash'},
			headers : {'Content-Type': 'application/x-www-form-urlencoded'}
		}
	});
});


services.factory("SesionesControl", function(){
	var auth_key='isAuthenticated';
    return {
        //obtenemos una sesión //getter
        get : function(key) 
        {
            return sessionStorage.getItem(key);
        },
        //creamos una sesión //setter
        set : function(key, val) 
        {
            return sessionStorage.setItem(key, val);
        },
        //limpiamos una sesión
        unset : function(key) 
        {
            return sessionStorage.removeItem(key);
        },
        clear : function()
        {
            return sessionStorage.clear();
        },
        setAuthenticated : function(value){
        	return sessionStorage.setItem(auth_key, value);
        },
        isAuthenticated : function() 
        {
            return sessionStorage.getItem(auth_key);
        }
    };
});

services.factory("PersistentControl", function(){
    return {
        //obtenemos una sesión //getter
        get : function(key) 
        {
            return localStorage.getItem(key);
        },
        //creamos una sesión //setter
        set : function(key, val) 
        {
            return localStorage.setItem(key, val);
        },
        //limpiamos una sesión
        unset : function(key) 
        {
            return localStorage.removeItem(key);
        },
        clear : function()
        {
            return localStorage.clear();
        }
    };
});

services.factory('LineaProduccionFactory', function ($resource) {
	return $resource('/produsimpa/rest/lineaProduccion/:action/:id', {}, {
		show:          { method: 'GET',  params: {'action' : 'show'} },
        remove:        { method: 'POST', params: {'action' : 'remove'} },
        update:        { method: 'PUT',  params: {'action' : 'update'} },
        create:        { method: 'POST', params: {'action' : 'create'} },
        all:           { method: 'POST', params: {'action' : 'all'}, isArray:true },
        addCodigo:     { method: 'POST', params: {'action' : 'addCodigo'} },
        removeCodigo:  { method: 'POST', params: {'action' : 'removeCodigo'} },
        getOperadoresLineaProduccion: { method: 'POST', params: {'action' : 'getOperadoresLineaProduccion'}, isArray:true }
    });
});

services.factory('PuestoFactory', function ($resource) {
	return $resource('/produsimpa/rest/puesto/:action/:id', {}, {
		show:   { method: 'GET',  params: {'action' : 'show'} },
        remove: { method: 'POST', params: {'action' : 'remove'} },
        update: { method: 'PUT',  params: {'action' : 'update'} },
        create: { method: 'POST', params: {'action' : 'create'} },
        all:    { method: 'POST', params: {'action' : 'all'}, isArray:true },
        getAllByLineaProduccion: {method: 'POST', params: {'action' : 'getAllByLineaProduccion'}, isArray:true},
    });
});

services.factory('ChecklistFactory', function ($resource) {
	return $resource('/produsimpa/rest/checklist/:action/:id', {}, {
		show:   { method: 'GET',  params: {'action' : 'show'} },
        remove: { method: 'POST', params: {'action' : 'remove'} },
        update: { method: 'PUT',  params: {'action' : 'update'} },
        create: { method: 'POST', params: {'action' : 'create'} },
        all:    { method: 'POST', params: {'action' : 'all'}, isArray:true },
        getAllByPuesto: {method: 'POST', params: {'action' : 'getAllByPuesto'}, isArray:true}
    });
});

services.factory('MetodoVerificacionFactory', function ($resource) {
	return $resource('/produsimpa/rest/metodoVerificacion/:action/:id', {}, {
		show:   { method: 'GET',  params: {'action' : 'show'} },
        remove: { method: 'POST', params: {'action' : 'remove'} },
        update: { method: 'PUT',  params: {'action' : 'update'} },
        create: { method: 'POST', params: {'action' : 'create'} },
        all:    { method: 'POST', params: {'action' : 'all'}, isArray:true },
    });
});


services.factory('MedicamentosARecepcionarFactory', function ($resource) {
	return $resource('/trazaweb/rest/traza/:action/:remito', {}, {
		findRemitoARecepcionar:   { method: 'GET',  params: {'action' : 'findRemitoARecepcionar'}, isArray:true },
		confirmTransacAnmat: { method: 'POST', params: {'action' : 'confirmTransacAnmat'} },
        update: { method: 'PUT',  params: {'action' : 'update'} },
        create: { method: 'POST', params: {'action' : 'create'} },
        all:    { method: 'POST', params: {'action' : 'all'}, isArray:true },
    });
});



services.factory('OperadorLineaProduccionFactory', function ($resource) {
	return $resource('/produsimpa/rest/operadorLineaProduccion/:action/:id', {}, {
        remove: { method: 'POST', params: {'action' : 'remove'} },
        create: { method: 'POST', params: {'action' : 'create'} },
    });
});

services.factory('UsuarioFactory', function ($resource) {
	return $resource('/trazaweb/rest/usuario/:action/:id', {}, {
		show:   { method: 'GET',  params: {'action' : 'show'} },
        remove: { method: 'POST', params: {'action' : 'remove'} },
        update: { method: 'PUT',  params: {'action' : 'update'} },
        create: { method: 'POST', params: {'action' : 'create'} },
        all:    { method: 'POST', params: {'action' : 'all'}, isArray:true },
        getOperadores: { method: 'POST', params: {'action' : 'getOperadores'}, isArray:true },
        changePassw : { method: 'POST', params: {'action' : 'changePassw'} }
    });
});
	
services.factory('RolFactory', function ($resource) {
	return $resource('/trazaweb/rest/rol/:action/:id', {}, {
		show:   { method: 'GET',  params: {'action' : 'show'} },
        remove: { method: 'POST', params: {'action' : 'remove'} },
        update: { method: 'PUT',  params: {'action' : 'update'} },
        create: { method: 'POST', params: {'action' : 'create'} },
        all:    { method: 'POST', params: {'action' : 'all'}, isArray:true },
    });
});

services.factory('VerificacionFactory', function ($resource) {
	return $resource('/produsimpa/rest/verificacion/:action', {}, {
        findOrCreate: { method: 'POST', params: {'action' : 'findOrCreate'} },
        getChecklistByPuesto: { method: 'POST', params: {'action' : 'getChecklistByPuesto'}, isArray:true },
        save: { method: 'POST', params: {'action' : 'save'} },
        getRodadoByMotor: { method: 'POST', params: {'action' : 'getRodadoByMotor'}},
        getRodadoByLlave: { method: 'POST', params: {'action' : 'getRodadoByLlave'}}
    });
});

services.factory('SupervisacionFactory', function ($resource) {
	return $resource('/produsimpa/rest/supervisacion/:action', {}, {
		findRodado: { method: 'POST', params: {'action' : 'findRodado'} },
		findRodadoById: { method: 'POST', params: {'action' : 'findRodadoById'} },
	    getVerificacionesByRodado: { method: 'POST', params: {'action' : 'getVerificacionesByRodado'}, isArray:true },
		getVerificacion: { method: 'POST', params: {'action' : 'getVerificacion'} },
		getObservacionesByVerificacion: { method: 'POST', params: {'action' : 'getObservacionesByVerificacion'}, isArray:true },
		createVerificacionObservacion: { method: 'POST', params: {'action' : 'createVerificacionObservacion'} },
		updateVerificacionObservacion: { method: 'POST', params: {'action' : 'updateVerificacionObservacion'} },
		removeVerificacionObservacion: { method: 'POST', params: {'action' : 'removeVerificacionObservacion'} }
    });
});

services.factory('MecanicoFactory', function ($resource) {
	return $resource('/produsimpa/rest/mecanico/:action', {}, {
		findRodado: { method: 'POST', params: {'action' : 'findRodado'} },
		findRodadoById: { method: 'POST', params: {'action' : 'findRodadoById'} },
		getVerifErrorByRodado: { method: 'POST', params: {'action' : 'getVerifErrorByRodado'}, isArray:true },
		findError: { method: 'POST', params: {'action' : 'findError'}, isArray:true },
		createError: { method: 'POST', params: {'action' : 'createError'} },
		createRodadoError: { method: 'POST', params: {'action' : 'createRodadoError'} },
		removeError: { method: 'POST', params: {'action' : 'removeError'} },
		correctError: { method: 'POST', params: {'action' : 'correctError'} },
		getVerificacion: { method: 'POST', params: {'action' : 'getVerificacion'} },
		getRodadoError: { method: 'POST', params: {'action' : 'getRodadoError'} }
    });
});

services.factory('ReportManagerFactory', function ($resource) {
	return $resource('/produsimpa/rest/reportManager/:action', {}, {
		checklistErrorPDF: { method: 'POST', params: {'action' : 'checklistErrorPDF'} },
		bloqueoPDF: { method: 'POST', params: {'action' : 'bloqueoPDF'} },
    });
});

services.factory('AuditorFactory', function ($resource) {
	return $resource('/produsimpa/rest/auditor/:action', {}, {
		findRodado: { method: 'POST', params: {'action' : 'findRodado'} },
		findRodadoById: { method: 'POST', params: {'action' : 'findRodadoById'} },
		getVerifErrorByRodado: { method: 'POST', params: {'action' : 'getVerifErrorByRodado'}, isArray:true },
		findError: { method: 'POST', params: {'action' : 'findError'}, isArray:true },
		createError: { method: 'POST', params: {'action' : 'createError'} },
		createRodadoError: { method: 'POST', params: {'action' : 'createRodadoError'} },
		removeError: { method: 'POST', params: {'action' : 'removeError'} },
		correctError: { method: 'POST', params: {'action' : 'correctError'} },
		getVerificacion: { method: 'POST', params: {'action' : 'getVerificacion'} },
		getRodadoError: { method: 'POST', params: {'action' : 'getRodadoError'} },
		removeCorreccionError: { method: 'POST', params: {'action' : 'removeCorreccionError'} },
		checklistIncorrect: { method: 'POST', params: {'action' : 'checklistIncorrect'} }
    });
});

services.factory('CodigoFactory', function ($resource) {
	return $resource('/produsimpa/rest/codigo/:action', {}, {
		getAllByLineaProduccion: {method: 'POST', params: {'action' : 'getAllByLineaProduccion'}, isArray:true},
		all: {method: 'POST', params: {'action' : 'all'}, isArray:true},
		create: { method: 'POST', params: {'action' : 'create'} },
		update: { method: 'PUT',  params: {'action' : 'update'} },
    });
});

services.factory('BloqueosFactory', function ($resource) {
	return $resource('/produsimpa/rest/bloqueos/:action', {}, {
		show:   { method: 'POST', params: {'action' : 'show'} },
		query:  { method: 'POST', params: {'action' : 'query'}, isArray:true},
		create: { method: 'POST', params: {'action' : 'create'} },
		update: { method: 'PUT',  params: {'action' : 'update'} },
		remove: { method: 'PUT',  params: {'action' : 'remove'} },
		getCausasBloqueo: { method: 'POST',  params: {'action' : 'getCausasBloqueo'}, isArray:true},
		getRodados: { method: 'POST',  params: {'action' : 'getRodados'}, isArray:true},
		getRodadosByLineaProduccion: { method: 'POST',  params: {'action' : 'getRodadosByLineaProduccion'}, isArray:true},
		getLineaProduccionAll: { method: 'POST', params: {'action' : 'getLineaProduccionAll'}, isArray:true },
		getRodadosByFilters: { method: 'POST', params: {'action' : 'getRodadosByFilters'}, isArray:true },
		addBloqueoRodados: { method: 'PUT',  params: {'action' : 'addBloqueoRodados'} },
		unLockRodados: { method: 'PUT',  params: {'action' : 'unLockRodados'} },
    });
});
	
services.factory('MasterSamplePartFactory', function ($resource) {
	return $resource('/produsimpa/rest/masterSamplePart/:action', {}, {
		query:  { method: 'POST',  params: {'action' : 'query'}, isArray:true},
		create: { method: 'PUT', params: {'action' : 'create'} },
		update: { method: 'PUT',  params: {'action' : 'update'} },
		remove: { method: 'PUT',  params: {'action' : 'remove'} },
		findRodado: { method: 'POST', params: {'action' : 'findRodado'}, isArray:true },
    });  
});