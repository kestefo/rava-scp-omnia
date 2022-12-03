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
], function (BaseController,Controller, MessageBox, History, MessageToast, Fragment, models, Core) {
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
            // if (contadorGlobal === 1) {
            // oView.getModel("contadorGlobal").setProperty("/contador", 2);

            // }else if (contadorGlobal === 0){
            //     this.getOwnerComponent().getRouter().navTo("Main");
			// 	return;
            // }
            // this.getOwnerComponent().getRouter().navTo("Main");
        },
        _SearchPedido:function(){
            sap.ui.core.BusyIndicator.show();
            var oView = this.getView();
            var oModelDevolucion = oView.getModel("oModelDevolucion");
            var keyMarca  =oModelDevolucion.getProperty("/keyMarca");
            var keyNombProduct = oModelDevolucion.getProperty("/keyNombProduct");
            var datosLote     =oModelDevolucion.getProperty("/datosLote");
            var contValidacion= 0;
            var that                = this;
            var oClientSelect      = this.getModel("oModelDevolucion").getProperty("/oClientSelect");
           var keyProducto         = oModelDevolucion.getProperty("/keyProducto");
            var e                   = new Date()
            var day                 = e.getDate().toString();
            var mes                 = e.getMonth()+1
            var SumaMes             ="";
            var Dia                 ="";
            var AddNombreProduct    =oModelDevolucion.getProperty("/AddNombreProduct");
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

            if(keyMarca === undefined || keyMarca === ""){
                contValidacion++;
            }
            if(keyNombProduct === undefined || keyNombProduct === ""){
                contValidacion++;
            }
            
            if(contValidacion > 0){
                MessageBox.warning(this.getI18nText("txtMensBuscarProduct"));
                sap.ui.core.BusyIndicator.hide(0);
                return;
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
           

                var url = "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/BuscaReceiptSet?$filter=((FechaFact ge '"+ 
                    SumaFechas +"' and FechaFact le '"+ FechaActual +"') and CodCli eq '"+ oClientSelect.Kunnr +"' and Material eq '"+
                    keyNombProduct+"')&$expand=DetalleBuscaReceiptSet";
               // var url = "/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/BuscaReceiptSet?$filter=((FechaFact ge '"+ SumaFechas +"' and FechaFact le '"+ FechaActual +"') and CodCli eq '"+ keyProducto +"')&$expand=DetalleBuscaReceiptSet";
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
                        var oClientSelect = that.getModel("oModelDevolucion").getProperty("/AddSelectUser");
                        if(datos.length > 0){
                            // AddNombreProduct.forEach(function(items){
                                datos.forEach(function(obj){
                                    // if(keyNombProduct === items.Kunnr){
                                        // obj.NombreCliente=obj1.Namec; 
                                        // obj.Fechaformat = obj.FechaFact.substring(6,8)+"/"+ obj.FechaFact.substring(6,4)+"/"+obj.FechaFact.substring(4,0);
                                        var jFindMaterial = oClientSelect.find(item => item.Kunnr  === obj.CodCli);
                                        if(jFindMaterial){
                                            obj.NombreCliente = jFindMaterial.Namec;
                                        }
                                    // }
          
                                  });
                            // });

                            datos.forEach(function(value, index){
                                //Claudia factura a mostrar en sus detalles
                                value.mostFactura = "";
                                if(value.Referencia != "0000000000000000"){
                                    value.mostFactura = value.Referencia;
                                }
                                value.mostMont = (parseFloat(value.MonGlobal) + parseFloat(value.ImpGlobal)).toString();
                            });

                            oModelDevolucion.setProperty("/AddProducto", datos);
                            oModelDevolucion.setProperty("/keyProducto", "");
                            oModelDevolucion.setProperty("/keyNombProduct", "");
                             sap.ui.core.BusyIndicator.hide(0);

                        }else{
                            MessageBox.warning(that.getI18nText("txtErrorFacturaProduc"));
                             sap.ui.core.BusyIndicator.hide(0);
                        }
                       
                        
                    },
                    error: function () {
                        MessageBox.error("Ocurrio un error al obtener los datos");
                        sap.ui.core.BusyIndicator.hide(0);
                    }
                });


        },
        _onChangeMarca:function(oEvent){
            sap.ui.core.BusyIndicator.show();  
            var kSelected       =oEvent.getSource().getSelectedKey();
			var sSelected       =oEvent.getSource().getValue();
            var vista           = this.getView();
            var oModelDevolucion = vista.getModel("oModelDevolucion");
            var CodigoCanal      =oModelDevolucion.getProperty("/CodigoCanal");
			if (kSelected !== '') {
				oEvent.getSource().setValue(sSelected);

            var url="/sap/opu/odata/sap/ZOSSD_GW_TOMA_PEDIDO_SRV/ConsultaMarcaSet?$filter=Mvgr1 eq '"+ kSelected +"' and Vtweg eq '"+ CodigoCanal +"'";
            
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
                    oModelDevolucion.setProperty("/AddSelectProducto", datos);
                    oModelDevolucion.setProperty("/keyNombProduct", "");
                    sap.ui.core.BusyIndicator.hide(0);  
                },
                error: function () {
                    MessageBox.error("Ocurrio un error al obtener los datos");
                    sap.ui.core.BusyIndicator.hide(0); 
                }
            });
			}else{
				if(oEvent.getSource().getValue()){
					MessageBox.error( this.getI18nText("sErrorSelect"));
                    sap.ui.core.BusyIndicator.hide(0); 
				}
				oEvent.getSource().setValue("");
                sap.ui.core.BusyIndicator.hide(0); 
			}
        },
        _onChangeProductoBol:function(oEvent){//Cambio de Claudia por el momento 29/11/2022
            var kSelected=oEvent.getSource().getSelectedKey();
			var sSelected=oEvent.getSource().getValue();
			// if (kSelected !== '') {
			// 	oEvent.getSource().setValue(sSelected);
			// }else{
			// 	if(oEvent.getSource().getValue()){
			// 		MessageBox.error(this.getI18nText("sErrorSelect"));
			// 	}
			// 	oEvent.getSource().setValue("");
			// }  
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
            var that            = this;
            var vista           = this.getView();
            var oModelDevolucion = vista.getModel("oModelDevolucion");
            oModelDevolucion.setProperty("/KeyMotivoProd", "");
            this.AbrirProducto.close();
        },
        onDetalleDocFact:function(oEvent){
            var oView           = this.getView();
            var that            = this;
            var contCantidad    =0;
            var contTotal       =0;
            var contMonto       =0;
            var contadorMonto   =0;
            var oModelDevolucion = oView.getModel("oModelDevolucion");
            var oSelected = oEvent.getSource().getBindingContext("oModelDevolucion").getObject();
            var productPath      = oEvent.getSource().getBindingContext("oModelDevolucion").getPath();
            var selected        = oView.getModel("oModelDevolucion").getProperty(productPath);

            oModelDevolucion.setProperty("/textDataDocumento", selected.Referencia);
            oModelDevolucion.setProperty("/AddProductoDetail", selected.DetalleBuscaReceiptSet.results);
            

            selected.DetalleBuscaReceiptSet.results.forEach(function(items){
                items.sumTotalPos = (parseFloat(items.Impuesto) + parseFloat(items.ImpNeto)).toString();
                items.cantsoldev = "0";
                contTotal   += parseFloat(items.Cantidad);
                contMonto   += parseFloat(items.montonc);

                items.montonc = (parseFloat(items.cantsoldev) * parseFloat(items.sumTotalPos)).toString();
            });

            selected.DetalleBuscaReceiptSet.results.forEach(function (element) {
                contadorMonto += parseFloat(element.montonc); 
            });

            if (isNaN(contTotal) || contCantidad === "0") {
                contTotal = "0.00";
            }
            if (isNaN(contTotal) || contTotal === "0") {
                contMonto = "0.00";
            }
            if (isNaN(contTotal) || contMonto === "0") {
                contTotal = "0.00";
            }

            oModelDevolucion.setProperty("/totalCantidadDetProd", contCantidad.toString());
            oModelDevolucion.setProperty("/totalProduct",contTotal.toFixed(2));
            oModelDevolucion.setProperty("/totalMontoDetProduct", contMonto.toFixed(2));

            oModelDevolucion.setProperty("/ProductDetal", oSelected);

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
            var KeyMotivo   = oModelDevolucion.getProperty("/KeyMotivoProd");
            var AddProductoDetail = oModelDevolucion.getProperty("/AddProductoDetail");
            var arraypedido          =[];
            var keyCliente          =oModelDevolucion.getProperty("/keyCliente");
            var textDataDocumento   =oModelDevolucion.getProperty("/textDataDocumento");
            var oUser               =oModelDevolucion.getProperty("/oUser");

            if (KeyMotivo === undefined || KeyMotivo === "") {
                MessageBox.warning(that.getI18nText("txtMensajeDevolucion"));
                return;
            }

            //nuevos cambios
            
            var oPosDetailNotPermited = AddProductoDetail;
            var oPosDetailPermited = [];
            oPosDetailNotPermited.forEach(function(value, index){
                if(parseFloat(value.cantsoldev) > 0){
                    oPosDetailPermited.push(value);
                }
            })

            if(oPosDetailPermited.length === 0){
                MessageBox.warning(that.getI18nText("txtMensajeCantDev"));
                return;
            }

            var ProductDetal = oModelDevolucion.getProperty("/ProductDetal");
            var oClientSelect = oModelDevolucion.getProperty("/oClientSelect");
            var codVen = oModelDevolucion.getProperty("/codVen");

            var arraydetallePed = [];
            oPosDetailPermited.forEach(function (obj) {

                var detalleproducto = {
                    "Material": obj.Material,
                    "Cantidad": obj.cantsoldev,
                    "UnidadMed": obj.UnidMedida,
                    "Posicion": obj.Posicion
                }
                arraydetallePed.push(detalleproducto);
            });
        
            var datos = {
                "CodCli": oClientSelect.Kunnr,
                "Tipo": "ZPDC",
                "Canal": oClientSelect.Vtweg,
                "Referencia": ProductDetal.mostFactura,
                "NumDocMod": ProductDetal.CodFact,
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
                            async: true,
                            contentType: "application/json",
                            dataType: "json",
                            data: JSON.stringify(datos),
                        }).always(async function (data, status, response) {
                            
                          var datos = data.d.ResultPedidosDevSet.results[0];
                          oModelDevolucion.setProperty("/KeyAddUser", "");
                        tablaCliente02.removeSelections(true);
                        MessageBox.success(that.getI18nText("txtbtnBuscarCancelar")+" "+ datos.Pedido+" .", {
                            actions: [that.getI18nText("acceptText")],
                            emphasizedAction: "",
                            onClose: function (sAction) {
                                if (sAction === that.getI18nText("acceptText")) {
                                    that.getOwnerComponent().getRouter().navTo("Main");
                                }
                                oModelDevolucion.setProperty("/AddProductoDetail", []);
                                oModelDevolucion.setProperty("/KeyMotivo", "");
                                that.AbrirProducto.close();
                            }
                        });
                           
                    });
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
            var datosDetalle = oModelDevolucion.getProperty("/AddProductoDetail");
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
                oObject.montonc = (parseFloat(oObject.sumTotalPos)*parseFloat(sValueUsed)).toString();
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
            // oModelDevolucion.setProperty("/totalMontoDet",contaMontoNC.toFixed(2));

        },

        
    });
}, /* bExport= */ true);