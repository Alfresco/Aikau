/**
 * Copyright (C) 2005-2016 Alfresco Software Limited.
 *
 * This file is part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @author David Webster
 */
define(["module",
        "alfresco/TestCommon",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, TestCommon, defineSuite, assert) {

   function convertUrl(url, urlTypeName, callback) {
      require(["alfresco/util/urlUtils", "alfresco/enums/urlTypes"], function(urlUtils, urlTypes) {
         callback(urlUtils.convertUrl(url, urlTypes[urlTypeName] || urlTypeName));
      });
   }

   defineSuite(module, {
      name: "URL Utils Test",
      testPage: "/Index",

      "URL Utils": function() {
         return this.remote.setExecuteAsyncTimeout(5000)
            .executeAsync(function(callback) {
               require(["alfresco/util/urlUtils"], function(urlUtils) {
                  var url = "http://localhost:8080/alfresco/example?foo=one&bar=two#baz=three",
                     urlObj = urlUtils.parseUrl(url),
                     urlHash = urlUtils.addHashParameter(url, "newParam", "four"),
                     urlParam = urlUtils.addQueryParameter(urlHash, "newQParam", "five"),
                     testUrl = urlObj.toString(),
                     relativeUrl = "example/path/",
                     relativeUrlHash = "example/path/#hash",
                     relativeUrlQuery = "example/path/?query=param",
                     relativeUrlTest = urlUtils.addQueryParameter(relativeUrl, "qpm", "qwerty"),
                     relativeUrlHashTest = urlUtils.addQueryParameter(relativeUrlHash, "qpm", "qwerty"),
                     relativeUrlQueryTest = urlUtils.addHashParameter(
                        urlUtils.addQueryParameter(relativeUrlQuery, "newQuery", "u%@p", true),
                        "hash", "already%20encoded", false),
                     relativeUrlQueryTest2 = urlUtils.addHashParameter(
                        urlUtils.addQueryParameter(relativeUrlQuery, "newQuery", "u%@p", true),
                        "hash", "already%20encoded");

                  setTimeout(function() {
                     callback({
                        url: url,
                        urlObj: urlObj,
                        urlHash: urlHash,
                        urlParam: urlParam,
                        testUrl: testUrl,
                        relativeUrl: relativeUrl,
                        relativeUrlTest: relativeUrlTest,
                        relativeUrlHashTest: relativeUrlHashTest,
                        relativeUrlQueryTest: relativeUrlQueryTest,
                        relativeUrlQueryTest2: relativeUrlQueryTest2
                     });
                  }, 1000);
               });
            })
            .then(function(results) {
               var url = results.url,
                  urlObj = results.urlObj,
                  urlHash = results.urlHash,
                  urlParam = results.urlParam,
                  testUrl = results.testUrl;

               assert.equal(urlObj.protocol, "http:");
               assert.equal(urlObj.hostname, "localhost");
               assert.equal(urlObj.port, "8080");
               assert.equal(urlObj.pathname, "/alfresco/example");
               assert.equal(urlObj.queryParams.foo, "one");
               assert.equal(urlObj.queryParams.bar, "two");
               assert.equal(urlObj.hashParams.baz, "three");
               assert.equal(testUrl, url);

               assert.equal(urlHash, "http://localhost:8080/alfresco/example?foo=one&bar=two#baz=three&newParam=four");
               assert.equal(urlParam, "http://localhost:8080/alfresco/example?foo=one&bar=two&newQParam=five#baz=three&newParam=four");

               // Relative URLs:
               assert.equal(results.relativeUrlTest, "example/path/?qpm=qwerty");
               assert.equal(results.relativeUrlHashTest, "example/path/?qpm=qwerty#hash");
               assert.equal(results.relativeUrlQueryTest, "example/path/?query=param&newQuery=u%25%40p#hash=already%20encoded");

               assert.equal(results.relativeUrlQueryTest, results.relativeUrlQueryTest2);

            });
      },

      "convertUrl() handles urlTypes.PAGE_RELATIVE": function() {
         return this.remote.executeAsync(convertUrl, ["/hello", "PAGE_RELATIVE"])
            .then(function(convertedUrl) {
               assert.equal(convertedUrl, "/aikau/page/hello");
            })
            .executeAsync(convertUrl, ["hello", "PAGE_RELATIVE"])
            .then(function(convertedUrl) {
               assert.equal(convertedUrl, "/aikau/page/hello");
            });
      },

      "convertUrl() handles no urlType": function() {
         return this.remote.executeAsync(convertUrl, ["/hello", null])
            .then(function(convertedUrl) {
               assert.equal(convertedUrl, "/aikau/page/hello");
            })
            .executeAsync(convertUrl, ["hello", null])
            .then(function(convertedUrl) {
               assert.equal(convertedUrl, "/aikau/page/hello");
            });
      },

      "convertUrl() handles urlTypes.CONTEXT_RELATIVE": function() {
         return this.remote.executeAsync(convertUrl, ["/hello", "CONTEXT_RELATIVE"])
            .then(function(convertedUrl) {
               assert.equal(convertedUrl, "/aikau/hello");
            })
            .executeAsync(convertUrl, ["hello", "CONTEXT_RELATIVE"])
            .then(function(convertedUrl) {
               assert.equal(convertedUrl, "/aikau/hello");
            });
      },

      "convertUrl() handles urlTypes.REQUIRE_PATH": function() {
         return this.remote.executeAsync(convertUrl, ["alfresco/html/css/Image.css", "REQUIRE_PATH"])
            .then(function(convertedUrl) {
               assert.match(convertedUrl, /^\/aikau\/res\/js\/aikau\/[0-9.]+-SNAPSHOT\/alfresco\/html\/css\/Image.css$/);
            });
      },

      "convertUrl() handles urlTypes.FULL_PATH": function() {
         var testUrl = "//www.unchanged.me/this/should?not=be#updated";
         return this.remote.executeAsync(convertUrl, [testUrl, "FULL_PATH"])
            .then(function(convertedUrl) {
               assert.equal(convertedUrl, testUrl);
            });
      },

      "convertUrl() handles urlTypes.HASH": function() {
         return this.remote.executeAsync(convertUrl, ["#foo=bar&wibble=hi", "HASH"])
            .then(function(convertedUrl) {
               assert.equal(convertedUrl, "foo=bar&wibble=hi");
            })
            .executeAsync(convertUrl, ["foo=bar&wibble=hi", "HASH"])
            .then(function(convertedUrl) {
               assert.equal(convertedUrl, "foo=bar&wibble=hi");
            });
      },

      "convertUrl() handles invalid urlTypes": function() {
         var testUrl = "//www.unchanged.me/this/should?not=be#updated";
         return this.remote.executeAsync(convertUrl, [testUrl, "MADE_UP_TYPE"])
            .then(function(convertedUrl) {
               assert.equal(convertedUrl, testUrl);
            });
      },
   });
});