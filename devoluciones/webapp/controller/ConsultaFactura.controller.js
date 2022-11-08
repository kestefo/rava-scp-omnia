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
    return BaseController.extend("devoluciones.controller.ConsultaFactura", {

        onInit: function () {
            var oView	=this.getView();
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("ConsultaFactura").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
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
           
        },
        handleRouteMatched: function () {
           
          
        },

        onDetalleDocFact: function () {
            var oView = this.getView();
            var that = this;
            var oModelDevolucion = oView.getModel("oModelDevolucion");
            var contadorCant= 0;
            var contadorMonto=0;
            var contadorTotal=0;

            oModelDevolucion.setProperty("/addClientVisible", true);
            oModelDevolucion.setProperty("/AddFacturaBoletaDetail", models.JsonFacturaDetail());
            
            models.JsonFacturaDetail().forEach(function(element){
                       
                contadorCant += parseFloat(element.cantorig);
                contadorMonto +=parseFloat(element.montonc);
                contadorTotal +=parseFloat(element.total);

            });

            oModelDevolucion.setProperty("/totalCantidadDet", contadorCant.toString());
            oModelDevolucion.setProperty("/totalCantSolic", contadorTotal.toFixed(2));
            oModelDevolucion.setProperty("/totalMontoDet", contadorMonto.toFixed(2));
            
            if (!that.AddFactBol) {
                that.AddFactBol = sap.ui.xmlfragment("devoluciones.view.dialogs.DetalleDoc", that);
                oView.addDependent(that.AddFactBol);
            }
            that.AddFactBol.open();

            // this.setFragment("_dialogDetalleFact", this.fragaddDetalleFact, "DetalleDoc", this);//CRomero
        },
        _onPressCloseDetalleDoc:function(){
            
            this.AddFactBol.close();
        },
        _onPressCloseDetalle: function (oEvent) {//corregir
            var oSource = oEvent.getSource();
            var sCustom = oSource.data("custom");
            var that = this;
            var vista = this.getView();
            var oModelDevolucion = vista.getModel("oModelDevolucion");
            var tablaCliente = sap.ui.getCore().byId("frgIdAddClient--IdTablaClients01");
            var tablaCliente02 = sap.ui.getCore().byId("IdTablaClients01");
            var KeyMotivo  = oModelDevolucion.getProperty("/KeyMotivo");
            
            if(KeyMotivo === undefined || KeyMotivo === "" ){
             MessageBox.warning(this.getI18nText("txtMensajeDevolucion"));
             return;   
            }

            oModelDevolucion.setProperty("/KeyAddUser", "");
            tablaCliente02.removeSelections(true);

            MessageBox.success(this.getI18nText("txtbtnBuscarCancelar"), {
                actions: [this.getI18nText("acceptText")],
                emphasizedAction: "",
                onClose: function (sAction) {
                    if (sAction === that.getI18nText("acceptText")) {
                        
                    }
                    oModelDevolucion.setProperty("/AddFacturaBoletaDetail", []);
                    oModelDevolucion.setProperty("/KeyMotivo", "");
                    that.AddFactBol.close();
                    
                }
            });
            
        },
        getI18nText: function (sText) {
			return this.oView.getModel("i18n") === undefined ? false : this.oView.getModel("i18n").getResourceBundle().getText(sText);
		},
        _onPressCloseConsulta:function(){
            this.getOwnerComponent().getRouter().navTo("Main");

        },
    });
}, /* bExport= */ true);