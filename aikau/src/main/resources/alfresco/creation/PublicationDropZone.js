/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * @module alfresco/creation/PublicationDropZone
 * @extends module:alfresco/creation/DropZone
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/creation/DropZone",
        "dojo/_base/lang",
        "dijit/registry",
        "dojo/on"], 
        function(declare, DropZone, lang, registry, on) {
   
   return declare([DropZone], {
      
      /**
       * The types that this drop zone will accept. By default this is set to null but if not specified
       * in the configuration this will be initialised to ["widget"].
       *
       * @instance
       * @type {string[]}
       * @default null
       */
      acceptTypes: ["publication"],

      // /**
      //  * Gets any widgets that are defined within the widget bound to the supplied node. If a widget dropped
      //  * into the drop-zone has any widgets that have been dropped into it then there definitions need to be
      //  * retrieved and saved.
      //  *
      //  * @instance
      //  * @param {element} node The DOM node from which to retrieve the widget data
      //  * @param {object} The definition object that should be updated
      //  */
      // getSubWidgetDefinitions: function alfresco_creation_PublicationDropZone__getSubWidgetDefinitions(node, newDef, currentField) {
      //    var widget = registry.byNode(node);
      //    if (widget != null && 
      //        typeof widget.getWidgetDefinitions === "function")
      //    {
      //       var defs = widget.getWidgetDefinitions();
      //       if (defs == null || defs.length == 0)
      //       {
      //          // No action
      //       }
      //       else
      //       {
      //          lang.setObject("publishPayload", defs, newDef);
      //       }
      //    }
      // },
      
      /**
       * This function is called as an after aspect of the onDrop function of the DND target. It is used
       * to capture widgets being added into the DropZone and emits an event intended for it's own 
       * DropZoneWrapper and DropZones in it's hierarchy (if any exist) so that they can update their 
       * own configuration with the details of their internal DropZones. This is done so that when an outer
       * DropZone is updates (e.g. it's configuration is changed) that the internals can be faithfully
       * be recreated.
       * 
       * @instance
       */
      emitOnWidgetUpdate: function alfresco_creation_DropZone__emitOnWidgetUpdate() {
         this.alfLog("log", "Widgets updated");
         
         // At this point we're about to return the information that will be used to add a new item
         // to the DND target. This information contains the data for displaying the widget configuration.
         // However, if this DropZone is nested (e.g. a MenuBarItem within a MenuBar) then the MenuBar 
         // object needs to be notified of the new content...
         on.emit(this.domNode, "onWidgetUpdate", {
            bubbles: true,
            cancelable: true,
            widgetsForDisplay: [
               {
                  name: "alfresco/creation/PublicationDropZone",
                  config: {
                     horizontal: this.horizontal
                  }
               }
            ]
         });
      }
   });
});