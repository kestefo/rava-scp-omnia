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
            
            this.frgIdAddProducto = "frgIdAddProducto";
            this.frgIdLoadMasive = "frgIdLoadMasive";
            this.frgIdAddEan = "frgIdAddEan";
            this.frgIdAddPromotions = "frgIdAddPromotions";
            console.log("init");
        },
        handleRouteMatched: function(){
            Promise.all([]).then(async values => {
				this.oModelPedidoVenta = this.getModel("oModelPedidoVenta");
                this.oModelGetPedidoVenta = this.getModel("oModelGetPedidoVenta");
                this.oModelPedidoVenta.setProperty("/AddSelectFamilia", models.JsonFamilia());
                var oData = models.JsonProductos();
                var iCounter = this._byId("siContador").getValue();
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
			}).catch(function (oError) {
				sap.ui.core.BusyIndicator.hide(0);
			});
        },
        _onPressNavButtonDetail: function(){
            this.oRouter.navTo("Main");
        },
        _onPressAddProductPro: function(){
            this.oModelPedidoVenta.setProperty("/visibleTable", false);
            this.setFragment("_dialogAddProducto", this.frgIdAddProducto, "AddProducto", this);
        },
        _onChangeFamilia:function(oEvent){
            var oSource = oEvent.getSource();
            var oSelectedDireccion = that.oModelGetPedidoVenta.getProperty("/oSelectedDireccion");

            var kSelected=oSource.getSelectedKey();
			var sSelected=oEvent.getSource().getValue();
			if (kSelected !== '') {
				oEvent.getSource().setValue(sSelected);
			}else{
				if(oEvent.getSource().getValue()){
					this.getMessageBox("error", this.getI18nText("sErrorSelect"));
				}
                return;
			}

            var oSelectedItem = oSource.getSelectedItem();
            var oObjectSelectedItem = oSelectedItem.getBindingContext("oModelPedidoVenta").getObject();

            this.oModelPedidoVenta.setProperty("/visibleTable", true);
            this.oModelPedidoVenta.setProperty("/ProductoFamilia", models.JsonProductoFamilia());
        },
        _onLiveChangeCantidad:function(oEvent){
            var oSource = oEvent.getSource();
            var oParent = oSource.getParent();
            var oModelContext = oSource.getParent().getBindingContext("oModelPedidoVenta");
            var oObject = oModelContext.getObject();
            oObject.state = "Success";
            oObject.icon = "sap-icon://inbox";
            this.getModel("oModelPedidoVenta").refresh();
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
