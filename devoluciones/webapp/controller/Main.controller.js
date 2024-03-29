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
                    var sCodeUser = values[0].value;
                    if(!that.isEmpty(sCodeUser)){
                        that.filtroCliente(sCodeUser);
                       
                        
                    }else{
                        that.getMessageBox("error", that.getI18nText("errorUserNoCode"));
                    }
                    this.oModelDevolucion.setSizeLimit(9999999999999999999999);
                }).catch(function (oError) {
                    console.log(oError);
                    that.getMessageBox("error", that.getI18nText("errorUserData"));
                    sap.ui.core.BusyIndicator.hide(0);
                });
                
            },

            _onbtnRefresh:function(){
                this.handleRouteMatched();
                MessageBox.success(that.getI18nText("sucessActualizacion"));
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
         
            onBuscar: function () {
                var oView = this.getView();
                var oModelDevolucion = oView.getModel("oModelDevolucion");
                var FechaComprobante1 = oView.byId("formatFecha").getValue();
                var FechaComprobante = oView.byId("sfechaComprobante20").getValue();
                var formatoDesde = FechaComprobante1.substring(6, 10) + FechaComprobante1.substring(3, 5) + FechaComprobante1.substring(0, 2);
                var formatoHasta = FechaComprobante.substring(6, 10) + FechaComprobante.substring(3, 5) + FechaComprobante.substring(0, 2);
                var KeyCliente = oModelDevolucion.getProperty("/KeyCliente");
                var FiltroCliente = oModelDevolucion.getProperty("/FiltroCliente");
                var contador = 0;
                var that = this;
                var mensaje = "";
                var canal ="";
                var datos1 ="";
                var arrayClientes=[];
                
                
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
                // if (KeyCliente === "" || KeyCliente === undefined) {
                //     contador++;
                //     mensaje = this.getI18nText("txtValidacionBuscar");

                // }

                if (contador > 0) {
                    MessageBox.warning(mensaje);
                    sap.ui.core.BusyIndicator.hide(0);
                    return;
                }

                //Cambios Claudia 22/02/2023

                if(KeyCliente === "" || KeyCliente === undefined){

                    // FiltroCliente.forEach(function(items2 , i){
                    //     if (i > 0) {
    
                    //         datos1 += "or Kunnr eq '" + items2.Kunnr + "'";
                    //         if (FiltroCliente.length === i + 1) {
        
                    //             datos1 = "(" + datos1 + ")";
                    //         }
        
                    //     } else {
                    //         datos1 = "Kunnr eq '" + items2.Kunnr + "'";

                    //     }

                        
                    // });
                    FiltroCliente.forEach(function(items){
                       var datosClient6={
                        "Kunnr":items.Kunnr
                       } 

                       arrayClientes.push(datosClient6);
                    });
                
                
                }else{
                        var datosClient={
                        "Kunnr":KeyCliente
                       } 

                       arrayClientes.push(datosClient);
                }

                // var url = jQuery.sap.getModulePath("devoluciones") +"/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/ListadoPedDevSet?$filter=((Erdat ge '"+formatoDesde+"' and Erdat le '"+formatoHasta+"') and " +
                //  + ")&$expand=DetalleListadoPedDevSet";
                // var url="/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/ListadoPedDevSet?$filter=Erdat ge '"+formatoDesde+"' and Erdat le '"+formatoHasta+"' and Estado eq '' and Kunnr eq '"+KeyCliente+"' and Type eq 'D'&$expand=DetalleListadoPedDevSet"

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
                       
                //         var datos = data.d.results;
                //         if(datos.length > 0){
                //             FiltroCliente.forEach(function(items){
                //                 datos.forEach(function(obj){
                //                     if(obj.Kunnr === items.Kunnr){
                //                         obj.Cliente = items.Namec;
                //                         obj.ruc =items.Stcd1;
                //                         canal = items.Vtweg;
                //                         obj.formatFecha = obj.Erdat.substring(6,8)+"/"+ obj.Erdat.substring(6,4)+"/"+obj.Erdat.substring(4,0);
                //                         obj.FechaEmision =obj.FechaFact.substring(6,8)+"/"+ obj.FechaFact.substring(6,4)+"/"+obj.FechaFact.substring(4,0)
                //                         obj.Importe = (parseFloat(obj.Netwr) * 1.18 ).toFixed(2);
                                       
                                        
                //                     }
                                   
                //                 }) ;
                //             }); 
                //             that.oModelDevolucion.setProperty("/DevolucionesCreados", datos);
                //             oModelDevolucion.setProperty("/KeyCliente", "");
                //             oView.byId("formatFecha").setValue("");
                //             oView.byId("sfechaComprobante20").setValue("");
                //             sap.ui.core.BusyIndicator.hide(0);
                //         }else{
                //             that.oModelDevolucion.setProperty("/DevolucionesCreados", []);
                //             oModelDevolucion.setProperty("/KeyCliente", "");
                //             oView.byId("formatFecha").setValue("");
                //             oView.byId("sfechaComprobante20").setValue("");
                //              sap.ui.core.BusyIndicator.hide(0);
                //              MessageBox.warning(that.getI18nText("txtErrorBusqueda"));
                //         }
                       
                       
                        
                //     },
                //     error: function () {
                //         MessageBox.error("Ocurrio un error al obtener los datos");
                //         sap.ui.core.BusyIndicator.hide(0);
                //     }
                // });

                // var datos = {
                //     "CodCli": oClientSelect.Kunnr,
                //     "Tipo": TipoDoc,
                //     "Canal": oClientSelect.Vtweg,
                //     "Referencia": ProductDetal.mostFactura,
                //     "NumDocMod": ProductDetal.CodFact,
                //     "CodVen": codVen,
                //     "MotivoPed": KeyMotivo,
                //     "DetallePedidosDevSet": arrayClientes,
                //     "ResultPedidosDevSet": [
                //         {
                //             "Pedido": "",
                //             "Type": "",
                //             "Msg": ""
                //         }
                //     ]
                // }

                // {
                //     "Erdat1": "20230201",
                //     "Erdat2": "20230224",
                //     "ListadoPedDevSet": [
                //       {
                //         "Kunnr": "1000000725"
                //       },
                //       {
                //         "Kunnr": "1000002644"
                //       },
                //       {
                //         "Kunnr": "1000008610"
                //       },
                //       {
                //         "Kunnr": "1000009039"
                //       },
                //       {
                //         "Kunnr": "1000009054"
                //       }
                //     ],
                //     "DetalleListadoPedDevSet": [
                //       {
                //         "Vbeln": ""
                //       },
                //       {
                //         "Vbeln": ""
                //       }
                //     ]
                //   }
                var datos ={
                    "Erdat1": formatoDesde,
                    "Erdat2": formatoHasta,
                    "ListadoPedDevSet": arrayClientes,
                     "DetalleListadoPedDevSet":[
                        {
                        "Vbeln": ""
                      }

                      ]
                  }
                $.ajax({
                    url: jQuery.sap.getModulePath("devoluciones") +"/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/",
                    
                    type: "GET",
                    headers: {
                        "x-CSRF-Token": "Fetch"
                    }
                }).always(function (data, status, response) {
                    var token = response.getResponseHeader("x-csrf-token");
                    $.ajax({
                        url: jQuery.sap.getModulePath("devoluciones") +"/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/ListadoPedDev2Set",
                        method: "POST",
                        headers: {
                            "x-CSRF-Token": token
                        },
                        async: true,
                        contentType: "application/json",
                        dataType: "json",
                        data: JSON.stringify(datos),
                    }).always(async function (data, status, response) {
                        var datos = data.d.ListadoPedDevSet.results;
                        var datosDetalle = data.d.DetalleListadoPedDevSet.results;
                        if(datos.length > 0){
                            FiltroCliente.forEach(function(items){
                                datos.forEach(function(obj){
                                    if(obj.Kunnr === items.Kunnr){
                                        obj.Cliente = items.Namec;
                                        obj.ruc =items.Stcd1;
                                        canal = items.Vtweg;
                                        obj.formatFecha = obj.Erdat.substring(6,8)+"/"+ obj.Erdat.substring(6,4)+"/"+obj.Erdat.substring(4,0);
                                        obj.FechaEmision =obj.FechaFact.substring(6,8)+"/"+ obj.FechaFact.substring(6,4)+"/"+obj.FechaFact.substring(4,0)
                                        obj.Importe = (parseFloat(obj.Netwr) * 1.18 ).toFixed(2);
                                       
                                        
                                    }
                                   
                                }) ;
                            }); 
                            that.oModelDevolucion.setProperty("/DevolucionesCreados", datos);
                            that.oModelDevolucion.setProperty("/Detalledevoluciones", datosDetalle);//Cambio nuevo 23/02/2023
                            oModelDevolucion.setProperty("/KeyCliente", "");
                            oView.byId("formatFecha").setValue("");
                            oView.byId("sfechaComprobante20").setValue("");
                            sap.ui.core.BusyIndicator.hide(0);
                        }else{
                            that.oModelDevolucion.setProperty("/DevolucionesCreados", []);
                            oModelDevolucion.setProperty("/KeyCliente", "");
                            oView.byId("formatFecha").setValue("");
                            oView.byId("sfechaComprobante20").setValue("");
                             sap.ui.core.BusyIndicator.hide(0);
                             MessageBox.warning(that.getI18nText("txtErrorBusqueda"));
                        }  
                      
                       
                });
              });


               
            },

            onRefreshCliente:function(){
                var oModelUser = that.getModel("oModelUser").getProperty("/oUser");
                var sCodeUser = oModelUser["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"].attributes[0].value;
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
                //var sPath = jQuery.sap.getModulePath("devoluciones") +"/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/SelectionSet?$filter=(Kunn2 eq '" + sCodeUser +"')&$expand=NAVCUSTO,NAVMATER";
                var sPath = jQuery.sap.getModulePath("devoluciones") +"/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/SelectionSet?$filter=(Kunn2 eq '" + sCodeUser +"' and Type eq 'V')&$expand=NAVCUSTO,NAVMATER";
                
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
                var AddMotivo          =oModelDevolucion.getProperty("/AddMotivo");
                var DescripcionMotiv   ="";
                var Detalledevoluciones =oModelDevolucion.getProperty("/Detalledevoluciones");
                var Arraydetalledev    = [];

                // if ((selected.Estado).toLowerCase() !== "pedido") { // Convierte el texto de mayuscula a minuscula .
                //     this.oModelDevolucion.setProperty("/editableNroCredt", false);
                //     this.oModelDevolucion.setProperty("/editableDescripMot", false);

                // } else {
                //     this.oModelDevolucion.setProperty("/editableNroCredt", true);
                //     this.oModelDevolucion.setProperty("/editableDescripMot", true);
                // }
                var datosDetalle = selected;
                var detalleDevolu = Detalledevoluciones;
                //Cambios de Claudia 23/02/2023

                for (var i = detalleDevolu.length - 1; i >= 0; i--) {
                    if (detalleDevolu[i].Vbeln === "") {
                        detalleDevolu.splice(i, 1);
                    }
                    }

                    detalleDevolu.forEach(function(obj){
                        if(obj.Vbeln === datosDetalle.Vbeln){
                            obj.Material =parseFloat(obj.Matnr).toString();
                            obj.formatCantidad = parseFloat(obj.Kwmeng).toFixed(2);
                            if(parseFloat(obj.formatCantidad) !== 0){
                                obj.preciounitario= ((parseFloat(obj.Netwr) / parseFloat(obj.formatCantidad)) * 1.18).toFixed(3); 
                            }else{
                                obj.preciounitario= "0.00";  
                            }
                            
                            obj.ImporteTotal =  (parseFloat(obj.Kwmeng) * parseFloat(obj.preciounitario)).toFixed(2);

                            Arraydetalledev.push(obj);
                        }
                       
                       
                    });

                    AddMotivo.forEach(function(ob){
                        Arraydetalledev.forEach(function(items){
                            
                            if(ob.key === items.Augru){
                                DescripcionMotiv = ob.descripcion;
                            }
                            
                        });
                    });

                this.oModelDevolucion.setProperty("/AddDetalleDev", Arraydetalledev);
                this.oModelDevolucion.setProperty("/NroCredito", selected.Vbeln);//Número de credito.
                this.oModelDevolucion.setProperty("/NroLegal", selected.Xblnr);//Número legal.
                this.oModelDevolucion.setProperty("/DescripMotivo", DescripcionMotiv);

                Arraydetalledev.forEach(function (element) {
                    contadorCant += parseFloat(element.Kwmeng);
                    contadorMonto += parseFloat(element.ImporteTotal);

                });
                this.oModelDevolucion.setProperty("/totalCantidad", contadorCant.toFixed(2));
                this.oModelDevolucion.setProperty("/totalMonto", contadorMonto.toFixed(2));
                this.getOwnerComponent().getRouter().navTo("DetalleDevolucion");
            },

            BusquedaFactBol: function () {
                var oItemSelect = this._byId("frgIdAddClient--slUsuario").getSelectedItem();
                
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
                    //Cambios Claudia 22/02/2023
                    var oClientSelect = oItemSelect.getBindingContext("oModelDevolucion").getObject()
                    that.oModelDevolucion.setProperty("/oClientSelect", oClientSelect);
                    var url = jQuery.sap.getModulePath("devoluciones") +"/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/BuscaReceiptSet?$filter=((FechaFact ge '"+ SumaFechas +"' and FechaFact le '"+ FechaActual +"') and CodCli eq '"+ KeyAddUser +"')&$expand=DetalleBuscaReceiptSet";
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
                // var oClientProductSelect = idProducto.getBindingContext("oModelDevolucion").getObject();
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
                

                if (keyProducto !== undefined && keyProducto !== "") {
                    //Cambios Claudia 22/02/2023
                    var oClientSelect = oItemSelect.getBindingContext("oModelDevolucion").getObject()
                    that.oModelDevolucion.setProperty("/oClientSelect", oClientSelect);
                    oModelDevolucion.setProperty("/CodigoCanal" , oClientSelect.Vtweg);
                    oModelDevolucion.setProperty("/AddProducto", []);
                    oModelDevolucion.setProperty("/keyProducto", "");
                    oModelDevolucion.setProperty("/keyMarca", "");
                    oModelDevolucion.setProperty("/keyNombProduct", "");
                    that.getOwnerComponent().getRouter().navTo("ConsultaProducto");
                
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
