model.jsonModel = {
   services: [
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         name: "aikauTesting/CssOverrides"
      },
      {
         name: "alfresco/accessibility/AccessibilityMenu",
         config: {
            id: "AccessibilityMenu",
            titleMsgKey: "access.key.links.message",
            menu: [
               {url: "#accesskey-skip", key: "s", msgKey: "skip.to.content.message"},
               {url: "/share/page/accessibility-help", key: "0", msgKey: "access.keys.message"},
               {url: "/share/page/user/admin/dashboard", key: "1", msgKey: "home.page.message"},
               {url: "/share/page/advsearch", key: "4", msgKey: "search.this.site.message"},
               {url: "/share/page/site-help", key: "6", msgKey: "accessibility.help.message"},
               {url: "/share/page/terms", key: "8", msgKey: "terms.and.conditions.message"},
               {url: "/share", key: "9", msg: "This is just a test message"},
               {url: "#accesskey-foot", key: "b", msgKey: "skip.to.foot.message"}
            ],
            targets: [
               {domid: "AccessibilityMenu", targetid: "accesskey-skip", after: false},
               {domid: "AccessibilityMenu", targetid: "accesskey-foot", after: true}
            ]
         }
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};