define([
    'backbone',
    'mustache',
    'routes',
    'text!templates/appTemplate.html',
    'views/mainVideo',
    'underscore'
], function(
    Backbone,
    Mustache,
    routes,
    template,
    mainVideo,
    _
) {
    'use strict';

    return Backbone.View.extend({

        className: 'guInteractive',

        events: {
            'click .episodeBlock.published-yes.inactiveVideo': 'switchVideo'
        },

       
        switchVideo:function(e){
            var clickedCouple = $(e.currentTarget).attr('data-date');

            var foundValue = _.findWhere(this.collection.toJSON(),{
                'coupleid':clickedCouple
            });

            this.mainEpisode = foundValue;
            this.mainVideo.render(this.mainEpisode);
            
            $('html,body').animate({
                scrollTop:0
            },500);

            this.updateActiveVideo();
        },

        updateActiveVideo: function(){
            var currentDateId = this.mainEpisode.coupleid;
            $('.episodeBlock').removeClass('activeVideo');

            $('.episodeBlock').removeClass('inactiveVideo');
            $('.episodeBlock').addClass('inactiveVideo');
            
            $('.episodeBlock.'+currentDateId).removeClass('inactiveVideo');
            $('.episodeBlock.'+currentDateId).addClass('activeVideo');
        },

        selectInitialDate: function() {
            this.queryValue = "";
            var queryString = document.location.search;
            if(queryString){
                var queryDate = queryString.split('=')[1];
                if(queryDate){
                    this.queryValue = queryDate;
                }
            }

            if(this.queryValue){
                var foundValue = _.findWhere(this.collection.toJSON(),{
                    'coupleid':this.queryValue
                });
                console.log(foundValue);
                if(foundValue){
                    this.mainEpisode = foundValue;
                }
            }

            if(typeof this.mainEpisode === "undefined"){
                this.mainEpisode = _.last(_.where(this.collection.toJSON(),{'published':'yes'}));
            }
            console.log(this.mainEpisode);
        },

        initialize: function() {   
            this.mainVideo = new mainVideo();
            this.collection.on('sync', this.render, this);
        },

        render: function() {
            this.selectInitialDate();
            this.allEpisodes = this.collection.toJSON();
           
            // Render main template
            this.$el.html(Mustache.render(template, {allEpisodes: this.allEpisodes}));

            // Render main video
            this.$('#mainVideoContainer').html(this.mainVideo.render(this.mainEpisode).el);
            
            this.updateActiveVideo();

            return this;
        }
    });
});

