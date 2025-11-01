"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_document";
exports.ids = ["pages/_document"];
exports.modules = {

/***/ "(pages-dir-node)/./pages/_document.js":
/*!****************************!*\
  !*** ./pages/_document.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/document */ \"(pages-dir-node)/./node_modules/next/document.js\");\n/* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_document__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! styled-components */ \"styled-components\");\n/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_3__);\n// Этот файл позволяет настроить тег <html> и <body> для всего приложения.\n//  Здесь используется styled-components для стилизации на стороне сервера. \n//   ServerStyleSheet собирает стили компонентов при рендеринге страницы и добавляет их в <head>.\n\n\n\n\nclass MyDocument extends (next_document__WEBPACK_IMPORTED_MODULE_2___default()) {\n    static async getInitialProps(ctx) {\n        const sheet = new styled_components__WEBPACK_IMPORTED_MODULE_3__.ServerStyleSheet(); // Создаем экземпляр ServerStyleSheet\n        const originalRenderPage = ctx.renderPage;\n        try {\n            ctx.renderPage = ()=>originalRenderPage({\n                    enhanceApp: (App)=>(props)=>sheet.collectStyles(/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(App, {\n                                ...props\n                            }, void 0, false, {\n                                fileName: \"C:\\\\shop_hardhat\\\\frontend\\\\pages\\\\_document.js\",\n                                lineNumber: 19,\n                                columnNumber: 33\n                            }, this))\n                });\n            const initialProps = await next_document__WEBPACK_IMPORTED_MODULE_2___default().getInitialProps(ctx);\n            return {\n                ...initialProps,\n                styles: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n                    children: [\n                        initialProps.styles,\n                        sheet.getStyleElement(),\n                        \" \"\n                    ]\n                }, void 0, true)\n            };\n        } finally{\n            sheet.seal(); // Завершаем сбор стилей\n        }\n    }\n    render() {\n        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_2__.Html, {\n            lang: \"en\",\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_2__.Head, {}, void 0, false, {\n                    fileName: \"C:\\\\shop_hardhat\\\\frontend\\\\pages\\\\_document.js\",\n                    lineNumber: 40,\n                    columnNumber: 9\n                }, this),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"body\", {\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_2__.Main, {}, void 0, false, {\n                            fileName: \"C:\\\\shop_hardhat\\\\frontend\\\\pages\\\\_document.js\",\n                            lineNumber: 44,\n                            columnNumber: 11\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_2__.NextScript, {}, void 0, false, {\n                            fileName: \"C:\\\\shop_hardhat\\\\frontend\\\\pages\\\\_document.js\",\n                            lineNumber: 45,\n                            columnNumber: 11\n                        }, this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"C:\\\\shop_hardhat\\\\frontend\\\\pages\\\\_document.js\",\n                    lineNumber: 43,\n                    columnNumber: 9\n                }, this)\n            ]\n        }, void 0, true, {\n            fileName: \"C:\\\\shop_hardhat\\\\frontend\\\\pages\\\\_document.js\",\n            lineNumber: 39,\n            columnNumber: 7\n        }, this);\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyDocument);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3BhZ2VzL19kb2N1bWVudC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSwwRUFBMEU7QUFDMUUsNEVBQTRFO0FBQzVFLGlHQUFpRzs7QUFHdkU7QUFDNkM7QUFDbEI7QUFFckQsTUFBTU8sbUJBQW1CTixzREFBUUE7SUFDL0IsYUFBYU8sZ0JBQWdCQyxHQUFHLEVBQUU7UUFDaEMsTUFBTUMsUUFBUSxJQUFJSiwrREFBZ0JBLElBQUkscUNBQXFDO1FBQzNFLE1BQU1LLHFCQUFxQkYsSUFBSUcsVUFBVTtRQUV6QyxJQUFJO1lBQ0ZILElBQUlHLFVBQVUsR0FBRyxJQUNmRCxtQkFBbUI7b0JBQ2pCRSxZQUFZLENBQUNDLE1BQVEsQ0FBQ0MsUUFDcEJMLE1BQU1NLGFBQWEsZUFBQyw4REFBQ0Y7Z0NBQUssR0FBR0MsS0FBSzs7Ozs7O2dCQUN0QztZQUVGLE1BQU1FLGVBQWUsTUFBTWhCLG9FQUF3QixDQUFDUTtZQUNwRCxPQUFPO2dCQUNMLEdBQUdRLFlBQVk7Z0JBQ2ZDLHNCQUNFOzt3QkFDR0QsYUFBYUMsTUFBTTt3QkFDbkJSLE1BQU1TLGVBQWU7d0JBQUc7OztZQUcvQjtRQUNGLFNBQVU7WUFDUlQsTUFBTVUsSUFBSSxJQUFJLHdCQUF3QjtRQUN4QztJQUNGO0lBRUFDLFNBQVM7UUFDUCxxQkFDRSw4REFBQ25CLCtDQUFJQTtZQUFDb0IsTUFBSzs7OEJBQ1QsOERBQUNuQiwrQ0FBSUE7Ozs7OzhCQUdMLDhEQUFDb0I7O3NDQUNDLDhEQUFDbkIsK0NBQUlBOzs7OztzQ0FDTCw4REFBQ0MscURBQVVBOzs7Ozs7Ozs7Ozs7Ozs7OztJQUluQjtBQUNGO0FBRUEsaUVBQWVFLFVBQVVBLEVBQUMiLCJzb3VyY2VzIjpbIkM6XFxzaG9wX2hhcmRoYXRcXGZyb250ZW5kXFxwYWdlc1xcX2RvY3VtZW50LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vINCt0YLQvtGCINGE0LDQudC7INC/0L7Qt9Cy0L7Qu9GP0LXRgiDQvdCw0YHRgtGA0L7QuNGC0Ywg0YLQtdCzIDxodG1sPiDQuCA8Ym9keT4g0LTQu9GPINCy0YHQtdCz0L4g0L/RgNC40LvQvtC20LXQvdC40Y8uXHJcbi8vICDQl9C00LXRgdGMINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyBzdHlsZWQtY29tcG9uZW50cyDQtNC70Y8g0YHRgtC40LvQuNC30LDRhtC40Lgg0L3QsCDRgdGC0L7RgNC+0L3QtSDRgdC10YDQstC10YDQsC4gXHJcbi8vICAgU2VydmVyU3R5bGVTaGVldCDRgdC+0LHQuNGA0LDQtdGCINGB0YLQuNC70Lgg0LrQvtC80L/QvtC90LXQvdGC0L7QsiDQv9GA0Lgg0YDQtdC90LTQtdGA0LjQvdCz0LUg0YHRgtGA0LDQvdC40YbRiyDQuCDQtNC+0LHQsNCy0LvRj9C10YIg0LjRhSDQsiA8aGVhZD4uXHJcblxyXG5cclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IERvY3VtZW50LCB7IEh0bWwsIEhlYWQsIE1haW4sIE5leHRTY3JpcHQgfSBmcm9tICduZXh0L2RvY3VtZW50JztcclxuaW1wb3J0IHsgU2VydmVyU3R5bGVTaGVldCB9IGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcclxuXHJcbmNsYXNzIE15RG9jdW1lbnQgZXh0ZW5kcyBEb2N1bWVudCB7XHJcbiAgc3RhdGljIGFzeW5jIGdldEluaXRpYWxQcm9wcyhjdHgpIHtcclxuICAgIGNvbnN0IHNoZWV0ID0gbmV3IFNlcnZlclN0eWxlU2hlZXQoKTsgLy8g0KHQvtC30LTQsNC10Lwg0Y3QutC30LXQvNC/0LvRj9GAIFNlcnZlclN0eWxlU2hlZXRcclxuICAgIGNvbnN0IG9yaWdpbmFsUmVuZGVyUGFnZSA9IGN0eC5yZW5kZXJQYWdlO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGN0eC5yZW5kZXJQYWdlID0gKCkgPT5cclxuICAgICAgICBvcmlnaW5hbFJlbmRlclBhZ2Uoe1xyXG4gICAgICAgICAgZW5oYW5jZUFwcDogKEFwcCkgPT4gKHByb3BzKSA9PlxyXG4gICAgICAgICAgICBzaGVldC5jb2xsZWN0U3R5bGVzKDxBcHAgey4uLnByb3BzfSAvPiksIC8vINCY0YHQv9C+0LvRjNC30YPQtdC8IGNvbGxlY3RTdHlsZXMg0LTQu9GPINGB0LHQvtGA0LAg0YHRgtC40LvQtdC5XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zdCBpbml0aWFsUHJvcHMgPSBhd2FpdCBEb2N1bWVudC5nZXRJbml0aWFsUHJvcHMoY3R4KTtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5pbml0aWFsUHJvcHMsXHJcbiAgICAgICAgc3R5bGVzOiAoXHJcbiAgICAgICAgICA8PlxyXG4gICAgICAgICAgICB7aW5pdGlhbFByb3BzLnN0eWxlc31cclxuICAgICAgICAgICAge3NoZWV0LmdldFN0eWxlRWxlbWVudCgpfSB7Lyog0J/QvtC70YPRh9Cw0LXQvCDQuCDQtNC+0LHQsNCy0LvRj9C10Lwg0YHRgtC40LvQuCDQsiBoZWFkICovfVxyXG4gICAgICAgICAgPC8+XHJcbiAgICAgICAgKSxcclxuICAgICAgfTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHNoZWV0LnNlYWwoKTsgLy8g0JfQsNCy0LXRgNGI0LDQtdC8INGB0LHQvtGAINGB0YLQuNC70LXQuVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPEh0bWwgbGFuZz1cImVuXCI+XHJcbiAgICAgICAgPEhlYWQ+XHJcbiAgICAgICAgICB7Lyog0JLQsNGI0Lgg0LzQtdGC0LAt0YLQtdCz0Lgg0Lgg0YHRgdGL0LvQutC4INC30LTQtdGB0YwgKi99XHJcbiAgICAgICAgPC9IZWFkPlxyXG4gICAgICAgIDxib2R5PlxyXG4gICAgICAgICAgPE1haW4gLz5cclxuICAgICAgICAgIDxOZXh0U2NyaXB0IC8+XHJcbiAgICAgICAgPC9ib2R5PlxyXG4gICAgICA8L0h0bWw+XHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTXlEb2N1bWVudDtcclxuIl0sIm5hbWVzIjpbIlJlYWN0IiwiRG9jdW1lbnQiLCJIdG1sIiwiSGVhZCIsIk1haW4iLCJOZXh0U2NyaXB0IiwiU2VydmVyU3R5bGVTaGVldCIsIk15RG9jdW1lbnQiLCJnZXRJbml0aWFsUHJvcHMiLCJjdHgiLCJzaGVldCIsIm9yaWdpbmFsUmVuZGVyUGFnZSIsInJlbmRlclBhZ2UiLCJlbmhhbmNlQXBwIiwiQXBwIiwicHJvcHMiLCJjb2xsZWN0U3R5bGVzIiwiaW5pdGlhbFByb3BzIiwic3R5bGVzIiwiZ2V0U3R5bGVFbGVtZW50Iiwic2VhbCIsInJlbmRlciIsImxhbmciLCJib2R5Il0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./pages/_document.js\n");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "styled-components":
/*!************************************!*\
  !*** external "styled-components" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("styled-components");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("(pages-dir-node)/./pages/_document.js")));
module.exports = __webpack_exports__;

})();