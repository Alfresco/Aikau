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

'use strict';

/**
 * Some grunt tasks can be run in parallel to speed things up.
 * Task combinations should be specified here.
 */

module.exports = function (grunt, alf) {
   return {
      // Concurrent Tasks:
      // @see: https://github.com/sindresorhus/grunt-concurrent
      concurrent: {
         startRepoAndShare: [
            'shell:startRepo', 
            'shell:startShare'
         ],
         docsAndTests: [
            'shell:jsdoc',
            'intern:dev'
         ],
         jsWatch: {
            tasks: [
               's',
               'shell:jsdoc',
               'intern:dev'
            ],
            options: {
               logConcurrentOutput: true
            }
         }
      }
   };
};