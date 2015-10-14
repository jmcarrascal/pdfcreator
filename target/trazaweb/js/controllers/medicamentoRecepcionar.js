'use strict';

/* Controllers */

var app = angular.module('ngprodusimpa.controllers');

app
		.controller(
				'MedicamentoRecepcionarController',
				[
						'$scope',
						'$rootScope',
						'$routeParams',
						'$location',
						'$http',
						'MedicamentosARecepcionarFactory',
						'SesionesControl',
						function($scope, $rootScope, $routeParams, $location,
								$http, MedicamentosARecepcionarFactory,
								SesionesControl) {
							$('#hash').focus();
							$rootScope.userSession = [];
							$rootScope.userSession.rol = SesionesControl
									.get('user.rol');

							$scope.build_component_datagrid = function(name,
									columns_datagrid) {
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
									pageSizes : [ 10, 50, 100 ],
									pageSize : 10,
									currentPage : 1
								};

								// SORTING
								$scope[name]['sortOptions'] = {
									fields : [ $scope[name].filterOptions.filterText ],
									directions : [ "ASC" ]
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
									totalServerItems : name
											+ ".totalServerItems",
									useExternalSorting : false,
									i18n : "es",
									resizable : true,
									selectedItems : $scope.mySelections
								};

								// REFRESH GRID
								$scope[name].refresh = function() {
									setTimeout(
											function() {
												var sb = [];
												for (var i = 0; i < $scope[name].sortOptions.fields.length; i++) {
													sb
															.push($scope[name].sortOptions.directions[i] === "desc" ? "-"
																	: "+");
													sb
															.push($scope[name].sortOptions.fields[i]);
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

												$scope[name]['items'] = $rootScope.medicamentosRecepcionar;
											}, 50);
								};
							};

							var columnDefs = [ {
								displayName : 'Nombre',
								field : '_nombre'
							}, {
								displayName : 'Serie',
								field : '_numero_serial'
							}, {
								displayName : 'GTIN',
								field : '_gtin'
							}, {
								displayName : 'N Lote',
								field : '_lote'
							}, {
								displayName : 'N Remito',
								field : '_n_remito'
							}, {
								displayName : 'F Vencimiento',
								field : '_vencimiento'
							}, {
								displayName : 'Seleccionado',
								field : 'selected'
							} ];

							$scope.addMedicamento = function() {
								// Busco si el gtin y el serie pertenecen
								bloquearVista("Procesando...", null);

								var hash = String($scope.hash);
								var finded = false;
								for (var int = 0; int < $rootScope.medicamentosRecepcionar.length; int++) {
									var array_element = $rootScope.medicamentosRecepcionar[int];
									console.log(hash);
									if (hash.indexOf(array_element['_gtin']) != -1
											&& hash
													.indexOf(array_element['_numero_serial']) != -1) {
										console.log("Lo encontre");
										$scope.oneselected = true;
										$rootScope.medicamentosRecepcionar[int]['selected'] = true;
										$rootScope.medicamentosRecepcionar[int]['hash'] = hash;
										$scope['trazaRemitoGrid'].refresh();
										$scope.error = null;
										$scope.message = "Se ha ingresado el medicamento: SERIE: "
												+ array_element['_numero_serial']
												+ " - GTIN: "
												+ array_element['_gtin'];
										$scope.hash = "";
										$('#hash').focus();
										finded = true;
										break;
									}

								}
								if (!finded) {
									$scope.message = null;
									$scope.error = "No se ha encontrado el medicamento en la lista";

								}
								desbloquearVista();
							};

							$scope.build_component_datagrid('trazaRemitoGrid',
									columnDefs);
							$scope['trazaRemitoGrid'].refresh();

							$scope.ingresoAnmat = function() {
								if (!$scope.oneselected) {
									$scope.error = "Debe seleccionar al menos un medicamento";
								} else {
									bloquearVista(
											"Enviando información a Anmat...",
											null);
									var sendData = {"transacNr":$scope.transacNr, "arrayTransac":$rootScope.medicamentosRecepcionar};
									MedicamentosARecepcionarFactory
											.confirmTransacAnmat(
													sendData,
													function(data) {
														desbloquearVista();
														if (data.success) {
															$scope.message = data.msg;
															setTimeout(
																	function() {
																		$location
																				.path("/find_traza_remito");
																	}, 1000);
														} else {
															$scope.error = data.msg;
														}
													},
													function(error) {
														$scope.error = error.data;
														desbloquearVista();
													});
								}
							};

						} ]);
