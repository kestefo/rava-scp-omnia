sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/rava/pedido/pedidoventa/controller/BaseController",
    "com/rava/pedido/pedidoventa/model/models",
], function (Controller, BaseController, models) {
    "use strict";

    var that, bValueHelpEquipment = false;
    return BaseController.extend("com.rava.pedido.pedidoventa.controller.Main", {
        onInit: function () {
            that = this;
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getTarget("Main").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

            this.frgIdAddPedido = "frgIdAddPedido";
            this.frgIdDetailPedido = "frgIdDetailPedido";
            this.frgIdEditContact = "frgIdEditContact";
            
            console.log("init")
        },
        handleRouteMatched: function(){
            Promise.all([]).then(async values => {
				this.oModelPedidoVenta = this.getModel("oModelPedidoVenta");
                this.oModelPedidoVenta.setProperty("/AddSelectUser", models.JsonUser());
                this.oModelPedidoVenta.setProperty("/User", models.JsonUserLoged());
                this.oModelPedidoVenta.setProperty("/PedidosCreados", models.JsonPedidos());
                this.oModelPedidoVenta.setProperty("/DetailSelectFuerzaVenta", models.JsonFuerzaVenta());
                this.oModelPedidoVenta.setProperty("/DetailSelectPuntoVenta", models.JsonPuntoVenta());
                this.oModelPedidoVenta.setProperty("/DetailSelectDireccion", models.JsonDirecciones());
                this.oModelPedidoVenta.setProperty("/DetailSelectCondPago", models.JsonCondPago());
                this.oModelPedidoVenta.setProperty("/DescSelect", models.JsonDescuento());
			}).catch(function (oError) {
				sap.ui.core.BusyIndicator.hide(0);
			});
        },
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
