define([
    'streamhub-sdk/content/content',
    'streamhub-sdk/content/types/livefyre-content',
    'streamhub-sdk/content/types/livefyre-twitter-content',
    'streamhub-sdk/content/types/livefyre-facebook-content',
    'streamhub-sdk/content/types/livefyre-instagram-content',
    'streamhub-sdk/content/types/twitter-content',
    'streamhub-sdk/content/views/content-view',
    'streamhub-sdk/content/views/attachment-list-view',
    'streamhub-sdk/content/views/twitter-content-view',
    'streamhub-sdk/content/views/facebook-content-view',
    'streamhub-sdk/content/views/instagram-content-view'
], function(
    Content,
    LivefyreContent,
    LivefyreTwitterContent,
    LivefyreFacebookContent,
    LivefyreInstagramContent,
    TwitterContent,
    ContentView,
    AttachmentListView,
    TwitterContentView,
    FacebookContentView,
    InstagramContentView
) {

    var ContentViewFactory = function() {
        this.contentRegistry = this.contentRegistry.slice(0);
    };

    /**
     * The default registry for Content -> ContentView rendering.
     * Expects entries to always contain a "type" property, and either a view property
     * (the type function itself) or a viewFunction property (a function that returns a
     * type function, useful for conditional view selection.).
     */
    ContentViewFactory.prototype.contentRegistry = [
        { type: LivefyreTwitterContent, view: TwitterContentView },
        { type: LivefyreFacebookContent, view: FacebookContentView },
        { type: LivefyreInstagramContent, view: InstagramContentView },
        { type: TwitterContent, view: TwitterContentView },
        { type: LivefyreContent, view: ContentView },
        { type: Content, view: ContentView }
    ];

    /**
     * Creates a content view from the given piece of content, by looking in this view's
     * content registry for the supplied content type.
     * @param content {Content} A content object to create the corresponding view for.
     * @returns {ContentView} A new content view object for the given piece of content.
     */
    ContentViewFactory.prototype.createContentView = function(content) {
        for (var i=0; i < this.contentRegistry.length; i++) {
            var current = this.contentRegistry[i];
            if (!(content instanceof current.type)) {
                continue;
            }

            var currentType;
            if (current.view) {
                currentType = current.view;
            } else if (current.viewFunction) {
                currentType = current.viewFunction(content);
            }
            var contentView = new currentType({ content : content, attachmentsView: new AttachmentListView() });
            return contentView;
        }
    };

    return ContentViewFactory;
});
