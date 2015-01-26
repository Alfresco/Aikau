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
 * This is a mixin that provides time and date related utility functions.
 * 
 * @module alfresco/core/TemporalUtils
 * @mixes module:alfresco/core/Core
 * @author Richard Smith
 */
define(["dojo/_base/declare",
        "dojo/_base/lang",
        "alfresco/core/Core",
        "dojo/date/stamp",
        "dojo/query"], 
        function(declare, lang, AlfCore, stamp, query) {

   return declare([AlfCore], {

      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/TemporalUtils.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/TemporalUtils.properties"}],

      /**
       * @constructs TemporalUtils
       * @param {object} args modules to mixin
       */
      constructor: function alfresco_core_TemporalUtils__constructor(args) {

         lang.mixin(this, args);
         
         this.dateFormats = {};
         this.dateFormats.DAY_NAMES = (this.message("days.medium") + "," + this.message("days.long")).split(",");
         this.dateFormats.MONTH_NAMES = (this.message("months.short") + "," + this.message("months.long")).split(",");
         this.dateFormats.TIME_AM = this.message("date-format.am");
         this.dateFormats.TIME_PM = this.message("date-format.pm");
         this.dateFormats.masks = {};
         this.dateFormats.masks["default"] = this.message("date-format.default");
         this.dateFormats.masks.defaultDateOnly = this.message("date-format.defaultDateOnly");
         this.dateFormats.masks.shortDate = this.message("date-format.shortDate");
         this.dateFormats.masks.mediumDate = this.message("date-format.mediumDate");
         this.dateFormats.masks.longDate = this.message("date-format.longDate");
         this.dateFormats.masks.fullDate = this.message("date-format.fullDate");
         this.dateFormats.masks.shortTime = this.message("date-format.shortTime");
         this.dateFormats.masks.mediumTime = this.message("date-format.mediumTime");
         this.dateFormats.masks.longTime = this.message("date-format.longTime");
         this.dateFormats.masks.isoDate = "yyyy-mm-dd";
         this.dateFormats.masks.isoTime = "HH:MM:ss";
         this.dateFormats.masks.isoDateTime = "yyyy-mm-dd'T'HH:MM:ss";
         this.dateFormats.masks.isoFullDateTime = "yyyy-mm-dd'T'HH:MM:ss.lo";
         this.dateFormats.i18n = {
            dayNames: this.dateFormats.DAY_NAMES,
            monthNames: this.dateFormats.MONTH_NAMES
         };
      },

      /**
       * Generate a relative time between two Date objects.
       *
       * @instance
       * @param from {Date|String} JavaScript Date object or ISO8601-formatted date string
       * @param to {Date|String} (Optional) JavaScript Date object or ISO8601-formatted date string, defaults to now if not supplied
       * @return {String} Relative time description
       */
      getRelativeTime: function alfresco_core_TemporalUtils__getRelativeTime(from, to) {

         var originalFrom = from;

         if (lang.isString(from))
         {
            from = this.fromISO8601(from);
         }

         if (!(from instanceof Date))
         {
            return originalFrom;
         }

         if (to === undefined)
         {
            to = new Date();
         }
         else if (lang.isString(to))
         {
            to = this.fromISO8601(to);
         }

         var seconds_ago = ((to - from) / 1000),
             minutes_ago = Math.floor(seconds_ago / 60),
             _this = this,
             fnTime = function getRelativeTime_fnTime() {
                return "<span title='" + _this.formatDate(from) + "'>" + _this.message.apply(this, arguments) + "</span>";
             };

         if (minutes_ago <= 0)
         {
            return fnTime("relative.seconds", seconds_ago);
         }
         if (minutes_ago == 1)
         {
            return fnTime("relative.minute");
         }
         if (minutes_ago < 45)
         {
            return fnTime("relative.minutes", minutes_ago);
         }
         if (minutes_ago < 90)
         {
            return fnTime("relative.hour");
         }
         var hours_ago  = Math.round(minutes_ago / 60);
         if (minutes_ago < 1440)
         {
            return fnTime("relative.hours", hours_ago);
         }
         if (minutes_ago < 2880)
         {
            return fnTime("relative.day");
         }
         var days_ago  = Math.round(minutes_ago / 1440);
         if (minutes_ago < 43200)
         {
            return fnTime("relative.days", days_ago);
         }
         if (minutes_ago < 86400)
         {
            return fnTime("relative.month");
         }
         var months_ago  = Math.round(minutes_ago / 43200);
         if (minutes_ago < 525960)
         {
            return fnTime("relative.months", months_ago);
         }
         if (minutes_ago < 1051920)
         {
            return fnTime("relative.year");
         }
         var years_ago  = Math.round(minutes_ago / 525960);
         return fnTime("relative.years", years_ago);
      },

      /**
       * Convert an ISO8601 date string into a native JavaScript Date object
       *
       * @instance
       * @param date {String} ISO8601 formatted date string
       * @param ignoreTime {Boolean} Optional. Ignores any time (and therefore timezone) components.
       * @return {Date|null} JavaScript native Date object
       */
      fromISO8601: function alfresco_core_TemporalUtils__fromISO8601(date, ignoreTime) {

         if (ignoreTime)
         {
            date = date.split('T')[0];
         }

         try
         {
            return stamp.fromISOString(date);
         }
         catch(e)
         {
            return null;
         }
      },

      /**
       * Convert a native JavaScript Date object into an ISO8601 date string
       *
       * @instance
       * @param date {Date} JavaScript native Date object
       * @return {String} ISO8601 formatted date string
       */
      toISO8601: function alfresco_core_TemporalUtils__toISO8601(date) {

         try
         {
            return stamp.toISOString.apply(this, arguments);
         }
         catch(e)
         {
            return "";
         }
      },

      /**
       * Formats a date time into a more UI-friendly format
       *
       * @instance
       * @param date {String|Date} Optional: Date as ISO8601 compatible string or JavaScript Date Object. Today used if missing.
       * @param format {String} Optional: Mask to use to override default.
       * @return {String} Date formatted for UI
       */
      formatDate: function alfresco_core_TemporalUtils__formatDate(date, format) {

         if (lang.isString(date))
         {
            // if we've got a date as an ISO8601 string, convert to date Object before proceeding - otherwise pass it through
            var dateObj = this.fromISO8601(date);
            if (dateObj)
            {
               arguments[0] = dateObj;
            }
         }
         try
         {
            // return locale.format.apply(this, arguments);
            return this.formatDate3rd.apply(this, arguments);
         }
         catch(e)
         {
            return date;
         }
      },

      /**
       * Format a date object to a user-specified mask
       *
       * Original code:
       *    Date Format 1.1
       *    (c) 2007 Steven Levithan <stevenlevithan.com>
       *    MIT license
       *    With code by Scott Trenda (Z and o flags, and enhanced brevity)
       *
       * http://blog.stevenlevithan.com/archives/date-time-format
       * 
       * @instance
       * @return {String}
       */
      formatDate3rd: function alfresco_core_TemporalUtils__formatDate3rd() {

         /* dateFormat
          Accepts a date, a mask, or a date and a mask.
          Returns a formatted version of the given date.
          The date defaults to the current date/time.
          The mask defaults ``"ddd mmm d yyyy HH:MM:ss"``.
          */
         var _this = this,
             dateFormat = function() {
            
            var token        = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloZ]|"[^"]*"|'[^']*'/g,
                timezone     = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
                timezoneClip = /[^-+\dA-Z]/g,
                fnPad = function(value, length) {
                   value = String(value);
                   length = parseInt(length, 10) || 2;
                   while (value.length < length)
                   {
                      value = "0" + value;
                   }
                   return value;
                };

            // Regexes and supporting functions are cached through closure
            return function (date, mask) {

               // Treat the first argument as a mask if it doesn't contain any numbers
               if (arguments.length == 1 &&
                  (typeof date == "string" || date instanceof String) &&
                  !/\d/.test(date))
               {
                  mask = date;
                  date = undefined;
               }

               if (typeof date == "string")
               {
                  date = date.replace(".", "");
               }

               date = date ? new Date(date) : new Date();
               if (isNaN(date))
               {
                  throw "invalid date";
               }

               mask = String(_this.dateFormats.masks[mask] || mask || _this.dateFormats.masks["default"]);

               var d = date.getDate(),
                   D = date.getDay(),
                   m = date.getMonth(),
                   y = date.getFullYear(),
                   H = date.getHours(),
                   M = date.getMinutes(),
                   s = date.getSeconds(),
                   L = date.getMilliseconds(),
                   o = date.getTimezoneOffset(),
                   flags = {
                      d:    d,
                      dd:   fnPad(d),
                      ddd:  _this.dateFormats.i18n.dayNames[D],
                      dddd: _this.dateFormats.i18n.dayNames[D + 7],
                      m:    m + 1,
                      mm:   fnPad(m + 1),
                      mmm:  _this.dateFormats.i18n.monthNames[m],
                      mmmm: _this.dateFormats.i18n.monthNames[m + 12],
                      yy:   String(y).slice(2),
                      yyyy: y,
                      h:    H % 12 || 12,
                      hh:   fnPad(H % 12 || 12),
                      H:    H,
                      HH:   fnPad(H),
                      M:    M,
                      MM:   fnPad(M),
                      s:    s,
                      ss:   fnPad(s),
                      l:    fnPad(L, 3),
                      L:    fnPad(L > 99 ? Math.round(L / 10) : L),
                      t:    H < 12 ? _this.dateFormats.TIME_AM.charAt(0) : _this.dateFormats.TIME_PM.charAt(0),
                      tt:   H < 12 ? _this.dateFormats.TIME_AM : _this.dateFormats.TIME_PM,
                      T:    H < 12 ? _this.dateFormats.TIME_AM.charAt(0).toUpperCase() : _this.dateFormats.TIME_PM.charAt(0).toUpperCase(),
                      TT:   H < 12 ? _this.dateFormats.TIME_AM.toUpperCase() : _this.dateFormats.TIME_PM.toUpperCase(),
                      Z:    (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                      o:    (o > 0 ? "-" : "+") + fnPad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4)
                   };

               return mask.replace(token, function ($0) {
                  return ($0 in flags) ? flags[$0] : $0.slice(1, $0.length - 1);
               });
            };
         }();

         /**
          * Alfresco wrapper: delegate to wrapped code
          */
         return dateFormat.apply(arguments.callee, arguments);

      },

      /**
       * Converts a user input time string into a date object.
       * Accepted inputs include: 11am, 11PM, 11:00, 23:00, 11:23 am, 3 p.m., 08:00, 1100, 11, 8, 23.
       * Only accepts hours and minutes. Seconds are zeroed.
       *
       * @instance
       * @param timeString {String} User input time
       * @return {Date}
       */
      parseTime: function alfresco_core_TemporalUtils__parseTime(timeString) {

         var d = new Date(); // Today's date
         var time = timeString.toString().match(/^(\d{1,2})(?::?(\d\d))?\s*(a*)([p]?)\.*m?\.*$/i);

         // Exit early if we've not got a match, if the hours are greater than 24, or greater than 12 if AM/PM is specified, or minutes are larger than 59.
         if (time === null || !time[1] || time[1] > 24 || (time[1] > 12 && (time[3]||time[4])) || (time[2] && time[2] > 59)) return null;

         // Add 12?
         var add12 = false;

         // If we're PM:
         if (time[4])
         {
            add12 = true;
         }

         // if we've got EITHER AM or PM, the 12th hour behaves different:
         // 12am = 00:00 (which is the same as 24:00 if the date is ignored), 12pm = 12:00
         // if we don't have AM or PM, then default to 12 === noon (i.e. add nothing).
         if (time[1] == 12 && (time[3] || time[4]))
         {
            add12 = !add12;
         }

         d.setHours( parseInt(time[1], 10) + (add12 ? 12 : 0) );
         d.setMinutes( parseInt(time[2], 10) || 0 );
         d.setSeconds(0);

         return d;
      },

      /**
       * Render relative dates on the client
       *
       * Converts all ISO8601 dates within the specified container to relative dates.
       * (indicated by <span class="relativeTime">{date.iso8601}</span>)
       *
       * @instance
       * @param id {String} ID of HTML element containing dates for conversion
       */
      renderRelativeTime: function alfresco_core_TemporalUtils__renderRelativeTime(id) {
         query("span.relativeTime", id).forEach(function(node){
            node.innerHTML = this.getRelativeTime(node.innerHTML);
         });
      }

   });
});