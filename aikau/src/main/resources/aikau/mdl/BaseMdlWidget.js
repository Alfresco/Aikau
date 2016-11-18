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
 * @module aikau/mdl/BaseMdlWidget
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @author Dave Draper
 * @since 1.0.96
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "alfresco/core/Core",
        "aikau/core/ChildProcessing",
        "dojo/_base/lang"], 
        function(declare, _WidgetBase, _TemplatedMixin, Core, ChildProcessing, lang) {
   
   return declare([_WidgetBase, _TemplatedMixin, Core, ChildProcessing], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/material-icons.css"},{cssFile:"./css/material.css"}]
       */
      cssRequirements: [{cssFile:"./css/material-icons.css"},
                        {cssFile:"./css/material.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: "<div>No template provided</div>",

      /**
       * [nonAmdDependencies description]
       * @type {Array}
       */
      nonAmdDependencies: ["./material.js"],

      /**
       * An optional DOM node to be used as the target for creating child widgets in. This is used
       * by [postCreate]{@link module:aikau/mdl/BaseMdlWidget#postCreate}.
       * 
       * @instance
       * @type {object}
       * @default
       */
      _targetNode: null,

      /**
       * Indicates whether or not child widgets should be created as soon as the widget itself
       * is created.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      createChildrenImmediately: true,

      /**
       * TODO: This is only being kept as an example - we don't always want to do this with no 
       * action because it will be expensive.
       * 
       * @instance
       */
      onAddedToDocument: function aikau_mdl_BaseMdlWidget__onAddedToDocument() {
         // No action by default
         this.alfLog("info", "Added to document", this.id);
      },

      /**
       * Creates any child widgets
       *
       * @instance
       */
      postCreate: function aikau_mdl_BaseMdlWidget__postCreate() {
         if (this.widgets && this.createChildrenImmediately)
         {
            // this.processWidgets(this.widgets, this.domNode);
            this.createChildren({
               widgets: this.widgets,
               targetNode: this._targetNode || this.domNode
            }).then(lang.hitch(this, function(widgets) {
               this.childWidgets = widgets;
            }));
         }
      },

      /**
       * Ensure that all child widgets have been upgraded.
       *
       * @instance
       * @param  {object[]} widgets [description]
       */
      postCreationProcessing: function aikau_mdl_BaseMdlWidget__postCreationProcessing(input) {
         this.inherited(arguments);
         if (input.widget && input.widget.domNode)
         {
            /* global componentHandler */
            componentHandler.upgradeElement(input.widget.domNode);
         }
      }
   });
});