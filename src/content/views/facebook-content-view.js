define([
    'streamhub-sdk/content/views/content-view',
    'hgn!streamhub-sdk/content/templates/facebook',
    'streamhub-sdk/jquery'],
function (ContentView, FacebookContentTemplate, $) {

    /**
     * A view for rendering facebook content into an element.
     * @param opts {Object} The set of options to configure this view with (See ContentView).
     * @exports streamhub-sdk/content/views/facebook-content-view
     * @constructor
     */
    var FacebookContentView = function FacebookContentView (opts) {
        ContentView.call(this, opts);
    };
    
    FacebookContentView.prototype = new ContentView();
    
    FacebookContentView.prototype.elClass += ' content-facebook ';
    FacebookContentView.prototype.template = FacebookContentTemplate;

    /**
     * Gets the template rendering context. By default, returns "this.content".
     * @return {Content} The content object this view was instantiated with.
     */  
    FacebookContentView.prototype.getTemplateContext = function () {
        var context = ContentView.prototype.getTemplateContext.call(this);
        if (context.attachments.length) {
            context.permalink = context.attachments[0].url;
        }
        return context;
    };

    FacebookContentView.prototype.attachHandlers = function () {
        ContentView.prototype.attachHandlers.call(this);

        var self = this;
        this.$el.on('imageError.hub', function(e, oembed) {
            self.attachmentsView.remove(oembed);
            if (!self.attachmentsView.count()) {
                self.$el.removeClass('content-with-image');
            }
        });
    };
    
    return FacebookContentView;
});
