sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "tomapedido/controller/BaseController",
    "tomapedido/model/models"
], function (Controller, BaseController, models) {
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
            this.frgIdAddEan = "frgIdAddEan";
            this.frgIdAddPromotions = "frgIdAddPromotions";
        },
        handleRouteMatched: function(){
            Promise.all([]).then(async values => {
				this.oModelPedidoVenta = this.getModel("oModelPedidoVenta");
                this.oModelGetPedidoVenta = this.getModel("oModelGetPedidoVenta");
                // var oData = models.JsonProductos();
                // var iCounter = this._byId("siContador").getValue();
                // this.oModelPedidoVenta.setProperty("/ProductoCreados", oData.slice(0, iCounter));

                // var oLength = oData.length;
                // var oActual = oLength / iCounter;
                // var oCalculation = (oActual % 1 == 0);
                // var oValue = 0;
                // if (oCalculation == true) {
                //     oValue = oActual;
                // } else {
                //     oValue = parseInt(oActual) + 1;
                // }
                // var oPaginator = new sap.ui.commons.Paginator({
                //     visible: true,
                //     numberOfPages: oValue,
                //     page: function(oEvent) {
                //         var oTargetPage = oEvent.getParameter("targetPage");
                //         var oTargetValue = oTargetPage * iCounter;
                //         var oSourceValue = oTargetValue - iCounter;
                //         var oTotalData = models.JsonProductos();
                //         var oSelectedData = oTotalData.slice(oSourceValue, oTargetValue);
                //         that.oModelPedidoVenta.setProperty("/ProductoCreados", oSelectedData);
                //     }
                // });
                // var VBox = new sap.m.VBox({
                //     alignItems: "Center",
                //     items: [oPaginator]
                // });

                // this._byId("vbTableDetalle").addItem(VBox);
			}).catch(function (oError) {
				sap.ui.core.BusyIndicator.hide(0);
			});
        },
        _onPressNavButtonDetail: function(){
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
        //Add Product
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
            this._byId("frgIdAddManualProduct--tbMaterialesManual").removeSelections(true);
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

                oObjectSelectedItem.materiales.forEach(async function(value, index){
                    var sStock = await that._getStockMateriales(value);
                    value.Labst = sStock;
                    value.icon = "sap-icon://outbox";
                    value.state = "Information",
                    value.cantidad = "0"; 
                });

                Promise.all([]).then((values) => {
                    that._byId("frgIdAddManualProduct--tbMaterialesManual").setVisible(true);
                    that._byId("frgIdAddManualProduct--btnNextAddManualProduct").setVisible(false);
                    that._byId("frgIdAddManualProduct--btnAcceptAddManualProduct").setVisible(true);
                    that._byId("frgIdAddManualProduct--tbMaterialesManual").removeSelections(true);
                    that.oModelGetPedidoVenta.setProperty("/oMaterialFamiliaSelected", oObjectSelectedItem.materiales);
                    sap.ui.core.BusyIndicator.hide(0);
                }).catch(function (oError) {
                    console.log(oError);
                    that.getMessageBox("error", that.getI18nText("errorData"));
                    sap.ui.core.BusyIndicator.hide(0);
                });
			}
        },
        _getStockMateriales: function(oData){
            var sPath = "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/StockSet?$filter=(Matnr eq '"+oData.Matnr+"' and Meins eq '"+oData.Meins+"' and Werks eq '1020' and Lgort eq '0201')";
            var data = "0";
            $.ajax({
                url: sPath,
                method: "GET",
                async: false,
                contentType: 'application/json',
                dataType: 'json',
                success: function (oData) {
                    data = oData.d.results[0].Labst;
                },
                error: function (xhr, status, error) {
                    console.log("error")
                }
            });
            return data;
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

            this.getModel("oModelGetPedidoVenta").refresh();

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
        _onPressLoadMasive: function(){
            var oModelHtml = {
                HTML : 
                "<p>"+ this.getI18nText("textSegundoCarga") +
                "<a href=\"//www.sap.com\" style=\"color:blue; font-weight:600;\">"+ this.getI18nText("textTerceroCarga") +
                "</a> "+ this.getI18nText("textCuartoCarga") +"</p>"
            }
            this.oModelPedidoVenta.setProperty("/textHtml", oModelHtml);
            this.setFragment("_dialogLoadMasive", this.frgIdLoadMasive, "LoadMasive", this);
        },
        _onPressAddEan: function(){
            this.setFragment("_dialogAddEan", this.frgIdAddEan, "AddEan", this);
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
