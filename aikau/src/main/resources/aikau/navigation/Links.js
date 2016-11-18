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
 * <p><b>This widget is in the "aikau" package and does not adhere to the backwards compatibility standards
 * of the "alfresco" package. The code in this package is intended to form the basis of the next major release
 * of Aikau and will remain in an unstable state until ready for release. Please evaluate and feedback on this
 * module but do not rely on it in production!</b></p>
 *
 * @module aikau/navigation/Links
 * @extends module:aikau/mdl/BaseMdlWidget
 * @author Dave Draper
 * @since 1.0.96
 */
define(["dojo/_base/declare",
        "aikau/mdl/BaseMdlWidget", 
        "dojo/text!./templates/Links.html",
        "dojo/_base/lang",
        "dojo/dom-class",
        "dojo/on"], 
        function(declare, BaseMdlWidget, template, lang, domClass, on) {
   
   return declare([BaseMdlWidget], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/Links.css"}]
       */
      cssRequirements: [{cssFile:"./css/Links.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * Extends the [inherited function]{@link module:aikau/mdl/BaseMdlWidget#postCreate}
       * to create an event listener to handle child [links]{@link module:aikau/navigation/Link}
       * being selected (using [onLinkSelected]{@link module:aikau/navigation/Links#onLinkSelected}
       * as the callback).
       * 
       * @instance
       */
      postCreate: function aikau_navigation_Links__postCreate() {
         this.inherited(arguments);
         on(this.domNode, "onAikauLinkSelected", lang.hitch(this, this.onLinkSelected));
      },

      /**
       * Handles child [links]{@link module:aikau/navigation/Link} being selected. All other
       * links are updated to indicate that they are not selected and the link that has
       * triggered the event is updated to indicate that it is selected.
       * 
       * @instance
       */
      onLinkSelected: function aikau_navigation_Links__onLinkSelected(evt) {
         if (evt)
         {
            (typeof evt.stopPropagation === "function") && evt.stopPropagation();

            if (Array.isArray(this.childWidgets))
            {
               this.childWidgets.forEach(function(child) {
                  domClass.remove(child.domNode, "aikau-navigation-Links--selected");
               });
            }

            if (evt.widget && evt.widget.domNode) 
            {
               domClass.add(evt.widget.domNode, "aikau-navigation-Links--selected");
            }
         }
      }
   });
});