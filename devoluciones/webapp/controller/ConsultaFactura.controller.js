sap.ui.define([
    "devoluciones/controller/BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/routing/History",
    'sap/m/MessageToast',
    "sap/ui/core/Fragment",
    "devoluciones/model/models",
    "sap/ui/core/Core",
    "sap/ui/core/mvc/Controller",
], function ( BaseController,Controller, MessageBox, History, MessageToast, Fragment, models, Core) {
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

        onDetalleDocFact: function (oEvent) {
            var oSource = oEvent.getSource();
            var oSelected = oSource.getBindingContext("oModelDevolucion").getObject();
            var oDetailSelected = oSelected.DetalleBuscaReceiptSet.results;
        
            var oView = this.getView();
            var that = this;
            var oModelDevolucion = oView.getModel("oModelDevolucion");
            var contadorCant = 0;
            var contadorMonto = 0;
            var contadorTotal = 0;

            oModelDevolucion.setProperty("/addClientVisible", true);
            // oModelDevolucion.setProperty("/AddFacturaBoletaDetail", models.JsonFacturaDetail());
            
            oDetailSelected.forEach(function (element) {
                element.sumTotalPos = (parseFloat(element.Impuesto) + parseFloat(element.ImpNeto)).toString();
                element.cantsoldev = "0";
                element.totalunitario = (parseFloat(element.sumTotalPos)/ parseFloat(element.Cantidad)).toFixed(3);
                var formatoMaterial = parseFloat(element.Material).toString();
                element.codigoMaterial = formatoMaterial.substring(0,2) +"-" + formatoMaterial.substring(2,10);
                contadorCant += parseFloat(element.Cantidad);
                contadorTotal += parseFloat(element.sumTotalPos);


                element.montonc = (parseFloat(element.cantsoldev) * parseFloat(element.totalunitario)).toString();
            });

            oDetailSelected.forEach(function (element) {
                contadorMonto += parseFloat(element.montonc); 

            });

            oModelDevolucion.setProperty("/totalCantidadDet", contadorCant.toFixed(2));
            oModelDevolucion.setProperty("/totalCantSolic", contadorTotal.toFixed(2));
            oModelDevolucion.setProperty("/totalMontoDet", contadorMonto.toFixed(2));

            oModelDevolucion.setProperty("/FacturaBoletaDetal", oSelected);
            oModelDevolucion.setProperty("/textDataDocumento", oSelected.CodFact);//Cambio Claudia Romero

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
            sap.ui.core.BusyIndicator.show();
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

            //nuevos cambios
            
            var FacturaBoletaDetal = oModelDevolucion.getProperty("/FacturaBoletaDetal");
            var oPosDetailNotPermited = FacturaBoletaDetal.DetalleBuscaReceiptSet.results;
            var oPosDetailPermited = [];
            oPosDetailNotPermited.forEach(function(value, index){
                if(parseFloat(value.cantsoldev) > 0){
                    oPosDetailPermited.push(value);
                }
            })
            if(oPosDetailPermited.length === 0){
                MessageBox.warning(that.getI18nText("txtMensajeCantDev"));
                sap.ui.core.BusyIndicator.hide(0);
                return;
            }
            
            var oClientSelect = oModelDevolucion.getProperty("/oClientSelect");
            var codVen = oModelDevolucion.getProperty("/codVen");

            oPosDetailPermited.forEach(function (obj) {

                var detalleproducto = {
                    "Material": obj.Material,
                    "Cantidad": obj.cantsoldev,
                    "UnidadMed": obj.UnidMedida,
                    "Posicion": obj.Posicion
                }
                arraydetallePed.push(detalleproducto);
            });


             datos = {
                "CodCli": oClientSelect.Kunnr,
                "Tipo": "ZPDC",
                "Canal": oClientSelect.Vtweg,
                "Referencia": FacturaBoletaDetal.mostFactura,
                "NumDocMod": FacturaBoletaDetal.CodFact,
                "CodVen": codVen,
                "MotivoPed": KeyMotivo,
                "DetallePedidosDevSet": arraydetallePed,
                "ResultPedidosDevSet": [
                    {
                        "Pedido": "",
                        "Type": "",
                        "Msg": ""
                    }
                ]
            }

            //return

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

                    MessageBox.success(that.getI18nText("txtbtnBuscarCancelar") +" "+ datos.Pedido +" .", {
                        actions: [that.getI18nText("acceptText")],
                        emphasizedAction: "",
                        onClose: function (sAction) {
                            if (sAction === that.getI18nText("acceptText")) {
                                that.getOwnerComponent().getRouter().navTo("Main");
                            }
                            oModelDevolucion.setProperty("/AddFacturaBoletaDetail", []);
                            oModelDevolucion.setProperty("/KeyMotivo", "");
                            sap.ui.core.BusyIndicator.hide(0);
                            that.getOwnerComponent().getRouter().navTo("Main");
                           // that.AddFactBol.close();

                        }
                    });

                });
            });

        },
        getI18nText: function (sText) {
            return this.oView.getModel("i18n") === undefined ? false : this.oView.getModel("i18n").getResourceBundle().getText(sText);
        },
        _onPressCloseConsulta: function () {
            this.getOwnerComponent().getRouter().navTo("Main");

        },
        //Metodos nuevos Kassiel Estefo 26/11/2022
        _onLiveChangeCantidad:function(oEvent){
            var oSource = oEvent.getSource();
            var oParent = oSource.getParent();
            var vista           = this.getView();
            var oModelDevolucion = vista.getModel("oModelDevolucion");
            var values = oSource.getValue();
            var contaMontoNC = 0;
            var regex = /[^\d]/g;
			var x = values.replace(/[^\d]/g, '');
            var datosDetalle = oModelDevolucion.getProperty("/FacturaBoletaDetal/DetalleBuscaReceiptSet/results");
			if(values.match(regex)){
				var x = values;
			}else{
				var x = values.substring(0, values.length - 1);
			}
			var x = parseInt(values);
			var sValueUsed = isNaN(x) ? '0' : x;

            var oModelContext = oParent.getBindingContext("oModelDevolucion");
            var oObject = oModelContext.getObject();
            var cantSumDev = parseFloat(oObject.CantDevuelta) + parseFloat(sValueUsed);

            if(parseFloat(oObject.Cantidad) >= parseFloat(cantSumDev)){
             
                oObject.montonc = (parseFloat(oObject.totalunitario)*parseFloat(sValueUsed)).toString();
                oSource.setValue(sValueUsed);
            }else{
                this.getMessageBox("error", this.getI18nText("errorSupPermitido"));
                oObject.montonc = "0";
                oSource.setValue("0");
            }

            datosDetalle.forEach(function(obs){
                contaMontoNC+=parseFloat(obs.montonc);
            });
            //revision hacer claudia
             oModelDevolucion.setProperty("/totalMontoDet",contaMontoNC.toFixed(2));

        },
    });
}, /* bExport= */ true);