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
 * Grunt aliases for the vagrant command.
 */

module.exports = function (grunt, alf) {

   // Bring up an instance of vagrant
   grunt.registerTask('vup', [
      'shell:vagrantUp',
      'shell:vagrantProvision'
   ]);

   // Provision an instance of vagrant
   grunt.registerTask('vpro', [
      'shell:vagrantProvision'
   ]);

   // Take down an instance of vagrant
   grunt.registerTask('vdown', [
      'shell:vagrantHalt'
   ]);

   // Rebuild a vagrant instance.
   grunt.registerTask('vclean', [
      'shell:vagrantDestroy',
      'shell:vagrantUp',
      'shell:vagrantProvision'
   ]);
}