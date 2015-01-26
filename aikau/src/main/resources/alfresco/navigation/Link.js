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
 * The purpose of the Link widget is to provide a re-usable accessible link that is compatible with the
 * publication/subscription model used by the Alfresco widgets. It is important that a "title" attribute
 * is set that provides context to the link (e.g. "Delete 'Document 1'" rather than just "Delete", etc.)
 * 
 * @module alfresco/navigation/Link
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes external:dojo/_OnDijitClickMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/_OnDijitClickMixin",
        "dojo/text!./templates/Link.html",
        "alfresco/core/Core",
        "dojo/_base/event"], 
        function(declare, _WidgetBase, _TemplatedMixin, _OnDijitClickMixin, template, AlfCore, event) {

   return declare([_WidgetBase, _TemplatedMixin, _OnDijitClickMixin, AlfCore], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Link.css"}]
       */
      cssRequirements: [{cssFile:"./css/Link.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * This is the label that will appear as the link. 
       * 
       * @instance
       * @type {string}
       * @default
       */
      label: "",
      
      /**
       * This will appear as the hover title for the link. It is especially important for accessibility 
       * that this is given a meaningful value, e.g. some kind of context as to the purpose of the link.
       * 
       * @instance
       * @type {string}
       * @default "" 
       */
      title: "",
      
      /**
       * This is the topic that will be published on when the link is clicked (either by mouse or keyboard).
       * 
       * @instance
       * @type {string}
       * @default ""
       */
      publishTopic: "",
      
      /**
       * This is the object that will be published on the [publish topic]{@link module:alfresco/navigation/Link#publishTopic}
       * when the link is clicked.
       * 
       * @instance
       * @type {object}
       * @default null
       */
      publishPayload: null,
      
      /**
       * Ensures that labels and titles are set and issues warnings if any data is not set as expected.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_navigation_Link__postMixInProperties() {
         if (this.label != null && this.label != "")
         {
            this.label = this.message(this.label);
         }
         else
         {
            this.label = "";
            this.alfLog("warn", "No sensible 'label' attribute set for a link", this);
         }
         if (this.title != null && this.title != "")
         {
            this.title = this.message(this.title);
         }
         else
         {
            this.title = "";
            this.alfLog("warn", "No sensible 'title' attribute set for a link", this);
         }
         if (this.publishPayload == null)
         {
            this.publishPayload = {};
         }
         if (this.publishTopic == null || this.publishTopic == "")
         {
            this.alfLog("warn", "A link has been created without a 'publishTopic' attribute, clicking it will have no effect", this);
         }
      },
      
      /**
       * This is called whenever the user actions the link either with the mouse or with the keyboard. It publishes the
       * [publish payload]{@link module:alfresco/navigation/Link#publishPayload} on the [publish topic]{@link module:alfresco/navigation/Link#publishTopic}
       * @instance
       * @param {object} evt The click event
       */
      onClick: function alfresco_navigation_Link__onClick(evt) {
         event.stop(evt);
         if (this.publishTopic != null)
         {
            this.alfPublish(this.publishTopic, this.publishPayload);
         }
      }
   });
});