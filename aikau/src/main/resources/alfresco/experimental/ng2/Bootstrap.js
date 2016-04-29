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
 * <p><b>PLEASE NOTE: As this module resides within the "alfresco/experimental" package it is not subject to the
 * same backwards compatibility rules as other widgets. It can change or even be removed between released</b></p>
 * <p>The purpose of this widget is to provide a way to bootstrap Angular 2 widgets. In order to use this widget
 * it is necessary to apply the "Angular 2 Support Extension" module to provide the SystemJS support required
 * to dynamically transpile TypeScript.</p>
 *
 * @module alfresco/experimental/ng2/Bootstrap
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @author Dave Draper
 * @since 1.0.66
 */
define(["dojo/_base/declare",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetBase"], 
        function(declare, _TemplatedMixin, _WidgetBase) {
   
   return declare([_WidgetBase, _TemplatedMixin], {

      /**
       * This should be configured with the DOM template that contains the custom elements that will
       * be matched by the Angular 2 components loaded.
       * 
       * @instance
       * @type {string}
       * @default
       */
      templateString: "<div>No template provided</div",

      /**
       * This should be configured to be the component to be loaded to bootstrap Angular 2. This will be
       * resolved against the standard AMD packages so care should be taken to ensure that this will
       * resolve appropriately.
       * 
       * @instance
       * @type {string}
       * @default
       */
      main: null,

      /**
       * This bootstraps the Angular 2 components
       *
       * @instance
       */
      postCreate: function alfresco_experimental_ng2_Bootstrap__postCreate(){
         /* global System, console */
         // PLEASE NOTE: This code looks a bit mental, but it's necessary to stop the YUI compressor in Surf from 
         //              having an issue with calling System.import
         if (this.main && System && typeof System["import"] === "function")
         {
            System["import"](require.toUrl(this.main)).then(null, console.error.bind(console));
         }
      }
   });
});