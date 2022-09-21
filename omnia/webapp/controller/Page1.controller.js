sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox) {
        "use strict";

        return Controller.extend("Cobranza.omnia.controller.Page1", {
            onInit: function () {
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            },

            OnPressHeader : function (){
                this.oRouter.navTo("TargetPage2");
                
            },
            onPress : function (){
                const that= this;
                // MessageBox.success("Se creó la Planilla LI19-87704");
                MessageBox.success("Se creó la Planilla LI19-87704", {
                    actions: [MessageBox.Action.OK],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                        that.oRouter.navTo("TargetPage2");
                    }
                });	
            },
        });
    });
