define([
    'backbone',
    'collections/sheetCollection',
    'views/appView',
    'iframeMessenger'
], function(
    Backbone,
    SheetCollection,
    AppView,
    iframeMessenger
) {
   'use strict';

    var appView;
    
    // Your proxied Google spreadsheet goes here
    var key = '1c-893TLDBgjQrHPBW3ezFHldj94KCCWKsIARD_HAAGM';

    function init(el, context, config, mediator) {
        // from live external data
        var dateCollection = new SheetCollection({
            key: key,
            sheetname: 'Sheet1'
        });
       
        // Create an app view, passing along the collection made above
        appView = new AppView({
            el: el,
            collection: dateCollection
        });
        
        // Fetch data
        dateCollection.fetch();

        // Start listening to URL #paths
        Backbone.history.start();
        
        // Enable iframe resizing on the GU site
        iframeMessenger.enableAutoResize();
    }
    
    return {
        init: init
    };
});
