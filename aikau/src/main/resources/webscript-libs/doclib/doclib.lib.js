/* global config,remote,user,msg,url */

// Look for any DocumentLibrary XML configuration. This is expected to exist in Alfresco Share
// but may not exist in other clients...
var docLibXmlConfig = config.scoped.DocumentLibrary;

// "syncMode" will be expected to be set in Alfresco Share (and could potentially be provided
// in other clients) and provided information about the context of synchronization with the 
// Alfresco Cloud services. "OFF" indicates that the no Cloud sync is available (or configured)
// whereas "ON_PREMISE" indicates that the client is an on-premise application (e.g. is it
// NOT the Alfresco Cloud itself).
function getSyncMode() {
   var syncMode = "OFF";
   if (this.syncMode)
   {
      syncMode = this.syncMode.getValue();
   }
   return syncMode;
}

/* *********************************************************************************
 *                                                                                 *
 * GET ALL USER PREFERENCES                                                        *
 *                                                                                 *
 ***********************************************************************************/
function getUserDocLibPreferences() {

   // Initialise some default preferences...
   var docLibPrefrences = {
      viewRendererName: "detailed",
      sortField: "cm:name",
      sortAscending: true,
      showFolders: true,
      hideBreadcrumbTrail: false,
      showSidebar: true
   };

   // NOTE: Using "this" in reference to the global scope
   var prefs;
   if (!this.preferences)
   {
      var result = remote.call("/api/people/" + encodeURIComponent(user.name) + "/preferences");
      if (result.status.code === status.STATUS_OK)
      {
         prefs = JSON.parse(result);
      }
   }
   else
   {
      prefs = JSON.parse(this.preferences.value);
   }
   if (prefs)
   {
      // NOTE: In this initial implementation we're assuming the continued use of the
      //       Alfresco Share document library user preferences. This could be updated
      //       in the future to accept alternative preference addresses.
      if (prefs.org &&
          prefs.org.alfresco &&
          prefs.org.alfresco.share &&
          prefs.org.alfresco.share.documentList)
      {
         var dlp = prefs.org.alfresco.share.documentList;
         docLibPrefrences.viewRendererName = dlp.viewRendererName || "detailed";
         docLibPrefrences.sortField = dlp.sortField || "cm:name";
         docLibPrefrences.sortAscending = dlp.sortAscending !== false;
         docLibPrefrences.showFolders = dlp.showFolders !== false;
         docLibPrefrences.hideBreadcrumbTrail = dlp.hideNavBar === true;
         docLibPrefrences.showSidebar = dlp.showSidebar !== false;
         docLibPrefrences.galleryColumns = dlp.galleryColumns || 4;
         docLibPrefrences.sideBarWidth = prefs.org.alfresco.sideBarWidth || 350;
      }
   }
   return docLibPrefrences;
}

function setupDocLibPreferences(options) {
   if (options.docLibPrefrences)
   {
      // Preferences have already been setup - no action required.
   }
   else if (options.getUserPreferences !== false)
   {
      options.docLibPrefrences = getUserDocLibPreferences();
   }
   else
   {
      // ...otherwise just define some sensible defaults
      options.docLibPrefrences = {
         viewRendererName: "detailed",
         sortField: "cm:name",
         sortAscending: true,
         showFolders: true,
         hideBreadcrumbTrail: false,
         showSidebar: true
      };
   }
}

/* *********************************************************************************
 *                                                                                 *
 * QUICK SHARE LINK                                                                *
 *                                                                                 *
 ***********************************************************************************/
var quickShareLink = "",
    quickShareConfig = config.scoped.Social.quickshare;
if (quickShareConfig)
{
   var configValue = quickShareConfig.getChildValue("url");
   if (configValue)
   {
      quickShareLink = configValue.replace("{context}", url.context);
   }
}

/* *********************************************************************************
 *                                                                                 *
 * SOCIAL LINKS                                                                    *
 *                                                                                 *
 ***********************************************************************************/
var socialLinks = [],
    socialLinksConfig = config.scoped.Social.linkshare;
if (socialLinksConfig !== null)
{
   var configs = socialLinksConfig.getChildren();

   if (configs)
   {
      for (var i = 0; i < configs.size(); i++)
      {
         var socialItem = configs.get(i);
         // var socialLabel = String(socialItem.attributes.label);
         // var socialValue = String(socialItem.value);
         socialLinks[i] = {
            id: socialItem.attributes.id,
            type: socialItem.attributes.type,
            index: socialItem.attributes.index,
            params: []
         };
         var params = socialItem.getChildren();
         if (params)
         {
            for (var j = 0; j < params.size(); j++)
            {
               var paramConfig = params.get(j);
               var param = {};
               param[paramConfig.attributes.name] = paramConfig.value;
               socialLinks[i].params[j] = param;
            }
         }
      }
   }
}

/* *********************************************************************************
 *                                                                                 *
 * SELECTED ITEMS ACTION OPTIONS                                                   *
 *                                                                                 *
 ***********************************************************************************/
