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
            },
            JsonProductos: function () {
                var oModel = [
                    {
                        "producto": "Conditioner Placenta Life Hydra Macadamia Frasco 1lt",
                        "cantidad": "6",
                        "tipo": "L",
                        "total": "151.16",
                        "descuentos": "0.00% 0.00%",
                        "descuentosVolumen": "0.00%"
                    },
                    {
                        "producto": "Conditioner Life Radiant BB-Tox Treatment",
                        "cantidad": "6",
                        "tipo": "L",
                        "total": "151.16",
                        "descuentos": "0.00% 0.00%",
                        "descuentosVolumen": ""
                    },
                    {
                        "producto": "MALETA DE CUERINA COLOR NEGRO CON LOGO EN PLACA",
                        "cantidad": "3",
                        "tipo": "N",
                        "total": "100.00",
                        "descuentos": "0.00% ",
                        "descuentosVolumen": "0.00%"
                    }
                ]
                return oModel;
            },
            JsonFamilia: function () {
                var oModel = [
                    {
                        "key": "01",
                        "desc": "-Seleccione-"
                    },
                    {
                        "key": "02",
                        "desc": "Acondicionador Placenta Life Be Natural"
                    },
                    {
                        "key": "03",
                        "desc": "Acondicionador Placenta Life Saloon"
                    },
                    {
                        "key": "04",
                        "desc": "Acondicionador Tonno Plus Tonno Plus"
                    }
                ]
                return oModel;
            },
            JsonProductoFamilia: function () {
                var oModel = [
                    {
                        "producto": "Plife Radiant Conditioner Nutri - Soft Galonera 3.71l",
                        "precio": "49.07",
                        "stock": "329",
                        "unicaja": "4",
                        "cantidad": "0",
                        "state": "Information",
                        "icon": "sap-icon://outbox"
                    },
                    {
                        "producto": "Plife Radiant Deco Extreme Pote 500mg",
                        "precio": "44.07",
                        "stock": "3,629",
                        "unicaja": "6",
                        "cantidad": "0",
                        "state": "Information",
                        "icon": "sap-icon://outbox"
                    },
                    {
                        "producto": "Plife Radiant Shampo Nutri - Soft Galonera 3.71l",
                        "precio": "49.07",
                        "stock": "505",
                        "unicaja": "4",
                        "cantidad": "0",
                        "state": "Information",
                        "icon": "sap-icon://outbox"
                    }
                ]
                return oModel;
            },
            
            JsonPromocion: function () {
                var oModel = [
                    {
                        "codigo": "45633",
                        "descripcion": "Placenta Life Rubio Oscuro",
                        "cantidad": "2"
                    },
                    {
                        "codigo": "45634",
                        "descripcion": "Placenta Life Keratina",
                        "cantidad": "1"
                    },
                    {
                        "codigo": "45635",
                        "descripcion": "Placenta Life Control Caída",
                        "cantidad": "2"
                    }
                ]
                return oModel;
            },
            JsonPromocionDetail: function () {
                var oModel = [
                    {
                        "nombre": "Placenta Life Control Caída",
                        "stock": "123",
                        "precio": "63.55",
                        "cantprom": "1"
                    },
                    {
                        "nombre": "Placenta Life Control Caída",
                        "stock": "327",
                        "precio": "64.99",
                        "cantprom": "1"
                    }
                ]
                return oModel;
            },
    };
});