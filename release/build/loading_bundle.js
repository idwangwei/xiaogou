!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return e[r].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={};t.m=e,t.c=n,t.p="",t(0)}({0:function(e,t,n){"use strict";var r=n(161),o=function(e){return e&&e.__esModule?e:{default:e}}(r);n(162);var i=document.createElement("div");i.setAttribute("class","loadingScene loadingSceneHide");var a=document.createElement("img");a.setAttribute("src",o.default),a.setAttribute("width","250px"),a.setAttribute("height","250px");var s=[["学习就像跑马拉松一样","贵在坚持和耐久"],["太阳每天都是新的","你是否每天都在努力"]],c=Math.floor(10*Math.random())%2,l=document.createElement("p");l.setAttribute("style","width:100%;text-align:center;color: #1973ac;font-weight: bolder;font-size: 16px;"),l.innerHTML=s[c][0];var u=document.createElement("p");u.setAttribute("style","width:100%;text-align:center;color: #1973ac;font-weight: bolder;font-size: 16px;"),u.innerHTML=s[c][1],i.appendChild(a);var d={show:function(){var e=document.querySelector(".loadingScene");e?e.setAttribute("class","loadingScene loadingSceneShow"):(document.documentElement.appendChild(i),e=document.querySelector(".loadingScene"),e.setAttribute("class","loadingScene loadingSceneShow"))},hide:function(){var e=document.querySelector(".loadingScene");e&&e.setAttribute("class","loadingScene loadingSceneHide")},loadCordova:function(){try{var e=localStorage.assetPath,t=JSON.parse(e).url.split("/"),n=t.splice(0,t.length-1),r=n.join("/")+"/cordova.js",o=document.createElement("script");o.setAttribute("src",r),document.documentElement.appendChild(o)}catch(e){console.log(e)}}};localStorage.setItem("dirLocal",0),window.loadingScene=d,d.show()},146:function(e,t){e.exports=function(){var e=[];return e.toString=function(){for(var e=[],t=0;t<this.length;t++){var n=this[t];n[2]?e.push("@media "+n[2]+"{"+n[1]+"}"):e.push(n[1])}return e.join("")},e.i=function(t,n){"string"==typeof t&&(t=[[null,t,""]]);for(var r={},o=0;o<this.length;o++){var i=this[o][0];"number"==typeof i&&(r[i]=!0)}for(o=0;o<t.length;o++){var a=t[o];"number"==typeof a[0]&&r[a[0]]||(n&&!a[2]?a[2]=n:n&&(a[2]="("+a[2]+") and ("+n+")"),e.push(a))}},e}},147:function(e,t,n){function r(e,t){for(var n=0;n<e.length;n++){var r=e[n],o=p[r.id];if(o){o.refs++;for(var i=0;i<o.parts.length;i++)o.parts[i](r.parts[i]);for(;i<r.parts.length;i++)o.parts.push(l(r.parts[i],t))}else{for(var a=[],i=0;i<r.parts.length;i++)a.push(l(r.parts[i],t));p[r.id]={id:r.id,refs:1,parts:a}}}}function o(e){for(var t=[],n={},r=0;r<e.length;r++){var o=e[r],i=o[0],a=o[1],s=o[2],c=o[3],l={css:a,media:s,sourceMap:c};n[i]?n[i].parts.push(l):t.push(n[i]={id:i,parts:[l]})}return t}function i(e,t){var n=g(),r=S[S.length-1];if("top"===e.insertAt)r?r.nextSibling?n.insertBefore(t,r.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),S.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(t)}}function a(e){e.parentNode.removeChild(e);var t=S.indexOf(e);t>=0&&S.splice(t,1)}function s(e){var t=document.createElement("style");return t.type="text/css",i(e,t),t}function c(e){var t=document.createElement("link");return t.rel="stylesheet",i(e,t),t}function l(e,t){var n,r,o;if(t.singleton){var i=b++;n=m||(m=s(t)),r=u.bind(null,n,i,!1),o=u.bind(null,n,i,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=c(t),r=f.bind(null,n),o=function(){a(n),n.href&&URL.revokeObjectURL(n.href)}):(n=s(t),r=d.bind(null,n),o=function(){a(n)});return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else o()}}function u(e,t,n,r){var o=n?"":r.css;if(e.styleSheet)e.styleSheet.cssText=x(t,o);else{var i=document.createTextNode(o),a=e.childNodes;a[t]&&e.removeChild(a[t]),a.length?e.insertBefore(i,a[t]):e.appendChild(i)}}function d(e,t){var n=t.css,r=t.media;if(r&&e.setAttribute("media",r),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}function f(e,t){var n=t.css,r=t.sourceMap;r&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */");var o=new Blob([n],{type:"text/css"}),i=e.href;e.href=URL.createObjectURL(o),i&&URL.revokeObjectURL(i)}var p={},h=function(e){var t;return function(){return void 0===t&&(t=e.apply(this,arguments)),t}},v=h(function(){return/msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase())}),g=h(function(){return document.head||document.getElementsByTagName("head")[0]}),m=null,b=0,S=[];e.exports=function(e,t){t=t||{},void 0===t.singleton&&(t.singleton=v()),void 0===t.insertAt&&(t.insertAt="bottom");var n=o(e);return r(n,t),function(e){for(var i=[],a=0;a<n.length;a++){var s=n[a],c=p[s.id];c.refs--,i.push(c)}if(e){r(o(e),t)}for(var a=0;a<i.length;a++){var c=i[a];if(0===c.refs){for(var l=0;l<c.parts.length;l++)c.parts[l]();delete p[c.id]}}}};var x=function(){var e=[];return function(t,n){return e[t]=n,e.filter(Boolean).join("\n")}}()},161:function(e,t,n){e.exports=n.p+"images/logo.gif"},162:function(e,t,n){var r=n(163);"string"==typeof r&&(r=[[e.id,r,""]]);n(147)(r,{});r.locals&&(e.exports=r.locals)},163:function(e,t,n){t=e.exports=n(146)(),t.push([e.id,".loadingScene {\r\n    position: fixed;\r\n    left: 0;\r\n    top: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    z-index: 3000;\r\n    background: white;\r\n}\r\n\r\n.loadingSceneShow {\r\n    display: flex;\r\n    display: -webkit-flex;\r\n    flex-direction: column;\r\n    -webkit-flex-direction: column;\r\n    align-items: center;\r\n    -webkit-align-items: center;\r\n    justify-content: center;\r\n    -webkit-justify-content: center;\r\n}\r\n\r\n.loadingSceneHide {\r\n    display: none;\r\n}",""])}});