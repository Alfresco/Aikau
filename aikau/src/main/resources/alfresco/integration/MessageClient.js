(function (root, factory) {

   if (typeof define === "function" && define.amd)
   {
      define([], factory);
   }
   else
   {
      root.MessageClient = factory();
   }

}(this, function() {

   function MessageClient (otherWindow, origin, channel)
   {
      if (!otherWindow || !origin || !channel)
      {
         throw new Error('MessageClient constructor requires all ("otherWindow", "origin" and "channel") ' +
               'parameters to be set');
      }
      this._otherWindow = otherWindow;
      this._origin = origin;
      this._channel = channel;

      this._callbacks = {};
      this._addEventListener(window, 'message', this._receiveMessage);
   }

   MessageClient.prototype = {

      _CALLBACK_ID_SEQUENCE: 1,

      sendMessage: function (name, value, success, failure)
      {
         //if (window.top && window.top != window) { TODO SAFE TO REMOVE?
            var message = {
               channel: this._channel,
               name: name
            };

            if (typeof value != 'undefined')
            {
               message.value = value;
            }

            if (success || failure)
            {
               var callbackId = this._CALLBACK_ID_SEQUENCE++;
               this._callbacks["" + callbackId] = [success, failure];
               message.callback = callbackId;
            }

            message = JSON.stringify(message);
            //window.top.postMessage(message, this._origin);
            this._otherWindow.postMessage(message, this._origin);
         //}
      },

      _receiveMessage: function(event)
      {
         if (event.origin !== this._origin)
         {
            // origin was wrong
            return;
         }

         var data = JSON.parse(event.data);
         if (data.callback)
         {
            var callback = this._callbacks[data.callback];
            delete this._callbacks[data.callback];
            if (data.success && typeof callback[0] == "function")
            {
               callback[0](data.result);
            }
            else if (data.failure && typeof callback[1] == "function")
            {
               callback[1](data.code, data.message);
            }
         }
      },

      _bind: function(fn)
      {
         var args = Array.prototype.slice.call(arguments).slice(2);
         var me = this;
         return (function()
         {
            return fn.apply(me, args.concat(Array.prototype.slice.call(arguments)));
         });
      },

      _addEventListener: function(el, event, callback)
      {
         if (typeof el.addEventListener == 'function')
         {
            el.addEventListener(event, this._bind(callback), false);
         }
         else
         {
            el.attachEvent('on' + event, this._bind(callback));
         }
      }

   };

   return MessageClient;

}));