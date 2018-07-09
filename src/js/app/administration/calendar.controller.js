(function() {
    'use strict';

    function calendarController($scope, $state, $timeout, $log, Api, Notify, Alerts, APP_CONFIG) {
        var vm = this;
        vm.campos = {};
        vm.rep = false;
		vm.rephasta =false;
		vm.datoList ={};
		vm.application_id = 1;
		//vm.session_id = localStorage.getItem('id_user');
		vm.session_id = 21;
		vm.MgsFfin = false;
		vm.MgsFini = false;
		vm.MgsIni = false;
		vm.campos.hinighost = '00:00:00';
		vm.campos.hfinghost = '00:00:00';
		vm.repetition = [];

		vm.repetition['ALLDAY'] = 'todo el dia';
		vm.repetition['DAY'] = '<strong>Cada día</strong>,este evento se repite cada día durante el tiempo estipulado en rango de fechas ó si no se toma 30 días por defecto';
		vm.repetition['M|TU|W|TH|F'] = 'Todos los días laborales';
		vm.repetition['M|W|F'] = 'Lunes-Miercoles-viernes';
		vm.repetition['TU|TH'] = 'Martes-Jueves';
		vm.repetition['WEEK'] = 'Cada semana';
		vm.repetition['MONTH'] = 'Cada mes';
		vm.repetition['YEAR'] = 'Cada año';

		vm.name = 'John Smith';
		$('#fullCalendar').fullCalendar('destroy');
		var $calendar = $('#fullCalendar');
		//**************************

		vm.greet = function() {
			alert(this.name);
		};
		/**
		 * @author jorge Angarita
		 * @function Agrega el nuevo evento (Tipo de Evento)
		 *
		 */
		vm.addTypeEvent = function() {


			//$log.log('////jsonAddData', jsonAddData);

			if(vm.campos.name === '' || vm.campos.name === undefined){

				return false;
			}
			if(vm.campos.durartion === '' || vm.campos.durartion === undefined){

				return false;
			}
			if(vm.campos.price === '' || vm.campos.price === undefined){

				return false;
			}

			$log.log('vm.resultListTypeEvent.find');
			Api('http://servicesadmin.praxis-medic.appspot.com/api/agendamientoMedico/ListTypeAppointmentId/'+vm.session_id, 'GET', null, {'external': true}).then((function(result) {
			//Api('agendamientoMedico/ListTypeAppointmentId/'+vm.session_id, 'GET', null).then((function (result) {
				$log.log('LIATA TIPO DE EVENTO', result);
				switch (result.status) {
					case 200:
						$log.log('*****LIATA TIPO DE EVENTO********', result.data);
						var jsonAddData = {};
						jsonAddData.id_doctor = vm.session_id;
						jsonAddData.name = vm.campos.name.toUpperCase();
						jsonAddData.durartion= vm.campos.durartion;
						jsonAddData.price = vm.campos.price;
						for(var b =0; b<result.data.length;b++){
							$log.log('*****result.data[b].durartion********',result.data[b].name);
							if(result.data[b].name === jsonAddData.name){
								$log.log('*****SE DETUVO********');
								return false;
							}
						}
						$log.log('*****SIGUIO********');
						Api('agendamientoMedico/TypeAppointment', 'POST', jsonAddData).then((function (result) {
							$log.log('Api.post CRear addTypeEvent');
							switch (result.status) {
								case 201:
									$log.log('******addTypeEvent******', jsonAddData);
									vm.resultListTypeEvent.push(result.data);
									vm.campos.name = '';
									vm.campos.durartion = '';
									vm.campos.price = '';

									break;
								default:
									$log.error(result.status, result.message);
									var _msg = 'Tipo de evento eliminado';
									if (APP_CONFIG.DEBUG) {
										Notify.send(_msg, {
											status: 'warning',
											timeout: 7000
										});
									} else {
										Notify.send(_msg, {
											status: 'warning',
											timeout: 4000
										});
									}
							}
						}), function (error) {
							$log.error('error get login', error);
						});
						break;
					default:
						$log.error(result.status, result.message);
						var _msg = 'Ocurrio un error al intentar crear el evento de agenda';
						if (APP_CONFIG.DEBUG) {
							Notify.send(_msg, {
								status: 'warning',
								timeout: 7000
							});
						} else {
							Notify.send(_msg, {
								status: 'warning',
								timeout: 4000
							});
						}
				}
			}), function (error) {
				$log.error('error get login', error);
			});
		};
		/**
		 * @author jorge Angarita
		 * @function Remueve el evento (Tipo de Evento)
		 *
		 */
		vm.removeTypeEvent = function(contactToRemove) {
			$log.info('contactToRemove', contactToRemove);
			Api('agendamientoMedico/DestroyTypeAppointmentId/'+contactToRemove.id, 'get', null).then((function (result) {
				$log.log('Api.post CRear Agenda');
				switch (result.status) {
					case 203:
						//$log.log('*************', result.data);
						var index = vm.resultListTypeEvent.indexOf(contactToRemove);
						vm.resultListTypeEvent.splice(index, 1);

					default:
						$log.error(result.status, result.message);
						var _msg = 'Ocurrio un error al intentar crear el evento de agenda';
						if (APP_CONFIG.DEBUG) {
							Notify.send(_msg, {
								status: 'warning',
								timeout: 7000
							});
						} else {
							Notify.send(_msg, {
								status: 'warning',
								timeout: 4000
							});
						}
				}
			}), function (error) {
				$log.error('error get login', error);
			});

		};
		/**
		 * @author jorge Angarita
		 * @function Limpia los campos del evento (Tipo de Evento)
		 *
		 */
		vm.clearTypeEvent = function(contact) {
			contact.type = 'phone';
			contact.value = '';
		};
		/**
		 * @author jorge Angarita
		 * @function Abre el modal
		 *
		 */
		vm.onPerson= function() {
			$log.info('onPerson fn');
			vm.campos.descrip = '';
			$('#myModalCalendar').modal('hide');
			$('#ModalCalendarCrearagenda').modal('hide');
			$timeout(function() {
				$scope.go('app.userprofile');
			}, 400);
		};
		/**
		 * @author jorge Angarita
		 * @function Cierre el modal
		 *
		 */
		vm.onClose = function () {
			$('#ModalGhostCrearagenda').modal('hide');
			$('#ModalCalendarInfoAgennda').modal('hide');
			vm.campos.descrip='';
			vm.campos.rangoHora='';
			vm.rep = false;
			vm.campos.checkboxselect = false;
			vm.rephasta = false;
		}
		/**
		 * @author jorge Angarita
		 * @function Camia de esta le variable vm.rep, para mostrar los elementos d ela lista
		 *
		 */
		vm.envenRep = function (even) {
			$log.info('envenRep', even);
			if(even===true){
				vm.rep = true;
			}else{
				vm.rep = false;
				vm.rephasta = false;
			}
		};
		/**
		 * @author jorge Angarita
		 * @function verifica el rango de días paar mostar el calendario de fecha fin
		 *
		 */
		vm.envenReprango = function (even) {
			$log.info('envenReprango', even);
			switch (vm.campos.selectrep.trim()) {
				case "ALLDAY":
					$log.info('even false');
					vm.rephasta = false;
				break;
				case "":
					$log.info('even false');
					vm.rephasta = false;
					break;
				case undefined:
					$log.info('even false');
					vm.rephasta = false;
					break;
				default:
					$log.info('even true');
					vm.rephasta = true;
			}
		};
		/**
		 * @author jorge Angarita
		 * @function abre el modeal #myModalTyeEvent
		 *
		 */
		vm.EventClickTypeEevet = function (){
			$log.info('myModalTyeEvent');
			$('#myModalTyeEvent').modal('show');
		}
		/**
		 * @author jorge Angarita
		 * @function abre el modeal #myModalTyeEvent
		 *
		 */
		vm.envenInfoTypeEvent = function (event) {

			var odjJson = JSON.parse(event);

			vm.campos.rangoHora = vm.TimeListD(odjJson.durartion);

			setTimeout(function(){
				$('.selectpicker').selectpicker('refresh');
			},100);
			//$log.info('vm.campos.rangoHora', vm.campos.rangoHora);


		}

		vm.clickNotify= function() {
			$log.info('clickNotify fn');
		};
		/**
		 * @author jorge Angarita
		 * @function Guarda el agendamiento por parte d elos dostores  para los eventos privados o publicos (ghost)
		 *
		 */
		vm.docrearAgenda = function (tipo) {
			$log.info('loading calendar', tipo);

			var fini;
			var ffin;
			var metodo;
			var jsonDataIn = {};

			/***
			 * Eventos para el calendario
			 * A => Agenda progranada
			 * G => Tiempo disponible
			 * GA => Tiempo disponible Actualizdo
			 * AD => Agenda Eliminada
			 * GD => Tiempo libre eliminado
			 ***/

			switch (tipo){
				case 'A':
					fini =  moment($('#ffin').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
					ffin = moment($('#ffin').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
					metodo = 'POST';
					jsonDataIn.init_date = fini;
					jsonDataIn.end_date = ffin;
					jsonDataIn.init_hour = vm.campos.hini;
					jsonDataIn.end_hour = vm.campos.hfin;
					jsonDataIn.ghost = false;

					jsonDataIn.description = vm.campos.descrip;
					jsonDataIn.description_id = 0;
					break
				case 'G':
					fini =  moment($('#finig').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
					ffin = moment($('#ffing').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
					metodo = 'POST';
					jsonDataIn.init_date = fini;
					jsonDataIn.end_date = ffin;
					jsonDataIn.init_hour = vm.campos.hini;
					jsonDataIn.end_hour = vm.campos.hfin;
					jsonDataIn.ghost = true;

					var obJson = JSON.parse(vm.campos.descrip);
					jsonDataIn.description = obJson.name;
					jsonDataIn.description_id = obJson.id;
					break;
				case 'GA':
					metodo = 'POST';
					vm.campos.checkboxselect = false;
					break;
				case 'AD':
					break;
				case 'GD':
					break;
				default:
					break;
			}

			var val =  false;
			var fvalue;
			var dd = new  Date();
			var day = moment().format('YYYY-MM-DD');
			$log.info('Fecha actual', day);
			if(fini >= day){

				if(fini <= ffin ) {
					vm.MgsFini = false;

					//Validación Fechas
					if (vm.campos.checkboxselect === true) {
						switch (vm.campos.selectrep.trim()) {
							case 'ALLDAY':
								if (fini === ffin) {
									vm.MgsFfin = false;
									val = false;
									jsonDataIn.repeat = "ALLDAY";
								} else {
									vm.desMsgFecha = "Para opción de repeción selecciona deben ser iguales las fechas";
									vm.MgsFfin = true;
									val = true;
									return false;
								}
								break;
							case 'DAY':
								$log.info('DAY');
								if($('#fecharangoGhost').val()){
									$log.info('******SISISISISIIS********');
									ffin = moment($('#fecharangoGhost').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');

								}else {
									$log.info('******NONONO********');
									ffin = moment($('#fecharango').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
								}
								if (ffin < fini ) {
									vm.desMsgFechaRango = "La fecha de inicio debe ser menor a la final";
									vm.MgsFfin = true;
									val = true;
									return false;
								} else {
									vm.MgsFfin = false;
									val = false;
									jsonDataIn.repeat = "DAY";
									jsonDataIn.end_date = ffin;
								}

								break;
							case "M|TU|W|TH|F":
								$log.info('M|TU|W|TH|F');
								if($('#fecharangoGhost').val()){
									//.info('******SISISISISIIS********');
									ffin = moment($('#fecharangoGhost').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');

								}else {
									//$log.info('******NONONO********');
									ffin = moment($('#fecharango').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
								}

								//fvalue = sumerDays(fini, 7, 'd');
								if (ffin < fini) {
									vm.desMsgFechaRango = "La fecha de inicio debe ser menor a la final";
									vm.MgsFfin = true;
									val = true;
									return false;
								} else {
									vm.MgsFfin = false;
									val = false;
									jsonDataIn.repeat = "M|TU|W|TH|F";
									jsonDataIn.end_date = ffin;
								}
								break;
							case "M|W|F":
								$log.info('M|W|F');

								if($('#fecharangoGhost').val()){
									//$log.info('******SISISISISIIS********');
									ffin = moment($('#fecharangoGhost').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');

								}else {
									//$log.info('******NONONO********');
									ffin = moment($('#fecharango').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
								}

								if (ffin < fini) {
									vm.desMsgFechaRango = "La fecha de inicio debe ser menor a la final";
									vm.MgsFfin = true;
									val = true;
									return false;
								} else {
									vm.MgsFfin = false;
									val = false;
									jsonDataIn.repeat = "M|W|F";
									jsonDataIn.end_date = ffin;
								}

								break;
							case "TU|TH":
								$log.info('TU|TH');
								if($('#fecharangoGhost').val()){
									$log.info('******SISISISISIIS********');
									ffin = moment($('#fecharangoGhost').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');

								}else {
									$log.info('******NONONO********');
									ffin = moment($('#fecharango').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
								}

								if (ffin < fini) {
									vm.desMsgFechaRango = "La fecha de inicio debe ser menor a la final";
									vm.MgsFfin = true;
									val = true;
									return false;
								} else {
									vm.MgsFfin = false;
									val = false;
									jsonDataIn.repeat = "TU|TH";
									jsonDataIn.end_date = ffin;
								}
								break;
							case "WEEK":
								$log.info('WEEK');
								if($('#fecharangoGhost').val()){
									//$log.info('******SISISISISIIS********');
									ffin = moment($('#fecharangoGhost').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');

								}else {
									//$log.info('******NONONO********');
									ffin = moment($('#fecharango').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
								}

								if (ffin < fini) {
									vm.desMsgFechaRango = "La fecha de inicio debe ser menor a la final";
									vm.MgsFfin = true;
									val = true;
									return false;
								} else {
									vm.MgsFfin = false;
									val = false;
									jsonDataIn.repeat = "WEEK";
									jsonDataIn.end_date = ffin;
								}
								break;
							case "MONTH":
								$log.info('MONTH');
								if($('#fecharangoGhost').val()){
									//$log.info('******SISISISISIIS********');
									ffin = moment($('#fecharangoGhost').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');

								}else {
									//$log.info('******NONONO********');
									ffin = moment($('#fecharango').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
								}

								if (ffin < fini) {
									vm.desMsgFechaRango = "La fecha de inicio debe ser menor a la final";
									vm.MgsFfin = true;
									val = true;
									return false;
								} else {
									vm.MgsFfin = false;
									val = false;
									jsonDataIn.repeat = "MONTH";
									jsonDataIn.end_date = ffin;
								}
								break;
							case "YEAR":
								$log.info('YEAR');
								if($('#fecharangoGhost').val()){
									//$log.info('******SISISISISIIS********');
									ffin = moment($('#fecharangoGhost').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');

								}else {
									//$log.info('******NONONO********');
									ffin = moment($('#fecharango').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
								}

								if (ffin < fini) {
									vm.desMsgFechaRango = "La fecha de inicio debe ser menor a la final";
									vm.MgsFfin = true;
									val = true;
									return false;
								} else {
									vm.MgsFfin = false;
									val = false;
									jsonDataIn.repeat = "YEAR";
									jsonDataIn.end_date = ffin;
								}
								break;
							default:
								$log.info('*** default ********');
								break;

						}
					} else {
						if (ffin > fini ) {
							vm.MgsFfin = false;
							val = false;
							jsonDataIn.repeat = "DAY";
							jsonDataIn.end_date = ffin;
						}else{
							jsonDataIn.repeat = "NONE";
						}
					}
					//Fin Validación Fechas
					//Validación campo hora
					if (vm.campos.hini === undefined || vm.campos.hini === null) {
						vm.MgsHini = true;
						vm.MsgMgsHini = "Debe seleccionar una hora";
						return false;
					} else if (vm.campos.hini === undefined || vm.campos.hini === null) {
						vm.MgsHfin = true;
						vm.FechaHfin = "Debe seleccionar una hora";
					} else {
						vm.MgsHini = false;
						vm.MgsHfin = false;
					}

					if (vm.campos.hini.trim() > vm.campos.hfin) {
						vm.MgsHini = true;
						vm.MsgMgsHini = "La hora de inicio debe ser menor a la fecha fin";
						return false;
					} else {
						vm.MgsIni = false;
					}
					//Fin validación campo hora


					// {"id":89,"name":"CONSULTORIA","durartion":89,"price":"CONSULTORIA"}


					var jsonData = {};
					jsonData.application_id = vm.application_id;
					jsonData.scheduling_config_id = 1;
					jsonData.medical_id = vm.session_id;
					jsonData.timezones = [jsonDataIn];

					//$log.info('***loading calendar****', jsonData);
					//$log.info("$('.fecharango').val()", $('.fecharango').val());


					if (val === false) {
						Api('agendamientoMedico/CreateEventsMedical', 'POST', jsonData).then((function (result) {
							$log.log('Api.post CRear Agenda', result);
							switch (result.status) {
								case 201:
									//$log.log('*************', result.data);

									$('#ModalCalendarCrearagenda').modal('hide');
									$('#ModalGhostCrearagenda').modal('hide');
									vm.rep = false;
									vm.rephasta = false;
									vm.campos.checkboxselect = false;

									//setTimeout(function(){
									//$calendar.fullCalendar('destroy');

									//$('#fullCalendar').html('');

									$('#fullCalendar').fullCalendar('destroy');
									$calendar = $('#fullCalendar');
									$calendar.fullCalendar( 'refresh' );
									//$templateCache.removeAll();
									vm.createCalendar();
									//setInterval(vm.createCalendar(), 10000);

									vm.rep = false;
									vm.rephasta =false;
									//setTimeout("location.reload()", 2000);
									//},100);
									break;
								default:
									$log.error(result.status, result.message);
									var _msg = 'Ocurrio un error al intentar crear el evento de agenda';
									if (APP_CONFIG.DEBUG) {
										Notify.send(_msg, {
											status: 'warning',
											timeout: 7000
										});
									} else {
										Notify.send(_msg, {
											status: 'warning',
											timeout: 4000
										});
									}
							}
						}), function (error) {
							$log.error('error get login', error);
						});
					}
				}else{
					vm.desMsgFechaIni = "Fecha inicial  debe ser menor ó igual a la fecha final";
					vm.MgsFini = true;
					return false;
				}
			}else{
				vm.desMsgFechaIni = "Fecha inicial  debe ser menor ó igual a la fecha actual";
				vm.MgsFini = true;
				return false;
			}
		};
		/**
		 * @author jorge Angarita
		 * @function publicos (ghost), Agendar evento
		 *
		 */
		vm.doAgendar = function () {
			$log.info('loading doAgendar');

			var fini;
			var ffin;
			var metodo;
			var jsonDataIn = {};
			var jsonData = {};
			var _opts ={};
			//_opts.headers.header

			fini =  moment($('#ffin').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
			ffin = moment($('#ffin').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
			$log.info('Fecha fini', fini);
			$log.info('Fecha ffin', ffin);
			metodo = 'POST';

			var val =  false;
			var fvalue;
			var dd = new  Date();
			var day = moment().format('YYYY-MM-DD');
			$log.info('Fecha actual', day);
			$log.info(Date.parse(fini), Date.parse(day));
			if(Date.parse(fini)>=Date.parse(day)){
				$log.info('SISISISI', day);
					val = false;
				vm.doGeoRequest("Calle 80a # 104-49", "BOGOTA", function(request){
					$log.info('doGeoRequest', request);
					var data = request.data;

					jsonData.application_id = vm.application_id;
					jsonData.scheduling_config_id = 1;
					jsonData.medical_id = vm.session_id;
					jsonData.event_id = $('#tipeEvent').val();
					jsonData.user_id = 20;
					jsonData.date_appointment = fini;
					jsonData.init_hour = $('#hfinip').val();
					jsonData.end_hour = $('#ffinga').val();
					jsonData.description_type = $('#descrip').val();
					jsonData.imei = "39475293845";
					jsonData.id_cliente = jsonData.user_id;
					jsonData.nombre_cliente = "BancoPopular";
					jsonData.direccion = vm.campos.direc;
					jsonData.telefono =  11111111;
					jsonData.cy = data.cx;
					jsonData.cx = data.cy;
					jsonData.fecha_prog_ini = fini;
					jsonData.fecha_prog_fin = ffin;
					$log.info('jsonData', jsonData);


					/*vm.doRequestRest(jsonDataIn, function (request) {
						$log.info('jsonDataIn', request);
					});*/

					Api('http://localhost/proyectos/BancoPopular/BancoPopular_BackEnd/public/api/agendamientoPaciente/scheduledAppointmentsPatient', 'POST', jsonData, {'external': true}).then((function (result) {
						$log.log('Api.post CRear Agenda', result);
						switch (result.status) {
							case 201:
								//$log.log('*************', result.data);

								$('#ModalCalendarCrearagenda').modal('hide');
								$('#ModalGhostCrearagenda').modal('hide');
								vm.rep = false;
								vm.rephasta = false;
								vm.campos.checkboxselect = false;

								//setTimeout(function(){
								//$calendar.fullCalendar('destroy');

								//$('#fullCalendar').html('');
								$('#fullCalendar').fullCalendar('destroy');
								$calendar = $('#fullCalendar');
								$calendar.fullCalendar( 'refresh' );
								//$templateCache.removeAll();
								vm.createCalendar();
								//setInterval(vm.createCalendar(), 10000);

								vm.rep = false;
								vm.rephasta =false;
								//setTimeout("location.reload()", 2000);
								//},100);
								break;
							default:
								$log.error(result.status, result.message);
								var _msg = 'Ocurrio un error al intentar crear el evento de agenda';
								if (APP_CONFIG.DEBUG) {
									Notify.send(_msg, {
										status: 'warning',
										timeout: 7000
									});
								} else {
									Notify.send(_msg, {
										status: 'warning',
										timeout: 4000
									});
								}
						}
					}), function (error) {
						$log.error('error get login', error);
					});
				});

			}else{
				vm.desMsgFechaIni = "Fecha inicial  debe ser menor ó igual a la fecha actual";
				vm.MgsFini = true;
				return false;
			}
		};
		/***
		 * **/
		vm.doGeoRequest = function (textoBusqueda, ciudad, functionCallback) {
			var data = {}
			data['city'] = ciudad;
			data['address'] = textoBusqueda;

			$.ajax({
				beforeSend: function(request) {
					request.setRequestHeader("Authorization", "Token " + "FIMZB0P7LKEIUZA6RVCW18LIPHSKNM");
				},
				type: "post",
				url: "https://sitidata-stdr.appspot.com/api/geocoder/",
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify(data),
				success: function(request) {
					//console.log("Request", request);
					(typeof(functionCallback) === 'function') ? functionCallback(request): functionCallback(null);
				},
				error: function(e, v) {
					console.log(e)
					console.log(v)
					$log.error("Hay un problema en la comunicación con el sistema de georreferenciación, Intente uevamente mas tarde", 'shake');
					try{
						ocultarEnProceso()
						setTimeout(alerta.cerrar, 5000)
					}catch (error){
						console.log("Ocurrio un error diferente al esperado: ", error)
					}
				}

			});
		}

		vm.doRequestRest = function (data, functionCallback) {

			$.ajax({
				beforeSend: function(request) {
					request.setRequestHeader("token", "fTfmTGcCzFLerwSLYsJo");
					request.setRequestHeader("Content-Type", "application/json");
					request.setRequestHeader("Access-Control-Allow-Origin", "*");
					request.setRequestHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
					request.setRequestHeader("Access-Control-Max-Age", "3600");
					request.setRequestHeader("Access-Control-Allow-Headers", "X-ACCESS_TOKEN", "Access-Control-Allow-Origin", "Authorization", "Origin", "x-requested-with", "Content-Type", "Content-Range", "Content-Disposition", "Content-Description");
				},
				type: "post",
				url: "http://receptor1.sitimapa.com/service/index.php/bancopopular/InsertarRegistro",
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify(data),
				success: function(request) {
					//console.log("Request", request);
					(typeof(functionCallback) === 'function') ? functionCallback(request): functionCallback(null);
				},
				error: function(e, v) {
					$log.error("Hay un problema en la comunicación con el sistema de georreferenciación, Intente uevamente mas tarde", 'shake');
					try{
						$log.error(result.status, result.message);
					}catch (error){
						console.log("Ocurrio un error diferente al esperado: ", error);
					}
				}

			});
		}

		/**
		 * @author jorge Angarita
		 * @function Actualiza el evento publico (Ghost)
		 *
		 */
		vm.doUpdateAgendaGhost = function () {
			$log.log('doUpdateAgendaGhost');
			if (vm.campos.hini === undefined || vm.campos.hfinghost === null) {
				vm.MgsHini = true;
				vm.MsgMgsHini = "Debe seleccionar una hora";
				return false;
			} else if (vm.campos.hfin === undefined || vm.campos.hfin === null) {
				vm.MgsHfin = true;
				vm.FechaHfin = "Debe seleccionar una hora";
			} else {
				vm.MgsHini = false;
				vm.MgsHfin = false;
			}

			if (vm.campos.hini.trim() > vm.campos.hfin.trim()) {
				vm.MgsHini = true;
				vm.MsgMgsHini = "La hora de inicio debe ser menor a la fecha fin";
				return false;
			} else {
				vm.MgsIni = false;
			}

			if (vm.campos.hinighost > vm.campos.hini) {
				vm.MgsHini = true;
				vm.MsgMgsHini = "La hora de inicio debe ser mayor a la hora porgamada disponible";
				return false;
			} else {
				vm.MgsIni = false;
			}

			if (vm.campos.hfin.trim() > vm.campos.hfinghost) {
				vm.MgsHfin = true;
				vm.FechaHfin = "La hora de inicio debe ser menor a la hora porgamada disponible";
				return false;
			} else {
				vm.MgsIni = false;
			}

			var jsonData = {};
			jsonData.application_id = vm.application_id;
			jsonData.medical_id = vm.session_id;
			jsonData.init_hour = vm.campos.hini;
			jsonData.end_hour = vm.campos.hfin;
			$log.info('***jsonData****',jsonData);
			Api('http://scheduler.sitidoctor-161813.appspot.com/api/v1/events/update/'+vm.campos.idRegistro, 'PUT', jsonData, {'external': true}).then((function (result) {
				$log.log('Api.post Actualizar Ghost Agenda', result);
				switch (result.status) {
					case 201:
						//$log.log('*************', result.data);
						$('#ModalGhostCrearagenda').modal('hide');
						$('#ModalGhostCrearagenda').modal('hide');
						setTimeout(function(){
							vm.createCalendar();
						},100);
						break;
					default:
						$log.error(result.status, result.message);
						var _msg = 'Ocurrio un error al intentar crear el evento de agenda';
						if (APP_CONFIG.DEBUG) {
							Notify.send(_msg, {
								status: 'warning',
								timeout: 7000
							});
						} else {
							Notify.send(_msg, {
								status: 'warning',
								timeout: 4000
							});
						}
				}
			}), function (error) {
				$log.error('error get login', error);
			});



		}
		/**
		 * @author jorge Angarita
		 * @function hace la suma de dias, meses y años, insertandole el valor a sumar
		 *
		 */
		function sumerDays(date, cant, option) {
			$log.info('BUUUUU',date)
			var d = new Date(date);
			switch(option){
				case 'd':
					d.setDate(d.getDate() + cant);
					break;
				case 'm':
					d.setMonth(d.getMonth() + cant);
					break;
				case 'a':
					d.setFullYear(d.getFullYear() + cant);
					break;
				default:
					break;
			}

			return d;
		}
		/**
		 * @author jorge Angarita
		 * @function abre el model #ModalCalendarCrearagenda, cuando se hace click en un día del calendarío
		 *
		 */
		vm.onDayClick= function(date, jsEvent, view) {

			vm.dataClick = date;
			vm.campos.fini = date;
			vm.campos.ffin = date;
			vm.campos.descrip = '';
			$('#ModalCalendarCrearagenda').on('shown.bs.modal', function(e) {
				$log.info('loading modal');

			});

			$('#ModalCalendarCrearagenda').modal('show');
			vm.campos.descrip = '';
		};
		/**
		 * @author jorge Angarita
		 * @function abre el model #ModalCalendarCrearagenda, cuando se hace click en el boton "AGENDAR CITA"
		 *
		 */
		vm.onEventDayClick= function() {

			$('#ModalCalendarCrearagenda').on('shown.bs.modal', function(e) {
				$log.info('loading modal');
			});
			vm.campos.descrip = '';
			vm.campos.rango = vm.TimeListD(15);
			vm.rep = false;
			vm.rephasta = false;
			vm.campos.checkboxselect = false;

			$('#ModalCalendarCrearagenda').modal('show');
		};
		/**
		 * @author jorge Angarita
		 * @function abre el model #ModalCalendarInfoAgennda, cuando se hace click en un evento privado del agendamiento
		 *
		 */
		vm.onEventDayClickPrivate= function(calEvent, jsEvent, view, resourceObj, color) {
			//$log.info('onEventDayClickPrivate', calEvent);
			//moment(hini+' '+vm.datoList[i].init_hour,'YYYY-MM-DD H:m:s').format('YYYY-MM-DD')
			vm.campos.fini =  calEvent._start.format('DD/MM/YYYY');
			vm.campos.ffin = calEvent._end.format('DD/MM/YYYY');
			$('#finiga').val(calEvent._start.format('DD/MM/YYYY'));
			$('#ffinga').val(calEvent._end.format('DD/MM/YYYY'));;
			$('#hinip').val(calEvent._start.format('HH:mm:ss'));
			$('#descrip').val(calEvent.description);
			$('#hfinip').val(calEvent._end.format('HH:mm:ss'));
			$('#repetition').html(calEvent.repetition);
			$('#tipeEvent').val(calEvent.id);
			$( '.btn-agenda-privada-form' ).css( "background", "linear-gradient(60deg, #"+color+", #"+color+")" );



			/*$log.info('calEvent', calEvent);
			$log.info('jsEvent', jsEvent);
			$log.info('view', view);
			$log.info('resourceObj', vm.campos.hinighost );
			$log.info('calEvent.repetition', calEvent.repetition );*/

			$('#ModalCalendarInfoAgennda').modal('show');
			vm.campos.idRegistro = calEvent.id;

		};
		/**
		 * @author jorge Angarita
		 * @function abre el model #myModalCalendar
		 *
		 */
	    vm.onEventClick= function(calEvent, jsEvent, view) {

			//$('#myModalCalendar').modal('show');

	    };
		/**
		 * @author jorge Angarita
		 * @function abre el model #onEventGhostClick
		 *
		 */
		vm.onEventGhostClick= function() {
			$log.info('loading modal Ghost');
			$('#ModalGhostCrearagenda').on('shown.bs.modal', function(e) {
				$log.info('loading modal');
				setTimeout(function(){
					$('.selectpicker').selectpicker('refresh');
				},50);
			});

			vm.campos.rangoHora='';
			$('#ModalGhostCrearagenda').modal('show');
			setTimeout(function(){
				$('.selectpicker').selectpicker('refresh');
			},50);
		};
		/**
		 * @author jorge Angarita
		 * @function Muestar el calendarío con las citas agendadas
		 *
		 */
        vm.createCalendar = function() {
			$calendar.fullCalendar( 'refresh' );
			$calendar.fullCalendar( 'rerenderEvents' );
			$log.log('createCalendar');
			//setTimeout("location.reload()", 1000);
			//******
			$('#gifImage').html("<img ng-if='mostrarCargando' id='mostrarCargando' src='images/gif-load2.gif'/>");
			var jsonData = {
				"application_id": vm.application_id,
				"status_id": 1,
				"medical_id": vm.session_id
			};

			$log.info('loading jsonData', jsonData);
			$log.info('loading calendar', $calendar);
			var programacionA = null;

			setTimeout(function(){
				$('.selectpicker').selectpicker('refresh');
				Api('http://servicesadmin.praxis-medic.appspot.com/api/agendamientoMedico/ListAvailableEventsMedical', 'POST', jsonData, {'external': true}).then((function(result) {
				//Api('agendamientoMedico/ListAvailableEventsMedical', 'POST', jsonData).then((function(result) {
					$log.log('ListAvailableEventsMedical',result);
					switch (result.status) {
						case 200:
							$('#gifImage').html('');
							$('#tittleUser').html("<h4 id='nameuser'>Jorge Angarita</h4>");
							vm.datoList = result.data;
							//$log.log('Lista Array INI vm.repetition**********', result.data);
							var a = [];
							for(var i = 0; i<vm.datoList.length;i++){
								var b = {};
								$log.log('Lista Array vm.datoList[i]**********', vm.datoList[i]);
								var hini = vm.datoList[i].date_prog
								var eventList = vm.datoList[i];
								$log.info(' vm.datoList**********',  vm.datoList[i]);
								if((vm.datoList[i].ghost === "0" || vm.datoList[i].ghost === "None") &&  vm.datoList[i].schedstatus_id === "1") {
									$log.log('*********AGENDADO********');
									b.id = vm.datoList[i].id
									b.title = vm.datoList[i].description;
									b.color = '#02a0ba';
									b.type = 'AGENDADO';
									b.repetition = vm.repetition['DAY'];
									b.description = vm.datoList[i].description;
									b.start = moment(hini+' '+vm.datoList[i].init_hour,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
									//b.start = hini+' '+vm.datoList[i].init_hour ;
									// b.end = hini+' '+vm.datoList[i].end_hour;
									b.end = moment(hini+' '+vm.datoList[i].end_hour,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
									b.allDay = false;
									//$log.log('********* Agendado **********');
								}else if(vm.datoList[i].ghost === "2" &&  vm.datoList[i].schedstatus_id === "6"){
									$log.log('*********AGENDADOPACIENTE********');
									b.id = vm.datoList[i].id;
									b.title = vm.datoList[i].description;
									b.color = '#7CBB0F';
									b.type = 'AGENDADOPACIENTE';
									b.description = vm.datoList[i].description;
									//b.start = hini+' '+vm.datoList[i].init_hour;
									b.start = moment(hini+' '+vm.datoList[i].init_hour,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
									//b.end = hini+' '+vm.datoList[i].end_hour;
									b.end = moment(hini+' '+vm.datoList[i].end_hour,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
									b.allDay = false;
								}else{
									$log.log('*********GHOSTT********', vm.datoList[i]);
									//$log.log('********* Disponible **********');
									b.id = vm.datoList[i].id;
									b.title = vm.datoList[i].description;
									//b.backgroundColor = '#e91e63';
									b.type = 'GHOST';
									b.description = vm.datoList[i].description;
									//b.start = hini+' '+vm.datoList[i].init_hour;
									b.start = moment(hini+' '+vm.datoList[i].init_hour,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
									//b.end = hini+' '+vm.datoList[i].end_hour;
									b.end = moment(hini+' '+vm.datoList[i].end_hour,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
									b.allDay = false;
									b.className= 'ghost-event';

								}

								a[i] = b;
							}

							//$log.log('Lista Array **********', a);
							$log.info('createCalendar fn');
							//var $calendar = $('#fullCalendar');
							//$log.info('loading calendar', $calendar);
							var programacion = a;
							programacionA = a
							$log.info('*** programacion ***', programacion);
							var today = new Date();
							var y = today.getFullYear();
							var m = today.getMonth();
							var d = today.getDate();

							$calendar.fullCalendar('removeEvents');
							$calendar.fullCalendar('refresh');
							$calendar.fullCalendar({
								viewRender: function(view, element) {
									//$log.info('viewRender view',view);
									//$log.info('viewRender element',element);
									// We make sure that we activate the perfect scrollbar when the view isn't on Month
									/*if (view.name !== 'month') {
										$(element).find('.fc-scroller').perfectScrollbar();
									}*/
									/*if (programacionA !== null){
									//	$log.info("programacionA", programacionA);
										$('#fullCalendar').fullCalendar('rerenderEvents', programacion);

									}*/
								},

								header: {
									left: 'title',
									//center: 'month,agendaWeek,agendaDay,listWeek',
									center: 'month,agendaWeek,agendaDay',
									right: 'today,prev,next'
								},

								defaultDate: today,
								selectable: true,
								selectHelper: true,
								editable: true,
								businessHours: true,
								eventLimit: true, // allow "more" link when too many events

								views: {
									month: { // name of view
										titleFormat: 'MMMM YYYY'
										// other view-specific options here
									},
									week: {
										titleFormat: " MMMM D YYYY"
									},
									day: {
										titleFormat: 'D MMM, YYYY'
									}
								},
								dayClick: function(date, jsEvent, view) {
									//$log.info('*******FECHA******',date);
									//'01:00:00'
									vm.onDayClick(date.format('DD/MM/YYYY'), jsEvent, view);

								},
								eventClick: function(calEvent, jsEvent, view, resourceObj) {
									/*$log.info('*******calEventcalEventcalEventcalEvent******',calEvent);
									$log.info('*******jsEventjsEventjsEvent******',jsEvent);
									$log.info('*******viewviewviewview******',view);*/
									var color;
									switch(calEvent.type){
										case 'AGENDADO':
											$log.info('*******AGENDADO******',calEvent.type);
											color = "02a0ba";
											vm.onEventDayClickPrivate(calEvent, jsEvent, view, resourceObj, color);
											break;
										case 'GHOST':
											$log.info('*******GHOST******',calEvent.type);
											color = "e91e63";
											vm.onEventDayClickPrivate(calEvent, jsEvent, view, resourceObj, color);
											//vm.onEventClick(calEvent, jsEvent, view);
											break;
										case 'AGENDADOPACIENTE':
											color = "7CBB0F";
											$log.info('*******AGENDADOPACIENTE******',calEvent.type);
											vm.onEventDayClickPrivate(calEvent, jsEvent, view, resourceObj, color);

											break;
										default:
											break;
									}

								},
								// color classes: [ event-blue | event-azure | event-green | event-orange | event-red ]
								events: programacion
							});
							$calendar.fullCalendar('rerenderEvents' );
							$calendar.fullCalendar( 'refetchEvents' );
							//$('#fullCalendar').html('');

							break;
						default:
							$log.error(result.status, result.message);
							var _msg='Ocurrio un error al intentar ';
							if (APP_CONFIG.DEBUG) {
								Notify.send(_msg, {
									status: 'warning',
									timeout: 7000
								});
							} else {
								Notify.send(_msg, {
									status: 'warning',
									timeout: 4000
								});
							}
					}
				}), function(error) {
					$log.error('error get list description', error);
				});
			},1000);

        }; //createCalendar
		/**
		 * @author jorge Angarita
		 * @function agendamientoMedico/SchedulerConfig/
		 *
		 */
		vm.listdes = function () {

			//Api('http://servicesadmin.praxis-medic.appspot.com/api/agendamientoMedico/SchedulerConfig/'+vm.application_id, 'GET', null, {'external': true}).then((function(result) {
			Api('agendamientoMedico/SchedulerConfig/'+vm.application_id, 'GET').then((function(result) {
				$log.log('Api.get Descripcuón ******************');
				switch (result.status) {
					case 200:
						//$log.error('Lista descripción', result.data);
						var dataList = result.data;
						var arraydesp = [];
						console.info('++++dataList++++', dataList);
						for(var ind=0; ind<dataList.length; ind++){
							var objDesp = {};
							objDesp.id = dataList[ind].id;
							objDesp.name = dataList[ind].name;
						}
						vm.listaDesciones = arraydesp;
						$log.info('Lista descripción****', vm.listaDesciones);

						break;
					default:
						$log.error(result.status, result.message);
						var _msg='Ocurrio un error al intentar mostar la lista de descripciones';
						if (APP_CONFIG.DEBUG) {
							Notify.send(_msg, {
								status: 'warning',
								timeout: 7000
							});
						} else {
							Notify.send(_msg, {
								status: 'warning',
								timeout: 4000
							});
						}
				}
			}), function(error) {
				$log.error('error get login', error);
			});
		};
		/**
		 * @author jorge Angarita
		 * @function Lista los tipo de eventos por medico, Ppara tablas y combos
		 *
		 */
		vm.ListTypeEvent = function () {
			$log.log('*****LIATA TIPO DE EVENTO********');
			Api('http://servicesadmin.praxis-medic.appspot.com/api/agendamientoMedico/ListTypeAppointmentId/'+vm.session_id, 'GET', null, {'external': true}).then((function(result) {
			//Api('agendamientoMedico/ListTypeAppointmentId/'+vm.session_id, 'GET', null).then((function (result) {
				//$log.log('LIATA TIPO DE EVENTO', result);
				switch (result.status) {
					case 200:
						//$log.log('*****LIATA TIPO DE EVENTO********', result.data);
						vm.resultListTypeEvent = result.data;
						var dataList = result.data;
						var arraydesp = [];
						//$log.log('*****dataList********', dataList);
						for(var ind=0; ind<dataList.length; ind++){
							var objDesp = {};
							objDesp.id = dataList[ind].id;
							objDesp.name = dataList[ind].name;
							objDesp.durartion = dataList[ind].durartion;
							objDesp.price = dataList[ind].price;
							arraydesp[ind] = objDesp;
						}
						vm.listaDesciones = arraydesp;


						break;
					default:
						$log.error(result.status, result.message);
						var _msg = 'Ocurrio un error al intentar crear el evento de agenda';
						if (APP_CONFIG.DEBUG) {
							Notify.send(_msg, {
								status: 'warning',
								timeout: 7000
							});
						} else {$log.info('Lista descripción', vm.listaDesciones);
							Notify.send(_msg, {
								status: 'warning',
								timeout: 4000
							});
						}
				}
			}), function (error) {
				$log.error('error get login', error);
			});
		}

		/**
		 * @author jorge Angarita
		 * @function Lista de horas por el ranga dinamico
		 *
		 */
		vm.TimeListD = function (mun) {

			var listDatos = [];
			var ini =  0;
			// fecha inicial
			var d = new Date();
			d.setHours(1)
			d.setMinutes(0);
			d.setSeconds(0)
			//$log.info('***** listDatos d ****', d);
			var fini = moment(d).format('HH:mm:ss');
			// fecha final
			var f = new Date();
			f.setHours(23)
			f.setMinutes(0);
			f.setSeconds(0)
			//$log.info('***** listDatos f ****', f);
			var ffin = moment(f).format('HH:mm:ss');
			/*$log.info('***** Hora Inicio ****', moment(d).format('HH:mm:ss'));
			$log.info('***** Hora Final ****', ffin);
			$log.info('***** Minutos a sumar ****', mun);*/
			listDatos[ini] = fini;

			do{
				ini++;
				d.setMinutes(d.getMinutes() + mun);
				listDatos[ini] = moment(d).format('HH:mm:ss');
			}while(listDatos[ini] < ffin);

			return listDatos;
		};
		/**
		 * @author jorge Angarita
		 * @function Formato de fecha con la función Date()
		 *
		 */
		vm.myDate = function () {

			var hoy = new Date();
			var dd = hoy.getDate();
			var mm = hoy.getMonth() + 1; //hoy es 0!
			var yyyy = hoy.getFullYear();

			if (dd < 10) {
				dd = '0' + dd;
			}

			if (mm < 10) {
				mm = '0' + mm;
			}

			return mm + '/' + dd + '/' + yyyy;
		};
		/**
		 * @author jorge Angarita
		 * @function carga las funciones del calendario
		 *
		 */
		vm.loadDatePicker = function(){
			$log.info('loading loadDatePicker');

			var $datepicker = $('.datepicker');

			$datepicker.datetimepicker({
	            format: 'DD/MM/YYYY',
	            icons: {
	                time: "fa fa-clock-o",
	                date: "fa fa-calendar",
	                up: "fa fa-chevron-up",
	                down: "fa fa-chevron-down",
	                previous: 'fa fa-chevron-left',
	                next: 'fa fa-chevron-right',
	                today: 'fa fa-screenshot',
	                clear: 'fa fa-trash',
	                close: 'fa fa-remove',
	                inline: true
	            }
	        });
		};

		vm.session = function () {
			vm.getAll();
		};

		vm.getAll = function () {
			vm.ListTypeEvent();
			vm.createCalendar();
			//vm.listTypeEvent();
			vm.campos.rango = vm.TimeListD(15);
			vm.myDate();
			vm.loadDatePicker();

			//$log.info(vm.TimeListD());
		}

        vm.main = function() {
			//setTimeout("location.reload()", 5000);
			//setInterval("location.reload()", 60000);
			if (sessionStorage.session != undefined) {
				vm.session();
			} else {
                $state.go('app.slogin');
            };
		};

        vm.main();
    } //calendarController

    angular.module('app.core').controller('calendarController', calendarController);
    calendarController.$inject = [
        '$scope',
        '$state',
        '$timeout',
        '$log',
        'Api',
        'Notify',
        'Alerts',
        'APP_CONFIG'
    ];
})();
