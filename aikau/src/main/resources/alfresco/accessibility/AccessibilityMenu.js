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
 * This module creates, when configured, an accessibility menu which provides a selection of hotkey links such as 'skip to content'.
 * 
 * @module alfresco/accessibility/AccessibilityMenu
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @example <caption>Sample configuration</caption>
 * {
 *    name: "alfresco/accessibility/AccessibilityMenu",
 *    config: {
 *       id: "AccessibilityMenu",
 *       titleMsgKey: "access.key.links.message",
 *       menu: [
 *          {url: "#accesskey-skip", key: "s", msgKey: "skip.to.content.message"},
 *          {url: "/share/page/accessibility-help", key: "0", msgKey: "access.keys.message"},
 *          {url: "/share/page/user/admin/dashboard", key: "1", msgKey: "home.page.message"},
 *          {url: "/share/page/advsearch", key: "4", msgKey: "search.this.site.message"},
 *          {url: "/share/page/site-help", key: "6", msgKey: "accessibility.help.message"},
 *          {url: "/share/page/terms", key: "8", msgKey: "terms.and.conditions.message"},
 *          {url: "/share", key: "9", msg: "This is just a test message"},
 *          {url: "#accesskey-foot", key: "b", msgKey: "skip.to.foot.message"}
 *       ],
 *       targets: [
 *          {domid: "AccessibilityMenu", targetid: "accesskey-skip", after: false},
 *          {domid: "AccessibilityMenu", targetid: "accesskey-foot", after: true}
 *       ]
 *    }
 * }
 * @author Richard Smith
 */
 define(["dojo/_base/declare",
         "dijit/_WidgetBase", 
         "dijit/_TemplatedMixin",
         "dojo/text!./templates/AccessibilityMenu.html",
         "dojo/_base/lang",
         "alfresco/core/Core",
         "dojo/dom",
         "dojo/dom-construct",
         "dojo/on",
         "dojo/dom-attr"], 
         function(declare, _WidgetBase, _TemplatedMixin, template, lang, AlfCore, dom, domConstruct, on, domAttr) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore], {

      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AccessibilityMenu.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AccessibilityMenu.properties"}],

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/AccessibilityMenu.css"}]
       */
      cssRequirements: [{cssFile:"./css/AccessibilityMenu.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * The message key to display as title if no titleMsg provided
       * @instance
       * @type {String}
       */
      titleMsgKey: "access.key.links.message",

      /**
       * The message to display as title
       * @instance
       * @type {String}
       */
      titleMsg: null,
      
      /**
       * The urls, access keys and message identifiers used to render the accessibility links
       * @instance
       * @type {object[]}
       */
      menu: [],

      /**
       * The domid, targetid and positioning used to render the accessibility link targets
       * @instance
       * @type {object[]}
       */
      targets: [],

      /**
       * A storage array for the menu links we generate
       * @private
       * @type {object[]}
       */
      _createdLinks: [],

      /**
       * @instance
       */
      postCreate: function alfresco_accessibility_AccessibilityMenu__postCreate() {

         // Inject access key header
         domConstruct.create("p", {
            innerHTML: this.titleMsg ? this.titleMsg : this.message(this.titleMsgKey)
         }, this.accessKeys, "first");

         // Create unordered list for access key items - injected at the end of the accessKeys object
         var ul = domConstruct.create("ul", null, this.accessKeys, "last");

         // Then iterate menu items creating li and a tags accordingly
         for (var i=0, item; item = this.menu[i]; i++)
         {
            this.writeMenuItem(ul, item);
         }

         // Subscribe generateTargets and addEvents to ALF_WIDGETS_READY
         this.alfSubscribe("ALF_WIDGETS_READY", lang.hitch(this, "generateTargets"));
         this.alfSubscribe("ALF_WIDGETS_READY", lang.hitch(this, "addEvents"));

      },

      /**
       * This function writes a list item for the accessibility menu.
       * @instance
       * @param {object} list The list into which menu items are added
       * @param {object} item The object containing details for the menu item
       */
      writeMenuItem: function alfresco_accessibility_AccessibilityMenu__writeMenuItem(list, item) {

         // If the menu item has at least a msg or msgKey
         if(item.msg || item.msgKey){
         
            // If the list container exists
            if(list)
            {
               // Create the list item
               var li = domConstruct.create("li", null, list, "last");
   
               // Insert an a tag into the list item
               this._createdLinks.push(
                  domConstruct.create("a", {
                     href: item.url,
                     accessKey: item.key,
                     innerHTML: item.msg ? item.msg : this.message(item.msgKey)
                  }, li)
               );

               this.alfLog("log", "Created accessibility menu item '" + item.url + "'", this);
            }
            else
            {
               this.alfLog("error", "List specified as container for 'writeMenuItem' does not exist", this);
            }
         }
         else
         {
            this.alfLog("error", "An accessibility menu item was provided with neither a 'msgKey' nor a 'msg'", this);
         }
      },

      /**
       * This function generates HTML anchors from this.targets. It is called via a subscription to the ALF_WIDGETS_READY 
       * channel to make sure that the destination DOM elements have already been created.
       * @instance
       * @listens ALF_WIDGETS_READY
       */
      generateTargets: function alfresco_accessibility_AccessibilityMenu__generateTargets() {

         // Iterate target items creating anchors accordingly
         for (var i=0, item; item = this.targets[i]; i++)
         {
            if(dom.byId(item.domid))
            {
               var pos = item.after ? "after" : "before";
               domConstruct.create("a", {
                  id: item.targetid,
                  innerHTML: " "
               }, item.domid, pos);
               
               this.alfLog("log", "Created accessibility anchor '" + item.targetid + "'", this);
            }
            else
            {
               this.alfLog("error", "Dom element '" + item.domid + "', specified as location for accessibility anchor, does not exist", this);
            }
         }  
      },

      /**
       * This function iterates over the generated menu links. If they contain a '#' value and the target item (by id) can 
       * be found then the link is given an onClick that sets and then unsets the tabindex of the target to take it out of 
       * regular page flow, and then focuses it.
       * @instance
       * @listens ALF_WIDGETS_READY
       */
      addEvents: function alfresco_accessibility_AccessibilityMenu__addEvents() {
         
         // Iterate over the _createdLinks and attach click events to them
         for(var i=0; i < this._createdLinks.length; i++)
         {
            var item = this._createdLinks[i];
            if(item.href.indexOf("#") != -1)
            {
               var target = dom.byId(item.href.split('#')[1]);
               if(target)
               {
                  on(item, "click", function(){
                     domAttr.set(target, "tabindex", -1);
                     on(item, "blur, focusout", function(){
                        domAttr.remove(target, "tabindex");
                     });
                     target.focus();
                  });
               }
            }
         }
      }
   });
});