sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "devoluciones/controller/BaseController",
    "devoluciones/model/models",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, BaseController, models) {
        "use strict";

        var that, bValueHelpEquipment = false;
        return BaseController.extend("devoluciones.controller.Main", {
            onInit: function () {
                that = this;
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter.getTarget("Main").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
                
                this.frgIdAddClient = "frgIdAddClient";
                this.frgIdAddProduct = "frgIdAddProduct";
            },
            handleRouteMatched: function(){
                Promise.all([]).then(async values => {
                    this.oModelDevolucion = this.getModel("oModelDevolucion");
                    this.oModelDevolucion.setProperty("/AddSelectUser", models.JsonUser());
                    this.oModelDevolucion.setProperty("/DevolucionesCreados", models.JsonDevolucionesCreados());
                    this.oModelDevolucion.setProperty("/AddMotivo", models.JsonMotivo());
                });
            },
            _onPressAddFacturaBoleta: function(){
                this.oModelDevolucion.setProperty("/AddFacturaBoleta", []);
                this.oModelDevolucion.setProperty("/addClientVisible", false);
                //this.oModelDevolucion.setProperty("/KeyAddUser" ,"");
                this.setFragment("_dialogAAddClient", this.frgIdAddClient, "AddClient", this);
            },
            _onChangeUser: function(){
                this.oModelDevolucion.setProperty("/AddFacturaBoleta", models.JsonFactura());
            },
            _onNavDetalleFacturaBoleta: function(){
                var navCon = this._byId("frgIdAddClient--navcIdGroupFacturaBoleta");
                var sFragment = this._byId("frgIdAddClient--IdClienteDetail");
                this.oModelDevolucion.setProperty("/addClientVisible", true);
                this.oModelDevolucion.setProperty("/AddFacturaBoletaDetail", models.JsonFacturaDetail());
                navCon.to(sFragment);
            },
            _onNavBack: function(){
                var navCon = this._byId("frgIdAddClient--navcIdGroupFacturaBoleta");
                this.oModelDevolucion.setProperty("/addClientVisible", false);
                navCon.back();
            },

            _onPressAddProducto: function(){
                this.oModelDevolucion.setProperty("/addClientVisible", false);
                this.setFragment("_dialogAAddProduct", this.frgIdAddProduct, "AddProduct", this);
            },
            _onPressSearch: function(){
                this.oModelDevolucion.setProperty("/AddFacturaBoleta", models.JsonFactura());

            },
            _onNavDetalleProducto: function(){
                var navCon = this._byId("frgIdAddProduct--navcIdGroupProducto");
                var sFragment = this._byId("frgIdAddProduct--IdProductoDetail");
                this.oModelDevolucion.setProperty("/addClientVisible", true);
                this.oModelDevolucion.setProperty("/AddProductoDetail", models.JsonFacturaDetail());
                navCon.to(sFragment);
            },
        });
    });
