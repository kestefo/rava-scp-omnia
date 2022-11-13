sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "tomapedido/controller/BaseController",
    "tomapedido/model/models",
    "tomapedido/controller/Service",
], function (Controller, BaseController, models, Service) {
    "use strict";

    var that, 
        bValueHelpEquipment = false,
        clouconnector = true;
    return BaseController.extend("tomapedido.controller.Main", {
        onInit: function () {
            that = this;
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getTarget("Main").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

            this.frgIdAddPedido = "frgIdAddPedido";
            this.frgIdDetailPedido = "frgIdDetailPedido";
            this.frgIdEditContact = "frgIdEditContact";
            this.frgIdLoadData = "frgIdLoadData";
        },
        _onbtnRefresh: function(){
            this.onAfterRendering();
        },

        onAfterRendering: function(){

            Promise.all([that._getUsers()]).then((values) => {
                that.oModel = this.getModel("oModelMainService");
                that.oModelPedidoVenta = this.getModel("oModelPedidoVenta");
                var sCodeUser = values[0].value;
                if(!that.isEmpty(sCodeUser)){
                    that.getCargaData(sCodeUser);
                }else{
                    that.getMessageBox("warning", that.getI18nText("errorUserNoCode"));
                }
            }).catch(function (oError) {
                console.log(oError);
                that.getMessageBox("warning", that.getI18nText("errorUserData"));
				sap.ui.core.BusyIndicator.hide(0);
			});
                
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
            Promise.all([this._getCliente(sCodeUser), this._getEstado(sCodeUser), this._getEstado2(sCodeUser)]).then(async values => {
                iCantTotal = values.length;
                iCantSuccess = this.validateService(values);
                iCantError = iCantTotal-iCantSuccess;

                iCantPorcentageSuccess = (iCantSuccess * 100) / iCantTotal;
                sCantPorcentageSuccess = parseInt(iCantPorcentageSuccess).toString();

                oProgressIndicator.setDisplayValue(sCantPorcentageSuccess + '%');
			    oProgressIndicator.setPercentValue(+sCantPorcentageSuccess);

                var oCliente = values[0].oResults;
                var oEstado = values[1].oResults;

                this.oModelPedidoVenta.setProperty("/oSelectUser", oCliente);
                this.oModelPedidoVenta.setProperty("/oEstado", oEstado);
                
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
            
            oProgressIndicator.setDisplayValue('0%');
            oProgressIndicator.setPercentValue(-"0");

            if(oProgressIndicator.getPercentValue() < 100){
                that.getMessageBox("warning", that.getI18nText("warningProgress"));
            }

            if(oSource.sParentAggregationName === "buttons"){
                oSource.getParent().close();
            }else{
                oSource.close();
            }
		},

        handleRouteMatched: function(){
            this.oModel = this.getModel("oModelMainService");
            this.oModelPedidoVenta = this.getModel("oModelPedidoVenta");
            this.oModelPedidoVenta.setProperty("/DataGeneral", models.createDataGeneralModel());
            // Promise.all([this._getCliente()]).then(async values => {
                // this.oModelPedidoVenta.setProperty("/User", models.JsonUserLoged());
                // this.oModelPedidoVenta.setProperty("/oSelectUser", models.JsonCliente());
                // this.oModelPedidoVenta.setProperty("/PedidosCreados", models.JsonPedidos());
                // this.oModelPedidoVenta.setProperty("/DetailSelectFuerzaVenta", models.JsonFuerzaVenta());
                // this.oModelPedidoVenta.setProperty("/DetailSelectPuntoVenta", models.JsonPuntoVenta());
                // this.oModelPedidoVenta.setProperty("/DetailSelectDireccion", models.JsonDirecciones());
                // this.oModelPedidoVenta.setProperty("/DetailSelectCondPago", models.JsonCondPago());
                // this.oModelPedidoVenta.setProperty("/DescSelect", models.JsonDescuento());
			// }).catch(function (oError) {
			// 	sap.ui.core.BusyIndicator.hide(0);
			// });
        },

        //Llamada de data
        _getUsers: function () {
			try {
                var sMail = this.getUserLoged();
                var sPath = '/service/scim/Users?filter=emails eq "' + sMail + '"';
                const sUrl = that.getOwnerComponent().getManifestObject().resolveUri(sPath);
                return new Promise(function (resolve, reject) {
					var model = new sap.ui.model.json.JSONModel();
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
                            reject(oError);
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
                            reject(oError);
                        });
                    }
                });
                
            } catch (oError) {
                that.getMessageBox("error", that.getI18nText("sErrorTry"));
            }	
		},
        _getCliente: function (sCodeUser) {
			try{
				var user = sCodeUser;
                var oResp = {
                    "sEstado": "E",
                    "oResults": []
                };
				return new Promise(function (resolve, reject) {
                    if(clouconnector){
                        var sPath = "/ZOSDD_CUSTOM_VENDOR(p_vende='"+sCodeUser+"')/Set?$format=json";
                        that.getModel("oModelMainService").read(sPath, {
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
                    }else{
                        oResp.sEstado = "E";
                        oResp.oResults = models.JsonCliente();
                        resolve(oResp);
                    }
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
                        that.getModel("oModelMainService").read("/ZOSDD_CUSTOM_VENDORType", {
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
                        that.getModel("oModelMainService").read("/ZOSDD_CUSTOM_VENDORType", {
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
                    that.oModel.read(sPath, {
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
        
        _onPressAddPedido: function(){
            this.setFragment("_dialogAddPedido", this.frgIdAddPedido, "AddPedido", this);
        },
        _onAcceptPedido: function(){
            this._dialogAddPedido.close();
            this.setFragment("_dialogDetailPedido", this.frgIdDetailPedido, "DetailPedido", this);
        },
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
