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
 * @module alfresco/renderers/ActivitySummary
 * @extends module:alfresco/core/ProcessWidgets
 * @author Martin Doyle
 */
define(["alfresco/renderers/Property",
      "dojo/_base/declare",
      "dojo/_base/lang"
   ],
   function(Property, declare, lang) {

      return declare([Property], {

         i18nRequirements: [{
            i18nFile: "./i18n/ActivitySummary.properties"
         }],

         /**
          * This can be set to override the default size property of 'jsNode.size' that
          * is typically available when dealing with standard Node data.
          *
          * @instance
          * @type {string}
          * @default "jsNode.size"
          */
         sizeProperty: null,

         constructor: function() {
            console.debug("Awooga!");
         },

         /**
          * Set up the attributes to be used when rendering the template.
          *
          * @instance
          */
         postMixInProperties: function alfresco_renderers_Size__postMixInProperties() {
            if (this.currentItem && this.currentItem.activityType) {
               var item = {};
               var summary = this.currentItem.activitySummary;
               // switch (this.currentItem.activityType)
               // {
               //    case "org.alfresco.site.group-added":
               //    case "org.alfresco.site.group-removed":
               //       item.suppressSite = true;
               //       // Fall through....
               //    case "org.alfresco.site.group-role-changed":
               //       item.fullName = summary.groupName.replace("GROUP_", "");
               //       item.userProfile = null;
               //       item.custom0 = msg.get("role." + summary.role);
               //       break;

               //    case "org.alfresco.site.user-joined":
               //    case "org.alfresco.site.user-left":
               //       item.suppressSite = true;
               //       // Fall through....
               //    case "org.alfresco.site.user-role-changed":
               //       item.userName = summary.memberUserName;
               //       item.fullName = trim(summary.memberFirstName + " " + summary.memberLastName);
               //       item.userProfile = userProfileUrl(summary.memberUserName);
               //       item.custom0 = msg.get("role." + summary.role);
               //       break;

               //    case "org.alfresco.site.liked":
               //       item.suppressSite = true;
               //       break;
               //    case "org.alfresco.subscriptions.followed":
               //       item.fullName = trim(summary.followerFirstName + " " + summary.followerLastName);
               //       item.userProfile = userProfileUrl(summary.followerUserName);
               //       item.secondFullName = trim(summary.userFirstName + " " + summary.userLastName);
               //       item.secondUserProfile = userProfileUrl(summary.userUserName);
               //       item.itemPage = item.userProfile;
               //       item.suppressSite = true;
               //       break;
               //    case "org.alfresco.subscriptions.subscribed":
               //       item.fullName = trim(summary.subscriberFirstName + " " + summary.subscriberLastName);
               //       item.userProfile = userProfileUrl(summary.subscriberUserName);
               //       item.custom0 = summary.node;
               //       item.suppressSite = true;
               //       break;
               //    case "org.alfresco.profile.status-changed":
               //       item.custom0 = summary.status;
               //       item.itemPage = item.userProfile;
               //       item.suppressSite = true;
               //       break;
               // }

               var data = JSON.parse(this.currentItem.activitySummary);
               this.renderedValue = this.message(this.currentItem.activityType, {
                  1: data.firstName + " " + data.lastName,
                  0: data.title,
                  2: "2",
                  3: "3",
                  4: "4",
                  5: data.followerFirstName + " " + data.followerLastName
               });
            }
            // this.renderedValueClass = this.renderedValueClass + " " + this.renderSize;
            // if (this.deemphasized === true)
            // {
            //    this.renderedValueClass = this.renderedValueClass + " deemphasized";
            // }
         }
      });

      // // <import resource="classpath:/alfresco/templates/org/alfresco/import/alfresco-util.js">
      // /**
      //  * Main entrypoint
      //  */
      // function main() {
      //    var activityFeed = getActivities();
      //    var activities = [],
      //       activity, item, summary, fullName, date, sites = {},
      //       siteTitles = {};
      //    var dateFilter = args.dateFilter,
      //       oldestDate = getOldestDate(dateFilter);

      //    if (activityFeed != null) {
      //       var mode = args.mode,
      //          site = (mode == "site") ? args.site : null;

      //       for (var i = 0; i < activityFeed.length; i++) {
      //          activity = activityFeed[i];

      //          summary = JSON.parse(activity.activitySummary);
      //          fullName = trim(summary.firstName + " " + summary.lastName);
      //          date = AlfrescoUtil.fromISO8601(activity.postDate);

      //          // Outside oldest date?
      //          if (date < oldestDate) {
      //             break;
      //          }

      //          item = {
      //             id: activity.id,
      //             type: activity.activityType,
      //             siteId: activity.siteNetwork,
      //             date: {
      //                isoDate: activity.postDate,
      //             },
      //             title: summary.title || msg.get("title.generic"),
      //             userName: activity.postUserId,
      //             userAvatar: activity.postUserAvatar || "avatar",
      //             fullName: fullName,
      //             itemPage: itemPageUrl(activity, summary),
      //             sitePage: sitePageUrl(activity, summary),
      //             userProfile: userProfileUrl(activity.postUserId),
      //             custom0: summary.custom0 || "",
      //             custom1: summary.custom1 || "",
      //             suppressSite: false,
      //             grouped: false
      //          };

      //          // Add to our set of unique sites
      //          sites[activity.siteNetwork] = true;

      //          // Run through specialize function for special cases
      //          activities.push(specialize(item, activity, summary));
      //       }

      //       // group activities based same day/user/type if sequential
      //       var groupActivity = null,
      //          grouping = null;
      //       for (var i = 0; i < activities.length; i++) {
      //          activity = activities[i];

      //          // found an activity with same group as previous in list same user/day?
      //          if (groupActivity !== null &&
      //             groupActivity.type === activity.type &&
      //             groupActivity.userName === activity.userName &&
      //             groupActivity.date.isoDate.substring(8, 10) === activity.date.isoDate.substring(8, 10)) {
      //             // same activity type+user+day - group it
      //             grouping.push(activity);
      //             // mark the activity as grouped i.e. not for top-level display itself
      //             activity.grouped = true;
      //          } else {
      //             // set any existing group first before starting another
      //             if (groupActivity !== null && grouping.length !== 0) {
      //                // we grouped at least one other activity with the processed group
      //                groupActivity.group = grouping;
      //             }

      //             // start new group
      //             grouping = [];
      //             groupActivity = activity;
      //          }
      //       }
      //       // handle last item in list that may end a grouping
      //       if (groupActivity !== null && grouping.length !== 0) {
      //          groupActivity.group = grouping;
      //       }

      //       // resolve siteId to title string
      //       siteTitles = getSiteTitles(sites);
      //    }

      //    model.activities = activities;
      //    model.siteTitles = siteTitles;
      //    model.cssClasses = getCSSClasses();
      // }


      // /**
      //  * Optionally specify each activity item by type
      //  */
      // function specialize(item, activity, summary) {
      //    switch (activity.activityType) {
      //       case "org.alfresco.site.group-added":
      //       case "org.alfresco.site.group-removed":
      //          item.suppressSite = true;
      //          // Fall through....
      //       case "org.alfresco.site.group-role-changed":
      //          item.fullName = summary.groupName.replace("GROUP_", "");
      //          item.userProfile = null;
      //          item.custom0 = msg.get("role." + summary.role);
      //          break;

      //       case "org.alfresco.site.user-joined":
      //       case "org.alfresco.site.user-left":
      //          item.suppressSite = true;
      //          // Fall through....
      //       case "org.alfresco.site.user-role-changed":
      //          item.userName = summary.memberUserName;
      //          item.fullName = trim(summary.memberFirstName + " " + summary.memberLastName);
      //          item.userProfile = userProfileUrl(summary.memberUserName);
      //          item.custom0 = msg.get("role." + summary.role);
      //          break;

      //       case "org.alfresco.site.liked":
      //          item.suppressSite = true;
      //          break;
      //       case "org.alfresco.subscriptions.followed":
      //          item.fullName = trim(summary.followerFirstName + " " + summary.followerLastName);
      //          item.userProfile = userProfileUrl(summary.followerUserName);
      //          item.secondFullName = trim(summary.userFirstName + " " + summary.userLastName);
      //          item.secondUserProfile = userProfileUrl(summary.userUserName);
      //          item.itemPage = item.userProfile;
      //          item.suppressSite = true;
      //          break;
      //       case "org.alfresco.subscriptions.subscribed":
      //          item.fullName = trim(summary.subscriberFirstName + " " + summary.subscriberLastName);
      //          item.userProfile = userProfileUrl(summary.subscriberUserName);
      //          item.custom0 = summary.node;
      //          item.suppressSite = true;
      //          break;
      //       case "org.alfresco.profile.status-changed":
      //          item.custom0 = summary.status;
      //          item.itemPage = item.userProfile;
      //          item.suppressSite = true;
      //          break;
      //    }

      //    return item;
      // }


      // /**
      //  * Call remote Repo script to get relevant activities
      //  */
      // function getActivities() {
      //    // Call the correct repo script depending on the mode
      //    var mode = args.mode,
      //       site = args.site,
      //       userFilter = args.userFilter,
      //       activityFilter = args.activityFilter,
      //       connector,
      //       result = {
      //          status: 0
      //       };

      //    if (format.name == "html") {
      //       connector = remote.connect("alfresco");
      //    } else {
      //       // Use alfresco-feed connector as a basic HTTP auth challenge will be issued
      //       var cname = (args.loopback != null && args.loopback == "1") ? "alfresco" : "alfresco-feed";
      //       connector = remote.connect(cname);
      //    }

      //    // Filter by user
      //    var actParam = "";
      //    switch (userFilter) {
      //       case "others":
      //          actParam = "&exclUser=true";
      //          break;
      //       case "mine":
      //          actParam = "&exclOthers=true";
      //          break;
      //       case "following":
      //          actParam = "&following=true";
      //          break;
      //    }

      //    // Filter by activityFilter
      //    if (activityFilter) {
      //       actParam = actParam + "&activityFilter=" + encodeURI(activityFilter);
      //    }

      //    // Filter by site
      //    if (mode == "site" && site) {
      //       actParam = actParam + "&s=" + encodeURI(site);
      //    }

      //    result = connector.get("/api/activities/feed/user?format=json" + actParam);

      //    if (result.status == 200) {
      //       // Create javascript objects from the server response
      //       return JSON.parse(result);
      //    }

      //    status.setCode(result.status, result.response);
      //    return null;
      // }

      // /**
      //  * Call remote Repo script to get site titles
      //  */
      // function getSiteTitles(p_sites) {
      //    var connector, result, query, shortName, siteTitles = {};

      //    if (format.name == "html") {
      //       connector = remote.connect("alfresco");
      //    } else {
      //       // Use alfresco-feed connector as a basic HTTP auth challenge will be issued
      //       connector = remote.connect("alfresco-feed");
      //    }

      //    // Sites query template
      //    query = {
      //       shortName: {
      //          match: "exact",
      //          values: []
      //       }
      //    };

      //    // Add our list of site names to the query
      //    for (shortName in p_sites) {
      //       if (p_sites[shortName]) {
      //          query.shortName.values.push(shortName);
      //       }
      //    }

      //    // Call the repo to return a specific list of site metadata
      //    result = connector.post("/api/sites/query", jsonUtils.toJSONString(query), "application/json");

      //    if (result.status == 200) {
      //       var sites = JSON.parse(result),
      //          site;

      //       // Extract site titles
      //       for (var i = 0, ii = sites.length; i < ii; i++) {
      //          site = sites[i];
      //          siteTitles[site.shortName] = site.title;
      //       }
      //    }
      //    return siteTitles;
      // }

      // /**
      //  * URL to user profile page
      //  */
      // function userProfileUrl(userId) {
      //    return url.context + "/page/user/" + encodeURI(userId) + "/profile";
      // }

      // /**
      //  * URL to item page (could be site dashboard page)
      //  */
      // function itemPageUrl(activity, summary) {
      //    if (summary.page !== undefined) {
      //       localPage = "/" + summary.page;
      //       var splitter = "?path=";
      //       var splitted = localPage.split(splitter, 2);
      //       if (splitted.length == 2) {
      //          localPage = splitted[0] + splitter + encodeURIComponent(splitted[1]).replace(/%25/g, "%2525");
      //       }
      //    } else {
      //       localPage = "/dashboard";
      //    }
      //    return url.context + "/page/site/" + encodeURI(activity.siteNetwork) + localPage;
      // }

      // /**
      //  * URL to site dashboard page
      //  */
      // function sitePageUrl(activity, summary) {
      //    return url.context + "/page/site/" + encodeURI(activity.siteNetwork) + "/dashboard";
      // }

      // /**
      //  * Work out the oldest date we should be processing
      //  */
      // function getOldestDate(filter) {
      //    var date = new Date();
      //    date.setHours(0, 0, 0, 0);

      //    if (filter != "today") {
      //       date.setDate(date.getDate() - filter);
      //    }

      //    return date;
      // }

      // /**
      //  * Trim leading and trailing spaces
      //  */
      // function trim(str) {
      //    try {
      //       return str.replace(/^\s+|\s+$/g, "");
      //    } catch (e) {}
      //    return str;
      // }

      // function getCSSClasses() {
      //    var myConfig = new XML(config.script),
      //       css = {};

      //    for each(var xmlStyle in myConfig..style) {
      //       css[xmlStyle.@type.toString()] = xmlStyle.@css.toString();
      //    }

      //    return css;
      // }

      // main();
   });