// Actions
var getMultiActionImage = function(attr) {
   var imageUrl = url.context + "/res/components/documentlibrary/actions/";
   if (attr.icon)
   {
      imageUrl += attr.icon;
   }
   else if (attr.id)
   {
      imageUrl += attr.id;
   }
   else
   {
      imageUrl += "generic";
   }
   imageUrl += "-16.png";
   return imageUrl;
};

/* *********************************************************************************
 *                                                                                 *
 * CREATE CONTENT MENU ITEMS                                                       *
 *                                                                                 *
 ***********************************************************************************/

var createContent = [];

function generateCreateContentMenuItem(menuItemLabel, dialogTitle, iconClass, modelType, mimeType, contentWidgetName, contentWidgetConfig, additionalWidgets) {
   var menuItem = {
      name: "alfresco/documentlibrary/AlfCreateContentMenuItem",
      config: {
         label: menuItemLabel,
         iconClass: iconClass,
         dialogTitle: dialogTitle,
         contentType: modelType,
         mimeType: mimeType,
         widgets: [
            {
               name: "alfresco/forms/controls/TextBox",
               config: {
                  label: msg.get("create.content.name.label"),
                  name: "prop_cm_name",
                  value: "",
                  requirementConfig: {
                     initialValue: true
                  }
               }
            },
            {
               name: "alfresco/forms/controls/TextBox",
               config: {
                  label: msg.get("create.content.title.label"),
                  name: "prop_cm_title",
                  value: ""
               }
            },
            {
               name: "alfresco/forms/controls/TextArea",
               config: {
                  label: msg.get("create.content.description.label"),
                  name: "prop_cm_description",
                  value: ""
               }
            }
         ]
      }
   };
   // If a content widget name has been specified then define the additional widget
   // and add in any additionally supplied configuration for it
   if (contentWidgetName)
   {
      var contentWidget = {
         name: contentWidgetName,
         config: {
            label: msg.get("create.content.content.label"),
            name: "prop_cm_content",
            value: ""
         }
      };
      if (contentWidgetConfig)
      {
         for (var key in contentWidgetConfig)
         {
            if (contentWidgetConfig.hasOwnProperty(key))
            {
               contentWidget.config[key] = contentWidgetConfig[key];
            }
         }
      }
      menuItem.config.widgets.push(contentWidget);
   }

   // Add in any additional widgets requested...
   menuItem.config.widgets.concat(additionalWidgets || []);
   return menuItem;
}

// Add in the create content options...
var folder = generateCreateContentMenuItem(msg.get("create.folder.label"), msg.get("create.folder.title"), "alf-showfolders-icon", "cm:folder", null);
var plainText = generateCreateContentMenuItem(msg.get("create.text-document.label"), msg.get("create.text-document.title"), "alf-textdoc-icon", "cm:content", "text/plain", "alfresco/forms/controls/TextArea");
var html = generateCreateContentMenuItem(msg.get("create.html-document.label"), msg.get("create.html-document.title"), "alf-htmldoc-icon", "cm:content", "text/html", "alfresco/forms/controls/TinyMCE");
var xml = generateCreateContentMenuItem(msg.get("create.xml-document.label"), msg.get("create.xml-document.title"), "alf-xmldoc-icon", "cm:content", "text/xml", "alfresco/forms/controls/CodeMirrorEditor", { editMode: "xml", width: 538, height: 250 }); // Dimensions as per defaults in TinyMCE control
createContent.splice(0, 0, folder, plainText, html, xml);

// Create content by template
var createContentByTemplateEnabled = true;
if (docLibXmlConfig["create-content-by-template"] && docLibXmlConfig["create-content-by-template"].value)
{
   createContentByTemplateEnabled = docLibXmlConfig["create-content-by-template"].value.toString().equals("true") || false;
}
if (createContentByTemplateEnabled)
{
   createContent.push({
      id: "CREATE_NODE_TEMPLATES",
      name: "alfresco/documentlibrary/AlfCreateTemplateContentMenu",
      config: {
         label: msg.get("menu.create-content.by-template-node")
      }
   });
   createContent.push({
      id: "CREATE_FOLDER_TEMPLATES",
      name: "alfresco/documentlibrary/AlfCreateTemplateContentMenu",
      config: {
         label: msg.get("menu.create-content.by-template-folder"),
         _templatesUrl: "slingshot/doclib/folder-templates",
         templateType: "folder"
      }
   });
}

/**
 * Helper function to retrieve configuration values.
 * 
 * @method getConfigValue
 * @param {string} configFamily
 * @param {string} configName
 * @param {string} defaultValue
 */
function getConfigValue(configFamily, configName, defaultValue)
{
   var value = defaultValue,
       theConfig = config.scoped[configFamily][configName];
   if (theConfig !== null)
   {
      value = theConfig.value;
   }
   return value;
}

/**
 * Replication URL Mapping
 */
