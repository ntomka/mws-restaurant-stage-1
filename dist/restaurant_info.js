!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/dist/",t(t.s="oDnR")}({DuR2:function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},NsDR:function(e,t,n){"use strict";(function(e){function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o=n("a4gv"),i=n.n(o),a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=function(){function t(){r(this,t)}return a(t,null,[{key:"_validateResponse",value:function(e){if(!e.ok)throw Error(e.statusText);return e}},{key:"_readResponseAsJSON",value:function(e){return e.json()}},{key:"fetchRestaurants",value:function(n){var r=this;e(t.DATABASE_URL).then(this._validateResponse).then(this._readResponseAsJSON).then(function(e){r.DB.then(function(t){var n=t.transaction(r.DB_STORE,"readwrite"),o=n.objectStore(r.DB_STORE);return e.forEach(function(e){o.put(e)}),n.complete}),n(null,e)}).catch(function(e){r.DB.then(function(e){return e.transaction(r.DB_STORE).objectStore(r.DB_STORE).getAll()}).then(function(e){return n(null,e)}).catch(function(e){return n(e,null)})})}},{key:"fetchRestaurantById",value:function(n,r){var o=this;e(t.DATABASE_URL+"/"+n).then(this._validateResponse).then(this._readResponseAsJSON).then(function(e){o.DB.then(function(t){t.transaction(o.DB_STORE,"readwrite").objectStore(o.DB_STORE).put(e)}),r(null,e)}).catch(function(e){o.DB.then(function(e){return e.transaction(o.DB_STORE).objectStore(o.DB_STORE).get(parseInt(n))}).then(function(e){return r(null,e)}).catch(function(){return r("Restaurant does not exist",null)})})}},{key:"fetchRestaurantByCuisine",value:function(e,n){t.fetchRestaurants(function(t,r){if(t)n(t,null);else{var o=r.filter(function(t){return t.cuisine_type==e});n(null,o)}})}},{key:"fetchRestaurantByNeighborhood",value:function(e,n){t.fetchRestaurants(function(t,r){if(t)n(t,null);else{var o=r.filter(function(t){return t.neighborhood==e});n(null,o)}})}},{key:"fetchRestaurantByCuisineAndNeighborhood",value:function(e,n,r){t.fetchRestaurants(function(t,o){if(t)r(t,null);else{var i=o;"all"!=e&&(i=i.filter(function(t){return t.cuisine_type==e})),"all"!=n&&(i=i.filter(function(e){return e.neighborhood==n})),r(null,i)}})}},{key:"fetchNeighborhoods",value:function(e){t.fetchRestaurants(function(t,n){if(t)e(t,null);else{var r=n.map(function(e,t){return n[t].neighborhood}),o=r.filter(function(e,t){return r.indexOf(e)==t});e(null,o)}})}},{key:"fetchCuisines",value:function(e){t.fetchRestaurants(function(t,n){if(t)e(t,null);else{var r=n.map(function(e,t){return n[t].cuisine_type}),o=r.filter(function(e,t){return r.indexOf(e)==t});e(null,o)}})}},{key:"urlForRestaurant",value:function(e){return"./restaurant.html?id="+e.id}},{key:"imageSrcSetUrlForRestaurant",value:function(e){var t=e.photograph?e.photograph.split(/\./):[e.id,"jpg"];return"/img_dist/"+t[0]+"-660_2x."+(t[1]||"jpg")+" 2x, /img_dist/"+t[0]+"-330_1x."+(t[1]||"jpg")}},{key:"imageUrlForRestaurant",value:function(e){var t=e.photograph?e.photograph.split(/\./):[e.id,"jpg"];return"/img/"+t[0]+"."+(t[1]||"jpg")}},{key:"imageSrcSetUrlForReviewPage",value:function(e){var t=e.photograph?e.photograph.split(/\./):[e.id,"jpg"];return"/img/"+t[0]+"."+(t[1]||"jpg")+" 800w, /img_dist/"+t[0]+"-660_2x."+(t[1]||"jpg")+" 660w, /img_dist/"+t[0]+"-330_1x."+(t[1]||"jpg")+" 330w"}},{key:"mapMarkerForRestaurant",value:function(e,n){return new google.maps.Marker({position:e.latlng,title:e.name,url:t.urlForRestaurant(e),map:n,animation:google.maps.Animation.DROP})}},{key:"DATABASE_URL",get:function(){return"http://localhost:1337/restaurants"}},{key:"DB_VERSION",get:function(){return 1}},{key:"DB_NAME",get:function(){return"restaurants"}},{key:"DB_STORE",get:function(){return"list"}},{key:"DB",get:function(){var e=this;return i.a.open(this.DB_NAME,this.DB_VERSION,function(t){switch(t.oldVersion){case 0:t.createObjectStore(e.DB_STORE,{keyPath:"id"})}})}}]),t}();t.a=s}).call(t,n("rp8n"))},a4gv:function(e,t,n){"use strict";!function(){function t(e){return Array.prototype.slice.call(e)}function n(e){return new Promise(function(t,n){e.onsuccess=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function r(e,t,r){var o,i=new Promise(function(i,a){o=e[t].apply(e,r),n(o).then(i,a)});return i.request=o,i}function o(e,t,n){var o=r(e,t,n);return o.then(function(e){if(e)return new l(e,o.request)})}function i(e,t,n){n.forEach(function(n){Object.defineProperty(e.prototype,n,{get:function(){return this[t][n]},set:function(e){this[t][n]=e}})})}function a(e,t,n,o){o.forEach(function(o){o in n.prototype&&(e.prototype[o]=function(){return r(this[t],o,arguments)})})}function s(e,t,n,r){r.forEach(function(r){r in n.prototype&&(e.prototype[r]=function(){return this[t][r].apply(this[t],arguments)})})}function u(e,t,n,r){r.forEach(function(r){r in n.prototype&&(e.prototype[r]=function(){return o(this[t],r,arguments)})})}function c(e){this._index=e}function l(e,t){this._cursor=e,this._request=t}function f(e){this._store=e}function d(e){this._tx=e,this.complete=new Promise(function(t,n){e.oncomplete=function(){t()},e.onerror=function(){n(e.error)},e.onabort=function(){n(e.error)}})}function h(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new d(n)}function p(e){this._db=e}i(c,"_index",["name","keyPath","multiEntry","unique"]),a(c,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),u(c,"_index",IDBIndex,["openCursor","openKeyCursor"]),i(l,"_cursor",["direction","key","primaryKey","value"]),a(l,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(e){e in IDBCursor.prototype&&(l.prototype[e]=function(){var t=this,r=arguments;return Promise.resolve().then(function(){return t._cursor[e].apply(t._cursor,r),n(t._request).then(function(e){if(e)return new l(e,t._request)})})})}),f.prototype.createIndex=function(){return new c(this._store.createIndex.apply(this._store,arguments))},f.prototype.index=function(){return new c(this._store.index.apply(this._store,arguments))},i(f,"_store",["name","keyPath","indexNames","autoIncrement"]),a(f,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),u(f,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),s(f,"_store",IDBObjectStore,["deleteIndex"]),d.prototype.objectStore=function(){return new f(this._tx.objectStore.apply(this._tx,arguments))},i(d,"_tx",["objectStoreNames","mode"]),s(d,"_tx",IDBTransaction,["abort"]),h.prototype.createObjectStore=function(){return new f(this._db.createObjectStore.apply(this._db,arguments))},i(h,"_db",["name","version","objectStoreNames"]),s(h,"_db",IDBDatabase,["deleteObjectStore","close"]),p.prototype.transaction=function(){return new d(this._db.transaction.apply(this._db,arguments))},i(p,"_db",["name","version","objectStoreNames"]),s(p,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(e){[f,c].forEach(function(n){e in n.prototype&&(n.prototype[e.replace("open","iterate")]=function(){var n=t(arguments),r=n[n.length-1],o=this._store||this._index,i=o[e].apply(o,n.slice(0,-1));i.onsuccess=function(){r(i.result)}})})}),[c,f].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,t){var n=this,r=[];return new Promise(function(o){n.iterateCursor(e,function(e){return e?(r.push(e.value),void 0!==t&&r.length==t?void o(r):void e.continue()):void o(r)})})})});var y={open:function(e,t,n){var o=r(indexedDB,"open",[e,t]),i=o.request;return i.onupgradeneeded=function(e){n&&n(new h(i.result,e.oldVersion,i.transaction))},o.then(function(e){return new p(e)})},delete:function(e){return r(indexedDB,"deleteDatabase",[e])}};e.exports=y,e.exports.default=e.exports}()},oDnR:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n("NsDR");self.map,"serviceWorker"in navigator&&navigator.serviceWorker.register("/sw.js",{scope:"/"}),window.initMap=function(){self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:self.restaurant.latlng,scrollwheel:!1}),r.a.mapMarkerForRestaurant(self.restaurant,self.map),document.getElementById("map-container").setAttribute("aria-label","Map with "+self.restaurant.name+" restaurant location")},document.addEventListener("DOMContentLoaded",function(e){o(function(e,t){if(e)console.error(e);else{c();var n=document.createElement("script");n.src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAPYV1tlwm9ftEe0p0cQWNeeXbptVadGXM&libraries=places&callback=initMap";document.getElementsByTagName("head")[0].appendChild(n)}})});var o=function(e){if(self.restaurant)return void e(null,self.restaurant);var t=l("id");t?r.a.fetchRestaurantById(t,function(t,n){if(self.restaurant=n,!n)return void console.error(t);i(),e(null,n)}):(error="No restaurant id in URL",e(error,null))},i=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:self.restaurant,t=document.getElementById("restaurant-name");t.innerHTML=e.name,t.setAttribute("aria-label",e.name+" restaurant"),document.getElementById("restaurant-address").innerHTML=e.address;var n=document.getElementById("restaurant-img");n.className="restaurant-img",n.src=r.a.imageUrlForRestaurant(e),n.srcset=r.a.imageSrcSetUrlForReviewPage(e),n.alt=e.name+" restaurant",document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type,e.operating_hours&&a(),s()},a=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:self.restaurant.operating_hours,t=document.getElementById("restaurant-hours");t.setAttribute("aria-label","Operating hours of "+self.restaurant.name+" restaurant");for(var n in e){var r=document.createElement("tr"),o=document.createElement("td");o.innerHTML=n,r.appendChild(o);var i=document.createElement("td");i.innerHTML=e[n],r.appendChild(i),t.appendChild(r)}},s=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:self.restaurant.reviews,t=document.getElementById("reviews-container"),n=document.createElement("h3");if(n.innerHTML="Reviews",t.appendChild(n),!e){var r=document.createElement("p");return r.innerHTML="No reviews yet!",void t.appendChild(r)}var o=document.getElementById("reviews-list");e.forEach(function(e){o.appendChild(u(e))}),t.appendChild(o)},u=function(e){var t=document.createElement("li"),n=document.createElement("div");n.className="review-title";var r=document.createElement("div");r.innerHTML=e.name,r.className="review-user-name",n.appendChild(r);var o=document.createElement("div");o.innerHTML=e.date,o.className="review-date",n.appendChild(o),t.appendChild(n);var i=document.createElement("div");i.innerHTML="Rating: "+e.rating,i.className="review-rating",t.appendChild(i);var a=document.createElement("p");return a.innerHTML=e.comments,t.appendChild(a),t},c=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:self.restaurant,t=document.getElementById("breadcrumb"),n=document.createElement("li"),o=document.createElement("a");o.href=r.a.urlForRestaurant(e),o.title=e.name,o.innerHTML=e.name,o.setAttribute("aria-current","page"),n.appendChild(o),t.appendChild(n)},l=function(e,t){t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");var n=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)"),r=n.exec(t);return r?r[2]?decodeURIComponent(r[2].replace(/\+/g," ")):"":null}},rp8n:function(e,t,n){(function(t){(function(){!function(e){"use strict";function t(e){if("string"!=typeof e&&(e=String(e)),/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(e))throw new TypeError("Invalid character in header field name");return e.toLowerCase()}function n(e){return"string"!=typeof e&&(e=String(e)),e}function r(e){var t={next:function(){var t=e.shift();return{done:void 0===t,value:t}}};return b.iterable&&(t[Symbol.iterator]=function(){return t}),t}function o(e){this.map={},e instanceof o?e.forEach(function(e,t){this.append(t,e)},this):Array.isArray(e)?e.forEach(function(e){this.append(e[0],e[1])},this):e&&Object.getOwnPropertyNames(e).forEach(function(t){this.append(t,e[t])},this)}function i(e){if(e.bodyUsed)return Promise.reject(new TypeError("Already read"));e.bodyUsed=!0}function a(e){return new Promise(function(t,n){e.onload=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function s(e){var t=new FileReader,n=a(t);return t.readAsArrayBuffer(e),n}function u(e){var t=new FileReader,n=a(t);return t.readAsText(e),n}function c(e){for(var t=new Uint8Array(e),n=new Array(t.length),r=0;r<t.length;r++)n[r]=String.fromCharCode(t[r]);return n.join("")}function l(e){if(e.slice)return e.slice(0);var t=new Uint8Array(e.byteLength);return t.set(new Uint8Array(e)),t.buffer}function f(){return this.bodyUsed=!1,this._initBody=function(e){if(this._bodyInit=e,e)if("string"==typeof e)this._bodyText=e;else if(b.blob&&Blob.prototype.isPrototypeOf(e))this._bodyBlob=e;else if(b.formData&&FormData.prototype.isPrototypeOf(e))this._bodyFormData=e;else if(b.searchParams&&URLSearchParams.prototype.isPrototypeOf(e))this._bodyText=e.toString();else if(b.arrayBuffer&&b.blob&&g(e))this._bodyArrayBuffer=l(e.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer]);else{if(!b.arrayBuffer||!ArrayBuffer.prototype.isPrototypeOf(e)&&!_(e))throw new Error("unsupported BodyInit type");this._bodyArrayBuffer=l(e)}else this._bodyText="";this.headers.get("content-type")||("string"==typeof e?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):b.searchParams&&URLSearchParams.prototype.isPrototypeOf(e)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},b.blob&&(this.blob=function(){var e=i(this);if(e)return e;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?i(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(s)}),this.text=function(){var e=i(this);if(e)return e;if(this._bodyBlob)return u(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(c(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},b.formData&&(this.formData=function(){return this.text().then(p)}),this.json=function(){return this.text().then(JSON.parse)},this}function d(e){var t=e.toUpperCase();return w.indexOf(t)>-1?t:e}function h(e,t){t=t||{};var n=t.body;if(e instanceof h){if(e.bodyUsed)throw new TypeError("Already read");this.url=e.url,this.credentials=e.credentials,t.headers||(this.headers=new o(e.headers)),this.method=e.method,this.mode=e.mode,n||null==e._bodyInit||(n=e._bodyInit,e.bodyUsed=!0)}else this.url=String(e);if(this.credentials=t.credentials||this.credentials||"omit",!t.headers&&this.headers||(this.headers=new o(t.headers)),this.method=d(t.method||this.method||"GET"),this.mode=t.mode||this.mode||null,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&n)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(n)}function p(e){var t=new FormData;return e.trim().split("&").forEach(function(e){if(e){var n=e.split("="),r=n.shift().replace(/\+/g," "),o=n.join("=").replace(/\+/g," ");t.append(decodeURIComponent(r),decodeURIComponent(o))}}),t}function y(e){var t=new o;return e.replace(/\r?\n[\t ]+/g," ").split(/\r?\n/).forEach(function(e){var n=e.split(":"),r=n.shift().trim();if(r){var o=n.join(":").trim();t.append(r,o)}}),t}function m(e,t){t||(t={}),this.type="default",this.status=void 0===t.status?200:t.status,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in t?t.statusText:"OK",this.headers=new o(t.headers),this.url=t.url||"",this._initBody(e)}if(!e.fetch){var b={searchParams:"URLSearchParams"in e,iterable:"Symbol"in e&&"iterator"in Symbol,blob:"FileReader"in e&&"Blob"in e&&function(){try{return new Blob,!0}catch(e){return!1}}(),formData:"FormData"in e,arrayBuffer:"ArrayBuffer"in e};if(b.arrayBuffer)var v=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],g=function(e){return e&&DataView.prototype.isPrototypeOf(e)},_=ArrayBuffer.isView||function(e){return e&&v.indexOf(Object.prototype.toString.call(e))>-1};o.prototype.append=function(e,r){e=t(e),r=n(r);var o=this.map[e];this.map[e]=o?o+","+r:r},o.prototype.delete=function(e){delete this.map[t(e)]},o.prototype.get=function(e){return e=t(e),this.has(e)?this.map[e]:null},o.prototype.has=function(e){return this.map.hasOwnProperty(t(e))},o.prototype.set=function(e,r){this.map[t(e)]=n(r)},o.prototype.forEach=function(e,t){for(var n in this.map)this.map.hasOwnProperty(n)&&e.call(t,this.map[n],n,this)},o.prototype.keys=function(){var e=[];return this.forEach(function(t,n){e.push(n)}),r(e)},o.prototype.values=function(){var e=[];return this.forEach(function(t){e.push(t)}),r(e)},o.prototype.entries=function(){var e=[];return this.forEach(function(t,n){e.push([n,t])}),r(e)},b.iterable&&(o.prototype[Symbol.iterator]=o.prototype.entries);var w=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];h.prototype.clone=function(){return new h(this,{body:this._bodyInit})},f.call(h.prototype),f.call(m.prototype),m.prototype.clone=function(){return new m(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new o(this.headers),url:this.url})},m.error=function(){var e=new m(null,{status:0,statusText:""});return e.type="error",e};var E=[301,302,303,307,308];m.redirect=function(e,t){if(-1===E.indexOf(t))throw new RangeError("Invalid status code");return new m(null,{status:t,headers:{location:e}})},e.Headers=o,e.Request=h,e.Response=m,e.fetch=function(e,t){return new Promise(function(n,r){var o=new h(e,t),i=new XMLHttpRequest;i.onload=function(){var e={status:i.status,statusText:i.statusText,headers:y(i.getAllResponseHeaders()||"")};e.url="responseURL"in i?i.responseURL:e.headers.get("X-Request-URL");var t="response"in i?i.response:i.responseText;n(new m(t,e))},i.onerror=function(){r(new TypeError("Network request failed"))},i.ontimeout=function(){r(new TypeError("Network request failed"))},i.open(o.method,o.url,!0),"include"===o.credentials?i.withCredentials=!0:"omit"===o.credentials&&(i.withCredentials=!1),"responseType"in i&&b.blob&&(i.responseType="blob"),o.headers.forEach(function(e,t){i.setRequestHeader(t,e)}),i.send(void 0===o._bodyInit?null:o._bodyInit)})},e.fetch.polyfill=!0}}("undefined"!=typeof self?self:this),e.exports=t.fetch}).call(t)}).call(t,n("DuR2"))}});