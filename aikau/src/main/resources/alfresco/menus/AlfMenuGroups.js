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
 * @module alfresco/menus/AlfMenuGroups
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes external:dojo/_KeyNavContainer
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_KeyNavContainer",
        "dojo/text!./templates/AlfMenuGroups.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "dojo/keys",
        "dojo/_base/array",
        "alfresco/menus/AlfMenuGroup"], 
        function(declare, _WidgetBase, _TemplatedMixin, _KeyNavContainer, template, AlfCore, CoreWidgetProcessing, keys, array, AlfMenuGroup) {
   
   /**
    * This class has been created to act as the main container for the popup referenced by "alfresco/menus/AlfMenuBarPopup".
    * It currently just acts as a container object but is intended to allow instances of "alfresco/menus/AlfMenuGroup" to be
    * added into a menu bar popup.
    */
   return declare([_WidgetBase, _TemplatedMixin, _KeyNavContainer, AlfCore, CoreWidgetProcessing], {
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * Process any widgets provided.
       * 
       * @instance
       */
      postCreate: function alfresco_menus_AlfMenuGroups__postCreate() {
         // Set up keyboard handling...
         var l = this.isLeftToRight();
         this._openSubMenuKey = l ? keys.RIGHT_ARROW : keys.LEFT_ARROW;
         this._closeSubMenuKey = l ? keys.LEFT_ARROW : keys.RIGHT_ARROW;
         this.connectKeyNavHandlers([keys.UP_ARROW], [keys.DOWN_ARROW]);
         
         if (this.widgets)
         {
            this.processWidgets(this.widgets);
         }
      },
      
      /**
       * 
       * @instance
       */
      allWidgetsProcessed: function alfresco_menus_AlfMenuGroups__allWidgetsProcessed(widgets) {
         var _this = this;
         array.forEach(widgets, function(widget) {
            _this.addChild(widget);
         });
      },
      
      /**
       * Extends the default implementation to ensure that all child widgets are an instance
       * of AlfMenuGroup.
       * 
       * @instance
       * @param {object} widget The widget to be added
       * @param {integer} insertIndex The index to add the widget at
       */
      addChild: function alfresco_menus_AlfMenuGroups__addChild(widget, insertIndex) {
         if (widget.isInstanceOf(AlfMenuGroup))
         {
            // Check to see if the current entry is an AlfMenuGroup.
            this.alfLog("log", "Adding group: ", widget);
            this.inherited(arguments);
         }
         else
         {
            this.alfLog("log", "Creating group for: ", widget);
            var newGroup = new AlfMenuGroup({pubSubScope: widget.pubSubScope});
            newGroup.addChild(widget);
            this.inherited(arguments, [newGroup, insertIndex]);
         }
      }
   });
});