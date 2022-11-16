sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"jquery.sap.global",
], function (JSONModel, Device, jQuery) {
	"use strict";

	return {
		modelListRoles: function () {
			var modData = [{
				"Codigo": "1",
				"Descripcion": "Coordinador de Operaciones"
			}, {
				"Codigo": "2",
				"Descripcion": "Coordinador de Recepción"
			}];
			return modData;
		},
		//////////////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////
	};
});