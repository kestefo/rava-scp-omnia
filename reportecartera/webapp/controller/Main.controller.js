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
                    this.oModelReporte.setProperty("/oDataReporteCliente", []);
                    this.oModelReporte.setProperty("/oDataReporteMarca", []);
                    this.oModelReporte.setProperty("/oSelectGrafico", models.JsonSelectGrafico());
                    this.oModelReporte.setProperty("/vizProperties", models.JsonVizProperties());
                    this.oModelReporte.setProperty("/bVisibleChart", true);
                    this.oModelReporte.setProperty("/bVisibleDonut", false);
                    this.oModelReporte.setProperty("/sNombreGrafico", this.getI18nText("txtGraficoBarras"));
                    this.oModelReporte.setProperty("/charType", "bar");
                    this._byId("dMesDesde").setEnabled(true);
                    this._byId("dMesHasta").setEnabled(false);
                }).catch(function (oError) {
                    console.log(oError);
                    sap.ui.core.BusyIndicator.hide(0);
                });
            },
            _onbtnRefresh:function(){
                Promise.all([]).then(async values => {
                    this.getMessageBox('success', that.getI18nText("successRefresh"));
                }).catch(function (oError) {
                    console.log(oError);
                    sap.ui.core.BusyIndicator.hide(0);
                });
            },
            _onclearReport: function(){
                this._byId("dMesDesde").setEnabled(true);
                this._byId("dMesHasta").setEnabled(false);
                this.oModelReporte.setProperty("/oDataGrafico", []);
                this.oModelReporte.setProperty("/oDataReporteCliente", []);
                this.oModelReporte.setProperty("/oDataReporteMarca", []);
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
                var sValueDesde = this._byId("dMesDesde").getValue();
                if(this.isEmpty(sValueDesde)){
                    this.getMessageBox('error', that.getI18nText("errorMissingFilter"));
                    return;
                }

                var sValueDesde = this._byId("dMesDesde").getValue();
                var sValueHasta = this._byId("dMesHasta").getValue();

                if(this.isEmpty(sValueHasta)){
                    sValueHasta = sValueDesde;
                }

                Promise.all([this._onGetServiceReport(sValueDesde,sValueHasta)]).then(async values => {
                    values[0] = models.JsonReporteCliente();
                    //Espacio para logica del primer tab ReporteCliente
                    this.oModelReporte.setProperty("/oDataReporteCliente",values[0]);

                    //Espacio para logica del primer tab ReporteMarca
                    values[1] = models.JsonReporteMarca();
                    var oDataGroupMarca = this._onGroupMarca(values[1]); //En caso necesitar
                    this.oModelReporte.setProperty("/oDataReporteMarca", oDataGroupMarca);
                }).catch(function (oError) {
                    console.log(oError);
                    sap.ui.core.BusyIndicator.hide(0);
                });
                
                var data = models.JsonReporteCliente();
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
            _onGetServiceReport: function(sValueDesde, sValueHasta){
                var url="/ERP/sap/opu/odata/sap/ZBVMM_GESTION_DESPACHOS_SRV/ZET_GET_TKNUM_XSOCSet?$filter"+sValueDesde+"-"+sValueHasta;
                return new Promise(function (resolve, reject) {
                    resolve("Exito")
				});
            },
            _onGroupMarca: function(oData){
                var oDataMarca = [];
                var oDataGroupMarca = [];
                $.each(this._groupBy(oData,'marca'), function (x, y) {
                    var objMarca = {
                        "marca": y[0].marca,
                        "cantidadtotal": "0",
                        "importetotal": "0",
                        "submarca":[]
                    };

                    $.each(that._groupBy(y,'submarca'), function (xx, yy) {
                        var objSubMarca = {
                            "marca": yy[0].marca,
                            "submarca": yy[0].submarca,
                            "cantidadSub": "0",
                            "importeSub": "0",
                            "detalle": yy
                        };
                        var cantidadSub = 0;
                        var importeSub = 0;
                        yy.forEach(function(valuedetalle){
                            cantidadSub += parseFloat(valuedetalle.cantidad);
                            importeSub += parseFloat(valuedetalle.importe);
                        });
                        objSubMarca.cantidadSub = cantidadSub.toString();
                        objSubMarca.importeSub = importeSub.toString();
                        objMarca.submarca.push(objSubMarca);
                    });
                    
                    var cantidadtotal = 0;
                    var importetotal = 0;
                    objMarca.submarca.forEach(function(value){
                        cantidadtotal += parseFloat(value.cantidadSub);
                        importetotal += parseFloat(value.importeSub);
                    });
                    objMarca.cantidadtotal = cantidadtotal.toString();
                    objMarca.importetotal = importetotal.toString();
                    oDataGroupMarca.push(objMarca);
                });
                
                console.log(oDataGroupMarca);

                oDataGroupMarca.forEach(function(valueMarca, indexMarca){
                    valueMarca.submarca.forEach(function(valueSubMarca, indexSubMarca){
                        var obj = {
                            "marca": valueMarca.marca,
                            "submarca":"",
                            "cantidad":"0",
                            "importe":"0",
                            "importetotal":valueMarca.importetotal,
                        };
                        obj.submarca = valueSubMarca.submarca;
                        obj.cantidad = valueSubMarca.cantidadSub;
                        obj.importe = valueSubMarca.importeSub;
                        oDataMarca.push(obj);
                    });
                });

                return oDataMarca;
            },

            //oEvents filter datePicker
            _onChangeDateDesde: function (oEvent) {
                var oSource = oEvent.getSource();
                var sValue = oSource.getValue()
                if (!this.isEmpty(sValue)) {
                    var sFechaInicio = "";
                    var bFechaInicio = "";
                    
                    sFechaInicio = sValue.trim();
                    
                    var booleanValidateFirst = this.ValidateFormatDate(sFechaInicio);
                    if(!booleanValidateFirst){
                        this.getMessageBox('error', that.getI18nText("errorChangeDatePicker") + sValue);
                        oSource.setValue("");
                        this._byId("dMesHasta").setValue("");
                        this._byId("dMesHasta").setEnabled(true);
                        return;
                    }

                    oSource.setValue(sValue);
                    this._byId("dMesHasta").setValue("");
                    this._byId("dMesHasta").setEnabled(true);
                } else {
                    oSource.setValue("");
                    this._byId("dMesHasta").setValue("");
                    this._byId("dMesHasta").setEnabled(true);
                }
            },
            _onChangeDateHasta: function (oEvent) {
                var oSource = oEvent.getSource();
                var sValue = oSource.getValue()
                if (!this.isEmpty(sValue)) {
                    var sFechaInicio = "";
                    var bFechaInicio = "";
                    
                    sFechaInicio = sValue.trim();
                    
                    var booleanValidateFirst = this.ValidateFormatDate(sFechaInicio);
                    if(!booleanValidateFirst){
                        this.getMessageBox('error', that.getI18nText("errorChangeDatePicker") + sValue);
                        oSource.setValue("");
                        return;
                    }

                    oSource.setValue(sValue);
                    this._byId("dMesHasta").setEnabled(true);
                } else {
                    oSource.setValue("");
                }
            },
            _onNavigateDateHasta:function(oEvent){
                var oSource = oEvent.getSource();
                var sValueDesde = this._byId("dMesDesde").getValue();
                var sValueDesdeSplit = sValueDesde.split("/");
                var year = parseInt(sValueDesdeSplit[2]);
				var mount = parseInt(sValueDesdeSplit[1]);
				var day = parseInt(sValueDesdeSplit[0]);
                oSource.setMinDate(new Date(year, mount-1, day));
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
