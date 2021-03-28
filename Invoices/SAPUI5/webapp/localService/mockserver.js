// @ts-nocheck
sap.ui.define([
    "sap/ui/core/util/MockServer",
    "sap/ui/model/json/JSONModel",
    "sap/base/util/UriParameters",
    "sap/base/Log"
],
    /**
     * 
     * @param { typeof sap.ui.core.util.MockServer} MockServer 
     * @param { typeof sap.ui.model.json.JSONModel} JSONModel 
     * @param { typeof sap.base.util.UriParameters} UriParameters 
     * @param { typeof sap.base.Log} Log 
     */

    function (MockServer, JSONModel, UriParameters, Log) {
        "use strict";

        var oMockServer,
            _sAppPath = "logaligroup/SAPUI5/",
            _sJsonFilesPath = _sAppPath + "localService/mockdata";

        var oMockServerInterface = {

            /**
             * Inicializa el servidor mock asincrono
             * @protected
             * @param {object} oOptionsParameter
             * @returns{Promise} promesa que es resuelta cuando el servidor mock ha sido iniciado
             */
            init: function (oOptionsParameter) {

                var oOptions = oOptionsParameter || {};

                return new Promise(function (fnResolve, fnReject) {
                    var sManifestUrl = sap.ui.require.toUrl(_sAppPath + "manifest.json"),
                        oManifestModel = new JSONModel(sManifestUrl);

                    oManifestModel.attachRequestCompleted(function () {
                        var oUriParameters = new UriParameters(window.location.href);

                        // Parse manifest for local metadata URI
                        var sJsonFilesUrl = sap.ui.require.toUrl(_sJsonFilesPath);
                        var oMainDataSource = oManifestModel.getProperty("/sap.app/dataSources/mainService");
                        var sMetadataUrl = sap.ui.require.toUrl(_sAppPath + oMainDataSource.settings.localUri);

                        // Aseguramos que tenemos barra slash al final de la URL
                        var sMockServerUrl = oMainDataSource.uri && new URI(oMainDataSource.uri).absoluteTo(sap.ui.require.toUrl(_sAppPath)).toString();

                        // Crea la instancia del servidor Mock o reinicia si existe
                        if (!oMockServer) {
                            oMockServer = new MockServer({
                                rootUri: sMockServerUrl
                            });
                        }
                        else {
                            oMockServer.stop();
                        }

                        // Configuramos el servidor Mock con las opciones dadas o la demora por defecto 0.5s
                        MockServer.config({
                            autoRespond: true,
                            autoRespondAfter : (oOptions.delay || oUriParameters.get("serverDelay") || 500)
                        });

                        // Simular todas las solicitudes usando datos Mock
                        oMockServer.simulate(sMetadataUrl, {
                            sMockDataBaseUrl: sJsonFilesUrl,
                            bGenerateMissingMockData: true
                        });

                        var aRequests = oMockServer.getRequests();

                        // Compone una respuesta de error
                        var fnResponse = function (iErrCode, sMessage, aRequests) {
                            aRequests.response = function (oXhr) {
                                oXhr.respond(iErrCode, {"Content-Type" : "text/plain;charset=utf-8"}, sMessage);
                            };
                        };

                        // Simula errores metadata
                        if (oOptions.metadataError || oUriParameters.get("metadataError")) {
                            aRequests.forEach(function (aEntry) {
                                if (aEntry.path.toString().indexOf("$metadata") > -1) {
                                    fnResponse(500, "metadata Error", aEntry);
                                }
                            });
                        };

                        // Simulamos errores de simulación
                        var sErrorParam = oOptions.errorType || oUriParameters.get("errorType");
                        var iErrorCode = sErrorParam === "badRequest" ? 400 : 500;

                        if (sErrorParam) {
                            aRequests.forEach(function (aEntry) {
                                fnResponse(iErrorCode, sErrorParam, aEntry);
                            });
                        };

                        // Colocamos la solicitud e iniciamos el servidor
                        oMockServer.setRequests(aRequests);
                        oMockServer.start();

                        Log.info("Running the app with mock data");
                        fnResolve();
                    });

                    oManifestModel.attachRequestFailed(function () {
                        var sError = "Failed to load the application manifest";

                        Log.error(sError);
                        fnReject(new Error(sError));
                    });
                });
            }
        };

        return oMockServerInterface;
    });
