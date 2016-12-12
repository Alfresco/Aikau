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
 * This is the default tag used by the [Tags renderer]{@link module:alfresco/renderers/Tags} and is used to represent a previously
 * added tag that can be removed by either giving the tag focus and clicking "SPACE" or "ENTER" or by clicking the "X" icon.
 * 
 * @module alfresco/renderers/EditTag
 * @extends module:aikau/core/BaseWidget
 * @mixes external:dojo/_OnDijitClickMixin
 * @mixes external:dojo/_FocusMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikau/core/BaseWidget",
        "dijit/_OnDijitClickMixin",
        "dijit/_FocusMixin",
        "dojo/_base/lang",
        "dojo/on",
        "dojo/dom-class"], 
        function(declare, BaseWidget, _OnDijitClickMixin, _FocusMixin, lang, on, domClass) {

   return declare([BaseWidget, _OnDijitClickMixin, _FocusMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/EditTag.css"}]
       */
      cssRequirements: [{cssFile:"./css/EditTag.css"}],
      
      /**
       * The display name for the tag.
       * 
       * @instance
       * @type {string}
       * @default 
       */
      tagName: null,
      
      /**
       * The value of the tag (typically this will be a nodeRef)
       * 
       * @instance
       * @type {string}
       * @default
       */
      tagValue: null,
      
      /**
       * Overrides [the inherited function]{@link module:aikau/core/BaseWidget#createWidgetDom}
       * to construct the DOM for the widget using native browser capabilities.
       *
       * @instance
       * @since 1.0.101
       */
      createWidgetDom: function alfresco_renderers_EditTag__createWidgetDom() {
         this.domNode = document.createElement("span");
         this.domNode.classList.add("alfresco-renderers-EditTag");
         this.domNode.setAttribute("tabindex", "0");
         this._attach(this.domNode, "ondijitclick", lang.hitch(this, this.onRemoveTag));
         
         this.tagNameNode = document.createElement("span");
         this.tagNameNode.classList.add("tagName");
         this.tagNameNode.textContent = this.tagName;

         this.tagDeleteNode = document.createElement("span");
         this.tagDeleteNode.classList.add("tagDelete");
         this.tagDeleteNode.innerHTML = "&nbsp;";

         this.domNode.appendChild(this.tagNameNode);
         this.domNode.appendChild(this.tagDeleteNode);
      },

      /**
       * Set up the attributes to be used when rendering the template.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_renderers_EditTag__postMixInProperties() {
         /*jshint eqnull:true*/
         if (this.tagName != null)
         {
            this.tagName = this.encodeHTML(this.tagName);
         }
      },
      
      /**
       * Determines whether or not the property should only be displayed when the item is hovered over.
       * 
       * @instance
       */
      postCreate: function alfresco_renderers_EditTag__postCreate() {
         
      },
      
      /**
       * This handler is called whenever the user clicks the delete image (or hits space or enter whenever it has focus).
       * Rather than publishing on a topic, this function emits a custom event that is expected to be handled by
       * a [Tags]{@link module:alfresco/renderers/Tags} widget (or a widget that extends it).
       * 
       * @instance
       * @param {object} evt The click event
       */
      onRemoveTag: function alfresco_renderers_EditTag__onRemoveTag(/*jshint unused:false*/ evt) {
         on.emit(this.domNode, "ALF_REMOVE_TAG", { bubbles: true, cancelable: true });
      },
      
      /**
       * Adds the "highlight" CSS class.
       * 
       * @instance
       */
      _onFocus: function alfresco_renderers_EditTag___onFocus() {
         domClass.add(this.domNode, "highlight");
      },
      
      /**
       * Removes the "highlight" CSS class.
       * 
       * @instance
       */
      _onBlur: function alfresco_renderers_EditTag___onBlur() {
         domClass.remove(this.domNode, "highlight");
      }
   });
});