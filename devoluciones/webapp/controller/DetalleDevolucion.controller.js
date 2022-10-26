sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/routing/History",
    'sap/m/MessageToast',
    "sap/ui/core/Fragment",
    "devoluciones/model/models",
    "sap/ui/core/Core",
    "sap/ui/core/mvc/Controller",
    "devoluciones/controller/BaseController",
    


], function (Controller, MessageBox, History, MessageToast, Fragment, models, Core, BaseController) {
    "use strict";
    var Device = "";
    return BaseController.extend("devoluciones.controller.DetalleDevolucion", {

        onInit: function () {
            var oView	=this.getView();
			// this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// this.oRouter.getTarget("ConsultaProducto").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			 var global = oView.getModel("Global");
		},

        onAfterRendering: function () {
            var oView			=this.getView();
			var contadorGlobal	= oView.getModel("contadorGlobal").getProperty("/contador");
            if (contadorGlobal === 1) {
            oView.getModel("contadorGlobal").setProperty("/contador", 2);

            }else if (contadorGlobal === 0){
                this.getOwnerComponent().getRouter().navTo("Main");
				return;
            }
            // this.getOwnerComponent().getRouter().navTo("Main");
        },

        pressVolverDetalle:function(){
            this.getOwnerComponent().getRouter().navTo("Main");

        }

        
    });
}, /* bExport= */ true);