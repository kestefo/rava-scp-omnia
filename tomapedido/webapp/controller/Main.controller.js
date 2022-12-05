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
                that._byId("dpDateFilterHasta").setEnabled(false);
                that.getModel("oModelPedidoVenta").setProperty("/DataGeneral", models.createDataGeneralModel());
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
                oClienteGroup = [],
                sCantPorcentageSuccess = iCantPorcentageSuccess.toString(),
                oProgressIndicator = this._byId("frgIdLoadData--piAnimationLoadData");

            sap.ui.core.BusyIndicator.show(0);
            Promise.all([this._getClientes(sCodeUser), this._getEstado(), this._getMotivo()]).then(async values => {
                iCantTotal = values.length;
                iCantSuccess = this.validateService(values);
                iCantError = iCantTotal-iCantSuccess;

                iCantPorcentageSuccess = (iCantSuccess * 100) / iCantTotal;
                sCantPorcentageSuccess = parseInt(iCantPorcentageSuccess).toString();

                oProgressIndicator.setDisplayValue(sCantPorcentageSuccess + '%');
			    oProgressIndicator.setPercentValue(+sCantPorcentageSuccess);

                if(!that.isEmpty(values[0].oResults[0])){
                    var oCliente = values[0].oResults[0].NAVCUSTO.results;
                    var oMateriales = values[0].oResults[0].NAVMATER.results;

                    $.each(that._groupBy(oCliente,'Kunnr'), function (x, y) {
                        var jFamilia = {
                            "Kunnr":y[0].Kunnr,
                            "Namec":y[0].Namec,
                            "Smtp_addr":y[0].Smtp_addr,
                            "Telf1":y[0].Telf1,
                            "Stcd1":y[0].Stcd1,
                            "Kdgrp":y[0].Kdgrp,
                            "Txtfv":y[0].Txtfv,
                            "Vkbur":y[0].Vkbur,
                            "Txtpv":y[0].Txtpv,
                            "Zterm":y[0].Zterm,
                            "Txtcp":y[0].Txtcp,
                            "Vtweg":y[0].Vtweg,
                            "Txtca":y[0].Txtca,
                            "oDireccion": [],
                            "oCondPago": [
                                {
                                    "Zterm": "C001",
                                    "Txtcp": "Al contado"
                                },
                                {
                                    "Zterm": y[0].Zterm,
                                    "Txtcp": y[0].Txtcp
                                }
                            ]
                        };
                        var count = 0;
                        y.forEach(function(value, index){
                            count ++;
                            value.posStras = count.toString();
                        });
                        jFamilia.oDireccion = y;

                        oClienteGroup.push(jFamilia);
                    });
                    that.oModelGetPedidoVenta.setProperty("/oClientePorVendedor", oClienteGroup);
                    that.oModelGetPedidoVenta.setProperty("/oMaterialTotal", oMateriales);
                    that.oModelGetPedidoVenta.setProperty("/oFamiliaMaterial", []);
                }else{
                    that.oModelGetPedidoVenta.setProperty("/oClientePorVendedor", []);
                    that.oModelGetPedidoVenta.setProperty("/oFamiliaMaterial", []);
                }

                if(!that.isEmpty(values[1].oResults[0])){
                    var oEstado = values[1].oResults;
                    that.oModelGetPedidoVenta.setProperty("/oEstado", oEstado);
                }else{
                    that.oModelGetPedidoVenta.setProperty("/oEstado", []);
                }

                if(!that.isEmpty(values[2].oResults[0])){
                    var oMotivo = values[2].oResults;
                    that.oModelGetPedidoVenta.setProperty("/oMotivo", oMotivo);
                }else{
                    that.oModelGetPedidoVenta.setProperty("/oMotivo", []);
                }
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
                    // var sCodeUser = '9600000068';
                    var sPath = jQuery.sap.getModulePath("tomapedido")+"/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/SelectionSet?$filter=(Kunn2 eq '"+sCodeUser+"')&$expand=NAVCUSTO,NAVMATER";
                    Services.getoDataERPSync(that, sPath, function (result) {
                        util.response.validateAjaxGetERPNotMessage(result, {
                            success: function (oData, message) {
                                oResp.sEstado = "S";
                                oResp.oResults = oData.data;
                                resolve(oResp);
                            },
                            error: function (message) {
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
        _getMotivo: function (sUser) {
			try{
				var user = sUser;
                var oResp = {
                    "sEstado": "S",
                    "oResults": models.JsonMotivo()
                };
				return new Promise(function (resolve, reject) {
                    resolve(oResp);
				});
			}catch(oError){
				that.getMessageBox("error", that.getI18nText("sErrorTry"));
			}
		},
        //Llamada de data
        
        //Limpiar
        _onClear: function (oEvent) {
            this._byId("dpDateFilterHasta").setEnabled(false);
            this.oModelPedidoVenta.setProperty("/PedidosCreados", []);
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
            if (this.isEmpty(sDesde)) {
                // aFilter.push(new Filter("Desde", "EQ", sDesde));
                that.getMessageBox("error", that.getI18nText("errorFechaDesde"));
                return;
            }
            if (this.isEmpty(sHasta)) {
                // aFilter.push(new Filter("Hasta", "EQ", sHasta));
                that.getMessageBox("error", that.getI18nText("errorFechaHasta"));
                return;
            }
            if (this.isEmpty(cbCliente)) {
                // aFilter.push(new Filter("Cliente", "EQ", cbCliente));
                that.getMessageBox("error", that.getI18nText("errorSelectClient"));
                return;
            }
            // if (!this.isEmpty(cbEstado)) {
            //     // aFilter.push(new Filter("Estado", "EQ", cbEstado));
            // }

            sap.ui.core.BusyIndicator.show(0);
            this.getValuesPedidoAS(sPath, aFilter, that);
        },
        getValuesPedidoAS: function (sPath, aFilter, that) {
            var filter = this.oModelPedidoVenta.getProperty("/DataGeneral/filter");
            var sDesde = "";
            var sHasta = "";
            var sEstado = "";
            var sCliente = "";
            var sCanal
            sDesde = this.formatDaySlDateRay(this.reformatDateString(filter.sDesde));
            sHasta = this.formatDaySlDateRay(this.reformatDateString(filter.sHasta));
            sCliente = filter.sCliente;

            if(!this.isEmpty(filter.sEstado)){
                sEstado = filter.sEstado;
            }
            
            var sPath = jQuery.sap.getModulePath("tomapedido")+
            "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/BuscaPedidoSet?$filter=Erdat ge '"+sDesde+"' and Erdat le '"+sHasta+"' "+
            "and Estado eq '"+sEstado+"' and Kunnr eq '"+sCliente+"' and Type eq 'L'&$expand=DetalleBuscaPedidoSet";
            Services.getoDataERPSync(that, sPath, function (result) {
                util.response.validateAjaxGetERPNotMessage(result, {
                    success: function (oData, message) {
                        var oResp = oData.data;
                        var oClientePorVendedor = that.oModelGetPedidoVenta.getProperty("/oClientePorVendedor");
                        var oPedido = [];

                        
                        oResp.forEach(function(value, index){
                            var jPedido = {
                                "codeCliente": value.Kunnr,
                                "pedido": value.Vbeln,
                                "razonsocial": "",
                                "Kdgrp": "",
                                "Txtfv": "",
                                "oDireccion": [],
                                "oCondPago": [],
                                "fechacrea": value.Erdat,
                                "tipodoc": value.Stcd1,
                                "importe": value.Netwr,
                                "comprobante": value.Xblnr,
                                "fechaentrega": value.Lfdat,
                                "estado": value.Estado,
                                "canal": value.Vtweg,
                                "icon": "sap-icon://pending",
                                "estate": "Warning",
                                "oMateriales": value.DetalleBuscaPedidoSet
                            };
                            var oFindCliente = oClientePorVendedor.find(item => item.Kunnr  === value.Kunnr);
                            if(oFindCliente){
                                jPedido.tipodoc = oFindCliente.Stcd1;
                                jPedido.razonsocial = oFindCliente.Namec;
                                jPedido.oDireccion = oFindCliente.oDireccion;
                                jPedido.oCondPago = oFindCliente.oCondPago;
                                jPedido.Kdgrp = oFindCliente.Kdgrp;
                                jPedido.Txtfv = oFindCliente.Txtfv;
                                oPedido.push(jPedido);
                            }
                        });

                        var cbCliente = that._byId("cbFilterCliente");
                        var oClienteSelected = cbCliente.getSelectedItem().getBindingContext("oModelGetPedidoVenta").getObject();
                        oPedido = oPedido.filter(function(value, index){
                            if(oClienteSelected.Vtweg === value.canal){
                                return value;
                            }else{
                                return !value;
                            }
                        });
                        that.oModelPedidoVenta.setProperty("/PedidosCreados", oPedido);
                        sap.ui.core.BusyIndicator.hide();
                    },
                    error: function (message) {
                        that.getMessageBox("error", that.getI18nText("warningInternet"));
                        sap.ui.core.BusyIndicator.hide();
                    }
                });
            });
        },
        _onPressDetailProduct: function(oEvent){
            var oSource = oEvent.getSource();
            var oParent = oSource.getParent();
            var jSelected = oParent.getBindingContext("oModelPedidoVenta").getObject();

            // if(jSelected.oMateriales.results.length === 0){
            //     that.getMessageBox("error", that.getI18nText("errorProductNoSearch"));
            //     return;
            // }

            var oMaterialTotal = that.oModelGetPedidoVenta.getProperty("/oMaterialTotal");
            sap.ui.core.BusyIndicator.show(0);
            Promise.all([that._getLineaCredito(jSelected), that._getDataDetail(jSelected)]).then((values) => {
                values[0].sCredito = values[0].CreditLimit;
                values[0].sConsumo = values[0].Amount;
                values[0].sSaldo = (parseFloat(values[0].sCredito) - parseFloat(values[0].sConsumo)).toString();
                var sStras = "";
                var sOrt01 = "";
                var sOrt02 = "";
                var sObs = "";
                if(!that.isEmpty(values[1])){
                    sStras = values[1].Stras;
                    sOrt01 = values[1].Ort01;
                    sOrt02 = values[1].Ort02;
                    sObs = values[1].Text;
                }

                var oLineaCredito = values[0];
                that.oModelPedidoVenta.setProperty("/DataGeneral/oSelectedLineaCredito", oLineaCredito);

                var oMaterialFilter = oMaterialTotal.filter(function(value,index){
                    if(jSelected.canal == value.Vtweg){
                        return value;
                    }else{
                        return !value;
                    }
                });

                var oMaterialesGroupPred = [];
                $.each(that._groupBy(oMaterialFilter,'Matnr'), function (x, y) {
                    var jMaterial = {};
                    var booleanPrecio = false;
                    y.forEach(function(value,index){
                        if(parseFloat(value.Kbetr)>0){
                            jMaterial = value;
                            booleanPrecio = true;
                        }
                    });
                    if(!booleanPrecio){
                        jMaterial = y[0]
                    }
                    oMaterialesGroupPred.push(jMaterial);
                });

                var oFamiliaMateriales = [];
                $.each(that._groupBy(oMaterialesGroupPred,'Codfa'), function (x, y) {
                    var jFamilia = {
                        "codeFamilia": y[0].Codfa,
                        "textFamilia": y[0].Txtfa,
                        "materiales": y
                    };
                    oFamiliaMateriales.push(jFamilia);
                });
                that.oModelGetPedidoVenta.setProperty("/oFamiliaMaterial", oFamiliaMateriales);
                that.oModelGetPedidoVenta.setProperty("/oMaterialTotalFilter", oMaterialFilter);

                var date = that.reformatDateString(jSelected.fechaentrega);
                var sFlete = "0";
                if(jSelected.canal === "10"){
                    if(jSelected.Kdgrp === "12"){
                        sFlete = "10";
                    }else if(jSelected.Kdgrp === "13"){ // falta poner menor a 450
                        sFlete = "10 por monto menor a 450";
                    }
                }
                var oChangeParameterSelected = {
                    "sNumeroPedido": jSelected.pedido,
                    "sTextDescContacto": "",
                    "sTextTelContacto": "",
                    "rucCliente": jSelected.tipodoc,
                    "codeCliente": jSelected.codeCliente,
                    "nameCliente": jSelected.razonsocial,
                    "codeCanal": jSelected.canal,
                    "TextCanal": "",
                    "codeGrupoCliente": jSelected.Kdgrp,
                    "textGrupoCliente": jSelected.Txtfv,
                    "codeDirecccion": "1",
                    "textDirecccion": sStras,
                    "sOrt01": sOrt01,
                    "sOrt02": sOrt02,
                    "oDireccion": jSelected.oDireccion,
                    "oCondPago": jSelected.oCondPago,
                    "codePuntoVenta": "",
                    "textPuntoVenta": "",
                    "codeCondPago": "",
                    "textCondPago": "",
                    "textFlete": sFlete,
                    "textFechaEntrega": date,
                    "codeComprobante": 0,
                    "textComprobante": jSelected.comprobante,
                    "textOrdenCompra": "",
                    "textObservacion": sObs,
                    "textPardm": "",
                    "textKundm": ""
                };

                that.oModelPedidoVenta.setProperty("/DataGeneral/sStatus", "M");
                that.oModelPedidoVenta.setProperty("/DataGeneral/sNumPedido", jSelected.pedido);
                that.oModelPedidoVenta.setProperty("/DataGeneral/oSelectedCliente", oChangeParameterSelected);

                var oMaterial=[];
                jSelected.oMateriales.results.forEach(function(value, index){
                    var jMaterial={
                        "Labst":"",
                        "Codfa":"",
                        "Kbetr":value.Precio,
                        "Matnr":value.Matnr,
                        "Maktg":"",
                        "Meins":"",
                        "Txtfa":"",
                        "Umrez":"",
                        "Vtweg":"",
                        "icon":"sap-icon://inbox",
                        "state":"Success",
                        "cantidad":value.Totca,
                        "total":  ((value.Precio * that.igv)*parseFloat(value.Totca)).toString(),
                        "descuentos":"0%",
                        "descuentosVolumen":"0%",
                        "status":"None",
                        "codeMotivo":"",
                        "descMotivo":""
                    };
                    var jFindMaterial = oMaterialFilter.find(item => item.Matnr  === value.Matnr);
                    if(jFindMaterial){
                        jMaterial.Codfa = jFindMaterial.Codfa;
                        jMaterial.Maktg = jFindMaterial.Maktg;
                        jMaterial.Meins = jFindMaterial.Meins;
                        jMaterial.Txtfa = jFindMaterial.Txtfa;
                        jMaterial.Umrez = jFindMaterial.Umrez;
                        jMaterial.Vtweg = jFindMaterial.Vtweg;
                        oMaterial.push(jMaterial);
                    }
                });
                that.oModelPedidoVenta.setProperty("/DataGeneral/oMaterial",oMaterial);
                sap.ui.core.BusyIndicator.hide(0);
                that.oRouter.navTo("Detail", {
                    app: "2"
                });
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
            var sCodeUser = oModelUser["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"].attributes[0].value;
            var oClienteGroup = [];
            sap.ui.core.BusyIndicator.show(0);
            Promise.all([this._getClientes(sCodeUser)]).then((values) => {
                if(!that.isEmpty(values[0].oResults[0])){
                    var oCliente = values[0].oResults[0].NAVCUSTO.results;
                    var oMateriales = values[0].oResults[0].NAVMATER.results;


                    if(values[0].sEstado != "E"){
                        $.each(that._groupBy(oCliente,'Kunnr'), function (x, y) {
                            var jFamilia = {
                                "Kunnr":y[0].Kunnr,
                                "Namec":y[0].Namec,
                                "Smtp_addr":y[0].Smtp_addr,
                                "Telf1":y[0].Telf1,
                                "Stcd1":y[0].Stcd1,
                                "Vkgrp":y[0].Vkgrp,
                                "Txtfv":y[0].Txtfv,
                                "Vkbur":y[0].Vkbur,
                                "Txtpv":y[0].Txtpv,
                                "Zterm":y[0].Zterm,
                                "Txtcp":y[0].Txtcp,
                                "Vtweg":y[0].Vtweg,
                                "Txtca":y[0].Txtca,
                                "oDireccion": [],
                                "oCondPago": [
                                    {
                                        "Zterm": "C001",
                                        "Txtcp": "Al contado"
                                    },
                                    {
                                        "Zterm": y[0].Zterm,
                                        "Txtcp": y[0].Txtcp
                                    }
                                ]
                            };
                            var count = 0;
                            y.forEach(function(value, index){
                                count ++;
                                value.posStras = count.toString();
                            });
                            jFamilia.oDireccion = y;

                            oClienteGroup.push(jFamilia);
                        });
                        that.oModelGetPedidoVenta.setProperty("/oClientePorVendedor", oClienteGroup);
                        
                        that.getMessageBox("success", that.getI18nText("successDataUpdate"));
                    }else{
                        that.getMessageBox("error", that.getI18nText("errorDataUpdate"));
                    }
                }else{
                    that.oModelGetPedidoVenta.setProperty("/oClientePorVendedor", []);
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
            var oMaterialTotal = that.oModelGetPedidoVenta.getProperty("/oMaterialTotal");
            sap.ui.core.BusyIndicator.show(0);
            Promise.all([]).then((values) => {
                that._dialogSelectClient.close();

                var oMaterialFilter = oMaterialTotal.filter(function(value,index){
                    if(oObjectSelected.Vtweg == value.Vtweg){
                        return value;
                    }else{
                        return !value;
                    }
                });

                var oMaterialesGroupPred = [];
                $.each(that._groupBy(oMaterialFilter,'Matnr'), function (x, y) {
                    var jMaterial = {};
                    var booleanPrecio = false;
                    y.forEach(function(value,index){
                        if(parseFloat(value.Kbetr)>0){
                            jMaterial = value;
                            booleanPrecio = true;
                        }
                    });
                    if(!booleanPrecio){
                        jMaterial = y[0]
                    }
                    oMaterialesGroupPred.push(jMaterial);
                });

                var oFamiliaMateriales = [];
                $.each(that._groupBy(oMaterialesGroupPred,'Codfa'), function (x, y) {
                    var jFamilia = {
                        "codeFamilia": y[0].Codfa,
                        "textFamilia": y[0].Txtfa,
                        "materiales": y
                    };
                    oFamiliaMateriales.push(jFamilia);
                });
                that.oModelGetPedidoVenta.setProperty("/oFamiliaMaterial", oFamiliaMateriales);
                that.oModelGetPedidoVenta.setProperty("/oMaterialTotalFilter", oMaterialFilter);


                that.setFragment("_dialogDetailCliente", this.frgIdDetailCliente, "DetailCliente", this);
                that._onClearComponentDetailClient();

                var date = that.reformatDateString(that.getYYYYMMDD(new Date()));
                var sFlete = "0";
                if(oObjectSelected.Vtweg === "10"){
                    if(oObjectSelected.Kdgrp === "12"){
                        sFlete = "10";
                    }else if(oObjectSelected.Kdgrp === "13"){ // falta poner menor a 450
                        sFlete = "10 por monto menor a 450";
                    }
                }
                var oChangeParameterSelected = {
                    "sNumeroPedido": "",
                    "sTextDescContacto": oObjectSelected.Smtp_addr,
                    "sTextTelContacto": oObjectSelected.Telf1,
                    "rucCliente": oObjectSelected.Stcd1,
                    "codeCliente": oObjectSelected.Kunnr,
                    "nameCliente": oObjectSelected.Namec,
                    "codeCanal": oObjectSelected.Vtweg,
                    "TextCanal": oObjectSelected.Txtca,
                    "codeGrupoCliente": oObjectSelected.Kdgrp,
                    "textGrupoCliente": oObjectSelected.Txtfv,
                    "codeDirecccion": "1",
                    "textDirecccion": oObjectSelected.Stras,
                    "oDireccion": oObjectSelected.oDireccion,
                    "oCondPago": oObjectSelected.oCondPago,
                    "codePuntoVenta": oObjectSelected.Vkbur,
                    "textPuntoVenta": oObjectSelected.Txtpv,
                    "codeCondPago": oObjectSelected.Zterm,
                    "textCondPago": oObjectSelected.Txtcp,
                    "textFlete": sFlete,
                    "textFechaEntrega": date,
                    "codeComprobante": 0,
                    "textComprobante": "",
                    "textOrdenCompra": "",
                    "textObservacion": "",
                    "textPardm": "",
                    "textKundm": ""
                };

                that.oModelPedidoVenta.setProperty("/DataGeneral/oSelectedCliente", oChangeParameterSelected);

                if(oObjectSelected.Stcd1.length == 11){
                    that._byId("frgIdDetailCliente--rbgComprobante").setSelectedIndex(1);
                }else{
                    that._byId("frgIdDetailCliente--rbgComprobante").setSelectedIndex(0);
                }

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

        _onPressCreatePedidoPrev: function(){
            var inGrupoCliente = this._byId("frgIdDetailCliente--inGrupoCliente");
            var slDirecciones = this._byId("frgIdDetailCliente--slDirecciones");
            var inPuntoVenta = this._byId("frgIdDetailCliente--inPuntoVenta");
            var inFlete = this._byId("frgIdDetailCliente--inFlete");
            // var inCondicionPago = this._byId("frgIdDetailCliente--inCondicionPago");
            var slCondicionPago = this._byId("frgIdDetailCliente--slCondicionPago");
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
            var sKeyCondPago = slCondicionPago.getSelectedKey();
            var sCondPago = slCondicionPago.getValue();
            
            if(this.isEmpty(sKeyDireccion)){
                that.getMessageBox("error", that.getI18nText("errorSelectDireccion"));
                return;
            }

            if(this.isEmpty(sKeyCondPago)){
                that.getMessageBox("error", that.getI18nText("errorSelectCondPago"));
                return;
            }

            if(this.isEmpty(sFechaEntrega)){
                this.getMessageBox("error", this.getI18nText("errorSelectFechaEntrega"));
                return;
            }

            if(this.isEmpty(sOrdenCompra)){
                this.getMessageBox("error", this.getI18nText("errorInputOrdenCompra"));
                return;
            }

            var oSelectedCliente = that.oModelPedidoVenta.getProperty("/DataGeneral/oSelectedCliente");
            var sPardm = slDirecciones.getSelectedItem().getBindingContext("oModelPedidoVenta").getObject().Pardm;
            var sKundm = slDirecciones.getSelectedItem().getBindingContext("oModelPedidoVenta").getObject().Kundm;

            utilUI.messageBox(this.getI18nText("sTextConfirm"),"C", function(value){
                if(value){
                    oSelectedCliente.codeDirecccion = sKeyDireccion;
                    oSelectedCliente.textDirecccion = sDireccion;
                    oSelectedCliente.codeCondPago = sKeyCondPago;
                    oSelectedCliente.textCondPago = sCondPago;
                    oSelectedCliente.textFechaEntrega = sFechaEntrega;
                    oSelectedCliente.codeComprobante = iKeyComprobante;
                    oSelectedCliente.textComprobante = sComprobante;
                    oSelectedCliente.textOrdenCompra = sOrdenCompra;
                    oSelectedCliente.textObservacion = sObservacion;
                    oSelectedCliente.textPardm = sPardm;
                    oSelectedCliente.textKundm = sKundm;
                        
                    Promise.all([that._getLineaCredito(oSelectedCliente)]).then((values) => {
                        var sNumPedido = "";
                        that.oModelPedidoVenta.setProperty("/DataGeneral/sStatus", "C");
                        that.oModelPedidoVenta.setProperty("/DataGeneral/sNumPedido", sNumPedido);
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oSelectedCliente", oSelectedCliente);

                        values[0].sCredito = values[0].CreditLimit;
                        values[0].sConsumo = values[0].Amount;
                        values[0].sSaldo = (parseFloat(values[0].sCredito) - parseFloat(values[0].sConsumo)).toString();

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
                    var sPath = jQuery.sap.getModulePath("tomapedido")+"/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/CreditoSet?$filter=(Kunnr eq '"+oValue.codeCliente+"' and Segme eq 'ZCR01')";
                    Services.getoDataERPSync(that, sPath, function (result) {
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
        _getDataDetail: function (oValue) {
			try{
				return new Promise(function (resolve, reject) {
                    var sPath = jQuery.sap.getModulePath("tomapedido")+"/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/ConsultaDatosEntregaSet?$filter=Vbeln eq '"+oValue.pedido+"'";
                    Services.getoDataERPSync(that, sPath, function (result) {
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

    });
});