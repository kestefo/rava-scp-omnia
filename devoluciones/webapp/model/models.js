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
                        "fecha": "2022-09-29",
                        "estado": "Pendiente",
                        "icon": "sap-icon://pending",
                        "estate": "Warning"
                    },
                    {
                        "nguia": "37645",
                        "cliente": "DROGUERIA INRETAIL PHARMA",
                        "fecha": "2022-09-29",
                        "estado": "Pendiente",
                        "icon": "sap-icon://pending",
                        "estate": "Warning"
                    },
                    {
                        "nguia": "37645",
                        "cliente": "DROGUERIA INRETAIL PHARMA",
                        "fecha": "2022-09-29",
                        "estado": "Pendiente",
                        "icon": "sap-icon://pending",
                        "estate": "Warning"
                    }
                ]
                return oModel;
            },
            JsonFactura: function () {
                var oModel = [
                    {
                        "documento": "0024-1315",
                        "fecha": "27-09-2022",
                        "lote": "893746381321",
                        "cantidad": "1",
                        "importe": "57752",
                        "tipo": "1"
                    },
                    {
                        "documento": "0024-1313",
                        "fecha": "30-09-2022",
                        "lote": "893746381321",
                        "cantidad": "1",
                        "importe": "65764",
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
            JsonFacturaDetail: function () {
                var oModel = [
                    {
                        "producto": "Placenta Life Rubio Oscuro",
                        "cantorig": "10",
                        "cantdev": "1",
                        "total": "941.00",
                        "cantsoldev": "0",
                        "montonc": "564.60"
                    },
                    {
                        "producto": "Placenta Life Rubio Oscuro",
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