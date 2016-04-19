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
       * @default
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
       * @default
       */
      K_MIN_SCALE: 0.25,
      
      /**
       *
       *
       * @instance
       * @type {number}
       * @default
       */
      K_MAX_SCALE: 4.0,

      /**
       * Topic published to indicate that the PDF has finished loading.
       *
       * @instance
       * @type {string}
       * @default
       */
      PDF_LOADED_TOPIC: "ALF_PDFJS_PDF_LOADED",
      
      /**
       * Topic published to indicate that the PDF page container has been rendered.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.64
       */
      PDF_PAGES_RENDERED: "ALF_PDFJS_PAGES_RENDERED",
      
      /**
       * Topic for controlling whether or not the sidebar is displayed or hidden.
       *
       * @instance
       * @type {string}
       * @default
       */
      SHOW_SIDEBAR_TOPIC: "ALF_PDFJS_SHOW_SIDEBAR",
      
      /**
       * Topic for setting a pre-set zoom level.
       *
       * @instance
       * @type {string}
       * @default
       */
      ZOOM_SET_TOPIC: "ALF_PDFJS_ZOOM_SELECTION",
      
      /**
       * Topic requesting to shrink the document view.
       *
       * @instance
       * @type {string}
       * @default
       */
      ZOOM_OUT_TOPIC: "ALF_PDFJS_ZOOM_OUT",
      
      /**
       * Topic requesting to increase the document view.
       *
       * @instance
       * @type {string}
       * @default
       */
      ZOOM_IN_TOPIC: "ALF_PDFJS_ZOOM_IN",
      
      /**
       * Topic requesting to go back to the previous page.
       *
       * @instance
       * @type {string}
       * @default
       */
      PREVIOUS_PAGE_TOPIC: "ALF_PDFJS_PREVIOUS_PAGE",
      
      /**
       * Topic requesting to skip to the next page.
       *
       * @instance
       * @type {string}
       * @default
       */
      NEXT_PAGE_TOPIC: "ALF_PDFJS_NEXT_PAGE",
      
      /**
       * Topic requesting to set a specific page.
       *
       * @instance
       * @type {string}
       * @default
       */
      SET_PAGE_REQUEST_TOPIC: "ALF_PDFJS_SET_PAGE_REQUEST",
      
      /**
       * Topic confirming a specific page to jump to.
       *
       * @instance
       * @type {string}
       * @default
       */
      SET_PAGE_CONFIRMATION_TOPIC: "ALF_PDFJS_SET_PAGE_CONFIRMATION",
      
      /**
       * Topic used to publish information about the current page being viewed.
       *
       * @instance
       * @type {string}
       * @default
       */
      SET_PAGE_INFO_TOPIC: "ALF_PDFJS_SET_PAGE_INFO",
      
      /**
       * Topic used to control whether or not the previous page button is enabled
       * or disabled.
       *
       * @instance
       * @type {string}
       * @default
       */
      DISABLE_PREVIOUS_BUTTON_TOPIC: "ALF_PDFJS_DISABLE_PREVIOUS",
      
      /**
       * Topic used to control whether or not the next page button is enabled or
       * disabled.
       *
       * @instance
       * @type {string}
       * @default
       */
      DISABLE_NEXT_BUTTON_TOPIC: "ALF_PDFJS_DISABLE_NEXT",
      
      /**
       * Topic used to control whether or not the zoom in button is enabled or
       * disabled.
       *
       * @instance
       * @type {string}
       * @default
       */
      DISABLE_ZOOM_IN_BUTTON_TOPIC: "ALF_PDFJS_DISABLE_ZOOM_IN",
      
      /**
       * Topic used to control whether or not the zoom out button is enabled or
       * disabled.
       *
       * @instance
       * @type {string}
       * @default
       */
      DISABLE_ZOOM_OUT_BUTTON_TOPIC: "ALF_PDFJS_DISABLE_ZOOM_OUT",
      
      /**
       * The single page width zoom pre-set.
       *
       * @instance
       * @type {string}
       * @default
       */
      ZOOM_LEVEL_PAGE_WIDTH: "page-width",
      
      /**
       * The two page width zoom pre-set.
       *
       * @instance
       * @type {string}
       * @default
       */
      ZOOM_LEVEL_TWO_PAGE_WIDTH: "two-page-width",
      
      /**
       * The page height zoom pre-set.
       * 
       * @instance
       * @type {string}
       * @default
       */
      ZOOM_LEVEL_PAGE_HEIGHT: "page-height",
      
      /**
       * The single page zoom pre-set.
       *
       * @instance
       * @type {string}
       * @default
       */
      ZOOM_LEVEL_PAGE_FIT: "page-fit",
      
      /**
       * The two page zoom pre-set.
       *
       * @instance
       * @type {string}
       * @default
       */
      ZOOM_LEVEL_TWO_PAGE_FIT: "two-page-fit",
      
      /**
       * The automatic zoom pre-set.
       *
       * @instance
       * @type {string}
       * @default
       */
      ZOOM_LEVEL_AUTO: "auto",
      
      /**
       * The topic published to request a PDF version of the document be downloaded.
       *
       * @instance
       * @type {string}
       * @default
       */
      DOWNLOAD_PDF_TOPIC: "ALF_PDFJS_DOWNLOAD_PDF",
      
      /**
       * The topic published to request the original document to be downloaded.
       *
       * @instance
       * @type {string}
       * @default
       */
      DOWNLOAD_ORIGINAL_TOPIC: "ALF_PDFJS_DOWNLOAD_ORIGINAL",
      
      /**
       * The topic published to control whether or not the link controls are displayed
       * or not.
       *
       * @instance
       * @type {string}
       * @default
       */
      SHOW_LINK_INFO_TOPIC: "ALF_PDFJS_SHOW_LINK_INFO",
      
      /**
       * The topic used request that a page link be updated to reflect the current page
       * being displayed in the PDF.
       *
       * @instance
       * @type {string}
       * @default
       */
      UPDATE_LINK_URL_REQUEST_TOPIC: "ALF_PDFJS_UPDATE_LINK_URL",
      
      /**
       * The topic used to publishes a new URL for the current page in the document.
       *
       * @instance
       * @type {string}
       * @default
       */
      SET_LINK_URL_TOPIC: "ALF_PDFJS_SET_LINK_URL",
      
      /**
       * The topic used to control whether or not the search tools are displayed or not.
       *
       * @instance
       * @type {string}
       * @default
       */
      SHOW_SEARCH_TOOLS_TOPIC: "ALF_PDFJS_SHOW_SEARCH_TOOLS",
      
      /**
       * The topic used to request a search term to find in the PDF document.
       *
       * @instance
       * @type {string}
       * @default
       */
      FIND_TOPIC: "ALF_PDFJS_FIND",
      
      /**
       * The topic to request finding the next search term match in the PDF document.
       *
       * @instance
       * @type {string}
       * @default
       */
      FIND_NEXT_TOPIC: "ALF_PDFJS_FIND_NEXT",
      
      /**
       * The topic to request finding the previous search term match in the PDF document.
       *
       * @instance
       * @type {string}
       * @default
       */
      FIND_PREVIOUS_TOPIC: "ALF_PDFJS_FIND_PREVIOUS",
      
      /**
       * The topic to toggle between highlighting all matches or just the current match
       * of the search term.
       *
       * @instance
       * @type {string}
       * @default
       */
      HIGHLIGHT_ALL_TOPIC: "ALF_PDFJS_HIGHLIGHT_ALL",
      
      /**
       * The topic to toggle between strict search term case matching and ignoring case.
       *
       * @instance
       * @type {string}
       * @default
       */
      MATCH_CASE_TOPIC: "ALF_PDFJS_MATCH_CASE",
      
      /**
       * The topic published when the main PDF viewer is scrolled.
       *
       * @instance
       * @type {string}
       * @default
       */
      VIEWER_SCROLL_TOPIC: "ALF_PDFJS_VIEWER_SCROLLED",

      /**
       * The topic published when the password challenge is submitted.
       *
       * @instance
       * @type {string}
       * @default
       */
      PASSWORD_RELOAD: "ALF_PDFJS_PASSWORD_RELOAD",

      /**
       * The topic published to hide or show the interface elements.
       *
       * @instance
       * @type {string}
       * @default
       */
      SHOW_INTERFACE_TOPIC: "ALF_PDFJS_SHOW_INTERFACE",

      /**
       * The topic published to show or hide a notification message.
       *
       * @instance
       * @type {string}
       * @default
       */
      SHOW_NOTIFICATION_TOPIC: "ALF_PDFJS_SHOW_NOTIFICATION"
   };
});