function getReplicationUrlMappingJSON()
{
   var mapping = {};
   try
   {
      var urlConfig, 
          repositoryId,
          configs = config.scoped.Replication["share-urls"].getChildren("share-url");

      if (configs)
      {
         for (var i = 0; i < configs.size(); i++)
         {
            // Get repositoryId and Share URL from each config entry
            urlConfig = configs.get(i);
            repositoryId = urlConfig.attributes.repositoryId;
            if (repositoryId)
            {
               mapping[repositoryId] = urlConfig.value.toString();
            }
         }
      }
   }
   catch (e)
   {
   }
   return JSON.stringify(mapping);
}



// Data about sites can be used when the DocLib is being rendered for a specific site context,
// in order to make use of the site data then a "getSiteData" function needs to be available.
// In Alfresco Share this function is provided by the "share-header.lib.js" file which should
// be included in the same WebScript controller file as this library file if use of site data
// is required.
var userIsSiteManager = false;
if (typeof getSiteData === "function")
{
   var siteData = getSiteData();
   if (siteData)
   {
      userIsSiteManager = siteData.userIsSiteManager;
   }
}

/* *********************************************************************************
 *                                                                                 *
 * REPOSITORY URL                                                                  *
 *                                                                                 *
 ***********************************************************************************/
function getRepositoryUrl()
{
   // Repository Url
   var repositoryUrl = null,
      repositoryConfig = config.scoped.DocumentLibrary["repository-url"];

   if (repositoryConfig !== null)
   {
      repositoryUrl = repositoryConfig.value;
   }
   return repositoryUrl;
}

/* *********************************************************************************
 *                                                                                 *
 * PAGE CONSTRUCTION                                                               *
 *                                                                                 *
 ***********************************************************************************/

function getDocumentLibraryServices() {
   // jshint shadow:false
   var services = [
      {
         id: "NAVIGATION_SERVICE",
         name: "alfresco/services/NavigationService"
      },
      {
         id: "DIALOG_SERVICE",
         name: "alfresco/services/DialogService"
      },
      {
         id: "ACTION_SERVICE",
         name: "alfresco/services/ActionService"
      },
      {
         id: "CONTENT_SERVICE",
         name: "alfresco/services/ContentService"
      },
      {
         id: "CRUD_SERVICE",
         name: "alfresco/services/CrudService"
      },
      {
         id: "DOCUMENT_SERVICE",
         name: "alfresco/services/DocumentService"
      },
      {
         id: "LIGHTBOX_SERVICE",
         name: "alfresco/services/LightboxService"
      },
      {
         id: "QUICKSHARE_SERVICE",
         name: "alfresco/services/QuickShareService"
      },
      {
         id: "RATINGS_SERVICE",
         name: "alfresco/services/RatingsService"
      },
      {
         id: "SEARCH_SERVICE",
         name: "alfresco/services/SearchService"
      },
      {
         id: "TAG_SERVICE",
         name:  "alfresco/services/TagService"
      },
      {
         id: "NOTIFICATION_SERVICE",
         name:  "alfresco/services/NotificationService"
      },
      {
         id: "COMMENT_SERVICE",
         name:  "alfresco/services/CommentService"
      },
      {
         id: "UPLOAD_SERVICE",
         name:  "alfresco/services/UploadService"
      },
      {
         id: "CREATE_TEMPLATED_CONTENT_SERVICE",
         name: "alfresco/services/actions/CreateTemplateContentService"
      },
      {
         id: "COPY_AND_MOVE_SERVICE",
         name: "alfresco/services/actions/CopyMoveService"
      },
      {
         id: "SIMPLE_WORKFLOW_SERVICE",
         name: "alfresco/services/actions/WorkflowService"
      },
      {
         id: "NODE_LOCATION_SERVICE",
         name: "alfresco/services/actions/NodeLocationService"
         // TODO: This will need to be configured for the different contexts, e.g. Share and Aikau standalone
      },
      {
         id: "MANAGE_ASPECTS_SERVICE",
         name: "alfresco/services/actions/ManageAspectsService",
         config: {
            availableAspects: ["cm:generalclassifiable",
                               "cm:complianceable",
                               "cm:effectivity",
                               "cm:summarizable",
                               "cm:versionable",
                               "cm:templatable",
                               "cm:emailed",
                               "emailserver:aliasable",
                               "app:inlineeditable",
                               "cm:geographic",
                               "exif:exif",
                               "audio:audio",
                               "cm:indexControl",
                               "dp:restrictable"]
         }
      }
   ];
   return services;
}

