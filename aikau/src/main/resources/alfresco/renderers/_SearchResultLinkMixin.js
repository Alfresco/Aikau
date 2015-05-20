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
 * <p>The _SearchResultLinkMixin should be mixed into all modules that require Search Result Link behaviour.</p>
 * 
 * @module alfresco/renderers/_SearchResultLinkMixin
 * @author Richard Smith
 */
define(["alfresco/core/TemporalUtils",
        "dojo/_base/declare",
        "dojo/_base/lang"], 
        function(TemporalUtils, declare, lang) {
   
   return declare([TemporalUtils], {

      /**
       * This function generates a payload for the [NavigationService]{@link module:alfresco/services/NavigationService}
       * that varies depending upon the type of search result (e.g. a document or folder, in a site or in
       * the repository, etc) which can also be used to extrapolate an HTML anchor for 
       * [_HtmlAnchorMixin]{@link module:alfresco/navigation/_HtmlAnchorMixin}.
       *
       * @instance
       * @return {object} The generated payload
       */
      generateSearchLinkPayload: function alfresco_renderers__SearchResultLinkMixin__generateSearchLinkPayload() {
         // jshint maxcomplexity:false
         var payload = {
            type: "PAGE_RELATIVE",
            target: "CURRENT",
            url: null
         };
         var type = lang.getObject("type", false, this.currentItem),
             site = lang.getObject("site.shortName", false, this.currentItem);

         switch(type)
         {
            case "folder":
               
               var path = lang.getObject("path", false, this.currentItem),
               name = lang.getObject("name", false, this.currentItem);
               if (site)
               {
                  payload.url = "site/" + site + "/documentlibrary?path=" + path + "/" + name;
               }
               else if (path)
               {
                  path = "/" + path.split("/").slice(2).join("/");
                  payload.url = "repository?path=" + path + "/" + name;
               }
               break;

            case "wikipage":
               var title = lang.getObject("name", false, this.currentItem);
               if (site)
               {
                  payload.url = "site/" + site + "/wiki-page?title=" + title;
               }
               break;

            case "blogpost":
               var postid = lang.getObject("name", false, this.currentItem);
               if (site)
               {
                  payload.url = "site/" + site + "/blog-postview?postId=" + postid;
               }
               break;

            case "forumpost":
               var topicid = lang.getObject("name", false, this.currentItem);
               if (site)
               {
                  payload.url = "site/" + site + "/discussions-topicview?topicId=" + topicid;
               }
               break;

            case "link":
               var linkid = lang.getObject("name", false, this.currentItem);
               if (site)
               {
                  payload.url = "site/" + site + "/links-view?linkId=" + linkid;
               }
               break;

            case "datalist":
               var listid = lang.getObject("name", false, this.currentItem);
               if (site)
               {
                  payload.url = "site/" + site + "/data-lists?list=" + listid;
               }
               break;

            case "calendarevent":
               var dateProperty = lang.getObject("fromDate", false, this.currentItem),
                  eventDate = dateProperty && this.fromISO8601(dateProperty),
                  formattedDate = eventDate && this.formatDate(eventDate, "yyyy-mm-dd");
               if (site)
               {
                  payload.url = "site/" + site + "/calendar?date=" + formattedDate;
               }
               break;

            default:
               var nodeRef = lang.getObject("nodeRef", false, this.currentItem);
               if (site)
               {
                  payload.url = "site/" + site + "/document-details?nodeRef=" + nodeRef;
               }
               else
               {
                  payload.url = "document-details?nodeRef=" + nodeRef;
               }
         }

         return payload;
      }

   });
});
