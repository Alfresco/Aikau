/* global model, Request */
model.data = {
   headers: {
      acceptLanguage: Request.getRequest().getHeader("Accept-Language")
   }
};