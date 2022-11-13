sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,o){"use strict";return{createDeviceModel:function(){var n=new e(o);n.setDefaultBindingMode("OneWay");return n},JsonUser:function(){var e=[{RUC:"20604890617",Descripcion:"DROGUERIA INRETAIL PHARMA - DROGUERIA INRETAIL PHARMA SAC"},{RUC:"20508565934",Descripcion:"HIPERMERCADO TOTTUS SA.- HIPERMERCADO TOTTUS SA"}];return e},JsonUserLoged:function(){var e={name:"kestefo",nameDescription:"Kassiel Estefo Tume"};return e},JsonPedidos:function(){var e=[{pedido:"",fecha:"20/09/2022",vencimiento:"20/09/2022",tipodoc:"70599323",razonsocial:"SUPERMERCADOS PERUANOS SA",importe:"250,000,000",estado:"Pendiente Creación",icon:"sap-icon://pending",estate:"Warning"},{pedido:"O123-588",fecha:"20/09/2022",vencimiento:"21/09/2022",tipodoc:"70599325",razonsocial:"HIPERMERCADO TOTTUS ORIENTE SA",importe:"250,000,000",estado:"Creado",icon:"sap-icon://create",estate:"Success"},{pedido:"O123-589",fecha:"20/09/2022",vencimiento:"20/09/2022",tipodoc:"70599324",razonsocial:"CORPORACION BOTICAS PERU SA SA",importe:"250,000,000",estado:"Cerrado",icon:"sap-icon://decline",estate:"None"}];return e},JsonFuerzaVenta:function(){var e=[{key:"01",desc:"Placenta life"}];return e},JsonPuntoVenta:function(){var e=[{key:"01",desc:"Centro de Distribución de Villa"}];return e},JsonDirecciones:function(){var e=[{key:"01",desc:"Av. DEFENSOR DEL MORRO No. 1277 URB. PANTANOS DE VILLA [CHORRILLOS LIMA-LIMA-PERU]"},{key:"02",desc:"Av. DEFENSOR DEL MORRO No. 1278 URB. PANTANOS DE VILLA [CHORRILLOS LIMA-LIMA-PERU]"}];return e},JsonCondPago:function(){var e=[{key:"01",desc:"Pago a 90 días"},{key:"02",desc:"Pago a 60 días"}];return e},JsonProductos:function(){var e=[{producto:"Conditioner Placenta Life Hydra Macadamia Frasco 1lt",cantidad:"6",tipo:"L",total:"151.16",descuentos:"0.00% 0.00%",descuentosVolumen:"0.00%"},{producto:"Conditioner Life Radiant BB-Tox Treatment",cantidad:"6",tipo:"L",total:"151.16",descuentos:"0.00% 0.00%",descuentosVolumen:""},{producto:"MALETA DE CUERINA COLOR NEGRO CON LOGO EN PLACA",cantidad:"3",tipo:"N",total:"100.00",descuentos:"0.00% ",descuentosVolumen:"0.00%"}];return e},JsonFamilia:function(){var e=[{key:"01",desc:"-Seleccione-"},{key:"02",desc:"Acondicionador Placenta Life Be Natural"},{key:"03",desc:"Acondicionador Placenta Life Saloon"},{key:"04",desc:"Acondicionador Tonno Plus Tonno Plus"}];return e},JsonProductoFamilia:function(){var e=[{producto:"Plife Radiant Conditioner Nutri - Soft Galonera 3.71l",precio:"49.07",stock:"329",unicaja:"4",cantidad:"0",state:"Information",icon:"sap-icon://outbox"},{producto:"Plife Radiant Deco Extreme Pote 500mg",precio:"44.07",stock:"3,629",unicaja:"6",cantidad:"0",state:"Information",icon:"sap-icon://outbox"},{producto:"Plife Radiant Shampo Nutri - Soft Galonera 3.71l",precio:"49.07",stock:"505",unicaja:"4",cantidad:"0",state:"Information",icon:"sap-icon://outbox"}];return e},JsonDescuento:function(){var e=[{key:"01",desc:"Bonificación Kit"},{key:"02",desc:"Fuerza Venta"},{key:"03",desc:"Bonificación por Vendedor"},{key:"04",desc:"Bonificación por Sub-Marca"},{key:"05",desc:"Volúmen por Sub-Marca"},{key:"06",desc:"Volúmen de Venta"},{key:"07",desc:"Combos"},{key:"08",desc:"Producto Especiales"},{key:"09",desc:"Obsequios por productos"},{key:"10",desc:"Descuento por porcentaje de ventas"},{key:"11",desc:"No cuenta con promociones de este tipo"}];return e}}});