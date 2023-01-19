/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapa.js":
/*!************************!*\
  !*** ./src/js/mapa.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n    const lat = 14.0585797;\r\n    const lng = -87.2439907;\r\n    const mapa = L.map('mapa').setView([lat, lng], 18);\r\n\r\n    let marker;\r\n\r\n    //Utilizar Provider y Geocoder para obtener la informacion de las calles\r\n    const geocodeService = L.esri.Geocoding.geocodeService();\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution:\r\n            '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\r\n    }).addTo(mapa);\r\n\r\n    //el pin\r\n    marker = new L.marker(\r\n        { lat, lng },\r\n        {\r\n            draggable: true /* mover el pin */,\r\n            autoPan: true /* despues de mover el pin se vuelve a centrar el mapa */,\r\n        }\r\n    ).addTo(mapa);\r\n\r\n    //detectar el movimiento del pin\r\n    marker.on('moveend', function (e) {\r\n        marker = e.target;\r\n\r\n        const posicion = marker.getLatLng();\r\n\r\n        //centrar el mapa\r\n        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));\r\n\r\n        //obtener la informacion de la calle al soltar el pin\r\n        geocodeService\r\n            .reverse()\r\n            .latlng(posicion, 13)\r\n            .run(function (error, resultado) {\r\n                //agregar un globo con la informacion de la posicion\r\n                marker.bindPopup(resultado.address.LongLabel);\r\n\r\n                //llenar los campos ocultos de la calle , lat y lng\r\n                document.querySelector('.calle').textContent =\r\n                    resultado?.address?.Address ?? '';\r\n\r\n                document.querySelector('#calle').value =\r\n                    resultado?.address?.Address ?? '';\r\n\r\n                document.querySelector('#lat').value =\r\n                    resultado?.latlng?.lat ?? '';\r\n\r\n                document.querySelector('#lng').value =\r\n                    resultado?.latlng?.lng ?? '';\r\n            });\r\n    });\r\n})();\r\n\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/mapa.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapa.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;