function getDocLibFilters(options) {
   var filters = {
      id: (options.idPrefix || "") + "DOCLIB_FILTERS",
      name: "alfresco/documentlibrary/AlfDocumentFilters",
      config: {
         label: "filter.label.documents",
         additionalCssClasses: "no-borders",
         widgets: [
            {
               name: "alfresco/documentlibrary/AlfDocumentFilter",
               config: {
                  label: "link.all",
                  filter: "all",
                  description: "link.all.description"
               }
            },
            {
               name: "alfresco/documentlibrary/AlfDocumentFilter",
               config: {
                  label: "link.editingMe",
                  filter: "editingMe",
                  description: "link.editingMe.description"
               }
            },
            {
               name: "alfresco/documentlibrary/AlfDocumentFilter",
               config: {
                  label: "link.editingOthers",
                  filter: "editingOthers",
                  description: "link.editingOthers.description"
               }
            },
            {
               name: "alfresco/documentlibrary/AlfDocumentFilter",
               config: {
                  label: "link.recentlyModified",
                  filter: "recentlyModified",
                  description: "link.recentlyModified.description"
               }
            },
            {
               name: "alfresco/documentlibrary/AlfDocumentFilter",
               config: {
                  label: "link.recentlyAdded",
                  filter: "recentlyAdded",
                  description: "link.recentlyAdded.description"
               }
            },
            {
               name: "alfresco/documentlibrary/AlfDocumentFilter",
               config: {
                  label: "link.favourites",
                  filter: "favourites",
                  description: "link.favourites.description"
               }
            }
         ]
      }
   };

   // Add the additional cloud synchronization related filters...
   if (getSyncMode() !== "OFF")
   {
      filters.config.widgets.push({
         name: "alfresco/documentlibrary/AlfDocumentFilter",
         config: {
            label: "link.synced",
            filter: "synced",
            description: "link.synced.description"
         }
      });
   }
   if (getSyncMode() === "ON_PREMISE")
   {
      filters.config.widgets.push({
         name: "alfresco/documentlibrary/AlfDocumentFilter",
         config: {
            label: "link.syncedErrors",
            filter: "syncedErrors",
            description: "link.syncedErrors.description"
         }
      });
   }
   return filters;
}

function getDocLibTree(options) {
   var tree = {
      id: (options.idPrefix || "") + "DOCLIB_TREE",
      name: "alfresco/layout/Twister",
      config: {
         label: "twister.library.label",
         additionalCssClasses: "no-borders",
         widgets: [
            {
               name: "alfresco/navigation/PathTree",
               config: {
                  siteId: options.siteId,
                  containerId: options.containerId,
                  rootNode: options.rootNode,
                  rootLabel: options.rootLabel || "documentlibrary.root.label",
                  useHash: (options.useHash !== false)
               }
            }
         ]
      }
   };
   return tree;
}

function getDocLibTags(options) {
   var tags = {
      id: (options.idPrefix || "") + "DOCLIB_TAGS",
      name: "alfresco/documentlibrary/AlfTagFilters",
      config: {
         label: "filter.label.tags",
         additionalCssClasses: "no-borders",
         siteId: options.siteId,
         containerId: options.containerId,
         rootNode: options.rootNode
      }
   };
   return tags;
}

function getDocLibCategories(options) {
   var categories = {
      id: (options.idPrefix || "") + "DOCLIB_CATEGORIES_TWISTER",
      name: "alfresco/layout/Twister",
      config: {
         label: "twister.categories.label",
         additionalCssClasses: "no-borders",
         widgets: [
            {
               name: "alfresco/navigation/CategoryTree"
            }
         ]
      }
   };
   return categories;
}

function getDocLibCreateContentMenu(options) {
   var menu = {
      id: (options.idPrefix || "") + "DOCLIB_CREATE_CONTENT_MENU",
      name: "alfresco/documentlibrary/AlfCreateContentMenuBarPopup",
      config: {
         widgets: [
            {
               id: (options.idPrefix || "") + "DOCLIB_CREATE_CONTENT_MENU_GROUP1",
               name: "alfresco/menus/AlfMenuGroup",
               config: {
                  widgets: createContent
               }
            }
         ]
      }
   };
   return menu;
}

/* *********************************************************************************
 *                                                                                 *
 * CLOUD SYNC TOOLBAR ACTIONS                                                      *
 *                                                                                 *
 ***********************************************************************************/

function getDocLibCloudSyncToolbarActions(options) {
   var actions = [];
   if (getSyncMode() !== "OFF") {
      actions.push({
         id: (options.idPrefix || "") + "DOCLIB_SYNC_TO_CLOUD_BUTTON",
         name: "alfresco/documentlibrary/AlfCloudSyncFilteredMenuBarItem",
         config: {
            label: msg.get("actions.document.cloud-sync"),
            publishTopic: "ALF_SYNC_CURRENT_LOCATION"
         }
      },
      {
         id: (options.idPrefix || "") + "DOCLIB_UNSYNC_FROM_CLOUD_BUTTON",
         name: "alfresco/documentlibrary/AlfCloudSyncFilteredMenuBarItem",
         config: {
            label: msg.get("actions.document.cloud-unsync"),
            invertFilter: true,
            publishTopic: "ALF_UNSYNC_CURRENT_LOCATION"
         }
      });
   }
   return actions;
}

/* *********************************************************************************
 *                                                                                 *
 * MULTIPLE SELECTED ITEMS ACTIONS                                                 *
 *                                                                                 *
 ***********************************************************************************/

