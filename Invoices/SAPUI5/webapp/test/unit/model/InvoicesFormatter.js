// @ts-nocheck
sap.ui.define([
    "logaligroup/SAPUI5/model/InvoicesFormatter",
    "sap/ui/model/resource/ResourceModel"
],
    /**
     * @param {TypeOf sap.ui.model.resource.ResourceModel} ResourceModel
     */
    function (InvoicesFormatter, ResourceModel) {

        QUnit.module("Qnvoices Status", {

            beforeEach: function () {
                this._oResourceModel = new ResourceModel({
                    bundleUrl: sap.ui.require.toUrl("logaligroup/SAPUI5") + "/i18n/i18n.properties"
                });
            },
            afterEach: function () {
                this._oResourceModel.destroy();
            }
        });

        QUnit.test("Should return the Invoice Status", function(assert){
            
            let oModel = this.stub();
            oModel.withArgs("i18n").returns(this._oResourceModel);

            let oViewStub = {
                getModel : oModel
            };

            let oControllerStub = {
                getView : this.stub().returns(oViewStub)
            };

            let fnIsolatedFormatter = InvoicesFormatter.invoiceStatus.bind(oControllerStub);

            //Assert
            assert.strictEqual(fnIsolatedFormatter("A"), "New", "The invoice status for A is Correct");
            assert.strictEqual(fnIsolatedFormatter("B"), "In Progress", "The invoice status for B is Correct");
            assert.strictEqual(fnIsolatedFormatter("C"), "Done", "The invoice status for C is Correct");
        });
    });