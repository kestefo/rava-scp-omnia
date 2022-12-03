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
        },
        handleRouteMatched: function(){
            Promise.all([]).then(async values => {
				that.oModelPedidoVenta = this.getModel("oModelPedidoVenta");
                that.oModelGetPedidoVenta = this.getModel("oModelGetPedidoVenta");

                var oProductosSave = that.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
                if(oProductosSave.length > 0){
                    // that._byId("lTotalProductos").setText( this.getI18nText("sTotal")+this.currencyFormat("0"));
                    // that._byId("lCantidadProductos").setText( this.getI18nText("sCantidad")+this.currencyFormat("0"));
                    this.onConteoMaterial("S");
                }else{
                    // that._byId("lTotalProductos").setText( this.getI18nText("sTotal")+this.currencyFormat("0"));
                    // that._byId("lCantidadProductos").setText( this.getI18nText("sCantidad")+this.currencyFormat("0"));

                    that._byId("lTotalProductos").setText(this.currencyFormat("0"));
                    that._byId("lCantidadProductos").setText(this.currencyFormat("0"));
                }
			}).catch(function (oError) {
				sap.ui.core.BusyIndicator.hide(0);
			});
        },
        onAfterRendering: function(){
            var URL="";
            // if (mapType === "H") {
            if (true) {
                URL = "https://mt.google.com/vt/lyrs=m&x={X}&y={Y}&z={LOD}"; //google layer for hybrid
            } else {
                URL = "https://mt.google.com/vt/lyrs=s,m&x={X}&y={Y}&z={LOD}"; //google layer for satelite
            }
            var oGeoMap = this.getView().byId("vbi");
            var oMapConfig = {
                "MapProvider":[
                   {
                      "name":"GMAP",
                      "description":"Map Provider",
                      "tileX":"256",
                      "tileY":"256",
                      "maxLOD":"20",
                      "copyright":"Tiles Courtesy of Google Maps",
                      "Source":[
                         {
                            "id":"s1",
                            "url":URL
                         }
                      ]
                   }
                ],
                "MapLayerStacks":[
                   {
                      "name":"GOOGLE",
                      "MapLayer":{
                         "name":"layer2",
                         "refMapProvider":"GMAP",
                         "opacity":"6.0",
                         "colBkgnd":"RGB(255,255,255)"
                      }
                   }
                ]
             }
            oGeoMap.setMapConfiguration(oMapConfig);
            oGeoMap.setRefMapLayerStack("GOOGLE");
            oGeoMap.setInitialZoom(13);
            oGeoMap.setInitialPosition("-97.57;35.57;0");
        },
        _onPressNavButtonDetail: function(){
            this.oModelPedidoVenta.setProperty("/PedidosCreados", []);
            this._onClearDataDetailClient();
            this.oRouter.navTo("Main");
        },
        //Add Product
        _onPressAddProduct: function(){
            this.setFragment("_dialogAddProduct", this.frgIdAddProduct, "AddProduct", this);
        },
        _onPressAddManual: function(){
            this["_dialogAddProduct"].close();
            this.setFragment("_dialogAddManualProduct", this.frgIdAddManualProduct, "AddManualProduct", this);
            this._onClearComponentAddManualProduct();
            this._onClearDataAddManualProduct();
        },
        _onChangeFamilia: function(oEvent){
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

            this._byId("frgIdAddManualProduct--tbMaterialesManual").setVisible(false);
            this._byId("frgIdAddManualProduct--btnNextAddManualProduct").setVisible(true);
            this._byId("frgIdAddManualProduct--btnAcceptAddManualProduct").setVisible(false);
            // this._byId("frgIdAddManualProduct--tbMaterialesManual").removeSelections(true);
            this.oModelGetPedidoVenta.setProperty("/oMaterialFamiliaSelected", []);
        },
        _onSelectFamilia: function(oEvent){
            var oSource = this._byId("frgIdAddManualProduct--slFamilia");
            var oSelectedDireccion = that.oModelGetPedidoVenta.getProperty("/oSelectedDireccion");

            var kSelected=oSource.getSelectedKey();
			if (this.isEmpty(kSelected)) {
                this._onClearComponentAddManualProduct();
                this._onClearDataAddManualProduct();
                this.getMessageBox("error", this.getI18nText("sErrorSelect"));
			}else{
                sap.ui.core.BusyIndicator.show(0);
				var oSelectedItem = oSource.getSelectedItem();
                var oObjectSelectedItem = oSelectedItem.getBindingContext("oModelGetPedidoVenta").getObject();

                var oDetailStockSet = [];
                let oMaterial = [];
                oObjectSelectedItem.materiales.forEach(async function(value, index){
                    var jValue = {
                        "Type": "G",
                        "Matnr": value.Matnr,
                        "Meins": value.Meins,
                        "Werks": "1020",
                        "Lgort": "0201",
                        "Labst": "0"
                    }

                    const jValueMat = {
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
                    oMaterial.forEach(async function(value, index){
                        var oFindStock = oStock.find(item => item.Matnr  === value.Matnr && item.Meins  === value.Meins);
                        value.Labst = "0";
                        value.icon = "sap-icon://outbox";
                        value.state = "Information",
                        value.cantidad = "0";
                        if(!that.isEmpty(oFindStock)){
                            value.Labst = oFindStock.Labst;
                        }
                    });

                    that._byId("frgIdAddManualProduct--tbMaterialesManual").setVisible(true);
                    that._byId("frgIdAddManualProduct--btnNextAddManualProduct").setVisible(false);
                    that._byId("frgIdAddManualProduct--btnAcceptAddManualProduct").setVisible(true);
                    // that._byId("frgIdAddManualProduct--tbMaterialesManual").removeSelections(true);
                    that.oModelGetPedidoVenta.setProperty("/oMaterialFamiliaSelected", oMaterial);
                    sap.ui.core.BusyIndicator.hide(0);
                }).catch(function (oError) {
                    console.log(oError);
                    that.getMessageBox("error", that.getI18nText("errorData"));
                    sap.ui.core.BusyIndicator.hide(0);
                });
			}
        },
        _getStockMateriales: function(oDetailStockSet){
            try{
				return new Promise(function (resolve, reject) {
                    var urlget = jQuery.sap.getModulePath("tomapedido")+"/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/";
				    var urlpost = jQuery.sap.getModulePath("tomapedido")+"/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/OperationSet";
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
			}catch(oError){
				that.getMessageBox("error", that.getI18nText("sErrorTry"));
			}
        },
        _onLiveChangeCantidad:function(oEvent){
            var oSource = oEvent.getSource();
            var oParent = oSource.getParent();

            var values = oSource.getValue();
            var regex = /[^\d]/g;
			var x = values.replace(/[^\d]/g, '');
			if(values.match(regex)){
				var x = values;
			}else{
				var x = values.substring(0, values.length - 1);
			}
			var x = parseInt(values);
			var sValueUsed = isNaN(x) ? '0' : x;

            var oModelContext = oParent.getBindingContext("oModelGetPedidoVenta");
            var oObject = oModelContext.getObject();
            if(parseInt(oObject.Labst) >= parseInt(sValueUsed)){
                oObject.state = "Success";
                oObject.icon = "sap-icon://inbox";
                oSource.setValue(sValueUsed);
            }else{
                oObject.state = "Information";
                oObject.icon = "sap-icon://outbox";
                that.getMessageBox("error", that.getI18nText("errorSupPermitido"));
                oSource.setValue("0");
            }


        },
        _onAcceptProductManual: function(oEvent){
            var oSource = oEvent.getSource();
            var tbMaterialesManual = this._byId("frgIdAddManualProduct--tbMaterialesManual");
            var oMaterialesSelected = [];

            var oSelectItems = tbMaterialesManual.getItems();
            if(oSelectItems.length == 0){
                that.getMessageBox("error", that.getI18nText("errorSelectProduct"));
                return;
            }

            oSelectItems.forEach(function(value, index){
                var jObject = value.getBindingContext("oModelGetPedidoVenta").getObject();
                if(parseFloat(jObject.cantidad) > 0){
                    oMaterialesSelected.push(jObject);
                }
            });

            var oMaterial = this.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");

            oMaterialesSelected.forEach(function(value, index){
                value.total = (parseFloat(value.cantidad) * (parseFloat(value.Kbetr)*that.igv)).toString();
                value.descuentos = "0%";
                value.descuentosVolumen = "0%";
                value.status = "None";
                value.codeMotivo = "";
                value.descMotivo = "";
                oMaterial.push(value);
            });
            
            this.oModelPedidoVenta.setProperty("/DataGeneral/oMaterial",oMaterial);

            this._onClearDataAddManualProduct();
            this._onClearComponentAddManualProduct();
            oSource.getParent().close();

            this.onConteoMaterial();
            this.onUpdateMaterial(oMaterialesSelected);
        },
        //Add Product Manual

        //Add Product EAN
        _onPressAddEan: function(){
            this["_dialogAddProduct"].close();
            this.setFragment("_dialogAddEan", this.frgIdAddEan, "AddEan", this);

            this._onClearComponentDialogEan();
            this._onClearDataDialogEan()
        },
        _onPressSearchEan: function(){
            var sValueCode = this._byId("frgIdAddEan--inCodeEan").getValue();
            if(this.isEmpty(sValueCode)){
                this.getMessageBox("error", that.getI18nText("errorNotProduct"));
                return;
            }
            var oMaterialTotalFilter = that.oModelGetPedidoVenta.getProperty("/oMaterialTotalFilter");
            var sValueCodeFormat = this.zfill(sValueCode, 18);
            var oMaterialEan = [];
            var oDetailStockSet = [];
            oMaterialTotalFilter.forEach(function(value, index){
                if(value.Ean11 === sValueCode){
                    var jValue = {
                        "Type": "G",
                        "Matnr": value.Matnr,
                        "Meins": value.Meins,
                        "Werks": "1020",
                        "Lgort": "0201",
                        "Labst": "0"
                    }
                    oMaterialEan.push(value);
                    oDetailStockSet.push(jValue)

                }
            });

            if(oMaterialEan.length === 0){
                this.getMessageBox("error", that.getI18nText("errorNotProductSearch"));
                return;
            }

            Promise.all([that._getStockMateriales(oDetailStockSet)]).then((values) => {
                var oStock = values[0].DetailStockSet.results;
                oMaterialEan.forEach(async function(value, index){
                    var oFindStock = oStock.find(item => item.Matnr  === value.Matnr && item.Meins  === value.Meins);
                    value.Labst = "0";
                    value.icon = "sap-icon://outbox";
                    value.state = "Information",
                    value.cantidad = "0";
                    if(!that.isEmpty(oFindStock)){
                        value.Labst = oFindStock.Labst;
                    }
                });
                this.oModelGetPedidoVenta.setProperty("/oMaterialEanSelected",oMaterialEan);
            }).catch(function (oError) {
                console.log(oError);
                that.getMessageBox("error", that.getI18nText("errorData"));
                sap.ui.core.BusyIndicator.hide(0);
            });
        },
        _onAcceptProductEan: function(oEvent){
            var oSource = oEvent.getSource();
            var tbMaterialesManual = this._byId("frgIdAddEan--tbMaterialesEan");
            var oMaterialesSelected = [];

            var oSelectItems = tbMaterialesManual.getItems();
            if(oSelectItems.length == 0){
                that.getMessageBox("error", that.getI18nText("errorSelectProduct"));
                return;
            }

            oSelectItems.forEach(function(value, index){
                var jObject = value.getBindingContext("oModelGetPedidoVenta").getObject();
                if(parseFloat(jObject.cantidad) > 0){
                    oMaterialesSelected.push(jObject);
                }
            });

            if(oMaterialesSelected.length === 0){
                that.getMessageBox("error", that.getI18nText("errorNotCant"));
                return;
            }

            var oMaterial = this.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");

            oMaterialesSelected.forEach(function(value, index){
                delete value["__metadata"];
                value.total = (parseFloat(value.cantidad) * (parseFloat(value.Kbetr)*that.igv)).toString();
                value.descuentos = "0%";
                value.descuentosVolumen = "0%";
                value.status = "None";
                value.codeMotivo = "";
                value.descMotivo = "";
                oMaterial.push(value);
            });
            
            this.oModelPedidoVenta.setProperty("/DataGeneral/oMaterial",oMaterial);

            oSource.getParent().close();

            this.onConteoMaterial();
        },
        //Add Product EAN

        //Add Product Masive
        _onPressLoadMasive: function(){
            this["_dialogAddProduct"].close();
            var oModelHtml = {
                HTML : 
                "<p>"+ this.getI18nText("textSegundoCarga") +
                "<a style=\"color:blue; font-weight:600;\">"+ this.getI18nText("textTerceroCarga") +
                "</a> "+ this.getI18nText("textCuartoCarga") +"</p>"
            }
            this.oModelPedidoVenta.setProperty("/textHtml", oModelHtml);
            this._onClearDataDialogDialog();
            this.setFragment("_dialogLoadMasive", this.frgIdLoadMasive, "LoadMasive", this);
        },
        _onImportPress: function (oEvent) {
            console.log(oEvent);
            var pUpload = $.Deferred();
            var file = oEvent.getParameter("files")[0];
            if(file.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && file.type !="application/vnd.ms-excel"){
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
                value.forEach(function (item) {
                    var indiceTotus = titulo.indexOf("TOTTUS");
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
                    if(indiceTotus != -1){
                        item.eanXsl = item.EAN;
                        item.codigo = item[that.getI18nText("sCodeTottus")];
                        item.descripcion = item[that.getI18nText("sDescTottus")];
                        item.precioUnidXsl = item[that.getI18nText("sPrecioUnidTottus")];
                        item.solXsl = item[that.getI18nText("sSolTottus")];
                        if(that.isEmpty(item.precioUnidXsl)){
                            item.precioUnidXsl = "0"
                        }
                        if(that.isEmpty(item.solXsl)){
                            item.solXsl = "0"
                        }
                        // item.subtotalXsl = item[that.getI18nText("sSubTotalTottus")];
                        item.subtotalXsl =( (parseFloat(item.precioUnidXsl)*that.igv) * parseFloat(item.precioUnidXsl) ).toString();
                    }else if(indiceInka != -1){
                        item.eanXsl = item.EAN;
                        item.codigo = item[that.getI18nText("sCodeInka")];
                        item.descripcion = item[that.getI18nText("sDescInka")];
                        item.precioUnidXsl = item[that.getI18nText("sPrecioUnidInka")];
                        item.solXsl = item[that.getI18nText("sSolInka")];
                        if(that.isEmpty(item.precioUnidXsl)){
                            item.precioUnidXsl = "0"
                        }
                        if(that.isEmpty(item.solXsl)){
                            item.solXsl = "0"
                        }
                        // item.subtotalXsl = item[that.getI18nText("sSubTotalInka")];
                        item.subtotalXsl =( (parseFloat(item.precioUnidXsl)*that.igv) * parseFloat(item.precioUnidXsl) ).toString();
                    }else if(indiceSuper != -1){
                        item.eanXsl = item.EAN;
                        item.codigo = item[that.getI18nText("sCodeSuper")];
                        item.descripcion = item[that.getI18nText("sDescSuper")];
                        item.precioUnidXsl = item[that.getI18nText("sPrecioUnidSuper")];
                        item.solXsl = item[that.getI18nText("sSolSuper")];
                        if(that.isEmpty(item.precioUnidXsl)){
                            item.precioUnidXsl = "0"
                        }
                        if(that.isEmpty(item.solXsl)){
                            item.solXsl = "0"
                        }
                        // item.subtotalXsl = item[that.getI18nText("sSubTotalSuper")];
                        item.subtotalXsl =( (parseFloat(item.precioUnidXsl)*that.igv) * parseFloat(item.precioUnidXsl) ).toString();
                    }else{
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
        _onNextMasive: function(oEvent){
            var oSource = oEvent.getSource();
            var oMaterialSelectMasive = this.getModel("oModelPedidoVenta").getProperty("/DataGeneral/oMaterialSelectMasive");
            var titulo = oMaterialSelectMasive.titulo;
            var oDataCargadaPrev = oMaterialSelectMasive.oDataCargadaPrev;

            if(oDataCargadaPrev.length === 0){
                this.getMessageBox("error", this.getI18nText("errorNotProductMasive"));
                return;
            }

            var oMaterialTotalFilter = that.oModelGetPedidoVenta.getProperty("/oMaterialTotalFilter");
            var oMaterialEan = [];
            var oDetailStockSet = [];
            oDataCargadaPrev.forEach(function(value, index){
                var oFindStock = oMaterialTotalFilter.find(item => item.Ean11  === value.eanXsl);
                value.Kbetr = "0";
                value.Matnr = "";
                value.Meins = "";
                if(!that.isEmpty(oFindStock)){
                    value.Kbetr = oFindStock.Kbetr;
                    value.descripcion = oFindStock.Maktg;
                    value.Matnr = oFindStock.Matnr;
                    value.Meins = oFindStock.Meins;
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
                oMaterialEan.forEach(async function(value, index){
                    cont++;
                    value.num = cont;
                    var oFindStock = oStock.find(item => item.Matnr  === value.Matnr && item.Meins  === value.Meins);
                    value.Labst = "0";
                    value.solSap = "0";
                    value.precioUnidSap = value.Kbetr;
                    value.subtotalSap = "0";
                    if(!that.isEmpty(oFindStock)){
                        value.Labst = oFindStock.Labst;
                        value.solSap = oFindStock.Labst;
                        value.subtotalSap = (parseFloat(value.precioUnidSap)*parseFloat(value.solSap)).toString();
                    }
                });

                oMaterialEan.forEach(async function(value, index){
                    value.status = "None";
                    value.descripcionStatus = "OK";
                    value.statusPrecio = "None";
                    value.statusStock = "None";
                    value.statusNoProduct = "S";
                    value.statusMotivo = "E";

                    if(that.isEmpty(value.Matnr)){
                        value.status = "Error";
                        value.statusNoProduct = "E";
                        value.descripcionStatus = that.getI18nText("sDescStatusNoProduct");
                    }else{
                        var arrMsg = [];

                        if(parseFloat(value.precioUnidXsl) > parseFloat(value.precioUnidSap)){
                            value.status = "Error";
                            value.statusNoProduct = "S";
                            value.statusPrecio = "Error";
                            arrMsg.push(that.getI18nText("sDescStatusNoPrec"));
                        }

                        if(parseFloat(value.solXsl) > parseFloat(value.solSap)){
                            value.status = "Error";
                            value.statusNoProduct = "S";
                            value.statusStock = "Error";
                            arrMsg.push(that.getI18nText("sDescStatusNoStock"));
                        }

                        if(arrMsg.length>0){
                            value.descripcionStatus = arrMsg.join();
                        }

                        if(value.statusNoProduct === "E"){
                            value.statusMotivo = "E"
                        }else{
                            if(value.statusPrecio === "Error" || value.statusStock === "Error"){
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
        _onAcceptProductMasive: function(oEvent){
            var oSource = oEvent.getSource();
            var tbMaterialesMasive = this._byId("frgIdLoadMasiveDetail--tbMaterialesMasive");
            var oMaterialesSelected = [];

            var oSelectItems = tbMaterialesMasive.getItems();
            if(oSelectItems.length == 0){
                that.getMessageBox("error", that.getI18nText("errorSelectProduct"));
                return;
            }

            oSelectItems.forEach(function(value, index){
                var jObject = value.getBindingContext("oModelPedidoVenta").getObject();
                if(parseFloat(jObject.solXsl) > 0 && jObject.statusNoProduct == "S"){
                    oMaterialesSelected.push(jObject);
                }
            });

            if(oMaterialesSelected.length === 0){
                that.getMessageBox("error", that.getI18nText("errorNotCant"));
                return;
            }

            var booleanMotivo = false;
            oMaterialesSelected.forEach(function(value, index){
                if(that.isEmpty(value.codeMotivo) && value.statusMotivo === "S"){
                    booleanMotivo = true;
                }
            });
            if(booleanMotivo){
                that.getMessageBox("error", that.getI18nText("sSelectMotivo"));
                return;
            }

            var oMaterial = this.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
            var oMotivo = this.oModelGetPedidoVenta.getProperty("/oMotivo");

            var booleanError = false;
            oMaterialesSelected.forEach(function(value, index){
                var oFindMotivo = oMotivo.find(item => item.key  === value.codeMotivo);
                var descMotivo = "";
                if(!that.isEmpty(oFindMotivo)){
                    descMotivo = oFindMotivo.desc;
                }
                if(value.status == "Error"){
                    booleanError = true;
                }

                var jMaterial = {
                    "Codfa":"C06 S21",
                    "Kbetr":value.precioUnidXsl,
                    "Labst":value.solSap,
                    "Maktg":value.descripcion,
                    "Matnr":value.Matnr,
                    "Meins":value.Meins,
                    "Txtfa":value.Txtfa,
                    "Umrez":value.Umrez,
                    "Vtweg":value.Vtweg,
                    
                    "codeMotivo": value.codeMotivo,
                    "descMotivo": descMotivo,
                    "icon":"sap-icon://inbox",
                    "state":"Success",

                    "cantidad":value.solXsl,
                    "total": ((parseFloat(value.precioUnidXsl)*that.igv) * parseFloat(value.solXsl)).toString(),
                    "descuentos":"0%",
                    "descuentosVolumen":"0%",
                    "status":value.status
                 }
                oMaterial.push(jMaterial);
            });
            
            this.oModelPedidoVenta.setProperty("/DataGeneral/oMaterial",oMaterial);

            this._onClearDataDialogDialog();
            
            oSource.getParent().close();
            this.onConteoMaterial();
        },
        //Add Product Masive

        //FunctionDetail
        onConteoMaterial: function(sParameter){
            var tbProductos = this._byId("tbProductos");
            var oItems = tbProductos.getItems();
            var oProductosValidos = [];
            var booleanError = false;
            oItems.forEach(function(value, index){
                var jObject = value.getBindingContext('oModelPedidoVenta').getObject();
                if(jObject.status === "None"){
                    oProductosValidos.push(jObject);
                }

                if(jObject.status === "Error"){
                    booleanError = true;
                }
            });

            var columns = this._byId("tbProductos").getColumns();
            if(booleanError){
                columns[columns.length-1].setVisible(true);
            }else{
                columns[columns.length-1].setVisible(false);
            }

            var total = 0;
            var cantidad = 0;

            oProductosValidos.forEach(function(value, index){
                cantidad += parseFloat(value.cantidad);
                total += parseFloat(value.total);
            });
            
            // that._byId("lTotalProductos").setText( this.getI18nText("sTotal")+this.currencyFormat(total.toString()));
            // that._byId("lCantidadProductos").setText( this.getI18nText("sCantidad")+this.currencyFormat(cantidad.toString()));

            that._byId("lTotalProductos").setText( this.currencyFormat(total.toString()));
            that._byId("lCantidadProductos").setText( this.currencyFormat(cantidad.toString()));

            if(this.isEmpty(sParameter)){
                var oSelectedLineaCredito = that.oModelPedidoVenta.getProperty("/DataGeneral/oSelectedLineaCredito");
                oSelectedLineaCredito.sConsumo = (parseFloat(oSelectedLineaCredito.Amount) + parseFloat(total)).toString();
                oSelectedLineaCredito.sSaldo = (parseFloat(oSelectedLineaCredito.CreditLimit) - parseFloat(oSelectedLineaCredito.sConsumo)).toString();
    
                that.oModelPedidoVenta.setProperty("/DataGeneral/oSelectedLineaCredito", oSelectedLineaCredito);    
            }
        },
        onUpdateMaterial: function(oMaterialesSelected){
            
        },
        _onPressDeletePro: function(oEvent){
            var oSource = oEvent.getSource();
            var tbProductos = this._byId("tbProductos");
            var oMaterialesSelected = [];

            var oMaterial = this.oModelPedidoVenta.getProperty("/DataGeneral/oMaterial");
            var oSelectItems = [];
            if(tbProductos.getSelectedItems().length == 0){
                that.getMessageBox("error", that.getI18nText("errorSelectProduct"));
                return;
            }

            tbProductos.getSelectedItems().forEach(function(value, index){
                var jObject = value.getBindingContext("oModelPedidoVenta").getObject();
                oSelectItems.push(jObject);
            });

            oSelectItems.forEach(function(value, index){
                var indice = oMaterial.indexOf(value);
				if(indice != -1)
				oMaterial.splice( indice, 1 );
            });

            this.oModelPedidoVenta.setProperty("/DataGeneral/oMaterial",oMaterial);
            this._byId("tbProductos").removeSelections(true);

            this.onConteoMaterial();
        },
        _onPressAddEdit: function(oEvent){
            var oSource = oEvent.getSource();
            this._byId("btnAgregarDetail").setVisible(true);
            this._byId("btnDeleteDetail").setVisible(true);
            this._byId("btnSaveDetail").setVisible(true);
            
            oSource.setVisible(false);
            // this._byId("btnCerrarDetail").setVisible(false);
            this._byId("tbProductos").setMode("MultiSelect");
        },
        _onPressSave: function(){
            var tbProductos = this._byId("tbProductos");
            var oSelectItems = tbProductos.getItems();
            if(oSelectItems.length == 0){
                that.getMessageBox("error", that.getI18nText("errorNotProductSave"));
                return;
            }

            var oMaterial = [];
            var oMaterialSap = [];
            
            var sStatus = that.oModelPedidoVenta.getProperty("/DataGeneral/sStatus");
            var cont = 0;
            oSelectItems.forEach(function(value, index){
                cont = cont + 10;
                var jObject = value.getBindingContext("oModelPedidoVenta").getObject();
                var sCodeMotivo = "";
                if(!that.isEmpty(jObject.codeMotivo)){
                    sCodeMotivo = jObject.codeMotivo;
                }
                var jDataSap = {
                    "Type": sStatus,
                    "Posnr": that.zfill(cont,6),
                    "Matnr": jObject.Matnr,
                    "Werks": "1020",
                    "Lgort": "0201",//por revisar
                    "Fkimg": jObject.cantidad,
                    "Meins": jObject.Meins,
                    "Abgru": sCodeMotivo
                };
				oMaterial.push(jObject);
                oMaterialSap.push(jDataSap);
            });

            utilUI.messageBox(this.getI18nText("sTextConfirm"),"C", function(value){
                if(value){
                    var sStatus = that.oModelPedidoVenta.getProperty("/DataGeneral/sStatus");
                    var sNumPedido = that.oModelPedidoVenta.getProperty("/DataGeneral/sNumPedido");
                    var oDataSap={};
                    if(sStatus === "C"){
                        var oSelectedCliente = that.oModelPedidoVenta.getProperty("/DataGeneral/oSelectedCliente");
                        var oSelectedLineaCredito = that.oModelPedidoVenta.getProperty("/DataGeneral/oSelectedLineaCredito");
                        var date = that.reformatDateString(that.getYYYYMMDD(new Date()));
                        var dateFormat = date;
    
                        var sComprobante = parseFloat(oSelectedCliente.codeComprobante) == 0 ? "BB":"FA";
                        var sPardm = oSelectedCliente.textPardm;
                        var sKundm = oSelectedCliente.textKundm;
                        var sKundm = oSelectedCliente.textKundm;
                        var sCondPago = oSelectedCliente.codeCondPago === 'C001' ? oSelectedCliente.codeCondPago: '';
    
                        oDataSap={
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
                            "TipCo": sComprobante,
                            "Zterm": sCondPago,
                            "Vbeln": "",
                            "DetailSOSet": oMaterialSap,
                            "ResultSOSet": [
                                {
                                    "Type": "C",
                                    "Posnr": "",
                                    "Msage": ""
                                }
                            ]
                        };
                    }else if(sStatus === "M"){
                        oDataSap={
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
                            "DetailSOSet": oMaterialSap,
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
                    sap.ui.core.BusyIndicator.show(0);
                    Promise.all([that._postProductos(oDataSap)]).then((values) => {

                        var oResp = values[0].ResultSOSet.results;
                        var booleanError = false;
                        var sSms = ""
                        oResp.forEach(function(value,index){
                            if(value.Type == "E"){
                                booleanError = true;
                                sSms += value.Msage + "\n";
                            }
                        });

                        if(booleanError){
                            that.getMessageBox("error", sSms);
                        }else{
                            utilUI.messageBox(oResp[oResp.length-1].Msage,"S", function(value){
                                that._onClearComponentTableProduct();
                                that._onPressNavButtonDetail();
                            });
                        }
                        sap.ui.core.BusyIndicator.hide(0);
                    }).catch(function (oError) {
                        that.getMessageBox("error", that.getI18nText("errorSave"));
                        sap.ui.core.BusyIndicator.hide(0);
                    });
                }
            });
            
            
        },
        _postProductos: function(oDataSap){
            try{
				return new Promise(function (resolve, reject) {
                    var urlget = jQuery.sap.getModulePath("tomapedido")+"/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/";
				    var urlpost = jQuery.sap.getModulePath("tomapedido")+"/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/HeaderSOSet";

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
			}catch(oError){
				that.getMessageBox("error", that.getI18nText("sErrorTry"));
			}
        },
        _onLiveChangeBuscar: function(oEvent){
            var oSource = oEvent.getSource();
            var sValue = oSource.getValue();

            var oTable = this.byId("tbProductos");

            var aFilter = [];
            if (!this.isEmpty(sValue))
                aFilter.push(new Filter("Maktg", 'Contains', sValue));

            oTable.getBinding("items").filter(aFilter);
            
        },
        _onChangeCounter: function(oEvent){
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
                page: function(oEvent) {
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
        
        _onPressPromotion: function(){
            var navCon = this.byId("navcIdGroupPromotions");
            navCon.to(this.byId("IdPromotionsCenter"));
            // this.setFragment("_dialogAddPromotions", this.frgIdAddPromotions, "AddPromotions", this);
        },
        onNavBackPromotion: function(){
            var navCon = this.byId("navcIdGroupPromotions");
            navCon.back();
        },
        onPressToggleButton: function(oEvent){
            var oSource = oEvent.getSource();
            var sCustom = oSource.data("custom");
            // this._byId("frgIdAddPromotions--idBonificacion");
            this._byId("idBonificacion").setPressed(false);
            this._byId("idFuerzaVenta").setPressed(false);
            this._byId("idBonVendedor").setPressed(false);
            this._byId("idBonSubMarca").setPressed(false);
            this._byId("idVolSubMarca").setPressed(false);
            this._byId("idVolVenta").setPressed(false);
            this._byId("idCombo").setPressed(false);
            this._byId("idProdEspec").setPressed(false);
            this._byId("idObsProducto").setPressed(false);
            
            oSource.setPressed(true);
            
            var dataFilter=[];
            switch (sCustom) {
				case "keyBonificacion":                    
					break;
                case "keyFuerzaVenta":
                    break;
                case "keyBonVendedor":
                    break;
                case "keyBonSubMarca":
                    break;
                case "keyVolSubMarca":
                    dataFilter = models.JsonPromocion();
                    break;
                case "keyVolVenta":
                    break;
                case "keyCombo":
                    break;
                case "keyProdEspec":
                    break;
                case "keyObsProducto":
                    break;
				default:
					oSource.getParent().close();
			}

            this.oModelPedidoVenta.setProperty("/Promociones", dataFilter);
        },
        _onNavDetallePromocion: function(){
            this.setFragment("_dialogAddPromotions", this.frgIdAddPromotions, "AddPromotions", this);
            var dataFilter=models.JsonPromocionDetail();
            this.oModelPedidoVenta.setProperty("/PromocionesDetail", dataFilter);
        }
    });
});