function getSelectedItemsActions(selectedItemsActions) {
   // jshint maxcomplexity:30
   var actions = [];
   if (selectedItemsActions)
   {
      // If a specific set of selected items actions have been provided
      // then use those...
   }
   else if (docLibXmlConfig["multi-select"])
   {
      // ...otherwise look to see if there is XML configuration for 
      // selected items actions...
      var multiSelectConfig = docLibXmlConfig["multi-select"],
          multiSelectActions = multiSelectConfig.getChildren("action");
      selectedItemsActions = [];
      for (var i = 0; i < multiSelectActions.size(); i++)
      {
         var multiSelectAction = multiSelectActions.get(i);
         selectedItemsActions.push(multiSelectAction.attributes);
      }
   }
   else
   {
      // ... but if all else fails, use a set of sensible defaults...
      // (these defaults are taken from the default Alfreso Share configuration)
      selectedItemsActions = [
         {
            type: "action-link",
            id: "onActionDownload",
            icon: "document-download",
            iconClass: "alf-download-as-zip-icon",
            label: "menu.selected-items.download"
         },
         {
            type: "action-link",
            id: "onActionCopyTo",
            icon: "document-copy-to",
            label: "menu.selected-items.copy"
         },
         {
            type: "action-link",
            id: "onActionMoveTo",
            icon: "document-move-to",
            label: "menu.selected-items.move",
            permission: "Delete"
         },
         {
            type: "action-link",
            id: "onActionAssignWorkflow",
            icon: "document-assign-workflow",
            label: "menu.selected-items.assign-workflow",
            asset: "document"
         },
         {
            type: "action-link",
            id: "onActionDelete",
            icon: "document-delete",
            iconClass: "alf-delete-icon",
            label: "menu.selected-items.delete",
            permission: "Delete",
            notAspect: "hwf:hybridWorkflow,sys:undeletable"
         },
         {
            type: "action-link",
            id: "onActionCloudSync",
            icon: "document-cloud-sync",
            label: "menu.selected-items.cloudSync",
            permission: "CreateChildren",
            notAspect: "sync:syncSetMemberNode",
            asset: "document",
            syncMode: "ON_PREMISE"
         },
         {
            type: "action-link",
            id: "onActionCloudSyncRequest",
            icon: "document-request-sync",
            label: "menu.selected-items.cloudRequestSync",
            permission: "CreateChildren",
            notAspect: "sync:syncSetMemberNode",
            asset: "document",
            syncMode: "ON_PREMISE"
         }
      ];
   }

   for (var i = 0; i < selectedItemsActions.length; i++)
   {
      var action = selectedItemsActions[i];
      if(!action.syncMode || action.syncMode.toString() === getSyncMode())
      {
         // Multi-Select Actions
         // Note that we're using an AlfDocumentActionMenuItem widget here...
         // This particular widget extends the AlfFilteringMenuItem (which in turn
         // extends AlfMenuItem) to subscribe to publications on the "ALF_FILTER_SELECTED_FILE_ACTIONS"
         // topic (although that could be overridden by setting a 'filterTopic' attribute
         // in the widget config). The ActionService on the page will publish on this topic
         // each time the selected documents changes and the payload will contain all of the
         // permissions and aspect data for the selected documents. The AlfDocumentActionMenuItem
         // widget will compare that data against it's configuration and show/hide itself appropriately.
         var actionItem = {
            name: "alfresco/documentlibrary/AlfDocumentActionMenuItem",
            config: {
               id: (action.id || "").toString(),
               label: (action.label || "").toString(),
               type: (action.type || "").toString(),
               permission: (action.permission || "").toString(),
               asset: (action.asset || "").toString(),
               href: (action.href || "").toString(),
               hasAspect: (action.hasAspect || "").toString(),
               notAspect: (action.notAspect || "").toString(),
               publishTopic: "ALF_SELECTED_DOCUMENTS_ACTION_REQUEST",
               publishPayload: {
                  action: (action.id || "").toString()
               }
            }
         };
         if (action.iconClass)
         {
            actionItem.config.iconClass = action.iconClass;
         }
         else
         {
            actionItem.config.iconImage = getMultiActionImage(action);
         }
         actions.push(actionItem);
      }
   }
   return actions;
}

function getDocLibSelectedItemActions(options) {
   var actionsMenu = {
      id: (options.idPrefix || "") + "DOCLIB_SELECTED_ITEMS_MENU",
      name: "alfresco/documentlibrary/AlfSelectedItemsMenuBarPopup",
      config: {
         label: msg.get("selected-items.label"),
         widgets: [
            {
               id: (options.idPrefix || "") + "DOCLIB_SELECTED_ITEMS_MENU_GROUP1",
               name: "alfresco/menus/AlfMenuGroup",
               config: {
                  widgets: getSelectedItemsActions()
               }
            }
         ]
      }
   };
   return actionsMenu;
}

/* *********************************************************************************
 *                                                                                 *
 * SORT FILE OPTIONS                                                               *
 *                                                                                 *
 ***********************************************************************************/

