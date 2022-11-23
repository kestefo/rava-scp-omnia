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
            var oView = this.getView();
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getTarget("ConsultaFactura").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
            var global = oView.getModel("Global");

        },

        onAfterRendering: function () {
            var oView = this.getView();
            var contadorGlobal = oView.getModel("contadorGlobal").getProperty("/contador");
            // if (contadorGlobal === 1) {
            //     oView.getModel("contadorGlobal").setProperty("/contador", 2);

            // }else if (contadorGlobal === 0){
            //     this.getOwnerComponent().getRouter().navTo("Main");
            // 	return;
            // }

        },
        handleRouteMatched: function () {


        },

        onDetalleDocFact: function () {
            var oView = this.getView();
            var that = this;
            var oModelDevolucion = oView.getModel("oModelDevolucion");
            var contadorCant = 0;
            var contadorMonto = 0;
            var contadorTotal = 0;

            oModelDevolucion.setProperty("/addClientVisible", true);
            oModelDevolucion.setProperty("/AddFacturaBoletaDetail", models.JsonFacturaDetail());

            models.JsonFacturaDetail().forEach(function (element) {

                contadorCant += parseFloat(element.cantorig);
                contadorMonto += parseFloat(element.montonc);
                contadorTotal += parseFloat(element.total);

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
        _onPressCloseDetalleDoc: function () {
            var that            = this;
            var vista           = this.getView();
            var oModelDevolucion = vista.getModel("oModelDevolucion");
            oModelDevolucion.setProperty("/KeyMotivo", "");
            that.AddFactBol.close();

        },
        onChangeMotivoFact: function (oEvent) {
            var that = this;
            var kSelected = oEvent.getSource().getSelectedKey();
            var sSelected = oEvent.getSource().getValue();
            if (kSelected !== '') {
                oEvent.getSource().setValue(sSelected);
            } else {
                if (oEvent.getSource().getValue()) {
                    MessageBox.error(that.getI18nText("sErrorSelect"));
                }
                oEvent.getSource().setValue("");
            }

        },
        _onPressCloseDetalle: function (oEvent) {
            var oSource         = oEvent.getSource();
            var sCustom         = oSource.data("custom");
            var that            = this;
            var vista           = this.getView();
            var oModelDevolucion = vista.getModel("oModelDevolucion");
            var tablaCliente    = sap.ui.getCore().byId("frgIdAddClient--IdTablaClients01");
            var tablaCliente02  = sap.ui.getCore().byId("IdTablaClients01");
            var KeyMotivo           = oModelDevolucion.getProperty("/KeyMotivo");
            var facturaBolDetalle = oModelDevolucion.getProperty("/AddFacturaBoletaDetail");
            var arraydetallePed      = [];
            var datos                ="";
            var KeyClientAdd          =oModelDevolucion.getProperty("/KeyClientAdd");
            if (KeyMotivo === undefined || KeyMotivo === "") {
                MessageBox.warning(that.getI18nText("txtMensajeDevolucion"));
                return;
            }

            facturaBolDetalle.forEach(function (obj) {

                var detalleproducto = {
                    "Material": "",
                    "Cantidad": "",
                    "UnidadMed": ""

                }
                arraydetallePed.push(detalleproducto);
            });

             datos = {
                "CodCli": KeyClientAdd,
                "Tipo": "",
                "Canal": "",
                "Referencia": "",
                "NumDocMod": "",
                "CodVen": "",
                "MotivoPed": "",
                "DetallePedidosDevSet": arraydetallePed,
                "ResultPedidosDevSet": [
                    {
                        "Pedido": "",
                        "Type": "",
                        "Msg": ""
                    }
                ]
            }

            $.ajax({
                url: "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/",
                type: "GET",
                headers: {
                    "x-CSRF-Token": "Fetch"
                }
            }).always(function (data, status, response) {
                var token = response.getResponseHeader("x-csrf-token");
                $.ajax({
                    url: "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/PedidosDevSet",
                    method: "POST",
                    headers: {
                         "x-CSRF-Token": token
                        
                    },
                    contentType: "application/json",
                    dataType: "json",
                    async: true,
                    
                    data: JSON.stringify(datos),
                }).always(async function (data, status, response) {

                    var datos = data.d.ResultPedidosDevSet.results[0];
                    oModelDevolucion.setProperty("/KeyAddUser", "");
                    tablaCliente02.removeSelections(true);

                    MessageBox.success(that.getI18nText("txtbtnBuscarCancelar") + datos.Pedido, {
                        actions: [that.getI18nText("acceptText")],
                        emphasizedAction: "",
                        onClose: function (sAction) {
                            if (sAction === that.getI18nText("acceptText")) {

                            }
                            oModelDevolucion.setProperty("/AddFacturaBoletaDetail", []);
                            oModelDevolucion.setProperty("/KeyMotivo", "");
                            that.AddFactBol.close();

                        }
                    });

                });
            });


          
                    // jQuery.ajax({
                    //     type: "POST",
                    //     cache: false,
                    //     headers: {
                    //         "Accept": "application/json"
                    //     },
                    //     contentType: "application/json",
                    //     url: "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/PedidosDevSet",
                    //     async: true,
                    //     data: JSON.stringify(datos),
                    //     success: function (data, textStatus, jqXHR) {
                    //         var datos = data.d;
                    //         that.oModelDevolucion.setProperty("/AddFacturaBoleta", models.JsonFactura());
                    //         that.getOwnerComponent().getRouter().navTo("ConsultaFactura");
                    //         that.oModelDevolucion.setProperty("/KeyAddUser", "");

                    //     },
                    //     error: function () {
                    //         MessageBox.error("Ocurrio un error al obtener los datos");
                    //     }
                    // });

        },
        getI18nText: function (sText) {
            return this.oView.getModel("i18n") === undefined ? false : this.oView.getModel("i18n").getResourceBundle().getText(sText);
        },
        _onPressCloseConsulta: function () {
            this.getOwnerComponent().getRouter().navTo("Main");

        },
    });
}, /* bExport= */ true);