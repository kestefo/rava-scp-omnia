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
            
            
            console.log("init")
        },
        handleRouteMatched: function(){
            Promise.all([this.validateUser()]).then(async values => {
				this.oModelPedidoVenta = this.getModel("oModelPedidoVenta");
                this.oModelPedidoVenta.setProperty("/AddSelectUser", models.JsonUser());
                var oUser = this.validateUser();
                this.oModelPedidoVenta.setProperty("/User", oUser);
                this.setFragment("_dialogAddPedido", this.frgIdAddPedido, "AddPedido", this);
			}).catch(function (oError) {
				sap.ui.core.BusyIndicator.hide(0);
			});
        },
        _onPressClose: function (oEvent) {
			var oSource = oEvent.getSource();
			var sCustom = oSource.data("custom");
            oSource.getParent().close();
		}
    });
});