function getDocLibSortOptions(options, sortingConfigItems) {
   setupDocLibPreferences(options);
   var sortOptions = [],
       sortingConfig = docLibXmlConfig.sorting;
   if (sortingConfigItems)
   {
      // If specific sorting config items have been provided, then use them.
      // TODO!
   }
   else if (sortingConfig)
   {
      // If no specific sorting configuration has been requested then attempt
      // to find XML configuration for sorting...
      var xmlSortConfig = sortingConfig.getChildren();
      sortingConfigItems = [];
      for (var i = 0; i < xmlSortConfig.size(); i++)
      {
         var xmlSortItem = xmlSortConfig.get(i);
         sortingConfigItems.push(xmlSortItem.attributes);
      }
   }
   else
   {
      // When no configuration options are provided and no XML configuration is available
      // then just use a sensible initial set. These defaults are taken from the standard
      // Alfresco Share configuration...
      sortingConfigItems = [
         {
            label: "label.name",
            value: "cm:name|true"
         },
         {
            label: "label.title",
            value: "cm:title"
         },
         {
            label: "label.description",
            value: "cm:description"
         },
         {
            label: "label.created",
            value: "cm:created"
         },
         {
            label: "label.creator",
            value: "cm:creator"
         },
         {
            label: "label.modified",
            value: "cm:modified"
         },
         {
            label: "label.modifier",
            value: "cm:modifier"
         },
         {
            label: "label.size",
            value: "cm:content.size"
         },
         {
            label: "label.mimetype",
            value: "cm:content.mimetype"
         },
         {
            label: "label.type",
            value: "TYPE"
         }
      ];
   }

   for (var i = 0; i < sortingConfigItems.length; i++)
   {
      // Get label and value from each config item
      var sortItem = sortingConfigItems[i];
      var sortLabel = String(sortItem.label);
      var sortValue = String(sortItem.value);
      if (sortLabel && sortValue)
      {
         var valueTokens = sortValue.split("|");
         sortOptions.push(
         {
            name: "alfresco/menus/AlfCheckableMenuItem",
            config: {
               label: msg.get(sortLabel),
               value: valueTokens[0],
               group: "DOCUMENT_LIBRARY_SORT_FIELD",
               publishTopic: "ALF_DOCLIST_SORT_FIELD_SELECTION",
               checked: options.docLibPrefrences.sortField === valueTokens[0],
               publishPayload: {
                  label: msg.get(sortLabel),
                  direction: valueTokens[1] || null
               }
            }
         });
      }
   }
   return sortOptions;
}

/* *********************************************************************************
 *                                                                                 *
 * DOCUMENT LIST CONFIG MENU CONSTRUCTION                                          *
 *                                                                                 *
 ***********************************************************************************/

function getDocLibConfigMenu(options) {
   setupDocLibPreferences(options);
   return {
      id: (options.idPrefix || "") + "DOCLIB_CONFIG_MENU",
      name: "alfresco/menus/AlfMenuBarPopup",
      config: {
         iconClass: "alf-configure-icon",
         widgets: [
            {
               id: (options.idPrefix || "") + "DOCLIB_CONFIG_MENU_VIEW_SELECT_GROUP",
               name: "alfresco/documentlibrary/AlfViewSelectionGroup"
            },
            // The actions to toggle full-screen and full-window have been left in place
            // for the time being, however the function is not working correctly due to
            // issues with absolutely positioned popups used for menus that are not shown.
            // Theses issues need to be resolved before this can be released.
            {
               id: (options.idPrefix || "") + "DOCLIB_CONFIG_MENU_VIEW_MODE_GROUP",
               name: "alfresco/menus/AlfMenuGroup",
               config: {
                  label: msg.get("doclib.viewModes.label"),
                  widgets: [
                     {
                        id: (options.idPrefix || "") + "DOCLIB_FULL_WINDOW_OPTION",
                        name: "alfresco/menus/AlfCheckableMenuItem",
                        config: {
                           label: msg.get("doclib.fullwindow.label"),
                           iconClass: "alf-fullscreen-icon",
                           checked: false,
                           publishTopic: "ALF_FULL_WINDOW"
                        }
                     },
                     {
                        id: (options.idPrefix || "") + "DOCLIB_FULL_SCREEN_OPTION",
                        name: "alfresco/menus/AlfCheckableMenuItem",
                        config: {
                           label: msg.get("doclib.fullscreen.label"),
                           iconClass: "alf-fullscreen-icon",
                           checked: false,
                           publishTopic: "ALF_FULL_SCREEN"
                        }
                     }
                  ]
               }
            },
            {
               id: (options.idPrefix || "") + "DOCLIB_CONFIG_MENU_OPTIONS_GROUP",
               name: "alfresco/menus/AlfMenuGroup",
               config: {
                  label: msg.get("doclib.options.label"),
                  widgets: [
                     {
                        id: (options.idPrefix || "") + "DOCLIB_SHOW_FOLDERS_OPTION",
                        name: "alfresco/menus/AlfCheckableMenuItem",
                        config: {
                           label: msg.get("show-folders.label"),
                           iconClass: "alf-showfolders-icon",
                           checked: options.docLibPrefrences.showFolders,
                           publishTopic: "ALF_DOCLIST_SHOW_FOLDERS"
                        }
                     },
                     {
                        id: (options.idPrefix || "") + "DOCLIB_SHOW_PATH_OPTION",
                        name: "alfresco/menus/AlfCheckableMenuItem",
                        config: {
                           label: msg.get("show-path.label"),
                           checked: !options.docLibPrefrences.hideBreadcrumbTrail,
                           iconClass: "alf-showpath-icon",
                           publishTopic: "ALF_DOCLIST_SHOW_PATH"
                        }
                     },
                     {
                        id: (options.idPrefix || "") + "DOCLIB_SHOW_SIDEBAR_OPTION",
                        name: "alfresco/menus/AlfCheckableMenuItem",
                        config: {
                           label: msg.get("show-sidebar.label"),
                           iconClass: "alf-showsidebar-icon",
                           checked: options.docLibPrefrences.showSidebar,
                           publishTopic: "ALF_DOCLIST_SHOW_SIDEBAR"
                        }
                     }
                  ]
               }
            },
            {
               name: "alfresco/documentlibrary/ViewPreferencesGroup",
               config: {
                  userIsSiteManager: true // TODO: Remove before commit
               }
            }
         ]
      }
   };
}

