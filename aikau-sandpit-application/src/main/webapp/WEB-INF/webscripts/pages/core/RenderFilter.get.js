<import resource="classpath:alfresco/site-webscripts/imports/sandpit.lib.js">

buildPageModel({
   title: "page.title",
   description: "page.description",
   jsdoc: "http://dev.alfresco.com/resource/docs/aikau-jsdoc/CoreWidgetProcessing.html",
   examples: [
      {
         title: "example1.title",
         description: "example1.description",
         model: [
            {
               name: "alfresco/layout/VerticalWidgets",
               config: {
                  currentItem: {
                     x: "a"
                  },
                  widgets: [
                     {
                        name: "alfresco/logo/Logo",
                        config: {
                           renderFilter: [
                              {
                                 property: "x",
                                 values: ["a"]
                              }
                           ]
                        }
                     }
                  ]
               }
            }
         ]
      },
      {
         title: "example2.title",
         description: "example2.description",
         model: [
            {
               name: "alfresco/layout/VerticalWidgets",
               config: {
                  currentItem: {
                     x: ["a"]
                  },
                  widgets: [
                     {
                        name: "alfresco/logo/Logo",
                        config: {
                           renderFilter: [
                              {
                                 property: "x",
                                 contains: ["a"]
                              }
                           ]
                        }
                     }
                  ]
               }
            }
         ]
      },
      {
         title: "example3.title",
         description: "example3.description",
         model: [
            {
               name: "alfresco/layout/VerticalWidgets",
               config: {
                  currentItem: {
                     x: ["a","b","c"]
                  },
                  widgets: [
                     {
                        name: "alfresco/logo/Logo",
                        config: {
                           renderFilter: [
                              {
                                 property: "x",
                                 containsAll: ["a","c"]
                              }
                           ]
                        }
                     }
                  ]
               }
            }
         ]
      },
      {
         title: "example4.title",
         description: "example4.description",
         model: [
            {
               name: "alfresco/layout/VerticalWidgets",
               config: {
                  currentItem: {
                     x: "a",
                     tokens: {
                        t1: "a"
                     }
                  },
                  widgets: [
                     {
                        name: "alfresco/logo/Logo",
                        config: {
                           renderFilter: [
                              {
                                 substituteTokens: true,
                                 property: "x",
                                 values: ["{tokens.t1}"]
                              }
                           ]
                        }
                     }
                  ]
               }
            }
         ]
      },
      {
         title: "example5.title",
         description: "example5.description",
         model: [
            {
               name: "alfresco/layout/VerticalWidgets",
               config: {
                  currentItem: {
                     x: "a",
                     tokens: {
                        t1: "a"
                     }
                  },
                  widgets: [
                     {
                        name: "alfresco/logo/Logo",
                        config: {
                           renderFilter: [
                              {
                                 substituteTokens: true,
                                 property: "x",
                                 values: ["{tokens.t1}"],
                                 negate: true
                              }
                           ]
                        }
                     }
                  ]
               }
            }
         ]
      },
      {
         title: "example6.title",
         description: "example6.description",
         model: [
            {
               name: "alfresco/layout/VerticalWidgets",
               config: {
                  currentItem: {
                     x: "a"
                  },
                  widgets: [
                     {
                        name: "alfresco/logo/Logo",
                        config: {
                           renderFilter: [
                              {
                                 property: "not there",
                                 values: ["who cares"],
                                 renderOnAbsentProperty: true
                              }
                           ]
                        }
                     }
                  ]
               }
            }
         ]
      },
      {
         title: "example7.title",
         description: "example7.description",
         model: [
            {
               name: "alfresco/layout/VerticalWidgets",
               config: {
                  currentItem: {
                     x: "a",
                     y: "b"
                  },
                  widgets: [
                     {
                        name: "alfresco/logo/Logo",
                        config: {
                           renderFilter: [
                              {
                                 property: "x",
                                 values: ["a"]
                              },
                              {
                                 property: "y",
                                 values: ["c"]
                              }
                           ]
                        }
                     }
                  ]
               }
            }
         ]
      },
      {
         title: "example8.title",
         description: "example8.description",
         model: [
            {
               name: "alfresco/layout/VerticalWidgets",
               config: {
                  currentItem: {
                     x: "a",
                     y: "b"
                  },
                  widgets: [
                     {
                        name: "alfresco/logo/Logo",
                        config: {
                           renderFilterMethod: "ANY",
                           renderFilter: [
                              {
                                 property: "x",
                                 values: ["a"]
                              },
                              {
                                 property: "y",
                                 values: ["c"]
                              }
                           ]
                        }
                     }
                  ]
               }
            }
         ]
      },
      {
         title: "example9.title",
         description: "example9.description",
         model: [
            {
               name: "alfresco/layout/VerticalWidgets",
               config: {
                  currentItem: {
                     x: "a",
                     y: "b"
                  },
                  widgets: [
                     {
                        name: "alfresco/logo/Logo",
                        config: {
                           renderFilterMethod: "ANY",
                           renderFilters: [
                              {
                                 renderFilter: [
                                    {
                                       property: "x",
                                       values: ["a"]
                                    }
                                 ]
                              },
                              {
                                 renderFilter: [
                                    {
                                       property: "y",
                                       values: ["c"]
                                    }
                                 ]
                              }
                           ]
                        }
                     }
                  ]
               }
            }
         ]
      },
      {
         title: "example10.title",
         description: "example10.description",
         model: [
            {
               name: "alfresco/layout/VerticalWidgets",
               config: {
                  alternative: {
                     x: "a"
                  },
                  widgets: [
                     {
                        name: "alfresco/logo/Logo",
                        config: {
                           renderFilter: [
                              {
                                 target: "alternative",
                                 property: "x",
                                 values: ["a"]
                              }
                           ]
                        }
                     }
                  ]
               }
            }
         ]
      },
      {
         title: "example11.title",
         description: "example11.description",
         model: [
            {
               name: "alfresco/layout/VerticalWidgets",
               config: {
                  alternative: {
                     x: "a"
                  },
                  widgets: [
                     {
                        name: "alfresco/logo/Logo",
                        config: {
                           renderFilter: [
                              {
                                 target: "window",
                                 property: "innerHeight",
                                 comparator: "greaterThan",
                                 value: 500
                              }
                           ]
                        }
                     }
                  ]
               }
            }
         ]
      }
   ]
});
