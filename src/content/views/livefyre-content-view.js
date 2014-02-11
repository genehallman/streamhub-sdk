define([
    'streamhub-sdk/jquery',
    'streamhub-sdk/auth',
    'streamhub-sdk/content/views/content-view',
    'streamhub-sdk/content/types/livefyre-content',
    'streamhub-sdk/content/types/livefyre-opine',
    'streamhub-sdk/ui/button/hub-button',
    'streamhub-sdk/ui/button/hub-toggle-button',
    'streamhub-sdk/collection/liker',
    'hgn!streamhub-sdk/content/templates/content',
    'streamhub-sdk/util',
    'inherits',
    'streamhub-sdk/debug'
], function ($, Auth, ContentView, LivefyreContent, LivefyreOpine, HubButton, HubToggleButton, Liker, ContentTemplate, util, inherits, debug) {
    'use strict';

    var log = debug('streamhub-sdk/content/views/livefyre-content-view');
    var LIKE_REQUEST_LISTENER = false;

    /**
     * Defines the base class for all content-views. Handles updates to attachments
     * and loading of images.
     *
     * @param opts {Object} The set of options to configure this view with.
     * @param opts.content {Content} The content object to use when rendering. 
     * @param opts.el {?HTMLElement} The element to render this object in.
     * @fires LivefyreContentView#removeContentView.hub
     * @exports streamhub-sdk/content/views/content-view
     * @constructor
     */
    var LivefyreContentView = function LivefyreContentView (opts) {
        opts = opts || {};

        this._controls = {
            'left': [],
            'right': []
        };
        this._rendered = false;

        ContentView.call(this, opts)

        if (this.content) {
            this.content.on("opine", function(content) {
                this._renderButtons();
            }.bind(this));
            this.content.on("removeOpine", function(content) {
                this._renderButtons();
            }.bind(this));
        };
    };
    inherits(LivefyreContentView, ContentView);

    LivefyreContentView.prototype.footerLeftSelector = '.content-footer-left > .content-control-list';
    LivefyreContentView.prototype.footerRightSelector = '.content-footer-right > .content-control-list';

    /**
     * Render the content inside of the LivefyreContentView's element.
     * @returns {LivefyreContentView}
     */
    LivefyreContentView.prototype.render = function () {
        ContentView.prototype.render.call(this);
        this._renderButtons();

        return this;
    };

    LivefyreContentView.prototype._handleLikeClick = function () {
        // Lazily attach event handler for contentLike
        if (! LIKE_REQUEST_LISTENER) {
                var liker = new Liker();
                var userUri = Auth.getUserUri();

                if (! content.isLiked(userUri)) {
                    liker.like(content);
                } else {
                    liker.unlike(content);
                }
                self._renderButtons();
            });
            LIKE_REQUEST_LISTENER = true;
        }

        this.$el.find(this.footerLeftSelector).empty();
        this.$el.find(this.footerRightSelector).empty();

        this._renderLikeButton();
        this._renderShareButton();
    };

    LivefyreContentView.prototype._handleShare = function () {
        console.log('contentShare.hub');
        this.$el.trigger('contentShare.hub', this.content);
    };

    LivefyreContentView.prototype._renderButtons = function () {
        this.$el.find(this.footerLeftSelector).empty();

        if (! (this.content instanceof LivefyreContent)) {
            return;
        }
        var likeCount = this.content.getLikeCount();
        var likeButton = new HubToggleButton(this._handleLikeClick.bind(this), {
            className: 'hub-content-like',
            on: this.content.isLiked(Auth.getUserUri()), //TODO(ryanc): Get user id from auth
            label: likeCount
        });
        this.addButton(likeButton);

        //TODO(ryanc): Wait until we have replies on SDK
        //var replyCommand = new Command(function () {
        //    self.$el.trigger('contentReply.hub');
        //});
        //var replyButton = new HubButton(replyCommand, {
        //    className: 'hub-btn-link hub-content-reply',
        //    label: 'Reply'
        //});
        //this.addButton(replyButton);

            //TODO(ryanc): Wait until we have likes finished first
            //var shareButton = new HubButton(this._handleShare.bind(this), {
            //    className: 'hub-btn-link hub-content-share',
            //    label: 'Share'
            //});
            //this.addButton(shareButton);
        } else {
            for (var i=0; i < this._controls['left'].length; i++) {
                this.addButton(this._controls['left'][i]);
            }
    /**
     * Render a Share Button
     * @protected
     */
    LivefyreContentView.prototype._renderShareButton = function () {
        var shareButton = this._createShareButton();
        if ( ! shareButton) {
            return;
        } else {
            for (var i=0; i < this._controls['left'].length; i++) {
                this.addButton(this._controls['left'][i]);
            }
        //TODO(ryanc): Wait until we have likes finished first
        //var shareButton = new HubButton(this._handleShare.bind(this), {
        //    className: 'hub-btn-link hub-content-share',
        //    label: 'Share'
        //});
        //this.addButton(shareButton);
    };

    LivefyreContentView.prototype.addButton = function (button) {
        this._controls['left'].push(button);
    LivefyreContentView.prototype.addButton = function (button, opts) {
        opts = opts || {};
        var footerControls;
        var footerSide;
        if (opts.side === 'right') {
            footerControls = this._controls.right;
            footerSide = this.$el.find(this.footerRightSelector);
        } else {
            footerControls = this._controls.left;
            footerSide = this.$el.find(this.footerLeftSelector);
    LivefyreContentView.prototype.addButton = function (button) {
        for (var i=0; i < this._controls['left'].length; i++) {
            if (this._controls['left'][i] != button) {
                this._controls['left'].push(button);
            }
        }

        if (footerControls.length === 0) {
            footerControls.push(button);
        }
        footerControls.push(button);
        var buttonContainerEl = $('<div></div>');
        footerSide.append(buttonContainerEl);

        button.setElement(buttonContainerEl);
        button.render();

        // If the footer is rendered, then re-render all buttons.
        // If buttons are added before the ContentView is, then we shouldn't
        // render buttons
        if (footerSide.length) {
            this._renderButtons();
        }
    };

    /**
     * Remove a Button from the ContentView
     * @param button {Button} Button to remove
     */
    LivefyreContentView.prototype.removeButton = function (button) {
        button.destroy();
    };
    
    return LivefyreContentView;
});
