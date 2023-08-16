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

import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;

/**
 * Request wrapper used an Accept-Langauge header was not present in original
 * request.
 * 
 * @author Eugene Zheleznyakov
 */
public class AikauServletRequestWrapper extends HttpServletRequestWrapper
{
    private Map<String, String> headerMap;

    public AikauServletRequestWrapper(HttpServletRequest request)
    {
        super(request);
        headerMap = new HashMap<String, String>(8);
    }

    /**
     * Adds a header to the request
     * 
     * @param name The name of header
     * @param value The value of header
     */
    public void addHeader(String name, String value)
    {
        headerMap.put(name, value);
    }

    /**
     * @see jakarta.servlet.http.HttpServletRequestWrapper${symbol_pound}getHeader(java.lang.String)
     */
    @Override
    public String getHeader(String name)
    {
        String value = headerMap.get(name);
        if (value != null)
        {
            return value;
        }
        else
        {
            return ((HttpServletRequest) getRequest()).getHeader(name);
        }
    }

    /**
     * @see jakarta.servlet.http.HttpServletRequestWrapper${symbol_pound}getHeaders(java.lang.String)
     */
    @SuppressWarnings("rawtypes")
    @Override
    public Enumeration getHeaders(String name)
    {
        String value = headerMap.get(name);
        if (value != null)
        {
            List<String> values = new ArrayList<String>(8);
            values.add(value);
            return Collections.enumeration(values);
        }
        else
        {
            return super.getHeaders(name);
        }
    }

    /**
     * @see jakarta.servlet.http.HttpServletRequestWrapper${symbol_pound}getHeaderNames()
     */
    @Override
    public Enumeration<String> getHeaderNames()
    {
        HttpServletRequest request = (HttpServletRequest) getRequest();

        List<String> list = new ArrayList<String>(16);

        Enumeration<?> e = (Enumeration<?>) request.getHeaderNames();
        while (e.hasMoreElements())
        {
            list.add(e.nextElement().toString());
        }

        for (String key : headerMap.keySet())
        {
            list.add(key);
        }

        return Collections.enumeration(list);
    }
}
