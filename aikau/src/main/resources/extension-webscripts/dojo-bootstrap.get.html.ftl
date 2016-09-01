<@markup id="systemjs" target="setDojoConfig" action="before">
   <!-- NOTE: Using CDN resources whilst this extension is in the prototype phase -->
   <script src="https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.35.0/es6-shim.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/0.19.26/system-polyfills.js"></script>
   <script src="https://unpkg.com/angular2@2.0.0-beta.16/es6/dev/src/testing/shims_for_IE.js"></script>
    
   <script src="https://code.angularjs.org/2.0.0-beta.16/angular2-polyfills.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/0.19.26/system.js"></script>
   <script src="https://unpkg.com/typescript@1.8.10/lib/typescript.js"></script>
   <script src="https://code.angularjs.org/2.0.0-beta.16/Rx.js"></script>
   <script src="https://code.angularjs.org/2.0.0-beta.16/angular2.dev.js"></script>
   <script>
      System.config({
        transpiler: 'typescript', 
        typescriptOptions: { emitDecoratorMetadata: true }
      });
   </script>
</@markup>