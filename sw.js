!function(t){function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/",e(e.s="naf7")}({DuR2:function(t,e){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(n=window)}t.exports=n},NsDR:function(t,e,n){"use strict";(function(t){function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var o=n("a4gv"),i=n.n(o),s=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),a=function(){function e(){r(this,e)}return s(e,null,[{key:"_validateResponse",value:function(t){if(!t.ok)throw Error(t.statusText);return t}},{key:"_readResponseAsJSON",value:function(t){return t.json()}},{key:"storeOfflineForm",value:function(t){var e=this;this.DB.then(function(n){var r=n.transaction(e.DB_OFFLINE_FORMS_STORE,"readwrite");return r.objectStore(e.DB_OFFLINE_FORMS_STORE).put(t),r.complete})}},{key:"getOfflineForms",value:function(){var t=this;return new Promise(function(e,n){t.DB.then(function(e){return e.transaction(t.DB_OFFLINE_FORMS_STORE).objectStore(t.DB_OFFLINE_FORMS_STORE).getAll()}).then(function(t){return e(t)}).catch(function(t){return n(t)})})}},{key:"removeOfflineForm",value:function(t){var e=this;this.DB.then(function(n){n.transaction(e.DB_OFFLINE_FORMS_STORE,"readwrite").objectStore(e.DB_OFFLINE_FORMS_STORE).delete(t)})}},{key:"fetchRestaurants",value:function(n){var r=this;t(e.DATABASE_URL+"/restaurants").then(this._validateResponse).then(this._readResponseAsJSON).then(function(t){r.DB.then(function(e){var n=e.transaction(r.DB_STORE,"readwrite"),o=n.objectStore(r.DB_STORE);return t.forEach(function(t){o.put(t)}),n.complete}),n(null,t)}).catch(function(t){r.DB.then(function(t){return t.transaction(r.DB_STORE).objectStore(r.DB_STORE).getAll()}).then(function(t){return n(null,t)}).catch(function(t){return n(t,null)})})}},{key:"fetchRestaurantById",value:function(n,r){var o=this;t(e.DATABASE_URL+"/restaurants/"+n).then(this._validateResponse).then(this._readResponseAsJSON).then(function(t){o.DB.then(function(e){e.transaction(o.DB_STORE,"readwrite").objectStore(o.DB_STORE).put(t)}),r(null,t)}).catch(function(t){o.DB.then(function(t){return t.transaction(o.DB_STORE).objectStore(o.DB_STORE).get(parseInt(n))}).then(function(t){return r(null,t)}).catch(function(){return r("Restaurant does not exist",null)})})}},{key:"favoriteRestaurant",value:function(n,r){var o=this;return new Promise(function(i,s){t(e.DATABASE_URL+"/restaurants/"+n+"?is_favorite="+r,{method:"PUT"}).then(o._validateResponse).then(o._readResponseAsJSON).then(function(t){o.DB.then(function(e){e.transaction(o.DB_STORE,"readwrite").objectStore(o.DB_STORE).put(t)}),i(t)}).catch(function(t){console.error(t),o.DB.then(function(t){return t.transaction(o.DB_STORE).objectStore(o.DB_STORE).get(parseInt(n))}).then(function(t){return i(t)}).catch(function(t){return s(t)})})})}},{key:"fetchRestaurantReviews",value:function(n,r){var o=this;t(e.DATABASE_URL+"/reviews?restaurant_id="+n).then(this._validateResponse).then(this._readResponseAsJSON).then(function(t){o.DB.then(function(e){e.transaction(o.DB_REVIEWS_STORE,"readwrite").objectStore(o.DB_REVIEWS_STORE).put({id:parseInt(n),reviews:t})}),r(null,t)}).catch(function(t){o.DB.then(function(t){return t.transaction(o.DB_REVIEWS_STORE).objectStore(o.DB_REVIEWS_STORE).get(parseInt(n))}).then(function(t){return r(null,t.reviews)}).catch(function(){return r("No reviews yet!",null)})})}},{key:"postRestaurantReview",value:function(n){var r=this;return new Promise(function(o,i){t(e.DATABASE_URL+"/reviews",{method:"POST",body:n}).then(r._validateResponse).then(r._readResponseAsJSON).then(function(t){o(t)}).catch(function(t){i(t)})})}},{key:"fetchRestaurantByCuisine",value:function(t,n){e.fetchRestaurants(function(e,r){if(e)n(e,null);else{var o=r.filter(function(e){return e.cuisine_type==t});n(null,o)}})}},{key:"fetchRestaurantByNeighborhood",value:function(t,n){e.fetchRestaurants(function(e,r){if(e)n(e,null);else{var o=r.filter(function(e){return e.neighborhood==t});n(null,o)}})}},{key:"fetchRestaurantByCuisineAndNeighborhood",value:function(t,n,r){e.fetchRestaurants(function(e,o){if(e)r(e,null);else{var i=o;"all"!=t&&(i=i.filter(function(e){return e.cuisine_type==t})),"all"!=n&&(i=i.filter(function(t){return t.neighborhood==n})),r(null,i)}})}},{key:"fetchNeighborhoods",value:function(t){e.fetchRestaurants(function(e,n){if(e)t(e,null);else{var r=n.map(function(t,e){return n[e].neighborhood}),o=r.filter(function(t,e){return r.indexOf(t)==e});t(null,o)}})}},{key:"fetchCuisines",value:function(t){e.fetchRestaurants(function(e,n){if(e)t(e,null);else{var r=n.map(function(t,e){return n[e].cuisine_type}),o=r.filter(function(t,e){return r.indexOf(t)==e});t(null,o)}})}},{key:"urlForRestaurant",value:function(t){return"./restaurant.html?id="+t.id}},{key:"imageSrcSetUrlForRestaurant",value:function(t){var e=t.photograph?t.photograph.split(/\./):[t.id,"jpg"];return"/img_dist/"+e[0]+"-660_2x.webp 2x, /img_dist/"+e[0]+"-330_1x.webp,\n      /img_dist/"+e[0]+"-660_2x."+(e[1]||"jpg")+" 2x, /img_dist/"+e[0]+"-330_1x."+(e[1]||"jpg")}},{key:"imageUrlForRestaurant",value:function(t){var e=t.photograph?t.photograph.split(/\./):[t.id,"jpg"];return"/img/"+e[0]+"."+(e[1]||"jpg")}},{key:"imageSrcSetUrlForReviewPage",value:function(t){var e=t.photograph?t.photograph.split(/\./):[t.id,"jpg"];return"/img_dist/"+e[0]+".webp 800w, /img_dist/"+e[0]+"-660_2x.webp 660w, /img_dist/"+e[0]+"-330_1x.webp 330w,\n      /img/"+e[0]+"."+(e[1]||"jpg")+" 800w, /img_dist/"+e[0]+"-660_2x."+(e[1]||"jpg")+" 660w, /img_dist/"+e[0]+"-330_1x."+(e[1]||"jpg")+" 330w"}},{key:"mapMarkerForRestaurant",value:function(t,n){return new google.maps.Marker({position:t.latlng,title:t.name,url:e.urlForRestaurant(t),map:n,animation:google.maps.Animation.DROP})}},{key:"DATABASE_URL",get:function(){return"http://localhost:1337"}},{key:"DB_VERSION",get:function(){return 3}},{key:"DB_NAME",get:function(){return"restaurants"}},{key:"DB_STORE",get:function(){return"list"}},{key:"DB_REVIEWS_STORE",get:function(){return"reviews"}},{key:"DB_OFFLINE_FORMS_STORE",get:function(){return"offline-forms"}},{key:"DB",get:function(){var t=this;return i.a.open(this.DB_NAME,this.DB_VERSION,function(e){switch(e.oldVersion){case 0:e.createObjectStore(t.DB_STORE,{keyPath:"id"});case 1:e.createObjectStore(t.DB_REVIEWS_STORE,{keyPath:"id"});case 2:e.createObjectStore(t.DB_OFFLINE_FORMS_STORE,{keyPath:"formid"})}})}}]),e}();e.a=a}).call(e,n("rp8n"))},a4gv:function(t,e,n){"use strict";!function(){function e(t){return Array.prototype.slice.call(t)}function n(t){return new Promise(function(e,n){t.onsuccess=function(){e(t.result)},t.onerror=function(){n(t.error)}})}function r(t,e,r){var o,i=new Promise(function(i,s){o=t[e].apply(t,r),n(o).then(i,s)});return i.request=o,i}function o(t,e,n){var o=r(t,e,n);return o.then(function(t){if(t)return new f(t,o.request)})}function i(t,e,n){n.forEach(function(n){Object.defineProperty(t.prototype,n,{get:function(){return this[e][n]},set:function(t){this[e][n]=t}})})}function s(t,e,n,o){o.forEach(function(o){o in n.prototype&&(t.prototype[o]=function(){return r(this[e],o,arguments)})})}function a(t,e,n,r){r.forEach(function(r){r in n.prototype&&(t.prototype[r]=function(){return this[e][r].apply(this[e],arguments)})})}function u(t,e,n,r){r.forEach(function(r){r in n.prototype&&(t.prototype[r]=function(){return o(this[e],r,arguments)})})}function c(t){this._index=t}function f(t,e){this._cursor=t,this._request=e}function h(t){this._store=t}function l(t){this._tx=t,this.complete=new Promise(function(e,n){t.oncomplete=function(){e()},t.onerror=function(){n(t.error)},t.onabort=function(){n(t.error)}})}function p(t,e,n){this._db=t,this.oldVersion=e,this.transaction=new l(n)}function d(t){this._db=t}i(c,"_index",["name","keyPath","multiEntry","unique"]),s(c,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),u(c,"_index",IDBIndex,["openCursor","openKeyCursor"]),i(f,"_cursor",["direction","key","primaryKey","value"]),s(f,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(t){t in IDBCursor.prototype&&(f.prototype[t]=function(){var e=this,r=arguments;return Promise.resolve().then(function(){return e._cursor[t].apply(e._cursor,r),n(e._request).then(function(t){if(t)return new f(t,e._request)})})})}),h.prototype.createIndex=function(){return new c(this._store.createIndex.apply(this._store,arguments))},h.prototype.index=function(){return new c(this._store.index.apply(this._store,arguments))},i(h,"_store",["name","keyPath","indexNames","autoIncrement"]),s(h,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),u(h,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),a(h,"_store",IDBObjectStore,["deleteIndex"]),l.prototype.objectStore=function(){return new h(this._tx.objectStore.apply(this._tx,arguments))},i(l,"_tx",["objectStoreNames","mode"]),a(l,"_tx",IDBTransaction,["abort"]),p.prototype.createObjectStore=function(){return new h(this._db.createObjectStore.apply(this._db,arguments))},i(p,"_db",["name","version","objectStoreNames"]),a(p,"_db",IDBDatabase,["deleteObjectStore","close"]),d.prototype.transaction=function(){return new l(this._db.transaction.apply(this._db,arguments))},i(d,"_db",["name","version","objectStoreNames"]),a(d,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(t){[h,c].forEach(function(n){t in n.prototype&&(n.prototype[t.replace("open","iterate")]=function(){var n=e(arguments),r=n[n.length-1],o=this._store||this._index,i=o[t].apply(o,n.slice(0,-1));i.onsuccess=function(){r(i.result)}})})}),[c,h].forEach(function(t){t.prototype.getAll||(t.prototype.getAll=function(t,e){var n=this,r=[];return new Promise(function(o){n.iterateCursor(t,function(t){return t?(r.push(t.value),void 0!==e&&r.length==e?void o(r):void t.continue()):void o(r)})})})});var y={open:function(t,e,n){var o=r(indexedDB,"open",[t,e]),i=o.request;return i&&(i.onupgradeneeded=function(t){n&&n(new p(i.result,t.oldVersion,i.transaction))}),o.then(function(t){return new d(t)})},delete:function(t){return r(indexedDB,"deleteDatabase",[t])}};t.exports=y,t.exports.default=t.exports}()},naf7:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),function(t){function e(e){return caches.open(o.images).then(function(n){return n.match(e.url).then(function(r){return r||t(e).then(function(t){return n.put(e.url,t.clone()),t})})})}var r=n("NsDR"),o={static:"restaurant-static-v4",images:"restaurant-images-v2"};self.addEventListener("install",function(t){t.waitUntil(caches.open(o.static).then(function(t){return t.addAll(["/index.html","/restaurant.html","/dist/styles.css","/dist/main.js","/dist/restaurant_info.js"])})),t.waitUntil(caches.open(o.images).then(function(t){r.a.fetchRestaurants(function(e,n){t.add(r.a.DATABASE_URL);for(var o in n)if(n.hasOwnProperty(o)){var i=n[o],s=i.photograph?i.photograph.split(/\./):[i.id,"jpg"];t.add("/img/"+s[0]+"."+(s[1]||"jpg")),t.add("/img_dist/"+s[0]+"-660_2x."+(s[1]||"jpg")),t.add("/img_dist/"+s[0]+"-330_1x."+(s[1]||"jpg")),t.add("/img_dist/"+s[0]+".webp"),t.add("/img_dist/"+s[0]+"-660_2x.webp"),t.add("/img_dist/"+s[0]+"-330_1x.webp")}})}))}),self.addEventListener("activate",function(t){t.waitUntil(caches.keys().then(function(t){return Promise.all(t.filter(function(t){return t.startsWith("restaurant-")&&!(o.static!==t||o.images!==t)}).map(function(t){return caches.delete(t)}))}))}),self.addEventListener("fetch",function(n){if("GET"==n.request.method){var r=new URL(n.request.url);if(r.origin===location.origin){if("/"===r.pathname)return void n.respondWith(caches.match("/index.html"));if(r.pathname.startsWith("/img/")||r.pathname.startsWith("/img_dist/"))return void n.respondWith(e(n.request));if(r.pathname.startsWith("/restaurant.html"))return void n.respondWith(caches.match("/restaurant.html"))}n.respondWith(caches.match(n.request).then(function(e){return e||t(n.request)}))}})}.call(e,n("rp8n"))},rp8n:function(t,e,n){(function(e){(function(){!function(t){"use strict";function e(t){if("string"!=typeof t&&(t=String(t)),/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(t))throw new TypeError("Invalid character in header field name");return t.toLowerCase()}function n(t){return"string"!=typeof t&&(t=String(t)),t}function r(t){var e={next:function(){var e=t.shift();return{done:void 0===e,value:e}}};return b.iterable&&(e[Symbol.iterator]=function(){return e}),e}function o(t){this.map={},t instanceof o?t.forEach(function(t,e){this.append(e,t)},this):Array.isArray(t)?t.forEach(function(t){this.append(t[0],t[1])},this):t&&Object.getOwnPropertyNames(t).forEach(function(e){this.append(e,t[e])},this)}function i(t){if(t.bodyUsed)return Promise.reject(new TypeError("Already read"));t.bodyUsed=!0}function s(t){return new Promise(function(e,n){t.onload=function(){e(t.result)},t.onerror=function(){n(t.error)}})}function a(t){var e=new FileReader,n=s(e);return e.readAsArrayBuffer(t),n}function u(t){var e=new FileReader,n=s(e);return e.readAsText(t),n}function c(t){for(var e=new Uint8Array(t),n=new Array(e.length),r=0;r<e.length;r++)n[r]=String.fromCharCode(e[r]);return n.join("")}function f(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function h(){return this.bodyUsed=!1,this._initBody=function(t){if(this._bodyInit=t,t)if("string"==typeof t)this._bodyText=t;else if(b.blob&&Blob.prototype.isPrototypeOf(t))this._bodyBlob=t;else if(b.formData&&FormData.prototype.isPrototypeOf(t))this._bodyFormData=t;else if(b.searchParams&&URLSearchParams.prototype.isPrototypeOf(t))this._bodyText=t.toString();else if(b.arrayBuffer&&b.blob&&v(t))this._bodyArrayBuffer=f(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer]);else{if(!b.arrayBuffer||!ArrayBuffer.prototype.isPrototypeOf(t)&&!w(t))throw new Error("unsupported BodyInit type");this._bodyArrayBuffer=f(t)}else this._bodyText="";this.headers.get("content-type")||("string"==typeof t?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):b.searchParams&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},b.blob&&(this.blob=function(){var t=i(this);if(t)return t;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?i(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(a)}),this.text=function(){var t=i(this);if(t)return t;if(this._bodyBlob)return u(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(c(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},b.formData&&(this.formData=function(){return this.text().then(d)}),this.json=function(){return this.text().then(JSON.parse)},this}function l(t){var e=t.toUpperCase();return g.indexOf(e)>-1?e:t}function p(t,e){e=e||{};var n=e.body;if(t instanceof p){if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new o(t.headers)),this.method=t.method,this.mode=t.mode,n||null==t._bodyInit||(n=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=e.credentials||this.credentials||"omit",!e.headers&&this.headers||(this.headers=new o(e.headers)),this.method=l(e.method||this.method||"GET"),this.mode=e.mode||this.mode||null,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&n)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(n)}function d(t){var e=new FormData;return t.trim().split("&").forEach(function(t){if(t){var n=t.split("="),r=n.shift().replace(/\+/g," "),o=n.join("=").replace(/\+/g," ");e.append(decodeURIComponent(r),decodeURIComponent(o))}}),e}function y(t){var e=new o;return t.replace(/\r?\n[\t ]+/g," ").split(/\r?\n/).forEach(function(t){var n=t.split(":"),r=n.shift().trim();if(r){var o=n.join(":").trim();e.append(r,o)}}),e}function _(t,e){e||(e={}),this.type="default",this.status=void 0===e.status?200:e.status,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in e?e.statusText:"OK",this.headers=new o(e.headers),this.url=e.url||"",this._initBody(t)}if(!t.fetch){var b={searchParams:"URLSearchParams"in t,iterable:"Symbol"in t&&"iterator"in Symbol,blob:"FileReader"in t&&"Blob"in t&&function(){try{return new Blob,!0}catch(t){return!1}}(),formData:"FormData"in t,arrayBuffer:"ArrayBuffer"in t};if(b.arrayBuffer)var m=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],v=function(t){return t&&DataView.prototype.isPrototypeOf(t)},w=ArrayBuffer.isView||function(t){return t&&m.indexOf(Object.prototype.toString.call(t))>-1};o.prototype.append=function(t,r){t=e(t),r=n(r);var o=this.map[t];this.map[t]=o?o+","+r:r},o.prototype.delete=function(t){delete this.map[e(t)]},o.prototype.get=function(t){return t=e(t),this.has(t)?this.map[t]:null},o.prototype.has=function(t){return this.map.hasOwnProperty(e(t))},o.prototype.set=function(t,r){this.map[e(t)]=n(r)},o.prototype.forEach=function(t,e){for(var n in this.map)this.map.hasOwnProperty(n)&&t.call(e,this.map[n],n,this)},o.prototype.keys=function(){var t=[];return this.forEach(function(e,n){t.push(n)}),r(t)},o.prototype.values=function(){var t=[];return this.forEach(function(e){t.push(e)}),r(t)},o.prototype.entries=function(){var t=[];return this.forEach(function(e,n){t.push([n,e])}),r(t)},b.iterable&&(o.prototype[Symbol.iterator]=o.prototype.entries);var g=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];p.prototype.clone=function(){return new p(this,{body:this._bodyInit})},h.call(p.prototype),h.call(_.prototype),_.prototype.clone=function(){return new _(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new o(this.headers),url:this.url})},_.error=function(){var t=new _(null,{status:0,statusText:""});return t.type="error",t};var R=[301,302,303,307,308];_.redirect=function(t,e){if(-1===R.indexOf(e))throw new RangeError("Invalid status code");return new _(null,{status:e,headers:{location:t}})},t.Headers=o,t.Request=p,t.Response=_,t.fetch=function(t,e){return new Promise(function(n,r){var o=new p(t,e),i=new XMLHttpRequest;i.onload=function(){var t={status:i.status,statusText:i.statusText,headers:y(i.getAllResponseHeaders()||"")};t.url="responseURL"in i?i.responseURL:t.headers.get("X-Request-URL");var e="response"in i?i.response:i.responseText;n(new _(e,t))},i.onerror=function(){r(new TypeError("Network request failed"))},i.ontimeout=function(){r(new TypeError("Network request failed"))},i.open(o.method,o.url,!0),"include"===o.credentials?i.withCredentials=!0:"omit"===o.credentials&&(i.withCredentials=!1),"responseType"in i&&b.blob&&(i.responseType="blob"),o.headers.forEach(function(t,e){i.setRequestHeader(e,t)}),i.send(void 0===o._bodyInit?null:o._bodyInit)})},t.fetch.polyfill=!0}}("undefined"!=typeof self?self:this),t.exports=e.fetch}).call(e)}).call(e,n("DuR2"))}});