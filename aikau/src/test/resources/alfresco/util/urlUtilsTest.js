/**
 * Copyright (C) 2005-2015 Alfresco Software Limited.
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
define([
      "alfresco/TestCommon",
      "intern!object",
      "intern/chai!assert",
      "require"
   ],
   function (TestCommon, registerSuite, assert, require) {

registerSuite(function(){
   var browser;

   return {
         name: "URL Utils Test",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/Index", "URL Utils Test").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "URL Utils": function () {
            return browser.setExecuteAsyncTimeout(5000)
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
                        relativeUrlTest = urlUtils.addQueryParameter(relativeUrl,  "qpm", "qwerty"),
                        relativeUrlHashTest = urlUtils.addQueryParameter(relativeUrlHash,  "qpm", "qwerty"),
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
         }
      };
   });
});