sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ndc/BarcodeScanner",
	"devoluciones/controller/Service",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/json/JSONModel",
	"devoluciones/model/models",
	"sap/ui/model/Filter",
	"devoluciones/model/formatter",
    "sap/ui/core/Core"
], function (Controller, History, UIComponent, MessageBox, MessageToast, Fragment, BarcodeScanner, Service, BusyIndicator, JSONModel,
	models, Filter, Formatter,Core) {
	"use strict";
	var that;
	var sMessage = "";
	return Controller.extend("devoluciones.controller.BaseController", {
		formatter: Formatter,
		
        local: sap.ushell.Container === undefined ? true : false,
        getUserLoged: function(){
			var user = "";
			if(this.local){// cambio solo para la prueba en local
				user = "liderdeproyecto1@omniasolution.com";
			}else{
				user = sap.ushell.Container.getService("UserInfo").getUser().getEmail();
			}
			return user;
		},
	
        _onbtnHome:function(){
            that = this;
            MessageBox.warning(this.getI18nText("textbtnHome"), {
				actions: [this.getI18nText("acceptText"), this.getI18nText("cancelText2")],
				emphasizedAction: MessageBox.Action.OK,
				onClose: function (sAction) {
					if (sAction === that.getI18nText("acceptText")) {
                        var aplicacion = "#";
                        var accion = "";
                        if(!that.isEmpty(sap.ushell.Container)){
                            var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                            oCrossAppNavigator.toExternal({
                                target: {
                                    semanticObject: aplicacion,
                                    action: accion
                                }
                            });
                        }
					}
				}
			});
        },

        isEmpty: function (inputStr) {

			var flag = false;
			if (inputStr === '') {
				flag = true;
			}
			if (inputStr === null) {
				flag = true;
			}
			if (inputStr === undefined) {
				flag = true;
			}
			if (inputStr == null) {
				flag = true;
			}

			return flag;
		},
		_groupBy: function (array, param) {
			return array.reduce(function (groups, item) {
				const val = item[param]
				groups[val] = groups[val] || []
				groups[val].push(item)
				return groups
			}, {});
		},
		validateUser: function () {
			that = this;
			var oModel = new sap.ui.model.json.JSONModel();
			/* Assign the model to the view */
			this.getView().setModel(oModel);
			/* Load the data */

			oModel.loadData("/services/userapi/attributes");
			// oModel.loadData("/getUserInfo/currentUser");
			/* Add a completion handler to log the json and any errors*/
			return new Promise(function (resolve, reject) {
				oModel.attachRequestCompleted(function onCompleted(oEvent) {
					console.log("--------------------------:---------------------------");
					console.log(oEvent);
					console.log(oModel);
					if (oEvent.getParameter("success")) {
						resolve(oModel.getData());
					} else {
						var msg = oEvent.getParameter("errorObject").textStatus;
						if (msg) {
							reject(msg);
							this.setData("status", msg);
						} else {
							reject("Unknown error retrieving user info");
							this.setData("status", "Unknown error retrieving user info");
						}

					}
				});
			});

		},
		showErrorMessage: function (sError, sDetail) {
			var sDetail2 = String(sDetail);
			return MessageBox.error(sError, {
				title: "Error",
				details: sDetail2,
				styleClass: "sapUiSizeCompact",
				contentWidth: "100px"
			});
		},
		downloadFileCordova2: function (fileToSave, fileName) {
			saveFile(dirEntry, blob, fileName);
		},
		downloadFileCordova: function (fileToSave, fileName) {
			writeFile(fileToSave);

			function writeFile() {
				console.log("request file system");
				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemRetrieved, onFileSystemFail);
			}

			function onFileSystemRetrieved(fileSystem) {
				console.log("file system retrieved");
				fileSystem.root.getFile(fileName, {
					create: true
				}, onFileEntryRetrieved, onFileSystemFail);
			}

			function onFileEntryRetrieved(fileEntry) {
				console.log("file entry retrieved");
				fileEntry.createWriter(gotFileWriter, onFileSystemFail);
			}

			function gotFileWriter(writer) {
				console.log("write to file");

				writer.onwrite = function (evt) {
					alert('done');
				}
				writer.write(fileToSave);

				window.open(fileName, '_blank');
			}

			function onFileSystemFail(error) {
				console.log(error.code);
				alert(error.code)
			}
		},
        changeFormatoFecha:function(oEvent){
            var Fecha = oEvent.getParameters().value;
            var RegExPattern	= /^(?:(?:(?:0?[1-9]|1\d|2[0-8])[/](?:0?[1-9]|1[0-2])|(?:29|30)[/](?:0?[13-9]|1[0-2])|31[/](?:0?[13578]|1[02]))[/](?:0{2,3}[1-9]|0{1,2}[1-9]\d|0?[1-9]\d{2}|[1-9]\d{3})|29[/]0?2[/](?:\d{1,2}(?:0[48]|[2468][048]|[13579][26])|(?:0?[48]|[13579][26]|[2468][048])00))$/;   
            if ((Fecha.match(RegExPattern)) && (Fecha != '')) {

            }else{
                MessageBox.error(this.getI18nText("txtValidacionFecha"));
				
				return; 
            }


        },
       
		getBlobFromFile: function (sFile) {
			var contentType = sFile.substring(5, sFile.indexOf(";base64,"));

			var base64_marker = "data:" + contentType + ";base64,";
			var base64Index = base64_marker.length;
			contentType = contentType || "";
			var sliceSize = 512;
			var byteCharacters = window.atob(sFile.substring(base64Index)); //method which converts base64 to binary
			var byteArrays = [];
			for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
				var slice = byteCharacters.slice(offset, offset + sliceSize);
				var byteNumbers = new Array(slice.length);
				for (var i = 0; i < slice.length; i++) {
					byteNumbers[i] = slice.charCodeAt(i);
				}
				var byteArray = new Uint8Array(byteNumbers);
				byteArrays.push(byteArray);
			}
			var blob = new Blob(byteArrays, {
				type: contentType
			});

			return blob;
		},
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},
		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("RouteBusqueda");
			}
		},
		getI18nText: function (sText) {
			return this.oView.getModel("i18n") === undefined ? false : this.oView.getModel("i18n").getResourceBundle().getText(sText);
		},
		getResourceBundle: function () {
			return this.oView.getModel("i18n").getResourceBundle();
		},
		getModel: function (sModel) {
			return this.oView.getModel(sModel);
		},
		_byId: function (sName) {
			var cmp = this.byId(sName);
			if (!cmp) {
				cmp = sap.ui.getCore().byId(sName);
			}
			return cmp;
		},
		getMessageBox: function (sType, sMessage) {
			return MessageBox[sType](sMessage);
		},
		getMessageBox1: function (sType, sMessage, sParameter) {
			return MessageBox[sType](sMessage, sParameter);
		},
		getMessageBoxFlex: function (sType, sMessage, _this, aMessage, sAction, sRoute, sAction2) {
			that = _this;
			return MessageBox[sType](sMessage, {
				actions: sAction === "" ? [sAction2] : [sAction, sAction2],
				onClose: function (oAction) {
					if (oAction === sAction && sRoute === "ErrorUpdate") {
						that.createMessageLog(aMessage, that);
					}
					if (oAction === sAction && sRoute === "InformationTreat") {
						var oJson = {
							NoticeNumber: that._notification,
							Flag: "",
							SystemStatus: "",
							UserStatus: ""
						};
						that.updateStateNotific("Treat", oJson, that);
					}
					if (oAction === sAction && sRoute === "InformationPostpone") {
						var oJson = {
							NoticeNumber: that._notification,
							Flag: "",
							SystemStatus: "",
							UserStatus: ""
						};
						that.updateStateNotific("Postpone", oJson, that);
					}
					if (oAction === sAction && sRoute === "InformationClose") {
						var oJson = {
							NoticeNumber: that._notification,
							RefDate: aMessage.RefDate,
							RefTime: aMessage.RefTime,
							Flag: "",
							SystemStatus: "",
							UserStatus: ""
						};
						//	that.updateStateNotific("Postpone", oJson,that);
					}
					if (oAction === sAction && sRoute === "ErrorTakePhoto") {
						that._onTakePhoto();
					}
					if (oAction === sAction2 && sRoute === "SuccessUpdate") {
						var sIdNotification = that._notification;
						that.getNotificationDetail(sIdNotification);
						//	that.oRouter.navTo("RouteBusqueda");
					}
					if (oAction === sAction && sRoute === "WarningCancel") {
						var oData = that.getModel("backup").getData();
						that.getModel("createAd").setData(JSON.parse(JSON.stringify(oData)));
						//	that.getView().setModel(models.modelEquipTechLocat(), "notification");
					}
					if (oAction === sAction2 && sRoute === "SuccesRegister") {
						var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
						oCrossAppNavigator.toExternal({
							target: {
								semanticObject: "#"
							}
						});
					}
					if (oAction === sAction && sRoute === "ErrorUpload") {
						BusyIndicator.show();
						Service.oFTP("create", "/HeaderFileSet", that.aCreateFile, "", "1", that).then(function (resolve) {
							BusyIndicator.hide();
						}, function (error) {
							BusyIndicator.hide();
							that.getMessageBoxFlex("error", that.getI18nText("errorFTP"), that, "", that.getI18nText("yes"),
								"ErrorUpload", that.getI18nText("no"));
						});
					}
					if (oAction === sAction && sRoute === "ErrorUploadSharepoint") {
						that._saveDocuments(that.aCreateFile); //Method -> CreateNotification.controller.js
					}
				}
			});
		},
		createMessageLog: function (aMessage, _this) {
			that = _this;
			aMessage.forEach(function (oItem) {
				switch (oItem.MessageType) {
				case "E":
					oItem.MessageType = "Error";
					break;
				case "W":
					oItem.MessageType = "Warning";
					break;
				case "I":
					oItem.MessageType = "Information";
					break;
				default:
				}
			});
			var oMessageTemplate = new sap.m.MessageItem({
				type: '{MessageType}',
				title: '{MessageText}',
			});

			var oModel = new JSONModel();
			oModel.setData(aMessage);

			var oBackButton = new sap.m.Button({
				icon: sap.ui.core.IconPool.getIconURI("nav-back"),
				visible: false,
				press: function () {
					that.oMessageView.navigateBack();
					this.setVisible(false);
				}
			});

			this.oMessageView = new sap.m.MessageView({
				showDetailsPageHeader: false,
				itemSelect: function () {
					oBackButton.setVisible(true);
				},
				items: {
					path: "/",
					template: oMessageTemplate
				}
			});

			this.oMessageView.setModel(oModel);

			this.oDialog = new sap.m.Dialog({
				resizable: true,
				content: this.oMessageView,
				state: 'Error',
				beginButton: new sap.m.Button({
					press: function () {
						this.getParent().close();
					},
					text: "Cerrar"
				}),
				customHeader: new sap.m.Bar({
					contentMiddle: [
						new sap.m.Text({
							text: "Error"
						})
					],
					contentLeft: [oBackButton]
				}),
				contentHeight: "300px",
				contentWidth: "500px",
				verticalScrolling: false
			});
			this.oMessageView.navigateBack();
			this.oDialog.open();
		},
		getScanner: function (oEvent, controller, oBarcode) {
			that = controller;
			var sPath;
			if (!that._oScanDialog) {
				that._oScanDialog = new sap.m.Dialog({
					title: "Scan barcode",
					contentWidth: "640px",
					contentHeight: "480px",
					horizontalScrolling: false,
					verticalScrolling: false,
					stretchOnPhone: true,
					content: [
						new sap.ui.core.HTML({
							content: "<div id='barcode'> <video id='barcodevideo'   autoplay></video>	<canvas id='barcodecanvasg' ></canvas></div><canvas id='barcodecanvas' ></canvas><div id='result'></div>"
						})
					],
					endButton: new sap.m.Button({
						text: "Cancelar",
						press: function (oEvent) {
							that._oScanDialog.close();
						}.bind(that)
					}),
					afterOpen: function () {

						oBarcode.config.start = 0.0;
						oBarcode.config.end = 1.0;
						oBarcode.config.video = '#barcodevideo';
						oBarcode.config.canvas = '#barcodecanvas';
						oBarcode.config.canvasg = '#barcodecanvasg';

						oBarcode.setHandler(function (oBarcode) {
							that.getView().byId("equipment").setValue(oBarcode);
							that._oScanDialog.close();
							return new Promise(function (resolve, reject) {
								sPath = this.oModel.createKey("/Equipment", {
									Equipment: oData.EquipOrTechLocat
								});
								this.oModel.read(sPath, {
									success: function (result) {
										resolve(result);
									},
									error: function (error) {
										reject();
										that.getMessageBox("error", that.getI18nText("error"));
										$.oLog.push({
											error: error,
											date: new Date()
										});
									}
								});
							});
						});
						oBarcode.init();
					}.bind(that)
				});

				that.getView().addDependent(that._oScanDialog);
			}
			//	that.iniciarCamara();
			that._oScanDialog.open();
		},
		getDaysBefore: function (date, days) {
			var _24HoursInMilliseconds = 86400000;
			var daysAgo = new Date(date.getTime() + days * _24HoursInMilliseconds);
			daysAgo.setHours(0);
			daysAgo.setMinutes(0);
			daysAgo.setSeconds(0);
			return daysAgo;
		},
		handleMessageToast: function (message) {
			MessageToast.show(message);
		},
		setTextField: function (ofield, valueItem) {
			this._byId(ofield).setText(valueItem);
		},
		setFragment: function (sDialogName, sFragmentId, sNameFragment, that) {
			try {
				if (!that[sDialogName]) {
					that[sDialogName] = sap.ui.xmlfragment(sFragmentId, "devoluciones.view.dialogs." + sNameFragment,
						that);
					that.getView().addDependent(that[sDialogName]);
				}
				that[sDialogName].open();
			} catch (error) {
				that.getMessageBox("error", that.getI18nText("error"));
				$.oLog.push({
					error: error,
					date: new Date()
				});
			}
		},
		_treefy: function (arr, sPropertyPrincipal, sPropertyPatern, sType) {
			var _cleanTree = function (tree) {
				for (var i = 0, len = tree.length; i < len; i++) {
					delete tree[i]["__metadata"];
					if (tree[i].nodes.length === 0) {
						delete tree[i].nodes;
					} else {
						_cleanTree(tree[i]["nodes"]);
					}
				}
			};

			var tree = [],
				mappedArr = {},
				arrElem,
				mappedElem;

			// First map the nodes of the array to an object -> create a hash table.
			for (var i = 0, len = arr.length; i < len; i++) {
				arrElem = arr[i];
				mappedArr[arrElem[sPropertyPrincipal]] = arrElem;
				mappedArr[arrElem[sPropertyPrincipal]]["nodes"] = [];
			}

			for (var id in mappedArr) {
				if (mappedArr.hasOwnProperty(id)) {
					mappedElem = mappedArr[id];
					if (!mappedElem.Flag) {
						mappedElem.ref = "sap-icon://functional-location";
					} else {
						mappedElem.ref = "sap-icon://machine";
					}
					// If the element is not at the root level, add it to its parent array of children.
					if (mappedElem[sPropertyPrincipal] && mappedElem[sPropertyPatern] !== "") {
						mappedArr[mappedElem[sPropertyPatern]]["nodes"].push(mappedElem);
					}
					// If the element is at the root level, add it to first level elements array.
					else {
						tree.push(mappedElem);
					}
				}
			}
			_cleanTree(tree);
			return tree;
		},
		_onCloseDialog: function (oEvent) {
			oEvent.destroy();
		},
		reverseStringForParameter: function(str,variable) {
			var splitString = str.split(variable); 
			var reverseArray = splitString.reverse(); 
			var joinArray = reverseArray.join(variable); 
			return joinArray;
		},
		currencyFormat: function (value) {
			if(value){
				var sNumberReplace = value.replaceAll(",","");
				var iNumber = parseFloat(sNumberReplace);
				return iNumber.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
			}else{
				return "0.00";
			}
		},
	

		formatYYYYMMDDAbap: function (e) {
			if (e) {
				var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd/MM/yyyy"
				});
				var fecha = new Date(e.substr(0, 4) + "/" + e.substr(4, 2) + "/" + e.substr(6, 2));
				var fechaf = dateFormat.format(fecha);
				return fechaf;
			}
		},

		formatDayRayDateSl: function (value) {
			if(value){
				var date = value.replaceAll("-","/");
				return date;
			}else{
				return "";
			}
		},

		onPressSelect: function(oEvent){
			var kSelected=oEvent.getSource().getSelectedKey();
			var sSelected=oEvent.getSource().getValue();
			if (kSelected !== '') {
				oEvent.getSource().setValue(sSelected);
			}else{
				if(oEvent.getSource().getValue()){
					this.getMessageBox("error", this.getI18nText("sErrorSelect"));
				}
				oEvent.getSource().setValue("");
			}
		},
		
		liveChangeFormatInteger: function (oEvent) {
			var oSource = oEvent.getSource();
			var values = oSource.getValue();
			var regex = /[^\d]/g;
			var x = values.replace(/[^\d]/g, '');

			if(values.match(regex)){
				var x = values;
			}else{
				var x = values.substring(0, values.length - 1);
			}
			var x = parseInt(values);
			var sValueUsed = isNaN(x) ? '' : x;
			
			oSource.setValue(sValueUsed);
		},
        liveChangeFormatFloat: function (oEvent) {
            var oSource = oEvent.getSource();
            var values = oSource.getValue();
            var regex = /[^\d]/g;
            var x = values.replace(/[^\d]/g, '');

            if (values.match(regex)) {
                var x = values;
            } else {
                var x = '';
            }
            var x = parseFloat(values);
            var sValueUsed = isNaN(x) ? '' : x;

            oSource.setValue(sValueUsed);
        },
        onChamp:function(oEvent){
            var vista  = this.getView();
            var tablaCliente = sap.ui.getCore().byId("IdTablaClients01");   
        },
       
        _onPressClose: function (oEvent) {
			var oSource 			= oEvent.getSource();
			var sCustom 			= oSource.data("custom");
            var vista  				= this.getView();
            var tablaCliente 		= sap.ui.getCore().byId("frgIdAddClient--IdTablaClients01");
            var tablaCliente02 		= sap.ui.getCore().byId("frgAddDetalleFact--IdTablaClients01");
			var that				=this;
            switch (sCustom) {
				case "closeClient":
					
                    this.oModelDevolucion.setProperty("/AddFacturaBoleta", []);
                    this.oModelDevolucion.setProperty("/KeyAddUser" ,"");
                    this.oModelDevolucion.setProperty("/KeyMotivo","");
                    vista.byId("idTablaPrincipal").removeSelections(true);
					
					break;
                case "closeProduct":
                    this.goNavConTo("frgIdAddProduct", "navcIdGroupProducto", "IdProductoCenter")
                    this.oModelDevolucion.setProperty("/keyProducto" ,"");
                    vista.byId("idTablaPrincipal").removeSelections(true);
                    break;
				default:
            }
            oSource.getParent().close();
            
		},
        goNavConTo: function (sFragmentId, sNavId, sPageId) {
			// Fragment.byId(sFragmentId, "btnIdNavDialog").setVisible(true);
			var oNavCon = Fragment.byId(sFragmentId, sNavId);
			var oDetailPage = Fragment.byId(sFragmentId, sPageId);
			oNavCon.to(oDetailPage);
		},

	});

});