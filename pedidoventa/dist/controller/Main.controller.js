sap.ui.define(["sap/ui/core/mvc/Controller","com/rava/pedido/pedidoventa/controller/BaseController","com/rava/pedido/pedidoventa/model/models"],function(e,t,o){"use strict";var d,i=false;return t.extend("com.rava.pedido.pedidoventa.controller.Main",{onInit:function(){d=this;this.oRouter=sap.ui.core.UIComponent.getRouterFor(this);this.oRouter.getTarget("Main").attachDisplay(jQuery.proxy(this.handleRouteMatched,this));this.frgIdAddPedido="frgIdAddPedido";this.frgIdDetailPedido="frgIdDetailPedido";this.frgIdEditContact="frgIdEditContact";console.log("hola")},handleRouteMatched:function(){Promise.all([]).then(async e=>{this.oModelPedidoVenta=this.getModel("oModelPedidoVenta");this.oModelPedidoVenta.setProperty("/AddSelectUser",o.JsonUser());this.oModelPedidoVenta.setProperty("/User",o.JsonUserLoged());this.oModelPedidoVenta.setProperty("/PedidosCreados",o.JsonPedidos());this.oModelPedidoVenta.setProperty("/DetailSelectFuerzaVenta",o.JsonFuerzaVenta());this.oModelPedidoVenta.setProperty("/DetailSelectPuntoVenta",o.JsonPuntoVenta());this.oModelPedidoVenta.setProperty("/DetailSelectDireccion",o.JsonDirecciones());this.oModelPedidoVenta.setProperty("/DetailSelectCondPago",o.JsonCondPago());this.oModelPedidoVenta.setProperty("/DescSelect",o.JsonDescuento())}).catch(function(e){sap.ui.core.BusyIndicator.hide(0)})},_onPressAddPedido:function(){this.setFragment("_dialogAddPedido",this.frgIdAddPedido,"AddPedido",this)},_onAcceptPedido:function(){this._dialogAddPedido.close();this.setFragment("_dialogDetailPedido",this.frgIdDetailPedido,"DetailPedido",this)},_onPressEditPedido:function(){this.setFragment("_dialogDetailPedido",this.frgIdDetailPedido,"DetailPedido",this)},_onPressEditContact:function(){this.setFragment("_dialogEditContact",this.frgIdEditContact,"EditContact",this)},_onPressAddProducto:function(){this.oRouter.navTo("Detail",{app:"2"})}})});