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
 * <p>This module extends the standard [actions renderer]{@link module:alfresco/renderers/Actions} to 
 * provide the capability to asynchronously retrieve the actions for a specific Alfresco document or 
 * folder when only the NodeRef is known.</p>
 *
 * @module alfresco/renderers/XhrContextActions
 * @extends module:alfresco/renderers/ContextActions
 * @mixes module:alfresco/renderers/_XhrActionsMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/ContextActions",
        "alfresco/renderers/_XhrActionsMixin",
        "dojo/aspect",
        "dojo/_base/lang",
        "dojo/_base/array"], 
        function(declare, ContextActions, _XhrActionsMixin, aspect, lang, array) {

   return declare([ContextActions, _XhrActionsMixin], {
      
      /**
       *
       * @instance
       */
      addActions: function alfresco_renderers_XhrContextActions__postCreate() {
         this.actionsGroup.processWidgets(this.widgetsForLoading);
         aspect.after(this._contextMenu, "onFocus", lang.hitch(this, this.loadActions));
      },

      /**
       * Overrides the inherited function to remove children from the action group.
       * 
       * @instance
       */
      clearLoadingItem: function alfresco_renderers_XhrContextActions__clearLoadingItem() {
         array.forEach(this.actionsGroup.getChildren(), function(widget, index) {
            this.actionsGroup.removeChild(widget);
         }, this);
      },

      /**
       * Adds the menu items for the asynchronously retrieved data.
       *
       * @instance
       */
      addXhrItems: function alfresco_renderers_XhrContextActions__addXhrItems() {
         array.forEach(this.currentItem.actions, lang.hitch(this, "addAction"));
      }
   });
});