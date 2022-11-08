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
            var keyMarca  =oModelDevolucion.getProperty("/keyMarca");
            var keyNombProduct = oModelDevolucion.getProperty("/keyNombProduct");
            var datosLote     =oModelDevolucion.getProperty("/datosLote");
            var contValidacion= 0;

            if(keyMarca === undefined || keyMarca === ""){
                contValidacion++;
            }
            if(keyNombProduct === undefined || keyNombProduct === ""){
                contValidacion++;
            }
            if(datosLote === undefined || datosLote === ""){
                contValidacion++; 
            }

            if(contValidacion > 0){
                MessageBox.warning(this.getI18nText("txtMensBuscarProduct"));
                return;
            }

            var url = "/sap/opu/odata/sap/ZOSDD_CUSTOM_VENDOR_CDS/";
            jQuery.ajax({
                type: "GET",
                cache: false,
                headers: {
                    "Accept": "application/json"
                },
                contentType: "application/json",
                url: url,
                async: true,
                success: function (data, textStatus, jqXHR) {
                    var datos = data.d;
                    oModelDevolucion.setProperty("/AddProducto", models.JsonFactura());

                },
                error: function () {
                    MessageBox.error("Ocurrio un error al obtener los datos");
                }
            });

        },
        _onChangeMarca:function(oEvent){
            var kSelected=oEvent.getSource().getSelectedKey();
			var sSelected=oEvent.getSource().getValue();
			if (kSelected !== '') {
				oEvent.getSource().setValue(sSelected);
			}else{
				if(oEvent.getSource().getValue()){
					MessageBox.error( this.getI18nText("sErrorSelect"));
				}
				oEvent.getSource().setValue("");
			}
        },
        _onChangeProductoBol:function(oEvent){
            var kSelected=oEvent.getSource().getSelectedKey();
			var sSelected=oEvent.getSource().getValue();
			if (kSelected !== '') {
				oEvent.getSource().setValue(sSelected);
			}else{
				if(oEvent.getSource().getValue()){
					MessageBox.error(this.getI18nText("sErrorSelect"));
				}
				oEvent.getSource().setValue("");
			}  
        },
        changeMotivoProduct:function(oEvent){
            var kSelected=oEvent.getSource().getSelectedKey();
			var sSelected=oEvent.getSource().getValue();
			if (kSelected !== '') {
				oEvent.getSource().setValue(sSelected);
			}else{
				if(oEvent.getSource().getValue()){
					MessageBox.error(this.getI18nText("sErrorSelect"));
				}
				oEvent.getSource().setValue("");
			}   
        },
       
        _onPressCloseProduct:function(){
            this.AbrirProducto.close();
        },
        onDetalleDocFact:function(){
            var oView           = this.getView();
            var that            = this;
            var contCantidad    =0;
            var contTotal       =0;
            var contMonto       =0;
            var oModelDevolucion = oView.getModel("oModelDevolucion");

            oModelDevolucion.setProperty("/AddProductoDetail", models.JsonFacturaDetail());

            models.JsonFacturaDetail().forEach(function(items){

                contCantidad += parseFloat(items.cantorig);
                contTotal   += parseFloat(items.total);
                contMonto   += parseFloat(items.montonc);

            });

            oModelDevolucion.setProperty("/totalCantidadDetProd", contCantidad.toString());
            oModelDevolucion.setProperty("/totalProduct",contTotal.toFixed(2));
            oModelDevolucion.setProperty("/totalMontoDetProduct", contMonto.toFixed(2));

            if (!that.AbrirProducto) {
                that.AbrirProducto = sap.ui.xmlfragment("devoluciones.view.dialogs.DetalleProduct", that);
                oView.addDependent(that.AbrirProducto);
            }
            that.AbrirProducto.open();

        },
        _onPressCloseDetalleProducto: function (oEvent) {
            var oSource         = oEvent.getSource();
            var sCustom         = oSource.data("custom");
            var that            = this;
            var vista           = this.getView();
            var oModelDevolucion = vista.getModel("oModelDevolucion");
            var tablaCliente    = sap.ui.getCore().byId("frgIdAddClient--IdTablaClients01");
            var tablaCliente02  = sap.ui.getCore().byId("IdTablaProducts");
            var KeyMotivoProd   = oModelDevolucion.getProperty("/KeyMotivoProd");

            if(KeyMotivoProd !== "" && KeyMotivoProd !== undefined){
                oModelDevolucion.setProperty("/KeyAddUser", "");
        
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
            }else{
                MessageBox.warning(this.getI18nText("txtMensajeDevolucion"));
                return;
            }
           
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