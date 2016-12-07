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
 * @module aikau/lists/views/ListView
 * @extends module:alfresco/lists/views/AlfListView
 * @author Dave Draper
 * @since 1.0.96
 */
define(["dojo/_base/declare",
        "alfresco/lists/views/AlfListView",
        "aikau/lists/views/ListRenderer",
        "alfresco/lists/views/RenderAppendixSentinel",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/_base/lang"], 
        function(declare, AlfListView, ListRenderer, RenderAppendixSentinel, domClass, domConstruct, lang) {

   return declare([AlfListView], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/ListView.css"}]
       */
      cssRequirements: [{cssFile:"./css/ListView.css"}],
      
      /**
       * Overrides the [inherited function]{@link module:alfresco/lists/views/AlfListView#postCreate}
       * to add the additional CSS class for the widget.
       * 
       * @instance
       */
      postCreate: function aikau_lists_views_ListView__postCreate() {
         domClass.add(this.domNode, "aikau-lists-views-ListView");
         domClass.add(this.tableNode, "mdl-data-table mdl-js-data-table mdl-shadow--2dp");
         this.inherited(arguments);
      },

      /**
       * 
       * @instance
       * @returns {object} A new [ListRenderer]{@link module:aikau/lists/views/ListRenderer}
       */
      createListRenderer: function aikau_lists_views_ListView__createListRenderer() {
         var dlr = new ListRenderer({
            id: this.id + "_ITEMS",
            widgets: this.widgets,
            currentData: this.currentData,
            pubSubScope: this.pubSubScope,
            parentPubSubScope: this.parentPubSubScope,
            widgetsForAppendix: this.widgetsForAppendix
         });
         return dlr;
      },

      /**
       * 
       * @instance
       * @param {boolean} preserveCurrentData This should be set to true when you don't want to clear the old data, the
       * most common example of this is when infinite scroll is being used.
       * @return {Promise} The promise of the view having been rendered
       * @since 1.0.100
       */
      renderView: function aikau_lists_views_ListView__renderView(preserveCurrentData) {
         var promisedView = new Promise(lang.hitch(this, function(resolve, reject) {
            if (this.currentData && this.currentData.items)
            {
               if (this.widgetsForAppendix && this.currentData.items)
               {
                  var containsSentinel = this.currentData.items.some(function(item) {
                     return item === RenderAppendixSentinel;
                  });
                  !containsSentinel && this.currentData.items.push(RenderAppendixSentinel);
               }

               if (this.currentData.items.length > 0)
               {
                  try
                  {
                     if (this.messageNode)
                     {
                        domConstruct.destroy(this.messageNode);
                     }

                     // If we don't want to preserve the current data (e.g. if infinite scroll isn't being used)
                     // then we should destroy the previous renderer...
                     if ((preserveCurrentData === false || preserveCurrentData === undefined) && this.listRenderer)
                     {
                        this.destroyRenderer();
                     }

                     // If the renderer is null we need to create one (this typically wouldn't be expected to happen)
                     // when rendering additional infinite scroll data...
                     if (!this.listRenderer)
                     {
                        this.listRenderer = this.createListRenderer();
                        this.listRenderer.placeAt(this.tableNode, "last");
                     }

                     // Ensure that the renderer has has the same itemKey value as configured on the view. This is
                     // so that comparisons can be made for selection and items can be brought into view as necessary
                     this.listRenderer.itemKey = this.itemKey;
                     
                     // Finally, render the current data (when using infinite scroll the data should have been augmented)
                     var promisedData = this.listRenderer.renderData();
                     if (promisedData)
                     {
                        promisedData.then(lang.hitch(this, function(renderedItems) {

                           if (renderedItems.length)
                           {
                              resolve(renderedItems);
                           }
                           else
                           {
                              this.renderNoDataDisplay();
                              resolve();
                           }
                        }));
                     }
                     else
                     {
                        // TODO: Better error handling when the renderer doesn't return a promise
                        this.alfLog("warn", "The view renderer does not return a promise when rendering data", this);
                        reject();
                     }
                  }
                  catch(e)
                  {
                     // TODO: This should return a promise itself...
                     this.alfLog("error", "The following error occurred rendering the data", e, this);
                     this.renderErrorDisplay();
                     reject();
                  }
               }
               else
               {
                  // TODO: This should return a promise itself...
                  this.renderNoDataDisplay();
                  resolve();
               }
            }
            else
            {
               // TODO: This should return a promise itself...
               this.renderNoDataDisplay();
               resolve();
            }
         }));
         return promisedView;
      },

      /**
       * This method is called when there is no data to be shown. By default this just shows a standard localized
       * message to say that there is no data.
       *
       * @instance
       * @override
       */
      renderNoDataDisplay: function aikau_lists_views_ListView__renderNoDataDisplay() {
         // Determine whether user can upload and pass on to the widgetsForNoDataDisplay config(s)
         var permissions = lang.getObject("_currentNode.parent.permissions", false, this);
         var canUpload = permissions && lang.getObject("user.CreateChildren", false, permissions) === true;
         if (this.widgetsForNoDataDisplay)
         {
            this.widgetsForNoDataDisplay.forEach(function(widget) {
               widget.config = lang.mixin(widget.config || {}, {
                  canUpload: canUpload
               });
            });
         }
         this.inherited(arguments);
      }
   });
});