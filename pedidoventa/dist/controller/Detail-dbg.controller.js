sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/rava/pedido/pedidoventa/controller/BaseController",
    "com/rava/pedido/pedidoventa/model/models",
], function (Controller, BaseController, models) {
    "use strict";

    var that, bValueHelpEquipment = false;
    return BaseController.extend("com.rava.pedido.pedidoventa.controller.Detail", {
        onInit: function () {
            that = this;
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getTarget("Detail").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
            
            this.frgIdAddProducto = "frgIdAddProducto";
            this.frgIdLoadMasive = "frgIdLoadMasive";
            this.frgIdAddEan = "frgIdAddEan";
            console.log("init");
        },
        handleRouteMatched: function(){
            Promise.all([]).then(async values => {
				this.oModelPedidoVenta = this.getModel("oModelPedidoVenta");
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
        _onChangeFamilia:function(){
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
    });
});