/* *********************************************************************************
 *                                                                                 *
 * DOCUMENT LIST CONSTRUCTION                                                      *
 *                                                                                 *
 ***********************************************************************************/
function getDocLibList(options) {
   setupDocLibPreferences(options);
   return {
      id: (options.idPrefix || "") + "DOCLIB_DOCUMENT_LIST",
      name: "alfresco/documentlibrary/AlfDocumentList",
      config: {
         waitForPageWidgets: (options.waitForPageWidgets !== false),
         rawData: options.rawData || false,
         useHash: (options.useHash !== false),
         siteId: options.siteId,
         containerId: options.containerId,
         rootNode: options.rootNode,
         usePagination: true,
         showFolders: options.docLibPrefrences.showFolders,
         sortAscending: options.docLibPrefrences.sortAscending,
         sortField: options.docLibPrefrences.sortField,
         view: options.docLibPrefrences.viewRendererName,
         widgets: [
            {
               name: "alfresco/documentlibrary/views/AlfSimpleView"
            },
            {
               name: "alfresco/documentlibrary/views/AlfDetailedView"
            },
            {
               name: "alfresco/documentlibrary/views/AlfGalleryView",
               config: {
                  columns: options.docLibPrefrences.galleryColumns
               }
            },
            {
               name: "alfresco/documentlibrary/views/AlfTableView"
            },
            {
               name: "alfresco/documentlibrary/views/AlfFilmStripView"
            }
         ]
      }
   };
}

/**
 * This creates the menu toolbar that sits above the list of documents.
 */
function getDocLibToolbar(options) {
   setupDocLibPreferences(options);
   var leftToolbar = [
      {
         id: (options.idPrefix || "") + "DOCLIB_SELECT_ITEMS_MENU",
         name: "alfresco/documentlibrary/AlfSelectDocumentListItems"
      },
      getDocLibCreateContentMenu(options),
      {
         id: (options.idPrefix || "") + "DOCLIB_UPLOAD_BUTTON",
         name: "alfresco/documentlibrary/UploadButton",
         config: {
            label: msg.get("upload.label")
         }
      }
   ].concat(getDocLibCloudSyncToolbarActions(options))
   .concat([getDocLibSelectedItemActions(options)]);

   return {
      id: (options.idPrefix || "") + "DOCLIB_TOOLBAR",
      name: "alfresco/documentlibrary/AlfToolbar",
      config: {
         id: (options.idPrefix || "") + "DOCLIB_TOOLBAR",
         widgets: [
            {
               id: (options.idPrefix || "") + "DOCLIB_TOOLBAR_LEFT_MENU",
               name: "alfresco/menus/AlfMenuBar",
               align: "left",
               config: {
                  widgets: leftToolbar
               }
            },
            {
               id: (options.idPrefix || "") + "DOCLIB_PAGINATION_MENU",
               name: "alfresco/documentlibrary/AlfDocumentListPaginator",
               align: "left"
            },
            {
               id: (options.idPrefix || "") + "DOCLIB_TOOLBAR_RIGHT_MENU",
               name: "alfresco/menus/AlfMenuBar",
               align: "right",
               config: {
                  widgets: [
                     {
                        id: (options.idPrefix || "") + "DOCLIB_SORT_ORDER_TOGGLE",
                        name: "alfresco/menus/AlfMenuBarToggle",
                        config: {
                           checked: options.docLibPrefrences.sortAscending,
                           onConfig: {
                              iconClass: "alf-sort-ascending-icon",
                              publishTopic: "ALF_DOCLIST_SORT",
                              publishPayload: {
                                 direction: "ascending"
                              }
                           },
                           offConfig: {
                              iconClass: "alf-sort-descending-icon",
                              publishTopic: "ALF_DOCLIST_SORT",
                              publishPayload: {
                                 direction: "descending"
                              }
                           }
                        }
                     },
                     {
                        id: (options.idPrefix || "") + "DOCLIB_SORT_FIELD_SELECT",
                        name: "alfresco/menus/AlfMenuBarSelect",
                        config: {
                           selectionTopic: "ALF_DOCLIST_SORT_FIELD_SELECTION",
                           widgets: [
                              {
                                 id: (options.idPrefix || "") + "DOCLIB_SORT_FIELD_SELECT_GROUP",
                                 name: "alfresco/menus/AlfMenuGroup",
                                 config: {
                                    widgets: getDocLibSortOptions(options)
                                 }
                              }
                           ]
                        }
                     },
                     getDocLibConfigMenu(options)
                  ]
               }
            }
         ]
      }
   };
}

