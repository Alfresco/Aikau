/*

   IMPORTANT: If you edit this file, please change the name of the parent folder to indicate an
              increment in version in order to ensure that (where multiple instances of Aikau the
              Aikau JAR exist in the web application application) that the LightBoxService will
              load the correct version of this file. See AKU-922 for details.
 */

/*
   Lightbox JS: Fullsize Image Overlays 
   by Lokesh Dhakar - http://www.huddletogether.com

   For more information on this script, visit:
   http://huddletogether.com/projects/lightbox/

   Licensed under the Creative Commons Attribution 2.5 License - http://creativecommons.org/licenses/by/2.5/
   (basically, do anything you want, just leave my name and link)
*/

/**
 * Encapsulate the Lightbox JS functions in a module to avoid polluting the global namespace
 * USAGE: Alfresco.AikauLightbox.show(anchor);
 * Where anchor is either HTMLElement or object with src/href and title properties.
 * See also alfresco/services/LightboxService
 * @author Kevin Roast
 */
if (typeof Alfresco === "undefined") 
{
   var Alfresco = {};
}

Alfresco.AikauLightbox = (function() {

   //
   // Configuration
   //
   
   var loadingImage;
   var closeButton;
   
   
   //
   // getPageScroll()
   // Returns array with x,y page scroll values.
   // Core code from - quirksmode.org
   //
   var getPageScroll = function getPageScroll(){
   
      var yScroll;
   
      if (self.pageYOffset) {
         yScroll = self.pageYOffset;
      } else if (document.documentElement && document.documentElement.scrollTop){    // Explorer 6 Strict
         yScroll = document.documentElement.scrollTop;
      } else if (document.body) {// all other Explorers
         yScroll = document.body.scrollTop;
      }
   
      arrayPageScroll = new Array("",yScroll);
      return arrayPageScroll;
   };
   
   
   //
   // getPageSize()
   // Returns array with page width, height and window width, height
   // Core code from - quirksmode.org
   // Edit for Firefox by pHaez
   //
   var getPageSize = function getPageSize(){
      
      var xScroll, yScroll;
      
      if (window.innerHeight && window.scrollMaxY) {
         xScroll = document.body.scrollWidth;
         yScroll = window.innerHeight + window.scrollMaxY;
      } else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
         xScroll = document.body.scrollWidth;
         yScroll = document.body.scrollHeight;
      } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
         xScroll = document.body.offsetWidth;
         yScroll = document.body.offsetHeight;
      }
      
      var windowWidth, windowHeight;
      if (self.innerHeight) { // all except Explorer
         windowWidth = self.innerWidth;
         windowHeight = self.innerHeight;
      } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
         windowWidth = document.documentElement.clientWidth;
         windowHeight = document.documentElement.clientHeight;
      } else if (document.body) { // other Explorers
         windowWidth = document.body.clientWidth;
         windowHeight = document.body.clientHeight;
      }  
      
      // for small pages with total height less then height of the viewport
      if(yScroll < windowHeight){
         pageHeight = windowHeight;
      } else { 
         pageHeight = yScroll;
      }
   
      // for small pages with total width less then width of the viewport
      if(xScroll < windowWidth){ 
         pageWidth = windowWidth;
      } else {
         pageWidth = xScroll;
      }
      arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight);
      return arrayPageSize;
   };
   
   //
   // getKey(key)
   // Gets keycode. If "Esc" is pressed then it hides the lightbox.
   //
   
   var getKey = function getKey(e){
      if (e == null) { // ie
         keycode = event.keyCode;
      } else { // mozilla
         keycode = e.which;
      }
      
      if (keycode === 27){ hideLightbox(); }
   };
   
   
   //
   // showLightbox()
   // Preloads images. Pleaces new image in lightbox then centers and displays.
   // objLink Object or HTMLElement with "title" and "href"/"url" attributes to be used as box's title and src of image to display.
   //
   var showLightbox = function showLightbox(objLink)
   {
      // prep objects
      var objOverlay = document.getElementById("aikauOverlay");
      var objLightbox = document.getElementById("aikauLightbox");
      var objCaption = document.getElementById("aikauLightboxCaption");
      var objImage = document.getElementById("aikauLightboxImage");
      var objLoadingImage = document.getElementById("aikauLoadingImage");
      var objLightboxDetails = document.getElementById("aikauLightboxDetails");
      
      var arrayPageSize = getPageSize();
      var arrayPageScroll = getPageScroll();
   
      // center loadingImage if it exists
      if (objLoadingImage) {
         objLoadingImage.style.top = (arrayPageScroll[1] + ((arrayPageSize[3] - 35 - objLoadingImage.height) / 2) + "px");
         objLoadingImage.style.left = (((arrayPageSize[0] - 20 - objLoadingImage.width) / 2) + "px");
         objLoadingImage.style.display = "block";
      }
   
      // set height of Overlay to take up whole page and show
      objOverlay.style.height = (arrayPageSize[1] + "px");
      objOverlay.style.display = "block";

      // preload image
      imgPreload = new Image();
      imgPreload.onload = function() {
         objImage.src = objLink.href || objLink.src;
   
         // center lightbox and make sure that the top and left values are not negative
         // and the image placed outside the viewport
         var width = imgPreload.width,
             height = imgPreload.height;
         // re calculate width/height to ensure at least width of image is visible
         if (width > arrayPageSize[0])
         {
            width = arrayPageSize[0];
            height = width / (imgPreload.width / imgPreload.height);
         }
         
         var lightboxTop = arrayPageScroll[1] + ((arrayPageSize[3] - height) / 2);
         var lightboxLeft = ((arrayPageSize[0] - 20 - width) / 2);
         
         objLightbox.style.top = (lightboxTop < 0) ? "0px" : lightboxTop + "px";
         objLightbox.style.left = (lightboxLeft < 0) ? "0px" : lightboxLeft + "px";
   
         objLightbox.style.minWidth = "128px";
         objLightboxDetails.style.minWidth = "128px";
      
         // adjust in
         objLightbox.style.width = width-40 + "px";
         objLightboxDetails.style.width = width-40 + "px";
         objImage.style.width = width-40 + "px";
   
         var title = objLink.title;
         if (!title && objLink.getAttribute)
         {
            // An HTMLELement weas passed in
            title = objLink.getAttribute("title");
         }
         if (title)
         {
            objCaption.style.display = "block";
            //objCaption.style.width = imgPreload.width + "px";
            objCaption.innerHTML = title;
         }
         else
         {
            objCaption.style.display = "none";
         }
   
         if (objLoadingImage)
         {
            objLoadingImage.style.display = "none";
         }
   
         objLightbox.style.display = "block";
   
         // After image is loaded, update the overlay height as the new image might have
         // increased the overall page height.
         arrayPageSize = getPageSize();
         objOverlay.style.height = (arrayPageSize[1] + "px");
         
         // Check for keypress
         if (document.addEventListener)
         {
            document.addEventListener("keyup", getKey, false);
         }
         else
         {
            document.attachEvent("onkeyup", getKey);
         }
   
         return false;
      };
   
      imgPreload.src = objLink.href || objLink.src;
   };
   
   
   //
   // hideLightbox()
   //
   var hideLightbox = function hideLightbox()
   {
      // get objects
      var objOverlay = document.getElementById("aikauOverlay");
      var objLightbox = document.getElementById("aikauLightbox");
   
      // hide lightbox and overlay
      objOverlay.style.display = "none";
      objLightbox.style.display = "none";
   
      // disable keypress listener
      if (document.removeEventListener)
      {
         document.removeEventListener("keyup", getKey);
      }
      else
      {
         document.detachEvent("onkeyup", getKey);
      }
   };
   
   
   //
   // initLightbox()
   // Function runs on window load
   // The function also inserts html markup at the top of the page which will be used as a
   // container for the overlay pattern and the inline image.
   //
   var initLightbox = function initLightbox(config)
   {
      loadingImage = config.loadingImage;
      closeButton = config.closeButton;
      
      var objBody = document.getElementsByTagName("body").item(0);
      
      // create overlay div and hardcode some functional styles (aesthetic styles are in CSS file)
      var objOverlay = document.createElement("div");
      objOverlay.setAttribute("id","aikauOverlay");
      objOverlay.onclick = function () {
         hideLightbox(); return false;
      };
      objOverlay.style.display = "none";
      objOverlay.style.position = "absolute";
      objOverlay.style.top = "0";
      objOverlay.style.left = "0";
      objOverlay.style.zIndex = "90";
      objOverlay.style.width = "100%";
      objBody.insertBefore(objOverlay, objBody.firstChild);
      
      var arrayPageSize = getPageSize();
      var arrayPageScroll = getPageScroll();
   
      // preload and create loader image
      var imgPreloader = new Image();
      
      // if loader image found, create link to hide lightbox and create loadingimage
      imgPreloader.onload = function() {
         
         var objLoadingImageLink = document.createElement("a");
         objLoadingImageLink.setAttribute("href","#");
         objLoadingImageLink.onclick = function() {
            hideLightbox(); return false;
         };
         objOverlay.appendChild(objLoadingImageLink);
         
         var objLoadingImage = document.createElement("img");
         objLoadingImage.src = loadingImage;
         objLoadingImage.setAttribute("id","aikauLoadingImage");
         if (Alfresco && Alfresco.util && typeof Alfresco.util.message === "function")
         {
            objLoadingImage.setAttribute("alt", Alfresco.util.message.call(this, "lightbox.loading"));
         }
         else
         {
            objLoadingImage.setAttribute("alt", "Loading...");
         }
         objLoadingImage.style.position = "absolute";
         objLoadingImage.style.zIndex = "150";
         objLoadingImageLink.appendChild(objLoadingImage);
         
         imgPreloader.onload=function(){};   // clear onLoad, as IE will flip out w/animated gifs
         
         return false;
      };
      
      imgPreloader.src = loadingImage;
   
      // create lightbox div, same note about styles as above
      var objLightbox = document.createElement("div");
      objLightbox.setAttribute("id","aikauLightbox");
      objLightbox.style.display = "none";
      objLightbox.style.position = "absolute";
      objLightbox.style.boxShadow = "9px 9px 9px #222";
      objLightbox.style.zIndex = "100";
      objBody.insertBefore(objLightbox, objOverlay.nextSibling);
      
      // create link
      var objLink = document.createElement("a");
      objLink.setAttribute("href","#");
      objLink.setAttribute("id","aikauLink");
      objLink.onclick = function () {
         hideLightbox();
         return false;
      };
      objLightbox.appendChild(objLink);
      
      // create close button image
      var imgPreloadCloseButton = new Image();
      imgPreloadCloseButton.onload = function() {
         
         var objCloseButton = document.createElement("img");
         objCloseButton.src = closeButton;
         objCloseButton.setAttribute("id","aikauCloseButton");
         if (Alfresco && Alfresco.util && typeof Alfresco.util.message === "function")
         {
            objCloseButton.setAttribute("alt",Alfresco.util.message.call(this, "lightbox.close"));
         }
         else
         {
            objCloseButton.setAttribute("alt", "Close");
         }
         objCloseButton.style.position = "absolute";
         objCloseButton.style.zIndex = "200";
         objCloseButton.style.right = "8px";
         objLink.appendChild(objCloseButton);
         return false;
      };
      imgPreloadCloseButton.src = closeButton;
   
      // create image
      var objImage = document.createElement("img");
      objImage.setAttribute("id","aikauLightboxImage");
      objImage.setAttribute("alt","");
      objLink.appendChild(objImage);
      
      // create details div, a container for the caption and keyboard message
      var objLightboxDetails = document.createElement("div");
      objLightboxDetails.setAttribute("id","aikauLightboxDetails");
      objLightbox.appendChild(objLightboxDetails);
   
      // create caption
      var objCaption = document.createElement("div");
      objCaption.setAttribute("id","aikauLightboxCaption");
      objCaption.style.display = "none";
      objLightboxDetails.appendChild(objCaption);
   };
   
   return {
       init: initLightbox,
       show: showLightbox
   };
})();