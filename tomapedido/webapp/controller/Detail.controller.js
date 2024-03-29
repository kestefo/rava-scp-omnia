sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "tomapedido/controller/BaseController",
    "tomapedido/model/models",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    '../util/util',
    '../util/utilUI',
    "../services/Services",
    "../estructuras/Estructura"
], function (Controller, BaseController, models, Filter, FilterOperator, util, utilUI, Services, Estructura) {
    "use strict";

    var that, bValueHelpEquipment = false;
    return BaseController.extend("tomapedido.controller.Detail", {
        onInit: function () {
            that = this;
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getTarget("Detail").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

            this.frgIdAddProduct = "frgIdAddProduct";
            this.frgIdAddManualProduct = "frgIdAddManualProduct";
            this.frgIdLoadMasive = "frgIdLoadMasive";
            this.frgIdLoadMasiveDetail = "frgIdLoadMasiveDetail";
            this.frgIdAddEan = "frgIdAddEan";
            this.frgIdAddPromotions = "frgIdAddPromotions";
            this.frgIdEditProduct = "frgIdEditProduct";
            this.frgIdEditCombo = "frgIdEditCombo";
        },
        handleRouteMatched: function () {
            Promise.all([]).then(async values => {
                that.oModelPedidoVenta = this.getModel("oModelPedidoVenta");
                that.oModelGetPedidoVenta = this.getModel("oModelGetPedidoVenta");

                var oProductosSave = that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
                if (oProductosSave.length > 0) {
                    this.onConteoMaterial("S");
                } else {
                    that._byId("lTotalProductos").setText(this.currencyFormatTreeDig("0"));
                    that._byId("lCantidadProductos").setText(this.currencyFormatTreeDig("0"));
                    that._byId("lTotalProductosNot").setText(this.currencyFormatTreeDig("0"));
                    that._byId("lCantidadProductosNot").setText(this.currencyFormatTreeDig("0"));
                    this.onConteoMaterial("S");
                }
                that._byId("idIconTabBarDetail").setSelectedKey("keyDetail");
                that.oModelGetPedidoVenta.setProperty("/oMaterialEditSelected", []);
                // that.onFunctionDireccion();
            }).catch(function (oError) {
                sap.ui.core.BusyIndicator.hide(0);
            });
        },
        onAfterRendering: function () {
            var URL = "";
            // // if (mapType === "H") {
            // if (true) {
            //     URL = "https://mt.google.com/vt/lyrs=m&x={X}&y={Y}&z={LOD}"; //google layer for hybrid
            // } else {
            //     URL = "https://mt.google.com/vt/lyrs=s,m&x={X}&y={Y}&z={LOD}"; //google layer for satelite
            // }
            // var oGeoMap = this.getView().byId("vbi");
            // var oMapConfig = {
            //     "MapProvider":[
            //        {
            //           "name":"GMAP",
            //           "description":"Map Provider",
            //           "tileX":"256",
            //           "tileY":"256",
            //           "maxLOD":"20",
            //           "copyright":"Tiles Courtesy of Google Maps",
            //           "Source":[
            //              {
            //                 "id":"s1",
            //                 "url":URL
            //              }
            //           ]
            //        }
            //     ],
            //     "MapLayerStacks":[
            //        {
            //           "name":"GOOGLE",
            //           "MapLayer":{
            //              "name":"layer2",
            //              "refMapProvider":"GMAP",
            //              "opacity":"6.0",
            //              "colBkgnd":"RGB(255,255,255)"
            //           }
            //        }
            //     ]
            // }
            // oGeoMap.setMapConfiguration(oMapConfig);
            // oGeoMap.setRefMapLayerStack("GOOGLE");
            // oGeoMap.setInitialZoom(13);
        },
        onFunctionDireccion: function () {
            var geocoder = new google.maps.Geocoder();
            var oSelectedCliente = this.getModel("oModelPedidoVenta").getProperty("/DataGeneral/oSelectedCliente");
            var sDireccion = "";
            var oGeoMap = this.getView().byId("vbi");

            if (oSelectedCliente) {
                sDireccion = oSelectedCliente.textDirecccion;
                if (!this.isEmpty(sDireccion)) {
                    geocoder.geocode({
                        "address": sDireccion + ", Perú"
                    }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            var location = results[0].geometry.location;
                            var sSpots = location.lng().toString() + ";" + location.lat().toString() + ";0";
                            var sSpotsInverse = location.lat().toString() + ";" + location.lng().toString() + ";0";
                            var oSpots = [{
                                "pos": sSpots,
                                "tooltip": "Moscow",
                                "type": "Default",
                                "text": sDireccion
                            }];
                            that.getModel("oModelPedidoVenta").setProperty("/DataGeneral/Spots/items", oSpots);
                            oGeoMap.setInitialZoom(13);
                        } else {
                            oGeoMap.setVisible(false);
                        }
                    });
                }
            } else {
                oGeoMap.setVisible(false);
            }

        },
        _onPressNavButtonDetail: function () {
            var sStatus = that.oModelPedidoVenta.getProperty("/DataGeneral/sStatus");
            if (sStatus === "M") {
                var oDataSap = {
                    "Vbeln": that.oModelPedidoVenta.getProperty("/DataGeneral/sNumPedido"),
                    "Operator": "D",
                    "ResultBlockSet": [
                        {
                            "Vbeln": "",
                            "Type": "",
                            "Message": ""
                        }
                    ]
                };
                sap.ui.core.BusyIndicator.show(0);
                Promise.all([that._postBloqueoPedido(oDataSap)]).then((values) => {
                    this.oModelPedidoVenta.setProperty("/PedidosCreados", []);
                    this._onClearDataDetailClient();
                    this._byId("VBoxPrimeraTabla").setVisible(true);
                    this._byId("VBoxOctavaTabla").setVisible(false);
                    this._byId("idPromoSelectCant").setVisible(false);
                    this._byId("idPromoCant").setVisible(false);
                    this._byId("idPromoSelect").setVisible(false);
                    this.oRouter.navTo("Main");
                    sap.ui.core.BusyIndicator.hide(0);
                }).catch(function (oError) {
                    that.getMessageBox("error", that.getI18nText("errorSave"));
                    sap.ui.core.BusyIndicator.hide(0);
                });
            } else {
                this.oModelPedidoVenta.setProperty("/PedidosCreados", []);
                this._onClearDataDetailClient();
                this._byId("VBoxPrimeraTabla").setVisible(true);
                this._byId("VBoxOctavaTabla").setVisible(false);
                this._byId("idPromoSelectCant").setVisible(false);
                this._byId("idPromoCant").setVisible(false);
                this._byId("idPromoSelect").setVisible(false);
                this.oRouter.navTo("Main");
            }
        },
        _postBloqueoPedido: function (oDataSap) {
            try {
                return new Promise(function (resolve, reject) {
                    var urlget = jQuery.sap.getModulePath("tomapedido") + "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/";
                    var urlpost = jQuery.sap.getModulePath("tomapedido") + "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/HeaderBlockSet";

                    Services.postoDataERPAsync(that, urlget, urlpost, oDataSap, function (result) {
                        util.response.validateAjaxGetERPNotMessage(result, {
                            success: function (oData, message) {
                                resolve(oData.data);
                            },
                            error: function (message) {
                                reject(message);
                            }
                        });
                    });
                });
            } catch (oError) {
                that.getMessageBox("error", that.getI18nText("sErrorTry"));
            }
        },

        //Add Product
        _onPressAddProduct: function () {
            that._byId("tbProductos").removeSelections(true);
            this.setFragment("_dialogAddProduct", this.frgIdAddProduct, "AddProduct", this);
        },
        _onPressAddManual: function () {
            this["_dialogAddProduct"].close();
            this.setFragment("_dialogAddManualProduct", this.frgIdAddManualProduct, "AddManualProduct", this);
            this._onClearComponentAddManualProduct();
            this._onClearDataAddManualProduct();
        },
        _onChangeFamilia: function (oEvent) {
            var kSelected = oEvent.getSource().getSelectedKey();
            var sSelected = oEvent.getSource().getValue();
            if (kSelected !== '') {
                oEvent.getSource().setValue(sSelected);
            } else {
                if (oEvent.getSource().getValue()) {
                    this.getMessageBox("error", this.getI18nText("sErrorSelect"));
                }
                oEvent.getSource().setValue("");
            }

            this._byId("frgIdAddManualProduct--tbMaterialesManual").setVisible(false);
            this._byId("frgIdAddManualProduct--btnNextAddManualProduct").setVisible(true);
            this._byId("frgIdAddManualProduct--btnAcceptAddManualProduct").setVisible(false);
            // this._byId("frgIdAddManualProduct--tbMaterialesManual").removeSelections(true);
            this.oModelGetPedidoVenta.setProperty("/oMaterialFamiliaSelected", []);
        },
        _onSelectFamilia: function (oEvent) {
            var oSource = this._byId("frgIdAddManualProduct--slFamilia");
            var oSelectedDireccion = that.oModelGetPedidoVenta.getProperty("/oSelectedDireccion");

            var kSelected = oSource.getSelectedKey();
            if (this.isEmpty(kSelected)) {
                this._onClearComponentAddManualProduct();
                this._onClearDataAddManualProduct();
                this.getMessageBox("error", this.getI18nText("sErrorSelect"));
            } else {
                sap.ui.core.BusyIndicator.show(0);
                var oSelectedItem = oSource.getSelectedItem();
                var oObjectSelectedItem = oSelectedItem.getBindingContext("oModelGetPedidoVenta").getObject();

                var oDetailStockSet = [];
                let oMaterial = [];
                oObjectSelectedItem.materiales.forEach(async function (value, index) {
                    var jValue = {
                        "Type": "G",
                        "Matnr": value.Matnr,
                        "Meins": value.Meins,
                        "Werks": "1020",
                        "Lgort": "0201",
                        "Labst": "0"
                    }

                    const jValueMat = {
                        "Kunnr": value.Kunnr,
                        "Ean11": value.Ean11,
                        "Kdgrp": value.Kdgrp,
                        "Codfa": value.Codfa,
                        "Kbetr": value.Kbetr,
                        "Labst": value.Labst,
                        "Maktg": value.Maktg,
                        "Matnr": value.Matnr,
                        "Meins": value.Meins,
                        "Txtfa": value.Txtfa,
                        "Umrez": value.Umrez,
                        "Vtweg": value.Vtweg
                    };
                    oDetailStockSet.push(jValue)
                    oMaterial.push(jValueMat);
                });

                Promise.all([that._getStockMateriales(oDetailStockSet)]).then((values) => {
                    var oStock = values[0].DetailStockSet.results;
                    var oMaterialPrev = that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
                    oMaterial.forEach(async function (value, index) {
                        var oFindExist = oMaterialPrev.find(item => item.Matnr === value.Matnr && item.Meins === value.Meins && item.tipo === "MAT");
                        var oFindStock = oStock.find(item => item.Matnr === value.Matnr && item.Meins === value.Meins);
                        value.Labst = "0";
                        value.icon = "sap-icon://outbox";
                        value.state = "Information",
                            value.cantidad = "0";
                        if (!that.isEmpty(oFindStock)) {
                            // if(!that.isEmpty(oFindExist)){
                            //     value.Labst = ( parseFloat(oFindStock.Labst) - parseFloat(oFindExist.cantidad) ).toFixed(3);
                            // }else{
                            value.Labst = oFindStock.Labst;
                            // }
                        }
                    });

                    that._byId("frgIdAddManualProduct--tbMaterialesManual").setVisible(true);
                    that._byId("frgIdAddManualProduct--btnNextAddManualProduct").setVisible(false);
                    that._byId("frgIdAddManualProduct--btnAcceptAddManualProduct").setVisible(true);
                    // that._byId("frgIdAddManualProduct--tbMaterialesManual").removeSelections(true);
                    that.oModelGetPedidoVenta.setProperty("/oMaterialFamiliaSelected", oMaterial);
                    that._byId("frgIdAddManualProduct--tbMaterialesManual").getBinding("items").filter([]);
                    sap.ui.core.BusyIndicator.hide(0);
                }).catch(function (oError) {
                    console.log(oError);
                    that.getMessageBox("error", that.getI18nText("errorData"));
                    sap.ui.core.BusyIndicator.hide(0);
                });
            }
        },
        _getStockMateriales: function (oDetailStockSet) {
            try {
                return new Promise(function (resolve, reject) {
                    var urlget = jQuery.sap.getModulePath("tomapedido") + "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/";
                    var urlpost = jQuery.sap.getModulePath("tomapedido") + "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/OperationSet";
                    var oData = {
                        "Type": "G",
                        "DetailStockSet": oDetailStockSet
                    };

                    Services.postoDataERPAsync(that, urlget, urlpost, oData, function (result) {
                        util.response.validateAjaxGetERPNotMessage(result, {
                            success: function (oData, message) {
                                resolve(oData.data);
                            },
                            error: function (message) {
                                reject(message);
                            }
                        });
                    });
                });
            } catch (oError) {
                that.getMessageBox("error", that.getI18nText("sErrorTry"));
            }
        },
        _onLiveChangeCantidad: function (oEvent) {
            var oSource = oEvent.getSource();
            var oParent = oSource.getParent();

            var values = oSource.getValue();
            var regex = /[^\d]/g;
            var x = values.replace(/[^\d]/g, '');
            if (values.match(regex)) {
                var x = values;
            } else {
                var x = values.substring(0, values.length - 1);
            }
            var x = parseInt(values);
            var sValueUsed = isNaN(x) ? '0' : x;

            var oModelContext = oParent.getBindingContext("oModelGetPedidoVenta");
            var oObject = oModelContext.getObject();
            if (parseInt(oObject.Labst) >= parseInt(sValueUsed)) {
                oObject.state = "Success";
                oObject.icon = "sap-icon://inbox";
                oSource.setValue(sValueUsed);
            } else {
                oObject.state = "Information";
                oObject.icon = "sap-icon://outbox";
                that.getMessageBox("error", that.getI18nText("errorSupPermitido"));
                oSource.setValue("0");
            }


        },
        _onAcceptProductManual: function (oEvent) {
            var oSource = oEvent.getSource();
            var tbMaterialesManual = this._byId("frgIdAddManualProduct--tbMaterialesManual");
            var oMaterialesSelected = [];

            // var oSelectItems = tbMaterialesManual.getItems();
            var oSelectItems = that.oModelGetPedidoVenta.getProperty("/oMaterialFamiliaSelected");
            if (oSelectItems.length == 0) {
                that.getMessageBox("error", that.getI18nText("errorSelectProduct"));
                return;
            }

            oSelectItems.forEach(function (value, index) {
                // var jObject = value.getBindingContext("oModelGetPedidoVenta").getObject();
                var jObject = value;
                if (parseFloat(jObject.cantidad) > 0) {
                    oMaterialesSelected.push(jObject);
                }
            });

            if (oMaterialesSelected.length === 0) {
                that.getMessageBox("error", that.getI18nText("errorNotCant"));
                return;
            }

            var oMaterialPrev = this.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
            var oMaterial = [];
            var booleanProm = false;
            oMaterialPrev.forEach(function (value, index) {
                oMaterial.push(value);
                if (value.tipo === "PROFV" || value.tipo === "PROVEN" || value.tipo === "PROVM" || value.tipo === "PROVV" || value.tipo === "PROOP"
                    || value.tipo === "PROCLI" || value.tipo === "PROPV" || value.tipo === "PROCOM" || value.tipo === "PROCOMH") {

                    booleanProm = true;

                }
            });

            var booleanRepeat = false;
            var oMaterialRepeat = []
            oMaterialesSelected.forEach(function (value, index) {
                var booleanRepeatLocal = false;
                oMaterial.forEach(function (value2, index2) {
                    if (value.Matnr === value2.Matnr && value2.tipo === "MAT") {
                        booleanRepeat = true;
                        booleanRepeatLocal = true;
                        value2.cantidad = value.cantidad;
                        value2.cantidadRecalculo = value.cantidad;
                        oMaterialRepeat.push(value2);
                    }
                });
                if (booleanRepeatLocal) {
                    // oMaterialRepeat.push( (parseFloat(value.Matnr)).toString() );
                }
            });

            oMaterialesSelected.forEach(function (value, index) {
                //6/12/2022
                // value.total = (parseFloat(value.cantidad) * (parseFloat(value.Kbetr)*that.igv)).toString();
                value.total = "0";
                value.totalSinIGV = "0";
                value.descuentos = "0%";
                value.descuentosVolumen1 = "0%";
                value.descuentosVolumen2 = "0%";
                value.status = "None";
                value.codeMotivo = "";
                value.descMotivo = "";
                value.tipo = "MAT";
                value.MatnrPrinc = "";
                value.PosnrPrinc = "";
                //6/12/2022
                // oMaterial.push(value);
            });


            if (booleanRepeat) {
                if (booleanProm) {
                    utilUI.messageBox(this.getI18nText("errorProductRepeat"), "I", function (value) {
                        if (value) {
                            var sStatus = that.oModelPedidoVenta.getProperty("/DataGeneral/sStatus");
                            if (sStatus === "M") {
                                that._onPressDeletePromotionsNotComb();
                            } else if (sStatus === "C") {
                                that._onPressDeletePromotions();
                            }
                            that._onPressDeleteBonificacion(oMaterialRepeat);

                            var oMaterialPrevRepeat = [];
                            that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial").forEach(function (value) {
                                oMaterialPrevRepeat.push(value)
                            });

                            that._onFunctionValidateMaterial(oMaterialesSelected, oMaterialPrevRepeat);
                            that._onClearDataAddManualProduct();
                            that._onClearComponentAddManualProduct();
                            oSource.getParent().close();
                        }
                    });
                } else {
                    that._onPressDeleteBonificacion(oMaterialRepeat);

                    var oMaterialPrevRepeat = [];
                    that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial").forEach(function (value) {
                        oMaterialPrevRepeat.push(value)
                    });

                    that._onFunctionValidateMaterial(oMaterialesSelected, oMaterialPrevRepeat);
                    that._onClearDataAddManualProduct();
                    that._onClearComponentAddManualProduct();
                    oSource.getParent().close();
                }
            } else {
                if (booleanProm) {
                    utilUI.messageBox(this.getI18nText("errorProductNoRepeat"), "I", function (value) {
                        if (value) {
                            var sStatus = that.oModelPedidoVenta.getProperty("/DataGeneral/sStatus");
                            if (sStatus === "M") {
                                that._onPressDeletePromotionsNotComb();
                            } else if (sStatus === "C") {
                                that._onPressDeletePromotions();
                            }

                            var oMaterialPrev2 = that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
                            var oMaterial2 = [];
                            oMaterialPrev2.forEach(function (value) {
                                oMaterial2.push(value);
                            });
                            that._onFunctionValidateMaterial(oMaterialesSelected, oMaterial2);

                            that._onClearDataAddManualProduct();
                            that._onClearComponentAddManualProduct();
                            oSource.getParent().close();
                        }
                    });
                } else {
                    this._onFunctionValidateMaterial(oMaterialesSelected, oMaterial);

                    this._onClearDataAddManualProduct();
                    this._onClearComponentAddManualProduct();
                    oSource.getParent().close();
                }

            }
        },
        _onPressAddEan: function () {
            this["_dialogAddProduct"].close();
            this.setFragment("_dialogAddEan", this.frgIdAddEan, "AddEan", this);

            this._onClearComponentDialogEan();
            this._onClearDataDialogEan()
        },
        _onPressSearchEan: function () {
            var sValueCode = this._byId("frgIdAddEan--inCodeEan").getValue();
            if (this.isEmpty(sValueCode)) {
                this.getMessageBox("error", that.getI18nText("errorNotProduct"));
                return;
            }
            var oMaterialTotalFilter = that.oModelGetPedidoVenta.getProperty("/oMaterialTotalFilter");
            var sValueCodeFormat = this.zfill(sValueCode, 18);
            var oMaterialEan = [];
            var oDetailStockSet = [];
            oMaterialTotalFilter.forEach(function (value, index) {
                if (value.Ean11 === sValueCode) {
                    var jValue = {
                        "Type": "G",
                        "Matnr": value.Matnr,
                        "Meins": value.Meins,
                        "Werks": "1020",
                        "Lgort": "0201",
                        "Labst": "0"
                    }
                    oMaterialEan.push(value);
                    oDetailStockSet.push(jValue);
                }
            });

            if (oMaterialEan.length === 0) {
                this.getMessageBox("error", that.getI18nText("errorNotProductSearch"));
                return;
            }

            Promise.all([that._getStockMateriales(oDetailStockSet)]).then((values) => {
                var oStock = values[0].DetailStockSet.results;
                oMaterialEan.forEach(async function (value, index) {
                    var oFindStock = oStock.find(item => item.Matnr === value.Matnr && item.Meins === value.Meins);
                    value.Labst = "0";
                    value.icon = "sap-icon://outbox";
                    value.state = "Information",
                        value.cantidad = "0";
                    if (!that.isEmpty(oFindStock)) {
                        value.Labst = oFindStock.Labst;
                    }
                });
                this.oModelGetPedidoVenta.setProperty("/oMaterialEanSelected", oMaterialEan);
            }).catch(function (oError) {
                console.log(oError);
                that.getMessageBox("error", that.getI18nText("errorData"));
                sap.ui.core.BusyIndicator.hide(0);
            });
        },
        _onAcceptProductEan: function (oEvent) {
            var oSource = oEvent.getSource();
            var tbMaterialesManual = this._byId("frgIdAddEan--tbMaterialesEan");
            var oMaterialesSelected = [];

            var oSelectItems = tbMaterialesManual.getItems();
            if (oSelectItems.length == 0) {
                that.getMessageBox("error", that.getI18nText("errorSelectProduct"));
                return;
            }

            oSelectItems.forEach(function (value, index) {
                var jObject = value.getBindingContext("oModelGetPedidoVenta").getObject();
                if (parseFloat(jObject.cantidad) > 0) {
                    oMaterialesSelected.push(jObject);
                }
            });

            if (oMaterialesSelected.length === 0) {
                that.getMessageBox("error", that.getI18nText("errorNotCant"));
                return;
            }

            var oMaterialPrev = this.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
            var oMaterial = [];
            var booleanProm = false;
            oMaterialPrev.forEach(function (value, index) {
                oMaterial.push(value);
                if (value.tipo === "PROFV" || value.tipo === "PROVEN" || value.tipo === "PROVM" || value.tipo === "PROVV" || value.tipo === "PROOP"
                    || value.tipo === "PROCLI" || value.tipo === "PROPV" || value.tipo === "PROCOM" || value.tipo === "PROCOMH") {

                    booleanProm = true;

                }
            });

            var booleanRepeat = false;
            var oMaterialRepeat = []
            oMaterialesSelected.forEach(function (value, index) {
                var booleanRepeatLocal = false;
                oMaterial.forEach(function (value2, index2) {
                    if (value.Matnr === value2.Matnr && value2.tipo === "MAT") {
                        booleanRepeat = true;
                        booleanRepeatLocal = true;
                        value2.cantidad = value.cantidad;
                        value2.cantidadRecalculo = value.cantidad;
                        oMaterialRepeat.push(value2);
                    }
                });
                if (booleanRepeatLocal) {
                    // oMaterialRepeat.push( (parseFloat(value.Matnr)).toString() );
                }
            });

            oMaterialesSelected.forEach(function (value, index) {
                delete value["__metadata"];
                // value.total = (parseFloat(value.cantidad) * (parseFloat(value.Kbetr)*that.igv)).toString();
                value.total = "0";
                value.totalSinIGV = "0";
                value.descuentos = "0%";
                value.descuentosVolumen1 = "0%";
                value.descuentosVolumen2 = "0%";
                value.status = "None";
                value.codeMotivo = "";
                value.descMotivo = "";
                value.tipo = "MAT";
                value.PosnrPrinc = "";
                value.MatnrPrinc = "";
                //6/12/2022
                // oMaterial.push(value);
            });

            if (booleanRepeat) {
                if (booleanProm) {
                    utilUI.messageBox(this.getI18nText("errorProductRepeat"), "I", function (value) {
                        if (value) {
                            var sStatus = that.oModelPedidoVenta.getProperty("/DataGeneral/sStatus");
                            if (sStatus === "M") {
                                that._onPressDeletePromotionsNotComb();
                            } else if (sStatus === "C") {
                                that._onPressDeletePromotions();
                            }
                            that._onPressDeleteBonificacion(oMaterialRepeat);

                            var oMaterialPrevRepeat = [];
                            that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial").forEach(function (value) {
                                oMaterialPrevRepeat.push(value)
                            });

                            that._onFunctionValidateMaterial(oMaterialesSelected, oMaterialPrevRepeat);
                            oSource.getParent().close();
                        }
                    });
                } else {
                    that._onPressDeleteBonificacion(oMaterialRepeat);

                    var oMaterialPrevRepeat = [];
                    that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial").forEach(function (value) {
                        oMaterialPrevRepeat.push(value)
                    });

                    that._onFunctionValidateMaterial(oMaterialesSelected, oMaterialPrevRepeat);
                    oSource.getParent().close();
                }
            } else {
                if (booleanProm) {
                    utilUI.messageBox(this.getI18nText("errorProductNoRepeat"), "I", function (value) {
                        if (value) {
                            var sStatus = that.oModelPedidoVenta.getProperty("/DataGeneral/sStatus");
                            if (sStatus === "M") {
                                that._onPressDeletePromotionsNotComb();
                            } else if (sStatus === "C") {
                                that._onPressDeletePromotions();
                            }
                            var oMaterialPrev2 = that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
                            var oMaterial2 = [];
                            oMaterialPrev2.forEach(function (value) {
                                oMaterial2.push(value);
                            });
                            that._onFunctionValidateMaterial(oMaterialesSelected, oMaterial2);
                        }
                    });
                } else {
                    this._onFunctionValidateMaterial(oMaterialesSelected, oMaterial);
                    oSource.getParent().close();
                }
            }

        },
        _onPressLoadMasive: function () {
            this["_dialogAddProduct"].close();
            var oModelHtml = {
                HTML:
                    "<p>" + this.getI18nText("textSegundoCarga") +
                    "<a style=\"color:blue; font-weight:600;\">" + this.getI18nText("textTerceroCarga") +
                    "</a> " + this.getI18nText("textCuartoCarga") + "</p>"
            }
            this.oModelPedidoVenta.setProperty("/textHtml", oModelHtml);
            this._onClearDataDialogMasive();
            this.setFragment("_dialogLoadMasive", this.frgIdLoadMasive, "LoadMasive", this);
        },
        _onImportPress: function (oEvent) {
            console.log(oEvent);
            var pUpload = $.Deferred();
            var file = oEvent.getParameter("files")[0];
            if (file.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && file.type != "application/vnd.ms-excel") {
                that.getMessageBox("error", that.getI18nText("msgErrorFormat"));
                return;
            }

            this.getModel("oModelPedidoVenta").setProperty("/DataGeneral/oMaterialSelectMasive/titulo", file.name);

            if (file && window.FileReader) {
                var reader = new FileReader();
                reader.onload = function (evt) {

                    function arrayBufferToBase64(buffer) {
                        var binary = '';
                        var bytes = new Uint8Array(buffer);
                        var len = bytes.byteLength;
                        for (var i = 0; i < len; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        return binary;
                    }

                    var result = {};
                    var data;
                    var arr;
                    var xlsx;
                    data = evt.target.result;
                    //var xlsx = XLSX.read(data, {type: 'binary'});
                    arr = arrayBufferToBase64(data); //String.fromCharCode.apply(null, new Uint8Array(data));
                    xlsx = XLSX.read(btoa(arr), {
                        type: 'base64'
                    });
                    result = xlsx.Strings;
                    result = {};
                    xlsx.SheetNames.forEach(function (sheetName) {
                        var rObjArr = XLSX.utils.sheet_to_row_object_array(xlsx.Sheets[sheetName]);
                        if (rObjArr.length > 0) {
                            result[sheetName] = rObjArr;
                        }
                    });
                    var contenido = result[xlsx.SheetNames[0]];
                    pUpload.resolve(contenido);
                }.bind(this);
                reader.readAsArrayBuffer(file);
            }

            pUpload.then(function (value) {
                var oDataCampos = {};
                oDataCampos.aItems = [];

                var titulo = that.getModel("oModelPedidoVenta").getProperty("/DataGeneral/oMaterialSelectMasive/titulo");
                var indiceTotus = titulo.indexOf("TOTTUS");
                var indiceAruma = titulo.indexOf("ARUMA");
                var indiceInka = titulo.indexOf("INKA");
                var indiceSuper = titulo.indexOf("SUPER");

                if (indiceTotus == -1 && indiceAruma == -1 && indiceInka == -1 && indiceSuper == -1) {
                    that.getMessageBox("error", that.getI18nText("errorNoExcelSave"));
                    return
                }

                value.forEach(function (item) {
                    var indiceTotus = titulo.indexOf("TOTTUS");
                    var indiceAruma = titulo.indexOf("ARUMA");
                    var indiceInka = titulo.indexOf("INKA");
                    var indiceSuper = titulo.indexOf("SUPER");
                    item.eanXsl = "";
                    item.precioUnidXsl = "0";
                    item.subtotalXsl = "0";
                    item.solXsl = "0";
                    item.codigo = "";
                    item.descripcion = "";
                    item.status = "";
                    item.descripcionStatus = "";
                    item.codeMotivo = "";
                    item.descMotivo = "";
                    if (indiceTotus != -1 || indiceAruma != -1) {
                        item.eanXsl = item.EAN;
                        item.codigo = item[that.getI18nText("sCodeTottus")];
                        item.descripcion = item[that.getI18nText("sDescTottus")];
                        item.precioUnidXsl = item[that.getI18nText("sPrecioUnidTottus")];
                        item.solXsl = item[that.getI18nText("sSolTottus")];
                        if (that.isEmpty(item.precioUnidXsl)) {
                            item.precioUnidXsl = "0"
                        }
                        if (that.isEmpty(item.solXsl)) {
                            item.solXsl = "0"
                        }
                        // item.subtotalXsl = item[that.getI18nText("sSubTotalTottus")];
                        item.subtotalXsl = ((parseFloat(item.precioUnidXsl) * that.igv) * parseFloat(item.precioUnidXsl)).toString();
                    } else if (indiceInka != -1) {
                        item.eanXsl = item.EAN;
                        item.codigo = item[that.getI18nText("sCodeInka")];
                        item.descripcion = item[that.getI18nText("sDescInka")];
                        item.precioUnidXsl = item[that.getI18nText("sPrecioUnidInka")];
                        item.solXsl = item[that.getI18nText("sSolInka")];
                        if (that.isEmpty(item.precioUnidXsl)) {
                            item.precioUnidXsl = "0"
                        }
                        if (that.isEmpty(item.solXsl)) {
                            item.solXsl = "0"
                        }
                        // item.subtotalXsl = item[that.getI18nText("sSubTotalInka")];
                        item.subtotalXsl = ((parseFloat(item.precioUnidXsl) * that.igv) * parseFloat(item.precioUnidXsl)).toString();
                    } else if (indiceSuper != -1) {
                        item.eanXsl = item.EAN;
                        item.codigo = item[that.getI18nText("sCodeSuper")];
                        item.descripcion = item[that.getI18nText("sDescSuper")];
                        item.precioUnidXsl = item[that.getI18nText("sPrecioUnidSuper")];
                        item.solXsl = item[that.getI18nText("sSolSuper")];
                        if (that.isEmpty(item.precioUnidXsl)) {
                            item.precioUnidXsl = "0"
                        }
                        if (that.isEmpty(item.solXsl)) {
                            item.solXsl = "0"
                        }
                        // item.subtotalXsl = item[that.getI18nText("sSubTotalSuper")];
                        item.subtotalXsl = ((parseFloat(item.precioUnidXsl) * that.igv) * parseFloat(item.precioUnidXsl)).toString();
                    } else {
                        item.codigo = "";
                        item.descripcion = "";
                        item.eanXsl = item.EAN;
                        item.precioUnidXsl = "0";
                        item.subtotalXsl = "0";
                        item.solXsl = "0";
                    }
                }.bind(this));

                that.getModel("oModelPedidoVenta").setProperty("/DataGeneral/oMaterialSelectMasive/oDataCargadaPrev", value);
                that.getMessageBox("success", that.getI18nText("msgGeneraImport"));
            }.bind(this));
        },
        _onNextMasive: function (oEvent) {
            var oSource = oEvent.getSource();
            var oMaterialSelectMasive = this.getModel("oModelPedidoVenta").getProperty("/DataGeneral/oMaterialSelectMasive");
            var titulo = oMaterialSelectMasive.titulo;
            var oDataCargadaPrev = oMaterialSelectMasive.oDataCargadaPrev;

            if (oDataCargadaPrev.length === 0) {
                this.getMessageBox("error", this.getI18nText("errorNotProductMasive"));
                return;
            }

            var oMaterialTotalFilter = that.oModelGetPedidoVenta.getProperty("/oMaterialTotalFilter");
            var oMaterialEan = [];
            var oDetailStockSet = [];
            oDataCargadaPrev.forEach(function (value, index) {
                var oFindStock = oMaterialTotalFilter.find(item => item.Ean11 === value.eanXsl);
                value.Kbetr = "0";
                value.Matnr = "";
                value.Meins = "";
                value.Kunnr = "";
                value.Txtfa = "";
                value.Vtweg = "";
                value.Umrez = "";
                value.Ean11 = "";
                value.Kdgrp = "";
                if (!that.isEmpty(oFindStock)) {
                    value.Kbetr = oFindStock.Kbetr;
                    value.descripcion = oFindStock.Maktg;
                    value.Matnr = oFindStock.Matnr;
                    value.Meins = oFindStock.Meins;
                    value.Kunnr = oFindStock.Kunnr;
                    value.Txtfa = oFindStock.Txtfa;
                    value.Vtweg = oFindStock.Vtweg;
                    value.Umrez = oFindStock.Umrez;
                    value.Ean11 = oFindStock.Ean11;
                    value.Kdgrp = oFindStock.Kdgrp;
                    var jValue = {
                        "Type": "G",
                        "Matnr": oFindStock.Matnr,
                        "Meins": oFindStock.Meins,
                        "Werks": "1020",
                        "Lgort": "0201",
                        "Labst": "0"
                    }
                    oDetailStockSet.push(jValue)
                }
                oMaterialEan.push(value);
            });

            sap.ui.core.BusyIndicator.show(0);
            Promise.all([that._getStockMateriales(oDetailStockSet)]).then((values) => {
                var oStock = values[0].DetailStockSet.results;
                var cont = 0;
                oMaterialEan.forEach(async function (value, index) {
                    cont++;
                    value.num = cont;
                    var oFindStock = oStock.find(item => item.Matnr === value.Matnr && item.Meins === value.Meins);
                    value.Labst = "0";
                    value.solSap = "0";
                    value.precioUnidSap = value.Kbetr;
                    value.subtotalSap = "0";
                    if (!that.isEmpty(oFindStock)) {
                        value.Labst = oFindStock.Labst;
                        value.solSap = oFindStock.Labst;
                        value.subtotalSap = (parseFloat(value.precioUnidSap) * parseFloat(value.solSap)).toString();
                    }
                });

                oMaterialEan.forEach(async function (value, index) {
                    value.status = "None";
                    value.descripcionStatus = "OK";
                    value.statusPrecio = "None";
                    value.statusStock = "None";
                    value.statusNoProduct = "S";
                    value.statusMotivo = "E";

                    if (that.isEmpty(value.Matnr)) {
                        value.status = "Error";
                        value.statusNoProduct = "E";
                        value.descripcionStatus = that.getI18nText("sDescStatusNoProduct");
                    } else {
                        var arrMsg = [];

                        if (parseFloat(value.precioUnidXsl) != parseFloat(value.precioUnidSap)) {
                            value.status = "Error";
                            value.statusNoProduct = "S";
                            value.statusPrecio = "Error";
                            arrMsg.push(that.getI18nText("sDescStatusNoPrec"));
                        }

                        if (parseFloat(value.solXsl) > parseFloat(value.solSap)) {
                            value.status = "Error";
                            value.statusNoProduct = "S";
                            value.statusStock = "Error";
                            arrMsg.push(that.getI18nText("sDescStatusNoStock"));
                        }

                        if (arrMsg.length > 0) {
                            value.descripcionStatus = arrMsg.join();
                        }

                        if (value.statusNoProduct === "E") {
                            value.statusMotivo = "E"
                        } else {
                            if (value.statusPrecio === "Error" || value.statusStock === "Error") {
                                value.statusMotivo = "S"
                            }
                        }

                    }
                });

                that.getModel("oModelPedidoVenta").setProperty("/DataGeneral/oMaterialSelectMasive/oDataCargadaMost", oMaterialEan);

                sap.ui.core.BusyIndicator.hide(0);
                oSource.getParent().close();
                that.setFragment("_dialogLoadMasiveDetail", that.frgIdLoadMasiveDetail, "LoadMasiveDetail", that);
            }).catch(function (oError) {
                console.log(oError);
                that.getMessageBox("error", that.getI18nText("errorData"));
                sap.ui.core.BusyIndicator.hide(0);
            });
        },
        _onAcceptProductMasive: function (oEvent) {
            var oSource = oEvent.getSource();
            var tbMaterialesMasive = this._byId("frgIdLoadMasiveDetail--tbMaterialesMasive");
            var oMaterialesSelected = [];
            var oMaterialesSelectedEnv = [];


            var oSelectItems = tbMaterialesMasive.getItems();
            if (oSelectItems.length == 0) {
                that.getMessageBox("error", that.getI18nText("errorSelectProduct"));
                return;
            }

            oSelectItems.forEach(function (value, index) {
                var jObject = value.getBindingContext("oModelPedidoVenta").getObject();
                if (parseFloat(jObject.solXsl) > 0 && jObject.statusNoProduct == "S") {
                    oMaterialesSelected.push(jObject);
                }
            });

            if (oMaterialesSelected.length === 0) {
                that.getMessageBox("error", that.getI18nText("errorNotCant"));
                return;
            }

            var oMaterialPrev = this.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
            var oMaterial = [];
            oMaterialPrev.forEach(function (value) {
                oMaterial.push(value);
            });
            var booleanRepeat = false;
            var oMaterialRepeat = []
            oMaterialesSelected.forEach(function (value, index) {
                var booleanRepeatLocal = false;
                oMaterial.forEach(function (value2, index2) {
                    if (value.Matnr === value2.Matnr && value2.tipo === "MAT") {
                        booleanRepeat = true;
                        booleanRepeatLocal = true;
                    }
                });
                if (booleanRepeatLocal) {
                    oMaterialRepeat.push((parseFloat(value.Matnr)).toString());
                }
            });

            if (booleanRepeat) {
                that.getMessageBox("error", that.getI18nText("errorProductRepeatNotCont") + "\n" + oMaterialRepeat.join());
                return;
            }

            var booleanMotivo = false;
            oMaterialesSelected.forEach(function (value, index) {
                if (that.isEmpty(value.codeMotivo) && value.statusMotivo === "S") {
                    booleanMotivo = true;
                }
            });
            if (booleanMotivo) {
                that.getMessageBox("error", that.getI18nText("sSelectMotivo"));
                return;
            }

            var oMotivo = this.oModelGetPedidoVenta.getProperty("/oMotivo");

            var booleanError = false;
            oMaterialesSelected.forEach(function (value, index) {
                var oFindMotivo = oMotivo.find(item => item.key === value.codeMotivo);
                var descMotivo = "";
                if (!that.isEmpty(oFindMotivo)) {
                    descMotivo = oFindMotivo.desc;
                }
                if (value.status == "Error") {
                    booleanError = true;
                }

                var jMaterial = {
                    "Codfa": "C06 S21",
                    "Kbetr": value.precioUnidXsl,
                    "Labst": value.solSap,
                    "Maktg": value.descripcion,
                    "Matnr": value.Matnr,
                    "Meins": value.Meins,
                    "Kunnr": value.Kunnr,
                    "Txtfa": value.Txtfa,
                    "Umrez": value.Umrez,
                    "Vtweg": value.Vtweg,

                    "codeMotivo": value.codeMotivo,
                    "descMotivo": descMotivo,
                    "icon": "sap-icon://inbox",
                    "state": "Success",

                    "cantidad": value.solXsl,
                    "total": ((parseFloat(value.precioUnidXsl) * that.igv) * parseFloat(value.solXsl)).toString(),
                    "totalSinIGV": ((parseFloat(value.precioUnidXsl)) * parseFloat(value.solXsl)).toString(),
                    "descuentos": "0%",
                    "descuentosVolumen1": "0%",
                    "descuentosVolumen2": "0%",
                    "status": value.status,
                    "tipo": "MAT",
                    "MatnrPrinc": "",
                    "PosnrPrinc": "",
                    "Probon": "",
                    "Numpro": "",
                    "cantidadProm": "",
                    "cantidadRecalculo": value.solXsl
                }
                oMaterialesSelectedEnv.push(jMaterial);
            });

            this._onFunctionValidateMaterial(oMaterialesSelectedEnv, oMaterial);

            this._onClearDataDialogMasive();

            oSource.getParent().close();
        },
        //Add Product Masive

        //FunctionDetail
        onConteoMaterial: function (sParameter) {
            var tbProductos = this._byId("tbProductos");
            var oItems = tbProductos.getItems();
            var oProductosValidos = [];
            var oProductosNoValidos = [];
            var booleanError = false;
            oItems.forEach(function (value, index) {
                var jObject = value.getBindingContext('oModelPedidoVenta').getObject();
                if (jObject.status === "None") {
                    oProductosValidos.push(jObject);
                }

                if (jObject.status === "Error") {
                    booleanError = true;
                    oProductosNoValidos.push(jObject);
                }
            });

            var columns = this._byId("tbProductos").getColumns();
            if (!this.getModel("device").getProperty("/system/phone")) {
                if (booleanError) {
                    columns[columns.length - 1].setVisible(true);
                    that._byId("lTotalProductosNot").setVisible(true);
                    that._byId("lCantidadProductosNot").setVisible(true);
                    that._byId("textFooterColNoDisponible").setVisible(true);
                } else {
                    columns[columns.length - 1].setVisible(false);
                    that._byId("lTotalProductosNot").setVisible(false);
                    that._byId("lCantidadProductosNot").setVisible(false);
                    that._byId("textFooterColNoDisponible").setVisible(false);
                }
                that._byId("textFooterColDisponible").setVisible(true);
                that._byId("lCantidadProductos").setVisible(true);
                that._byId("lTotalProductos").setVisible(true);
            } else {
                if (booleanError) {
                    columns[columns.length - 1].setVisible(true);
                    that._byId("hbTableDetallePhoneNoDisponible").setVisible(true);
                } else {
                    columns[columns.length - 1].setVisible(false);
                    that._byId("hbTableDetallePhoneNoDisponible").setVisible(false);
                }
                that._byId("textFooterColDisponible").setVisible(false);
                that._byId("textFooterColNoDisponible").setVisible(false);
                that._byId("lTotalProductosNot").setVisible(false);
                that._byId("lCantidadProductos").setVisible(false);
                that._byId("lTotalProductos").setVisible(false);
                that._byId("lCantidadProductosNot").setVisible(false);
            }

            var total = 0;
            var cantidad = 0;
            var totalmMateriales = 0;
            var totalNot = 0;
            var cantidadNot = 0;
            var totalmMaterialesNot = 0;

            oProductosNoValidos.forEach(function (value, index) {
                cantidadNot += parseFloat(value.cantidad);
                //cambio 21/03/2022
                if(value.tipo != "FLE"){
                    totalmMateriales += parseFloat(value.total);
                    totalNot += parseFloat(value.total);
                }
                //     totalmMateriales += parseFloat(value.total);
                //     totalNot += parseFloat(value.total);
            });

            oProductosValidos.forEach(function (value, index) {
                cantidad += parseFloat(value.cantidad);
                //cambio 21/03/2022
                if(value.tipo != "FLE"){
                    totalmMateriales += parseFloat(value.totalSinIGV);
                    total += parseFloat(value.total);
                }
                //     totalmMateriales += parseFloat(value.total);
                //     total += parseFloat(value.total);
            });

            var booleanCanal = false;
            var oMaterialPrev = this.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
            var oFlete = this.getModel("oModelPedidoVenta").getProperty("/DataGeneral/oFlete");
            var oSelectedCliente = this.getModel("oModelPedidoVenta").getProperty("/DataGeneral/oSelectedCliente");
            //cambio 21/03/2022
            // if(oSelectedCliente.codeCanal==="10" && oSelectedCliente.codeGrupoCliente==="13"){
            //     booleanCanal = true;
            // }
            var oFleteService = that.oModelGetPedidoVenta.getProperty("/oFlete");
            var jFleteSelect = {};
            oFleteService.forEach(function(value,index){
                if(parseFloat(value.KSTBW) <= totalmMateriales && parseFloat(value.KSTBWB) > totalmMateriales){
                    if(!that.isEmpty(value.KZBZG)){
                        jFleteSelect = value;
                        booleanCanal = true;
                    }
                }
            });

            var oMaterial = [];

            if(booleanCanal){
                oMaterialPrev.forEach(function(value){
                    if(value.tipo != "FLE"){
                        oMaterial.push(value);
                    }
                });
                if(parseFloat(totalmMateriales) >= parseFloat(jFleteSelect.KSTBWB)){
                    total = totalmMateriales;
                    this.oModelPedidoVenta.setProperty("/DataGeneral/oMaterial",oMaterial);
                }else{
                    var jFlete = {};
                    var iFlete = parseFloat((parseFloat(jFleteSelect.KBETR)*that.igv).toFixed(0));
                    var jFlete = {
                        "Codfa":"",
                        "Kbetr":"0",
                        "Labst":"0",
                        "Maktg": "",
                        "Matnr":"0",
                        "Meins":"",
                        "Txtfa":"",
                        "Umrez":"0",
                        "Vtweg":"0",
                        "icon":"sap-icon://inbox",
                        "state":"Success",
                        "cantidad": "0",
                        "total": (iFlete).toFixed(3),
                        "descuentos":"0%",
                        "descuentosVolumen1":"0%",
                        "descuentosVolumen2":"0%",
                        "status":"None",
                        "codeMotivo":"",
                        "descMotivo":"",
                        "tipo":"FLE",
                        "Posnr":"",
                        "cantidadRecalculo":"0"
                    }
                    if(iFlete > 0){
                        oMaterial.unshift(jFlete);
                    }
                    
                    this.oModelPedidoVenta.setProperty("/DataGeneral/oMaterial",oMaterial);
                }

                var totalRec = 0;
                var cantidadRec = 0;
                var totalNotRec = 0;
                var cantidadNotRec = 0;

                oMaterial.forEach(function(value, index){
                    if(value.status === "None"){
                        cantidadRec += parseFloat(value.cantidad);

                        totalRec += parseFloat(value.total);
                    }

                    if(value.status === "Error"){
                        cantidadNotRec += parseFloat(value.cantidad);
                        
                        totalNotRec += parseFloat(value.total);
                    }
                });
            }else{
                var totalRec = 0;
                var cantidadRec = 0;
                var totalNotRec = 0;
                var cantidadNotRec = 0;

                oMaterialPrev.forEach(function(value, index){
                    if(value.status === "None"){
                        cantidadRec += parseFloat(value.cantidad);
                        totalRec += parseFloat(value.total);
                    }

                    if(value.status === "Error"){
                        cantidadNotRec += parseFloat(value.cantidad);
                        totalNotRec += parseFloat(value.total);
                    }
                });
            }

            that._byId("lTotalProductos").setText(this.currencyFormat(totalRec.toString()));
            that._byId("lCantidadProductos").setText(this.currencyFormat(cantidadRec.toString()));

            that._byId("lTotalProductosNot").setText(this.currencyFormat(totalNotRec.toString()));
            that._byId("lCantidadProductosNot").setText(this.currencyFormat(cantidadNotRec.toString()));

            if (this.getModel("device").getProperty("/system/phone")) {
                that._byId("lTotalDisponible").setText(this.currencyFormat(cantidad.toString()) + " ; " + this.currencyFormat(totalRec.toString()));
                that._byId("lTotalNoDisponible").setText(this.currencyFormat(cantidadNot.toString()) + " ; " + this.currencyFormat(totalNotRec.toString()));
            }

        },
        _onPressDeletePro: function (oEvent) {
            var oSource = oEvent.getSource();
            var tbProductos = this._byId("tbProductos");
            var oMaterialesSelected = [];
            var oOtrosDescuentos = [];

            var oMaterialPrev = this.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
            var oMaterial = [];
            oMaterialPrev.forEach(function (value) {
                oMaterial.push(value);
            });

            var oSelectItems = [];
            if (tbProductos.getSelectedItems().length == 0) {
                that.getMessageBox("error", that.getI18nText("errorSelectProduct"));
                return;
            }

            var value2 = false;
            var booleanWarningProComb = false;
            tbProductos.getSelectedItems().forEach(function (value, index) {
                var jObject = value.getBindingContext("oModelPedidoVenta").getObject();
                if (jObject.tipo == "PROCOM" || value2.tipo == "PROCOMH") {
                    booleanWarningProComb = true;
                }
                oSelectItems.push(jObject);
            });

            var sMsg = "";
            var oSmsMat = [];
            var oMaterialRepeat = []
            var booleanWarningMat = false;
            oSelectItems.forEach(function (value, index) {
                if (value.tipo == "MAT") {
                    oMaterialRepeat.push(value);
                }
                oMaterial.forEach(function (value2, index2) {
                    if (value2.tipo == "PROFV" || value2.tipo == "PROVEN" || value2.tipo == "PROVM" || value2.tipo == "PROVV" || value2.tipo == "PROOP"
                        || value2.tipo == "PROCLI" || value2.tipo == "PROPV" || value2.tipo == "PROCOM" || value2.tipo == "PROCOMH") {
                        booleanWarningMat = true;
                    }


                });
            });

            // return;

            if(booleanWarningMat){
                var sMessageAlert = "";
                if(booleanWarningProComb){
                    sMessageAlert = that.getI18nText("warningPromoComb");
                }else{
                    sMessageAlert = that.getI18nText("warningPromoBoni");
                }
                utilUI.messageBox(sMessageAlert,"I", function(value){
                    if(value){
                        var sStatus = that.oModelPedidoVenta.getProperty("/DataGeneral/sStatus");
                        if (sStatus === "M") {
                            if (!booleanWarningProComb) {
                                that._onPressDeletePromotionsNotComb();
                            }else{
                                that._onPressDeletePromotionsComb();
                            }
                        } else if (sStatus === "C") {
                            that._onPressDeletePromotions();
                        }

                        if (oMaterialRepeat.length > 0) {
                            that._onPressDeleteBonificacion(oMaterialRepeat);
                        }

                        var oMaterialPrevRepeat = [];
                        that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial").forEach(function (value) {
                            oMaterialPrevRepeat.push(value)
                        });

                        that._onFunctionValidateMaterial([], oMaterialPrevRepeat);

                        // that.onConteoMaterial();
                        that._byId("tbProductos").removeSelections(true);
                        // sap.ui.core.BusyIndicator.hide(0);
                    }
                });
            } else {
                if (oMaterialRepeat.length > 0) {
                    that._onPressDeleteBonificacion(oMaterialRepeat);
                }

                var oMaterialPrevRepeat = [];
                that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial").forEach(function (value) {
                    oMaterialPrevRepeat.push(value)
                });

                that._onFunctionValidateMaterial([], oMaterialPrevRepeat);

                // that.onConteoMaterial();
                that._byId("tbProductos").removeSelections(true);
                // sap.ui.core.BusyIndicator.hide(0);
            }
        },
        _onPressDeletePromotions: function (oEvent) {
            var oSelectItems = [];
            var oOtrosDescuentos = [];
            var oMaterialPrev = this.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
            var oMaterial = [];
            oMaterialPrev.forEach(function (value) {
                oMaterial.push(value);
            });

            that._byId("tbProductos").getItems().forEach(function (value, index) {
                var jObject = value.getBindingContext("oModelPedidoVenta").getObject();
                if (jObject.tipo === "PROFV" || jObject.tipo === "PROVEN" || jObject.tipo === "PROVM" || jObject.tipo === "PROVV" || jObject.tipo === "PROOP"
                    || jObject.tipo === "PROCLI" || jObject.tipo === "PROPV" || jObject.tipo === "PROCOM" || jObject.tipo === "PROCOMH") {

                    oSelectItems.push(jObject);

                }
            });

            oSelectItems.forEach(function (value, index) {
                var booleanWarningMat = false;
                oMaterial.forEach(function (value2, index2) {
                    if (value2.tipo != "MAT") {
                        if (value2.MatnrPrinc === value.Matnr && value2.PosnrPrinc === value.Posnr) {
                            booleanWarningMat = true;
                            oSelectItems.push(value2);
                        }
                    }
                });
            });

            oSelectItems.forEach(function (value, index) {
                var indice = oMaterial.indexOf(value);
                if (indice != -1)
                    oMaterial.splice(indice, 1);
            });

            if (oMaterial.length > 0) {
                that.oModelPedidoVenta.setProperty("/DataGeneral/oMaterial", oMaterial);
            } else {
                that.oModelPedidoVenta.setProperty("/DataGeneral/oMaterial", []);
            }
        },
        _onPressDeletePromotionsComb: function(oEvent){
            var oSelectItems = [];
            var oOtrosDescuentos = [];
            var oMaterialPrev = this.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
            var oMaterial = [];
            oMaterialPrev.forEach(function(value){
                oMaterial.push(value);
            });
            
            that._byId("tbProductos").getItems().forEach(function(value, index){
                var jObject = value.getBindingContext("oModelPedidoVenta").getObject();
                if(jObject.tipo === "PROCOM" ||jObject.tipo === "PROCOMH"){
                    oSelectItems.push(jObject);
                }
            });

            oSelectItems.forEach(function(value, index){
                var booleanWarningMat = false;
                oMaterial.forEach(function(value2, index2){
                    if(value2.tipo != "MAT"){
                        if(value2.MatnrPrinc === value.Matnr && value2.PosnrPrinc === value.Posnr){
                            booleanWarningMat = true;
                            oSelectItems.push(value2);
                        }
                    }
                });
            });

            oSelectItems.forEach(function(value, index){
                var indice = oMaterial.indexOf(value);
                if(indice != -1)
                oMaterial.splice( indice, 1 );
            });

            if(oMaterial.length > 0){
                that.oModelPedidoVenta.setProperty("/DataGeneral/oMaterial",oMaterial);
            }else{
                that.oModelPedidoVenta.setProperty("/DataGeneral/oMaterial",[]);
            }
        },
        _onPressDeleteBonificacion: function(oMatSel){
            var oSelectItems = [];
            var oOtrosDescuentos = [];
            var oMaterialPrev = this.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
            var oMaterial = [];
            oMaterialPrev.forEach(function (value) {
                oMaterial.push(value);
            });

            oSelectItems = oMatSel;
            oSelectItems.forEach(function (value, index) {
                var booleanWarningMat = false;
                oMaterial.forEach(function (value2, index2) {
                    if (value2.tipo != "MAT") {
                        if (value2.MatnrPrinc === value.Matnr && value2.PosnrPrinc === value.Posnr) {
                            booleanWarningMat = true;
                            oSelectItems.push(value2);
                        }
                    }
                });
            });

            oSelectItems.forEach(function (value, index) {
                var indice = oMaterial.indexOf(value);
                if (indice != -1)
                    oMaterial.splice(indice, 1);
            });

            if (oMaterial.length > 0) {
                that.oModelPedidoVenta.setProperty("/DataGeneral/oMaterial", oMaterial);
            } else {
                that.oModelPedidoVenta.setProperty("/DataGeneral/oMaterial", []);
            }
        },
        reformatPosicion: function () {
            var oMaterial = that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
            var cont = 0;
            oMaterial.forEach(function (value) {
                if (value.tipo === "MAT") {
                    cont = cont + 10;
                    value.Posnr = that.zfill(cont, 6);
                } else {
                    value.PosnrPrinc = that.zfill(cont, 6);
                    value.Posnr = that.zfill(cont + 1, 6);
                }
            })

            oMaterial.forEach(function (value) {
                if (value.tipo != "MAT") {
                    var oFindCliente = oMaterial.find(item => item.Matnr === value.Matnr && item.tipo === "MAT");
                }
            })

            that.oModelPedidoVenta.setProperty("/DataGeneral/oMaterial", oMaterial);
        },
        _onPressSelectionChange: function (oEvent) {
            var oParameter = oEvent.getParameters();
            var oSelected = oParameter.listItem.getBindingContext("oModelPedidoVenta").getObject();
            if (oSelected.tipo === "BON" || oSelected.tipo === "FLE" || oSelected.tipo === "PROFV" || oSelected.tipo === "PROVEN" || oSelected.tipo === "PROVM" || oSelected.tipo === "PROVV"
                || oSelected.tipo === "PROOP" || oSelected.tipo === "PROPV" || oSelected.tipo === "PROCOMH" || oSelected.tipo === "BONPRO") {
                // if(oSelected.tipo === "BON" || oSelected.tipo === "FLE" || oSelected.tipo === "BONPRO"){
                that.getMessageBox("error", that.getI18nText("errorSelectNotBon"));
                oEvent.getParameters().listItem.setSelected(false);
            }
        },
        _onPressSave: function () {
            var tbProductos = this._byId("tbProductos");
            var oSelectItems = tbProductos.getItems();
            if (oSelectItems.length == 0) {
                that.getMessageBox("error", that.getI18nText("errorNotProductSave"));
                return;
            }

            var oMaterial = [];
            var oMaterialSap = [];
            var oMaterialSapPromotions = [];

            var sStatus = that.oModelPedidoVenta.getProperty("/DataGeneral/sStatus");
            var cont = 0;
            var sUepos = "";
            var oProductosValidos = [];
            var oProductosNoValidos = [];
            oSelectItems.forEach(function (value, index) {
                //6/12/2022
                cont = cont + 10;
                var jObject = value.getBindingContext("oModelPedidoVenta").getObject();
                // jObject.Posnr = that.zfill(cont,6);
                if (jObject.tipo === "MAT" || jObject.tipo === "PROFV" || jObject.tipo === "PROVEN" || jObject.tipo === "PROVM" || jObject.tipo === "PROVV"
                    || jObject.tipo === "PROOP" || jObject.tipo === "PROCLI" || jObject.tipo === "PROPV" || jObject.tipo === "PROCOM" || jObject.tipo === "PROCOMH") {
                    var sCodeMotivo = "";
                    if (!that.isEmpty(jObject.codeMotivo)) {
                        sCodeMotivo = jObject.codeMotivo;
                    }

                    var sSplitDesc1 = jObject.descuentosVolumen1.split("%");
                    var iDesc1 = parseFloat(sSplitDesc1[0]);

                    var sSplitDesc2 = jObject.descuentosVolumen2.split("%");
                    var iDesc2 = parseFloat(sSplitDesc2[0]);
                    var sTipoPosicion = "";
                    var sPrice = "";
                    var sTipoReparto = "";
                    var oSelectedCliente = that.oModelPedidoVenta.getProperty("/DataGeneral/oSelectedCliente");
                    var sEdatu = that.reformatDateString(that.getYYYYMMDD(new Date()));
                    var sEdatu2 = oSelectedCliente.textFechaEntrega;
                    if (jObject.tipo === "MAT") {
                        sTipoPosicion = "ZBMS";
                        sPrice = "0";
                        sTipoReparto = "ZB";
                    } else if (jObject.tipo === "PROCOM") {//Mat combo padre
                        sTipoPosicion = "ZTAQ";
                        sTipoReparto = "ZJ";
                        if (parseFloat(jObject.Kbetr) > 0) {
                            sPrice = (parseFloat(jObject.Kbetr)).toFixed(3);
                        } else {
                            sPrice = "0";
                        }
                    } else if (jObject.tipo === "PROCOMH") {//Mat combo hijos y otras promociones
                        if (parseFloat(jObject.Kbetr) > 0) {
                            sPrice = (parseFloat(jObject.Kbetr)).toFixed(3);
                            sTipoPosicion = "ZCMB";//con precio fijo
                            sTipoReparto = "ZB";
                        } else {
                            sPrice = "0";
                            sTipoPosicion = "ZBBP";//no precio
                            sTipoReparto = "Z1";
                        }
                    } else {
                        if (parseFloat(jObject.Kbetr) > 0) {
                            sPrice = (parseFloat(jObject.Kbetr)).toFixed(3);
                            sTipoPosicion = "ZBMS";//con precio fijo
                            sTipoReparto = "ZB";
                        } else {
                            sPrice = "0";
                            sTipoPosicion = "ZBBP";//no precio
                            sTipoReparto = "Z1";
                        }
                    }

                    if (jObject.tipo === "MAT" || jObject.tipo === "PROFV" || jObject.tipo === "PROVEN" || jObject.tipo === "PROVM" || jObject.tipo === "PROVV"
                        || jObject.tipo === "PROOP" || jObject.tipo === "PROCLI" || jObject.tipo === "PROPV") {
                        sUepos = "";
                    } else if (jObject.tipo === "PROCOM") {
                        sUepos = that.zfill(cont, 6);
                    }

                    var sDescna = "";
                    if (jObject.tipo === "PROFV" || jObject.tipo === "PROVEN" || jObject.tipo === "PROVM" || jObject.tipo === "PROVV"
                        || jObject.tipo === "PROOP" || jObject.tipo === "PROCLI" || jObject.tipo === "PROPV" || jObject.tipo === "PROCOM" || jObject.tipo === "PROCOMH") {
                        sDescna = "X";
                    }

                    var jDataSap = {
                        "Type": sStatus,
                        //6/12/2022
                        "Posnr": that.zfill(cont, 6),
                        // "Posnr": jObject.Posnr,
                        "Matnr": jObject.Matnr,
                        "Werks": "1020",
                        "Lgort": "0201",
                        "Fkimg": jObject.cantidad,
                        "Meins": jObject.Meins,
                        "Abgru": sCodeMotivo,
                        "Pstyv": sTipoPosicion,
                        "Kscha": "ZD02",
                        "Kbetr": iDesc1.toFixed(3),
                        "Kscha2": "ZD03",
                        "Kbetr2": iDesc2.toFixed(3),
                        "Price": sPrice,
                        "Ettyp": sTipoReparto,
                        "Edatu": sEdatu2,
                        "Uepos": jObject.tipo === "PROCOMH" ? sUepos : "",
                        "Descna": sDescna,
                        "Zznumpro": that.isEmpty(jObject.Numpro) ? "" : jObject.Numpro,
                        "Zztippro": that.isEmpty(jObject.TipPro) ? "" : jObject.TipPro
                    };
                    oMaterial.push(jObject);
                    oMaterialSap.push(jDataSap);
                }

                // if(jObject.status === "None" && jObject.tipo != "FLE"){
                if (jObject.tipo != "FLE") {
                    oProductosValidos.push(jObject);
                }

                if (jObject.status === "Error" && jObject.tipo != "FLE") {
                    oProductosNoValidos.push(jObject);
                }
            });

            var sStatus = that.oModelPedidoVenta.getProperty("/DataGeneral/sStatus");
            var oMaterialSapOrigin = [];
            if(sStatus === "M"){
                this.getModel("oModelSavePedidoVenta").getData().forEach(function(jObject, index){
                    if(jObject.tipo==="MAT"||jObject.tipo === "PROFV"||jObject.tipo === "PROVEN"||jObject.tipo === "PROVM"||jObject.tipo === "PROVV"
                        ||jObject.tipo === "PROOP"||jObject.tipo === "PROCLI"||jObject.tipo === "PROPV"||jObject.tipo === "PROCOM"||jObject.tipo === "PROCOMH"){
                        var sCodeMotivo = "";
                        if(!that.isEmpty(jObject.codeMotivo)){
                            sCodeMotivo = jObject.codeMotivo;
                        }
                        
                        var sSplitDesc1 = jObject.descuentosVolumen1.split("%");
                        var iDesc1 = parseFloat(sSplitDesc1[0]);
    
                        var sSplitDesc2 = jObject.descuentosVolumen2.split("%");
                        var iDesc2 = parseFloat(sSplitDesc2[0]);
                        var sTipoPosicion="";
                        var sPrice="";
                        var sTipoReparto="";
                        var oSelectedCliente = that.oModelPedidoVenta.getProperty("/DataGeneral/oSelectedCliente");
                        var sEdatu = that.reformatDateString(that.getYYYYMMDD(new Date()));
                        var sEdatu2 = oSelectedCliente.textFechaEntrega;
                        if(jObject.tipo === "MAT"){
                            sTipoPosicion="ZBMS";
                            sPrice="0";
                            sTipoReparto="ZB";
                        }else if(jObject.tipo === "PROCOM"){//Mat combo padre
                            sTipoPosicion="ZTAQ";
                            sTipoReparto="ZJ";
                            if(parseFloat(jObject.Kbetr) > 0){
                                sPrice=(parseFloat(jObject.Kbetr)).toFixed(3);
                            }else{
                                sPrice="0";
                            }
                        }else if(jObject.tipo === "PROCOMH"){//Mat combo hijos y otras promociones
                            if(parseFloat(jObject.Kbetr) > 0){
                                sPrice=(parseFloat(jObject.Kbetr)).toFixed(3);
                                sTipoPosicion="ZCMB";//con precio fijo
                                sTipoReparto="ZB";
                            }else{
                                sPrice="0";
                                sTipoPosicion="ZBBP";//no precio
                                sTipoReparto="Z1";
                            }
                        }else{
                            if(parseFloat(jObject.Kbetr) > 0){
                                sPrice=(parseFloat(jObject.Kbetr)).toFixed(3);
                                sTipoPosicion="ZBMS";//con precio fijo
                                sTipoReparto="ZB";
                            }else{
                                sPrice="0";
                                sTipoPosicion="ZBBP";//no precio
                                sTipoReparto="Z1";
                            }
                        }
    
                        var sDescna = "";
                        if(jObject.tipo === "PROFV"||jObject.tipo === "PROVEN"||jObject.tipo === "PROVM"||jObject.tipo === "PROVV"
                            ||jObject.tipo === "PROOP"||jObject.tipo === "PROCLI"||jObject.tipo === "PROPV"||jObject.tipo === "PROCOM"||jObject.tipo === "PROCOMH"){
                            sDescna = "X";
                        }
    
                        var jDataSap = {
                            "Type": sStatus,
                            //6/12/2022
                            "Posnr": jObject.PosnrPrev,
                            // "Posnr": jObject.Posnr,
                            "Matnr": jObject.Matnr,
                            "Werks": "1020",
                            "Lgort": "0201",
                            "Fkimg": jObject.cantidad,
                            "Meins": jObject.Meins,
                            "Abgru": sCodeMotivo,
                            "Pstyv": sTipoPosicion,
                            "Kscha": "ZD02",
                            "Kbetr": iDesc1.toFixed(3),
                            "Kscha2": "ZD03",
                            "Kbetr2": iDesc2.toFixed(3),
                            "Price": sPrice,
                            "Ettyp": sTipoReparto,
                            "Edatu": sEdatu2,
                            "Uepos": jObject.PosnrPrinc ,
                            "Descna": sDescna,
                            "Zznumpro": that.isEmpty(jObject.Numpro) ? "":jObject.Numpro,
                            "Zztippro": that.isEmpty(jObject.TipPro) ? "":jObject.TipPro
                        };
                        oMaterialSapOrigin.push(jDataSap);
                    }
                });
            }

            if(oMaterialSap.length == 0){
                that.getMessageBox("error", that.getI18nText("errorNotProductSave"));
                return;
            }

            var totalMaterialesSinIGV = 0;
            oProductosValidos.forEach(function (value, index) {
                totalMaterialesSinIGV += parseFloat(value.totalSinIGV);
            });

            utilUI.messageBox(this.getI18nText("sTextConfirm"), "C", function (value) {
                if (value) {
                    sap.ui.core.BusyIndicator.show(0);
                    var sStatus = that.oModelPedidoVenta.getProperty("/DataGeneral/sStatus");
                    var sNumPedido = that.oModelPedidoVenta.getProperty("/DataGeneral/sNumPedido");
                    var oUser = that.getModel("oModelUser").getProperty("/oUser");
                    var sCodeUser = oUser["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"].attributes[0].value;
                    var oDataSap = {};
                    if (sStatus === "C") {
                        var oSelectedCliente = that.oModelPedidoVenta.getProperty("/DataGeneral/oSelectedCliente");
                        var oSelectedLineaCredito = that.oModelPedidoVenta.getProperty("/DataGeneral/oSelectedLineaCredito");
                        var date = that.reformatDateString(that.getYYYYMMDD(new Date()));
                        var dateFormat = date;

                        var sComprobante = parseFloat(oSelectedCliente.codeComprobante) == 0 ? "BB" : "FA";
                        var sPardm = oSelectedCliente.textPardm;
                        var sKundm = oSelectedCliente.textKundm;
                        var sKundm = oSelectedCliente.textKundm;
                        var sCondPago = oSelectedCliente.codeCondPago === 'C001' ? oSelectedCliente.codeCondPago : '';
                        var bTipoFle = that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial")[0].tipo === "FLE" ? true : false;
                        var sFlete = "0";
                        if (bTipoFle) {
                            sFlete = parseFloat(that.oModelPedidoVenta.getProperty("/DataGeneral/oSelectedCliente/textFlete")).toFixed(3);
                        }

                        oDataSap = {
                            "Cond_Type": "ZG07",
                            "Cond_Value": sFlete,
                            "Type": "C",
                            "Kunnr": oSelectedCliente.codeCliente,
                            "Vkorg": "1000",
                            "Vtweg": oSelectedCliente.codeCanal,
                            "Spart": "XX",
                            "Bstdk": date,
                            "Waerk": "PEN",
                            "ReqDt": oSelectedCliente.textFechaEntrega,
                            "Bstkd": oSelectedCliente.textOrdenCompra,
                            "Obser": oSelectedCliente.textObservacion,
                            "Pardm": sPardm,
                            "Kundm": sKundm,
                            "Vende": sCodeUser,
                            "TipCo": sComprobante,
                            "Zterm": sCondPago,
                            "Vbeln": "",
                            "Netwr": totalMaterialesSinIGV.toFixed(3),
                            "Existe_Ped": "01",
                            "DetailSOSet": oMaterialSap,
                            "DetailBkSOSet": [],
                            // "campo_falla": "asodosad",
                            "ResultSOSet": [
                                {
                                    "Type": "C",
                                    "Posnr": "",
                                    "Msage": ""
                                }
                            ]
                        };
                    } else if (sStatus === "M") {
                        oDataSap = {
                            "Type": sStatus,
                            "Kunnr": "",
                            "Vkorg": "",
                            "Vtweg": "",
                            "Spart": "",
                            "Bstdk": "",
                            "Waerk": "",
                            "ReqDt": "",
                            "Bstkd": "",
                            "Obser": "",
                            "Pardm": "",
                            "Kundm": "",
                            "TipCo": "",
                            "Zterm": "",
                            "Vbeln": sNumPedido,
                            "Netwr": "0",
                            "Existe_Ped": "01",
                            "DetailSOSet": oMaterialSap,
                            "DetailBkSOSet": oMaterialSapOrigin,
                            "ResultSOSet": [
                                {
                                    "Type": sStatus,
                                    "Posnr": "",
                                    "Msage": ""
                                }
                            ]
                        };
                    }
                    console.log(oDataSap);
                    // return;
                    Promise.all([that._postProductos(oDataSap)]).then((values) => {
                        var oResp = values[0].ResultSOSet.results;
                        var sBloq = values[0].Cmgst;
                        var sRepeat = values[0].Existe_Ped;
                        var booleanError = false;

                        if (!that.isEmpty(sRepeat)) {
                            sap.ui.core.BusyIndicator.hide(0);
                            var sTextMessage = that.getI18nText("warningPedidoRepetido1") + sRepeat + that.getI18nText("warningPedidoRepetido2");
                            utilUI.messageBox(sTextMessage, "I", function (value) {
                                if (value) {
                                    sap.ui.core.BusyIndicator.show(0);
                                    oDataSap.Existe_Ped = "02";
                                    Promise.all([that._postProductos(oDataSap)]).then((values2) => {
                                        sap.ui.core.BusyIndicator.hide(0);
                                        var oResp = values2[0].ResultSOSet.results;
                                        var sBloq = values2[0].Cmgst;
                                        var booleanError = false;

                                        var sMsgBloq = "";
                                        if (sBloq === "B" || sBloq === "C") {
                                            sMsgBloq += "\n" + that.getI18nText("errorBloqueado");
                                        }

                                        var sSms = "";
                                        oResp.forEach(function (value, index) {
                                            if (value.Type == "E") {
                                                booleanError = true;
                                                sSms += value.Msage + "\n";
                                            }
                                        });

                                        if (booleanError) {
                                            that.getMessageBox("error", sSms);
                                            sap.ui.core.BusyIndicator.hide(0);
                                        } else {
                                            utilUI.messageBox(oResp[oResp.length - 1].Msage + sMsgBloq, "S", function (value) {
                                                that._onClearComponentTableProduct();
                                                that._onPressNavButtonDetail();
                                                sap.ui.core.BusyIndicator.hide(0);
                                            });
                                            sap.ui.core.BusyIndicator.hide(0);
                                        }

                                    }).catch(function (oError) {
                                        sap.ui.core.BusyIndicator.hide(0);
                                        if (oError.status === 504) {
                                            that.getMessageBox("error", that.getI18nText("errorSaveTimeOut"));
                                        } else {
                                            that.getMessageBox("error", that.getI18nText("errorSave"));
                                        }
                                    });


                                }
                            });
                        } else {
                            sap.ui.core.BusyIndicator.hide(0);
                            var sMsgBloq = "";
                            if (sBloq === "B" || sBloq === "C") {
                                sMsgBloq += "\n" + that.getI18nText("errorBloqueado");
                            }

                            var sSms = "";
                            oResp.forEach(function (value, index) {
                                if (value.Type == "E") {
                                    booleanError = true;
                                    sSms += value.Msage + "\n";
                                }
                            });

                            if (booleanError) {
                                that.getMessageBox("error", sSms);
                            } else {
                                utilUI.messageBox(oResp[oResp.length - 1].Msage + sMsgBloq, "S", function (value) {
                                    that._onClearComponentTableProduct();
                                    that._onPressNavButtonDetail();
                                    sap.ui.core.BusyIndicator.hide(0);
                                });
                            }
                        }

                    }).catch(function (oError) {
                        sap.ui.core.BusyIndicator.hide(0);
                        if (oError.status === 504) {
                            that.getMessageBox("error", that.getI18nText("errorSaveTimeOut"));
                        } else {
                            that.getMessageBox("error", that.getI18nText("errorSave"));
                        }
                    });
                }
            });
        },
        _postProductos: function (oDataSap) {
            try {
                return new Promise(function (resolve, reject) {
                    var urlget = jQuery.sap.getModulePath("tomapedido") + "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/";
                    var urlpost = jQuery.sap.getModulePath("tomapedido") + "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/HeaderSOSet";

                    Services.postoDataERPAsync(that, urlget, urlpost, oDataSap, function (result) {
                        util.response.validateAjaxGetERPNotMessage(result, {
                            success: function (oData, message) {
                                resolve(oData.data);
                            },
                            error: function (message) {
                                reject(message);
                            }
                        });
                    });
                });
            } catch (oError) {
                that.getMessageBox("error", that.getI18nText("sErrorTry"));
            }
        },
        _postPromotions: function (oDataSap) {
            try {
                return new Promise(function (resolve, reject) {
                    var urlget = jQuery.sap.getModulePath("tomapedido") + "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/";
                    var urlpost = jQuery.sap.getModulePath("tomapedido") + "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/GuardarFVentaSet";
                    var oDataSap = {}
                    if (false) {
                        Services.postoDataERPAsync(that, urlget, urlpost, oDataSap, function (result) {
                            util.response.validateAjaxGetERPNotMessage(result, {
                                success: function (oData, message) {
                                    resolve(oData.data);
                                },
                                error: function (message) {
                                    reject(message);
                                }
                            });
                        });
                    } else {
                        resolve("exito");
                    }

                });
            } catch (oError) {
                that.getMessageBox("error", that.getI18nText("sErrorTry"));
            }
        },
        _onLiveChangeBuscar: function (oEvent) {
            var oSource = oEvent.getSource();
            var sValue = oSource.getValue();

            var oTable = this.byId("tbProductos");

            var aFilter = [];
            if (!this.isEmpty(sValue))
                aFilter.push(new Filter("Maktg", 'Contains', sValue));

            oTable.getBinding("items").filter(aFilter);

        },
        _onLiveChangeBuscarProduct: function (oEvent) {
            var oSource = oEvent.getSource();
            var sValue = oSource.getValue();

            var oTable = that._byId("frgIdAddManualProduct--tbMaterialesManual");

            var aFilter = [];
            if (!this.isEmpty(sValue))
                aFilter.push(new Filter("Maktg", 'Contains', sValue));

            oTable.getBinding("items").filter(aFilter);

        },
        _onChangeCounter: function (oEvent) {
            var oSource = oEvent.getSource();
            var iCounter = oSource.getValue();
            var oTable = this._byId("tbProductos");
            var oData = models.JsonProductos();

            this._byId("vbTableDetalle").removeItem(1);
            this.oModelPedidoVenta.setProperty("/ProductoCreados", oData.slice(0, iCounter));

            var oLength = oData.length;
            var oActual = oLength / iCounter;
            var oCalculation = (oActual % 1 == 0);
            var oValue = 0;
            if (oCalculation == true) {
                oValue = oActual;
            } else {
                oValue = parseInt(oActual) + 1;
            }

            var oPaginator = new sap.ui.commons.Paginator({
                visible: true,
                numberOfPages: oValue,
                page: function (oEvent) {
                    var oTargetPage = oEvent.getParameter("targetPage");
                    var oTargetValue = oTargetPage * iCounter;
                    var oSourceValue = oTargetValue - iCounter;
                    var oTotalData = models.JsonProductos();
                    var oSelectedData = oTotalData.slice(oSourceValue, oTargetValue);
                    that.oModelPedidoVenta.setProperty("/ProductoCreados", oSelectedData);
                }
            });
            var VBox = new sap.m.VBox({
                alignItems: "Center",
                items: [oPaginator]
            });

            this._byId("vbTableDetalle").addItem(VBox);
        },
        _onFunctionValidateMaterial: function (oMaterialSelect, oDataMaterialT) {
            var oSelectedCliente = this.oModelPedidoVenta.getProperty("/DataGeneral/oSelectedCliente");
            var date = this.convertformatDateInAbap(new Date());
            var oMaterialDesc = [];
            var oMaterialBon = [];
            var oOtrosDescuentos = [];
            var oDataMaterial = [];
            var oDataMaterialComb = [];

            oDataMaterialT.forEach(function (value) {
                if (value.tipo === "PROCOM" || value.tipo === "PROCOMH") {
                    oDataMaterialComb.push(value);
                } else {
                    oDataMaterial.push(value);
                }
            });

            //posicion inicial seleccionado
            var cont = 0;
            if (oDataMaterial.length > 0) {
                var oMaterialSol = [];
                oDataMaterial.forEach(function (value, index) {
                    if (value.tipo === "MAT") {
                        oMaterialSol.push(value);
                    }
                });
                if (oMaterialSol.length > 0) {
                    cont = Math.max(...oMaterialSol.map(x => parseInt(x.Posnr)));
                }
            }
            oMaterialSelect.forEach(function (value, index) {
                cont = cont + 10;
                value.Posnr = that.zfill(cont, 6);
            });

            oMaterialSelect.forEach(function (value, index) {
                var valor_neto = (parseFloat(value.cantidad) * parseFloat(value.Kbetr)).toString();
                var jMaterial = {
                    "Kunnr": oSelectedCliente.codeCliente,
                    "Vtweg": oSelectedCliente.codeCanal,
                    "Datum": date,
                    "Matnr": value.Matnr,
                    "Emeng": value.cantidad,
                    "TipoDoc": oSelectedCliente.codeCondPago
                }
                oMaterialDesc.push(jMaterial);

                var jMaterialBon = {
                    "Kunnr": oSelectedCliente.codeCliente,
                    "Vtweg": oSelectedCliente.codeCanal,
                    "Datum": date,
                    "Matnr": value.Matnr,
                    "Meins": value.Meins,
                    "Emeng": value.cantidad
                }
                oMaterialBon.push(jMaterialBon);
            });

            var oMaterialesTotales = [];
            oMaterialSelect.forEach(function (value, index) {
                if (value.tipo === "MAT") {
                    oMaterialesTotales.push(value);
                }
            });
            oDataMaterial.forEach(function (value, index) {
                if (value.tipo === "MAT") {
                    oMaterialesTotales.push(value);
                }
            });
            oMaterialesTotales.forEach(function (value, index) {
                var jOtrosDescuentos = {
                    "Tippro": "D1",
                    "Posnr": value.Posnr,
                    "Matnr": value.Matnr,
                    "Kwmeng": value.cantidad,
                    "Vrkme": value.Meins,
                    "Netpr": value.Kbetr,
                    "Netwr": (parseFloat(value.Kbetr) * parseFloat(value.cantidad)).toString(),
                    "Waerk": "PEN"
                }
                oOtrosDescuentos.push(jOtrosDescuentos);
            });

            sap.ui.core.BusyIndicator.show(0);
            Promise.all([this._getDescuentosPago(oMaterialDesc), this._getBonificaciones(oMaterialBon),
            this._getOtrosDescuentos(oOtrosDescuentos, "D1"), this._getOtrosDescuentos(oOtrosDescuentos, "D2")]).then((values) => {
                //descuentos condPago
                var oDescuentos = values[0].DetalleListadoDtoContSet.results;
                if (oDescuentos) {
                    oMaterialSelect.forEach(function (value, index) {
                        if (value.tipo === "MAT") {
                            var oFind = oDescuentos.find(item => item.Matnr === value.Matnr && value.tipo === "MAT");
                            if (!that.isEmpty(oFind)) {
                                value.descuentos = parseFloat(oFind.Kbetr).toFixed(2) + "%";
                            }
                        }
                    })
                }

                //Bonificacion
                var oResultBonificacion = [];
                if (values[1].DetalleListadoBonifSet.results) {
                    values[1].DetalleListadoBonifSet.results.forEach(function (value, index) {
                        var jMaterialBonificacion = {
                            "Kunnr": "",
                            "Ean11": "",
                            "Codfa": "",
                            "Kbetr": "0.000",
                            "Labst": "0",
                            "Maktg": value.Maktg,
                            "Matnr": value.Knrmat,
                            "Meins": value.Meins,
                            "Posnr": "",
                            "Txtfa": "",
                            "Umrez": "0",
                            "Vtweg": "0",
                            "cantidad": value.CantBonif,
                            "codeMotivo": "",
                            "descMotivo": "",
                            "descuentos": "0%",
                            "descuentosVolumen1": "0%",
                            "descuentosVolumen2": "0%",
                            "icon": "sap-icon://inbox",
                            "state": "Success",
                            "status": "None",
                            "tipo": "BON",
                            "total": "0",
                            "totalSinIGV": "0",
                            "MatnrPrinc": value.Matnr,
                            "PosnrPrinc": "",
                            "Probon": "",
                            "Numpro": "",
                            "cantidadProm": "",
                            "cantidadRecalculo": value.CantBonif
                        }
                        oResultBonificacion.push(jMaterialBonificacion);
                    });
                }

                var oMaterial = [];
                oDataMaterial.forEach(function (value) {
                    oMaterial.push(value);
                });
                oMaterialSelect.forEach(function (value, index) {
                    oMaterial.push(value);
                    oResultBonificacion.forEach(function (valueBon, index) {
                        if (value.Matnr === valueBon.MatnrPrinc) {
                            var sPosnr = parseFloat(value.Posnr);
                            sPosnr = sPosnr + 1;
                            valueBon.PosnrPrinc = that.zfill(parseFloat(value.Posnr), 6);
                            valueBon.Posnr = that.zfill(sPosnr, 6);
                            oMaterial.push(valueBon);
                        }
                    });
                });

                //descuentos D1
                var oPromobaseDsctoSet = values[2].PromobaseDsctoSet.results; //usa D1
                var oPromocionesDsctoSet = values[2].PromocionesDsctoSet.results;
                var oPromoescalasDsctoSet = values[2].PromoescalasDsctoSet.results; //usa D1
                var totalImporte = 0;//usa D2
                oMaterial.forEach(function (value, index) {
                    if (value.tipo === "MAT") {
                        totalImporte += parseFloat(value.cantidad) * parseFloat(value.Kbetr);
                        var numProm = "";
                        var jPromoEscalaSelected = {};
                        var booleanVigente = false;
                        var oPromescalasfilter = [];
                        var oFindBase = [];
                        oPromobaseDsctoSet.forEach(function (valueBase) {
                            if (valueBase.Probas === value.Matnr) {
                                if (valueBase.Flag === "X") {
                                    numProm = valueBase.Numpro;
                                    booleanVigente = true;
                                }
                            }
                        });

                        if (booleanVigente) {
                            oPromobaseDsctoSet.forEach(function (valueBase) {
                                if (valueBase.Numpro === numProm) {
                                    oFindBase.push(valueBase)
                                }
                            });
                            oPromoescalasDsctoSet.forEach(function (value2, index) {
                                if (value2.Flag === "X") {
                                    if (value2.Numpro === numProm) {
                                        oPromescalasfilter.push(value2);
                                    }
                                }
                            });

                            var cantidadEval = 0;
                            oFindBase.forEach(function (valueFind) {
                                var jFindBase = oMaterial.find(item => item.Matnr === valueFind.Probas);
                                if (jFindBase) {
                                    cantidadEval += parseFloat(jFindBase.cantidad);
                                }
                            });

                            oPromescalasfilter.forEach(function (value2, index) {
                                if (cantidadEval >= parseFloat(value2.Base)) {
                                    jPromoEscalaSelected = value2;
                                }
                            });

                            if (jPromoEscalaSelected) {
                                if (!that.isEmpty(jPromoEscalaSelected.Boni)) {
                                    value.descuentosVolumen1 = (parseFloat(jPromoEscalaSelected.Boni)).toFixed(2) + "%";
                                } else {
                                    value.descuentosVolumen1 = "0%"
                                }
                            } else {
                                value.descuentosVolumen1 = "0%"
                            }
                        }
                    }
                })

                //descuentos D2
                var oPromobaseDsctoSet = values[3].PromobaseDsctoSet.results;
                var oPromocionesDsctoSet = values[3].PromocionesDsctoSet.results;//usa D2
                var oPromoescalasDsctoSet = values[3].PromoescalasDsctoSet.results;//usa D2

                oMaterial.forEach(function (value, index) {
                    if (value.tipo === "MAT") {
                        var numProm = "";
                        var jPromoEscalaSelected = {};
                        var oPromescalasfilter = [];
                        var booleanVigente = false;

                        oPromocionesDsctoSet.forEach(function (value2, index) {
                            numProm = value2.Numpro;
                            booleanVigente = true;
                        });

                        if (booleanVigente) {
                            oPromoescalasDsctoSet.forEach(function (value2, index) {
                                if (value2.Flag === "X") {
                                    if (value2.Numpro === numProm) {
                                        oPromescalasfilter.push(value2);
                                    }
                                }
                            });
                            oPromescalasfilter.forEach(function (value2, index) {
                                if (parseFloat(totalImporte) >= parseFloat(value2.Base)) {
                                    jPromoEscalaSelected = value2;
                                }
                            });

                            if (jPromoEscalaSelected) {
                                if (!that.isEmpty(jPromoEscalaSelected.Boni)) {
                                    value.descuentosVolumen2 = (parseFloat(jPromoEscalaSelected.Boni)).toFixed(2) + "%";
                                } else {
                                    value.descuentosVolumen2 = "0%"
                                }
                            } else {
                                value.descuentosVolumen2 = "0%"
                            }
                        }
                    }
                })

                //CalculoTotal
                oMaterial.forEach(function (value, index) {
                    value.cantidadRecalculo = value.cantidad;
                    if (value.tipo === "MAT") {
                        var splitDescuentoCondPago = value.descuentos.split("%");
                        var iDescuentoCondPago = parseFloat(splitDescuentoCondPago[0]) / 100;

                        var splitDescuento1 = value.descuentosVolumen1.split("%");
                        var iDescuento1 = parseFloat(splitDescuento1[0]) / 100;

                        var splitDescuento2 = value.descuentosVolumen2.split("%");
                        var iDescuento2 = parseFloat(splitDescuento2[0]) / 100;

                        var iMult1 = 1 - iDescuentoCondPago;
                        var iMult2 = 1 - iDescuento1;
                        var iMult3 = 1 - iDescuento2;

                        var iSaldo1 = ((parseFloat(value.cantidad) * parseFloat((parseFloat(value.Kbetr) * that.igv))) * iMult1).toFixed(3);
                        var iSaldo2 = (parseFloat(iSaldo1) * iMult2).toFixed(3);
                        var iSaldo3 = (parseFloat(iSaldo2) * iMult3).toFixed(3);

                        var iSaldoSinIGV1 = ((parseFloat(value.cantidad) * parseFloat((parseFloat(value.Kbetr)))) * iMult1).toFixed(3);
                        var iSaldoSinIGV2 = (parseFloat(iSaldoSinIGV1) * iMult2).toFixed(3);
                        var iSaldoSinIGV3 = (parseFloat(iSaldoSinIGV2) * iMult3).toFixed(3);

                        // var iDescuentoTotal = iDescuentoCondPago + iDescuento1 + iDescuento2;
                        // var iMult = 1-iDescuentoTotal;
                        // value.total =( (parseFloat(value.cantidad) * parseFloat((parseFloat(value.Kbetr)*that.igv).toFixed(3)) )*iMult ).toString();

                        value.totalSinIGV = (iSaldoSinIGV3).toString();
                        value.total = (iSaldo3).toString();
                    }
                });

                if (oDataMaterialComb.length > 0) {
                    oDataMaterialComb.forEach(function (value) {
                        oMaterial.push(value);
                    })
                }

                that.oModelPedidoVenta.setProperty("/DataGeneral/oMaterial", oMaterial);
                that.onConteoMaterial();
                sap.ui.core.BusyIndicator.hide(0);
            }).catch(function (oError) {
                that.getMessageBox("error", that.getI18nText("errorDataUpdateMateriales"));
                sap.ui.core.BusyIndicator.hide(0);
            });
        },
        _getOtrosDescuentos: function (oData, sText) {
            try {
                return new Promise(function (resolve, reject) {
                    var oSelectedCliente = that.oModelPedidoVenta.getProperty("/DataGeneral/oSelectedCliente");
                    var urlget = jQuery.sap.getModulePath("tomapedido") + "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/";
                    var urlpost = jQuery.sap.getModulePath("tomapedido") + "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/HeaderDsctoSet";
                    var date = that.reformatDateString(that.getYYYYMMDD(new Date()));
                    var oDataSap = {
                        "Tippro": sText,
                        "Vkorg": "1000",
                        "Vtweg": oSelectedCliente.codeCanal,
                        "Kunnr": oSelectedCliente.codeCliente,
                        "Audat": date,
                        "DetailDsctoSet": oData,
                        "PromobaseDsctoSet": [
                            {
                                "Tippro": "",
                                "Numpro": "",
                                "Probas": "",
                                "Maktx": "",
                                "Flag": ""
                            }
                        ],
                        "PromocionesDsctoSet": [
                            {
                                "Tippro": "",
                                "Numpro": "",
                                "Nompro": ""
                            }
                        ],
                        "PromoescalasDsctoSet": [
                            {
                                "Tippro": "",
                                "Numpro": "",
                                "Correl": "",
                                "Base": "0",
                                "Boni": "0",
                                "Flag": ""
                            }
                        ]
                    }

                    Services.postoDataERPAsync(that, urlget, urlpost, oDataSap, function (result) {
                        util.response.validateAjaxGetERPNotMessage(result, {
                            success: function (oData, message) {
                                resolve(oData.data);
                            },
                            error: function (message) {
                                reject(message);
                            }
                        });
                    });
                });
            } catch (oError) {
                that.getMessageBox("error", that.getI18nText("sErrorTry"));
            }
        },
        _getDescuentosPago: function (oData) {
            try {
                return new Promise(function (resolve, reject) {
                    var urlget = jQuery.sap.getModulePath("tomapedido") + "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/";
                    var urlpost = jQuery.sap.getModulePath("tomapedido") + "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/HeaderListadoDtoContSet";
                    var oDataSap = {
                        "Flag": "",
                        "ListadoDtoContSet": oData,
                        "DetalleListadoDtoContSet": [
                            {
                                "Matnr": "",
                                "Emeng": "",
                                "Kbetr": "",
                                "Konwa": ""
                            }
                        ]
                    };

                    Services.postoDataERPAsync(that, urlget, urlpost, oDataSap, function (result) {
                        util.response.validateAjaxGetERPNotMessage(result, {
                            success: function (oData, message) {
                                resolve(oData.data);
                            },
                            error: function (message) {
                                reject(message);
                            }
                        });
                    });
                });
            } catch (oError) {
                that.getMessageBox("error", that.getI18nText("sErrorTry"));
            }
        },
        _getBonificaciones: function (oData) {
            try {
                return new Promise(function (resolve, reject) {
                    var urlget = jQuery.sap.getModulePath("tomapedido") + "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/";
                    var urlpost = jQuery.sap.getModulePath("tomapedido") + "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/HeaderListadoBonifSet";
                    var oDataSap = {
                        "Flag": "",
                        "ListadoBonifSet": oData,
                        "DetalleListadoBonifSet": [
                            {
                                "Matnr": "",
                                "CantBase": "",
                                "Meins": "",
                                "Knrmat": "",
                                "Maktg": "",
                                "CantBonif": "",
                                "Knrez": ""
                            }
                        ]
                    };

                    Services.postoDataERPAsync(that, urlget, urlpost, oDataSap, function (result) {
                        util.response.validateAjaxGetERPNotMessage(result, {
                            success: function (oData, message) {
                                resolve(oData.data);
                            },
                            error: function (message) {
                                reject(message);
                            }
                        });
                    });
                });
            } catch (oError) {
                that.getMessageBox("error", that.getI18nText("sErrorTry"));
            }
        },

        //Primera fase consulta de botones activos
        _onPressPromotion: function () {
            var navCon = this.byId("navcIdGroupPromotions");
            var oMaterial = that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
            var oMaterialProm = [];
            if (oMaterial.length === 0) {
                that.getMessageBox("error", that.getI18nText("errorProductNoSearch"));
                return;
            }
            oMaterial.forEach(function (value, index) {
                if (value.tipo === "MAT") {
                    // if(value.tipo === "MAT"|| value.tipo === "BON"){
                    var jsonMat = {
                        "Vbeln": "",
                        "Posnr": "",
                        "Matnr": (parseFloat(value.Matnr)).toString(),
                        "Arktx": "",
                        "Kwmeng": value.cantidad,
                        "Vrkme": value.Meins,
                        "Netpr": value.Kbetr,
                        "Netwr": (parseFloat(value.Kbetr) * parseFloat(value.cantidad)).toString(),
                        "Waerk": "PEN",
                        "Mvgr1": "",
                        "Mvgr2": ""
                    }
                    oMaterialProm.push(jsonMat);
                }
            });

            sap.ui.core.BusyIndicator.show(0);
            Promise.all([this._getPromotionsActivate(oMaterialProm)]).then((values) => {
                var oSelectedCliente = that.oModelPedidoVenta.getProperty("/DataGeneral/oSelectedCliente");
                oSelectedCliente.codeGrupoVendedores = values[0].Vkgrp;
                that.oModelPedidoVenta.setProperty("/DataGeneral/oSelectedCliente/", oSelectedCliente);

                var oPromotionActivate = values[0].ResultPromoSet.results;

                if (oPromotionActivate.length > 0) {
                    var jActivo = {
                        "Z1": oPromotionActivate[0].PromoFventas === 'X' ? false : true,
                        "Z2": oPromotionActivate[0].PromoVendedor === 'X' ? false : true,
                        "Z3": oPromotionActivate[0].PromoVolMarc === 'X' ? false : true,
                        "Z4": oPromotionActivate[0].PromoVolVta === 'X' ? false : true,
                        "Z5": oPromotionActivate[0].PromoObsequio === 'X' ? false : true,
                        "Z6": oPromotionActivate[0].PromoCliente === 'X' ? false : true,
                        "Z7": oPromotionActivate[0].PromoPorcVta === 'X' ? false : true,
                        "Z8": oPromotionActivate[0].PromoCombo === 'X' ? false : true
                    }
                    that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/oComponent", jActivo);
                } else {
                    var jActivo = {
                        "Z1": false,
                        "Z2": false,
                        "Z3": false,
                        "Z4": false,
                        "Z5": false,
                        "Z6": false,
                        "Z7": false,
                        "Z8": false,
                    }
                    that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/oComponent", jActivo);
                }
                sap.ui.core.BusyIndicator.hide(0);

                navCon.to(this.byId("IdPromotionsCenter"));

                this._byId("idFuerzaVenta").setPressed(false);
                this._byId("idBonVendedor").setPressed(false);
                this._byId("idVolMarca").setPressed(false);
                this._byId("idVolVenta").setPressed(false);
                this._byId("idObsProducto").setPressed(false);
                this._byId("idCliente").setPressed(false);
                this._byId("idPorVent").setPressed(false);
                this._byId("idCombo").setPressed(false);

                this._byId("VBoxPrimeraTabla").setVisible(true);
                this._byId("VBoxOctavaTabla").setVisible(false);
            }).catch(function (oError) {
                that.getMessageBox("error", that.getI18nText("errorDataUpdatePromocion"));
                sap.ui.core.BusyIndicator.hide(0);
            });
            // this.setFragment("_dialogAddPromotions", this.frgIdAddPromotions, "AddPromotions", this);
        },
        _getPromotionsActivate: function (oData) {
            try {
                return new Promise(function (resolve, reject) {
                    var oSelectedCliente = that.oModelPedidoVenta.getProperty("/DataGeneral/oSelectedCliente");
                    var oUser = that.getModel("oModelUser").getProperty("/oUser");
                    var sCodeUser = oUser["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"].attributes[0].value;
                    var urlget = jQuery.sap.getModulePath("tomapedido") + "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/";
                    var urlpost = jQuery.sap.getModulePath("tomapedido") + "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/ListadoPromoSet";
                    var oDataSap = {
                        "Vbeln": "",
                        "Erdat": "",
                        "Audat": "",
                        "Vbtyp": "",
                        "Vkorg": "1000",
                        "Vtweg": oSelectedCliente.codeCanal,
                        "Kdgrp": "",
                        "Vkgrp": "",
                        "Kunnr": oSelectedCliente.codeCliente,
                        "Vendedor": sCodeUser,
                        "ListadoMatSet": oData,
                        "ResultPromoSet": [
                            {
                                "PromoFventas": "",
                                "PromoVendedor": "",
                                "PromoVolMarc": "",
                                "PromoVolVta": "",
                                "PromoObsequio": "",
                                "PromoCombo": "",
                                "PromoCliente": "",
                                "PromoPorcVta": ""
                            }
                        ]
                    };

                    Services.postoDataERPAsync(that, urlget, urlpost, oDataSap, function (result) {
                        util.response.validateAjaxGetERPNotMessage(result, {
                            success: function (oData, message) {
                                resolve(oData.data);
                            },
                            error: function (message) {
                                reject(message);
                            }
                        });
                    });
                });
            } catch (oError) {
                that.getMessageBox("error", that.getI18nText("sErrorTry"));
            }
        },
        //Primera fase consulta de botones activos

        //Segunda fase consulta promociones
        onPressToggleButton: function (oEvent) {
            var oSource = oEvent.getSource();
            var sCustom = oSource.data("custom");
            // this._byId("frgIdAddPromotions--idBonificacion");
            // this._byId("idBonificacion").setPressed(false);
            this._byId("idFuerzaVenta").setPressed(false);
            this._byId("idBonVendedor").setPressed(false);
            this._byId("idVolMarca").setPressed(false);
            this._byId("idVolVenta").setPressed(false);
            this._byId("idObsProducto").setPressed(false);
            this._byId("idCliente").setPressed(false);
            this._byId("idPorVent").setPressed(false);
            this._byId("idCombo").setPressed(false);

            var oMaterialPrev = that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
            var oMaterial = [];
            var oMaterialProm = [];
            oMaterialPrev.forEach(function (value, index) {
                if (value.tipo === "MAT") {
                    var splitDescuentoCondPago = value.descuentos.split("%");
                    var iDescuentoCondPago = parseFloat(splitDescuentoCondPago[0]) / 100;

                    var splitDescuento1 = value.descuentosVolumen1.split("%");
                    var iDescuento1 = parseFloat(splitDescuento1[0]) / 100;

                    var splitDescuento2 = value.descuentosVolumen2.split("%");
                    var iDescuento2 = parseFloat(splitDescuento2[0]) / 100;

                    var iDescuentoTotal = iDescuentoCondPago + iDescuento1 + iDescuento2;
                    var iMult = 1 - iDescuentoTotal;
                    var iKbetrMult = parseFloat(value.Kbetr) * iMult;
                    // var iKbetrMult = parseFloat(value.Kbetr);

                    var jMat = {
                        "Matnr": value.Matnr,
                        "Cantidad": value.cantidad,
                        "Meins": value.Meins,
                        "Base": value.Kbetr,
                        "Netpr": (iKbetrMult).toFixed(3),
                        "Netwr": (iKbetrMult * parseFloat(value.cantidad)).toFixed(3),
                        "Waerk": "PEN"
                    }
                    oMaterial.push(jMat);
                }

                if (value.tipo === "PROFV" || value.tipo === "PROVEN" || value.tipo === "PROVM" || value.tipo === "PROVV" || value.tipo === "PROOP"
                    || value.tipo === "PROCLI" || value.tipo === "PROPV" || value.tipo === "PROCOM" || value.tipo === "PROCOMH") {
                    var jPromFuerzaVenta = {
                        "MATNR": value.Matnr,
                        "BUTTONPRESS": value.tipo,
                        "NUMPRO": value.Numpro,
                        "CANTIDAD": value.cantidad,
                        "CANTPROM": value.cantidadProm
                    }
                    oMaterialProm.push(jPromFuerzaVenta);
                }
            });

            var sPath = jQuery.sap.getModulePath("tomapedido");
            var oSelectedCliente = that.oModelPedidoVenta.getProperty("/DataGeneral/oSelectedCliente");
            var oUser = that.getModel("oModelUser").getProperty("/oUser");
            var sCodeUser = oUser["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"].attributes[0].value;
            var oDataSap = {};

            switch (sCustom) {
                case "keyFuerzaVenta":
                    this._byId("idFuerzaVenta").setPressed(true);
                    this._byId("VBoxPrimeraTabla").setVisible(true);
                    this._byId("VBoxOctavaTabla").setVisible(false);
                    this._byId("idPromoSelectCant").setVisible(true);
                    this._byId("idPromoCant").setVisible(false);
                    this._byId("idPromoSelect").setVisible(false);
                    sPath += "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/MostrarFVentaSet";
                    oDataSap = {
                        "Vbeln": "",
                        "Vbtyp": "C",
                        "Vkorg": "1000",
                        "Vtweg": oSelectedCliente.codeCanal,
                        "Kdgrp": oSelectedCliente.codeGrupoCliente,
                        "Vkgrp": oSelectedCliente.codeGrupoVendedores,
                        "Kunnr": oSelectedCliente.codeCliente,
                        "Vendedor": sCodeUser,
                        "TipPro": "01",
                        "BonifFVentaSet": [
                            {
                                "Probon": "",
                                "Maktx": "",
                                "Cantidad": "",
                                "Precio": "",
                                "CantBonif": ""
                            }
                        ],
                        "MaxBoniSet": [
                            {
                                "Numpro": "",
                                "Max": ""
                            }
                        ],
                        "DetalleFVentaSet": oMaterial,
                        "GuardarFVentaSet": oMaterialProm
                    };
                    break;
                case "keyBonVendedor":
                    this._byId("idBonVendedor").setPressed(true);
                    this._byId("VBoxPrimeraTabla").setVisible(true);
                    this._byId("VBoxOctavaTabla").setVisible(false);
                    this._byId("idPromoSelectCant").setVisible(true);
                    this._byId("idPromoCant").setVisible(false);
                    this._byId("idPromoSelect").setVisible(false);
                    sPath += "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/MostrarFVentaSet";
                    oDataSap = {
                        "TipPro": "02",
                        "Vbeln": "",
                        "Vbtyp": "",
                        "Vkorg": "1000",
                        "Vtweg": oSelectedCliente.codeCanal,
                        "Kunnr": oSelectedCliente.codeCliente,
                        "Vendedor": sCodeUser,
                        "BonifFVentaSet": [
                            {
                                "Probon": "",
                                "Maktx": "",
                                "Cantidad": "",
                                "Precio": "",
                                "CantBonif": ""
                            }
                        ],
                        "MaxBoniSet": [
                            {
                                "Numpro": "",
                                "Max": ""
                            }
                        ],
                        "DetalleFVentaSet": oMaterial,
                        "GuardarFVentaSet": oMaterialProm
                    };
                    break;
                case "keyVolMarca":
                    this._byId("idVolMarca").setPressed(true);
                    this._byId("VBoxPrimeraTabla").setVisible(true);
                    this._byId("VBoxOctavaTabla").setVisible(false);
                    this._byId("idPromoSelectCant").setVisible(false);
                    this._byId("idPromoCant").setVisible(true);
                    this._byId("idPromoSelect").setVisible(true);
                    sPath += "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/MostrarFVentaSet";
                    oDataSap = {
                        "TipPro": "03",
                        "Vbeln": "",
                        "Vbtyp": "",
                        "Vkorg": "1000",
                        "Vtweg": oSelectedCliente.codeCanal,
                        "Kunnr": oSelectedCliente.codeCliente,
                        "Vendedor": sCodeUser,
                        "BonifFVentaSet": [
                            {
                                "Probon": "",
                                "Maktx": "",
                                "Cantidad": "",
                                "Precio": "",
                                "CantBonif": ""
                            }
                        ],
                        "MaxBoniSet": [
                            {
                                "Numpro": "",
                                "Max": ""
                            }
                        ],
                        "DetalleFVentaSet": oMaterial,
                        "GuardarFVentaSet": oMaterialProm
                    };
                    break;
                case "keyVolVenta":
                    this._byId("idVolVenta").setPressed(true);
                    this._byId("VBoxPrimeraTabla").setVisible(true);
                    this._byId("VBoxOctavaTabla").setVisible(false);
                    this._byId("idPromoSelectCant").setVisible(false);
                    this._byId("idPromoCant").setVisible(true);
                    this._byId("idPromoSelect").setVisible(true);
                    sPath += "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/MostrarFVentaSet";
                    oDataSap = {
                        "TipPro": "04",
                        "Vbeln": "",
                        "Vbtyp": "",
                        "Vkorg": "1000",
                        "Vtweg": oSelectedCliente.codeCanal,
                        "Kunnr": oSelectedCliente.codeCliente,
                        "Vendedor": sCodeUser,
                        "BonifFVentaSet": [
                            {
                                "Probon": "",
                                "Maktx": "",
                                "Cantidad": "",
                                "Precio": "",
                                "CantBonif": ""
                            }
                        ],
                        "MaxBoniSet": [
                            {
                                "Numpro": "",
                                "Max": ""
                            }
                        ],
                        "DetalleFVentaSet": oMaterial,
                        "GuardarFVentaSet": oMaterialProm
                    };
                    break;
                case "keyObsProducto":
                    this._byId("idObsProducto").setPressed(true);
                    this._byId("VBoxPrimeraTabla").setVisible(true);
                    this._byId("VBoxOctavaTabla").setVisible(false);
                    this._byId("idPromoSelectCant").setVisible(true);
                    this._byId("idPromoCant").setVisible(false);
                    this._byId("idPromoSelect").setVisible(false);
                    sPath += "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/MostrarFVentaSet";
                    oDataSap = {
                        "TipPro": "05",
                        "Vbeln": "",
                        "Vbtyp": "",
                        "Vkorg": "1000",
                        "Vtweg": oSelectedCliente.codeCanal,
                        "Kunnr": oSelectedCliente.codeCliente,
                        "Vendedor": sCodeUser,
                        "BonifFVentaSet": [
                            {
                                "Probon": "",
                                "Maktx": "",
                                "Cantidad": "",
                                "Precio": "",
                                "CantBonif": ""
                            }
                        ],
                        "MaxBoniSet": [
                            {
                                "Numpro": "",
                                "Max": ""
                            }
                        ],
                        "DetalleFVentaSet": oMaterial,
                        "GuardarFVentaSet": oMaterialProm
                    };
                    break;
                case "keyCliente":
                    this._byId("idCliente").setPressed(true);
                    this._byId("VBoxPrimeraTabla").setVisible(true);
                    this._byId("VBoxOctavaTabla").setVisible(false);
                    this._byId("idPromoSelectCant").setVisible(true);
                    this._byId("idPromoCant").setVisible(false);
                    this._byId("idPromoSelect").setVisible(false);
                    sPath += "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/MostrarFVentaSet";
                    oDataSap = {
                        "TipPro": "07",
                        "Vbeln": "",
                        "Vbtyp": "",
                        "Vkorg": "1000",
                        "Vtweg": oSelectedCliente.codeCanal,
                        "Kunnr": oSelectedCliente.codeCliente,
                        "Vendedor": sCodeUser,
                        "BonifFVentaSet": [
                            {
                                "Probon": "",
                                "Maktx": "",
                                "Cantidad": "",
                                "Precio": "",
                                "CantBonif": ""
                            }
                        ],
                        "MaxBoniSet": [
                            {
                                "Numpro": "",
                                "Max": ""
                            }
                        ],
                        "DetalleFVentaSet": oMaterial,
                        "GuardarFVentaSet": oMaterialProm
                    };
                    break;
                case "keyPorVen":
                    this._byId("idPorVent").setPressed(true);
                    this._byId("VBoxPrimeraTabla").setVisible(true);
                    this._byId("VBoxOctavaTabla").setVisible(false);
                    this._byId("idPromoSelectCant").setVisible(false);
                    this._byId("idPromoCant").setVisible(false);
                    this._byId("idPromoSelect").setVisible(false);
                    sPath += "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/MostrarFVentaSet";
                    oDataSap = {
                        "TipPro": "08",
                        "Vbeln": "",
                        "Vbtyp": "",
                        "Vkorg": "1000",
                        "Vtweg": oSelectedCliente.codeCanal,
                        "Kunnr": oSelectedCliente.codeCliente,
                        "Vendedor": sCodeUser,
                        "BonifFVentaSet": [
                            {
                                "Probon": "",
                                "Maktx": "",
                                "Cantidad": "",
                                "Precio": "",
                                "CantBonif": ""
                            }
                        ],
                        "MaxBoniSet": [
                            {
                                "Numpro": "",
                                "Max": ""
                            }
                        ],
                        "DetalleFVentaSet": oMaterial,
                        "GuardarFVentaSet": oMaterialProm
                    };
                    break;
                case "keyCombo":
                    this._byId("idCombo").setPressed(true);
                    this._byId("VBoxPrimeraTabla").setVisible(false);
                    this._byId("VBoxOctavaTabla").setVisible(true);
                    this._byId("idPromoSelectCant").setVisible(false);
                    this._byId("idPromoCant").setVisible(false);
                    this._byId("idPromoSelect").setVisible(false);
                    sPath += "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/MostrarFVentaSet";
                    oDataSap = {
                        "TipPro": "06",
                        "Vbeln": "",
                        "Vbtyp": "",
                        "Vkorg": "1000",
                        "Vtweg": oSelectedCliente.codeCanal,
                        "Kunnr": oSelectedCliente.codeCliente,
                        "Vendedor": sCodeUser,
                        "BonifFVentaSet": [
                            {
                                "Probon": "",
                                "Maktx": "",
                                "Cantidad": "",
                                "Precio": "",
                                "CantBonif": ""
                            }
                        ],
                        "MaxBoniSet": [
                            {
                                "Numpro": "",
                                "Max": ""
                            }
                        ],
                        "DetailPromoPromobaseSet": [
                            {
                                "Numpro": "",
                                "Nompro": "",
                                "Probas": "",
                                "Maktx": "",
                                "Flag": ""
                            }
                        ],
                        "DetalleFVentaSet": oMaterial,
                        "GuardarFVentaSet": oMaterialProm
                    };
                    break;
            }

            sap.ui.core.BusyIndicator.show(0);
            Promise.all([this._getPromotions(sPath, oDataSap)]).then((values) => {
                var oBoniPrev = [];
                var sTipPro = values[0].TipPro;
                var oBoniVen = [];
                var oBoniVolMar = [];
                var oBoniVolVen = [];
                var oBoniObsPro = [];
                var oBoniClie = [];
                var oBoniPorVen = [];
                var oBoniCombHijo = [];
                var oBoniComb = [];
                var oPromoPrev = [];
                var oPromo = [];
                var oPromoFilter = [];
                var sCantBoni = "";

                var booleanTable = false;
                switch (sCustom) {
                    case "keyFuerzaVenta":
                        booleanTable = false;
                        oBoniPrev = values[0].BonifFVentaSet.results;
                        oBoniPrev.forEach(function (value, index) {
                            if (value.Probon) {
                                sCantBoni = value.CantBonif;
                                var jPromo = {
                                    "tipo": "PROFV",
                                    "cantidadManual": "0",
                                    "cantidadBonif": value.CantBonif,
                                    "codeProm": value.Probon,
                                    "Numpro": value.Numpro,
                                    "Nompro": value.NomPro,
                                    "descProm": value.Maktx,
                                    "precio": value.Precio,
                                    "Meins": value.Meins,
                                    "editable": "X",
                                    "TipPro": sTipPro
                                };
                                oPromo.push(jPromo);
                            }
                        });

                        oPromoFilter = values[0].MaxBoniSet.results;
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/sPromotionSelect", "");
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/oPromotionSelect", oPromoFilter);
                        break;
                    case "keyBonVendedor":
                        booleanTable = false;
                        oBoniVen = values[0].BonifFVentaSet.results;
                        oBoniVen.forEach(function (value, index) {
                            if (value.Probon) {
                                sCantBoni = value.CantBonif;
                                var jPromo = {
                                    "tipo": "PROVEN",
                                    "cantidadManual": "0",
                                    "cantidadBonif": value.CantBonif,
                                    "codeProm": value.Probon,
                                    "Numpro": value.Numpro,
                                    "Nompro": value.NomPro,
                                    "descProm": value.Maktx,
                                    "precio": value.Precio,
                                    "Meins": value.Meins,
                                    "editable": "X",
                                    "TipPro": sTipPro
                                };
                                oPromo.push(jPromo);
                            }
                        });

                        oPromoFilter = values[0].MaxBoniSet.results;
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/sPromotionSelect", "");
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/oPromotionSelect", oPromoFilter);
                        break;
                    case "keyVolMarca":
                        booleanTable = false;
                        oBoniVolMar = values[0].BonifFVentaSet.results;
                        oBoniVolMar.forEach(function (value, index) {
                            if (value.Probon) {
                                sCantBoni = value.CantBonif;
                                var jPromo = {
                                    "tipo": "PROVM",
                                    "cantidadManual": (parseFloat(value.Cantidad)).toString(),
                                    "cantidadBonif": value.CantBonif,
                                    "codeProm": value.Probon,
                                    "Numpro": value.Numpro,
                                    "Nompro": value.NomPro,
                                    "descProm": value.Maktx,
                                    "precio": value.Precio,
                                    "Meins": value.Meins,
                                    "editable": "",
                                    "TipPro": sTipPro
                                };
                                oPromo.push(jPromo);
                            }
                        });

                        $.each(that._groupBy(oBoniVolMar, 'Numpro'), function (x, y) {
                            if (x != "") {
                                var oFind = values[0].MaxBoniSet.results.find(item => item.Numpro === y[0].Numpro);
                                var jPromo = {
                                    "Numpro": y[0].Numpro,
                                    "NomPro": y[0].NomPro,
                                    "Max": "",
                                    "oMaterialProm": []
                                };

                                if (!that.isEmpty(oFind)) {
                                    jPromo.Max = oFind.Max
                                }

                                y.forEach(function (value, index) {
                                    if (value.Probon) {
                                        sCantBoni = value.CantBonif;
                                        var jPromoMat = {
                                            "tipo": "PROVM",
                                            "cantidadManual": value.Cantidad,
                                            "cantidadBonif": value.CantBonif,
                                            "codeProm": value.Probon,
                                            "Numpro": value.Numpro,
                                            "descProm": value.Maktx,
                                            "precio": value.Precio,
                                            "Meins": value.Meins,
                                            "editable": ""
                                        };
                                        jPromo.oMaterialProm.push(jPromoMat);
                                    }
                                });
                                oPromoFilter.push(jPromo);
                            }
                        });

                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/sPromotionSelect", "");
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/oPromotionSelect", oPromoFilter);
                        break;
                    case "keyVolVenta":
                        booleanTable = false;
                        oBoniVolVen = values[0].BonifFVentaSet.results;
                        oBoniVolVen.forEach(function (value, index) {
                            if (value.Probon) {
                                sCantBoni = value.CantBonif;
                                var jPromo = {
                                    "tipo": "PROVV",
                                    "cantidadManual": (parseFloat(value.Cantidad)).toString(),
                                    "cantidadBonif": value.CantBonif,
                                    "codeProm": value.Probon,
                                    "Numpro": value.Numpro,
                                    "Nompro": value.NomPro,
                                    "descProm": value.Maktx,
                                    "precio": value.Precio,
                                    "Meins": value.Meins,
                                    "editable": "",
                                    "TipPro": sTipPro
                                };
                                oPromo.push(jPromo);
                            }
                        });

                        $.each(that._groupBy(oBoniVolVen, 'Numpro'), function (x, y) {
                            if (x != "") {
                                var oFind = values[0].MaxBoniSet.results.find(item => item.Numpro === y[0].Numpro);
                                var jPromo = {
                                    "Numpro": y[0].Numpro,
                                    "NomPro": y[0].NomPro,
                                    "Max": "",
                                    "oMaterialProm": []
                                };
                                if (!that.isEmpty(oFind)) {
                                    jPromo.Max = oFind.Max
                                }

                                y.forEach(function (value, index) {
                                    if (value.Probon) {
                                        sCantBoni = value.CantBonif;
                                        var jPromoMat = {
                                            "tipo": "PROVM",
                                            "cantidadManual": value.Cantidad,
                                            "cantidadBonif": value.CantBonif,
                                            "codeProm": value.Probon,
                                            "Numpro": value.Numpro,
                                            "descProm": value.Maktx,
                                            "precio": value.Precio,
                                            "Meins": value.Meins,
                                            "editable": ""
                                        };
                                        jPromo.oMaterialProm.push(jPromoMat);
                                    }
                                });
                                oPromoFilter.push(jPromo);
                            }
                        });
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/sPromotionSelect", "");
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/oPromotionSelect", oPromoFilter);
                        break;
                    case "keyObsProducto":
                        booleanTable = false;
                        oBoniObsPro = values[0].BonifFVentaSet.results;
                        oBoniObsPro.forEach(function (value, index) {
                            if (value.Probon) {
                                sCantBoni = value.CantBonif;
                                var jPromo = {
                                    "tipo": "PROOP",
                                    "cantidadManual": "0",
                                    "cantidadBonif": value.CantBonif,
                                    "codeProm": value.Probon,
                                    "Numpro": value.Numpro,
                                    "Nompro": value.NomPro,
                                    "descProm": value.Maktx,
                                    "precio": value.Precio,
                                    "Meins": value.Meins,
                                    "editable": "X",
                                    "TipPro": sTipPro
                                };
                                oPromo.push(jPromo);
                            }
                        });

                        oPromoFilter = values[0].MaxBoniSet.results;
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/sPromotionSelect", "");
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/oPromotionSelect", oPromoFilter);
                        break;
                    case "keyCliente":
                        booleanTable = false;
                        oBoniClie = values[0].BonifFVentaSet.results;
                        oBoniClie.forEach(function (value, index) {
                            if (value.Probon) {
                                sCantBoni = value.CantBonif;
                                var jPromo = {
                                    "tipo": "PROCLI",
                                    "cantidadManual": "0",
                                    "cantidadBonif": value.CantBonif,
                                    "codeProm": value.Probon,
                                    "Numpro": value.Numpro,
                                    "descProm": value.Maktx,
                                    "precio": value.Precio,
                                    "Meins": value.Meins,
                                    "editable": "X",
                                    "TipPro": sTipPro
                                };
                                oPromo.push(jPromo);
                            }
                        });

                        oPromoFilter = values[0].MaxBoniSet.results;
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/sPromotionSelect", "");
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/oPromotionSelect", oPromoFilter);
                        break;
                    case "keyPorVen":
                        booleanTable = false;
                        oBoniPorVen = values[0].BonifFVentaSet.results;
                        oBoniPorVen.forEach(function (value, index) {
                            if (value.Probon) {
                                sCantBoni = value.CantBonif;
                                var jPromo = {
                                    "tipo": "PROPV",
                                    "cantidadManual": "0",
                                    "cantidadBonif": value.CantBonif,
                                    "codeProm": value.Probon,
                                    "Numpro": value.Numpro,
                                    "Nompro": value.NomPro,
                                    "descProm": value.Maktx,
                                    "precio": value.Precio,
                                    "Meins": value.Meins,
                                    "editable": "X",
                                    "TipPro": sTipPro
                                };
                                oPromo.push(jPromo);
                            }
                        });
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/sPromotionSelect", "");
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/oPromotionSelect", []);
                        break;
                    case "keyCombo":
                        booleanTable = true;
                        oBoniComb = values[0].BonifFVentaSet.results;
                        $.each(that._groupBy(values[0].DetailPromoPromobaseSet.results, 'Numpro'), function (x, y) {
                            var jPromo = {
                                "Numpro": y[0].Numpro,
                                "NomPro": y[0].Nompro,
                                "oMaterialPadre": []
                            };
                            y.forEach(function (value, index) {
                                if (value.Probas) {
                                    var jPromoMat = {
                                        "tipo": "PROCOM",
                                        "cantidadManual": "0",
                                        "cantidadBonif": "0",
                                        "codeProm": value.Probas,
                                        "Numpro": value.Numpro,
                                        "Nompro": value.NomPro,
                                        "descProm": value.Maktx,
                                        "precio": "0",
                                        "Meins": "PI",
                                        "editable": "",
                                        "oMaterialHijo": [],
                                        "TipPro": sTipPro
                                    };
                                    jPromo.oMaterialPadre.push(jPromoMat);
                                }
                            });
                            oPromoPrev.push(jPromo);
                        });

                        $.each(that._groupBy(oBoniComb, 'Numpro'), function (x, y) {
                            var jPromo = {
                                "Numpro": y[0].Numpro,
                                "NomPro": y[0].NomPro,
                                "oMaterialHijo": []
                            };

                            y.forEach(function (value, index) {
                                if (value.Probon) {
                                    sCantBoni = value.CantBonif;
                                    var jPromoMat = {
                                        "tipo": "PROCOMH",
                                        "cantidadManual": value.Cantidad,
                                        "cantidadBonif": value.CantBonif,
                                        "codeProm": value.Probon,
                                        "Numpro": value.Numpro,
                                        "descProm": value.Maktx,
                                        "precio": value.Precio,
                                        "Meins": value.Meins,
                                        "editable": "",
                                        "TipPro": sTipPro
                                    };
                                    jPromo.oMaterialHijo.push(jPromoMat);
                                }
                            });
                            oBoniCombHijo.push(jPromo);
                        });

                        oPromoPrev.forEach(function (valuePro, index) {
                            var oFindPro = oBoniCombHijo.find(item => item.Numpro === valuePro.Numpro);
                            valuePro.oMaterialPadre.forEach(function (valuePad, index) {
                                if (oFindPro) {
                                    valuePad.oMaterialHijo = oFindPro.oMaterialHijo;
                                }
                            });
                            oPromo.push(valuePro);
                        });
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/sPromotionSelect", "");
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/oPromotionSelect", []);
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/oPromotionPadre", []);
                        break;
                }

                if (!booleanTable) {
                    if (oPromo.length > 0) {
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/sCantBoni", sCantBoni);
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/sCantProm", "0");
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/oPromotion", oPromo);
                    } else {
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/sCantBoni", "0");
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/sCantProm", "0");
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/oPromotion", []);
                    }
                } else {
                    if (oPromo.length > 0) {
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/sCantBoni", "0");
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/oPromotion", oPromo);
                    } else {
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/sCantBoni", "0");
                        that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/oPromotion", []);
                    }
                }
                that._byId("tbPromociones").getBinding("items").filter([]);
                sap.ui.core.BusyIndicator.hide(0);
            }).catch(function (oError) {
                that.getMessageBox("error", that.getI18nText("warningMantentInternet"));
                sap.ui.core.BusyIndicator.hide(0);
            });
        },
        _getPromotions: function (sPath, oDataSap) {
            try {
                // var dataFilter = models.JsonPromocion();
                return new Promise(function (resolve, reject) {
                    // resolve(dataFilter);
                    var urlget = jQuery.sap.getModulePath("tomapedido") + "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/";
                    var urlpost = sPath;

                    Services.postoDataERPAsync(that, urlget, urlpost, oDataSap, function (result) {
                        util.response.validateAjaxGetERPNotMessage(result, {
                            success: function (oData, message) {
                                resolve(oData.data);
                            },
                            error: function (message) {
                                reject(message);
                            }
                        });
                    });
                });
            } catch (oError) {
                that.getMessageBox("error", that.getI18nText("sErrorTry"));
            }
        },
        _onLiveChangeCantVol: function (oEvent) {
            var oSource = oEvent.getSource();
            var oParent = oSource.getParent();

            var cbSelectPromo = this._byId("cbSelectPromo").getSelectedKey();
            if (that.isEmpty(cbSelectPromo)) {
                that.getMessageBox("error", that.getI18nText("sErrorSelectPromotion"));
                oSource.setValue("0");
                return;
            }
            var jObject = this._byId("cbSelectPromo").getSelectedItem().getBindingContext("oModelPedidoVenta").getObject();

            var values = oSource.getValue();
            var regex = /[^\d]/g;
            var x = values.replace(/[^\d]/g, '');
            if (values.match(regex)) {
                var x = values;
            } else {
                var x = values.substring(0, values.length - 1);
            }
            var x = parseInt(values);
            var sValueUsed = isNaN(x) ? '0' : x;

            var sCantBoni = this.oModelPedidoVenta.getProperty("/DataGeneral/oPromotions/sCantBoni");
            if (parseInt(jObject.Max) >= parseInt(sValueUsed)) {
                oSource.setValue(sValueUsed);
            } else {
                that.getMessageBox("error", that.getI18nText("errorLimitCant"));
                oSource.setValue("0");
            }
        },
        _onLiveChangeCantPrimer: function (oEvent) {
            var oSource = oEvent.getSource();
            var oParent = oSource.getParent();

            var values = oSource.getValue();
            var regex = /[^\d]/g;
            var x = values.replace(/[^\d]/g, '');
            if (values.match(regex)) {
                var x = values;
            } else {
                var x = values.substring(0, values.length - 1);
            }
            var x = parseInt(values);
            var sValueUsed = isNaN(x) ? '0' : x;

            var bPressedFV = this._byId("idFuerzaVenta").getPressed();
            var bPressedBV = this._byId("idBonVendedor").getPressed();
            var bPressedVM = this._byId("idVolMarca").getPressed();
            var bPressedVV = this._byId("idVolVenta").getPressed();
            var bPressedOP = this._byId("idObsProducto").getPressed();
            var bPressedC = this._byId("idCliente").getPressed();
            var bPressedPV = this._byId("idPorVent").getPressed();
            var bPressedCom = this._byId("idCombo").getPressed();

            var booleanPrim = false;
            var booleanSecond = false;
            if (bPressedFV || bPressedBV || bPressedOP || bPressedC) {
                booleanPrim = true;
                booleanSecond = false;
            } else if (bPressedPV) {
                booleanPrim = false;
                booleanSecond = true;
            }

            if (booleanPrim) {
                var oObject = oParent.getBindingContext("oModelPedidoVenta").getObject();
                var oPromotionSelect = this.oModelPedidoVenta.getProperty("/DataGeneral/oPromotions/oPromotionSelect");
                var oPromotion = this.oModelPedidoVenta.getProperty("/DataGeneral/oPromotions/oPromotion");
                var iSumCantPromotionNum = 0;

                oPromotion.forEach(function (value) {
                    if (value.Numpro === oObject.Numpro) {
                        if (value.codeProm === oObject.codeProm) {
                            value.cantidadManual = sValueUsed.toString();
                        }
                        iSumCantPromotionNum += parseInt(value.cantidadManual);
                    }
                });

                if (oPromotionSelect) {
                    var oFind = oPromotionSelect.find(item => item.Numpro === oObject.Numpro);

                    if (oFind) {
                        if (parseInt(oFind.Max) >= parseInt(iSumCantPromotionNum)) {
                            oSource.setValue(sValueUsed);
                        } else {
                            that.getMessageBox("error", that.getI18nText("errorLimitCant"));
                            oSource.setValue("0");
                        }
                    } else {
                        oSource.setValue("0");
                    }
                } else {
                    that.getMessageBox("error", that.getI18nText("errorLimitCant"));
                    oSource.setValue("0");
                }
            } else if (booleanSecond) {
                var oObject = oParent.getBindingContext("oModelPedidoVenta").getObject();
                var oPromotion = this.oModelPedidoVenta.getProperty("/DataGeneral/oPromotions/oPromotion");
                var iSumCantPromotionNum = 0;
                oPromotion.forEach(function (value) {
                    if (value.Numpro === oObject.Numpro) {
                        if (value.codeProm === oObject.codeProm) {
                            value.cantidadManual = sValueUsed.toString();
                        }
                        iSumCantPromotionNum += (parseFloat(value.cantidadManual) * parseFloat(value.precio));
                    }
                });

                if (parseFloat(oObject.cantidadBonif) >= parseFloat(iSumCantPromotionNum)) {
                    oSource.setValue(sValueUsed);
                } else {
                    that.getMessageBox("error", that.getI18nText("errorLimitCant"));
                    oSource.setValue("0");
                }
            } else {
                oSource.setValue(sValueUsed);
            }
        },
        //Segunda fase consulta promociones


        //Tercera fase guardar promocion local
        _onAcceptPromotion: function () {
            var oData = [];
            var sPath = jQuery.sap.getModulePath("tomapedido");
            var oSelectedCliente = that.oModelPedidoVenta.getProperty("/DataGeneral/oSelectedCliente");
            var oUser = that.getModel("oModelUser").getProperty("/oUser");
            var sCodeUser = oUser["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"].attributes[0].value;
            var oDataSap = {};

            var tbPromociones = this._byId("tbPromociones");
            var oSelectItems = tbPromociones.getItems();

            if (oSelectItems.length == 0) {
                that.getMessageBox("error", that.getI18nText("errorNotPromotionSave"));
                return;
            }

            var bPressedFV = this._byId("idFuerzaVenta").getPressed();
            var bPressedBV = this._byId("idBonVendedor").getPressed();
            var bPressedVM = this._byId("idVolMarca").getPressed();
            var bPressedVV = this._byId("idVolVenta").getPressed();
            var bPressedOP = this._byId("idObsProducto").getPressed();
            var bPressedC = this._byId("idCliente").getPressed();
            var bPressedPV = this._byId("idPorVent").getPressed();
            var bPressedC = this._byId("idCombo").getPressed();

            var booleanVol = false;
            if (bPressedVV || bPressedVM) {
                booleanVol = true;
            }
            if (booleanVol) {
                var sCantProm = that.oModelPedidoVenta.getProperty("/DataGeneral/oPromotions/sCantProm");
                var fCantProm = parseFloat(sCantProm);
                if (fCantProm === 0) {
                    that.getMessageBox("error", that.getI18nText("errorNotCant"));
                    return;
                }
                var cbSelectPromo = this._byId("cbSelectPromo").getSelectedKey();
                if (this.isEmpty(cbSelectPromo)) {
                    that.getMessageBox("error", that.getI18nText("errorSelectPromocion"));
                    return;
                }

                var oPromotionsPrev = [];
                var oPromotions = [];

                oSelectItems.forEach(function (value, index) {
                    var jObject = value.getBindingContext("oModelPedidoVenta").getObject();
                    if (jObject.Numpro === cbSelectPromo) {
                        var jMatPro = {
                            "Kunnr": "",
                            "Ean11": "",
                            "Kdgrp": "",
                            "Codfa": "",
                            "Kbetr": jObject.precio,
                            "Labst": "0",
                            "Maktg": jObject.descProm,
                            "Matnr": jObject.codeProm,
                            "Meins": jObject.Meins,
                            "Posnr": "",
                            "Txtfa": "",
                            "Umrez": "0",
                            "Vtweg": "0",
                            "cantidad": (parseFloat(jObject.cantidadManual) * fCantProm).toString(),
                            "codeMotivo": "",
                            "descMotivo": "",
                            "descuentos": "0%",
                            "descuentosVolumen1": "0%",
                            "descuentosVolumen2": "0%",
                            "icon": "sap-icon://inbox",
                            "state": "Success",
                            "status": "None",
                            "tipo": jObject.tipo,
                            "total": ((parseFloat(jObject.precio) * that.igv) * (parseFloat(jObject.cantidadManual) * fCantProm)).toString(),
                            "totalSinIGV": ((parseFloat(jObject.precio)) * (parseFloat(jObject.cantidadManual) * fCantProm)).toString(),
                            "MatnrPrinc": "",
                            "PosnrPrinc": "",
                            "Probon": jObject.Probon,
                            "Numpro": jObject.Numpro,
                            "cantidadProm": sCantProm,
                            "cantidadRecalculo": jObject.cantidadManual,
                            "TipPro": jObject.TipPro
                        }

                        oPromotionsPrev.push(jMatPro);
                    }
                });
            } else {
                var sCantProm = that.oModelPedidoVenta.getProperty("/DataGeneral/oPromotions/sCantProm");
                var oPromotionsPrev = [];
                var oPromotions = [];
                var totalImporte = 0;
                oSelectItems.forEach(function (value, index) {
                    var jObject = value.getBindingContext("oModelPedidoVenta").getObject();
                    if (parseFloat(jObject.cantidadManual) > 0) {

                        totalImporte += parseFloat(jObject.cantidadManual);
                        var jMatPro = {
                            "Kunnr": "",
                            "Ean11": "",
                            "Kdgrp": "",
                            "Codfa": "",
                            "Kbetr": jObject.precio,
                            "Labst": "0",
                            "Maktg": jObject.descProm,
                            "Matnr": jObject.codeProm,
                            "Meins": jObject.Meins,
                            "Posnr": "",
                            "Txtfa": "",
                            "Umrez": "0",
                            "Vtweg": "0",
                            "cantidad": jObject.cantidadManual,
                            "codeMotivo": "",
                            "descMotivo": "",
                            "descuentos": "0%",
                            "descuentosVolumen1": "0%",
                            "descuentosVolumen2": "0%",
                            "icon": "sap-icon://inbox",
                            "state": "Success",
                            "status": "None",
                            "tipo": jObject.tipo,
                            "total": ((parseFloat(jObject.precio) * that.igv) * parseFloat(jObject.cantidadManual)).toString(),
                            "totalSinIGV": ((parseFloat(jObject.precio)) * parseFloat(jObject.cantidadManual)).toString(),
                            "MatnrPrinc": "",
                            "PosnrPrinc": "",
                            "Probon": jObject.Probon,
                            "Numpro": jObject.Numpro,
                            "cantidadProm": sCantProm,
                            "cantidadRecalculo": jObject.cantidadManual,
                            "TipPro": jObject.TipPro
                        }

                        var oFind = that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial").find(item => item.Matnr === jObject.Matnr && item.tipo === "MAT");
                        oPromotionsPrev.push(jMatPro);
                    }
                });

                var sCantBoni = that.oModelPedidoVenta.getProperty("/DataGeneral/oPromotions/sCantBoni");
                if (totalImporte > parseFloat(sCantBoni)) {
                    that.getMessageBox("error", that.getI18nText("errorLimitCant"));
                    return;
                }
            }


            var date = this.convertformatDateInAbap(new Date());
            var oMaterialBon = [];
            oPromotionsPrev.forEach(function (value, index) {
                var jMaterialBon = {
                    "Kunnr": oSelectedCliente.codeCliente,
                    "Vtweg": oSelectedCliente.codeCanal,
                    "Datum": date,
                    "Matnr": value.Matnr,
                    "Meins": value.Meins,
                    "Emeng": value.cantidad
                }
                oMaterialBon.push(jMaterialBon);
            });

            sap.ui.core.BusyIndicator.show(0);
            Promise.all([this._getBonificaciones(oMaterialBon)]).then((values) => {
                //Bonificacion
                var oResultBonificacion = [];
                if (values[0].DetalleListadoBonifSet.results) {
                    values[0].DetalleListadoBonifSet.results.forEach(function (value, index) {
                        var jMaterialBonificacion = {
                            "Codfa": "",
                            "Kbetr": "0.000",
                            "Labst": "0",
                            "Maktg": value.Maktg,
                            "Matnr": value.Knrmat,
                            "Meins": value.Meins,
                            "Posnr": "",
                            "Txtfa": "",
                            "Umrez": "0",
                            "Vtweg": "0",
                            "cantidad": value.CantBonif,
                            "codeMotivo": "",
                            "descMotivo": "",
                            "descuentos": "0%",
                            "descuentosVolumen1": "0%",
                            "descuentosVolumen2": "0%",
                            "icon": "sap-icon://inbox",
                            "state": "Success",
                            "status": "None",
                            "tipo": "BONPRO",
                            "total": "0",
                            "totalSinIGV": "0",
                            "MatnrPrinc": value.Matnr,
                            "PosnrPrinc": "",
                            "Probon": "",
                            "Numpro": "",
                            "cantidadProm": "",
                            "cantidadRecalculo": value.CantBonif
                        }
                        oResultBonificacion.push(jMaterialBonificacion);
                    });
                    oPromotionsPrev.forEach(function (value, index) {
                        oPromotions.push(value);
                        oResultBonificacion.forEach(function (valueBon, index) {
                            if (value.Matnr === valueBon.MatnrPrinc) {
                                oPromotions.push(valueBon);
                            }
                        });
                    });
                }

                var oMaterialPrev = that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
                var oMaterial = [];
                var oMaterialGroup = [];

                oMaterialPrev.forEach(function (value) {
                    oMaterialGroup.push(value)
                });

                oMaterialPrev.forEach(function (value, index) {
                    oMaterial.push(value);
                    if (value.tipo === "MAT") {
                        oPromotions.forEach(function (value2, index2) {
                            if (value2.tipo != "BONPRO") {
                                if (value.Matnr === value2.Matnr) {
                                    value2.MatnrPrinc = value.Matnr;
                                    value2.PosnrPrinc = value.Posnr;
                                    value2.Posnr = that.zfill(parseFloat(value.Posnr) + 1, 6);
                                    // oMaterial.push(value2);
                                }
                            } else {
                                if (value.Matnr === value2.MatnrPrinc) {
                                    value2.MatnrPrinc = value.Matnr;
                                    value2.PosnrPrinc = that.zfill(parseFloat(value.Posnr) + 1, 6);
                                    value2.Posnr = that.zfill(parseFloat(value.Posnr) + 2, 6);
                                    // oMaterial.push(value2);
                                }
                            }
                        });
                    }
                });

                var oMaterialConcat = oMaterial.concat(oPromotions);

                var sPath = jQuery.sap.getModulePath("tomapedido");
                var oDataSap = {};
                Promise.all([that._savePromotions(sPath, oDataSap)]).then((values) => {
                    that.oModelPedidoVenta.setProperty("/DataGeneral/oMaterial", oMaterialConcat);
                    that.onConteoMaterial();
                    that.onNavBackPromotion()
                    sap.ui.core.BusyIndicator.hide(0);
                }).catch(function (oError) {
                    that.getMessageBox("error", that.getI18nText("warningMantentInternet"));
                    sap.ui.core.BusyIndicator.hide(0);
                });

            }).catch(function (oError) {
                that.getMessageBox("error", that.getI18nText("warningMantentInternet"));
                sap.ui.core.BusyIndicator.hide(0);
            });

        },
        _savePromotions: function (oData) {
            try {
                return new Promise(function (resolve, reject) {
                    var urlget = jQuery.sap.getModulePath("tomapedido") + "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/";
                    var urlpost = jQuery.sap.getModulePath("tomapedido") + "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/GuardarFVentaSet";
                    var oDataSap = {}
                    if (false) {
                        Services.postoDataERPAsync(that, urlget, urlpost, oDataSap, function (result) {
                            util.response.validateAjaxGetERPNotMessage(result, {
                                success: function (oData, message) {
                                    resolve(oData.data);
                                },
                                error: function (message) {
                                    reject(message);
                                }
                            });
                        });
                    } else {
                        resolve("exito");
                    }

                });
            } catch (oError) {
                that.getMessageBox("error", that.getI18nText("sErrorTry"));
            }
        },
        //Tercera fase guardar promocion local

        //Segundo Tab Promociones
        onNavBackPromotion: function () {
            var navCon = this.byId("navcIdGroupPromotions");
            navCon.back();
            that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/oPromotion", []);
            that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/oPromotionDetail", []);
            that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/oPromotionPadre", []);
            that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/sCantBoni", "");
            that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/sCantProm", "");
            that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/sPromotionSelect", "");
            that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/oPromotionSelect", []);
        },
        _onNavDetallePromocion: function () {
            this.setFragment("_dialogAddPromotions", this.frgIdAddPromotions, "AddPromotions", this);
            var dataFilter = models.JsonPromocionDetail();
            this.oModelPedidoVenta.setProperty("/PromocionesDetail", dataFilter);
        },

        //Promocion Volumen Marca
        //Promocion Volumen Marca

        //Promocion Combo
        _onPressDetailPromotion: function (oEvent) {
            var oSource = oEvent.getSource();
            var jObject = oSource.getBindingContext("oModelPedidoVenta").getObject();
            var oMaterial = jObject.oMaterialPadre ;
            if (oMaterial.length > 0) {
                this.setFragment("_dialogAddPromotions", this.frgIdAddPromotions, "AddPromotions", this);
                var sCodeProm = parseFloat(oMaterial[0].codeProm).toString();
                this._byId("frgIdAddPromotions--idAddPromotions").setText(jObject.Numpro + "-" + sCodeProm);
                this.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/oPromotionDetail", oMaterial[0].oMaterialHijo);
                this.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/oPromotionPadre", oMaterial);
            }
        },
        _onAcceptCombosDetail: function (oEvent) {// Cambios Claudia 15/03/2023
            var that = this;
            var tablaCombo = sap.ui.getCore().byId("tbCombosDetail");
            var oSelectedCliente = that.oModelPedidoVenta.getProperty("/DataGeneral/oSelectedCliente");
            var oUser = that.getModel("oModelUser").getProperty("/oUser");
            var sCodeUser = oUser["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"].attributes[0].value;
            var oDataSap = {};
            var oDataMaterial = that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
            var oSelectItems = tablaCombo.getItems();
            var oSource = oEvent.getSource();


            if (oSelectItems.length == 0) {
                that.getMessageBox("error", that.getI18nText("errorNotPromotionSave"));
                return;
            }
            var sCantBoni = that.oModelPedidoVenta.getProperty("/DataGeneral/oPromotions/sCantBoniCombo");

            if (parseFloat(sCantBoni) === 0) {
                that.getMessageBox("error", that.getI18nText("errorNotCant"));
                return;
            }

            var oPromotionsPrev = [];
            var oPromotions = [];
            var totalImporte = 0;
            var oPromotionPadre = this.oModelPedidoVenta.getProperty("/DataGeneral/oPromotions/oPromotionPadreCombo");
            var jMatPadre = {
                "Kunnr": "",
                "Ean11": "",
                "Kdgrp": "",
                "Codfa": "",
                "Kbetr": oPromotionPadre.Kbetr,
                "Labst": "0",
                "Maktg": oPromotionPadre.Maktg,
                "Matnr": oPromotionPadre.Matnr,
                "Meins": oPromotionPadre.Meins,
                "Posnr": "",
                "Txtfa": "",
                "Umrez": "0",
                "Vtweg": "0",
                "cantidad": (parseFloat(sCantBoni)).toString(),
                "codeMotivo": "",
                "descMotivo": "",
                "descuentos": "0%",
                "descuentosVolumen1": "0%",
                "descuentosVolumen2": "0%",
                "icon": "sap-icon://inbox",
                "state": "Success",
                "status": "None",
                "tipo": oPromotionPadre.tipo,
                "total": ((parseFloat(oPromotionPadre.Kbetr) * that.igv) * (parseFloat(sCantBoni))).toString(),
                "totalSinIGV": ((parseFloat(oPromotionPadre.Kbetr)) * (parseFloat(sCantBoni))).toString(),
                "MatnrPrinc": "",
                "PosnrPrinc": "",
                "Probon": "",
                "Numpro": oPromotionPadre.Numpro,
                "cantidadRecalculo": (parseFloat(sCantBoni)).toString(),
                "TipPro": oPromotionPadre.TipPro
            }
            oPromotionsPrev.push(jMatPadre);

            oSelectItems.forEach(function (value, index) {
                var jObject = value.getBindingContext("oModelGetPedidoVenta").getObject();
                var sCantidad = that.oModelPedidoVenta.getProperty("/DataGeneral/oPromotions/sCantBoniCombo");
                var jMatPro = {
                    "Kunnr": "",
                    "Ean11": "",
                    "Kdgrp": "",
                    "Codfa": "",
                    "Kbetr": jObject.Precio,
                    "Labst": "0",
                    "Maktg": jObject.Maktx,
                    "Matnr": jObject.Probon,
                    "Meins": jObject.Meins,
                    "Posnr": "",
                    "Txtfa": "",
                    "Umrez": "0",
                    "Vtweg": "0",
                    "cantidad": (parseFloat(jObject.Cantidad) * parseFloat(sCantidad)).toString(),
                    "codeMotivo": "",
                    "descMotivo": "",
                    "descuentos": "0%",
                    "descuentosVolumen1": "0%",
                    "descuentosVolumen2": "0%",
                    "icon": "sap-icon://inbox",
                    "state": "Success",
                    "status": "None",
                    "tipo": jObject.tipo,
                    "total": ((parseFloat(jObject.Precio) * that.igv) * (parseFloat(jObject.Cantidad) * parseFloat(sCantidad))).toString(),
                    "totalSinIGV": ((parseFloat(jObject.Precio)) * (parseFloat(jObject.Cantidad) * parseFloat(sCantidad))).toString(),
                    "MatnrPrinc": oPromotionPadre.Numpro,
                    "PosnrPrinc": "",
                    "Probon": jObject.Probon,
                    "Numpro": jObject.Numpro,
                    "cantidadRecalculo": (parseFloat(jObject.Cantidad) * parseFloat(sCantidad)).toString(),
                    "TipPro": jObject.TipPro
                }
                oPromotionsPrev.push(jMatPro);
            });


            var date = this.convertformatDateInAbap(new Date());
            var oMaterialBon = [];
            oPromotionsPrev.forEach(function (value, index) {
                var jMaterialBon = {
                    "Kunnr": oSelectedCliente.codeCliente,
                    "Vtweg": oSelectedCliente.codeCanal,
                    "Datum": date,
                    "Matnr": value.Matnr,
                    "Meins": value.Meins,
                    "Emeng": value.cantidad
                }
                oMaterialBon.push(jMaterialBon);
            });

            sap.ui.core.BusyIndicator.show(0);
            Promise.all([this._getBonificaciones(oMaterialBon)]).then((values) => {
                //Bonificacion
                var oResultBonificacion = [];
                if (values[0].DetalleListadoBonifSet.results) {
                    values[0].DetalleListadoBonifSet.results.forEach(function (value, index) {
                        var jMaterialBonificacion = {
                            "Codfa": "",
                            "Kbetr": "0.000",
                            "Labst": "0",
                            "Maktg": value.Maktg,
                            "Matnr": value.Knrmat,
                            "Meins": value.Meins,
                            "Posnr": "",
                            "Txtfa": "",
                            "Umrez": "0",
                            "Vtweg": "0",
                            "cantidad": value.CantBonif,
                            "codeMotivo": "",
                            "descMotivo": "",
                            "descuentos": "0%",
                            "descuentosVolumen1": "0%",
                            "descuentosVolumen2": "0%",
                            "icon": "sap-icon://inbox",
                            "state": "Success",
                            "status": "None",
                            "tipo": "BONPRO",
                            "total": "0",
                            "totalSinIGV": "0",
                            "MatnrPrinc": value.Matnr,
                            "PosnrPrinc": "",
                            "Probon": "",
                            "Numpro": "",
                            "cantidadRecalculo": value.CantBonif
                        }
                        oResultBonificacion.push(jMaterialBonificacion);
                    });
                    oPromotionsPrev.forEach(function (value, index) {
                        oPromotions.push(value);
                        oResultBonificacion.forEach(function (valueBon, index) {
                            if (value.Matnr === valueBon.MatnrPrinc) {
                                oPromotions.push(valueBon);
                            }
                        });
                    });
                }

                var oMaterialPrev = that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
                var oMaterial = [];
                var oMaterialGroup = [];

                oMaterialPrev.forEach(function (value) {
                    oMaterialGroup.push(value)
                });

                oMaterialPrev.forEach(function (value, index) {
                    oMaterial.push(value);
                    if (value.tipo === "MAT") {
                        oPromotions.forEach(function (value2, index2) {
                            if (value2.tipo != "BONPRO") {
                                if (value.Matnr === value2.Matnr) {
                                    value2.MatnrPrinc = value.Matnr;
                                    value2.PosnrPrinc = value.Posnr;
                                    value2.Posnr = that.zfill(parseFloat(value.Posnr) + 1, 6);
                                    // oMaterial.push(value2);
                                }
                            } else {
                                if (value.Matnr === value2.MatnrPrinc) {
                                    value2.MatnrPrinc = value.Matnr;
                                    value2.PosnrPrinc = that.zfill(parseFloat(value.Posnr) + 1, 6);
                                    value2.Posnr = that.zfill(parseFloat(value.Posnr) + 2, 6);
                                    // oMaterial.push(value2);
                                }
                            }
                        });
                    }
                });

                //var oMaterialConcat = oMaterial.concat(oPromotions);//Cambios Claudia 16/03/2023

                oMaterial.forEach(function (obj) {// Cambios Claudia 17/03/2023
                    oPromotions.forEach(function (items) {
                        if (obj.Matnr === items.Matnr) {

                            obj.Codfa = items.Codfa ;    
                            obj.Kbetr=  items.Kbetr.replaceAll(" " , "");  //Cambios de Claudia 17/03/2023      
                            obj.Labst=  items.Labst;
                            obj.Maktg=  items.Maktg;
                            //obj.Matnr=  items.Matnr;
                            obj.Meins=   items.Meins;
                            obj.Posnr=   items.Posnr;
                            obj.Txtfa=   items.Txtfa;
                            obj.Umrez=   items.Umrez;
                            obj.Vtweg=   items.Vtweg;
                            obj.cantidad=  items.cantidad;
                            obj.cantidadRecalculo=  items.cantidadRecalculo;
                            obj.codeMotivo= items.codeMotivo;
                            obj.descMotivo= items.descMotivo;
                            obj.descuentos=  items.descuentos;
                            obj.descuentosVolumen1= items.descuentosVolumen1;
                            obj.descuentosVolumen2= items.descuentosVolumen2;
                            obj.icon= items.icon;
                            obj.state= items.state;
                            obj.status= items.status;
                            //obj.tipo=  items.tipo;
                            obj.total=  items.total;


                        }
                    });

                });

                var sPath = jQuery.sap.getModulePath("tomapedido");
                var oDataSap = {};
                Promise.all([that._savePromotions(sPath, oDataSap)]).then((values) => {
                    oSource.getParent().close();
                    that.oModelPedidoVenta.setProperty("/DataGeneral/oMaterial", oMaterial);
                    that.onConteoMaterial();
                    that.onNavBackPromotion()
                    sap.ui.core.BusyIndicator.hide(0);
                }).catch(function (oError) {
                    that.getMessageBox("error", that.getI18nText("warningMantentInternet"));
                    sap.ui.core.BusyIndicator.hide(0);
                });

            }).catch(function (oError) {
                that.getMessageBox("error", that.getI18nText("warningMantentInternet"));
                sap.ui.core.BusyIndicator.hide(0);
            });


        },
        _onAcceptPromotionDetail: function (oEvent) {
            var oSource = oEvent.getSource();
            var tbPromocionesDetail = this._byId("frgIdAddPromotions--tbPromocionesDetail");
            var frgIdEditCombo = this._byId("frgIdEditCombo--tbCombosDetail");
            var tablaCombo = sap.ui.getCore().byId("tbCombosDetail");
            var oSelectItems = "";
            var oData = [];
            var sPath = jQuery.sap.getModulePath("tomapedido");
            var oSelectedCliente = that.oModelPedidoVenta.getProperty("/DataGeneral/oSelectedCliente");
            var oUser = that.getModel("oModelUser").getProperty("/oUser");
            var sCodeUser = oUser["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"].attributes[0].value;
            var oDataSap = {};
            var oDataMaterial = that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");

            // if(tablaCombo !== undefined){// Cambios Claudia 15/03/2023
            //     oSelectItems= tablaCombo.getItems(); 
            // }else{
            oSelectItems = tbPromocionesDetail.getItems();
            // }

            if (oSelectItems.length == 0) {
                that.getMessageBox("error", that.getI18nText("errorNotPromotionSave"));
                return;
            }

            var sCantBoni = that.oModelPedidoVenta.getProperty("/DataGeneral/oPromotions/sCantBoni");
            if (parseFloat(sCantBoni) === 0) {
                that.getMessageBox("error", that.getI18nText("errorNotCant"));
                return;
            }

            var oPromotionsPrev = [];
            var oPromotions = [];
            var totalImporte = 0;
            var oPromotionPadre = this.oModelPedidoVenta.getProperty("/DataGeneral/oPromotions/oPromotionPadre")[0];
            var jMatPadre = {
                "Kunnr": "",
                "Ean11": "",
                "Kdgrp": "",
                "Codfa": "",
                "Kbetr": oPromotionPadre.precio,
                "Labst": "0",
                "Maktg": oPromotionPadre.descProm,
                "Matnr": oPromotionPadre.codeProm,
                "Meins": oPromotionPadre.Meins,
                "Posnr": "",
                "Txtfa": "",
                "Umrez": "0",
                "Vtweg": "0",
                "cantidad": (parseFloat(sCantBoni)).toString(),
                "codeMotivo": "",
                "descMotivo": "",
                "descuentos": "0%",
                "descuentosVolumen1": "0%",
                "descuentosVolumen2": "0%",
                "icon": "sap-icon://inbox",
                "state": "Success",
                "status": "None",
                "tipo": oPromotionPadre.tipo,
                "total": ((parseFloat(oPromotionPadre.precio) * that.igv) * (parseFloat(sCantBoni))).toString(),
                "totalSinIGV": ((parseFloat(oPromotionPadre.precio)) * (parseFloat(sCantBoni))).toString(),
                "MatnrPrinc": "",
                "PosnrPrinc": "",
                "Probon": "",
                "Numpro": oPromotionPadre.Numpro,
                "cantidadRecalculo": (parseFloat(sCantBoni)).toString(),
                "TipPro": oPromotionPadre.TipPro
            }
            oPromotionsPrev.push(jMatPadre);

            oSelectItems.forEach(function (value, index) {
                var jObject = value.getBindingContext("oModelPedidoVenta").getObject();
                var sCantidad = that.oModelPedidoVenta.getProperty("/DataGeneral/oPromotions/sCantBoni");
                var jMatPro = {
                    "Kunnr": "",
                    "Ean11": "",
                    "Kdgrp": "",
                    "Codfa": "",
                    "Kbetr": jObject.precio,
                    "Labst": "0",
                    "Maktg": jObject.descProm,
                    "Matnr": jObject.codeProm,
                    "Meins": jObject.Meins,
                    "Posnr": "",
                    "Txtfa": "",
                    "Umrez": "0",
                    "Vtweg": "0",
                    "cantidad": (parseFloat(jObject.cantidadManual) * parseFloat(sCantidad)).toString(),
                    "codeMotivo": "",
                    "descMotivo": "",
                    "descuentos": "0%",
                    "descuentosVolumen1": "0%",
                    "descuentosVolumen2": "0%",
                    "icon": "sap-icon://inbox",
                    "state": "Success",
                    "status": "None",
                    "tipo": jObject.tipo,
                    "total": ((parseFloat(jObject.precio) * that.igv) * (parseFloat(jObject.cantidadManual) * parseFloat(sCantidad))).toString(),
                    "totalSinIGV": ((parseFloat(jObject.precio)) * (parseFloat(jObject.cantidadManual) * parseFloat(sCantidad))).toString(),
                    "MatnrPrinc": oPromotionPadre.codeProm,
                    "PosnrPrinc": "",
                    "Probon": jObject.Probon,
                    "Numpro": jObject.Numpro,
                    "cantidadRecalculo": (parseFloat(jObject.cantidadManual) * parseFloat(sCantidad)).toString(),
                    "TipPro": jObject.TipPro
                }
                oPromotionsPrev.push(jMatPro);
            });

            var confirmacionCombo = false; // Cambios Claudia 16/03/2023
            oDataMaterial.forEach(function (items) {
                oPromotionsPrev.forEach(function (obs) {

                    if (obs.Numpro === items.Numpro) {
                        confirmacionCombo = true;
                    }
                });
            });

            if (confirmacionCombo) {

                that.getMessageBox("warning", that.getI18nText("txtMensajeCombo"));
                sap.ui.core.BusyIndicator.hide(0);
                return;
            }

            var date = this.convertformatDateInAbap(new Date());
            var oMaterialBon = [];
            oPromotionsPrev.forEach(function (value, index) {
                var jMaterialBon = {
                    "Kunnr": oSelectedCliente.codeCliente,
                    "Vtweg": oSelectedCliente.codeCanal,
                    "Datum": date,
                    "Matnr": value.Matnr,
                    "Meins": value.Meins,
                    "Emeng": value.cantidad
                }
                oMaterialBon.push(jMaterialBon);
            });

            sap.ui.core.BusyIndicator.show(0);
            Promise.all([this._getBonificaciones(oMaterialBon)]).then((values) => {
                //Bonificacion
                var oResultBonificacion = [];
                if (values[0].DetalleListadoBonifSet.results) {
                    values[0].DetalleListadoBonifSet.results.forEach(function (value, index) {
                        var jMaterialBonificacion = {
                            "Codfa": "",
                            "Kbetr": "0.000",
                            "Labst": "0",
                            "Maktg": value.Maktg,
                            "Matnr": value.Knrmat,
                            "Meins": value.Meins,
                            "Posnr": "",
                            "Txtfa": "",
                            "Umrez": "0",
                            "Vtweg": "0",
                            "cantidad": value.CantBonif,
                            "codeMotivo": "",
                            "descMotivo": "",
                            "descuentos": "0%",
                            "descuentosVolumen1": "0%",
                            "descuentosVolumen2": "0%",
                            "icon": "sap-icon://inbox",
                            "state": "Success",
                            "status": "None",
                            "tipo": "BONPRO",
                            "total": "0",
                            "totalSinIGV": "0",
                            "MatnrPrinc": value.Matnr,
                            "PosnrPrinc": "",
                            "Probon": "",
                            "Numpro": "",
                            "cantidadRecalculo": value.CantBonif
                        }
                        oResultBonificacion.push(jMaterialBonificacion);
                    });
                    oPromotionsPrev.forEach(function (value, index) {
                        oPromotions.push(value);
                        oResultBonificacion.forEach(function (valueBon, index) {
                            if (value.Matnr === valueBon.MatnrPrinc) {
                                oPromotions.push(valueBon);
                            }
                        });
                    });
                }

                var oMaterialPrev = that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
                var oMaterial = [];
                var oMaterialGroup = [];

                oMaterialPrev.forEach(function (value) {
                    oMaterialGroup.push(value)
                });

                oMaterialPrev.forEach(function (value, index) {
                    oMaterial.push(value);
                    if (value.tipo === "MAT") {
                        oPromotions.forEach(function (value2, index2) {
                            if (value2.tipo != "BONPRO") {
                                if (value.Matnr === value2.Matnr) {
                                    value2.MatnrPrinc = value.Matnr;
                                    value2.PosnrPrinc = value.Posnr;
                                    value2.Posnr = that.zfill(parseFloat(value.Posnr) + 1, 6);
                                    // oMaterial.push(value2);
                                }
                            } else {
                                if (value.Matnr === value2.MatnrPrinc) {
                                    value2.MatnrPrinc = value.Matnr;
                                    value2.PosnrPrinc = that.zfill(parseFloat(value.Posnr) + 1, 6);
                                    value2.Posnr = that.zfill(parseFloat(value.Posnr) + 2, 6);
                                    // oMaterial.push(value2);
                                }
                            }
                        });
                    }
                });

                var oMaterialConcat = oMaterial.concat(oPromotions);

                var sPath = jQuery.sap.getModulePath("tomapedido");
                var oDataSap = {};
                Promise.all([that._savePromotions(sPath, oDataSap)]).then((values) => {
                    oSource.getParent().close();
                    that.oModelPedidoVenta.setProperty("/DataGeneral/oMaterial", oMaterialConcat);
                    that.onConteoMaterial();
                    that.onNavBackPromotion()
                    sap.ui.core.BusyIndicator.hide(0);
                }).catch(function (oError) {
                    that.getMessageBox("error", that.getI18nText("warningMantentInternet"));
                    sap.ui.core.BusyIndicator.hide(0);
                });

            }).catch(function (oError) {
                that.getMessageBox("error", that.getI18nText("warningMantentInternet"));
                sap.ui.core.BusyIndicator.hide(0);
            });

        },
        //Promocion Combo

        //modificacion
        _onPressEdit: function (oEvent) {
            var oSource = oEvent.getSource();
            var tbProductos = this._byId("tbProductos");
            var oMaterialesSelected = [];
            var oOtrosDescuentos = [];
            var that = this;

            var oMaterialPrev = this.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
            var oSelectedCliente = that.oModelPedidoVenta.getProperty("/DataGeneral/oSelectedCliente");
            var oUser = that.getModel("oModelUser").getProperty("/oUser");
            var sCodeUser = oUser["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"].attributes[0].value;


            var oMaterial = [];
            var oMateriales_1 = [];
            var oMaterialProm = [];
            oMaterialPrev.forEach(function (value) {
                oMaterial.push(value);

            });

            oMaterialPrev.forEach(function (value, index) {
                if (value.tipo === "MAT") {
                    var splitDescuentoCondPago = value.descuentos.split("%");
                    var iDescuentoCondPago = parseFloat(splitDescuentoCondPago[0]) / 100;

                    var splitDescuento1 = value.descuentosVolumen1.split("%");
                    var iDescuento1 = parseFloat(splitDescuento1[0]) / 100;

                    var splitDescuento2 = value.descuentosVolumen2.split("%");
                    var iDescuento2 = parseFloat(splitDescuento2[0]) / 100;

                    var iDescuentoTotal = iDescuentoCondPago + iDescuento1 + iDescuento2;
                    var iMult = 1 - iDescuentoTotal;
                    var iKbetrMult = parseFloat(value.Kbetr) * iMult;
                    // var iKbetrMult = parseFloat(value.Kbetr);

                    var jMat = {
                        "Matnr": value.Matnr,
                        "Cantidad": value.cantidad,
                        "Meins": value.Meins,
                        "Base": value.Kbetr,
                        "Netpr": (iKbetrMult).toFixed(3),
                        "Netwr": (iKbetrMult * parseFloat(value.cantidad)).toFixed(3),
                        "Waerk": "PEN"
                    }
                    oMateriales_1.push(jMat);
                }

                if (value.tipo === "PROFV" || value.tipo === "PROVEN" || value.tipo === "PROVM" || value.tipo === "PROVV" || value.tipo === "PROOP"
                    || value.tipo === "PROCLI" || value.tipo === "PROPV" || value.tipo === "PROCOM" || value.tipo === "PROCOMH") {
                    var jPromFuerzaVenta = {
                        "MATNR": value.Matnr,
                        "BUTTONPRESS": value.tipo,
                        "NUMPRO": value.Numpro,
                        "CANTIDAD": value.cantidad,
                        "CANTPROM": value.cantidadProm
                    }
                    oMaterialProm.push(jPromFuerzaVenta);
                }
            });

            var oSelectItems = [];
            if (tbProductos.getSelectedItems().length == 0) {
                that.getMessageBox("error", that.getI18nText("errorSelectProduct"));
                return;
            }

            var oDetailStockSet = [];
            var datosCombos = [];
            var booleanProm = false;
            var seleccionmat = "";
            tbProductos.getSelectedItems().forEach(function (value, index) {
                var jObject = value.getBindingContext("oModelPedidoVenta").getObject();
                var sTipo = jObject.tipo;

                seleccionmat = jObject;
                if (sTipo === "PROCOM") {
                    booleanProm = true;
                }
                oSelectItems.push(jObject);
                var jValue = {
                    "Type": "G",
                    "Matnr": jObject.Matnr,
                    "Meins": jObject.Meins,
                    "Werks": "1020",
                    "Lgort": "0201",
                    "Labst": "0"
                }
                oDetailStockSet.push(jValue);
            });
            that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/oPromotionPadreCombo", seleccionmat);// Cambios Claudia 16/03/2023
            that.oModelPedidoVenta.setProperty("/DataGeneral/oPromotions/sCantBoniCombo", parseFloat(seleccionmat.cantidad).toFixed(2));//Cambios Claudia 21/03/2023

            // if(booleanProm){// Cambio de Claudia 15/03/2023
            //     that.getMessageBox("error", that.getI18nText("errorSelectProduct"));
            //     return;
            // }

            sap.ui.core.BusyIndicator.show(0);
            Promise.all([that._getStockMateriales(oDetailStockSet)]).then((values) => {
                that._byId("tbProductos").removeSelections(true);
                if (booleanProm) {  // Cambio de Claudia 15/03/2023

                    var datos = {
                        "Vbeln": "",
                        "Vbtyp": "",
                        "Vkorg": "1000",
                        "Vtweg": oSelectedCliente.codeCanal,
                        "Kdgrp": oSelectedCliente.codeGrupoCliente,
                        "Vkgrp": oSelectedCliente.codeGrupoVendedores,
                        "Kunnr": oSelectedCliente.codeCliente,
                        "Vendedor": sCodeUser,
                        "TipPro": "06",
                        "BonifFVentaSet": [
                            {
                                "Probon": "",
                                "Maktx": "",
                                "Cantidad": "",
                                "Precio": "",
                                "CantBonif": ""
                            }
                        ],
                        "MaxBoniSet": [
                            {
                                "Numpro": "",
                                "Max": ""
                            }
                        ],
                        "DetalleFVentaSet": oMateriales_1,
                        "GuardarFVentaSet": oMaterialProm
                    };
                    $.ajax({
                        url: jQuery.sap.getModulePath("tomapedido") + "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/",

                        type: "GET",
                        headers: {
                            "x-CSRF-Token": "Fetch"
                        }
                    }).always(function (data, status, response) {
                        var token = response.getResponseHeader("x-csrf-token");
                        $.ajax({
                            url: jQuery.sap.getModulePath("tomapedido") + "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/MostrarFVentaSet",
                            method: "POST",
                            headers: {
                                "x-CSRF-Token": token
                            },
                            async: true,
                            contentType: "application/json",
                            dataType: "json",
                            data: JSON.stringify(datos),
                        }).always(async function (data, status, response) {
                            var datos = data.d.BonifFVentaSet.results;

                            if (datos.length > 0) {
                                datos.forEach(function (obs) {

                                    if (obs.Numpro === seleccionmat.Numpro) {
                                        datosCombos.push(obs);
                                    }

                                });

                                that.oModelGetPedidoVenta.setProperty("/oDataCombos", datosCombos);
                                that.oModelPedidoVenta.setProperty("/CodigoPromoci", (seleccionmat.Numpro + "-" + parseFloat(seleccionmat.Matnr)).toString());
                                that.oModelPedidoVenta.setProperty("/DescripcionCombo", oSelectItems);
                                that.oModelPedidoVenta.setProperty("/keyCombo", seleccionmat.Matnr);
                                that.oModelPedidoVenta.setProperty("/CantidadCombo", "0");
                                if (!that.AddCombo) {
                                    that.AddCombo = sap.ui.xmlfragment("tomapedido.view.dialogs.EditCombo", that);
                                    that.getView().addDependent(that.AddCombo);
                                }
                                that.AddCombo.open();
                                sap.ui.core.BusyIndicator.hide(0);

                            }

                        });
                    });


                } else {

                    this.setFragment("_dialogEditProduct", this.frgIdEditProduct, "EditProduct", this);

                    var oStock = values[0].DetailStockSet.results;
                    oSelectItems.forEach(async function (value, index) {
                        var oFindStock = oStock.find(item => item.Matnr === value.Matnr && item.Meins === value.Meins);
                        var iDisponible = 0;
                        iDisponible = parseFloat(value.cantidad);
                        if (!that.isEmpty(oFindStock)) {
                            iDisponible += parseFloat(oFindStock.Labst);
                        }

                        value.Labst = (iDisponible).toFixed(3);
                    });
                    that.oModelGetPedidoVenta.setProperty("/oMaterialEditSelected", oSelectItems);
                    sap.ui.core.BusyIndicator.hide(0);
                }

            });
        },
        _onAcceptEditProduct: function (oEvent) {
            var oSource = oEvent.getSource();
            var tbMaterialesEdit = this._byId("frgIdEditProduct--tbMaterialesEdit");
            var oMaterialesSelected = [];

            var oSelectItems = that.oModelGetPedidoVenta.getProperty("/oMaterialEditSelected");

            oSelectItems.forEach(function (value, index) {
                var jObject = value;
                if (parseFloat(jObject.cantidad) > 0) {
                    oMaterialesSelected.push(jObject);
                }
            });

            if (oMaterialesSelected.length === 0) {
                that.getMessageBox("error", that.getI18nText("errorNotCant"));
                return;
            }

            var oMaterialPrev = this.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
            var oMaterial = [];
            var booleanProm = false;
            oMaterialPrev.forEach(function (value, index) {
                oMaterial.push(value);
                if (value.tipo === "PROFV" || value.tipo === "PROVEN" || value.tipo === "PROVM" || value.tipo === "PROVV" || value.tipo === "PROOP"
                    || value.tipo === "PROCLI" || value.tipo === "PROPV" || value.tipo === "PROCOM" || value.tipo === "PROCOMH") {
                    booleanProm = true;
                }
            });

            var booleanRepeat = false;
            var oMaterialRepeat = []
            oMaterialesSelected.forEach(function (value, index) {
                var booleanRepeatLocal = false;
                oMaterial.forEach(function (value2, index2) {
                    if (value.Matnr === value2.Matnr && value2.tipo === "MAT") {
                        booleanRepeat = true;
                        booleanRepeatLocal = true;
                        value2.cantidad = value.cantidad;
                        value2.cantidadRecalculo = value.cantidad;
                        oMaterialRepeat.push(value2);
                    }
                });
                if (booleanRepeatLocal) {
                    // oMaterialRepeat.push( (parseFloat(value.Matnr)).toString() );
                }
            });

            oMaterialesSelected.forEach(function (value, index) {
                value.total = "0";
                value.descuentos = "0%";
                value.descuentosVolumen1 = "0%";
                value.descuentosVolumen2 = "0%";
                value.status = "None";
                value.codeMotivo = "";
                value.descMotivo = "";
                value.tipo = "MAT";
                value.MatnrPrinc = "";
                value.PosnrPrinc = "";
            });

            var oMaterialPrevProCom = [];

            if (booleanRepeat) {
                if (booleanProm) {
                    utilUI.messageBox(this.getI18nText("errorProductRepeat"), "I", function (value) {
                        if (value) {
                            that._onPressDeletePromotionsNotComb();
                            that._onPressDeleteBonificacion(oMaterialRepeat);

                            var oMaterialPrevRepeat = [];
                            that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial").forEach(function (value) {
                                // if(value.tipo === "PROCOM" || value.tipo === "PROCOMH"){
                                //     oMaterialPrevProCom.push(value);
                                // }else{
                                // }
                                oMaterialPrevRepeat.push(value)
                            });

                            that._onFunctionValidateMaterial(oMaterialesSelected, oMaterialPrevRepeat, oMaterialPrevProCom);
                            oSource.getParent().close();
                        }
                    });
                } else {
                    that._onPressDeleteBonificacion(oMaterialRepeat);

                    var oMaterialPrevRepeat = [];
                    that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial").forEach(function (value) {
                        oMaterialPrevRepeat.push(value)
                    });

                    that._onFunctionValidateMaterial(oMaterialesSelected, oMaterialPrevRepeat);
                    oSource.getParent().close();
                }
            } else {
                if (booleanProm) {
                    utilUI.messageBox(this.getI18nText("errorProductNoRepeat"), "I", function (value) {
                        if (value) {
                            that._onPressDeletePromotionsNotComb();

                            var oMaterialPrev2 = that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
                            var oMaterial2 = [];
                            oMaterialPrev2.forEach(function (value) {
                                oMaterial2.push(value);
                            });
                            that._onFunctionValidateMaterial(oMaterialesSelected, oMaterial2);

                            that._onClearDataAddManualProduct();
                            that._onClearComponentAddManualProduct();
                            oSource.getParent().close();
                        }
                    });
                } else {
                    this._onFunctionValidateMaterial(oMaterialesSelected, oMaterial);

                    this._onClearDataAddManualProduct();
                    this._onClearComponentAddManualProduct();
                    oSource.getParent().close();
                }

            }
        },
        _onPressDeletePromotionsNotComb: function (oEvent) {
            var oSelectItems = [];
            var oOtrosDescuentos = [];
            var oMaterialPrev = this.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
            var oMaterial = [];
            oMaterialPrev.forEach(function (value) {
                oMaterial.push(value);
            });

            that._byId("tbProductos").getItems().forEach(function (value, index) {
                var jObject = value.getBindingContext("oModelPedidoVenta").getObject();
                if (jObject.tipo === "PROFV" || jObject.tipo === "PROVEN" || jObject.tipo === "PROVM" || jObject.tipo === "PROVV" || jObject.tipo === "PROOP"
                    || jObject.tipo === "PROCLI" || jObject.tipo === "PROPV") {
                    oSelectItems.push(jObject);
                }
            });

            oSelectItems.forEach(function (value, index) {
                var booleanWarningMat = false;
                oMaterial.forEach(function (value2, index2) {
                    if (value2.tipo != "MAT") {
                        if (value2.MatnrPrinc === value.Matnr && value2.PosnrPrinc === value.Posnr) {
                            booleanWarningMat = true;
                            oSelectItems.push(value2);
                        }
                    }
                });
            });

            oSelectItems.forEach(function (value, index) {
                var indice = oMaterial.indexOf(value);
                if (indice != -1)
                    oMaterial.splice(indice, 1);
            });

            if (oMaterial.length > 0) {
                that.oModelPedidoVenta.setProperty("/DataGeneral/oMaterial", oMaterial);
            } else {
                that.oModelPedidoVenta.setProperty("/DataGeneral/oMaterial", []);
            }
        },

        //Respaldo
        _onPressExportRespaldo: function () {
            var oMaterialPrev = that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
            if (this.isEmpty(oMaterialPrev)) {
                this.getMessageBox("error", this.getI18nText("errorNoDataExport"));
                return;
            }
            var oMaterial = [];
            oMaterialPrev.forEach(function (value, index) {
                if (value.tipo === "MAT") {
                    oMaterial.push(value)
                }
            });
            var sCodeCliente = this.oModelPedidoVenta.getProperty("/DataGeneral/oSelectedCliente/codeCliente");
            var oMaterialTotalFilter = that.oModelGetPedidoVenta.getProperty("/oMaterialTotalFilter");
            var datosimportar = [];


            // oMaterialTotalFilter.forEach(function(items){// Cambios Claudia 03.03.2023
            // 	oMaterial.forEach(function(obj){
            // 		if(items.Matnr === obj.Matnr && items.Ean11 === obj.Ean11){//Cambio Claudia 03.03.2023
            // 			datosimportar.push(obj);
            // 		}
            // 	});
            // });

            that.fnExportarExcel(oMaterial, [], [], sCodeCliente)
        },
        _onImportPressRespaldo: function (oEvent) {
            var pUpload = $.Deferred();
            var file = oEvent.getParameter("files")[0];
            if (file.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && file.type != "application/vnd.ms-excel") {
                that.getMessageBox("error", that.getI18nText("msgErrorFormat"));
                return;
            }

            if (file && window.FileReader) {
                var reader = new FileReader();
                reader.onload = function (evt) {
                    function arrayBufferToBase64(buffer) {
                        var binary = '';
                        var bytes = new Uint8Array(buffer);
                        var len = bytes.byteLength;
                        for (var i = 0; i < len; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        return binary;
                    }

                    var result = {};
                    var data;
                    var arr;
                    var xlsx;
                    data = evt.target.result;
                    //var xlsx = XLSX.read(data, {type: 'binary'});
                    arr = arrayBufferToBase64(data); //String.fromCharCode.apply(null, new Uint8Array(data));
                    xlsx = XLSX.read(btoa(arr), {
                        type: 'base64'
                    });
                    result = xlsx.Strings;
                    result = {};
                    xlsx.SheetNames.forEach(function (sheetName) {
                        var rObjArr = XLSX.utils.sheet_to_row_object_array(xlsx.Sheets[sheetName]);
                        if (rObjArr.length > 0) {
                            result[sheetName] = rObjArr;
                        }
                    });
                    var contenido = result[xlsx.SheetNames[0]];

                    var sTitleDocument = xlsx.Props.Title;
                    var oSplitTitle = sTitleDocument.split("-");

                    var sCodeCliente = that.oModelPedidoVenta.getProperty("/DataGeneral/oSelectedCliente/codeCliente");
                    var sToken = that.getI18nText("Token");
                    var bValidateTitle = false;
                    var bValidateEdicion = false;

                    if (oSplitTitle.length === 1) {
                        if (oSplitTitle[0] === sToken) {
                            bValidateTitle = true;
                        }
                    } else if (oSplitTitle.length === 2) {
                        if (oSplitTitle[0] === sToken && oSplitTitle[1] === sCodeCliente) {
                            bValidateTitle = true;
                        }
                    }

                    var oMaterial = that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
                    oMaterial.forEach(function (value) {
                        if (value.tipo != "FLE") {
                            bValidateEdicion = true;
                        }
                    });

                    if (bValidateTitle) {
                        if (bValidateEdicion) {
                            that.getMessageBox("error", that.getI18nText("msgErrorNotMatNotProm"));
                            return;
                        } else {
                            pUpload.resolve(contenido);
                        }
                    } else {
                        that.getMessageBox("error", that.getI18nText("msgErrorNoPertClient"));
                        return;
                    }
                }.bind(this);
                reader.readAsArrayBuffer(file);
            }

            pUpload.then(function (oData) {
                var oDataCampos = {};
                oDataCampos.aItems = [];
                oData.forEach(function (value) {
                    value.cantidad = value.Cantidad;
                    value.Kbetr = value.Cantidad;
                    value.cantidadRecalculo = value.Cantidad;
                    value.descuentos = "0%",
                        value.descuentosVolumen1 = "0%",
                        value.descuentosVolumen2 = "0%",
                        value.Posnr = "";
                    value.tipo = "MAT"
                    // value.precioUnidXsl = value.Precio;
                    value.solXsl = value.Cantidad;
                });
                that.onValidarRespaldo(oData);
            }.bind(this));
        },
        onValidarRespaldo: function (oDataCargadaPrev) {
            var oMaterialTotalFilter = that.oModelGetPedidoVenta.getProperty("/oMaterialTotalFilter");
            var oMaterialEan = [];
            var oDetailStockSet = [];
            var arraymaterial = [];
            var count = [];
            $.each(that._groupBy(oDataCargadaPrev, 'Material'), function (x, y) {// Cambio Claudia 03.03.2023
                var material01 = {
                    "Cantidad": y[0].Cantidad,
                    "Ean11": y[0].Ean11,
                    "Kbetr": y[0].Kbetr,
                    "Material": y[0].Material,
                    "Precio": y[0].Precio,
                    "cantidad": y[0].cantidad,
                    "cantidadRecalculo": y[0].cantidadRecalculo,
                    "descuentos": y[0].descuentos,
                    "descuentosVolumen1": y[0].descuentosVolumen1,
                    "pos": y[0].pos,
                    "descuentosVolumen2": y[0].descuentosVolumen2,
                    //"precioUnidXsl":y[0].precioUnidXsl,
                    "solXsl": y[0].solXsl,
                    "tipo": y[0].tipo,
                    "materiales": []
                };



                y.forEach(function (value, index) {
                    count++;
                    value.pos = count.toString();
                });
                material01.materiales = y;

                arraymaterial.push(material01);
            });

            arraymaterial.forEach(function (value, index) {
                var oFindStock = oMaterialTotalFilter.find(item => item.Matnr === value.Material);
                value.Kbetr = "0";
                value.Matnr = "";
                value.Meins = "";
                value.Kunnr = "";
                value.Txtfa = "";
                value.Vtweg = "";
                value.Umrez = "";
                value.Ean11 = "";
                value.Kdgrp = "";
                if (!that.isEmpty(oFindStock)) {
                    value.Kbetr = oFindStock.Kbetr;// ver si el prcio
                    value.descripcion = oFindStock.Maktg;
                    value.Matnr = oFindStock.Matnr;
                    value.Meins = oFindStock.Meins;
                    value.Kunnr = oFindStock.Kunnr;
                    value.Txtfa = oFindStock.Txtfa;
                    value.Vtweg = oFindStock.Vtweg;
                    value.Umrez = oFindStock.Umrez;
                    value.Ean11 = oFindStock.Ean11;
                    value.Kdgrp = oFindStock.Kdgrp;
                    var jValue = {
                        "Type": "G",
                        "Matnr": oFindStock.Matnr,
                        "Meins": oFindStock.Meins,
                        "Werks": "1020",
                        "Lgort": "0201",
                        "Labst": "0"
                    }
                    oDetailStockSet.push(jValue)
                    oMaterialEan.push(value);
                }
            });

            sap.ui.core.BusyIndicator.show(0);
            Promise.all([that._getStockMateriales(oDetailStockSet)]).then((values) => {
                var oStock = values[0].DetailStockSet.results;
                oMaterialEan.forEach(async function (value, index) {
                    var oFindStock = oStock.find(item => item.Matnr === value.Matnr && item.Meins === value.Meins);
                    value.Labst = "0";
                    value.solSap = "0";
                    value.precioUnidSap = value.Kbetr;
                    value.subtotalSap = "0";
                    value.status = "None";
                    value.descripcionStatus = "OK";
                    value.statusPrecio = "None";
                    value.statusStock = "None";
                    value.statusNoProduct = "S";
                    value.statusMotivo = "E";
                    if (!that.isEmpty(oFindStock)) {
                        value.Labst = oFindStock.Labst;
                        value.solSap = oFindStock.Labst;
                        value.subtotalSap = (parseFloat(value.precioUnidSap) * parseFloat(value.solSap)).toString();
                    }

                    if (that.isEmpty(value.Matnr)) {
                        value.status = "Error";
                        value.statusNoProduct = "E";
                        value.descripcionStatus = that.getI18nText("sDescStatusNoProduct");
                    } else {
                        var arrMsg = [];

                        // if(parseFloat(value.precioUnidXsl) != parseFloat(value.precioUnidSap)){
                        //     value.status = "Error";
                        //     value.statusNoProduct = "E";
                        //     value.statusPrecio = "Error";
                        //     arrMsg.push(that.getI18nText("sDescStatusNoPrec"));
                        // }

                        if (parseFloat(value.solXsl) > parseFloat(value.solSap)) {
                            value.status = "Error";
                            value.statusNoProduct = "E";
                            value.statusStock = "Error";
                            arrMsg.push(that.getI18nText("sDescStatusNoStock"));
                        }

                        if (arrMsg.length > 0) {
                            value.descripcionStatus = arrMsg.join();
                        }

                        if (value.statusNoProduct === "E") {
                            value.statusMotivo = "E"
                        } else {
                            if (value.statusPrecio === "Error" || value.statusStock === "Error") {
                                value.statusMotivo = "S"
                            }
                        }

                    }
                });

                var oMaterialPrev = this.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
                var oMaterial = [];
                oMaterialPrev.forEach(function (value) {
                    oMaterial.push(value);
                });

                var oMaterialesSelectedEnv = [];
                oMaterialEan.forEach(function (value, index) {
                    if (value.statusNoProduct != "E") {
                        var jMaterial = {
                            "Codfa": "C06 S21",
                            "Kbetr": value.Kbetr,//value.Kbetr poner si en caso es 
                            "Labst": value.solSap,
                            "Maktg": value.descripcion,
                            "Matnr": value.Matnr,
                            "Meins": value.Meins,
                            "Kunnr": value.Kunnr,
                            "Txtfa": value.Txtfa,
                            "Umrez": value.Umrez,
                            "Vtweg": value.Vtweg,
                            "Posnr": "",

                            "codeMotivo": "",
                            "descMotivo": "",
                            "icon": "sap-icon://inbox",
                            "state": "Success",

                            "cantidad": value.solXsl,
                            "total": ((parseFloat(value.Kbetr) * that.igv) * parseFloat(value.solXsl)).toString(),//
                            "totalSinIGV": ((parseFloat(value.Kbetr)) * parseFloat(value.solXsl)).toString(),//
                            "descuentos": "0%",
                            "descuentosVolumen1": "0%",
                            "descuentosVolumen2": "0%",
                            "status": value.status,
                            "tipo": "MAT",
                            "MatnrPrinc": "",
                            "PosnrPrinc": "",
                            "Probon": "",
                            "Numpro": "",
                            "cantidadProm": "",
                            "cantidadRecalculo": value.solXsl
                        }
                        oMaterialesSelectedEnv.push(jMaterial);
                    }
                });

                that._onFunctionValidateMaterial(oMaterialesSelectedEnv, oMaterial);
                this["_dialogAddProduct"].close();
            }).catch(function (oError) {
                console.log(oError);
                that.getMessageBox("error", that.getI18nText("errorData"));
                sap.ui.core.BusyIndicator.hide(0);
            });
        }
    });
});
