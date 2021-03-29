// @ts-nocheck
/* eslint-disable no-undef */
/* Global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
    "use strict";

    sap.ui.require([
        "logaligroup/SAPUI5/test/unit/AllTests"
    ], function () {
        QUnit.start();
    })
});