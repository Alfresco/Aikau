Previous: [Document Details Page](./Tutorial18.md)

## Tutorial 19 - Accessibility

Whilst developing your Aikau application you should probably give some consideration to how people with disabilities might interact with it. Many of the Aikau widgets are engineered in such a way as to make them functional for individuals using a screen reader. However, the individual widgets are not the end of the story and some well known strategies for producing more accessible applications require a little more effort.

##### What is a Screen Reader
A screen reader is a software application that enables people with severe visual impairments to use a computer. Screen readers work closely with the computer's Operating System to provide information about icons, menus, dialogue boxes, browser content, etc.

### Typical accessibility concerns
Whilst issues of accessibility are usually given more consideration for public information websites, the topics addressed are common with web applications. The features we are going to look at are:

##### Skip to content
Imagine that every time you visited a web page you had to wait for the entire contents of the site menu to be read to you before you were allowed to see the actual content of the page. It would get very tedious, very quickly! It is common to feature a "skip-to-content" link as part of an accessibility menu so that users on screen readers can get straight to the part of the page in which they are interested.

##### Accessibility Menu
Whilst it does not necessarily fall into accessibility standards, it can be really useful for your screen-reader users to be provided with an accessible menu of links to key areas of the application. Such a menu would be hidden from regular users unless given focus, but it can also provide useful access-key links available to everyone.

##### Content semantics
Screen readers can interpret certain markup and present that to the user in a more understandable way. Headings (i.e. `h1`, `h2`, `h3`, etc) for example give structure to a document just like the sections of this tutorial have headings. A screen reader can build a page navigation based upon headings, so we should include some with a sensible structure - it will allow the user to navigate to the part of the page they want, much more quickly.

### Implementing an accessibility menu with a skip link
In [tutorial 3](./Tutorial3.md "Link to tutorial 3") we learned about composite widgets. We created the site-wide Header.js file that we can use to include a complex header throughout all of the WebScripts from which our application is constructed. A header such as this is great for a user on a regular browser, but usually menu components such as this are somewhat disadvantageous for users who have to use a screen reader. Typically a screen reader starts from the beginning of a page and just reads everything. What we really need is a small menu, as pretty much the first item in the flow of the page, that a screen reader will encounter and read out first. If the first item in that menu is ‘skip to the page content’ or something like that then the user can miss all of the menu items that would be read next. For a ‘skip-to-content’ function to work we need two items. The first is the clickable link and the second is a target on the page that the link will jump to. Here is an example of an Aikau `alfresco/accessibility/AccessibilityMenu` which you can drop into the page model as the very first widget item (before the `AlfMenuBar` that is currently at the beginning):

```JAVASCRIPT
{
   name: "alfresco/accessibility/AccessibilityMenu",
   config: {
      titleMsg: "Accessibility Menu",
      menu: [
         {
            url: "#accesskey-skip",
            key: "s",
            msg: "Skip to content"
         }
      ],
      targets: [
         {
            domid: "AccessibilityMenu",
            targetid: "accesskey-skip",
            after: true
         }
      ]
   }
}
```

If you reload the page you’ll not see anything new at all, which is intentional, but try tabbing through the document and you should see the accessibility menu item appear - "Skip to content". Your screen should look something like this:

ADD SCREENSHOT

Let’s go through this configuration and see what’s going on.

The `titleMsg` attribute you see in the configuration is simply a message to a screen reader user to tell them this is an "Accessibility Menu". The menu and targets attributes are arrays of menu items and generated targets respectively.

Menu items are made up of a url, which here is a bookmark rather than a whole url, a key to use as an access-key and finally the msg which is the copy for the link.

Targets, when generated, are invisible anchor (`a`) elements that represent a bookmark target on the page. The domid is the id of another dom element adjacent to which you would like the target to be generated and after indicates whether it should be before (`false` - default) or after (`true`) the selected dom element. The `targetid` is the id that you would like the new target to be generated with.

Let’s make some changes to our model so that this accessibility menu works properly. Suppose we want a screen reader user to be able to skip straight to our list of groups. First we need to be able to target the list so let’s add an id to that widget in the model. Find the `AlfSortablePaginatedList` in the model and add an id of ‘GROUP_LIST’. It should look like this when you’re done. Note that the id is not part of the config: 

```JAVASCRIPT
{
   id: "GROUP_LIST",
   name: "alfresco/lists/AlfSortablePaginatedList",
```

If we now change the AccessibilityMenu code to use the new id we will be automatically generating a target beside the group list and that target can be linked to by the item in our menu. We also want the target to be just before, not just after, so lets change the after attribute too:

