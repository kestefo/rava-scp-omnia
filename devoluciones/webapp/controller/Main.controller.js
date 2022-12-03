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
                // this.oRouter.getTarget("Main").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

                this.frgIdAddClient = "frgIdAddClient";
                this.frgIdAddProduct = "frgIdAddProduct";
                this.frgaddConsultaFact = "frgAddconsultaFac";//CRomero
                this.fragaddDetalleFact = "frgAddDetalleFact";//CRomero
                this.handleRouteMatched();


            },

            handleRouteMatched: function () {
               Promise.all([that._getUsers()]).then((values) => {
                    sap.ui.core.BusyIndicator.show();
                    this.oModelDevolucion = this.getModel("oModelDevolucion");
                    this.oModelDevolucion.setProperty("/AddMotivo", models.JsonMotivo());
<<<<<<< HEAD
                    var sCodeUser = values[0].value;
                    // var sCodeUser ="9600000065";// cambio 25/11/2022
=======
                     var sCodeUser = values[0].value;
                    //var sCodeUser ="9600000065";// cambio 25/11/2022
>>>>>>> ffb619af5e133ee4c1aab246c8635919dec56530
                    if(!that.isEmpty(sCodeUser)){
                        that.filtroCliente(sCodeUser);
                       
                        
                    }else{
                        that.getMessageBox("error", that.getI18nText("errorUserNoCode"));
                    }
                }).catch(function (oError) {
                    console.log(oError);
                    that.getMessageBox("error", that.getI18nText("errorUserData"));
                    sap.ui.core.BusyIndicator.hide(0);
                });
            },

            _onbtnRefresh:function(){
                this.handleRouteMatched();
            },
            _getUsers: function () {
                try {
                    var sMail = this.getUserLoged();
                    var model = new sap.ui.model.json.JSONModel();
                    return new Promise(function (resolve, reject) {
                        if(that.local){// cambio solo para la prueba en local
                            var sPath = "/service/scim/Users?filter=emails eq '" + sMail + "'";
                            const sUrl = that.getOwnerComponent().getManifestObject().resolveUri(sPath);
                            model.loadData(sUrl, null, true, "GET", null, null, {
                                "Content-Type": "application/scim+json"
                            }).then(() => {
                                var oDataTemp = model.getData();
                                that.getModel("oModelUser").setProperty("/oUser", oDataTemp.Resources[0]);
                                resolve(oDataTemp.Resources[0]["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"].attributes[0]);
                            }).catch(err => {
                                console.log("Error:" + err.message);
                                reject(err);
                            });
                        }else{
                            var sPath = jQuery.sap.getModulePath("devoluciones") +"/API-USER-IAS/service/scim/Users?filter=emails eq '" + sMail + "'";
                            model.loadData(sPath, null, true, "GET", null, null, {
                                "Content-Type": "application/scim+json"
                            }).then(() => {
                                var oDataTemp = model.getData();
                                that.getModel("oModelUser").setProperty("/oUser", oDataTemp.Resources[0]);
                                resolve(oDataTemp.Resources[0]["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"].attributes[0]);
                            }).catch(err => {
                                console.log("Error:" + err.message);
                                reject(err);
                            });
                        }
                    });
                    
                } catch (oError) {
                    that.getMessageBox("error", that.getI18nText("sErrorTry"));
                }	
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
            consultaMateriales:function(canal){
                var oView            = this.getView();
                var oModelDevolucion = oView.getModel("oModelDevolucion");
               
                var url="/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/ConsultaMarcaSet?$filter=Mvgr1 eq '' and Vtweg eq '"+ canal +"'";
            
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
                       var datos = data.d.results;
                       oModelDevolucion.setProperty("/Materialesdetalle",datos);
                       sap.ui.core.BusyIndicator.hide(0);
                       
                         
                   },
                   error: function () {
                       MessageBox.error("Ocurrio un error al obtener los datos");
                       sap.ui.core.BusyIndicator.hide(0); 
                   }
                });
            },
            
            onBuscar: function () {
                var oView = this.getView();
                var oModelDevolucion = oView.getModel("oModelDevolucion");
                var FechaComprobante1 = oView.byId("formatFecha").getValue();
                var FechaComprobante = oView.byId("sfechaComprobante20").getValue();
                var formatoDesde = FechaComprobante1.substring(6, 10) +"-"+ FechaComprobante1.substring(3, 5) +"-"+ FechaComprobante1.substring(0, 2);
                var formatoHasta = FechaComprobante.substring(6, 10) +"-"+ FechaComprobante.substring(3, 5) +"-"+ FechaComprobante.substring(0, 2);
                var KeyCliente = oModelDevolucion.getProperty("/KeyCliente");
                var FiltroCliente = oModelDevolucion.getProperty("/FiltroCliente");
                var contador = 0;
                var that = this;
                var mensaje = "";
                var canal ="";
                var RegExPattern = /^(?:(?:(?:0?[1-9]|1\d|2[0-8])[/](?:0?[1-9]|1[0-2])|(?:29|30)[/](?:0?[13-9]|1[0-2])|31[/](?:0?[13578]|1[02]))[/](?:0{2,3}[1-9]|0{1,2}[1-9]\d|0?[1-9]\d{2}|[1-9]\d{3})|29[/]0?2[/](?:\d{1,2}(?:0[48]|[2468][048]|[13579][26])|(?:0?[48]|[13579][26]|[2468][048])00))$/;
                sap.ui.core.BusyIndicator.show();
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
                    MessageBox.warning(mensaje);
                    sap.ui.core.BusyIndicator.hide(0);
                    return;
                }

                var url = "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/BuscaPedidoSet?$filter=Erdat ge '"+formatoDesde+"' and Erdat le '"+formatoHasta+"' "+
                "and Estado eq '' and Kunnr eq '"+KeyCliente+"' and Type eq 'D'&$expand=DetalleBuscaPedidoSet";
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
                       
                        var datos = data.d.results;
                        FiltroCliente.forEach(function(items){
                            datos.forEach(function(obj){
                                if(obj.Kunnr === items.Kunnr){
                                    obj.Cliente = items.Namec;
                                    obj.ruc =items.Stcd1;
                                    canal = items.Vtweg;
                                }

                            }) ;
                        });
                        that.oModelDevolucion.setProperty("/DevolucionesCreados", datos);
                        oModelDevolucion.setProperty("/KeyCliente", "");
                        oView.byId("formatFecha").setValue("");
                        oView.byId("sfechaComprobante20").setValue("");
                        that.consultaMateriales(canal);
                        
                    },
                    error: function () {
                        MessageBox.error("Ocurrio un error al obtener los datos");
                        sap.ui.core.BusyIndicator.hide(0);
                    }
                });
               
            },

            onRefreshCliente:function(){
                var oModelUser = that.getModel("oModelUser").getProperty("/oUser");
                var sCodeUser = oModelUser["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"].attributes[0].value;
                //var sCodeUser = "9600000065";//cambio 25/11/2022
                sap.ui.core.BusyIndicator.show();
               this.filtroCliente(sCodeUser);
               MessageBox.success(that.getI18nText("sucessActualizacion"));
               

            },
            onrefreshProduct:function(){

                var oModelUser = that.getModel("oModelUser").getProperty("/oUser");
                var sCodeUser = oModelUser["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"].attributes[0].value;
                sap.ui.core.BusyIndicator.show();
               this.filtroCliente(sCodeUser);
               MessageBox.success(that.getI18nText("sucessActualizacion"));
               

            },

            filtroCliente: function (sCodeUser) {
                var oView = this.getView();
                var oModelDevolucion = oView.getModel("oModelDevolucion");
                var model = new sap.ui.model.json.JSONModel();
                var that = this;
                var oClienteGroup =[];
                sap.ui.core.BusyIndicator.show();
                var sPath = "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/SelectionSet?$filter=(Kunn2 eq '" + sCodeUser +"')&$expand=NAVCUSTO,NAVMATER";
                jQuery.ajax({
                        type: "GET",
                        cache: false,
                        headers: {
                            "Accept": "application/json"
                        },
                        contentType: "application/json",
                        url: sPath,
                        async: true,
                        success: function (data, textStatus, jqXHR) {
                            var sCodVend = data.d.results[0].Kunn2;
                            var datos = data.d.results[0].NAVCUSTO.results;

                            $.each(that._groupBy(datos,'Kunnr'), function (x, y) {
                                var jFamilia = {
                                    "Kunnr":y[0].Kunnr,
                                    "Namec":y[0].Namec,
                                    "Smtp_addr":y[0].Smtp_addr,
                                    "Telf1":y[0].Telf1,
                                    "Stcd1":y[0].Stcd1,
                                    "Vkgrp":y[0].Vkgrp,
                                    "Txtfv":y[0].Txtfv,
                                    "Vkbur":y[0].Vkbur,
                                    "Txtpv":y[0].Txtpv,
                                    "Zterm":y[0].Zterm,
                                    "Txtcp":y[0].Txtcp,
                                    "Vtweg":y[0].Vtweg,
                                    "Txtca":y[0].Txtca,
                                    "oDireccion": []
                                };
                                var count = 0;
                                y.forEach(function(value, index){
                                    count ++;
                                    value.posStras = count.toString();
                                });
                                jFamilia.oDireccion = y;
        
                                oClienteGroup.push(jFamilia);
                            });

                            oModelDevolucion.setProperty("/codVen", sCodVend);
                            oModelDevolucion.setProperty("/FiltroCliente", oClienteGroup);
                            oModelDevolucion.setProperty("/AddSelectUser", oClienteGroup);
                            oModelDevolucion.setProperty("/AddNombreProduct", oClienteGroup);
                            // oModelDevolucion.setProperty("/AddSelectMarca",models.JsonMarcaProduct());//Cambio Claudia 28/11/2022
                            //sap.ui.core.BusyIndicator.hide(0);
                            that.consultaDatosMarca();
                            
    
                        },
                        error: function () {
                            MessageBox.error("Ocurrio un error al obtener los datos");
                            sap.ui.core.BusyIndicator.hide(0);
                        }
                    });

            },

            consultaDatosMarca: function () {
                var oView = this.getView();
                var oModelDevolucion = oView.getModel("oModelDevolucion");
                
                oModelDevolucion.setProperty("/AddSelectMarca", models.JsonMarcaProduct());
                
                sap.ui.core.BusyIndicator.hide(0);
            },

            _onPressAddFacturaBoleta: function () {
                this.oModelDevolucion.setProperty("/AddFacturaBoleta", []);
                this.oModelDevolucion.setProperty("/addClientVisible", false);
                //this.oModelDevolucion.setProperty("/KeyAddUser" ,"");
                this.setFragment("_dialogAAddClient", this.frgIdAddClient, "AddClient", this);
                // this.setFragment("_dialogAAddClient", this.frgaddConsultaFact, "AddClient", this);//nuevo 11.10.2022
            },
            _onChangeFactBol: function (oEvent) {
                var oView = this.getView();
                var oModelDevolucion = oView.getModel("oModelDevolucion");
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
                var oView = this.getView();
                var oModelDevolucion = oView.getModel("oModelDevolucion");
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
            onDetalleDevolucion: function (oEvent) {
                var that              = this;
                var oView             = this.getView();
                var oModelDevolucion =oView.getModel("oModelDevolucion");
                var productPath       = oEvent.getSource().getBindingContext("oModelDevolucion").getPath();
                var selected          = oView.getModel("oModelDevolucion").getProperty(productPath);
                var contadorMonto     = 0;
                var contadorCant      = 0;
                var Materialesdetalle = oModelDevolucion.getProperty("/Materialesdetalle");

                if (selected.estado !== "Pedido") {
                    this.oModelDevolucion.setProperty("/editableNroCredt", false);
                    this.oModelDevolucion.setProperty("/editableDescripMot", false);

                } else {
                    this.oModelDevolucion.setProperty("/editableNroCredt", true);
                    this.oModelDevolucion.setProperty("/editableDescripMot", true);
                }
                var datosDetalle = selected.DetalleBuscaPedidoSet.results;

                Materialesdetalle.forEach(function(items){
                    datosDetalle.forEach(function(obj){
                        if(obj.Matnr === items.Matnr){
                            obj.descripcion =items.Maktx;
                        }
                    });

                });

                this.oModelDevolucion.setProperty("/AddDetalleDev", datosDetalle);
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

            BusquedaFactBol: function () {
                var oItemSelect = this._byId("frgIdAddClient--slUsuario").getSelectedItem();
                var oClientSelect = oItemSelect.getBindingContext("oModelDevolucion").getObject()
                sap.ui.core.BusyIndicator.show();
                var that        = this;
                var oView           = this.getView();
                var oModelDevolucion = oView.getModel("oModelDevolucion");
                var KeyAddUser  = this.oModelDevolucion.getProperty("/KeyAddUser");
                var e           = new Date()
                var day         = e.getDate().toString();
                var mes         = e.getMonth()+1
                var SumaMes     ="";
                var Dia         ="";
                var Añoactual   = e.getFullYear().toString();
                var AddSelectUser = oModelDevolucion.getProperty("/AddSelectUser");
                
                if (day < 10) {
                     Dia = "0" + e.getDate().toString();
                } else {
                     Dia = e.getDate().toString();
                }
    
                if (mes < 10) {
                    mes = "0" + mes.toString();
                }

                // (new Date).getTime() - ( 6 * 30 *24  * 60  * 60 * 1000)
                // new Date()
                
                 e.setMonth(e.getMonth() - 6)// se utiliza la función set month para realizar el incremento de los meses
                 var SumaFecha = e.getMonth()+1;

                 if(SumaFecha < 10){
                 SumaMes="0" + SumaFecha.toString();
                }else{
                    SumaMes = SumaFecha;
                }
                 
                var SumaFechas = e.getFullYear().toString() + (SumaMes) + Dia;
                var FechaActual = Añoactual+ mes.toString()+Dia;
                console.log(SumaFechas +"-"+ FechaActual);
                
                if (KeyAddUser !== undefined && KeyAddUser !== "") {
                    that.oModelDevolucion.setProperty("/oClientSelect", oClientSelect);
                    var url = "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/BuscaReceiptSet?$filter=((FechaFact ge '"+ SumaFechas +"' and FechaFact le '"+ FechaActual +"') and CodCli eq '"+ KeyAddUser +"')&$expand=DetalleBuscaReceiptSet";
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
                            var datos = data.d.results;
                            AddSelectUser.forEach(function(obj1){
                                datos.forEach(function(obj){
                                    if(KeyAddUser === obj1.Kunnr){
                                    obj.Fechaformat = obj.FechaFact.substring(6,8)+"/"+ obj.FechaFact.substring(6,4)+"/"+obj.FechaFact.substring(4,0);
                                     obj.NombreCliente = obj1.Namec;
                                    }
                                   
                                });
                            })
                           
                            datos.forEach(function(value, index){
                                //Claudia factura a mostrar en sus detalles
                                value.mostFactura = "";
                                if(value.Referencia != "0000000000000000"){
                                    value.mostFactura = value.Referencia;
                                }
                                value.mostMont = (parseFloat(value.MonGlobal) + parseFloat(value.ImpGlobal)).toString();
                            });
                            
                            that.oModelDevolucion.setProperty("/AddFacturaBoleta", datos);
                            that.getOwnerComponent().getRouter().navTo("ConsultaFactura");
                            that.oModelDevolucion.setProperty("/KeyAddUser", "");
                            sap.ui.core.BusyIndicator.hide(0);

                        },
                        error: function () {
                            MessageBox.error("Ocurrio un error al obtener los datos");
                            sap.ui.core.BusyIndicator.hide(0);
                        }
                    });

                } else {

                    MessageBox.warning(this.getI18nText("txtMensajeBolFact"));
                    sap.ui.core.BusyIndicator.hide(0);
                    return;
                }

            },

            BusquedaProducto: function () {
                var oItemSelect = this._byId("frgIdAddProduct--slUsuarioProduct").getSelectedItem();
                var oClientSelect = oItemSelect.getBindingContext("oModelDevolucion").getObject()
                sap.ui.core.BusyIndicator.show();
                var that                = this;
                var oView               = this.getView();
                var oModelDevolucion    = oView.getModel("oModelDevolucion");
                var keyProducto         = oModelDevolucion.getProperty("/keyProducto");
                var e                   = new Date()
                var day                 = e.getDate().toString();
                var mes                 = e.getMonth()+1
                var SumaMes             ="";
                var Dia                 ="";
                var idProducto          =this._byId("frgIdAddProduct--slUsuarioProduct").getSelectedItem();
                var oClientProductSelect = idProducto.getBindingContext("oModelDevolucion").getObject();
                sap.ui.core.BusyIndicator.show();
                var Añoactual           = e.getFullYear().toString();
                var SumaFecha           = e.getMonth()+1;
               
                if (day < 10) {
                     Dia = "0" + e.getDate().toString();
                } else {
                     Dia = e.getDate().toString();
                }
    
                if (mes < 10) {
                    mes = "0" + mes.toString();
                }
                
                
                e.setMonth(e.getMonth() - 6)// se utiliza la función set month para realizar el incremento de los meses
                var SumaFecha = e.getMonth()+1;

                if(SumaFecha < 10){
                SumaMes="0" + SumaFecha.toString();
               }else{
                   SumaMes = SumaFecha;
               }
                 
                var SumaFechas = e.getFullYear().toString() + (SumaMes) + Dia;
                var FechaActual = Añoactual+ mes.toString()+Dia;

                console.log(SumaFechas +"-"+ FechaActual);
                oModelDevolucion.setProperty("/CodigoCanal" , oClientProductSelect.Vtweg);

                if (keyProducto !== undefined && keyProducto !== "") {
                    that.oModelDevolucion.setProperty("/oClientSelect", oClientSelect);
                //     var url = "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/BuscaReceiptSet?$filter=((FechaFact ge '"+ SumaFechas +"' and FechaFact le '"+ FechaActual +"') and CodCli eq '"+ keyProducto +"' and Material eq '000000001200000225')&$expand=DetalleBuscaReceiptSet";
                //    // var url = "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/BuscaReceiptSet?$filter=((FechaFact ge '"+ SumaFechas +"' and FechaFact le '"+ FechaActual +"') and CodCli eq '"+ keyProducto +"')&$expand=DetalleBuscaReceiptSet";
                //     jQuery.ajax({
                //         type: "GET",
                //         cache: false,
                //         headers: {
                //             "Accept": "application/json"
                //         },
                //         contentType: "application/json",
                //         url: url,
                //         async: true,
                //         success: function (data, textStatus, jqXHR) {
                //             var datos = data.d.results;
                //             datos.forEach(function(obj){
                //                 obj.Fechaformat = obj.FechaFact.substring(6,8)+"/"+ obj.FechaFact.substring(6,4)+"/"+obj.FechaFact.substring(4,0);
                //             });
                //             // oModelDevolucion.setProperty("/AddProducto",datos);
                //             that.getOwnerComponent().getRouter().navTo("ConsultaProducto");
                //             that.oModelDevolucion.setProperty("/keyProducto", "");
                //             sap.ui.core.BusyIndicator.hide(0);
                //         },
                //         error: function () {
                //             MessageBox.error("Ocurrio un error al obtener los datos");
                //             sap.ui.core.BusyIndicator.hide(0);
                //         }
                //     });
                that.getOwnerComponent().getRouter().navTo("ConsultaProducto");
                that.oModelDevolucion.setProperty("/keyProducto", "");
                sap.ui.core.BusyIndicator.hide(0);
                } else {

                    MessageBox.warning(this.getI18nText("txtMensajeProduct"));
                    sap.ui.core.BusyIndicator.hide(0);
                    return;
                }
               
                
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
