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
 * This is a customization of the [AlfCascadingMenu]{@link module:alfresco/menus/AlfCascadingMenu} to asynchronously
 * load the available node creation templates from the Alfresco Repository. Currently this makes its own XHR call
 * to retrieve the data (as this is quite a specific requirement) however it could potentially be decoupled via
 * pub/sub to make more generic.
 * 
 * @module alfresco/documentlibrary/AlfCreateTemplateContentMenu
 * @extends module:alfresco/menus/AlfCascadingMenu
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfCascadingMenu",
        "alfresco/documentlibrary/_AlfCreateContentPermissionsMixin",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "alfresco/core/CoreXhr",
        "alfresco/menus/AlfMenuGroup",
        "alfresco/menus/AlfMenuItem",
        "dojo/_base/lang",
        "dojo/_base/array",
        "service/constants/Default"], 
        function(declare, AlfCascadingMenu, _AlfCreateContentPermissionsMixin, _AlfDocumentListTopicMixin, AlfCoreXhr, 
                 AlfMenuGroup, AlfMenuItem, lang, array, AlfConstants) {
   
   return declare([AlfCascadingMenu, _AlfCreateContentPermissionsMixin, _AlfDocumentListTopicMixin, AlfCoreXhr], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfCreateTemplateContentMenu.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfCreateTemplateContentMenu.properties"}],
      
      /**
       * This defines the default widgets to display in the menu which is initially just a loading
       * message which should be replaced when the XHR request returns with some data.
       * 
       * @instance
       * @type {object[]}
       */
      widgets: [
         {
            name: "alfresco/header/AlfMenuItem",
            config: {
               iconClass: "alf-loading-icon",
               label: "loading.label"
            }
         }
      ],
      
      /**
       * Extends the [superclass function]{@link module:alfresco/menus/AlfCascadingMenu#postCreate} to subscribe to 
       * setup handlers to call [loadTemplates]{@link module:alfresco/documentlibrary/AlfCreateTemplateContentMenu#loadTemplates}
       * when the cascading menu is opened.
       *  
       * @instance
       */
      postCreate: function alf_menus_documentlibrary_AlfCreateTemplateContentMenu__postCreate() {
         this.alfSubscribe(this.hashChangeTopic, lang.hitch(this, this.onFilterChange));
         this.alfSubscribe(this.userAccessChangeTopic, lang.hitch(this, this.onUserAcess));
         this.inherited(arguments);
         if (this.label)
         {
            this.set("label", this.message(this.label));
         }
         else
         {
            this.set("label", this.message("menu.label"));
         }
         if (this.popup)
         {
            // The "opOpen" function of the associated AlfMenuGroups widget is not defined by default so we're 
            // going to "link" it to the popupFocused function so that the first time the user clicks on the 
            // AlfSitesMenu in the menu bar we can asynchronously load the required data.
            this.popup.onOpen = dojo.hitch(this, "loadTemplates");
         }
         else
         {
            this.alfLog("error", "No menu popup - something has gone wrong!");
         }
      },
      
      
      /**
       * A URL to override the default. Primarily provided for the test harness.
       * @instance
       * @type {string}
       * @default null
       */
      _templatesUrl: null,
      
      /**
       * Indicates whether the templates have been loaded yet.
       * 
       * @instance
       * @type {boolean}
       * @default false
       */
      _templatesAlreadyLoaded: false,
      
      /**
       * This function is called when the user clicks on the "Templates" cascading menu item to asynchronously
       * load the available content templates.
       * 
       * @instance
       */
      loadTemplates: function alf_menus_documentlibrary_AlfCreateTemplateContentMenu__loadTemplates() {
         if (this._templatesAlreadyLoaded)
         {
            this.alfLog("log", "Templates already loaded");
         }
         else
         {
            this.alfLog("log", "Loading templates");
            var url = this._templatesUrl;
            if (!url)
            {
               url = "slingshot/doclib/node-templates";
            }
            this.serviceXhr({url : AlfConstants.PROXY_URI + url,
                             method: "GET",
                             successCallback: this._templatesLoaded,
                             failureCallback: this._templatesLoadFailed,
                             callbackScope: this});
         }
      },
      
      /**
       * Handles the successful loading of template nodes.
       * 
       * @instance _templatesLoaded
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      _templatesLoaded: function alf_menus_documentlibrary_AlfCreateTemplateContentMenu___templatesLoaded(response, originalRequestConfig) {
         this.alfLog("log", "Templates data loaded successfully", response);
         this._templatesAlreadyLoaded = true;
         
         // Check for keyboard access by seeing if the first child is focused...
         var focusFirstChild = this.popup && this.popup.getChildren().length > 0 && this.popup.getChildren()[0].focused;
         
         // Remove the loading templates item...
         var _this = this;
         array.forEach(this.popup.getChildren(), function(widget) {
            _this.popup.removeChild(widget);
         });
         
         // Add recent groups if there are some...
         if (response.data)
         {
            if (response.data.length > 0)
            {
               var group = new AlfMenuGroup({});
               this.popup.addChild(group);
               array.forEach(response.data, dojo.hitch(this, "_addMenuItem", group));
            }
            else
            {
               // If there are no templates then we don't want to just display nothing, so we'll create
               // a non-functional menu item (e.g. one that doesn't do anything) to indicate that there
               // aren't any templates. A reference is kept so we can remove it when adding a new item.
               this.addNoTemplatesMessageItem();
            }
         }
         
         if (focusFirstChild)
         {
            // Focus the first template (or the no templates item)...
            this.popup.focusFirstChild();
         }
      },
      
      /**
       * Handles failed attempts to load templates.
       * 
       * @instance _templatesLoadFailed
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      _templatesLoadFailed: function alf_menus_documentlibrary_AlfCreateTemplateContentMenu___templatesLoadFailed(response, originalRequestConfig) {
         this.alfLog("error", "Could not load templates menu items", response);
         
         // Remove the loading templates item...
         var _this = this;
         array.forEach(this.popup.getChildren(), function(widget) {
            _this.popup.removeChild(widget);
         });
         this.addTemplatesFailMessageItem();
      },
      
      /**
       * Adds a non-functional message menu item to the templates menu. This is used when needing to 
       * indicate that the templates didn't load or that there are no templates.
       * 
       * @instance
       */
      addNoTemplatesMessageItem: function alf_menus_documentlibrary_AlfCreateTemplateContentMenu__addNoTemplatesMessageItem() {
         this._templatesMessageItem = new AlfMenuItem({
            label: "no.templates.label"
         });
         this.popup.addChild(this._templatesMessageItem);
      },
      
      /**
       * Adds a non-functional message menu item to the templates menu. This is used when needing to 
       * indicate that the templates could not be loaded. The most likely cause of this would be when
       * connectivity has been lost, authentication timed out or the repository has gone down since
       * loading the page.
       * 
       * @instance
       */
      addTemplatesFailMessageItem: function alf_menus_documentlibrary_AlfCreateTemplateContentMenu__addTemplatesFailMessageItem() {
         this._templatesMessageItem = new AlfMenuItem({
            label: "templates.load.error"
         });
         this.popup.addChild(this._templatesMessageItem);
      },
      
      /**
       * The topic to publish on when requesting to create templated content
       * 
       * @instance
       * @type {string} 
       * @default "ALF_CREATE_CONTENT"
       */
      templatePublishTopic: "ALF_CREATE_CONTENT",
      
      /**
       * The iconClass to use on each template content menu item
       * 
       * @instance
       * @type {string}
       * @default "alf-textdoc-icon"
       */
      templateIconClass: "alf-textdoc-icon",
      
      /**
       * The type of template to be created. Either "node" or "folder".
       *
       * @instance
       * @type {string}
       * @default "node"
       */
      templateType: "node",

      /**
       * An optional NodeRef in which to create the template.
       *
       * @instance
       * @type {string}
       * @default null
       */
      targetNodeRef: null,

      /**
       * Adds an individual menu item.
       * 
       * @instance
       * @param {object} group The group to add the menu item to
       * @param {object} widget The menu item to add
       * @param {integer} index The index to add the menu item at.
       */
      _addMenuItem: function alf_menus_documentlibrary_AlfCreateTemplateContentMenu___addMenuItem(group, widget, index) {
         var label = (widget.title !== "") ? widget.title : widget.name;
         var item = new AlfMenuItem({
            label: label,
            iconClass: this.templateIconClass,
            publishTopic: this.templatePublishTopic,
            publishPayload: {
               type: "template",
               params: {
                  sourceNodeRef: widget.nodeRef,
                  targetNodeRef: this.targetNodeRef,
                  templateType: this.templateType,
                  name: widget.name,
                  title: widget.title,
                  description: widget.description
               }
            }
         });
         group.addChild(item);
      }
   });
});