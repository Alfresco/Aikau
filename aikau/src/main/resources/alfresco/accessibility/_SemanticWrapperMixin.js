/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
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
 * This mixin provides semantic wrapper capabilities. When mixed it creates a sematicWrapper configuration option.
 * Calling the generateSemanticWrapper() function from a mixing object and with a targetNode attribute will validate 
 * the semanticWrapper option supplied, generate the required semantic wrapper and return it.
 * 
 * @module alfresco/accessibility/_SemanticWrapperMixin
 * @author Richard Smith
 * @example <caption>Sample configuration with AlfShareFooter which mixes _SemanticWrapperMixin</caption>
 * {
 *    name: "alfresco/footer/AlfShareFooter",
 *    config: {
 *       semanticWrapper: "footer", // This AlfShareFooter is automatically wrapped in a <footer></footer> tag.
 *       licenseLabel: "licenseHolder",
 *       copyrightLabel: "footerCopyRight",
 *       altText: "footerLogoAltText",
 *       logoImageSrc: "footerLogo",
 *       cssClass: "footerCssClass"
 *    }
 * }
 */
define(["dojo/_base/declare",
        "dojo/dom-construct",
        "dojo/_base/array"], 
        function(declare, domConstruct, array) {

   return declare(null, {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/_SematicWrapperMixin.css"}]
       */
      cssRequirements: [{cssFile:"./css/_SemanticWrapperMixin.css"}],

      /**
       * The optional semantic wrapper to be applied around the content.
       * @instance
       * @type {string}
       * @default null
       */
      semanticWrapper: null,

      /**
       * The semantic tags that could be used for the sematicWrapper.
       * @private
       * @type {String[]}
       * @default ["header", "nav", "section", "article", "aside", "figure", "figcaption", "footer", "details", "summary", "mark", "time"]
       */
      _semanticWrapperOptions: ["header", "nav", "section", "article", "aside", "figure", "figcaption", "footer", "details", "summary", "mark", "time"],

      /**
       * Create and return a semantic wrapper node inside the specified outer node, with optional inner node
       * content injected into the created semantic wrapper.
       * 
       * @instance
       * @param {element} outerNode The DOM node within which the semantic wrapper should be created
       * @param {element} innerNode The DOM node that should be moved into the created semantic wrapper
       */
      generateSemanticWrapper: function alfresco_accessibility__SemanticWrapperMixin__generateSemanticWrapper(outerNode, innerNode) {
         if(this.semanticWrapper && array.indexOf(this._semanticWrapperOptions, this.semanticWrapper) != -1)
         {
            var wrapper = domConstruct.create(this.semanticWrapper, null, outerNode, "first");
            if(innerNode)
            {
               domConstruct.place(innerNode, wrapper, "only");
            }
            return wrapper;
         }
         else if(this.semanticWrapper)
         {
            this.alfLog("error", "A semantic wrapper '" + this.semanticWrapper + "' was requested but is not in the allowed list: " + this._semanticWrapperOptions, this);
         }
         return outerNode;
      }
   });
});