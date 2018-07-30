!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/dist/",n(n.s="oDnR")}({DuR2:function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},NsDR:function(e,t,n){"use strict";(function(e){var r=n("a4gv"),o=n.n(r),i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();var a=function(){function t(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t)}return i(t,null,[{key:"_validateResponse",value:function(e){if(!e.ok)throw Error(e.statusText);return e}},{key:"_readResponseAsJSON",value:function(e){return e.json()}},{key:"storeOfflineForm",value:function(e){var t=this;this.DB.then(function(n){var r=n.transaction(t.DB_OFFLINE_FORMS_STORE,"readwrite");return r.objectStore(t.DB_OFFLINE_FORMS_STORE).put(e),r.complete})}},{key:"getOfflineForms",value:function(){var e=this;return new Promise(function(t,n){e.DB.then(function(t){return t.transaction(e.DB_OFFLINE_FORMS_STORE).objectStore(e.DB_OFFLINE_FORMS_STORE).getAll()}).then(function(e){return t(e)}).catch(function(e){return n(e)})})}},{key:"removeOfflineForm",value:function(e){var t=this;this.DB.then(function(n){n.transaction(t.DB_OFFLINE_FORMS_STORE,"readwrite").objectStore(t.DB_OFFLINE_FORMS_STORE).delete(e)})}},{key:"fetchRestaurants",value:function(n){var r=this;e(t.DATABASE_URL+"/restaurants").then(this._validateResponse).then(this._readResponseAsJSON).then(function(e){r.DB.then(function(t){var n=t.transaction(r.DB_STORE,"readwrite"),o=n.objectStore(r.DB_STORE);return e.forEach(function(e){o.put(e)}),n.complete}),n(null,e)}).catch(function(e){r.DB.then(function(e){return e.transaction(r.DB_STORE).objectStore(r.DB_STORE).getAll()}).then(function(e){return n(null,e)}).catch(function(e){return n(e,null)})})}},{key:"fetchRestaurantById",value:function(n,r){var o=this;e(t.DATABASE_URL+"/restaurants/"+n).then(this._validateResponse).then(this._readResponseAsJSON).then(function(e){o.DB.then(function(t){t.transaction(o.DB_STORE,"readwrite").objectStore(o.DB_STORE).put(e)}),r(null,e)}).catch(function(e){o.DB.then(function(e){return e.transaction(o.DB_STORE).objectStore(o.DB_STORE).get(parseInt(n))}).then(function(e){return r(null,e)}).catch(function(){return r("Restaurant does not exist",null)})})}},{key:"favoriteRestaurant",value:function(n,r){var o=this;return new Promise(function(i,a){e(t.DATABASE_URL+"/restaurants/"+n+"?is_favorite="+r,{method:"PUT"}).then(o._validateResponse).then(o._readResponseAsJSON).then(function(e){o.DB.then(function(t){t.transaction(o.DB_STORE,"readwrite").objectStore(o.DB_STORE).put(e)}),i(e)}).catch(function(e){console.error(e),o.DB.then(function(e){return e.transaction(o.DB_STORE).objectStore(o.DB_STORE).get(parseInt(n))}).then(function(e){return i(e)}).catch(function(e){return a(e)})})})}},{key:"fetchRestaurantReviews",value:function(n,r){var o=this;e(t.DATABASE_URL+"/reviews?restaurant_id="+n).then(this._validateResponse).then(this._readResponseAsJSON).then(function(e){o.DB.then(function(t){t.transaction(o.DB_REVIEWS_STORE,"readwrite").objectStore(o.DB_REVIEWS_STORE).put({id:parseInt(n),reviews:e})}),r(null,e)}).catch(function(e){o.DB.then(function(e){return e.transaction(o.DB_REVIEWS_STORE).objectStore(o.DB_REVIEWS_STORE).get(parseInt(n))}).then(function(e){return r(null,e.reviews)}).catch(function(){return r("No reviews yet!",null)})})}},{key:"postRestaurantReview",value:function(n){var r=this;return new Promise(function(o,i){e(t.DATABASE_URL+"/reviews",{method:"POST",body:n}).then(r._validateResponse).then(r._readResponseAsJSON).then(function(e){o(e)}).catch(function(e){i(e)})})}},{key:"fetchRestaurantByCuisine",value:function(e,n){t.fetchRestaurants(function(t,r){if(t)n(t,null);else{var o=r.filter(function(t){return t.cuisine_type==e});n(null,o)}})}},{key:"fetchRestaurantByNeighborhood",value:function(e,n){t.fetchRestaurants(function(t,r){if(t)n(t,null);else{var o=r.filter(function(t){return t.neighborhood==e});n(null,o)}})}},{key:"fetchRestaurantByCuisineAndNeighborhood",value:function(e,n,r){t.fetchRestaurants(function(t,o){if(t)r(t,null);else{var i=o;"all"!=e&&(i=i.filter(function(t){return t.cuisine_type==e})),"all"!=n&&(i=i.filter(function(e){return e.neighborhood==n})),r(null,i)}})}},{key:"fetchNeighborhoods",value:function(e){t.fetchRestaurants(function(t,n){if(t)e(t,null);else{var r=n.map(function(e,t){return n[t].neighborhood}),o=r.filter(function(e,t){return r.indexOf(e)==t});e(null,o)}})}},{key:"fetchCuisines",value:function(e){t.fetchRestaurants(function(t,n){if(t)e(t,null);else{var r=n.map(function(e,t){return n[t].cuisine_type}),o=r.filter(function(e,t){return r.indexOf(e)==t});e(null,o)}})}},{key:"urlForRestaurant",value:function(e){return"./restaurant.html?id="+e.id}},{key:"imageSrcSetUrlForRestaurant",value:function(e){var t=e.photograph?e.photograph.split(/\./):[e.id,"jpg"];return"/img_dist/"+t[0]+"-660_2x.webp 2x, /img_dist/"+t[0]+"-330_1x.webp,\n      /img_dist/"+t[0]+"-660_2x."+(t[1]||"jpg")+" 2x, /img_dist/"+t[0]+"-330_1x."+(t[1]||"jpg")}},{key:"imageUrlForRestaurant",value:function(e){var t=e.photograph?e.photograph.split(/\./):[e.id,"jpg"];return"/img/"+t[0]+"."+(t[1]||"jpg")}},{key:"imageSrcSetUrlForReviewPage",value:function(e){var t=e.photograph?e.photograph.split(/\./):[e.id,"jpg"];return"/img_dist/"+t[0]+".webp 800w, /img_dist/"+t[0]+"-660_2x.webp 660w, /img_dist/"+t[0]+"-330_1x.webp 330w,\n      /img/"+t[0]+"."+(t[1]||"jpg")+" 800w, /img_dist/"+t[0]+"-660_2x."+(t[1]||"jpg")+" 660w, /img_dist/"+t[0]+"-330_1x."+(t[1]||"jpg")+" 330w"}},{key:"mapMarkerForRestaurant",value:function(e,n){return new google.maps.Marker({position:e.latlng,title:e.name,url:t.urlForRestaurant(e),map:n,animation:google.maps.Animation.DROP})}},{key:"DATABASE_URL",get:function(){return"http://localhost:1337"}},{key:"DB_VERSION",get:function(){return 3}},{key:"DB_NAME",get:function(){return"restaurants"}},{key:"DB_STORE",get:function(){return"list"}},{key:"DB_REVIEWS_STORE",get:function(){return"reviews"}},{key:"DB_OFFLINE_FORMS_STORE",get:function(){return"offline-forms"}},{key:"DB",get:function(){var e=this;return o.a.open(this.DB_NAME,this.DB_VERSION,function(t){switch(t.oldVersion){case 0:t.createObjectStore(e.DB_STORE,{keyPath:"id"});case 1:t.createObjectStore(e.DB_REVIEWS_STORE,{keyPath:"id"});case 2:t.createObjectStore(e.DB_OFFLINE_FORMS_STORE,{keyPath:"formid"})}})}}]),t}();t.a=a}).call(t,n("rp8n"))},WPZq:function(e,t,n){"use strict";var r=function(e){return e&&"object"==typeof e&&"default"in e?e.default:e}(n("YDMl")),o=null,i={warning:'<svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="6.25%"><path d="M8 17 C8 12 9 6 16 6 23 6 24 12 24 17 24 22 27 25 27 25 L5 25 C5 25 8 22 8 17 Z M20 25 C20 25 20 29 16 29 12 29 12 25 12 25 M16 3 L16 6" /></svg>',success:'<svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="6.25%"><path d="M2 20 L12 28 30 4" /></svg>',info:'<svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="6.25%"><path d="M16 14 L16 23 M16 8 L16 10" /><circle cx="16" cy="16" r="14" /></svg>',error:'<svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="6.25%"><path d="M16 3 L30 29 2 29 Z M16 11 L16 19 M16 23 L16 25" /></svg>'},a=function(e){var t=this;void 0===e&&(e={});var n=e.message;void 0===n&&(n="");var r=e.position;void 0===r&&(r="bottom");var a=e.timeout;void 0===a&&(a=3e3);var s=e.el;void 0===s&&(s=document.body);var u=e.square;void 0===u&&(u=!1);var c=e.type;void 0===c&&(c="");var l=e.debug;void 0===l&&(l=!1);var f=e.edge;void 0===f&&(f=!1);var d=e.icon;void 0===d&&(d=!0);var h=e.closeOnClick;void 0===h&&(h=!1),o&&o.destroy(),this.message=n,this.position=r,this.el=s,this.timeout=a,this.closeOnClick=h,this.toast=document.createElement("div"),this.toast.className="native-toast native-toast-"+this.position,c&&(this.toast.className+=" native-toast-"+c,d&&(this.message='<span class="native-toast-icon-'+c+'">'+(i[c]||"")+"</span>"+this.message)),this.toast.innerHTML=this.message,f?this.toast.className+=" native-toast-edge":u&&(this.toast.style.borderRadius="3px"),this.el.appendChild(this.toast),o=this,this.show(),!l&&a>0&&this.hide(),this.closeOnClick&&this.toast.addEventListener("click",function(){t.destroy()})};function s(e){return new a(e)}a.prototype.show=function(){var e=this;setTimeout(function(){e.toast.classList.add("native-toast-shown")},300)},a.prototype.hide=function(){var e=this;setTimeout(function(){e.destroy()},this.timeout)},a.prototype.destroy=function(){var e=this;this.toast&&(this.toast.classList.remove("native-toast-shown"),setTimeout(function(){e.toast&&(e.el.removeChild(e.toast),e.toast=null)},300))};for(var u of["success","info","warning","error"])s[u]=function(e){return s(r({type:u},e))};e.exports=s},YDMl:function(e,t,n){"use strict";
/*!
 * nano-assign v1.0.0
 * (c) 2017-present egoist <0x142857@gmail.com>
 * Released under the MIT License.
 */e.exports=function(e){for(var t=arguments,n=1;n<arguments.length;n++)for(var r in arguments[n])e[r]=t[n][r];return e}},a4gv:function(e,t,n){"use strict";!function(){function t(e){return new Promise(function(t,n){e.onsuccess=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function n(e,n,r){var o,i=new Promise(function(i,a){t(o=e[n].apply(e,r)).then(i,a)});return i.request=o,i}function r(e,t,n){n.forEach(function(n){Object.defineProperty(e.prototype,n,{get:function(){return this[t][n]},set:function(e){this[t][n]=e}})})}function o(e,t,r,o){o.forEach(function(o){o in r.prototype&&(e.prototype[o]=function(){return n(this[t],o,arguments)})})}function i(e,t,n,r){r.forEach(function(r){r in n.prototype&&(e.prototype[r]=function(){return this[t][r].apply(this[t],arguments)})})}function a(e,t,r,o){o.forEach(function(o){o in r.prototype&&(e.prototype[o]=function(){return function(e,t,r){var o=n(e,t,r);return o.then(function(e){if(e)return new u(e,o.request)})}(this[t],o,arguments)})})}function s(e){this._index=e}function u(e,t){this._cursor=e,this._request=t}function c(e){this._store=e}function l(e){this._tx=e,this.complete=new Promise(function(t,n){e.oncomplete=function(){t()},e.onerror=function(){n(e.error)},e.onabort=function(){n(e.error)}})}function f(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new l(n)}function d(e){this._db=e}r(s,"_index",["name","keyPath","multiEntry","unique"]),o(s,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),a(s,"_index",IDBIndex,["openCursor","openKeyCursor"]),r(u,"_cursor",["direction","key","primaryKey","value"]),o(u,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(e){e in IDBCursor.prototype&&(u.prototype[e]=function(){var n=this,r=arguments;return Promise.resolve().then(function(){return n._cursor[e].apply(n._cursor,r),t(n._request).then(function(e){if(e)return new u(e,n._request)})})})}),c.prototype.createIndex=function(){return new s(this._store.createIndex.apply(this._store,arguments))},c.prototype.index=function(){return new s(this._store.index.apply(this._store,arguments))},r(c,"_store",["name","keyPath","indexNames","autoIncrement"]),o(c,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),a(c,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),i(c,"_store",IDBObjectStore,["deleteIndex"]),l.prototype.objectStore=function(){return new c(this._tx.objectStore.apply(this._tx,arguments))},r(l,"_tx",["objectStoreNames","mode"]),i(l,"_tx",IDBTransaction,["abort"]),f.prototype.createObjectStore=function(){return new c(this._db.createObjectStore.apply(this._db,arguments))},r(f,"_db",["name","version","objectStoreNames"]),i(f,"_db",IDBDatabase,["deleteObjectStore","close"]),d.prototype.transaction=function(){return new l(this._db.transaction.apply(this._db,arguments))},r(d,"_db",["name","version","objectStoreNames"]),i(d,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(e){[c,s].forEach(function(t){e in t.prototype&&(t.prototype[e.replace("open","iterate")]=function(){var t=function(e){return Array.prototype.slice.call(e)}(arguments),n=t[t.length-1],r=this._store||this._index,o=r[e].apply(r,t.slice(0,-1));o.onsuccess=function(){n(o.result)}})})}),[s,c].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,t){var n=this,r=[];return new Promise(function(o){n.iterateCursor(e,function(e){e?(r.push(e.value),void 0===t||r.length!=t?e.continue():o(r)):o(r)})})})});var h={open:function(e,t,r){var o=n(indexedDB,"open",[e,t]),i=o.request;return i&&(i.onupgradeneeded=function(e){r&&r(new f(i.result,e.oldVersion,i.transaction))}),o.then(function(e){return new d(e)})},delete:function(e){return n(indexedDB,"deleteDatabase",[e])}};e.exports=h,e.exports.default=e.exports}()},oDnR:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n("NsDR"),o=n("w3Sf");self.map,"serviceWorker"in navigator&&navigator.serviceWorker.register("/sw.js",{scope:"/"});var i=function(){if("undefined"==typeof google){var e=document.createElement("script");e.src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAPYV1tlwm9ftEe0p0cQWNeeXbptVadGXM&libraries=places&callback=initMap",document.getElementsByTagName("head")[0].appendChild(e),document.getElementById("load-map-button").remove()}};window.initMap=function(){self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:self.restaurant.latlng,scrollwheel:!1}),r.a.mapMarkerForRestaurant(self.restaurant,self.map),document.getElementById("map-container").setAttribute("aria-label","Map with "+self.restaurant.name+" restaurant location")},document.addEventListener("DOMContentLoaded",function(e){document.getElementById("load-map-button").onclick=i,a(function(e,t){e?console.error(e):f()})});var a=function(e){if(self.restaurant)e(null,self.restaurant);else{var t=d("id");t?(r.a.fetchRestaurantById(t,function(t,n){self.restaurant=n,n?(s(),e(null,n)):console.error(t)}),r.a.fetchRestaurantReviews(t,function(e,t){t?c(t):console.error(e)})):(error="No restaurant id in URL",e(error,null))}},s=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:self.restaurant,t=document.getElementById("restaurant-name");t.innerHTML=e.name,t.setAttribute("aria-label",e.name+" restaurant");var n=function(e){"boolean"==typeof e.is_favorite&&e.is_favorite||"true"===e.is_favorite?o.classList.add("favorited"):o.classList.remove("favorited")},o=document.getElementById("restaurant-favorite");n(e),o.addEventListener("click",function(){r.a.favoriteRestaurant(e.id,"boolean"==typeof e.is_favorite?!e.is_favorite:"true"!==e.is_favorite).then(n)}),document.getElementById("restaurant-address").innerHTML=e.address;var i=document.getElementById("restaurant-img");i.className="restaurant-img",i.src=r.a.imageUrlForRestaurant(e),i.srcset=r.a.imageSrcSetUrlForReviewPage(e),i.alt=e.name+" restaurant",document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type,e.operating_hours&&u()},u=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:self.restaurant.operating_hours,t=document.getElementById("restaurant-hours");for(var n in t.setAttribute("aria-label","Operating hours of "+self.restaurant.name+" restaurant"),e)if(e.hasOwnProperty(n)){var r=document.createElement("tr"),o=document.createElement("td");o.innerHTML=n,r.appendChild(o);var i=document.createElement("td");i.innerHTML=e[n],r.appendChild(i),t.appendChild(r)}},c=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:self.restaurant.reviews,t=document.getElementById("reviews-container"),n=document.getElementById("review-form-container"),r=document.getElementById("add-review-button"),i=document.getElementById("review-form-save-button"),a=document.getElementById("review-form");if(r.addEventListener("click",function(){n.classList.toggle("hidden")}),i.addEventListener("click",function(e){e.preventDefault();var t=new FormData(a);return t.set("restaurant_id",self.restaurant.id),a.classList.add("progress"),o.a.submit("postRestaurantReview",t).then(function(e){n.classList.toggle("hidden"),a.name.value="",a.rating.value=5,a.comments.value="",u.appendChild(l(e)),document.getElementById("review-"+e.id).scrollIntoView(),a.classList.remove("progress")}).catch(function(){a.name.value="",a.rating.value=5,a.comments.value="",a.classList.remove("progress")}),!1}),!e){var s=document.createElement("p");return s.innerHTML="No reviews yet!",void t.appendChild(s)}var u=document.getElementById("reviews-list");e.forEach(function(e){u.appendChild(l(e))})},l=function(e){var t=document.createElement("li");t.id="review-"+e.id;var n=document.createElement("div");n.className="review-title";var r=document.createElement("div");r.innerHTML=e.name,r.className="review-user-name",n.appendChild(r);var o=document.createElement("div");o.innerHTML=new Date(e.createdAt).toLocaleDateString(navigator.language||"en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}),o.className="review-date",n.appendChild(o),t.appendChild(n);var i=document.createElement("div");i.innerHTML="Rating: "+e.rating,i.className="review-rating",t.appendChild(i);var a=document.createElement("p");return a.innerHTML=e.comments,t.appendChild(a),t},f=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:self.restaurant,t=document.getElementById("breadcrumb"),n=document.createElement("li"),o=document.createElement("a");o.href=r.a.urlForRestaurant(e),o.title=e.name,o.innerHTML=e.name,o.setAttribute("aria-current","page"),n.appendChild(o),t.appendChild(n)},d=function(e,t){t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");var n=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)").exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null}},rp8n:function(e,t,n){(function(t){(function(){!function(e){"use strict";if(!e.fetch){var t={searchParams:"URLSearchParams"in e,iterable:"Symbol"in e&&"iterator"in Symbol,blob:"FileReader"in e&&"Blob"in e&&function(){try{return new Blob,!0}catch(e){return!1}}(),formData:"FormData"in e,arrayBuffer:"ArrayBuffer"in e};if(t.arrayBuffer)var n=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],r=function(e){return e&&DataView.prototype.isPrototypeOf(e)},o=ArrayBuffer.isView||function(e){return e&&n.indexOf(Object.prototype.toString.call(e))>-1};l.prototype.append=function(e,t){e=s(e),t=u(t);var n=this.map[e];this.map[e]=n?n+","+t:t},l.prototype.delete=function(e){delete this.map[s(e)]},l.prototype.get=function(e){return e=s(e),this.has(e)?this.map[e]:null},l.prototype.has=function(e){return this.map.hasOwnProperty(s(e))},l.prototype.set=function(e,t){this.map[s(e)]=u(t)},l.prototype.forEach=function(e,t){for(var n in this.map)this.map.hasOwnProperty(n)&&e.call(t,this.map[n],n,this)},l.prototype.keys=function(){var e=[];return this.forEach(function(t,n){e.push(n)}),c(e)},l.prototype.values=function(){var e=[];return this.forEach(function(t){e.push(t)}),c(e)},l.prototype.entries=function(){var e=[];return this.forEach(function(t,n){e.push([n,t])}),c(e)},t.iterable&&(l.prototype[Symbol.iterator]=l.prototype.entries);var i=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];y.prototype.clone=function(){return new y(this,{body:this._bodyInit})},m.call(y.prototype),m.call(g.prototype),g.prototype.clone=function(){return new g(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new l(this.headers),url:this.url})},g.error=function(){var e=new g(null,{status:0,statusText:""});return e.type="error",e};var a=[301,302,303,307,308];g.redirect=function(e,t){if(-1===a.indexOf(t))throw new RangeError("Invalid status code");return new g(null,{status:t,headers:{location:e}})},e.Headers=l,e.Request=y,e.Response=g,e.fetch=function(e,n){return new Promise(function(r,o){var i=new y(e,n),a=new XMLHttpRequest;a.onload=function(){var e={status:a.status,statusText:a.statusText,headers:function(e){var t=new l;return e.replace(/\r?\n[\t ]+/g," ").split(/\r?\n/).forEach(function(e){var n=e.split(":"),r=n.shift().trim();if(r){var o=n.join(":").trim();t.append(r,o)}}),t}(a.getAllResponseHeaders()||"")};e.url="responseURL"in a?a.responseURL:e.headers.get("X-Request-URL");var t="response"in a?a.response:a.responseText;r(new g(t,e))},a.onerror=function(){o(new TypeError("Network request failed"))},a.ontimeout=function(){o(new TypeError("Network request failed"))},a.open(i.method,i.url,!0),"include"===i.credentials?a.withCredentials=!0:"omit"===i.credentials&&(a.withCredentials=!1),"responseType"in a&&t.blob&&(a.responseType="blob"),i.headers.forEach(function(e,t){a.setRequestHeader(t,e)}),a.send(void 0===i._bodyInit?null:i._bodyInit)})},e.fetch.polyfill=!0}function s(e){if("string"!=typeof e&&(e=String(e)),/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(e))throw new TypeError("Invalid character in header field name");return e.toLowerCase()}function u(e){return"string"!=typeof e&&(e=String(e)),e}function c(e){var n={next:function(){var t=e.shift();return{done:void 0===t,value:t}}};return t.iterable&&(n[Symbol.iterator]=function(){return n}),n}function l(e){this.map={},e instanceof l?e.forEach(function(e,t){this.append(t,e)},this):Array.isArray(e)?e.forEach(function(e){this.append(e[0],e[1])},this):e&&Object.getOwnPropertyNames(e).forEach(function(t){this.append(t,e[t])},this)}function f(e){if(e.bodyUsed)return Promise.reject(new TypeError("Already read"));e.bodyUsed=!0}function d(e){return new Promise(function(t,n){e.onload=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function h(e){var t=new FileReader,n=d(t);return t.readAsArrayBuffer(e),n}function p(e){if(e.slice)return e.slice(0);var t=new Uint8Array(e.byteLength);return t.set(new Uint8Array(e)),t.buffer}function m(){return this.bodyUsed=!1,this._initBody=function(e){if(this._bodyInit=e,e)if("string"==typeof e)this._bodyText=e;else if(t.blob&&Blob.prototype.isPrototypeOf(e))this._bodyBlob=e;else if(t.formData&&FormData.prototype.isPrototypeOf(e))this._bodyFormData=e;else if(t.searchParams&&URLSearchParams.prototype.isPrototypeOf(e))this._bodyText=e.toString();else if(t.arrayBuffer&&t.blob&&r(e))this._bodyArrayBuffer=p(e.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer]);else{if(!t.arrayBuffer||!ArrayBuffer.prototype.isPrototypeOf(e)&&!o(e))throw new Error("unsupported BodyInit type");this._bodyArrayBuffer=p(e)}else this._bodyText="";this.headers.get("content-type")||("string"==typeof e?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):t.searchParams&&URLSearchParams.prototype.isPrototypeOf(e)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},t.blob&&(this.blob=function(){var e=f(this);if(e)return e;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?f(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(h)}),this.text=function(){var e=f(this);if(e)return e;if(this._bodyBlob)return function(e){var t=new FileReader,n=d(t);return t.readAsText(e),n}(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(function(e){for(var t=new Uint8Array(e),n=new Array(t.length),r=0;r<t.length;r++)n[r]=String.fromCharCode(t[r]);return n.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},t.formData&&(this.formData=function(){return this.text().then(v)}),this.json=function(){return this.text().then(JSON.parse)},this}function y(e,t){var n=(t=t||{}).body;if(e instanceof y){if(e.bodyUsed)throw new TypeError("Already read");this.url=e.url,this.credentials=e.credentials,t.headers||(this.headers=new l(e.headers)),this.method=e.method,this.mode=e.mode,n||null==e._bodyInit||(n=e._bodyInit,e.bodyUsed=!0)}else this.url=String(e);if(this.credentials=t.credentials||this.credentials||"omit",!t.headers&&this.headers||(this.headers=new l(t.headers)),this.method=function(e){var t=e.toUpperCase();return i.indexOf(t)>-1?t:e}(t.method||this.method||"GET"),this.mode=t.mode||this.mode||null,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&n)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(n)}function v(e){var t=new FormData;return e.trim().split("&").forEach(function(e){if(e){var n=e.split("="),r=n.shift().replace(/\+/g," "),o=n.join("=").replace(/\+/g," ");t.append(decodeURIComponent(r),decodeURIComponent(o))}}),t}function g(e,t){t||(t={}),this.type="default",this.status=void 0===t.status?200:t.status,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in t?t.statusText:"OK",this.headers=new l(t.headers),this.url=t.url||"",this._initBody(e)}}("undefined"!=typeof self?self:this),e.exports=t.fetch}).call(t)}).call(t,n("DuR2"))},w3Sf:function(e,t,n){"use strict";var r=n("NsDR"),o=n("WPZq"),i=n.n(o),a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();var s=function(){function e(){var t=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.forms={},this.toastMessageConfig={square:!0,position:"bottom",timeout:5e3},window.addEventListener("online",function(){return t.checkStorage()}),window.addEventListener("load",function(){return t.checkStorage()})}return a(e,[{key:"submit",value:function(e,t){var n=this,o=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=e+"-"+t.get("restaurant_id")+"-"+(new Date).getTime();return this.forms[i]={data:t,sendMethod:e},new Promise(function(i,a){navigator.onLine||(n.storeData(),a()),r.a[e](t).then(function(e){o&&n.sent(e),i(e)}).catch(function(e){console.error(e),n.warn(),n.storeData(),a()})})}},{key:"warn",value:function(){i()(Object.assign({},this.toastMessageConfig,{message:'<div class="message">\n        <strong>Network error occured!</strong>\n        <br>We will retry sending when you are online again.</div>',type:"error"}))}},{key:"sent",value:function(e){i()(Object.assign({},this.toastMessageConfig,{message:'<div class="message">\n        <strong>Network connection restored. Your previously message sent.</strong>\n        <br>You can reload the page to see the content.\n        <br>Message: '+e.comments.substr(0,200)+"...\n      </div>",type:"success"}))}},{key:"storeData",value:function(){var e=this;for(var t in this.forms)this.forms.hasOwnProperty(t)&&function(){var n=e.forms[t].data,o=e.forms[t].sendMethod,i={};n.forEach(function(e,t){i[t]=e}),r.a.storeOfflineForm({formid:t,data:i,sendMethod:o})}()}},{key:"checkStorage",value:function(){var e=this;r.a.getOfflineForms().then(function(t){t.forEach(function(t){var n=t.formid,o=t.sendMethod,i=new FormData;for(var a in t.data)t.data.hasOwnProperty(a)&&i.set(a,t.data[a]);e.submit(o,i,!0).then(r.a.removeOfflineForm(n)).catch(r.a.removeOfflineForm(n))})})}}]),e}();t.a=new s}});