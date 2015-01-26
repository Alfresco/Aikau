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
 * This contains the constants that are used by the 
 * [Aikau PDF previewer plugin]{@link module:alfresco/preview/PdfJs/PdfJs}.
 * 
 * @module alfresco/preview/PdfJs/PdfJsConstants
 * @author Dave Draper
 */
define([],function() {
   
   return {

      /**
       *
       *
       * @instance
       * @type {number}
       * @default 0
       */
      K_UNKNOWN_SCALE: 0,

      /**
       *
       *
       * @instance
       * @type {number}
       * @default 96.0 / 72.0
       */
      K_CSS_UNITS: 96.0 / 72.0,

      /**
       *
       *
       * @instance
       * @type {number}
       * @default 0.25
       */
      K_MIN_SCALE: 0.25,
      
      /**
       *
       *
       * @instance
       * @type {number}
       * @default 4.0
       */
      K_MAX_SCALE: 4.0,

      /**
       * Topic published to indicate that the PDF has finished loading.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_PDF_LOADED"
       */
      PDF_LOADED_TOPIC: "ALF_PDFJS_PDF_LOADED",
      
      /**
       * Topic for controlling whether or not the sidebar is displayed or hidden.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_SHOW_SIDEBAR"
       */
      SHOW_SIDEBAR_TOPIC: "ALF_PDFJS_SHOW_SIDEBAR",
      
      /**
       * Topic for setting a pre-set zoom level.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_ZOOM_SELECTION"
       */
      ZOOM_SET_TOPIC: "ALF_PDFJS_ZOOM_SELECTION",
      
      /**
       * Topic requesting to shrink the document view.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_ZOOM_OUT"
       */
      ZOOM_OUT_TOPIC: "ALF_PDFJS_ZOOM_OUT",
      
      /**
       * Topic requesting to increase the document view.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_ZOOM_IN"
       */
      ZOOM_IN_TOPIC: "ALF_PDFJS_ZOOM_IN",
      
      /**
       * Topic requesting to go back to the previous page.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_PREVIOUS_PAGE"
       */
      PREVIOUS_PAGE_TOPIC: "ALF_PDFJS_PREVIOUS_PAGE",
      
      /**
       * Topic requesting to skip to the next page.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_NEXT_PAGE"
       */
      NEXT_PAGE_TOPIC: "ALF_PDFJS_NEXT_PAGE",
      
      /**
       * Topic requesting to set a specific page.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_SET_PAGE_REQUEST"
       */
      SET_PAGE_REQUEST_TOPIC: "ALF_PDFJS_SET_PAGE_REQUEST",
      
      /**
       * Topic confirming a specific page to jump to.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_SET_PAGE_CONFIRMATION"
       */
      SET_PAGE_CONFIRMATION_TOPIC: "ALF_PDFJS_SET_PAGE_CONFIRMATION",
      
      /**
       * Topic used to publish information about the current page being viewed.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_SET_PAGE_INFO"
       */
      SET_PAGE_INFO_TOPIC: "ALF_PDFJS_SET_PAGE_INFO",
      
      /**
       * Topic used to control whether or not the previous page button is enabled
       * or disabled.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_DISABLE_PREVIOUS"
       */
      DISABLE_PREVIOUS_BUTTON_TOPIC: "ALF_PDFJS_DISABLE_PREVIOUS",
      
      /**
       * Topic used to control whether or not the next page button is enabled or
       * disabled.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_DISABLE_NEXT"
       */
      DISABLE_NEXT_BUTTON_TOPIC: "ALF_PDFJS_DISABLE_NEXT",
      
      /**
       * Topic used to control whether or not the zoom in button is enabled or
       * disabled.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_DISABLE_ZOOM_IN"
       */
      DISABLE_ZOOM_IN_BUTTON_TOPIC: "ALF_PDFJS_DISABLE_ZOOM_IN",
      
      /**
       * Topic used to control whether or not the zoom out button is enabled or
       * disabled.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_DISABLE_ZOOM_OUT"
       */
      DISABLE_ZOOM_OUT_BUTTON_TOPIC: "ALF_PDFJS_DISABLE_ZOOM_OUT",
      
      /**
       * The single page width zoom pre-set.
       *
       * @instance
       * @type {string}
       * @default "page-width"
       */
      ZOOM_LEVEL_PAGE_WIDTH: "page-width",
      
      /**
       * The two page width zoom pre-set.
       *
       * @instance
       * @type {string}
       * @default "two-page-width"
       */
      ZOOM_LEVEL_TWO_PAGE_WIDTH: "two-page-width",
      
      /**
       * The page height zoom pre-set.
       * 
       * @instance
       * @type {string}
       * @default "page-height"
       */
      ZOOM_LEVEL_PAGE_HEIGHT: "page-height",
      
      /**
       * The single page zoom pre-set.
       *
       * @instance
       * @type {string}
       * @default "page-fit"
       */
      ZOOM_LEVEL_PAGE_FIT: "page-fit",
      
      /**
       * The two page zoom pre-set.
       *
       * @instance
       * @type {string}
       * @default "two-page-fit"
       */
      ZOOM_LEVEL_TWO_PAGE_FIT: "two-page-fit",
      
      /**
       * The automatic zoom pre-set.
       *
       * @instance
       * @type {string}
       * @default "auto"
       */
      ZOOM_LEVEL_AUTO: "auto",
      
      /**
       * The topic published to request a PDF version of the document be downloaded.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_DOWNLOAD_PDF"
       */
      DOWNLOAD_PDF_TOPIC: "ALF_PDFJS_DOWNLOAD_PDF",
      
      /**
       * The topic published to request the original document to be downloaded.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_DOWNLOAD_ORIGINAL"
       */
      DOWNLOAD_ORIGINAL_TOPIC: "ALF_PDFJS_DOWNLOAD_ORIGINAL",
      
      /**
       * The topic published to control whether or not the link controls are displayed
       * or not.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_SHOW_LINK_INFO"
       */
      SHOW_LINK_INFO_TOPIC: "ALF_PDFJS_SHOW_LINK_INFO",
      
      /**
       * The topic used request that a page link be updated to reflect the current page
       * being displayed in the PDF.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_UPDATE_LINK_URL"
       */
      UPDATE_LINK_URL_REQUEST_TOPIC: "ALF_PDFJS_UPDATE_LINK_URL",
      
      /**
       * The topic used to publishes a new URL for the current page in the document.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_SET_LINK_URL"
       */
      SET_LINK_URL_TOPIC: "ALF_PDFJS_SET_LINK_URL",
      
      /**
       * The topic used to control whether or not the search tools are displayed or not.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_SHOW_SEARCH_TOOLS"
       */
      SHOW_SEARCH_TOOLS_TOPIC: "ALF_PDFJS_SHOW_SEARCH_TOOLS",
      
      /**
       * The topic used to request a search term to find in the PDF document.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_FIND"
       */
      FIND_TOPIC: "ALF_PDFJS_FIND",
      
      /**
       * The topic to request finding the next search term match in the PDF document.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_FIND_NEXT"
       */
      FIND_NEXT_TOPIC: "ALF_PDFJS_FIND_NEXT",
      
      /**
       * The topic to request finding the previous search term match in the PDF document.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_FIND_PREVIOUS"
       */
      FIND_PREVIOUS_TOPIC: "ALF_PDFJS_FIND_PREVIOUS",
      
      /**
       * The topic to toggle between highlighting all matches or just the current match
       * of the search term.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_HIGHLIGHT_ALL"
       */
      HIGHLIGHT_ALL_TOPIC: "ALF_PDFJS_HIGHLIGHT_ALL",
      
      /**
       * The topic to toggle between strict search term case matching and ignoring case.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_MATCH_CASE"
       */
      MATCH_CASE_TOPIC: "ALF_PDFJS_MATCH_CASE",
      
      /**
       * The topic published when the main PDF viewer is scrolled.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_VIEWER_SCROLLED"
       */
      VIEWER_SCROLL_TOPIC: "ALF_PDFJS_VIEWER_SCROLLED",

      /**
       * The topic published when the password challenge is submitted.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_PASSWORD_RELOAD"
       */
      PASSWORD_RELOAD: "ALF_PDFJS_PASSWORD_RELOAD",

      /**
       * The topic published to hide or show the interface elements.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_SHOW_INTERFACE"
       */
      SHOW_INTERFACE_TOPIC: "ALF_PDFJS_SHOW_INTERFACE",

      /**
       * The topic published to show or hide a notification message.
       *
       * @instance
       * @type {string}
       * @default "ALF_PDFJS_SHOW_NOTIFICATION"
       */
      SHOW_NOTIFICATION_TOPIC: "ALF_PDFJS_SHOW_NOTIFICATION"
   };
});