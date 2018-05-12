;
(function(moduleName, root, factory) {
  /* eslint-disable */
  if (typeof define === "function" && define.amd) {} else if (typeof exports === "object") {
    module.exports = factory();
  } else {
    window.http = factory();
  }
  /* eslint-enable */
}("http", null, function() {
  "use strict";

  var http = {};

  http.getJSON = function(url) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.onload = () => { return resolve(xhr.response); }
      xhr.onerror = () => reject(xhr.statusText);
      xhr.open("GET", url, true);
      xhr.responseType = "json";
      xhr.send(null);
    });
  }

  http.postJSON = function(url, data) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.onload = () => { return resolve(xhr.response); }
      xhr.onerror = () => reject(xhr.statusText);
      xhr.open("POST", url, true);
      xhr.responseType = "json";
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(data));
    });
  }

  http.ajax = function(url, method, data, headers) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.onload = () => { return resolve(xhr.response); }
      xhr.onerror = () => { return reject(xhr.statusText); }
      xhr.open(method, url, true);
      //  xhr.responseType = 'json';
      if (headers) {
        for (var h in headers) {
          xhr.setRequestHeader(h, headers[h]);
        }
      }
      data = data || null;
      xhr.send(data);
    });
  }


  return http;
}));