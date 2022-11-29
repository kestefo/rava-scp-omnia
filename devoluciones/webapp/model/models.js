sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },
            JsonUser: function () {
                var oModel = [
                    {
                        "RUC": "20604890617",
                        "Descripcion": "DROGUERIA INRETAIL PHARMA - DROGUERIA INRETAIL PHARMA SAC"
                    },
                    {
                        "RUC": "20508565934",
                        "Descripcion": "HIPERMERCADO TOTTUS SA.- HIPERMERCADO TOTTUS SA"
                    }
                ]
                return oModel;
            },
            JsonDevolucionesCreados: function(){
                var oModel = [
                    {
                        "nguia": "37645",
                        "cliente": "DROGUERIA INRETAIL PHARMA",
                        "RUC":"10455685212",
                        "fecha": "2022-09-29",
                        "Ref.Factura":"0024-627162",
                        "Comprobante":"BC024-12154",
                        "Monto":"283.00",
                        "FechaEmi":"2022-09-29",
                        "Lote":"982731",
                        "Motivo":"Producto dañado",
                        "Detalle":"Detalle",
                        "estado": "Facturado",
                        "icon": "sap-icon://pending",
                        "estate": "Warning",
                        "NroCredito":"982731",
                        "Motivos":"Motivo 1"
                    },
                    {
                        "nguia": "37645",
                        "cliente": "DROGUERIA INRETAIL PHARMA",
                        "fecha": "2022-09-29",
                        "RUC":"12345678",
                        "Ref.Factura":"0024-627162",
                        "Comprobante":"",
                        "Monto":"283.00",
                        "FechaEmi":"2022-09-29",
                        "Detalle":"Detalle",
                        "Lote":"982731",
                        "Motivo":"Producto dañado",
                        "estado": "Pedido",
                        "icon": "sap-icon://pending",
                        "estate": "Warning",
                        "NroCredito":"982731",
                        "Motivos":"Motivo 1"
                    },
                    {
                        "nguia": "37645",
                        "cliente": "DROGUERIA INRETAIL PHARMA",
                        "RUC":"10455685219",
                        "fecha": "2022-09-29",
                        "Ref.Factura":"0024-627162",
                        "Comprobante":"",
                        "Monto":"283.00",
                        "FechaEmi":"2022-09-29",
                        "Detalle":"Detalle",
                        "Lote":"982731",
                        "Motivo":"Producto dañado",
                        "estado": "Recibido",
                        "icon": "sap-icon://pending",
                        "estate": "Warning",
                        "NroCredito":"982731",
                        "Motivos":"Motivo 1"
                    }
                ]
                return oModel;
            },
            jsonDetalleDevolucion:function(){
                var oModel = [
                    {
                        "Producto":"Placenta Life Rubio",
                        "Lote": "274659",
                        "Cantidad":"6",
                        "Monto":"550.00"
                        
                    },
                    {
                        "Producto":"Placenta Life Rubio",
                        "Lote": "274659",
                        "Cantidad":"6",
                        "Monto":"550.00"
                        
                    },{
                        "Producto":"Placenta Life Rubio",
                        "Lote": "274659",
                        "Cantidad":"6",
                        "Monto":"550.00"
                        
                    },{
                        "Producto":"Placenta Life Rubio",
                        "Lote": "274659",
                        "Cantidad":"6",
                        "Monto":"550.00"
                        
                    },{
                        "Producto":"Placenta Life Rubio",
                        "Lote": "274659",
                        "Cantidad":"6",
                        "Monto":"550.00"
                        
                    }
                    
                ]
                return oModel;

            },
            jsonFiltroClient:function(){
                var oModel = [
                    {
                        "id":"01",
                        "cliente": "DROGUERIA INRETAIL PHARMA",
                        
                    },
                    {
                        "id":"02",
                        "cliente": "DROGUERIA INRETAIL PHARMA",
                        
                    }
                    
                ]
                return oModel;

            },
            JsonFactura: function () {
                var oModel = [
                    {
                        "Cliente":"DROGUERIA INRETAIL PHARMA",
                        "documento": "FC0024-1315",
                        "fecha": "27-09-2022",
                        "lote": "893746381321",
                        "cantidad": "1",
                        "importe": "71.90",
                        "tipo": "1"
                    },
                    {
                        "Cliente":"DROGUERIA INRETAIL PHARMA",
                        "documento": "BV0024-1313",
                        "fecha": "30-09-2022",
                        "lote": "893746381321",
                        "cantidad": "1",
                        "importe": "80.90",
                        "tipo": "1"
                    },
                ]
                return oModel;
            },
            JsonMotivo: function () {
                var oModel = [
                    {
                     "key": "001",
                     "descripcion": "Visita del representante"
                    },
                    {
                     "key": "002",
                     "descripcion": "Contacto en feria"
                    },
                    {
                     "key": "003",
                     "descripcion": "Publicidad televisiva"
                    },
                    {
                     "key": "004",
                     "descripcion": "Recomendación de cliente"
                    },
                    {
                     "key": "005",
                     "descripcion": "Anuncio de prensa"
                    },
                    {
                     "key": "006",
                     "descripcion": "Precio ventajoso"
                    },
                    {
                     "key": "007",
                     "descripcion": "Entrega rapida"
                    },
                    {
                     "key": "008",
                     "descripcion": "Buen servicio"
                    },
                    {
                     "key": "009",
                     "descripcion": "Devolución acelerada"
                    },
                    {
                     "key": "100",
                     "descripcion": "Diferencia de precio: precio ant. alto"
                    },
                    {
                     "key": "101",
                     "descripcion": "Mala calidad"
                    },
                    {
                     "key": "102",
                     "descripcion": "Daños de transporte"
                    },
                    {
                     "key": "103",
                     "descripcion": "Diferencia de cantidad"
                    },
                    {
                     "key": "104",
                     "descripcion": "Mercadería deteriorada"
                    },
                    {
                     "key": "105",
                     "descripcion": "Muestra gratis"
                    },
                    {
                     "key": "200",
                     "descripcion": "Diferencia de precio: Precio ant. bajo"
                    },
                    {
                     "key": "300",
                     "descripcion": "Petición de anticipo"
                    },
                    {
                     "key": "C01",
                     "descripcion": "N\/C Anulación por robo"
                    },
                    {
                     "key": "C02",
                     "descripcion": "N\/C por error de personal"
                    },
                    {
                     "key": "C03",
                     "descripcion": "N\/C por error de cliente"
                    },
                    {
                     "key": "C04",
                     "descripcion": "N\/C por error de cobro"
                    },
                    {
                     "key": "C05",
                     "descripcion": "N\/C Descuento al contado terceros"
                    },
                    {
                     "key": "C06",
                     "descripcion": "N\/C Descuento especial Rebate"
                    },
                    {
                     "key": "C07",
                     "descripcion": "N\/C Descuento Gerencial"
                    },
                    {
                     "key": "C08",
                     "descripcion": "N\/C Cliente ausente"
                    },
                    {
                     "key": "C09",
                     "descripcion": "N\/C Error vendedor (Cliente no hizo ped)"
                    },
                    {
                     "key": "C10",
                     "descripcion": "N\/C Devol por incumplimiento de transpor"
                    },
                    {
                     "key": "C11",
                     "descripcion": "N\/C Reclamo por despacho error de almac."
                    },
                    {
                     "key": "C12",
                     "descripcion": "N\/C Devolución total concepto terceros"
                    },
                    {
                     "key": "C13",
                     "descripcion": "N\/C Por devolución de dinero"
                    },
                    {
                     "key": "C14",
                     "descripcion": "N\/C Por devolución de mercadería"
                    },
                    {
                     "key": "C15",
                     "descripcion": "N\/C Cliente moroso (problemas de pago)"
                    },
                    {
                     "key": "C16",
                     "descripcion": "N\/C Ciente no conforme con precio"
                    },
                    {
                     "key": "C17",
                     "descripcion": "N\/C Devolución por vencimiento"
                    },
                    {
                     "key": "C18",
                     "descripcion": "N\/C Error al hacer pedido (cliente)"
                    },
                    {
                     "key": "C19",
                     "descripcion": "N\/C Error del vendedor al digitar pedido"
                    },
                    {
                     "key": "C20",
                     "descripcion": "N\/C Fallas técnicas en equipo"
                    },
                    {
                     "key": "C21",
                     "descripcion": "N\/C Rotación de productos"
                    },
                    {
                     "key": "C22",
                     "descripcion": "N\/C por defecto del producto"
                    },
                    {
                     "key": "C23",
                     "descripcion": "N\/C por cambio de producto"
                    },
                    {
                     "key": "C24",
                     "descripcion": "N\/C Por bonificación especial"
                    },
                    {
                     "key": "C25",
                     "descripcion": "N\/C Diferencia de precios - terceros"
                    },
                    {
                     "key": "C26",
                     "descripcion": "N\/C por devolución de dinero"
                    },
                    {
                     "key": "C27",
                     "descripcion": "N\/C Datos logísticos no actualizados"
                    },
                    {
                     "key": "C28",
                     "descripcion": "N\/C Devolución documentaria"
                    },
                    {
                     "key": "C29",
                     "descripcion": "N\/C Devolución por acuerdo comercial"
                    },
                    {
                     "key": "C30",
                     "descripcion": "N\/C Dev. Por empaque en mal estado o ina"
                    },
                    {
                     "key": "C31",
                     "descripcion": "N\/C Reclamo por calidad"
                    },
                    {
                     "key": "C32",
                     "descripcion": "N\/C Pesquisa"
                    },
                    {
                     "key": "C33",
                     "descripcion": "N\/C Recall"
                    },
                    {
                     "key": "C34",
                     "descripcion": "N\/C Por siniestralidad"
                    },
                    {
                     "key": "C35",
                     "descripcion": "N\/C Faltante de mercadería"
                    },
                    {
                     "key": "C36",
                     "descripcion": "N\/C Exportac. Empaque en mal estado o in"
                    },
                    {
                     "key": "C37",
                     "descripcion": "N\/C Gastos administrativos"
                    },
                    {
                     "key": "C38",
                     "descripcion": "N\/C Diferencia de precios"
                    },
                    {
                     "key": "D01",
                     "descripcion": "N\/D Intereses deuda vencida"
                    },
                    {
                     "key": "D02",
                     "descripcion": "N\/D Intereses por letras vencidas"
                    },
                    {
                     "key": "D03",
                     "descripcion": "N\/D Gastos Administrativos y bancarios"
                    },
                    {
                     "key": "D04",
                     "descripcion": "N\/D Gastos de protestos de letras"
                    },
                    {
                     "key": "D05",
                     "descripcion": "N\/D Regularización de condición de pago"
                    },
                    {
                     "key": "D06",
                     "descripcion": "N\/D Por Siniestralidad"
                    },
                    {
                     "key": "D07",
                     "descripcion": "N\/D Por diferencia de precios"
                    },
                    {
                     "key": "D08",
                     "descripcion": "N\/D Corrección de documento"
                    },
                    {
                     "key": "D09",
                     "descripcion": "N\/D Penalidades"
                    },
                    {
                     "key": "D10",
                     "descripcion": "N\/D Gastos administrativos bancarios"
                    },
                    {
                     "key": "D11",
                     "descripcion": "N\/D Intereses deuda vencida"
                    },
                    {
                     "key": "D12",
                     "descripcion": "N\/D Penalidades"
                    },
                    {
                     "key": "D13",
                     "descripcion": "N\/D Exportac. Por diferencia de precios"
                    },
                    {
                     "key": "D14",
                     "descripcion": "N\/D Regularización de condición de pago"
                    },
                    {
                     "key": "EDI",
                     "descripcion": "Procedimiento abonos"
                    },
                    {
                     "key": "JDR",
                     "descripcion": "DRM Recl.: Gar.precio, ship&deb., reemb."
                    },
                    {
                     "key": "P01",
                     "descripcion": "Venta Nacional"
                    },
                    {
                     "key": "P02",
                     "descripcion": "Exportación de bienes"
                    },
                    {
                     "key": "P03",
                     "descripcion": "Operación Sujeta a Detracción"
                    },
                    {
                     "key": "P04",
                     "descripcion": "Operación Sujeta a Percepción"
                    },
                    {
                     "key": "PNS",
                     "descripcion": "S2K: Consulta de status NP"
                    },
                    {
                     "key": "POS",
                     "descripcion": "S2K: Consulta de status pedido"
                    },
                    {
                     "key": "QBI",
                     "descripcion": "SBWAP: Compens.diferencias (ctd.\/valor)"
                    },
                    {
                     "key": "QOI",
                     "descripcion": "SBWAP: Partidas ab.nuevas (ctd.\/val.)"
                    },
                    {
                     "key": "TG1",
                     "descripcion": "Transferencia gratuita nacional boleta"
                    },
                    {
                     "key": "TG2",
                     "descripcion": "Transferencia gratuita nacional factura"
                    },
                    {
                     "key": "TG3",
                     "descripcion": "Transferencia gratuita exterior"
                    },
                    {
                     "key": "VBI",
                     "descripcion": "SBWAP: Compensación diferencias (valor)"
                    },
                    {
                     "key": "VOI",
                     "descripcion": "SBWAP: Partidas abiertas nuevas (valor)"
                    }
                ]
                return oModel;
            },
            JsonMarcaProduct:function(){
             var oModel=[{
                 "Id":"01",
                "Descripcion":"AMAZONIC",
               "NombreProducto":"Acconditioner Placenta"
                
             },{
                "Id":"02",
               "Descripcion":"BABYLISS",
               "NombreProducto":"Acconditioner Placenta"
               
            },{
                "Id":"02",
               "Descripcion":"BE NATURAL",
               "NombreProducto":"Acconditioner Placenta"
               
            },{
                "Id":"02",
               "Descripcion":"BEI BEI HORSE",
               "NombreProducto":"Acconditioner Placenta"
               
            },{
                "Id":"02",
               "Descripcion":"BELESTA",
               "NombreProducto":"Acconditioner Placenta"
               
            }];   

             return oModel;
            },
            JsonFacturaDetail: function () {
                var oModel = [
                    {
                        "producto": "Placenta Life Rubio Oscuro",
                        "Lote":"274659",
                        "cantorig": "10",
                        "cantdev": "1",
                        "total": "941.00",
                        "cantsoldev": "0",
                        "montonc": "564.60"
                    },
                    {
                        "producto": "Placenta Life Rubio Oscuro",
                        "Lote":"274660",
                        "cantorig": "12",
                        "cantdev": "1",
                        "total": "941.00",
                        "cantsoldev": "0",
                        "montonc": "564.60"
                    }
                ]
                return oModel;
            },
    };
});