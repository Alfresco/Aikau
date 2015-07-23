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
 * @module aikauTesting/mockservices/PreferenceService
 * @extends module:alfresco/core/Core
 * @author Martin Doyle
 */
define(["alfresco/core/Core",
      "alfresco/services/_PreferenceServiceTopicMixin",
      "dojo/text!./responseTemplates/Preferences/Preferences.json",
      "dojo/_base/array",
      "dojo/_base/declare",
      "dojo/_base/lang"
   ],
   function(AlfCore, _PreferenceServiceTopicMixin, MockPreferencesData, array, declare, lang) {

      return declare([AlfCore, _PreferenceServiceTopicMixin], {

         /**
          * Constructor
          *
          * @instance
          * @param {array} args The constructor arguments.
          */
         constructor: function alfresco_testing_mockservices_PreferenceService__constructor(args) {
            declare.safeMixin(this, args);
            this.alfSubscribe(this.getPreferenceTopic, lang.hitch(this, this._getPreference));
         },

         /**
          * Get a preference
          *
          * @instance
          * @param {Object} payload The preference payload
          */
         _getPreference: function alfresco_testing_mockservices_PreferenceService____getPreference(payload) {
            var preferenceValue = lang.getObject(payload.preference, false, MockPreferencesData);
            payload.callback.call(payload.callbackScope, preferenceValue);
         }
      });
   });