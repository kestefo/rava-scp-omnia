sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "devoluciones/controller/BaseController",
    "devoluciones/model/models",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, BaseController, models, Fragment) {
        "use strict";

        var that, bValueHelpEquipment = false;
        return BaseController.extend("devoluciones.controller.Main", {
            onInit: function () {
                that = this;
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter.getTarget("Main").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

                this.frgIdAddClient = "frgIdAddClient";
                this.frgIdAddProduct = "frgIdAddProduct";
                this.frgaddConsultaFact = "frgAddconsultaFac";//CRomero
                this.fragaddDetalleFact = "frgAddDetalleFact";//CRomero

                

            },

            onAfterRendering() {
                var oView = this.getView();
                var that = this;
                var ModelProyect = oView.getModel("oModelDevolucion");
                var contadorGlobal = oView.getModel("contadorGlobal").getProperty("/contador");
                if (contadorGlobal === 0) {
                    oView.getModel("contadorGlobal").setProperty("/contador", 1);

                    this.filtroCliente();
                    this.consultaProduct();
                    this.consultaDatosMarca();
                    this.userlog();

                }

            },

            userlog: function () {

                $.ajax({
                    type: "GET",
                    url: "/sap-approuter-userapi/attributes",
                    dataType: "json",
                    contentType: "application/json",
                    async: false,
                    headers: {
                        "Accept": "application/json"
                    },
                    success: function (response) {

                        var nombre = response.name;
                    }
                });


            },
            handleRouteMatched: function () {
                Promise.all([]).then(async values => {
                    this.oModelDevolucion = this.getModel("oModelDevolucion");
                    this.oModelDevolucion.setProperty("/AddSelectUser", models.JsonUser());
                    this.oModelDevolucion.setProperty("/DevolucionesCreados", models.JsonDevolucionesCreados());
                    this.oModelDevolucion.setProperty("/AddMotivo", models.JsonMotivo());
                });
            },

            filtroCliente: function () {
                var oView = this.getView();
                var oModelDevolucion = oView.getModel("oModelDevolucion");
                oModelDevolucion.setProperty("/FiltroCliente", models.jsonFiltroClient());

            },

            _onPressAddFacturaBoleta: function () {
                this.oModelDevolucion.setProperty("/AddFacturaBoleta", []);
                this.oModelDevolucion.setProperty("/addClientVisible", false);
                //this.oModelDevolucion.setProperty("/KeyAddUser" ,"");
                this.setFragment("_dialogAAddClient", this.frgIdAddClient, "AddClient", this);
                // this.setFragment("_dialogAAddClient", this.frgaddConsultaFact, "AddClient", this);//nuevo 11.10.2022
            },
            _onChangeUser: function () {
                //this.oModelDevolucion.setProperty("/AddFacturaBoleta", models.JsonFactura());
            },

            BusquedaFactBol: function () {

                this.oModelDevolucion.setProperty("/AddFacturaBoleta", models.JsonFactura());
                // this.setFragment("_dialogConsultaFact", this.frgaddConsultaFact, "ConsultaFactura", this);//CRomero
                this.getOwnerComponent().getRouter().navTo("ConsultaFactura");

            },
            onDetalleDevolucion: function (oEvent) {
                var that = this;
                var oView = this.getView();
                var productPath = oEvent.getSource().getBindingContext("oModelDevolucion").getPath();
                var selected = oView.getModel("oModelDevolucion").getProperty(productPath);
                var contadorMonto = 0;
                var contadorCant = 0;

                if (selected.estado !== "Pedido") {
                    this.oModelDevolucion.setProperty("/editableNroCredt", false);
                    this.oModelDevolucion.setProperty("/editableDescripMot", false);

                } else {
                    this.oModelDevolucion.setProperty("/editableNroCredt", true);
                    this.oModelDevolucion.setProperty("/editableDescripMot", true);
                }

                this.oModelDevolucion.setProperty("/AddDetalleDev", models.jsonDetalleDevolucion());
                this.oModelDevolucion.setProperty("/NroCredito", selected.NroCredito);
                this.oModelDevolucion.setProperty("/DescripMotivo", selected.Motivos);

                models.jsonDetalleDevolucion().forEach(function (element) {
                    contadorCant += parseFloat(element.Cantidad);
                    contadorMonto += parseFloat(element.Monto);

                });

                this.oModelDevolucion.setProperty("/totalCantidad",contadorCant.toString());
                this.oModelDevolucion.setProperty("/totalMonto", contadorMonto.toFixed(2));


                this.getOwnerComponent().getRouter().navTo("DetalleDevolucion");
            },
            BusquedaProducto: function () {
                //  this.oModelDevolucion.setProperty("/AddFacturaBoleta", models.JsonFactura());
                // this.setFragment("_dialogConsultaFact", this.frgaddConsultaFact, "ConsultaFactura", this);//CRomero
                this.getOwnerComponent().getRouter().navTo("ConsultaProducto");
            },

            consultaDatosMarca: function () {
                var oView = this.getView();
                var oModelDevolucion = oView.getModel("oModelDevolucion");
                oModelDevolucion.setProperty("/AddSelectMarca", models.JsonMarcaProduct());
                oModelDevolucion.setProperty("/AddSelectProducto", models.JsonMarcaProduct());//CRomero
            },
            consultaProduct: function () {
                var oView = this.getView();
                var oModelDevolucion = oView.getModel("oModelDevolucion");
                oModelDevolucion.setProperty("/AddNombreProduct", models.JsonUser());//CRomero
            },
            // _onNavDetalleFacturaBoleta: function(){
            //     var navCon = this._byId("frgIdAddClient--navcIdGroupFacturaBoleta");
            //     var sFragment = this._byId("frgIdAddClient--IdClienteDetail");
            //     this.oModelDevolucion.setProperty("/addClientVisible", true);
            //     this.oModelDevolucion.setProperty("/AddFacturaBoletaDetail", models.JsonFacturaDetail());
            //     navCon.to(sFragment);
            // },
            _onNavBack: function () {
                var navCon = this._byId("frgIdAddClient--navcIdGroupFacturaBoleta");
                this.oModelDevolucion.setProperty("/addClientVisible", false);
                navCon.back();
            },

            _onPressAddProducto: function () {
                this.oModelDevolucion.setProperty("/keyProducto", "");
                this.oModelDevolucion.setProperty("/addClientVisible", false);
                this.setFragment("_dialogAAddProduct", this.frgIdAddProduct, "AddProduct", this);

            },
            _onPressSearch: function () {
                this.oModelDevolucion.setProperty("/AddFacturaBoleta", models.JsonFactura());

            },
            _onNavDetalleProducto: function () {
                var navCon = this._byId("frgIdAddProduct--navcIdGroupProducto");
                var sFragment = this._byId("frgIdAddProduct--IdProductoDetail");
                this.oModelDevolucion.setProperty("/addClientVisible", true);
                this.oModelDevolucion.setProperty("/AddProductoDetail", models.JsonFacturaDetail());
                navCon.to(sFragment);
            },
        });
    });
