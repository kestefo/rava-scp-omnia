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
                        "key": "1",
                        "descripcion": "Primer Motivo"
                    },
                    {
                        "key": "2",
                        "descripcion": "Segundo Motivo"
                    }
                ]
                return oModel;
            },
            JsonMarcaProduct:function(){
             var oModel=[{
                 "Id":"01",
                "Descripcion":"Placenta Life - Radiant",
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