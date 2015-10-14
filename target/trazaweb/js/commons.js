getDate = function (dateInMilliseconds) {
	if (!isNaN(dateInMilliseconds)) {
		var javascriptDate = new Date(dateInMilliseconds);
 		return ('0' + (javascriptDate.getUTCDate())).slice(-2) + " / " + ('0' + (eval(javascriptDate.getUTCMonth()+1))).slice(-2) + " / "+javascriptDate.getUTCFullYear();
 	}
 	return "";
};

isDefined = function (property) {
	return property != null && typeof property  !== 'undefined';
};

getSuccessSaveMsg = function (entity, id, descrip) {
	return entity + " " + id + " - " + descrip + " creada!";
};

getErrorSaveMsg = function (entity, descrip, error) {
	return "Error al crear  " + entity + " " + descrip + " " + error;
};

getSuccessUpdateMsg = function (entity, id, descrip) {
	return entity + " " + id + " - " + descrip + " modificada!";
};

getErrorUpdateMsg = function (entity, descrip, error) {
	return "Error al modificar la " + entity + " " + descrip + ": " + error;
};

getSuccessDeleteMsg = function (entity, id) {
	return entity + " " + id + " eliminada!"; 
};

getErrorDeleteMsg = function (entity, id, error) {
	return "Error al eliminar la " + entity  + " " + id + " " + error;
};

getConfirmDeleteMsg = function(entity, id) {
	return "¿Está seguro que desea eliminar el " + entity + " " + id + "?";
};

getIdDuplicateMsg = function (entity, id) {
	return "Error al crear  el " + entity + " ya existe el Id: " + id; 
};

getMaxDay = function(idMes, anio){
	if (idMes == 1 || idMes  == 3 || idMes  == 5 || idMes  == 7 || 
	          idMes  == 8 || idMes  == 10 || idMes  == 12)
		{return 31;}
	if (idMes == 4 || idMes  == 6 || idMes  == 9 || idMes  == 11)
		{return 30;}
	if (idMes==2){
		  if (anio % 4 == 0  && (anio % 100 != 0  ||  anio % 400 == 0)){
			  return 29;
		  } else {return 28;}
	}
};

/*formatCUIT transforma una secuencia de 11 numeros en un CUIT formateado con guiones*/
formatCUIT = function(value){
	return value.substr(0,2)+"-"+value.substr(2,8)+"-"+value.substr(10,1);
};
unformatCUIT = function(value){
	return value.replace(/-/gi,'');
};

formatDate= function(fechayyyyMMaa){
//	var fechayyyyMMaa = String(data);
	if (fechayyyyMMaa!=null)
		return fechayyyyMMaa.substring(8,10)+ "-" + fechayyyyMMaa.substring(5,7) + "-" + fechayyyyMMaa.substring(0,4);
	return '';
};

bloquearVista= function(msj,funcion){
	
	 $.blockUI({ 
	        message:  '<br/><p>'+msj+'</p><br/><img src="img/horizontal_loading.gif"/><br/><br/>',
	        	onBlock: funcion
		 });
};

desbloquearVista= function(){
	$.unblockUI();
};
		
		
