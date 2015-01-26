#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
/*
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
package ${package};

import java.util.Map;

import org.springframework.extensions.surf.FrameworkUtil;
import org.springframework.extensions.surf.exception.PlatformRuntimeException;
import org.springframework.extensions.surf.exception.UserFactoryException;
import org.springframework.extensions.surf.site.AlfrescoUser;

/**
 * <p>This is to all intents and purposes the same as the ${groupId}.web.site.SlingshotUser class that is used by the
 * Alfresco Share application. It has been duplicated because at the time of writing it was not possible to place a
 * dependency on the SlingshotUser class due to the Maven project and publishing. The advantage of duplicating the code
 * however is that it allows freedom of customization.</p>
 * 
 * @author Dave Draper
 * @author Kevin Roast
 */
public class AikauUser extends AlfrescoUser
{
    /**
     * Instantiates a new user.
     * 
     * @param id            The user id
     * @param capabilities  Map of string keyed capabilities given to the user
     * @param immutability  Optional map of property qnames to immutability
     */
    public AikauUser(String id, Map<String, Boolean> capabilities, Map<String, Boolean> immutability)
    {
        super(id, capabilities, immutability);
    }
    
    /**
     * @see ${groupId}.connector.User${symbol_pound}save()
     */
    @Override
    public void save()
    {
        try
        {
            ((AikauUserFactory)FrameworkUtil.getServiceRegistry().getUserFactory()).saveUser(this);
        }
        catch (UserFactoryException err)
        {
            throw new PlatformRuntimeException("Unable to save user details: " + err.getMessage(), err);
        }
    }
}
