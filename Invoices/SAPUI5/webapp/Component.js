// @ts-nocheck
sap.ui.define([
    "sap/ui/core/UIComponent",
    "logaligroup/SAPUI5/model/Models",
    "sap/ui/model/resource/ResourceModel",
    "./controller/HelloDialog"
],
    /**
     * @param {typeof sap.ui.core.UIComponent} UIComponent
     * @param {typeof sap.ui.model.resource.ResourceModel} ResourceModel
     */
    function (UIComponent, Models, ResourceModel, HelloDialog) {

        return UIComponent.extend("logaligroup.SAPUI5.Component", {

            metadata: {
                manifest: "json"
            },

            init: function () {
                UIComponent.prototype.init.apply(this, arguments);

                this.setModel(Models.createRecipient());

                //var i18nModel = new ResourceModel({ bundleName: "logaligroup.SAPUI5.i18n.i18n" });
                //this.setModel(i18nModel, "i18n");

                this._helloDialog = new HelloDialog(this.getRootControl());

                this._helloDialog = new HelloDialog(this.getRootControl());

                // Create the views based on the url/hash
                this.getRouter().initialize();
            },

            exit: function() {
                this._helloDialog.destroy();
                delete this._helloDialog;
            },

            openHelloDialog: function() {
                this._helloDialog.open();
            }
        });
    });