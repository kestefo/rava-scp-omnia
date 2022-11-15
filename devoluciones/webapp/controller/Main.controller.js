sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "devoluciones/controller/BaseController",
    "devoluciones/model/models",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "../libs/html2canvas",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, BaseController, models, Fragment, MessageBox, html2canvas) {
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
                    this._getUsers();

                }

            },
            _getUsers: function () {
                // try {

                //     var sPath = '/sap/opu/odata/sap/ZOSDD_CUSTOM_VENDOR_CDS/';
                //     const sUrl = that.getOwnerComponent().getManifestObject().resolveUri(sPath);
                //     return new Promise(function (resolve, reject) {
                //         var model = new sap.ui.model.json.JSONModel(),
                //             arrayUsers;
                //         model.loadData(sUrl, null, true, "GET", null, null, {
                //             "Content-Type": "application/scim+json"
                //         }).then(() => {
                //             var oDataTemp = model.getData();
                //             resolve(oDataTemp);
                //         }).catch(err => {
                //             console.log("Error:" + err.message);
                //             reject(oError);
                //         });
                //     });

                // } catch (oError) {
                //     that.getMessageBox("error", that.getI18nText("sErrorTry"));
                // }

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

                    },
                    error: function () {
                        MessageBox.error("Ocurrio un error al obtener los datos");
                    }
                });

            },

            handleRouteMatched: function () {
                Promise.all([]).then(async values => {
                    this.oModelDevolucion = this.getModel("oModelDevolucion");
                    this.oModelDevolucion.setProperty("/AddSelectUser", models.JsonUser());
                    this.oModelDevolucion.setProperty("/AddMotivo", models.JsonMotivo());
                });
            },
            onpresPrint: function () {
                window.print()
            },
            onpressCaptura: function (evt) {
                document.body.innerHTML = '<video style="width: 100%; height: 100%; border: 1px black solid;"/>';

                navigator.mediaDevices.getDisplayMedia()
                    .then(mediaStream => {
                        const video = document.querySelector('video');
                        video.srcObject = mediaStream;
                        video.onloadedmetadata = e => {
                            video.play();
                            video.pause();
                        };
                    })
                    .catch(err => console.log(`${err.name}: ${err.message}`));

                //var captura = stopCapture(evt);
                // const videoElem = document.getElementById("video");
                // let tracks = videoElem.srcObject.getTracks();

                // tracks.forEach((track) => track.stop());
                // videoElem.srcObject = null;
            },
            onBuscar: function () {
                var oView = this.getView();
                var oModelDevolucion = oView.getModel("oModelDevolucion");
                var FechaComprobante1 = oView.byId("formatFecha").getValue();
                var FechaComprobante = oView.byId("sfechaComprobante20").getValue();
                var formatoDesde = FechaComprobante1.substring(6, 10) + FechaComprobante1.substring(3, 5) + FechaComprobante1.substring(0, 2);
                var formatoHasta = FechaComprobante.substring(6, 10) + FechaComprobante.substring(3, 5) + FechaComprobante.substring(0, 2);
                var KeyCliente = oModelDevolucion.getProperty("/KeyCliente");
                var contador = 0;
                var that = this;
                var mensaje = "";
                var RegExPattern = /^(?:(?:(?:0?[1-9]|1\d|2[0-8])[/](?:0?[1-9]|1[0-2])|(?:29|30)[/](?:0?[13-9]|1[0-2])|31[/](?:0?[13578]|1[02]))[/](?:0{2,3}[1-9]|0{1,2}[1-9]\d|0?[1-9]\d{2}|[1-9]\d{3})|29[/]0?2[/](?:\d{1,2}(?:0[48]|[2468][048]|[13579][26])|(?:0?[48]|[13579][26]|[2468][048])00))$/;

                if ((FechaComprobante1.match(RegExPattern) === null)) {
                    contador++;
                    mensaje = this.getI18nText("txtValidacionFecha");
                } else if (FechaComprobante1 === "" || FechaComprobante1 === undefined) {
                    contador++;
                    mensaje = this.getI18nText("txtValidacionBuscar");

                }

                if ((FechaComprobante.match(RegExPattern) === null)) {
                    contador++;
                    mensaje = this.getI18nText("txtValidacionFecha");
                } else if (FechaComprobante === "" || FechaComprobante === undefined) {
                    contador++;
                    mensaje = this.getI18nText("txtValidacionBuscar");
                }
                if (KeyCliente === "" || KeyCliente === undefined) {
                    contador++;
                    mensaje = this.getI18nText("txtValidacionBuscar");

                }

                if (contador > 0) {
                    MessageBox.error(mensaje);
                    return;
                }

                // var url = "/sap/opu/odata/sap/ZOSDD_CUSTOM_VENDOR_CDS/";
                // jQuery.ajax({
                //     type: "GET",
                //     cache: false,
                //     headers: {
                //         "Accept": "application/json"
                //     },
                //     contentType: "application/json",
                //     url: url,
                //     async: true,
                //     success: function (data, textStatus, jqXHR) {
                //         var datos = data.d;
                //         that.oModelDevolucion.setProperty("/DevolucionesCreados", models.JsonDevolucionesCreados());
                //         oModelDevolucion.setProperty("/KeyCliente", "");
                //         oView.byId("formatFecha").setValue("");
                //         oView.byId("sfechaComprobante20").setValue("");

                //     },
                //     error: function () {
                //         MessageBox.error("Ocurrio un error al obtener los datos");
                //     }
                // });
                this.oModelDevolucion.setProperty("/DevolucionesCreados", models.JsonDevolucionesCreados());
                oModelDevolucion.setProperty("/KeyCliente", "");
                oView.byId("formatFecha").setValue("");
                oView.byId("sfechaComprobante20").setValue("");

            },

            filtroCliente: function () {
                var oView = this.getView();
                var oModelDevolucion = oView.getModel("oModelDevolucion");
                var model = new sap.ui.model.json.JSONModel();
                ///sap/opu/odata/sap/ZOSDD_CUSTOM_DATA_CDS/ZOSDD_CUSTOM_DATA(p_kunnr='1000000000')/Set?$format=json
                //oModelDevolucion.setProperty("/FiltroCliente", models.jsonFiltroClient());

                var sPath = "/sap/opu/odata/sap/ZOSDD_CUSTOM_DATA_CDS/ZOSDD_CUSTOM_DATA(p_kunnr='1000000000')/Set";
                model.loadData(sPath, null, true, "GET", null, null, {
                    "Content-Type": "application/json"
                }).then(() => {
                    var oDataTemp = model.getData();
                    that.getModel("oModelUser").setProperty("/FiltroCliente", oDataTemp.d.results);
                    // resolve(oDataTemp.Resources[0]["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"].attributes[0]);
                }).catch(err => {
                    console.log("Error:" + err.message);
                    //reject(err);
                });

                var sPath = "/sap/opu/odata/sap/ZOSDD_CUSTOM_VENDOR_CDS/ZOSDD_CUSTOM_VENDOR(p_vende='1000000000')/Set";
                model.loadData(sPath, null, true, "GET", null, null, {
                    "Content-Type": "application/json"
                }).then(() => {
                    var oDataTemp = model.getData();
                    that.getModel("oModelUser").setProperty("/FiltroCliente", oDataTemp.d.results);
                    // resolve(oDataTemp.Resources[0]["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"].attributes[0]);
                }).catch(err => {
                    console.log("Error:" + err.message);
                    //reject(err);
                });

                // var url = "/sap/opu/odata/sap/ZOSDD_CUSTOM_DATA_CDS/ZOSDD_CUSTOM_DATA(p_kunnr='1000000000')/Set?$format=json";
                // jQuery.ajax({
                //     type: "GET",
                //     cache: false,
                //     headers: {
                //         "Accept": "application/json"
                //     },
                //     contentType: "application/json",
                //     url: url,
                //     async: true,
                //     success: function (data, textStatus, jqXHR) {
                //         var datos = data.d;
                //         that.oModelDevolucion.setProperty("/FiltroCliente",datos);
                        

                //     },
                //     error: function () {
                //         MessageBox.error("Ocurrio un error al obtener los datos");
                //     }
                // });

                // var url = "/sap/opu/odata/sap/ZOSDD_CUSTOM_VENDOR_CDS/ZOSDD_CUSTOM_VENDOR(p_vende='1000000000')/Set?$format=json";
                // jQuery.ajax({
                //     type: "GET",
                //     cache: false,
                //     headers: {
                //         "Accept": "application/json"
                //     },
                //     contentType: "application/json",
                //     url: url,
                //     async: true,
                //     success: function (data, textStatus, jqXHR) {
                //         var datos = data.d;
                //         //that.oModelDevolucion.setProperty("/FiltroCliente",datos);
                        

                //     },
                //     error: function () {
                //         MessageBox.error("Ocurrio un error al obtener los datos");
                //     }
                // });


            },

            _onPressAddFacturaBoleta: function () {
                this.oModelDevolucion.setProperty("/AddFacturaBoleta", []);
                this.oModelDevolucion.setProperty("/addClientVisible", false);
                //this.oModelDevolucion.setProperty("/KeyAddUser" ,"");
                this.setFragment("_dialogAAddClient", this.frgIdAddClient, "AddClient", this);
                // this.setFragment("_dialogAAddClient", this.frgaddConsultaFact, "AddClient", this);//nuevo 11.10.2022
            },
            _onChangeFactBol: function (oEvent) {
                var kSelected = oEvent.getSource().getSelectedKey();
                var sSelected = oEvent.getSource().getValue();
                if (kSelected !== '') {
                    oEvent.getSource().setValue(sSelected);
                } else {
                    if (oEvent.getSource().getValue()) {
                        this.getMessageBox("error", this.getI18nText("sErrorSelect"));
                    }
                    oEvent.getSource().setValue("");
                }
            },
            _onChangeProducto: function (oEvent) {

                var kSelected = oEvent.getSource().getSelectedKey();
                var sSelected = oEvent.getSource().getValue();
                if (kSelected !== '') {
                    oEvent.getSource().setValue(sSelected);
                } else {
                    if (oEvent.getSource().getValue()) {
                        this.getMessageBox("error", this.getI18nText("sErrorSelect"));
                    }
                    oEvent.getSource().setValue("");
                }

            },

            BusquedaFactBol: function () {
                var that = this;
                var KeyAddUser = this.oModelDevolucion.getProperty("/KeyAddUser");

                if (KeyAddUser !== undefined && KeyAddUser !== "") {

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
                            that.oModelDevolucion.setProperty("/AddFacturaBoleta", models.JsonFactura());
                            that.getOwnerComponent().getRouter().navTo("ConsultaFactura");
                            that.oModelDevolucion.setProperty("/KeyAddUser", "");

                        },
                        error: function () {
                            MessageBox.error("Ocurrio un error al obtener los datos");
                        }
                    });

                } else {

                    MessageBox.warning(this.getI18nText("txtMensajeBolFact"));
                    return;
                }

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

                this.oModelDevolucion.setProperty("/totalCantidad", contadorCant.toString());
                this.oModelDevolucion.setProperty("/totalMonto", contadorMonto.toFixed(2));


                this.getOwnerComponent().getRouter().navTo("DetalleDevolucion");
            },
            BusquedaProducto: function () {
                var that = this;
                var keyProducto = this.oModelDevolucion.getProperty("/keyProducto");
                if (keyProducto !== undefined && keyProducto !== "") {

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
                            that.getOwnerComponent().getRouter().navTo("ConsultaProducto");
                            that.oModelDevolucion.setProperty("/keyProducto", "");

                        },
                        error: function () {
                            MessageBox.error("Ocurrio un error al obtener los datos");
                        }
                    });

                } else {

                    MessageBox.warning(this.getI18nText("txtMensajeProduct"));
                    return;
                }

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
