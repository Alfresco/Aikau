/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * This is a mixin that provides URL related utility functions. The majority of the functions were ported
 * from the original YUI2 based Share code defined in alfresco.js - they are therefore somewhat Share specific.
 *
 * @module alfresco/core/UrlUtils
 * @extends module:alfresco/core/PathUtils
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/PathUtils",
        "alfresco/core/ObjectTypeUtils",
        "service/constants/Default",
        "dojo/_base/lang",
        "jquery"],
        function(declare, PathUtils, ObjectTypeUtils, AlfConstants, lang, jquery) {

   return declare([PathUtils], {

      /**
       * Generate User Profile link
       *
       * @instance
       * @param {object} oUser Object literal container user data
       * @return {String} HTML mark-up for user profile link
       */
      generateUserLink: function alfresco_core_UrlUtils__generateUserLink(oUser) {
         if (oUser.isDeleted === true)
         {
            return '<span>' + this.message("details.user.deleted", this.encodeHTML(oUser.userName)) + '</span>';
         }
         return this.userProfileLink(oUser.userName, lang.trim(oUser.firstName + " " + oUser.lastName));
      },

      /**
       *
       * @instance
       * @param {string} userName User Name
       * @param {string} fullName Full display name. "userName" used if this param is empty or not supplied
       * @param {string} linkAttr Optional attributes to add to the <a> tag, e.g. "class"
       * @param {boolean} disableLink Optional attribute instructing the link to be disabled (ie returning a span element rather than an a href element)
       * @return {string} The populated HTML Link
       */
      userProfileLink: function alfresco_core_UrlUtils__userProfileLink(userName, fullName, linkAttr, disableLink) {
         if (!ObjectTypeUtils.isString(userName) || userName.length === 0)
         {
            return "";
         }

         var html = this.encodeHTML(ObjectTypeUtils.isString(fullName) && fullName.length > 0 ? fullName : userName),
               template = AlfConstants.URI_TEMPLATES["userprofilepage"],
               uri = "";

         // If the "userprofilepage" template doesn't exist or is empty, we'll just return the user's fullName || userName
         if (disableLink || ObjectTypeUtils.isUndefined(template) || template.length === 0)
         {
            return '<span>' + html + '</span>';
         }

         // Generate the link
         uri = this.uriTemplate("userprofilepage", {
            userid: userName
         });

         return '<a href="' + uri + '" ' + (linkAttr || "") + '>' + html + '</a>';
      },

      /**
       * Returns a URL to a site page.
       * If no Site ID is supplied, generates a link to the non-site page.
       *
       * @instance
       * @param {string} pageURI Page ID and and QueryString parameters the page might need, e.g.
       * <pre>
       *    "folder-details?nodeRef=" + nodeRef
       * </pre>
       * @param {object} obj The object literal containing the token values to substitute within the template
       * @param {boolean} [absolute] Whether the URL should include the protocol and host
       * @returns {string} The populated URL
       */
      siteURL: function alfresco_core_UrlUtils__siteURL(pageURI, obj, absolute) {
         var target = obj || {};
         var source = {
            pageid: pageURI
         };
         return this.uriTemplate("sitepage", jquery.extend(true, target, source));
      },

      /**
       * This function attempts to find a URI template that has been configured for the Surf application.
       * If a template that matches the supplied "templateId" argument is found then the 
       * [renderUriTemplate]{@link module:alfresco/core/UrlUtils#renderUriTemplate} function will be called
       * to perform the actual rendering.
       * 
       * @instance
       * @param {string} templateId The id of the template to render a URI for
       * @param {object} obj An object that provides subtitution tokens for the URI template
       * @param {boolean} absolute
       */
      uriTemplate: function alfresco_core_UrlUtils__uriTemplate(templateId, obj, absolute) {
         // Check we know about the templateId
         if (!(templateId in AlfConstants.URI_TEMPLATES))
         {
            return null;
         }
         return this.renderUriTemplate(AlfConstants.URI_TEMPLATES[templateId], obj, absolute);
      },

      /**
       * This function renders a URI based on a supplied template ensuring that token substitution is performed
       * (using tokens supplied in the "obj" argument). This function does have some specific code to handle
       * site templates that are provided where no site data is supplied in the object. However, unlike the version
       * of the code that this function was ported from (in alfresco.js in Share) there is no support for retrieving
       * the current site or context from the URL.
       * 
       * @instance
       * @param {string} template The template to render a URI from
       * @param {object} obj An object that provides subtitution tokens for the URI template
       * @param {boolean} absolute Indicates that the URI rendered should include protocol, host/port and application context
       * @returns {string} The rendered URI
       */
      renderUriTemplate: function alfresco_core_UrlUtils__renderUriTemplate(template, obj, absolute) {

         // If a site page was requested but no {siteid} given, then use the current site or remove the missing parameter
         // This code-block was ported from alfresco.js in Share and is really too share specific and could potentially
         // be rewritten in the future to validation to ensure that all substitution tokens are provided.
         if (template.indexOf("{site}") !== -1)
         {
            if (obj.hasOwnProperty("site") && ObjectTypeUtils.isValueSet(obj.site))
            {
               // No action required. Site exists in template and site is provided in object for substitution.
            }
            else
            {
               // Remove site part of template as site has not been provided.
               template = template.replace("/site/{site}", "");
            }
         }

         var uri = template,
             regExp = /^(http|https):\/\//;
         uri = lang.replace(uri, obj);
         if (!regExp.test(uri))
         {
            // Page context required
            uri = this.combinePaths(AlfConstants.URL_PAGECONTEXT, uri);
         }

         // Absolute URI needs current protocol and host
         if (absolute && (uri.indexOf(location.protocol + "//") !== 0))
         {
            // Don't use combinePaths in case the encoding is fragile
            if (uri.substring(0, 1) !== "/")
            {
               uri = "/" + uri;
            }
            uri = location.protocol + "//" + location.host + uri;
         }
         return uri;
      },

      /**
       * This function is required to support "legacy" action handling within Share.
       *
       * @instance
       * @param {Object} record The current node to generate actions URLs for.
       * @param {String} [siteId] The id of the current site, will be generated if missing from record.
       * @param {String} [repositoryUrl] The URL of a linked repository
       */
      getActionUrls: function alfresco_core_UrlUtils__getActionUrls(record, siteId, repositoryUrl) {
         var actionUrls = {},
             jsNode = record.node;
         if (jsNode)
         {
            var nodeRef = jsNode.isLink ? jsNode.linkedNode.nodeRef : jsNode.nodeRef,
                strNodeRef = nodeRef != null ? nodeRef.toString() : "",
                contentUrl = jsNode.contentURL,
                workingCopy = record.workingCopy || {},
                recordSiteId = (record.location != null && record.location.site != null) ? record.location.site.name : null;

            var site = {
               site: (siteId != null) ? siteId : recordSiteId
            };
            try
            {
               actionUrls.downloadUrl = this.combinePaths(AlfConstants.PROXY_URI, contentUrl) + "?a=true";
               actionUrls.viewUrl =  this.combinePaths(AlfConstants.PROXY_URI, contentUrl) + "\" target=\"_blank";
               actionUrls.documentDetailsUrl = this.generatePageUrl("document-details?nodeRef=" + strNodeRef, site);
               actionUrls.folderDetailsUrl = this.generatePageUrl("folder-details?nodeRef=" + strNodeRef, site);
               actionUrls.editMetadataUrl = this.generatePageUrl("edit-metadata?nodeRef=" + strNodeRef, site);
               actionUrls.inlineEditUrl = this.generatePageUrl("inline-edit?nodeRef=" + strNodeRef, site);
               actionUrls.managePermissionsUrl = this.generatePageUrl("manage-permissions?nodeRef=" + strNodeRef, site);
               actionUrls.manageTranslationsUrl = this.generatePageUrl("manage-translations?nodeRef=" + strNodeRef, site);
               actionUrls.workingCopyUrl = this.generatePageUrl("document-details?nodeRef=" + (workingCopy.workingCopyNodeRef || strNodeRef), site);
               actionUrls.workingCopySourceUrl = this.generatePageUrl("document-details?nodeRef=" + (workingCopy.sourceNodeRef || strNodeRef), site);
               actionUrls.viewGoogleDocUrl = workingCopy.googleDocUrl + "\" target=\"_blank";
               actionUrls.cloudViewUrl = this.combinePaths(AlfConstants.URL_SERVICECONTEXT, "cloud/cloudUrl?nodeRef=" + strNodeRef);
               actionUrls.sourceRepositoryUrl = this.viewInSourceRepositoryURL(record, actionUrls) + "\" target=\"_blank";
            }
            catch (e)
            {
               this.alfLog("error", "The following error occurred generating action URLs", e, record, this);
            }
         }
         return actionUrls;
      },

      /**
       * Alias to [siteURL]{@link module:alfresco/core/UrlUtils#siteURL}
       *
       * @instance
       * @param {String} page
       * @param {Object[]} args
       */
      generatePageUrl: function alfresco_core_UrlUtils__generatePageUrl(page, args) {
         return this.siteURL(page, args);
      },

      /**
       * View in source Repository URL helper
       *
       * @instance
       * @param {Object} record Object literal representing the file or folder to be actioned
       * @param {Object} actionUrls Action urls for this record
       */
      viewInSourceRepositoryURL: function alfresco_core_UrlUtils__viewInSourceRepositoryURL(record, actionUrls, replicationUrlMapping) {
         if (record)
         {
            var node = record.node;
            var repoId = lang.getObject("location.repositoryId", false, record);
            var urlMapping = replicationUrlMapping;
            var siteUrl;

            if (!repoId || !urlMapping || !urlMapping[repoId])
            {
               return "#";
            }

            // Generate a URL to the relevant details page
            siteUrl = node.isContainer ? actionUrls.folderDetailsUrl : actionUrls.documentDetailsUrl;
            // Strip off this webapp's context as the mapped one might be different
            siteUrl = siteUrl.substring(AlfConstants.URL_CONTEXT.length);
            return this.combinePaths(urlMapping[repoId], "/", siteUrl);
         }
         else
         {
            return "#";
         }
      }
   });
});