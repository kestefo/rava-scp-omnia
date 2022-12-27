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

            createDataGeneralModel: function(){
                var oModel = {
                    filter: {
                        sDesde: "",
                        sHasta: "",
                        sCliente: "",
                        sEstado: "",
                    },
                    sNumPedido: "",
                    sStatus: "",
                    oSelectedCliente:{},
                    oMaterialSelectEan:{},
                    oMaterialSelectMasive:{
                        titulo: "",
                        oDataCargada: []
                    },
                    oMaterial:[],
                    Spots: {
                        items:[]
                    },
                    oPromotions:{
                        oComponent:{},
                        sCantBoni:"",
                        sCantProm:"",
                        oPromotion:[],
                        oTablaPrimerMoment: [],
                        oPromotionDetail:[],
                        oPromotionSelect: [],
				        sPromotionSelect: ""
                    }
                };
                return oModel;
            },

            JsonUserLoged: function () {
                var oModel = {
                    "schemas":[
                       "urn:ietf:params:scim:api:messages:2.0:ListResponse"
                    ],
                    "totalResults":1,
                    "itemsPerPage":100,
                    "Resources":[
                       {
                          "id":"P000004",
                          "userUuid":"5dc2c547-b645-4068-afca-9a53ccc98f34",
                          "userName":"OSMALTAMIRAN",
                          "displayName":"",
                          "userType":"employee",
                          "sourceSystem":"0",
                          "passwordStatus":"enabled",
                          "mailVerified":"TRUE",
                          "passwordPolicy":"https://accounts.sap.com/policy/passwords/sap/enterprise/1.0",
                          "passwordFailedLoginAttempts":"0",
                          "passwordLoginTime":"2022-11-13T14:33:39Z",
                          "loginTime":"2022-11-13T02:52:12Z",
                          "passwordSetTime":"2022-11-07T19:13:09Z",
                          "schemas":[
                             "urn:ietf:params:scim:schemas:core:2.0:User",
                             "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User",
                             "urn:sap:cloud:scim:schemas:extension:custom:2.0:User"
                          ],
                          "active":true,
                          "meta":{
                             "location":"https://aijy7d89l.accounts.ondemand.com/service/scim/Users/P000004",
                             "resourceType":"User",
                             "version":"1.0",
                             "created":"2022-11-07T19:11:20Z",
                             "lastModified":"2022-11-13T19:23:52Z"
                          },
                          "emails":[
                             {
                                "value":"liderdeproyecto1@omniasolution.com",
                                "primary":true
                             }
                          ],
                          "name":{
                             "givenName":"Kassiel",
                             "familyName":"Estefo"
                          },
                          "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User":{
                             
                          },
                          "urn:sap:cloud:scim:schemas:extension:custom:2.0:User":{
                             "attributes":[
                                {
                                   "name":"customAttribute1",
                                   "value":"1000000000"
                                }
                             ]
                          }
                       }
                    ]
                 }
                return oModel;
            },

            JsonEstado: function () {
                var oModel = [
                    {
                        "key": "01",
                        "desc": "Pedido"
                    },
                    {
                        "key": "02",
                        "desc": "Entrega"
                    },
                    {
                        "key": "03",
                        "desc": "Despachado"
                    },
                    {
                        "key": "04",
                        "desc": "Facturado"
                    }
                ]
                return oModel;
            },

            JsonMotivo: function () {
                var oModel = [
                    {
                        "key": "Z1",
                        "desc": "Por falta de Disponibilidad"
                    },
                    {
                        "key": "Z2",
                        "desc": "Cliente no conforme con precio"
                    },
                    {
                        "key": "Z3",
                        "desc": "Mal calculo en la cubicación"
                    },
                    {
                        "key": "Z4",
                        "desc": "Cambios solicitados por cliente"
                    },
                    {
                        "key": "Z5",
                        "desc": "Por fecha vencimiento Corta"
                    },
                    {
                        "key": "Z6",
                        "desc": "Cliente moroso"
                    },
                    {
                        "key": "Z7",
                        "desc": "Error al hacer pedido cliente"
                    },
                    {
                        "key": "Z8",
                        "desc": "Datos Logísticos No Actualizados"
                    },
                    {
                        "key": "Z9",
                        "desc": "Otros"
                    }
                ]
                return oModel;
            },

            JsonCliente: function () {
                var oModel = [
                    {
                        "key": "20604890617",
                        "desc": "DROGUERIA INRETAIL PHARMA - DROGUERIA INRETAIL PHARMA SAC"
                    },
                    {
                        "key": "20508565934",
                        "desc": "HIPERMERCADO TOTTUS SA.- HIPERMERCADO TOTTUS SA"
                    }
                ]
                return oModel;
            },
            
            JsonDescuentoContado: function () {
                var oModel = {
                    "cliente": "1000000495",
                    "desc": "10%"
                };
                
                return oModel;
            },
            JsonDescuentoNoContado: function () {
                var oModel = {
                    "desc": "0%"
                };
                
                return oModel;
            },
            JsonBonificacion: function () {
                var oModel = [
                    {
                        "Codfa":"C08 S21",
                        "Kbetr":"0.000",
                        "Labst":"38890.000",
                        "Maktg":"LIFE FOR MEN ACTIVADOR FRASCO 40ML",
                        "Matnr":"000000001200000225",
                        "Meins":"UND",
                        "Txtfa":"Activadores/Reveladores LIFE FOR MEN",
                        "Umrez":"61",
                        "Vtweg":"10"
                     }
                ]
                return oModel;
            },
            JsonDescuento: function () {
                var oModel = [
                    {
                        "Matnr": "000000001200000225",
                        "desc1": "10%",
                        "desc2": "15%"
                    }
                ]
                return oModel;
            },
            JsonPromocionActivo: function () {
                var oModel = {
                    "Z1": "X",
                    "Z2": "",
                    "Z3": "X",
                    "Z4": "",
                    "Z5": "X",
                    "Z6": "X",
                    "Z7": "",
                    "Z8": ""
                }
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