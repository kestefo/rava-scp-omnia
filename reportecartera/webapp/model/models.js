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
            JsonSelectGrafico : function () {
				var oData=[
                    {
                        "tipGraf" : "bar", 
                        "keyGraf" : "1", 
                        "nomGraf":"Barras"
                    },
                    {	"tipGraf" : "column",
                        "keyGraf" : "2", 
                        "nomGraf":"Columnas"
                    },
                    {
                        "tipGraf" : "donut", 
                        "keyGraf" : "3", 
                        "nomGraf":"Donut"
                    },
                ];
				return oData;
			},
            JsonReporteCliente: function () {
                var oModel = [
                    {
                        "fecha": "08/09/2022",
                        "pedido": "0121-399894",
                        "vencimiento": "17/01/2022",
                        "rucdni": "2060490607",
                        "razonsocial": "DROGUERIA INRETAIL PHARMA",
                        "importe": "564.60",
                        "boletafactura": "F024-1283",
                        "estado": "Cerrado",
                        "icon": "sap-icon://decline",
                        "estate": "None"
                    },
                    {
                        "fecha": "08/09/2022",
                        "pedido": "0121-399894",
                        "vencimiento": "17/01/2022",
                        "rucdni": "2060490607",
                        "razonsocial": "DROGUERIA INRETAIL PHARMA",
                        "importe": "564.60",
                        "boletafactura": "F024-1283",
                        "estado": "Cerrado",
                        "icon": "sap-icon://decline",
                        "estate": "None"
                    },
                    {
                        "fecha": "08/09/2022",
                        "pedido": "0121-399894",
                        "vencimiento": "17/01/2022",
                        "rucdni": "2060490607",
                        "razonsocial": "DROGUERIA INRETAIL PHARMA",
                        "importe": "5850.60",
                        "boletafactura": "F024-1283",
                        "estado": "Cerrado",
                        "icon": "sap-icon://decline",
                        "estate": "None"
                    }
                ]
                return oModel;
            },
            JsonReporteMarca: function () {
                var oModel = [
                    {
                        "marca": "Marca1",
                        "submarca": "SubMarca1",
                        "cantidad": "2",
                        "importe": "10.5"
                    },
                    {
                        "marca": "Marca1",
                        "submarca": "SubMarca1",
                        "cantidad": "3",
                        "importe": "20.8"
                    },
                    {
                        "marca": "Marca1",
                        "submarca": "SubMarca2",
                        "cantidad": "3",
                        "importe": "20.8"
                    },
                    {
                        "marca": "Marca2",
                        "submarca": "SubMarca1",
                        "cantidad": "3",
                        "importe": "18.2"
                    },
                    {
                        "marca": "Marca2",
                        "submarca": "SubMarca2",
                        "cantidad": "3",
                        "importe": "10.3"
                    },
                    {
                        "marca": "Marca2",
                        "submarca": "SubMarca3",
                        "cantidad": "4",
                        "importe": "15.8"
                    }
                ];
                return oModel;
            },
            JsonVizProperties: function(){
                var oModel = {
                    "plotArea": {
                        "dataLabel": {
                            "visible": true,
                            "hideWhenOverlap": true
                        }
                    },
                    "title":{ 
                        "text":'Prueba',
                        "visible": false
                    }
                };
                return oModel;
            }
    };
});