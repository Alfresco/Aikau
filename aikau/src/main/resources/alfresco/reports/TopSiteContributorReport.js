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
 * TopSiteContributorReport displays a chart giving an overview of the amount of created content for each user in the
 * site.
 *
 * @module alfresco/reports/TopSiteContributorReport
 * @extends module:alfresco/reports/Report
 * @author Erik Winlöf
 */
define(["dojo/_base/declare",
   "alfresco/core/Core",
   "alfresco/core/I18nUtils",
   "alfresco/reports/Report",
   "alfresco/services/_NavigationServiceTopicMixin",
   "dojo/_base/lang",
   "dojo/date",
   "dojo/date/stamp"],
      function(declare, AlfCore, I18nUtils, Report, _NavigationServiceTopicMixin, lang, date, stamp) {

         // Lets default the report to show data from the last month
         var timePeriod = "30D";
         var startDate = stamp.toISOString(date.add(new Date(), "month", -1), { selector: "date" });
         var endDate = stamp.toISOString(new Date(), { selector: "date" });
         var now = stamp.toISOString(new Date(), { selector: "date" });

         var getStartDate = function() {
            switch (timePeriod)
            {
               case "TODAY":
                  return now;
               case "7D":
                   return stamp.toISOString(date.add(new Date(), "day", -7), { selector: "date" });
               case "30D":
                   return stamp.toISOString(date.add(new Date(), "day", -30), { selector: "date" });
               case "YEAR":
                   return stamp.toISOString(date.add(new Date(), "year", -1), { selector: "date" });
               case "CUSTOM":
                   return startDate;
               default:
                  break;
            }
             return startDate;
         };
         var getEndDate = function() {
            if (timePeriod == "CUSTOM") {
               return endDate;
            } else {
               return now;
            }
         };

         var i18nScope = "alfresco.reports.TopSiteContributorReport";

         return declare([Report, _NavigationServiceTopicMixin], {

            /**
             * An array of the i18n files to use with this widget.
             *
             * @instance
             * @type {object[]}
             * @default [{i18nFile: "./i18n/TopSiteContributorReport.properties"}]
             */
            i18nRequirements: [{i18nFile: "./i18n/TopSiteContributorReport.properties"}],

            /**
             * An array of the CSS files to use with this widget.
             *
             * @instance cssRequirements {Array}
             * @type {object[]}
             * @default [{cssFile:"./css/TopSiteContributorReport.css"}]
             */
            cssRequirements: [{cssFile:"./css/TopSiteContributorReport.css"}],

            /**
             * The CSS class (or a space separated list of classes) to include in the DOM node.
             *
             * @instance
             * @type {string}
             * @default "alfresco-reports-TopSiteContributorReport"
             */
            baseClass: "alfresco-reports-TopSiteContributorReport",

            /**
             * Makes sure we listen to when a user is clicked in the chart
             *
             * @instance
             */
            postMixInProperties: function alfresco_reports_TopSiteContributorReport__postMixInProperties() {
               this.inherited(arguments);
               this.alfSubscribe("REPORT_ITEM_CLICKED", lang.hitch(this, this.onReportItemClick));
            },

            /**
             * Called when a user is clicked in the chart and will navigate browser to the clicked user's profile.
             *
             * @instance
             * @param value The name of the clicked user
             */
            onReportItemClick: function(value) {
               this.alfPublish(this.navigateToPageTopic, {
                  type: this.contextRelativePath,
                  url: "page/user/" + encodeURIComponent(value) + "/profile"
               }, true);
            },

            /**
             * The widgets to be processed to generate each item in the rendered view.
             *
             * @instance
             * @type {object[]}
             * @default null
             */
            widgets: [
               {
                  name: "alfresco/layout/VerticalWidgets",
                  config: {
                     additionalCssClasses: "bottom-border",
                     widgets: [
                         {
                            name: "alfresco/forms/Form",
                            config: {
                               displayButtons: false,
                               validFormValuesPublishTopic: "SHOW_CONTRIBUTORS_BY_DATE",
                               validFormValuesPublishOnInit: false,
                               widgets: [
                                  {
                                      name: "alfresco/forms/controls/DojoSelect",
                                      config: {
                                         fieldId: "TIME_PERIOD",
                                         name: "timePeriod",
                                         value: timePeriod,
                                         label: "",
                                         description: I18nUtils.msg(i18nScope, "timePeriod"),
                                         optionsConfig: {
                                            fixed: [
                                               {
                                                  label: I18nUtils.msg(i18nScope, "timePeriod-today"),
                                                  value: "TODAY"
                                               },
                                               {
                                                  label: I18nUtils.msg(i18nScope, "timePeriod-7d"),
                                                  value: "7D"
                                               },
                                               {
                                                  label: I18nUtils.msg(i18nScope, "timePeriod-30d"),
                                                   value: "30D"
                                               },
                                               {
                                                  label: I18nUtils.msg(i18nScope, "timePeriod-year"),
                                                  value: "YEAR"
                                               },
                                               {
                                                  label: I18nUtils.msg(i18nScope, "timePeriod-custom"),
                                                  value: "CUSTOM"
                                               }
                                            ]
                                         }
                                      }
                                  },
                                  {
                                     name: "alfresco/forms/controls/DojoDateTextBox",
                                     config: {
                                        name: "startDate",
                                        value: startDate,
                                        label: "",
                                        description: I18nUtils.msg(i18nScope, "startDate"),
                                        visibilityConfig: {
                                           initialValue: false,
                                           rules: [
                                              {
                                                 targetId: "TIME_PERIOD",
                                                 is: ["CUSTOM"]
                                              }
                                           ]
                                        }
                                     }
                                  },
                                  {
                                     name: "alfresco/forms/controls/DojoDateTextBox",
                                     config: {
                                        name: "endDate",
                                        value: endDate,
                                        label: "-",
                                        description: I18nUtils.msg(i18nScope, "endDate"),
                                        visibilityConfig: {
                                           initialValue: false,
                                           rules: [
                                              {
                                                 targetId: "TIME_PERIOD",
                                                 is: ["CUSTOM"]
                                              }
                                           ]
                                        }
                                     }
                                  }
                               ]
                            }
                         }
                     ]
                  }
               },
               {
                  name: "alfresco/charts/ccc/ChartsView",
                  config:
                  {
                     dataRequestTopic: "ALF_RETRIEVE_TOP_SITE_CONTRIBUTOR_REPORT",
                     dataRequestPayload: {
                        site: Alfresco.constants.SITE,
                        startDate: getStartDate(),
                        endDate: getEndDate()
                     },
                     subscriptionTopic: "SHOW_CONTRIBUTORS_BY_DATE",
                     widgets: [
                        {
                           name: "alfresco/charts/ccc/PieChart",
                           config: {
                              readers: [
                                 { names: 'category', indexes: 0 },
                                 { names: 'value', indexes: 2 }
                              ],
                              explodedSliceRadius: null,
                              selectable: false,
                              hoverable:  true,
                              extensionPoints: {
                                 slice_innerRadiusEx: '55%',
                                 slice_strokeStyle: 'white'
                              },
                              clickTopic: "REPORT_ITEM_CLICKED",
                              tooltip: {
                                 format: function(scene){
                                    var avatarUrl = Alfresco.constants.PROXY_URI + "slingshot/profile/avatar/" + encodeURIComponent(scene.datum.atoms.category.value) + "/thumbnail/avatar32";
                                    var tooltip = '';
                                    tooltip += '<table><tr><td>';
                                    tooltip += '<img class="avatar" src="' + avatarUrl + '" alt="avatar"><br>';
                                    tooltip += '</td><td>';
                                    tooltip += '<div style="text-align: left;">';
                                    tooltip += '<strong>' + Alfresco.util.encodeHTML(scene.datum.atoms.category.value) + '</strong><br/>';
                                    tooltip += I18nUtils.msg(i18nScope, "count", Alfresco.util.encodeHTML(scene.datum.atoms.value.value), Alfresco.util.encodeHTML(scene.vars.value.percent.label)) + '<br/>';
                                    tooltip += I18nUtils.msg(i18nScope, "sum", Alfresco.util.encodeHTML(Alfresco.util.formatFileSize(scene.datum.atoms.value2.value)));
                                    tooltip += '</div>';
                                    tooltip += '</td></tr></table>';
                                    return tooltip;
                                 }
                              }
                           }
                        }
                     ]
                  }
               }
            ]
         });
      });