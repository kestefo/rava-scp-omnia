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
            JsonUserLoged: function () {
                var oModel = {
                    "name": "kestefo",
                    "nameDescription": "Kassiel Estefo Tume"
                }
                return oModel;
            },
            JsonPedidos: function () {
                var oModel = [
                    {
                        "pedido": "",
                        "fecha": "20/09/2022",
                        "vencimiento": "20/09/2022",
                        "tipodoc": "70599323",
                        "razonsocial": "SUPERMERCADOS PERUANOS SA",
                        "importe": "250,000,000",
                        "estado": "Pendiente Creación",
                        "icon": "sap-icon://pending",
                        "estate": "Warning"
                    },
                    {
                        "pedido": "O123-588",
                        "fecha": "20/09/2022",
                        "vencimiento": "21/09/2022",
                        "tipodoc": "70599325",
                        "razonsocial": "HIPERMERCADO TOTTUS ORIENTE SA",
                        "importe": "250,000,000",
                        "estado": "Creado",
                        "icon": "sap-icon://create",
                        "estate": "Success"
                    },
                    {
                        "pedido": "O123-589",
                        "fecha": "20/09/2022",
                        "vencimiento": "20/09/2022",
                        "tipodoc": "70599324",
                        "razonsocial": "CORPORACION BOTICAS PERU SA SA",
                        "importe": "250,000,000",
                        "estado": "Cerrado",
                        "icon": "sap-icon://decline",
                        "estate": "None"
                    }
                ]
                return oModel;
            },
            JsonFuerzaVenta: function () {
                var oModel = [
                    {
                        "key": "01",
                        "desc": "Placenta life"
                    }
                ]
                return oModel;
            },
            JsonPuntoVenta: function () {
                var oModel = [
                    {
                        "key": "01",
                        "desc": "Centro de Distribución de Villa"
                    }
                ]
                return oModel;
            },
            JsonDirecciones: function () {
                var oModel = [
                    {
                        "key": "01",
                        "desc": "Av. DEFENSOR DEL MORRO No. 1277 URB. PANTANOS DE VILLA [CHORRILLOS LIMA-LIMA-PERU]"
                    },
                    {
                        "key": "02",
                        "desc": "Av. DEFENSOR DEL MORRO No. 1278 URB. PANTANOS DE VILLA [CHORRILLOS LIMA-LIMA-PERU]"
                    }
                ]
                return oModel;
            },
            JsonCondPago: function () {
                var oModel = [
                    {
                        "key": "01",
                        "desc": "Pago a 90 días"
                    },
                    {
                        "key": "02",
                        "desc": "Pago a 60 días"
                    }
                ]
                return oModel;
            }
    };
});