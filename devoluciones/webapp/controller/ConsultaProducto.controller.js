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
    return BaseController.extend("devoluciones.controller.ConsultaProducto", {

        onInit: function () {
            var oView	=this.getView();
			// this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// this.oRouter.getTarget("ConsultaProducto").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			 var global = oView.getModel("Global");
		},

        handleRouteMatched: function () {
           // this.getDataGlobal();
          
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
        _SearchPedido:function(){
            var oView = this.getView();
            var oModelDevolucion = oView.getModel("oModelDevolucion");

            oModelDevolucion.setProperty("/AddProducto", models.JsonFactura());
            
        },
        onDetalleDocFact:function(){
            var oView = this.getView();
            var that = this;
            var oModelDevolucion = oView.getModel("oModelDevolucion");

          
            oModelDevolucion.setProperty("/AddProductoDetail", models.JsonFacturaDetail());
            if (!that.AbrirProducto) {
                that.AbrirProducto = sap.ui.xmlfragment("devoluciones.view.dialogs.DetalleProduct", that);
                oView.addDependent(that.AbrirProducto);
            }
            that.AbrirProducto.open();

        },
        _onPressCloseDetalleProducto: function (oEvent) {
            var oSource = oEvent.getSource();
            var sCustom = oSource.data("custom");
            var that = this;
            var vista = this.getView();
            var oModelDevolucion = vista.getModel("oModelDevolucion");
            var tablaCliente = sap.ui.getCore().byId("frgIdAddClient--IdTablaClients01");
            var tablaCliente02 = sap.ui.getCore().byId("IdTablaProducts");
            // _byId("frgIdAddClient--IdClienteDetail");


            // oModelDevolucion.setProperty("/AddFacturaBoleta", []);
            oModelDevolucion.setProperty("/KeyAddUser", "");
        //   oModelDevolucion.setProperty("/AddFacturaBoletaDetail", []);
            // oModelDevolucion.setProperty("/KeyMotivo", "");
            // vista.byId("idTablaPrincipal").removeSelections(true);

            tablaCliente02.removeSelections(true);

            
            MessageBox.success(this.getI18nText("txtbtnBuscarCancelar"), {
                actions: [this.getI18nText("acceptText")],
                 emphasizedAction: "",
                onClose: function (sAction) {
                    if (sAction === that.getI18nText("acceptText")) {
                        
                    }
                    oModelDevolucion.setProperty("/AddProductoDetail", []);
                    oModelDevolucion.setProperty("/KeyMotivo", "");
                    that.AbrirProducto.close();
                }
            });
            


        },
        getI18nText: function (sText) {
			return this.oView.getModel("i18n") === undefined ? false : this.oView.getModel("i18n").getResourceBundle().getText(sText);
		},
        _onPressCloseConsultaProducto:function(){
            var vista = this.getView();
            var oModelDevolucion = vista.getModel("oModelDevolucion");
            oModelDevolucion.setProperty("/keyMarca", "");
            oModelDevolucion.setProperty("/keyNombProduct", "");
            oModelDevolucion.setProperty("/datosLote", "");
            oModelDevolucion.setProperty("/AddProducto", []);
        // vista.byId("idTablaPrincipal").removeSelections(true);

            this.getOwnerComponent().getRouter().navTo("Main");

        },

        
    });
}, /* bExport= */ true);