/**
 * This creates the breadcrumb trail for the document list
 */
function getDocLibBreadcrumbTrail(options) {
   var breadcrumbTrail = {
      id: (options.idPrefix || "") + "DOCLIB_BREADCRUMB_TRAIL",
      name: "alfresco/documentlibrary/AlfBreadcrumbTrail",
      config: {
         hide: options.docLibPrefrences.hideBreadcrumbTrail,
         rootLabel: options.rootLabel || "root.label",
         lastBreadcrumbIsCurrentNode: true,
         useHash: (options.useHash !== false),
         pathChangeTopic: "ALF_DOCUMENTLIST_PATH_CHANGED",
         lastBreadcrumbPublishTopic: "ALF_NAVIGATE_TO_PAGE",
         lastBreadcrumbPublishPayload: {
            url: "folder-details?nodeRef={currentNode.parent.nodeRef}",
            type: "PAGE_RELATIVE",
            target: "CURRENT"
         },
         lastBreadcrumbPublishPayloadType: "PROCESS",
         lastBreadcrumbPublishPayloadModifiers: ["processInstanceTokens"]
      }
   };

   // Override with any specific breadcrumb trail configuration options...
   var bco = options.breadcrumbTrail;
   if (bco)
   {
      if (bco.lastBreadcrumbPublishTopic)
      {
         breadcrumbTrail.config.lastBreadcrumbPublishTopic = bco.lastBreadcrumbPublishTopic;
      }
      if (bco.lastBreadcrumbPublishPayload)
      {
         breadcrumbTrail.config.lastBreadcrumbPublishPayload = bco.lastBreadcrumbPublishPayload;
      }
      if (bco.lastBreadcrumbPublishPayloadType)
      {
         breadcrumbTrail.config.lastBreadcrumbPublishPayloadType = bco.lastBreadcrumbPublishPayloadType;
      }
      if (bco.lastBreadcrumbPublishPayloadModifiers)
      {
         breadcrumbTrail.config.lastBreadcrumbPublishPayloadModifiers = bco.lastBreadcrumbPublishPayloadModifiers;
      }
      if (bco.lastBreadcrumbPublishGlobal === true || bco.lastBreadcrumbPublishGlobal === false)
      {
         breadcrumbTrail.config.lastBreadcrumbPublishGlobal = bco.lastBreadcrumbPublishGlobal;
      }
      if (bco.lastBreadcrumbPublishToParent === true || bco.lastBreadcrumbPublishToParent === false)
      {
         breadcrumbTrail.config.lastBreadcrumbPublishToParent = bco.lastBreadcrumbPublishToParent;
      }
      if (bco.lastBreadcrumbPublishPayloadItemMixin === true || bco.lastBreadcrumbPublishPayloadItemMixin === false)
      {
         breadcrumbTrail.config.lastBreadcrumbPublishPayloadItemMixin = bco.lastBreadcrumbPublishPayloadItemMixin;
      }
   }
   return breadcrumbTrail;
}

/**
 * Builds the JSON model for rendering a DocumentLibrary. 
 * 
 * 
 * @returns {object} An object containing the JSON model for a DocumentLibrary
 */
function getDocLib(options) {
   setupDocLibPreferences(options);
   var docLibModel = {
      id: (options.idPrefix || "") + "DOCLIB_SIDEBAR",
      name: "alfresco/layout/AlfSideBarContainer",
      config: {
         showSidebar: options.docLibPrefrences.showSidebar,
         customResizeTopics: ["ALF_DOCLIST_READY","ALF_RESIZE_SIDEBAR"],
         footerHeight: 50,
         widgets: [
            {
               id: (options.idPrefix || "") + "DOCLIB_SIDEBAR_BAR",
               align: "sidebar",
               name: "alfresco/layout/VerticalWidgets",
               config: {
                  widgets: [
                     getDocLibFilters(options),
                     getDocLibTree(options),
                     getDocLibTags(options),
                     getDocLibCategories(options)
                  ]
               }
            },
            {
               id: (options.idPrefix || "") + "DOCLIB_SIDEBAR_MAIN",
               name: "alfresco/layout/FullScreenWidgets",
               config: {
                  widgets: [
                     getDocLibToolbar(options),
                     getDocLibBreadcrumbTrail(options),
                     getDocLibList(options)
                  ]
               }
            }
         ]
      }
   };
   return docLibModel;
}