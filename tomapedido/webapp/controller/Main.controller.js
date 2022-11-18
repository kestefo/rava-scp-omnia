sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "tomapedido/controller/BaseController",
    "tomapedido/model/models",
    "tomapedido/services/ServiceOdata",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    '../util/util',
    '../util/utilUI',
    "../services/Services",
    "../estructuras/Estructura"
], function (Controller, BaseController, models, ServiceOdata, Filter, FilterOperator, util, utilUI, Services, Estructura) {
    "use strict";

    var that, 
        bValueHelpEquipment = false,
        clouconnector = true;
    return BaseController.extend("tomapedido.controller.Main", {
        onInit: function () {
            that = this;
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            // this.oRouter.getTarget("Main").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

            this.frgIdSelectClient = "frgIdSelectClient";
            this.frgIdDetailCliente = "frgIdDetailCliente";
            this.frgIdEditContact = "frgIdEditContact";
            this.frgIdLoadData = "frgIdLoadData";
            this.handleRouteMatched();
        },
        handleRouteMatched: function(oEvent){
            Promise.all([that._getUsers()]).then((values) => {
                this.getModel("oModelPedidoVenta").setProperty("/DataGeneral", models.createDataGeneralModel());
                that.oModelVendedor = this.getModel("oModelServiceVendedor");
                that.oModelMaestro = this.getModel("oModelServiceMaestro");
                that.oModelPedidoVenta = this.getModel("oModelPedidoVenta");
                that.oModelGetPedidoVenta = this.getModel("oModelGetPedidoVenta");
                that.oModelSavePedidoVenta = this.getModel("oModelSavePedidoVenta");

                that.oModelSavePedidoVenta.setProperty("/", []);
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
        _onbtnRefresh: function(){
            this.handleRouteMatched();
        },
        onAfterRendering: function(){
        },
        _getUsers: function () {
			try {
                var sMail = this.getUserLoged();
                var model = new sap.ui.model.json.JSONModel();
                return new Promise(function (resolve, reject) {
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
                oFamiliaMateriales = [],
                sCantPorcentageSuccess = iCantPorcentageSuccess.toString(),
                oProgressIndicator = this._byId("frgIdLoadData--piAnimationLoadData");

            sap.ui.core.BusyIndicator.show(0);
            Promise.all([this._getClientes(sCodeUser), this._getEstado()]).then(async values => {
                iCantTotal = values.length;
                iCantSuccess = this.validateService(values);
                iCantError = iCantTotal-iCantSuccess;

                iCantPorcentageSuccess = (iCantSuccess * 100) / iCantTotal;
                sCantPorcentageSuccess = parseInt(iCantPorcentageSuccess).toString();

                oProgressIndicator.setDisplayValue(sCantPorcentageSuccess + '%');
			    oProgressIndicator.setPercentValue(+sCantPorcentageSuccess);

                var oCliente = values[0].oResults[0].NAVCUSTO.results;
                var oMateriales = values[0].oResults[0].NAVMATER.results;
                var oEstado = values[1].oResults;

                that.oModelGetPedidoVenta.setProperty("/oClientePorVendedor", oCliente);
                that.oModelGetPedidoVenta.setProperty("/oEstado", oEstado);

                $.each(that._groupBy(oMateriales,'Codfa'), function (x, y) {
					var jFamilia = {
						"codeFamilia": y[0].Codfa,
						"textFamilia": y[0].Txtfa,
                        "materiales": y
					};
                    oFamiliaMateriales.push(jFamilia);
				});

                that.oModelGetPedidoVenta.setProperty("/oFamiliaMaterial", oFamiliaMateriales);
                sap.ui.core.BusyIndicator.hide(0);
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

        //Llamada de data
        _getClientes: function (sCodeUser) {
			try{
                var oResp = {
                    "sEstado": "E",
                    "oResults": []
                };
				return new Promise(function (resolve, reject) {
                    var sPath = "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/SelectionSet?$filter=(Kunn2 eq '"+sCodeUser+"')&$expand=NAVCUSTO,NAVMATER";
                    Services.getoDataERP(that, sPath, function (result) {
                        util.response.validateAjaxGetERPNotMessage(result, {
                            success: function (oData, message) {
                                oResp.sEstado = "S";
                                oResp.oResults = oData.data;
                                resolve(oResp);
                            },
                            error: function (message) {
                                oResp.sEstado = "S";
                                oResp.oResults = [];
                                resolve(oResp);
                            }
                        });
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
                    "sEstado": "S",
                    "oResults": models.JsonEstado()
                };
				return new Promise(function (resolve, reject) {
                    resolve(oResp);
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
                    ServiceOdata.oDataConsult("read", sPath, "", aFilter, "1", that, urlParameters)
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
            this._onClearComponentSelectClient();
            var oModelUser = that.getModel("oModelUser").getProperty("/oUser");
            var sCodeUser = oModelUser["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"].attributes[0].value
            sap.ui.core.BusyIndicator.show(0);
            Promise.all([this._getClientes(sCodeUser)]).then((values) => {
                var oCliente = values[0].oResults[0].NAVCUSTO.results;
                var oMateriales = values[0].oResults[0].NAVMATER.results;
                if(values[0].sEstado != "E"){
                    that.oModelGetPedidoVenta.setProperty("/oClientePorVendedor", oCliente);
                    that.oModelGetPedidoVenta.setProperty("/oMaterialesPorVendedor", oMateriales);
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
            var slUsuario = this._byId("frgIdSelectClient--slUsuario");

            var sSelectedKey = slUsuario.getSelectedKey();
            var sSelectedValue = slUsuario.getValue();

            if(this.isEmpty(sSelectedKey)){
                that.getMessageBox("error", that.getI18nText("errorSelectClient"));
                return;
            }

            var oSelectedItem = slUsuario.getSelectedItem();
            var oObjectSelected = oSelectedItem.getBindingContext("oModelGetPedidoVenta").getObject();
            sap.ui.core.BusyIndicator.show(0);
            Promise.all([]).then((values) => {
                var oChangeParameterSelected = {
                    "sNumeroPedido": "",
                    "codeCliente": oObjectSelected.Kunnr,
                    "nameCliente": oObjectSelected.Namec,
                    "codeCanal": oObjectSelected.Vtweg,
                    "TextCanal": oObjectSelected.Txtca,
                    "codeGrupoCliente": oObjectSelected.Vkgrp,
                    "textGrupoCliente": oObjectSelected.Txtfv,
                    "codeDirecccion": "",
                    "textDirecccion": oObjectSelected.Stras,
                    "oDireccion": [
                        {
                            "sKey": "01",
                            "sDireccion": oObjectSelected.Stras,
                        }
                    ],
                    "codePuntoVenta": oObjectSelected.Vkbur,
                    "textPuntoVenta": oObjectSelected.Txtpv,
                    "codeCondPago": oObjectSelected.Zterm,
                    "textCondPago": oObjectSelected.Txtcp,
                    "textFechaEntrega": "",
                    "codeComprobante": 0,
                    "textComprobante": "",
                    "textOrdenCompra": "",
                    "textObservacion": "",
                };

                that.oModelPedidoVenta.setProperty("/DataGeneral/oSelectedCliente", oChangeParameterSelected);

                that._dialogSelectClient.close();
                that.setFragment("_dialogDetailCliente", this.frgIdDetailCliente, "DetailCliente", this);
                sap.ui.core.BusyIndicator.hide(0);
            }).catch(function (oError) {
                console.log(oError);
                that.getMessageBox("error", that.getI18nText("errorClientDetail"));
				sap.ui.core.BusyIndicator.hide(0);
			});
        },
        _getFuerzaVentaCliente: function (sCodeClient) {
			try{
                var oResp = {
                    "sEstado": "E",
                    "oResults": []
                };

				return new Promise(function (resolve, reject) {
                    that.getModel("oModelServiceMaestro").read("/ZOSDD_CUSTOM_DATA(p_kunnr='"+sCodeClient+"')/Set?$format=json", {
                        async: false,
                        success: function (data) {
                            var cont = 0;
                            data.results.forEach(function(value, index){
                                cont ++;
                                value.codestras = cont.toString();
                            });
                            oResp.sEstado = "S";
                            oResp.oResults = data.results;
                            resolve(oResp);
                        },
                        error: function (error) {
                            oResp.sEstado = "S";
                            oResp.oResults = [];
                            resolve(oResp);
                        }
                    });
				});
			}catch(oError){
				that.getMessageBox("error", that.getI18nText("sErrorTry"));
			}
		},
        //Funcionalidades select cliente

        //Funcionalidades Select direccion 
        //moment
        onChangeDireccion: function(oEvent){
            var oSource = oEvent.getSource();
            

            var kSelected=oSource.getSelectedKey();
			var sSelected=oEvent.getSource().getValue();
			if (kSelected !== '') {
				oEvent.getSource().setValue(sSelected);
			}else{
				if(oEvent.getSource().getValue()){
					this.getMessageBox("error", this.getI18nText("sErrorSelect"));
				}
				oEvent.getSource().setValue("");
                return;
			}

            var oSelectedItem = oSource.getSelectedItem();
            var oObjectSelectedItem = oSelectedItem.getBindingContext("oModelPedidoVenta").getObject();
            //moment
            // var oSelectedDireccion = that.oModelPedidoVenta.getProperty("/oSelectedDireccion");
            // oSelectedDireccion.codeGrupoCliente = oObjectSelectedItem.vkgrp;
            // oSelectedDireccion.textGrupoCliente = oObjectSelectedItem.txtfv;
            // oSelectedDireccion.codePuntoVenta = oObjectSelectedItem.vkbur;
            // oSelectedDireccion.textPuntoVenta = oObjectSelectedItem.txtpv;
            // oSelectedDireccion.codeCondPago = oObjectSelectedItem.zterm;
            // oSelectedDireccion.textCondPago = oObjectSelectedItem.txtcp;
            // that.oModelPedidoVenta.setProperty("/oSelectedDireccion", oSelectedDireccion);
        },

        _onPressCreatePedidoPrev: function(){
            var inGrupoCliente = this._byId("frgIdDetailCliente--inGrupoCliente");
            var slDirecciones = this._byId("frgIdDetailCliente--slDirecciones");
            var inPuntoVenta = this._byId("frgIdDetailCliente--inPuntoVenta");
            var inFlete = this._byId("frgIdDetailCliente--inFlete");
            var inCondicionPago = this._byId("frgIdDetailCliente--inCondicionPago");
            var dtFechaEntrega = this._byId("frgIdDetailCliente--dtFechaEntrega");
			var rbgComprobante = this._byId("frgIdDetailCliente--rbgComprobante");
            var inOrdenCompra = this._byId("frgIdDetailCliente--inOrdenCompra");
            var tardenCompra = this._byId("frgIdDetailCliente--tardenCompra");

            var sKeyDireccion = slDirecciones.getSelectedKey();
            var sDireccion = slDirecciones.getValue();
            var sFechaEntrega = dtFechaEntrega.getValue();
            var iKeyComprobante = rbgComprobante.getSelectedIndex();
            var sComprobante = rbgComprobante.getSelectedButton().getText();
            var sOrdenCompra = inOrdenCompra.getValue();
            var sObservacion = tardenCompra.getValue();
            
            if(this.isEmpty(sKeyDireccion)){
                that.getMessageBox("error", that.getI18nText("errorSelectDireccion"));
                return;
            }

            if(this.isEmpty(sFechaEntrega)){
                this.getMessageBox("error", this.getI18nText("errorSelectFechaEntrega"));
                return;
            }

            var oSelectedCliente = that.oModelPedidoVenta.getProperty("/DataGeneral/oSelectedCliente");

            utilUI.messageBox(this.getI18nText("sTextConfirm"),"C", function(value){
                if(value){
                    oSelectedCliente.codeDirecccion = sKeyDireccion;
                    oSelectedCliente.textDirecccion = sDireccion;
                    oSelectedCliente.textFechaEntrega = sFechaEntrega;
                    oSelectedCliente.codeComprobante = iKeyComprobante;
                    oSelectedCliente.textComprobante = sComprobante;
                    oSelectedCliente.textOrdenCompra = sOrdenCompra;
                    oSelectedCliente.textObservacion = sObservacion;
                        
                    Promise.all([that._getLineaCredito(oSelectedCliente)]).then((values) => {
                        var sNumPedido = "1";
                        that.oModelPedidoVenta.setProperty("/DataGeneral/sStatus", "C");
                        that.oModelPedidoVenta.setProperty("/DataGeneral/sNumPedido", sNumPedido);
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oSelectedCliente", oSelectedCliente);

                        values[0].sCredito = values[0].Amount;
                        values[0].sConsumo = "0.00";
                        values[0].sSaldo = (parseFloat(values[0].Amount) - parseFloat(values[0].sConsumo)).toString();

                        var oLineaCredito = values[0];
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oSelectedLineaCredito", oLineaCredito);

                        var objCreado = {
                            "sNumeroPedido": sNumPedido,
                            "sStatus": "C",
                            "oSelectedCliente": oSelectedCliente,
                            "oSelectedLineaCredito": oLineaCredito,
                            "oMateriales": []
                        };
                        that.oModelSavePedidoVenta.getData().push(objCreado);
                        that.oModelSavePedidoVenta.refresh();

                        that._onClearComponentSelectClient();
					    that._onClearComponentDetailClient();
                        that["_dialogDetailCliente"].close();

                        that.oRouter.navTo("Detail", {
                            app: "2"
                        });
                    }).catch(function (oError) {
                        console.log(oError);
                        that.getMessageBox("error", that.getI18nText("errorData"));
                        sap.ui.core.BusyIndicator.hide(0);
                    });
                }
            });
        },
        _getLineaCredito: function (oValue) {
			try{
				return new Promise(function (resolve, reject) {
                    var sPath = "/sap/opu/odata/SAP/ZOSSD_GW_TOMA_PEDIDO_SRV/CreditoSet?$filter=(Kunnr eq '"+"1000000014"+"' and Segme eq 'ZCR01')";
                    Services.getoDataERP(that, sPath, function (result) {
                        util.response.validateAjaxGetERPNotMessage(result, {
                            success: function (oData, message) {
                                resolve(oData.data[0]);
                            },
                            error: function (message) {
                                reject(message);
                            }
                        });
                    });
				});
			}catch(oError){
				that.getMessageBox("error", that.getI18nText("sErrorTry"));
			}
		},
        _onPressEditPedido: function(){
            this.setFragment("_dialogDetailCliente", this.frgIdDetailCliente, "DetailCliente", this);
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
