package org.alfresco.aikau;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.extensions.webscripts.DeclarativeWebScript;
import org.springframework.extensions.webscripts.Path;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScript;
import org.springframework.extensions.webscripts.WebScriptRequest;

/**
 * A Java controller for a WebScript that retrieves the details of the Aikau unit test
 * WebScript pages.
 */
public class UnitTestList extends DeclarativeWebScript
{
   @Override
   protected Map<String, Object> executeImpl(WebScriptRequest req, Status status)
   {
      Path path = getContainer().getRegistry().getFamily("/aikau-unit-tests");

      int ps = 25;
      String pageSize = req.getParameter("pageSize");
      if (pageSize != null)
      {
         try
         {
             ps = Integer.parseInt(pageSize, 10);
         }
         catch (NumberFormatException e)
         {
             // No action required
         }
      }
      int si = 0;
      String page = req.getParameter("page");
      if (page != null)
      {
         try
         {
             int p = Integer.parseInt(page, 10);
             si = (p - 1) * ps;
         }
         catch (NumberFormatException e)
         {
             // No action required
         }
      }
      
      
        
      List<WebScript> webscripts = Arrays.asList(path.getScripts());
      Collections.sort(webscripts, new UnitTestList.WebScriptComparator());
      
      List<WebScript> filteredWebscripts = new ArrayList<WebScript>();
      String filter = req.getParameter("filter");
      if (filter != null)
      {
          for (WebScript ws: webscripts)
          {
              if (ws.getDescription().getShortName().toLowerCase().indexOf(filter.toLowerCase()) != -1)
              {
                  filteredWebscripts.add(ws);
              }
          }
      }
      else
      {
          filteredWebscripts.addAll(webscripts);
      }
      
      WebScript[] webscriptsArr = new WebScript[filteredWebscripts.size()];
      filteredWebscripts.toArray(webscriptsArr);
      webscriptsArr = Arrays.copyOfRange(webscriptsArr, si, ps + si);
      Map<String, Object> model = new HashMap<String, Object>(7, 1.0f);
      model.put("scripts", webscriptsArr);
      model.put("totalRecords", filteredWebscripts.size());
      model.put("startIndex", si);
      return model;
   }

   private class WebScriptComparator implements Comparator<WebScript>
   {
      public int compare(WebScript ws1, WebScript ws2)
      {
         int r = 0;
         if (ws1 == null && ws2 == null)
         {
            r = 0;
         }
         else if (ws1 != null && ws2 == null)
         {
            r = -1;
         }
         else if (ws1 == null && ws2 != null)
         {
            r = 1;
         }
         else
         {
            r = ws1.getDescription().getShortName().compareTo(ws2.getDescription().getShortName());
         }
         return r;
      }
   }
}
