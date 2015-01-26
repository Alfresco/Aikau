(function (root, factory)
{
   if (typeof define === "function" && define.amd)
   {
      define([], factory);
   }
   else
   {
      root.MessageServer = factory();
   }
}(this, function()
{
   var CHANNELS = {};

   function MessageServer(origins, channel, messageHandlerResolver)
   {
      if (!origins || !channel)
      {
         throw new Error('MessageServer constructor requires all ("origins" and "channel") ' +
               'parameters to be set');
      }

      if (CHANNELS[channel])
      {
         throw new Error('Cannot construct MessageServer since channel "' + channel + '"already is in use');
      }

      CHANNELS[channel] = true;

      this._origins = origins || [];
      this._channel = channel;
      this._messageHandlerResolver = messageHandlerResolver || this._messageHandlerResolver;

      this._addEventListener(window, 'message', this._receiveMessage);
   }

   MessageServer.prototype = {

      /**
       * Default implementation that will look for methods in the prototype chain
       * assuming this class has been extended.
       *
       * Note! Could be overridden using the 'messageHandlerResolver' constructor argument.
       *
       * @param name {string} The name of the function to invoke
       * @return Function|null
       * @private
       */
      _messageHandlerResolver: function(name)
      {
         return this[name];
      },

      _receiveMessage: function(event)
      {
         // Do we trust the sender of this message?
         var allowed = false;
         for (var i = 0, il = this._origins.length; i < il; i++)
         {
            if (event.origin == this._origins[i])
            {
               allowed = true;
               break;
            }
         }

         if (allowed)
         {
            // event.source
            var data = JSON.parse(event.data);
            if (data.name && data.channel == this._channel)
            {
               var name = data.name;
               var fn = this._messageHandlerResolver(name);
               if (typeof fn == 'function')
               {
                  fn(data.value, function(result){
                     var message = {
                        callback: data.callback,
                        success: true,
                        result: result
                     };
                     message = JSON.stringify(message);
                     event.source.postMessage(message, event.origin);
                  }, function(code, message){
                     var message = {
                        callback: data.callback,
                        failure: true,
                        code: code,
                        message: message
                     };
                     message = JSON.stringify(message);
                     event.source.postMessage(message, event.origin);
                  });
               }
               else
               {
                  // The message was not recognized
                  var message = {
                     callback: data.callback,
                     failure: true,
                     code: 1,
                     message: 'Message named "' + name + '" was not recognized.'
                  };
                  message = JSON.stringify(message);
                  event.source.postMessage(message, event.origin);
               }
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

   return MessageServer;
}));