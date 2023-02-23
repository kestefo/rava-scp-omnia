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
            JsonDevolucionesCreados: function () {
                var oModel = [
                    {
                        "nguia": "37645",
                        "cliente": "DROGUERIA INRETAIL PHARMA",
                        "RUC": "10455685212",
                        "fecha": "2022-09-29",
                        "Ref.Factura": "0024-627162",
                        "Comprobante": "BC024-12154",
                        "Monto": "283.00",
                        "FechaEmi": "2022-09-29",
                        "Lote": "982731",
                        "Motivo": "Producto dañado",
                        "Detalle": "Detalle",
                        "estado": "Facturado",
                        "icon": "sap-icon://pending",
                        "estate": "Warning",
                        "NroCredito": "982731",
                        "Motivos": "Motivo 1"
                    },
                    {
                        "nguia": "37645",
                        "cliente": "DROGUERIA INRETAIL PHARMA",
                        "fecha": "2022-09-29",
                        "RUC": "12345678",
                        "Ref.Factura": "0024-627162",
                        "Comprobante": "",
                        "Monto": "283.00",
                        "FechaEmi": "2022-09-29",
                        "Detalle": "Detalle",
                        "Lote": "982731",
                        "Motivo": "Producto dañado",
                        "estado": "Pedido",
                        "icon": "sap-icon://pending",
                        "estate": "Warning",
                        "NroCredito": "982731",
                        "Motivos": "Motivo 1"
                    },
                    {
                        "nguia": "37645",
                        "cliente": "DROGUERIA INRETAIL PHARMA",
                        "RUC": "10455685219",
                        "fecha": "2022-09-29",
                        "Ref.Factura": "0024-627162",
                        "Comprobante": "",
                        "Monto": "283.00",
                        "FechaEmi": "2022-09-29",
                        "Detalle": "Detalle",
                        "Lote": "982731",
                        "Motivo": "Producto dañado",
                        "estado": "Recibido",
                        "icon": "sap-icon://pending",
                        "estate": "Warning",
                        "NroCredito": "982731",
                        "Motivos": "Motivo 1"
                    }
                ]
                return oModel;
            },
            jsonDetalleDevolucion: function () {
                var oModel = [
                    {
                        "Producto": "Placenta Life Rubio",
                        "Lote": "274659",
                        "Cantidad": "6",
                        "Monto": "550.00"

                    },
                    {
                        "Producto": "Placenta Life Rubio",
                        "Lote": "274659",
                        "Cantidad": "6",
                        "Monto": "550.00"

                    }, {
                        "Producto": "Placenta Life Rubio",
                        "Lote": "274659",
                        "Cantidad": "6",
                        "Monto": "550.00"

                    }, {
                        "Producto": "Placenta Life Rubio",
                        "Lote": "274659",
                        "Cantidad": "6",
                        "Monto": "550.00"

                    }, {
                        "Producto": "Placenta Life Rubio",
                        "Lote": "274659",
                        "Cantidad": "6",
                        "Monto": "550.00"

                    }

                ]
                return oModel;

            },
            jsonFiltroClient: function () {
                var oModel = [
                    {
                        "id": "01",
                        "cliente": "DROGUERIA INRETAIL PHARMA",

                    },
                    {
                        "id": "02",
                        "cliente": "DROGUERIA INRETAIL PHARMA",

                    }

                ]
                return oModel;

            },
            JsonFactura: function () {
                var oModel = [
                    {
                        "Cliente": "DROGUERIA INRETAIL PHARMA",
                        "documento": "FC0024-1315",
                        "fecha": "27-09-2022",
                        "lote": "893746381321",
                        "cantidad": "1",
                        "importe": "71.90",
                        "tipo": "1"
                    },
                    {
                        "Cliente": "DROGUERIA INRETAIL PHARMA",
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
                    }, {
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
                    }
                ]
                return oModel;
            },
            JsonMarcaProduct: function () {
                var oModel = [{
                    "Id": "M02",
                    "Descripcion": "BABYLISS"


                }, {
                    "Id": "M03",
                    "Descripcion": "BE NATURAL"


                }, {
                    "Id": "M04",
                    "Descripcion": "BEI BEI HORSE"


                },

                {
                    "Id": "M05",
                    "Descripcion": "BELESTA"


                }, {
                    "Id": "M06",
                    "Descripcion": "CORPORACIÓN LIFE"


                }, {
                    "Id": "M07",
                    "Descripcion": "DORCO"


                }, {
                    "Id": "M08",
                    "Descripcion": "HANNA CABALL"


                }, {
                    "Id": "M09",
                    "Descripcion": "HUSH"


                }, {
                    "Id": "M10",
                    "Descripcion": "KERATIMASK"


                }, {
                    "Id": "M11",
                    "Descripcion": "KERATIMASK PROFESIONAL"


                }, {
                    "Id": "M12",
                    "Descripcion": "KINETICS"


                }, {
                    "Id": "M13",
                    "Descripcion": "KOKETA"


                }, {
                    "Id": "M14",
                    "Descripcion": "LIFE FOR MEN"


                }, {
                    "Id": "M15",
                    "Descripcion": "MR. CLASSIC"


                }, {
                    "Id": "M16",
                    "Descripcion": "NEW YOU"


                }, {
                    "Id": "M17",
                    "Descripcion": "PLACENTA LIFE"


                }, {
                    "Id": "M18",
                    "Descripcion": "RADIANT"


                }, {
                    "Id": "M19",
                    "Descripcion": "SMOLL"


                }, {
                    "Id": "M20",
                    "Descripcion": "TONNO"


                }, {
                    "Id": "M21",
                    "Descripcion": "TONNO PLUS"


                }, {
                    "Id": "M22",
                    "Descripcion": "NEW U"


                }, {
                    "Id": "M23",
                    "Descripcion": "DERMALIFE"


                }, {
                    "Id": "M24",
                    "Descripcion": "FLOPPY"


                }, {
                    "Id": "M25",
                    "Descripcion": "INSPIRATION"


                }, {
                    "Id": "M26",
                    "Descripcion": "OMYGAD"


                }, {
                    "Id": "M27",
                    "Descripcion": "STONE HEAD "

                }];

                return oModel;
            },

            jsonClientesPrueba: function () {
                var oModel = [
                    {
                        "Kunnr": "1000000021"
                    },
                    {
                        "Kunnr": "1000000024"

                    }, {
                        "Kunnr": "1000000034"

                    },
                    {
                        "Kunnr": "1000000063"

                    }, {
                        "Kunnr": "1000000077"
                    },
                    {
                        "Kunnr": "1000000097"

                    }, {
                        "Kunnr": "1000000101"

                    },
                    {
                        "Kunnr": "1000000105"

                    }, {
                        "Kunnr": "1000000119"
                    },
                    {
                        "Kunnr": "1000000126"

                    }, {
                        "Kunnr": "1000000137"

                    },
                    {
                        "Kunnr": "1000000157"

                    }, {
                        "Kunnr": "1000000159"
                    }, {
                        "Kunnr": "1000000181"
                    }, {
                        "Kunnr": "1000000197"
                    }, {
                        "Kunnr": "1000000199"
                    }, {
                        "Kunnr": "1000000200"
                    }, {
                        "Kunnr": "1000000206"
                    }, {
                        "Kunnr": "1000000207"
                    }, {
                        "Kunnr": "1000000418"
                    }, {
                        "Kunnr": "1000000651"
                    }, {
                        "Kunnr": "1000000653"
                    }, {
                        "Kunnr": "1000000658"
                    }, {
                        "Kunnr": "1000000659"
                    }, {
                        "Kunnr": "1000000660"
                    }, { "Kunnr": "1000000661" }, { "Kunnr": "1000000663" }, { "Kunnr": "1000000666" },
                    { "Kunnr": "1000000667" }, { "Kunnr": "1000000669" }, { "Kunnr": "1000000671" },
                    { "Kunnr": "1000000673" }, { "Kunnr": "1000000674" }, { "Kunnr": "1000000675" }, { "Kunnr": "1000000676" },
                    { "Kunnr": "1000000677" }, { "Kunnr": "1000000678" }, { "Kunnr": "1000000679" },
                    { "Kunnr": "1000000680" }, { "Kunnr": "1000000685" }, { "Kunnr": "1000000690" }, { "Kunnr": "1000000693" }, { "Kunnr": "1000000694" },
                    { "Kunnr": "1000000695" }, { "Kunnr": "1000000696" }, { "Kunnr": "1000000699" }, { "Kunnr": "1000000700" }, { "Kunnr": "1000000701" },
                    { "Kunnr": "1000000702" }, { "Kunnr": "1000000703" }, { "Kunnr": "1000000704" }, { "Kunnr": "1000000705" }, { "Kunnr": "1000000707" },
                    { "Kunnr": "1000000708" }, { "Kunnr": "1000000709" }, { "Kunnr": "1000000710" }, { "Kunnr": "1000000711" }, { "Kunnr": "1000000712" }, { "Kunnr": "1000000713" },
                    { "Kunnr": "1000000714" },
                    { "Kunnr": "1000000715" }, { "Kunnr": "1000000718" }, { "Kunnr": "1000000720" }, { "Kunnr": "1000000721" }, { "Kunnr": "1000000867" },
                    { "Kunnr": "1000000868" }, { "Kunnr": "1000000870" }, { "Kunnr": "1000000871" }, { "Kunnr": "1000000872" }, { "Kunnr": "1000000873" }, { "Kunnr": "1000000874" }
                    , { "Kunnr": "1000000875" }, { "Kunnr": "1000000876" }, { "Kunnr": "1000000879" }, { "Kunnr": "1000000882" },
                    { "Kunnr": "1000000886" }, { "Kunnr": "1000000887" }, { "Kunnr": "1000000888" }, { "Kunnr": "1000000889" }, { "Kunnr": "1000000890" },
                    { "Kunnr": "1000000897" }, { "Kunnr": "1000000898" }, { "Kunnr": "1000000901" }
                    , { "Kunnr": "1000000903" }, { "Kunnr": "1000000905" }, { "Kunnr": "1000000906" }, { "Kunnr": "1000000907" }, { "Kunnr": "1000000911" },
                    { "Kunnr": "1000000912" }, { "Kunnr": "1000000913" }, { "Kunnr": "1000000914" }, { "Kunnr": "1000000917" }, { "Kunnr": "1000000918" },
                    { "Kunnr": "1000000919" }, { "Kunnr": "1000000920" }, { "Kunnr": "1000000921" }, { "Kunnr": "1000000922" }, { "Kunnr": "1000000923" }, { "Kunnr": "1000000924" },
                    { "Kunnr": "1000000925" }, { "Kunnr": "1000000926" }, { "Kunnr": "1000000928" }, { "Kunnr": "1000000929" }
                    , { "Kunnr": "1000000930" }, { "Kunnr": "1000000931" }, { "Kunnr": "1000000932" }, { "Kunnr": "1000000933" }, { "Kunnr": "1000000934" }, { "Kunnr": "1000000937" },
                    { "Kunnr": "1000000938" }, { "Kunnr": "1000000939" }, { "Kunnr": "1000000940" }, { "Kunnr": "1000000941" }, { "Kunnr": "1000000943" }, { "Kunnr": "1000000944" }, { "Kunnr": "1000000950" },
                    { "Kunnr": "1000000951" }, { "Kunnr": "1000000957" }, { "Kunnr": "1000000959" }, { "Kunnr": "1000000960" }, { "Kunnr": "1000000961" }, { "Kunnr": "1000000962" },
                    { "Kunnr": "1000000963" }, { "Kunnr": "1000000969" }, { "Kunnr": "1000000977" }, { "Kunnr": "1000000979" }, { "Kunnr": "1000000980" }, { "Kunnr": "1000000983" }
                    , { "Kunnr": "1000000986" }, { "Kunnr": "1000000987" }, { "Kunnr": "1000000988" }, { "Kunnr": "1000000989" }, { "Kunnr": "1000000990" }, { "Kunnr": "1000000991" }, { "Kunnr": "1000000992" }
                    , { "Kunnr": "1000000994" }, { "Kunnr": "1000000995" }, { "Kunnr": "1000000998" }, { "Kunnr": "1000001001" }, { "Kunnr": "1000001002" }, { "Kunnr": "1000001018" }, { "Kunnr": "1000001019" },
                    { "Kunnr": "1000001020" }, { "Kunnr": "1000001022" }, { "Kunnr": "1000001023" }, { "Kunnr": "1000001024" }, { "Kunnr": "1000001025" }, { "Kunnr": "1000001026" }, { "Kunnr": "1000001028" },
                    { "Kunnr": "1000001029" }, { "Kunnr": "1000001030" }, { "Kunnr": "1000001031" }, { "Kunnr": "1000001032" }, { "Kunnr": "1000001033" }, { "Kunnr": "1000001035" }, { "Kunnr": "1000001036" },
                    { "Kunnr": "1000001038" }, { "Kunnr": "1000001039" }, { "Kunnr": "1000001041" }, { "Kunnr": "1000001043" }, { "Kunnr": "1000001044" }, { "Kunnr": "1000001045" },
                    { "Kunnr": "1000001053" }, { "Kunnr": "1000001058" }, { "Kunnr": "1000001065" }, { "Kunnr": "1000001066" }, { "Kunnr": "1000001069" }
                    , { "Kunnr": "1000001070" }, { "Kunnr": "1000001075" }, { "Kunnr": "1000001076" }, { "Kunnr": "1000001187" }, { "Kunnr": "1000001188" }, { "Kunnr": "1000001189" },
                    { "Kunnr": "1000001190" }, { "Kunnr": "1000001191" }
                    , { "Kunnr": "1000001193" }, { "Kunnr": "1000001195" }, { "Kunnr": "1000001196" }, { "Kunnr": "1000001197" }, { "Kunnr": "1000001198" },
                    { "Kunnr": "1000001199" },
                    { "Kunnr": "1000001200" }, { "Kunnr": "1000001201" }, { "Kunnr": "1000001202" }, { "Kunnr": "1000001203" }, { "Kunnr": "1000001204" },
                    { "Kunnr": "1000001205" }, { "Kunnr": "1000001206" }, { "Kunnr": "1000001207" }, { "Kunnr": "1000001208" },
                    { "Kunnr": "1000001209" }, { "Kunnr": "1000001210" }, { "Kunnr": "1000001211" }, { "Kunnr": "1000001212" }, { "Kunnr": "1000001214" },
                    { "Kunnr": "1000001215" }, { "Kunnr": "1000001216" }, { "Kunnr": "1000001218" }, { "Kunnr": "1000001221" }, { "Kunnr": "1000001222" },
                    { "Kunnr": "1000001223" }, { "Kunnr": "1000001224" }, { "Kunnr": "1000001225" }, { "Kunnr": "1000001226" }, { "Kunnr": "1000001227" }, { "Kunnr": "1000001228" }, { "Kunnr": "1000001229" }
                    , { "Kunnr": "1000001230" }, { "Kunnr": "1000001231" }, { "Kunnr": "1000001232" }, { "Kunnr": "1000001233" }, { "Kunnr": "1000001234" },
                    { "Kunnr": "1000001235" }, { "Kunnr": "1000001236" }, { "Kunnr": "1000001237" }, { "Kunnr": "1000001238" }, { "Kunnr": "1000001240" }, { "Kunnr": "1000001241" },
                    { "Kunnr": "1000001243" }, { "Kunnr": "1000001244" }, { "Kunnr": "1000001245" }, { "Kunnr": "1000001246" }, { "Kunnr": "1000001247" },
                    { "Kunnr": "1000001248" }, { "Kunnr": "1000001250" }, { "Kunnr": "1000001252" }, { "Kunnr": "1000001253" }, { "Kunnr": "1000001254" },
                    { "Kunnr": "1000001255" },
                    { "Kunnr": "1000001256" },
                    { "Kunnr": "1000001257" },
                    { "Kunnr": "1000001258" },
                    { "Kunnr": "1000001259" },
                    { "Kunnr": "1000001260" },
                    { "Kunnr": "1000001261" },
                    { "Kunnr": "1000001262" },
                    { "Kunnr": "1000001263" },
                    { "Kunnr": "1000001264" },
                    { "Kunnr": "1000001267" },
                    { "Kunnr": "1000001268" },
                    { "Kunnr": "1000001269" },
                    { "Kunnr": "1000001270" },
                    { "Kunnr": "1000001272" },
                    { "Kunnr": "1000001276" },
                    { "Kunnr": "1000001278" },
                    { "Kunnr": "1000001281" },
                    { "Kunnr": "1000001282" },
                    { "Kunnr": "1000001283" },
                    { "Kunnr": "1000001285" },
                    { "Kunnr": "1000001288" },
                    { "Kunnr": "1000001336" },
                    { "Kunnr": "1000001391" },
                    { "Kunnr": "1000001698" },
                    { "Kunnr": "1000001704" },
                    { "Kunnr": "1000002691" },
                    { "Kunnr": "1000002758" },
                    { "Kunnr": "1000003870" },
                    { "Kunnr": "1000003880" },
                    { "Kunnr": "1000003881" },
                    { "Kunnr": "1000003882" },
                    { "Kunnr": "1000003883" },
                    { "Kunnr": "1000003885" },
                    { "Kunnr": "1000003886" },
                    { "Kunnr": "1000003887" },
                    { "Kunnr": "1000003888" },
                    { "Kunnr": "1000003889" },
                    { "Kunnr": "1000003892" },
                    { "Kunnr": "1000003893" },
                    { "Kunnr": "1000003895" },
                    { "Kunnr": "1000003896" },
                    { "Kunnr": "1000003897" },
                    { "Kunnr": "1000003898" },
                    { "Kunnr": "1000003899" },
                    { "Kunnr": "1000003900" },
                    { "Kunnr": "1000003903" },
                    { "Kunnr": "1000003904" },
                    { "Kunnr": "1000003905" },
                    { "Kunnr": "1000003906" },
                    { "Kunnr": "1000003908" },
                    { "Kunnr": "1000003909" },
                    { "Kunnr": "1000003911" },
                    { "Kunnr": "1000003912" },
                    { "Kunnr": "1000003913" },
                    { "Kunnr": "1000003914" },
                    { "Kunnr": "1000003915" },
                    { "Kunnr": "1000003916" },
                    { "Kunnr": "1000003917" },
                    { "Kunnr": "1000003918" },
                    { "Kunnr": "1000003919" },
                    { "Kunnr": "1000003920" },
                    { "Kunnr": "1000003921" },
                    { "Kunnr": "1000003923" },
                    { "Kunnr": "1000003924" },
                    { "Kunnr": "1000003925" },
                    { "Kunnr": "1000003926" },
                    { "Kunnr": "1000003927" },
                    { "Kunnr": "1000003928" },
                    { "Kunnr": "1000003930" },
                    { "Kunnr": "1000003931" },
                    { "Kunnr": "1000003932" },
                    { "Kunnr": "1000003933" },
                    { "Kunnr": "1000003936" },
                    { "Kunnr": "1000003938" },
                    { "Kunnr": "1000003940" },
                    { "Kunnr": "1000003942" },
                    { "Kunnr": "1000003944" },
                    { "Kunnr": "1000003947" },
                    { "Kunnr": "1000003953" },
                    { "Kunnr": "1000003954" },
                    { "Kunnr": "1000003956" },
                    { "Kunnr": "1000003957" },
                    { "Kunnr": "1000003958" },
                    { "Kunnr": "1000003959" },
                    { "Kunnr": "1000003960" },
                    { "Kunnr": "1000003963" },
                    { "Kunnr": "1000003964" },
                    { "Kunnr": "1000003965" },
                    { "Kunnr": "1000003966" },
                    { "Kunnr": "1000003967" },
                    { "Kunnr": "1000003968" },
                    { "Kunnr": "1000003969" },
                    { "Kunnr": "1000003971" },
                    { "Kunnr": "1000003972" },
                    { "Kunnr": "1000003973" },
                    { "Kunnr": "1000003974" },
                    { "Kunnr": "1000003975" },
                    { "Kunnr": "1000003976" },
                    { "Kunnr": "1000003978" },
                    { "Kunnr": "1000003979" },
                    { "Kunnr": "1000003981" },
                    { "Kunnr": "1000003983" },
                    { "Kunnr": "1000003984" },
                    { "Kunnr": "1000003985" },
                    { "Kunnr": "1000003986" },
                    { "Kunnr": "1000003988" },
                    { "Kunnr": "1000003991" },
                    { "Kunnr": "1000003993" },
                    { "Kunnr": "1000003995" },
                    { "Kunnr": "1000003998" },
                    { "Kunnr": "1000003999" },
                    { "Kunnr": "1000004000" },
                    { "Kunnr": "1000004001" },
                    { "Kunnr": "1000004002" },
                    { "Kunnr": "1000004003" },
                    { "Kunnr": "1000004005" },
                    { "Kunnr": "1000004006" },
                    { "Kunnr": "1000004007" },
                    { "Kunnr": "1000004008" },
                    { "Kunnr": "1000004009" },
                    { "Kunnr": "1000004010" },
                    { "Kunnr": "1000004011" },
                    { "Kunnr": "1000004012" },
                    { "Kunnr": "1000004014" },
                    { "Kunnr": "1000004017" },
                    { "Kunnr": "1000004018" },
                    { "Kunnr": "1000004019" },
                    { "Kunnr": "1000004020" },
                    { "Kunnr": "1000004023" },
                    { "Kunnr": "1000004026" },
                    { "Kunnr": "1000004027" },
                    { "Kunnr": "1000004029" },
                    { "Kunnr": "1000004030" },
                    { "Kunnr": "1000004032" },
                    { "Kunnr": "1000004033" },
                    { "Kunnr": "1000004034" },
                    { "Kunnr": "1000004035" },
                    { "Kunnr": "1000004036" },
                    { "Kunnr": "1000004037" },
                    { "Kunnr": "1000004038" },
                    { "Kunnr": "1000004039" },
                    { "Kunnr": "1000004040" },
                    { "Kunnr": "1000004041" },
                    { "Kunnr": "1000004042" },
                    { "Kunnr": "1000004044" },
                    { "Kunnr": "1000004046" },
                    { "Kunnr": "1000004049" },
                    { "Kunnr": "1000004050" },
                    { "Kunnr": "1000004058" },
                    { "Kunnr": "1000004059" },
                    { "Kunnr": "1000004060" },
                    { "Kunnr": "1000004062" },
                    { "Kunnr": "1000004272" },
                    { "Kunnr": "1000004275" },
                    { "Kunnr": "1000004277" },
                    { "Kunnr": "1000004278" },
                    { "Kunnr": "1000004279" },
                    { "Kunnr": "1000004280" },
                    { "Kunnr": "1000004281" },
                    { "Kunnr": "1000004282" },
                    { "Kunnr": "1000004285" },
                    { "Kunnr": "1000004286" },
                    { "Kunnr": "1000004288" },
                    { "Kunnr": "1000004289" },
                    { "Kunnr": "1000004291" },
                    { "Kunnr": "1000004292" },
                    { "Kunnr": "1000004295" },
                    { "Kunnr": "1000004296" },
                    { "Kunnr": "1000004297" },
                    { "Kunnr": "1000004298" },
                    { "Kunnr": "1000004299" },
                    { "Kunnr": "1000004300" },
                    { "Kunnr": "1000004301" },
                    { "Kunnr": "1000004303" },
                    { "Kunnr": "1000004304" },
                    { "Kunnr": "1000004305" },
                    { "Kunnr": "1000004307" },
                    { "Kunnr": "1000004308" },
                    { "Kunnr": "1000004309" },
                    { "Kunnr": "1000005174" },
                    { "Kunnr": "1000005512" },
                    { "Kunnr": "1000005550" },
                    { "Kunnr": "1000005769" },
                    { "Kunnr": "1000006092" },
                    { "Kunnr": "1000010082" },
                    { "Kunnr": "1000012042" },
                    { "Kunnr": "1000012043" },
                    { "Kunnr": "1000012045" },
                    { "Kunnr": "1000012076" },
                    { "Kunnr": "1000012125" },
                    { "Kunnr": "1000012213" },
                    { "Kunnr": "1000012251" },
                    { "Kunnr": "1000012252" },
                    { "Kunnr": "1000012254" },
                    { "Kunnr": "1000012255" },
                    { "Kunnr": "1000012405" },
                    { "Kunnr": "1000012490" },
                    { "Kunnr": "1000012513" },
                    { "Kunnr": "1000012523" },
                    { "Kunnr": "1000012531" },
                    { "Kunnr": "1000012575" },
                    { "Kunnr": "1000012721" },
                    { "Kunnr": "1000013212" },
                    { "Kunnr": "1000013376" },
                    { "Kunnr": "1000013395" },
                    { "Kunnr": "1000013490" },
                    { "Kunnr": "1000013492" },
                    { "Kunnr": "1000013507" },
                    { "Kunnr": "1000013513" },
                    { "Kunnr": "1000013587" },
                    { "Kunnr": "1000013672" },
                    { "Kunnr": "1000013695" },
                    { "Kunnr": "1000013915" }
                ]

                return oModel;

            },
            JsonFacturaDetail: function () {
                var oModel = [
                    {
                        "producto": "Placenta Life Rubio Oscuro",
                        "Lote": "274659",
                        "cantorig": "10",
                        "cantdev": "1",
                        "total": "941.00",
                        "cantsoldev": "0",
                        "montonc": "564.60"
                    },
                    {
                        "producto": "Placenta Life Rubio Oscuro",
                        "Lote": "274660",
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