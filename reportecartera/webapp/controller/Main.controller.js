sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "reportecartera/controller/BaseController",
    "reportecartera/model/models",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, BaseController, models) {
        "use strict";

        var that, bValueHelpEquipment = false;
        return BaseController.extend("reportecartera.controller.Main", {
            onInit: function () {
                that = this;
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter.getTarget("Main").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
            },
            handleRouteMatched: function(){
                Promise.all([]).then(async values => {
                    this.oModelReporte = this.getModel("oModelReporte");
                    this.oModelReporte.setProperty("/oDataReporte", []);
                    this.oModelReporte.setProperty("/oSelectGrafico", models.JsonSelectGrafico());
                    this.oModelReporte.setProperty("/vizProperties", models.JsonVizProperties());
                    this.oModelReporte.setProperty("/bVisibleChart", true);
                    this.oModelReporte.setProperty("/bVisibleDonut", false);
                    this.oModelReporte.setProperty("/sNombreGrafico", this.getI18nText("txtGraficoBarras"));
                    this.oModelReporte.setProperty("/charType", "bar");
                }).catch(function (oError) {
                    sap.ui.core.BusyIndicator.hide(0);
                });
            },
            _onclearReport: function(){
                this.oModelReporte.setProperty("/oDataGrafico", []);
                this.oModelReporte.setProperty("/oDataReporte", []);
                var oFilterBar = that._byId("filterbar");
				var oItems = oFilterBar.getAllFilterItems(true);
				for (var i = 0; i < oItems.length; i++) {
					var oControl = oFilterBar.determineControlByFilterItem(oItems[i]);
					if (oControl) {
						if (!oControl.getId().toString().includes("button"))
							oControl.setValue("");

					}
				}
            },
            _onSearchFB: function(){
                this.oModelReporte.setProperty("/oDataReporte", models.JsonReporte());
                
                var data = models.JsonReporte();
                var oEstatus = [];
                var posicion = 0;
                $.each(that._groupBy(data,'importe'), function (x, y) {
                    var objEstatus = {
                        "dim0": y[0].importe,
                        "mea0": y.length.toString(),
                        "__id": posicion
                    };
                    posicion++;
                    oEstatus.push(objEstatus);
                });

                this.oModelReporte.setProperty("/oDataGrafico", oEstatus);
            },
            onSelectTipoGrafico: function () {
                
                var sSelectedTipoGrafico = this.oModelReporte.getProperty("/sSelectedTipoGrafico");
                var oDataTipoGrafico = this.oModelReporte.getProperty("/oSelectGrafico");
                
                oDataTipoGrafico.forEach(function(objeto){
                    if(objeto.keyGraf === sSelectedTipoGrafico){
                        that.oModelReporte.setProperty("/sNombreGrafico", that.getI18nText("txtGrafico") + objeto.nomGraf);
                        that.oModelReporte.setProperty("/charType", objeto.tipGraf);
                        
                        if(sSelectedTipoGrafico == "3"){
                            that.oModelReporte.setProperty("/bVisibleChart", false);
                            that.oModelReporte.setProperty("/bVisibleDonut", true);
                        }else{
                            that.oModelReporte.setProperty("/bVisibleChart", true);
                            that.oModelReporte.setProperty("/bVisibleDonut", false);
                        }
                    }
                });
            },
        });
    });
