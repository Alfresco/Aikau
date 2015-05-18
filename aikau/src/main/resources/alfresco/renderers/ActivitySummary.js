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
 * <p>This renderer will take an item from an activity feed and render details of that activity.
 * This is a first attempt to create this renderer within Aikau, and as such there are
 * certain elements that have yet to be completed:</p>
 * <ul>
 *   <li>The title of the site related to the activity needs to be retrieved via XHR,
 *   which is out of scope for this first iteration, and so the short-name of the site
 *   is displayed instead.</li>
 *   <li>Because of problems rendering links within a Property, from which class this
 *   widget inherits, there are currently no links for items/users/sites/etc.</li>
 *   <li>The decoration of links that currently occurs on Share (e.g. globes next
 *   to site links) needs further code/images porting across from Share, which is again
 *   out of scope for this first iteration</li>
 *   <li>User avatars are not being rendered yet</li>
 * </ul>
 *
 * @module alfresco/renderers/ActivitySummary
 * @extends module:alfresco/renderers/Property
 * @author Martin Doyle
 */
define(["alfresco/renderers/Property",
        "dojo/_base/declare", 
        "dojo/_base/lang", 
        "service/constants/Default"], 
        function(Property, declare, lang, AlfConstants) {

   return declare([Property], {

      /**
       * Define the i18n files
       *
       * @instance
       * @override
       * @type {object[]}
       */
      i18nRequirements: [{
         i18nFile: "./i18n/ActivitySummary.properties"
      }],

      /**
       * This can be set to apply a CSS class to the rendered property value
       *
       * @instance
       * @override
       * @type {string}
       */
      renderedValueClass: "alfresco-renderers-ActivitySummary",

      /**
       * The constructed activity item
       *
       * @instance
       * @type {object}
       */
      _item: null,

      /**
       * The initially-supplied activity item
       *
       * @instance
       * @type {object}
       */
      _activity: null,

      /**
       * The summary object within the supplied activity item
       *
       * @instance
       * @type {object}
       */
      _summary: null,

      /**
       * Run immediately after instance variables are mixed in
       *
       * @instance
       * @override
       */
      postMixInProperties: function alfresco_renderers_ActivitySummary__postMixInProperties() {

         // Ensure we have a valid item
         if (this.currentItem && this.currentItem.activityType) {

            // Put the activity and its summary into instance variables
            this._activity = this.currentItem;
            var activitySummary = this.currentItem.activitySummary || "{}";
            this._summary = JSON.parse(activitySummary);

            // Analyse the available info
            this.setupDefaults();
            this.refineItem();

            // Create and assign the rendered value
            this.renderedValue = this.generateRenderedValue();

         } else {

            // Surface errors
            this.alfLog("error", "Invalid current item: ", this.currentItem);
         }
      },

      /**
       * Generate the rendered value to be output for this widget
       *
       * @instance
       * @returns  {string} The value to be rendered
       */
      generateRenderedValue: function alfresco_renderers_ActivitySummary__generateRenderedValue() {

         // Generate links/text
         var item = this._item.title,
            user = this._item.fullName,
            site = this._item.siteTitle;
         // var item = "<a href=\"" + this._item.itemPage + "\">" + this._item.title + "</a>",
         //    user = "<a href=\"" + this._item.userProfile + "\">" + this._item.fullName + "</a>",
         //    site = "<a href=\"" + this._item.sitePage + "\">" + this._item.siteTitle + "</a>";

         // Create the final HTML
         // NOTE: 0 = Item title / page link, 1 = User profile link, 2 = custom0, 3 = custom1, 4 = Site link, 5 = second user profile link
         var activityHtml = this.message(this._activity.activityType, {
            "0": item,
            "1": user,
            "2": this.message(this._item.custom0),
            "3": this.message(this._item.custom1),
            "4": site
         });

         // Add the site
         if (!this._item.suppressSite) {
            activityHtml += " in " + this._item.siteId;
         }

         // Pass back the HTML
         return activityHtml;
      },

      /**
       * Get the URL for the item associated with this activity
       *
       * @instance
       * @returns  {string} The item URL
       */
      getItemUrl: function alfresco_renderers_ActivitySummary__getItemUrl() {

         // Default page is the dashboard
         var localPage = "/dashboard";

         // Is there a specified page?
         if (this._summary.page) {

            // Use the specified one
            localPage = "/" + this._summary.page;

            // Check for a path
            var pathParam = "?path=",
               parts = localPage.split(pathParam, 2);

            // Make the path safe for inclusion in the url
            if (parts.length === 2) {
               var page = parts[0],
                  urlEncoded = encodeURIComponent(parts[1]),
                  percentEscaped = urlEncoded.replace(/%25/g, "%2525");
               localPage = page + pathParam + percentEscaped;
            }
         }

         // Return the final URL
         return AlfConstants.URL_CONTEXT + "page/site/" + encodeURI(this._activity.siteNetwork) + localPage;
      },

      /**
       * Get the title of this site.<br />
       * <strong>NOTE: This will temporarily only return the short-name of the site</strong>
       *
       * @instance
       * @returns  {string} The title of the site
       */
      getSiteTitle: function alfresco_renderers_Property__getSiteTitle() {
         return this._activity.siteNetwork;
      },

      /**
       * Get the URL to the dashboard for this activity's site
       *
       * @instance
       * @returns  {string} The site URL
       */
      getSiteUrl: function alfresco_renderers_Property__getSiteUrl() {
         return AlfConstants.URL_CONTEXT + "page/site/" + encodeURI(this._activity.siteNetwork) + "/dashboard";
      },

      /**
       * URL to user profile page
       */
      getUserProfileUrl: function alfresco_renderers_Property__getUserProfileUrl(userId) {
         return AlfConstants.URL_CONTEXT + "page/user/" + encodeURI(userId) + "/profile";
      },

      /**
       * Refine the item, given the information available for this activity
       *
       * @instance
       */
      refineItem: function alfresco_renderers_Property__refineItem() {
         /*jshint maxcomplexity:false*/

         // Create shortcut pointers
         var activityType = this._activity.activityType,
            item = this._item,
            summary = this._summary;

         // Refinement depends on activity type
         switch (activityType) {

            // Groups
            case "org.alfresco.site.group-added":
            case "org.alfresco.site.group-removed":
               item.suppressSite = true;
               /* falls through */
            case "org.alfresco.site.group-role-changed":
               item.fullName = summary.groupName.replace("GROUP_", "");
               item.userProfile = null;
               item.custom0 = this.message("role." + summary.role);
               break;

               // Site members
            case "org.alfresco.site.user-joined":
            case "org.alfresco.site.user-left":
               item.suppressSite = true;
               /* falls through */
            case "org.alfresco.site.user-role-changed":
               item.userName = summary.memberUserName;
               item.fullName = lang.trim(summary.memberFirstName + " " + summary.memberLastName);
               item.userProfile = this.getUserProfileUrl(summary.memberUserName);
               item.custom0 = this.message("role." + summary.role);
               break;

               // Other
            case "org.alfresco.site.liked":
               item.suppressSite = true;
               break;
            case "org.alfresco.subscriptions.followed":
               item.fullName = lang.trim(summary.followerFirstName + " " + summary.followerLastName);
               item.userProfile = this.getUserProfileUrl(summary.followerUserName);
               item.secondFullName = lang.trim(summary.userFirstName + " " + summary.userLastName);
               item.secondUserProfile = this.getUserProfileUrl(summary.userUserName);
               item.itemPage = item.userProfile;
               item.suppressSite = true;
               break;
            case "org.alfresco.subscriptions.subscribed":
               item.fullName = lang.trim(summary.subscriberFirstName + " " + summary.subscriberLastName);
               item.userProfile = this.getUserProfileUrl(summary.subscriberUserName);
               item.custom0 = summary.node;
               item.suppressSite = true;
               break;
            case "org.alfresco.profile.status-changed":
               item.custom0 = summary.status;
               item.itemPage = item.userProfile;
               item.suppressSite = true;
               break;
         }
      },

      /**
       * Sets up the defaults for the item
       *
       * @instance
       */
      setupDefaults: function alfresco_renderers_ActivitySummary__setupDefaults() {
         this._item = {
            id: this._activity.id,
            type: this._activity.activityType,
            siteId: this._activity.siteNetwork,
            date: {
               isoDate: this._activity.postDate
            },
            title: this._summary.title || this.message("title.generic"),
            userName: this._activity.postUserId,
            userAvatar: this._activity.postUserAvatar || "avatar",
            fullName: lang.trim(this._summary.firstName + " " + this._summary.lastName),
            itemPage: this.getItemUrl(),
            sitePage: this.getSiteUrl(),
            siteTitle: this.getSiteTitle(),
            userProfile: this.getUserProfileUrl(this._activity.postUserId),
            custom0: this._summary.custom0 || "",
            custom1: this._summary.custom1 || "",
            suppressSite: false,
            grouped: false
         };
      }
   });
});