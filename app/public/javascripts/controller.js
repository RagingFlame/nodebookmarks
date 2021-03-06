/*
    @Module: App.Views.Controller - initializes application views
    @Dependencies - jQuery
                  - Backbone
                  - UnderScore
*/
(function (Backbone, models, views, collections, routes, $) {
    "use strict";
    
    views.Controller = Backbone.View.extend({
    
        el: $('#app-body'),
        
        
        router: {},
        
        
        profile: {},
        
        
        activeView: '',
        
        
        bookmarks: {},
        
        
        controls: {},
        
        
        pagination: {},
        
        
        /*
            @Api:           public
            @Constructor:   initializes app views 
        */
        initialize: function () {
            _.bindAll(this, 'loadAccount', 'newBookmarkView', 'filterTags', 'loadBookmarks', 'goTo', 'assign');

            this.$('#profile').hide();

            this.router = new routes.Router();
            
            this.bookmarks = new views.Bookmarks({
                collection: new collections.Bookmarks(this.collection)
            });
            
            this.controls = new views.Controls({
                collection: this.bookmarks.collection
            });
            
            this.pagination = new views.Pagination({
                collection: this.bookmarks.collection
            });
            
            this.profile = new views.Profile(); 
            
            
            views.Controls = this.controls;
            views.Bookmarks = this.bookmarks;
            views.Profile = this.profile;
            views.Pagination = this.pagination;
            collections.Bookmarks = this.bookmarks.collection;

            
            this.bookmarks.collection.pager();
            
            this.assign({
                '#profile': this.profile,
                '#controls': this.controls, 
                '#bookmarks-table': this.bookmarks,
                '#pagination': this.pagination
            });
            
            return this;
        },

        
        /*
            @Api:       public - displays profile page
            @returns:   void
        */
        loadAccount: function () {
            this.$('.home-div, #home, #bookmarks-table').fadeOut(function () {
                this.$('#bookmarks-table').empty();
                this.$('#profile').fadeIn();
                this.activeView = 'profile';
            }.bind(this));
        },
        


        /*
            @Api:       public - resets and displays bookmarks collection
            @Returns:   void
        */        
        loadBookmarks: function () {            
            if (this.activeView === 'profile') {
                $('#profile').fadeOut(function () {
                    $('#home, .home-div').fadeIn();
                    this.pagination.reset();
                    this.controls.render();
                    this.activeView = 'home';
                }.bind(this)); 
                
                return;
            }
            
            $('.home-div').fadeIn();
            this.pagination.reset();
            this.controls.render();
            this.activeView = 'home';
        },
        
        
        
        newBookmarkView: function () {
            var self = this,  model;
            
            $('#pagination').fadeOut(function () {
               model = new models.Bookmark();
                model = model.createUrlRoot('/bookmarks');
            
                self.bookmarks.newBookmark(model);
            });
        },
        


        /*
            @Api:       public - loads and displays a page of bookmarks
            @returns:   void 
            @param:     (Number) num - page number
        */        
        goTo: function (num) {
            this.pagination.gotoPage(num);              
        },
        


        /*
            @Api:       public - filters and displays bookmarks containing a tag
            @Returns:   void 
            @param:     (String) tag - tag to be filtered
        */         
        filterTags: function (tag) {
            this.controls.filterTags(tag);
            this.activeView = 'filteredTags';              
        },
        
        
        assign: function (selector, view) {
            var selectors;
            
            if (_.isObject(selector)) {
                selectors = selector;
            }
            else {
                selectors = {};
                selectors[selector] = view;
            }
            
            if (!selectors) {
                return;
            }
            
            _.each(selectors, function (view, selector) {
                view.setElement(this.$(selector)).render();
            }, this);
        }        
    });
}(Backbone, App.Models, App.Views, App.Collections, App.Routes, jQuery));
