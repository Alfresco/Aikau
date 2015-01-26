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
 * <p>This code was adapted from a Share Extras (http://share-extras.github.io/)
 * project and was then integrated into Alfresco Share for version 5.0. That code was in turn
 * originally copied from the Mozilla pdf.js project (https://github.com/mozilla/pdf.js).</p>
 *
 * <p>Provides a "search" or "find" functionality for the PDF.This object actually performs 
 * the search for a given string.</p>
 *
 * @module alfresco/preview/PdfJs/PDFFindController
 * @author Dave Draper
 * @author Will Abson
 * @auther Peter Löfgren
 * @author Kevin Roast
 */
define(["dojo/_base/declare",
        "alfresco/core/Core"], 
        function(declare, AlfCore) {
   
   return declare([AlfCore], {

      FindStates: {
         FIND_FOUND: 0,
         FIND_NOTFOUND: 1,
         FIND_WRAPPED: 2,
         FIND_PENDING: 3
      },
     
      /**
       *
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      startedTextExtraction: false,

      /**
       *
       *
       * @instance
       * @type {array}
       * @default []
       */
      extractTextPromises: [],

      /**
       *
       *
       * @instance
       * @type {object}
       * @default {}
       */
      pendingFindMatches: {},

      /**
       * If active, find results will be highlighted.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      active: false,

      /**
       * Stores the text for each page.
       *
       * @instance
       * @type {array}
       * @default []
       */
      pageContents: [],

      /**
       *
       *
       * @instance
       * @type {array}
       * @default []
       */
      pageMatches: [],

      // Currently selected match.
      selected: {
         pageIdx: -1,
         matchIdx: -1
      },

      // Where find algorithm currently is in the document.
      offset: {
         pageIdx: null,
         matchIdx: null
      },

      /**
       *
       *
       * @instance
       * @default null
       */
      resumePageIdx: null,

      /**
       *
       *
       * @instance
       * @default null
       */
      state: null,

      /**
       *
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      dirtyMatch: false,

      /**
       *
       *
       * @instance
       * @type {number}
       * @default null
       */
      findTimeout: null,

      /**
       *
       *
       * @instance
       * @type {object}
       * @default null
       */
      pdfPageSource: null,

      /**
       *
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      integratedFind: false,

      /**
       *
       *
       * @instance
       */
      constructor: function alfresco_preview_PdfJs_PDFFindController__constructor(options) {
         this.pdfPageSource = options.pdfPageSource;
         this.integratedFind = options.integratedFind;

         var events = [
            'find',
            'findagain',
            'findhighlightallchange',
            'findcasesensitivitychange'
         ];

         this.firstPagePromise = new Promise(function (resolve) {
            this.resolveFirstPage = resolve;
         }.bind(this));
         this.handleEvent = this.handleEvent.bind(this);

         for (var i = 0; i < events.length; i++) {
           window.addEventListener(events[i], this.handleEvent);
         }
      },

      /**
       *
       *
       * @instance
       */
      reset: function alfresco_preview_PdfJs_PDFFindController__reset() {
         this.startedTextExtraction = false;
         this.extractTextPromises = [];
         this.active = false;
      },

      /**
       *
       *
       * @instance
       */
      calcFindMatch: function alfresco_preview_PdfJs_PDFFindController__calcFindMatch(pageIndex) {
         var pageContent = this.pageContents[pageIndex];
         var query = this.state.query;
         var caseSensitive = this.state.caseSensitive;
         var queryLen = query.length;

         if (queryLen === 0) {
            // Do nothing the matches should be wiped out already.
            return;
         }

         if (!caseSensitive) {
            pageContent = pageContent.toLowerCase();
            query = query.toLowerCase();
         }

         var matches = [];

         var matchIdx = -queryLen;
         while (true) {
            matchIdx = pageContent.indexOf(query, matchIdx + queryLen);
            if (matchIdx === -1) {
               break;
            }

            matches.push(matchIdx);
         }
         this.pageMatches[pageIndex] = matches;
         this.updatePage(pageIndex);
         if (this.resumePageIdx === pageIndex) {
            this.resumePageIdx = null;
            this.nextPageMatch();
         }
      },

      /**
       *
       *
       * @instance
       */
      extractText: function alfresco_preview_PdfJs_PDFFindController__extractText() {
         if (this.startedTextExtraction) {
            return;
         }
         this.startedTextExtraction = true;

         this.pageContents = [];
         var extractTextPromisesResolves = [];
         for (var i = 0, ii = this.pdfPageSource.pdfDocument.numPages; i < ii; i++) {
            this.extractTextPromises.push(new Promise(function (resolve) {
               extractTextPromisesResolves.push(resolve);
            }));
         }

         var self = this;
         function extractPageText(pageIndex) {
            self.pdfPageSource.pages[pageIndex].getTextContent().then(
               function textContentResolved(textContent) {
                  var textItems = textContent.items;
                  var str = '';

                  for (var i = 0; i < textItems.length; i++) {
                     str += textItems[i].str;
                  }

                  // Store the pageContent as a string.
                  self.pageContents.push(str);

                  extractTextPromisesResolves[pageIndex](pageIndex);
                  if ((pageIndex + 1) < self.pdfPageSource.pages.length) {
                     extractPageText(pageIndex + 1);
                  }
               }
            );
         }
         extractPageText(0);
      },

      /**
       *
       *
       * @instance
       */
      handleEvent: function alfresco_preview_PdfJs_PDFFindController__handleEvent(e) {
         if (this.state === null || e.type !== 'findagain') {
            this.dirtyMatch = true;
         }
         this.state = e.detail;
         this.updateUIState(this.FindStates.FIND_PENDING);

         this.firstPagePromise.then(function() {
            this.extractText();

            clearTimeout(this.findTimeout);
            if (e.type === 'find')
            {
              // Only trigger the find action after 250ms of silence.
              this.findTimeout = setTimeout(this.nextMatch.bind(this), 250);
            } 
            else 
            {
              this.nextMatch();
            }
         }.bind(this));
      },

      /**
       *
       *
       * @instance
       */
      updatePage: function alfresco_preview_PdfJs_PDFFindController__updatePage(idx) {
         var page = this.pdfPageSource.pages[idx];

         if (this.selected.pageIdx === idx) {
            // If the page is selected, scroll the page into view, which triggers
            // rendering the page, which adds the textLayer. Once the textLayer is
            // build, it will scroll onto the selected match.
            page.scrollIntoView();
         }

         if (page.textLayer) {
            page.textLayer.updateMatches();
         }
      },

      /**
       *
       *
       * @instance
       */
      nextMatch: function alfresco_preview_PdfJs_PDFFindController__nextMatch() {
         var previous = this.state.findPrevious;
         // ALFRESCO - changed .page to pageNum
         var currentPageIndex = this.pdfPageSource.pageNum - 1;
         var numPages = this.pdfPageSource.pages.length;

         this.active = true;

         if (this.dirtyMatch) 
         {
            // Need to recalculate the matches, reset everything.
            this.dirtyMatch = false;
            this.selected.pageIdx = this.selected.matchIdx = -1;
            this.offset.pageIdx = currentPageIndex;
            this.offset.matchIdx = null;
            this.hadMatch = false;
            this.resumePageIdx = null;
            this.pageMatches = [];
            var self = this;

            for (var i = 0; i < numPages; i++) {
               // Wipe out any previous highlighted matches.
               this.updatePage(i);

               // As soon as the text is extracted start finding the matches.
               if (!(i in this.pendingFindMatches)) {
                  this.pendingFindMatches[i] = true;
                  this.extractTextPromises[i].then(function(pageIdx) {
                     delete self.pendingFindMatches[pageIdx];
                     self.calcFindMatch(pageIdx);
                  });
               }
            }
         }

         // If there's no query there's no point in searching.
         if (this.state.query === '') {
            this.updateUIState(this.FindStates.FIND_FOUND);
            return;
         }

         // If we're waiting on a page, we return since we can't do anything else.
         if (this.resumePageIdx) {
            return;
         }

         var offset = this.offset;
         // If there's already a matchIdx that means we are iterating through a
         // page's matches.
         if (offset.matchIdx !== null) 
         {
            var numPageMatches = this.pageMatches[offset.pageIdx].length;
            if ((!previous && offset.matchIdx + 1 < numPageMatches) ||
               (previous && offset.matchIdx > 0)) 
            {
               // The simple case, we just have advance the matchIdx to select the next
               // match on the page.
               this.hadMatch = true;
               offset.matchIdx = previous ? offset.matchIdx - 1 : offset.matchIdx + 1;
               this.updateMatch(true);
               return;
            }
            // We went beyond the current page's matches, so we advance to the next
            // page.
            this.advanceOffsetPage(previous);
         }
         // Start searching through the page.
         this.nextPageMatch();
      },

      /**
       *
       *
       * @instance
       */
      matchesReady: function alfresco_preview_PdfJs_PDFFindController__matchesReady(matches) {
         var offset = this.offset;
         var numMatches = matches.length;
         var previous = this.state.findPrevious;
         if (numMatches) 
         {
            // There were matches for the page, so initialize the matchIdx.
            this.hadMatch = true;
            offset.matchIdx = previous ? numMatches - 1 : 0;
            this.updateMatch(true);
            // matches were found
            return true;
         } 
         else 
         {
            // No matches attempt to search the next page.
            this.advanceOffsetPage(previous);
            if (offset.wrapped) 
            {
              offset.matchIdx = null;
              if (!this.hadMatch) {
                // No point in wrapping there were no matches.
                this.updateMatch(false);
                // while matches were not found, searching for a page 
                // with matches should nevertheless halt.
                return true;
              }
            }
            // matches were not found (and searching is not done)
            return false;
         }
      },

      /**
       *
       *
       * @instance
       */
      nextPageMatch: function alfresco_preview_PdfJs_PDFFindController__nextPageMatch() {
         if (this.resumePageIdx !== null) 
         {
            this.alfLog("error","There can only be one pending page.");
         }
         var matches;
         do {
            var pageIdx = this.offset.pageIdx;
            matches = this.pageMatches[pageIdx];
            if (!matches) {
               // The matches don't exist yet for processing by "matchesReady",
               // so set a resume point for when they do exist.
               this.resumePageIdx = pageIdx;
               break;
            }
         } while (!this.matchesReady(matches));
      },

      /**
       *
       *
       * @instance
       */
      advanceOffsetPage: function alfresco_preview_PdfJs_PDFFindController__advanceOffsetPage(previous) {
         var offset = this.offset;
         var numPages = this.extractTextPromises.length;
         offset.pageIdx = previous ? offset.pageIdx - 1 : offset.pageIdx + 1;
         offset.matchIdx = null;
         if (offset.pageIdx >= numPages || offset.pageIdx < 0) 
         {
            offset.pageIdx = previous ? numPages - 1 : 0;
            offset.wrapped = true;
            return;
         }
      },

      /**
       *
       *
       * @instance
       */
      updateMatch: function alfresco_preview_PdfJs_PDFFindController__updateMatch(found) {
         var state = this.FindStates.FIND_NOTFOUND;
         var wrapped = this.offset.wrapped;
         this.offset.wrapped = false;
         if (found) 
         {
            var previousPage = this.selected.pageIdx;
            this.selected.pageIdx = this.offset.pageIdx;
            this.selected.matchIdx = this.offset.matchIdx;
            state = wrapped ? this.FindStates.FIND_WRAPPED : this.FindStates.FIND_FOUND;
            // Update the currently selected page to wipe out any selected matches.
            if (previousPage !== -1 && previousPage !== this.selected.pageIdx) {
               this.updatePage(previousPage);
            }
         }
         this.updateUIState(state, this.state.findPrevious);
         if (this.selected.pageIdx !== -1) {
            this.updatePage(this.selected.pageIdx, true);
         }
      },

      /**
       *
       *
       * @instance
       */
      updateUIState: function alfresco_preview_PdfJs_PDFFindController__updateUIState(state, previous) {
         var findMsg = '';
         // var status = '';

         // ALFRESCO - updateUIState method impl
         
         // TODO: For now do not display for hits, gets very noisy when stepping.
         // Possibly change color or similar in search box to indicate hit instead
         // Pending ajax gif on search bar until state is found, then removed. 
         // See pdf.js default Implementation

         if(state===this.FindStates.FIND_FOUND||state===this.FindStates.FIND_PENDING)
            return;
         
         switch (state) {
            case this.FindStates.FIND_FOUND:
               findMsg = this.pdfPageSource.pdfJsPlugin.wp.msg('search.message.found');
               break;

            case this.FindStates.FIND_PENDING:
               findMsg = this.pdfPageSource.pdfJsPlugin.wp.msg('search.message.pending');
               break;

            case this.FindStates.FIND_NOTFOUND:
               findMsg = this.pdfPageSource.pdfJsPlugin.wp.msg('search.message.notfound');
               break;

            case this.FindStates.FIND_WRAPPED:
               if (previous) {
                  findMsg = this.pdfPageSource.pdfJsPlugin.wp.msg('search.message.wrapped.bottom');
               } else {
                  findMsg = this.pdfPageSource.pdfJsPlugin.wp.msg('search.message.wrapped.top');
               }
               break;
         }
         
         // This will require that the alfresco/service/NotificationService is on the page
         this.alfPublish("ALF_DISPLAY_NOTIFICATION", {
            message: findMsg
         }, true);
      }
   });
});