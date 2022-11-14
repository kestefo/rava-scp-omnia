sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "tomapedido/controller/BaseController",
    "tomapedido/model/models",
    "tomapedido/controller/Service",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, BaseController, models, Service, Filter, FilterOperator) {
    "use strict";

    var that, 
        bValueHelpEquipment = false,
        clouconnector = true;
    return BaseController.extend("tomapedido.controller.Main", {
        onInit: function () {
            that = this;
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getTarget("Main").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

            this.frgIdSelectClient = "frgIdSelectClient";
            this.frgIdDetailPedido = "frgIdDetailPedido";
            this.frgIdEditContact = "frgIdEditContact";
            this.frgIdLoadData = "frgIdLoadData";
        },
        _onbtnRefresh: function(){
            this.onAfterRendering();
        },
        onAfterRendering: function(){

            Promise.all([that._getUsers()]).then((values) => {
                that.oModelVendedor = this.getModel("oModelServiceVendedor");
                that.oModelMaestro = this.getModel("oModelServiceMaestro");
                that.oModelPedidoVenta = this.getModel("oModelPedidoVenta");
                var sCodeUser = values[0].value;
                if(!that.isEmpty(sCodeUser)){
                    that.getCargaData(sCodeUser);
                }else{
                    that.getMessageBox("error", that.getI18nText("errorUserNoCode"));
                }
            }).catch(function (oError) {
                console.log(oError);
                that.getMessageBox("error", that.getI18nText("errorUserData"));
				sap.ui.core.BusyIndicator.hide(0);
			});
                
        },
        _getUsers: function () {
			try {
                var sMail = this.getUserLoged();
                var model = new sap.ui.model.json.JSONModel();
                return new Promise(function (resolve, reject) {
                    //momentaneo
                    if(that.local){
                        var sPath = '/service/scim/Users?filter=emails eq "' + sMail + '"';
                        const sUrl = that.getOwnerComponent().getManifestObject().resolveUri(sPath);
                        model.loadData(sUrl, null, true, "GET", null, null, {
                            "Content-Type": "application/scim+json"
                        }).then(() => {
                            var oDataTemp = model.getData();
                            that.getModel("oModelUser").setProperty("/oUser", oDataTemp.Resources[0]);
                            resolve(oDataTemp.Resources[0]["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"].attributes[0]);
                        }).catch(err => {
                            console.log("Error:" + err.message);
                            reject(err);
                        });
                    }else{
                        var sPath = jQuery.sap.getModulePath("tomapedido") +'/API-USER-IAS/service/scim/Users?filter=emails eq "' + sMail + '"';
                        model.loadData(sPath, null, true, "GET", null, null, {
                            "Content-Type": "application/scim+json"
                        }).then(() => {
                            var oDataTemp = model.getData();
                            that.getModel("oModelUser").setProperty("/oUser", oDataTemp.Resources[0]);
                            resolve(oDataTemp.Resources[0]["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"].attributes[0]);
                        }).catch(err => {
                            console.log("Error:" + err.message);
                            reject(err);
                        });
                    }
                });
                
            } catch (oError) {
                that.getMessageBox("error", that.getI18nText("sErrorTry"));
            }	
		},
        getCargaData: function(sCodeUser){
            this.setFragment("_dialogLoadData", this.frgIdLoadData, "LoadData", this);
            
            var iPorcentajeTotal = 100,
                iCantSuccess = 0,
                iCantTotal = 0,
                iCantPorcentageSuccess = 0,
                iCantError = 0,
                sCantPorcentageSuccess = iCantPorcentageSuccess.toString(),
                oProgressIndicator = this._byId("frgIdLoadData--piAnimationLoadData");

            sap.ui.core.BusyIndicator.show(0);
            Promise.all([this._getClientes(sCodeUser)]).then(async values => {
                iCantTotal = values.length;
                iCantSuccess = this.validateService(values);
                iCantError = iCantTotal-iCantSuccess;

                iCantPorcentageSuccess = (iCantSuccess * 100) / iCantTotal;
                sCantPorcentageSuccess = parseInt(iCantPorcentageSuccess).toString();

                oProgressIndicator.setDisplayValue(sCantPorcentageSuccess + '%');
			    oProgressIndicator.setPercentValue(+sCantPorcentageSuccess);

                var oCliente = values[0].oResults;

                that.oModelPedidoVenta.setProperty("/oSelectUser", oCliente);
                
                sap.ui.core.BusyIndicator.hide(0);
                console.log(values);
            }).catch(function (oError) {
                console.log(oError);
				sap.ui.core.BusyIndicator.hide(0);
			});
        },
        validateService: function(oServices){
            var iCantSuccess = 0;
            oServices.forEach(function(value, index){
                if(value.sEstado == "S"){
                    iCantSuccess++;
                }
            });
            return iCantSuccess;
        },
        _onPressAcceptLoadData : function (oEvent) {
            var oSource = oEvent.getSource();
			var sValue = "100",
				oProgressIndicator = this._byId("frgIdLoadData--piAnimationLoadData");

            if(oProgressIndicator.getPercentValue() < 100){
                that.getMessageBox("warning", that.getI18nText("warningProgress"));
            }

            oProgressIndicator.setDisplayValue('0%');
            oProgressIndicator.setPercentValue(-"0");

            if(oSource.sParentAggregationName === "buttons"){
                oSource.getParent().close();
            }else{
                oSource.close();
            }
		},

        handleRouteMatched: function(){
            this.oModelVendedor = this.getModel("oModelServiceVendedor");
            this.oModelPedidoVenta = this.getModel("oModelPedidoVenta");
            this.oModelPedidoVenta.setProperty("/DataGeneral", models.createDataGeneralModel());
        },

        //Llamada de data
        _getClientes: function (sCodeUser) {
			try{
                var oResp = {
                    "sEstado": "E",
                    "oResults": []
                };
				return new Promise(function (resolve, reject) {
                    var sPath = "/ZOSDD_CUSTOM_VENDOR(p_vende='"+sCodeUser+"')/Set?$format=json";
                    that.getModel("oModelServiceVendedor").read(sPath, {
                        async: false,
                        success: function (data) {
                            oResp.sEstado = "S";
                            oResp.oResults = data.results;
                            resolve(oResp);
                        },
                        error: function (error) {
                            oResp.sEstado = "S";
                            oResp.oResults = models.JsonCliente();
                            resolve(oResp);
                        }
                    });
				});
			}catch(oError){
				that.getMessageBox("error", that.getI18nText("sErrorTry"));
			}
		},
        _getEstado: function (sUser) {
			try{
				var user = sUser;
                var oResp = {
                    "sEstado": "E",
                    "oResults": []
                };
				return new Promise(function (resolve, reject) {
                    if(clouconnector){
                        that.getModel("oModelServiceVendedor").read("/ZOSDD_CUSTOM_DATA", {
                            async: false,
                            // filters: [new Filter("Usuario", FilterOperator.Contains, sUser)],
                            success: function (data) {
                                oResp.sEstado = "S";
                                oResp.oResults = data.results;
                                resolve(oResp);
                            },
                            error: function (error) {
                                oResp.sEstado = "S";
                                oResp.oResults = models.JsonEstado();
                                resolve(oResp);
                            }
                        });
                    }else{
                        oResp.sEstado = "E";
                        oResp.oResults = models.JsonEstado();
                        resolve(oResp);
                    }
				});
			}catch(oError){
				that.getMessageBox("error", that.getI18nText("sErrorTry"));
			}
		},
        _getEstado2: function (sUser) {
			try{
				var user = sUser;
                var oResp = {
                    "sEstado": "E",
                    "oResults": []
                };
				return new Promise(function (resolve, reject) {
                    if(clouconnector){
                        that.getModel("oModelServiceVendedor").read("/ZOSDD_CUSTOM_DATA", {
                            async: false,
                            // filters: [new Filter("Usuario", FilterOperator.Contains, sUser)],
                            success: function (data) {
                                oResp.sEstado = "S";
                                oResp.oResults = data.results;
                                resolve(oResp);
                            },
                            error: function (error) {
                                oResp.sEstado = "E";
                                oResp.oResults = models.JsonEstado();
                                resolve(oResp);
                            }
                        });
                    }else{
                        oResp.sEstado = "E";
                        oResp.oResults = models.JsonEstado();
                        resolve(oResp);
                    }
				});
			}catch(oError){
				that.getMessageBox("error", that.getI18nText("sErrorTry"));
			}
		},
        //Llamada de data
        
        //Limpiar
        _onClear: function (oEvent) {
			var oFilterBar = that._byId("idFilterBar");
			var oItems = oFilterBar.getAllFilterItems(true);
			that
				._byId("cbFilterCliente")
				.clearSelection();
			that
				._byId("cbFilterCliente")
				.clearSelection();
			
			for (var i = 0; i < oItems.length; i++) {
				var oControl = oFilterBar.determineControlByFilterItem(oItems[i]);
				if (oControl) {
					if (!oControl.getId().toString().includes("button"))
						oControl.setValue("");

				}
			}
		},
        //Limpiar
        
        //Buscar
        _onSearchFB: function () {
            var sPath = "/EquipmentSearchAdvancedSet";
            var cbCliente = this._byId("cbFilterCliente").getSelectedKey();
            var cbEstado = this._byId("cbFilterEstado").getSelectedKey();
            var sDesde = this._byId("dpDateFilterDesde").getDateValue();
            var sHasta = this._byId("dpDateFilterHasta").getDateValue();
                
            var aFilter = [];
            if (!this.isEmpty(cbCliente)) {
                aFilter.push(new Filter("Cliente", "EQ", cbCliente));
            }
            if (!this.isEmpty(cbEstado)) {
                aFilter.push(new Filter("Estado", "EQ", cbEstado));
            }
            if (!this.isEmpty(sDesde)) {
                aFilter.push(new Filter("Desde", "EQ", sDesde));
            }
            if (!this.isEmpty(sHasta)) {
                aFilter.push(new Filter("Hasta", "EQ", sHasta));
            }

            sap.ui.core.BusyIndicator.show();
            //moment
            if (!navigator.onLine) {
                this.getValuesPedidoAS(sPath, aFilter, that);
            } else {
                this.oModelPedidoVenta.setProperty("/PedidosCreados", models.JsonPedidos());
                that.getMessageBox("error", that.getI18nText("warningInternet"));
                sap.ui.core.BusyIndicator.hide();
            }
        },
        getValuesPedidoAS: function (sPath, aFilter, that) {
            return new Promise(function (resolve, reject) {
                if (navigator.onLine) {
                    var urlParameters = {
                        "$expand": "EquipmentContentASearchSet,MessageSet"
                    }
                    Service.oDataConsult("read", sPath, "", aFilter, "1", that, urlParameters)
                        .then(function (result) {
                            sap.ui.core.BusyIndicator.hide();
                            resolve(result);
                        }, function (error) {
                            sap.ui.core.BusyIndicator.hide();
                            reject(error);
                        });
                } else {
                    that.oModelVendedor.read(sPath, {
                        filters: aFilter,
                        success: function (result) {
                            sap.ui.core.BusyIndicator.hide();
                            resolve(result);
                        },
                        error: function (error) {
                            sap.ui.core.BusyIndicator.hide();
                            reject(error);
                        }
                    });
                }
            }).then(function (resolve) {

                if (navigator.onLine) {
                    resolve = resolve.results[0];
                } else {

                }

                sap.ui.core.BusyIndicator.hide();
            }, function (error) {
                sap.ui.core.BusyIndicator.hide();
                var bValidate = that.validateInternet();
                if (!bValidate) {
                    that.getMessageBox("error", JSON.stringify(error));
                }
                // $.oLog.push({
                //     error: reject,
                //     date: new Date()
                // });
            });
        },
        //Buscar
        
        //Funcionalidades select cliente 
        _onPressSelectClient: function(){
            this.setFragment("_dialogSelectClient", this.frgIdSelectClient, "SelectClient", this);
        },
        _onbtnUpdateClient:function(){
            this._onClearSelectClient();
            var oModelUser = that.getModel("oModelUser").getProperty("/oUser");
            var sCodeUser = oModelUser["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"].attributes[0].value
            sap.ui.core.BusyIndicator.show(0);
            Promise.all([this._getClientes(sCodeUser)]).then((values) => {
                var oCliente = values[0].oResults;
                if(values[0].sEstado != "E"){
                    that.oModelPedidoVenta.setProperty("/oSelectUser", oCliente);
                    that.getMessageBox("success", that.getI18nText("successDataUpdate"));
                }else{
                    that.getMessageBox("error", that.getI18nText("errorDataUpdate"));
                }
                sap.ui.core.BusyIndicator.hide(0);
            }).catch(function (oError) {
                that.getMessageBox("error", that.getI18nText("errorDataUpdate"));
				sap.ui.core.BusyIndicator.hide(0);
			});
        },
        _onDetailCliente: function(){
            var sSelectedKey = sap.ui.getCore().byId("frgIdSelectClient--slUsuario").getSelectedKey();

            if(this.isEmpty(sSelectedKey)){
                that.getMessageBox("error", that.getI18nText("errorSelectClient"));
                return;
            }
            sap.ui.core.BusyIndicator.show(0);
            Promise.all([that._getDetailClient(sSelectedKey)]).then((values) => {
                sap.ui.core.BusyIndicator.hide(0);
                that._dialogSelectClient.close();
                that.setFragment("_dialogDetailPedido", this.frgIdDetailPedido, "DetailPedido", this);
            }).catch(function (oError) {
                console.log(oError);
                that.getMessageBox("error", that.getI18nText("errorClientDetail"));
				sap.ui.core.BusyIndicator.hide(0);
			});

            
        },
        _getDetailClient: function (sCodeClient) {
			try{
				return new Promise(function (resolve, reject) {
                    that.getModel("oModelServiceMaestro").read("/ZOSDD_CUSTOM_DATA(p_kunnr='"+sCodeClient+"')/Set?$format=json", {
                        async: false,
                        success: function (data) {
                            resolve(data);
                        },
                        error: function (error) {
                            reject(error);
                        }
                    });
				});
			}catch(oError){
				that.getMessageBox("error", that.getI18nText("sErrorTry"));
			}
		},
        //Funcionalidades select cliente

        _onPressEditPedido: function(){
            this.setFragment("_dialogDetailPedido", this.frgIdDetailPedido, "DetailPedido", this);
        },
        _onPressEditContact: function(){
            this.setFragment("_dialogEditContact", this.frgIdEditContact, "EditContact", this);
        },
        _onPressAddProducto: function(){
            this.oRouter.navTo("Detail", {
                app: "2"
            });
        }
    });
});