```JAVASCRIPT
   targets: [
   {
      domid: "GROUP_LIST",
      targetid: "accesskey-skip",
      after: false
   }
]

If you reload the page there will now be a hidden `a` tag target just before your GROUP_LIST. You may need to simply debug this to confirm its presence - working with a visual browser on screen reader issues can be a little challenging sometimes!

Another useful link we could add to our accessibility menu is a link to the home page. Some government recommendations suggest that this should be available on the accesskey `1`. Add the following link to the menu:

```JAVASCRIPT
menu: [
   {
      url: "#accesskey-skip",
      key: "s",
      msg: "Skip to content"
   },
   {
      url: "home",
      key: "1",
      msg: "Home page"
   }
],
```

Now when we reload and tab through the document we will see two different accessibility menu items appear - first the "Skip to content" and newly "Home". You can hit the enter key when either is shown and you will follow the configured link either to the content bookmark or the home page. If you know how to use access keys on your particular browser then you should also find that keys `s` and `1` will take you to the respective locations. Note that there are more robust ways to link to the home page than with a link whose url is just ‘home’!

##### Working on Accessibility
Many of the changes we are making to support better accessibility are invisible in a regular browser. That’s a real nuisance for a developer who has no visual impairments. If you need to make more than just a simple adjustment to some widgets you might find some additional tooling useful. The WAVE toolbar for Firefox is good for finding potential accessibility holes and for gathering an impression of how a screen reader might see your page. It’s also free! [LINK: https://wave.webaim.org/toolbar/]

### Adding in some semantic elements
In the example we have just gone through we added an id to an existing widget on the screen so that we could place a target beside it for an accessibility menu link. Another approach we could have used would have been to add in some semantic elements and target those. The additional benefit of this approach is that the screen reader user also benefits from the structure that those elements introduce.

If we look over our page we have two key items - a menu and a table of group data. We might have additional items such as a facet menu or a footer - who knows. We can add some hidden heading widgets that decorate the page with information that a screen reader will use. Whilst there is no reason these headings should not be part of the design, they need not interfere with our layout so a user without visual impairment will not be inconvenienced.

Let’s add two hidden headings to the model. Add the following heading just before the `AlfMenuBar`:

```JAVASCRIPT
{
   name: "alfresco/html/Heading",
   config: {
      level: 2,
      label: "Menu",
      isHidden: true
   }
},
```

And this heading just before the GROUP_LIST:

```JAVASCRIPT
{
   name: "alfresco/html/Heading",
   config: {
      level: 2,
      label: "Group List",
      isHidden: true
   }
},
```

##### WAVE toolbar
If you’ve started using the WAVE toolbar for Firefox which was described previously, then you should be able to use that to see the new headings:

1. Open the current page in Firefox (login if required to do so)
2. Click the Text-only button on the WAVE toolbar
3. Click the Reset Page button on the WAVE toolbar
4. Click the Outline button on the WAVE toolbar

After clicking the Text-only button you will see the following and you should observe the components of the AccessibilityMenu, the "Menu" heading and the "Group List" heading:

ADD SCREENSHOT

When you have clicked the Outline button you will see the following:

ADD SCREENSHOT

This view gives an indication of the structural elements that might be seen by a screen reader and you should observe the two headings you have added here too.

There is further help available for the WAVE toolbar [here](http://wave.webaim.org/help "Link to Wave website").

Both of these headings are configured the same but for their label. They each create a level 2 heading (`h2`) and both are hidden (`isHidden: true`). You might like to try setting the `isHidden` configuration attribute to `false` and then you’ll be able to see them on the page when you refresh. The key thing to understand is that whether hidden or not, they are providing information that the screen reader can see. If the user requests the page structure they will be told that there is a "Menu" and a "Group List". If you have complex pages in your application, building up a suitably nested set of headings is a really powerful way to convey useful navigational information to a screen reader user.

If you’re interested to experiment more at this point, why don’t you:

1. Add an id to the second heading you just created
2. Drop the id from the `AlfSortablePaginatedList`
3. Drop the one target item from the `AccessibilityMenu`
4. Update the "Skip to content" link to target the id you just added to the heading

Now you have some semantic headings, one of which you’re using as a target for the accessibility menu. 

### More semantic elements
HTML 5 introduced some [new semantic tags](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/HTML5_element_list "Link to Mozilla Developer Network documentation"), including tags for wrapping content into semantically meaningful sections. Many of the screen reader applications use them to differentiate content which means that you can indicate to a screen reader what the content in question actually is. If you have a tree of navigational widgets for example, why not wrap their output in a `<nav>` tag, or similarly the page footer in a `<footer>` tag.

Aikau has a mixin available that allows output content to be automatically wrapped in a semantic container `alfresco/accessibility/_SemanticWrapperMixin`. At the time of writing this mixin is only being offered within `alfresco/footer/AlfShareFooter` and `alfresco/layout/LeftAndRight`, but there is no reason it will not be used further.

We have neither of the aforementioned widgets in our model at the moment so for the sake of an example we are going to add a footer which you may delete when we’ve finished this exercise, should you so wish. Add an `AlfShareFooter` as the last widget in the model like this:

```JAVASCRIPT
{
   name: "alfresco/footer/AlfShareFooter"
}
```

If you save and reload you’ll see a typical footer shown across the bottom of the page. If you investigate the structure of the footer using your favourite developer tools you’ll see that it is made up of a cluster of divs, spans and so on. A screen reader will see the output of this widget as just content in the natural flow of the page.

Now let’s modify this widget a little as follows:

```JAVASCRIPT
{
   name: "alfresco/footer/AlfShareFooter",
   config: {
      semanticWrapper: "footer"
   }
}
```

This change is triggering the AlfShareFooter to use a method in the mixin which generates a `<footer>` tag around the widget content. If you reload and look again with your developer tools you’ll find the footer content is now wrapped with a `<footer>` tag that a screen reader will interpret correctly. You can now remove the footer if you wish.


Previous: [Document Details Page](./Tutorial18.md)
