sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("Cobranza.omnia.controller.Page2", {
            onInit: function () {
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            },

            onAfterRendering: function (){
                const that = this ;	
                const oView				= this.getView(); 

                var Proyect = oView.getModel("Proyect");
                Proyect.setProperty("/ElementCobro",false);

            },

            onNavBack : function (){

                this.oRouter.navTo("TargetPage1");
            },

            RegistrarDeposito : function (){
                const that = this ;	
                const oView				= this.getView(); 
                if (!that.RegistrarDeposito12) {
                    that.RegistrarDeposito12 = sap.ui.xmlfragment("Cobranza.omnia.view.Dialog1", that);
                    oView.addDependent(that.RegistrarDeposito12);
                    }
                    
                
                that.RegistrarDeposito12.open();

            },
            onClosed: function (){
                const that = this ;	
                const oView				= this.getView(); 

                that.RegistrarDeposito12.close();

            },
            onClosedPago: function (){
                const that = this ;	
                const oView				= this.getView(); 

                that.RegistrarPago333.close();

            },

            Nuevopago : function (){
                const that = this ;	
                const oView				= this.getView(); 
                if (!that.RegistrarPago) {
                    that.RegistrarPago = sap.ui.xmlfragment("Cobranza.omnia.view.TabletDialog1", that);
                    oView.addDependent(that.RegistrarPago);
                    }
                    
                
                that.RegistrarPago.open();

            },
            handleConfirm : function (){
                const that = this ;	
                const oView				= this.getView(); 

                
                if (!that.RegistrarPago333) {
                    that.RegistrarPago333 = sap.ui.xmlfragment("Cobranza.omnia.view.Dialog2", that);
                    oView.addDependent(that.RegistrarPago333);
                    }
                    that.RegistrarPago333.open();
                    
                

            },
          
            SelectEfectivo : function (){
                const that = this ;	
                const oView				= this.getView(); 
                var Proyect = oView.getModel("Proyect");
                Proyect.setProperty("/ElementCobro",false);
                
                
                
            },

            SelectBancario : function (){
                const that = this ;	
                const oView				= this.getView(); 
                var Proyect = oView.getModel("Proyect");
                Proyect.setProperty("/ElementCobro",true);

                
                
            },
            selectMedPago : function (oEvent){
                const that = this ;	
                const oView				= this.getView(); 
                const Source = oEvent.getSource()
                var Proyect = oView.getModel("Proyect");    
                const key = Source.getSelectedKey()
                if (key === "Transferencia")
                Proyect.setProperty("/ElementCobro",true);
                else
                Proyect.setProperty("/ElementCobro",false);


            },
        });
    });
