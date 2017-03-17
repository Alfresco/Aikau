/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 * This extends the standard [Film Strip View]{@link module:alfresco/documentlibrary/views/AlfFilmStripView}
 * to provide a model dedicated to rendering search results. The main difference is in using the
 * [FilmStripViewSearchResult]{@link module:alfresco/search/FilmStripViewSearchResult} that has special handling
 * for types of nodes that are not found in Document Libraries. This view is only intended for use in the
 * [AlfSearchList]{@link module:alfresco/search/AlfSearchList} widget.
 *
 * @module alfresco/search/SearchFilmStripView
 * @extends module:alfresco/documentlibrary/views/AlfFilmStripView
 * @author Dave Draper
 * @since 1.0.32
 */
define(["dojo/_base/declare",
        "alfresco/documentlibrary/views/AlfFilmStripView"], 
        function(declare, AlfFilmStripView) {
   
   return declare([AlfFilmStripView], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/SearchFilmStripView.css"}]
       */
      cssRequirements: [{cssFile:"./css/SearchFilmStripView.css"}],
      
      /**
       * The definition of how a single item is represented the preview.
       * 
       * @instance
       * @type {object[]}
       */
      widgetsForContent: [
         {
            name: "alfresco/layout/LeftAndRight",
            config: {
               widgets: [
                  {
                     name: "alfresco/renderers/Property",
                     align: "left",
                     config: {
                        propertyToRender: "displayName"
                     }
                  },
                  {
                     name: "alfresco/renderers/MoreInfo",
                     align: "right",
                     config: {
                        filterActions: true,
                        xhrRequired: true,
                        renderFilter: [
                           {
                              property: "type",
                              values: ["document","folder"]
                           }
                        ]
                     }
                  }
               ]
            }
         },
         {
            name: "alfresco/search/FilmStripViewSearchResult",
            config: {
               heightAdjustment: 0,
               heightMode: "PARENT"
            }
         }
      ],

      /**
       * The definition of how a single item is represented in the view. 
       * 
       * @instance
       * @type {object[]}
       */
      widgets: [
         {
            name: "alfresco/search/SearchGalleryThumbnail",
            config: {
               additionalCssClasses: "alfresco-search-SearchFilmStripView__thumbnail",
               publishTopic: "ALF_FILMSTRIP_SELECT_ITEM",
               publishPayloadType: "PROCESS",
               publishPayload: {
                  index: "{index}",
                  nodeRef: "{nodeRef}"
               },
               publishPayloadModifiers: ["processCurrentItemTokens"],
               widgetsForSelectBar: null
            }
         }
      ]
   });
});