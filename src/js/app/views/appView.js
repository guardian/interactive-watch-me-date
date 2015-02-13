define([
    'backbone',
    'mustache',
    'routes',
    'text!templates/appTemplate.html',
    'views/mainVideo',
    'underscore',
    'views/analytics',
], function(
    Backbone,
    Mustache,
    routes,
    template,
    mainVideo,
    _,
    ga
) {
    'use strict';

    return Backbone.View.extend({

        className: 'guInteractive',

        events: {
            'click .episodeBlock.published-yes.inactiveVideo': 'switchVideo'
        },

       
        switchVideo:function(e){
            var clickedCouple = $(e.currentTarget).attr('data-date');

            window.ga('send', {
              'hitType': 'event',          // Required.
              'eventCategory': 'switch video',   // Required.
              'eventAction': 'click',      // Required.
              'eventLabel': clickedCouple
            });

            var foundValue = _.findWhere(this.allEpisodes,{
                'coupleid':clickedCouple
            });

            this.mainEpisode = foundValue;
            this.mainVideo.render(this.mainEpisode);
            var _this = this;
            
            var videoOffset = $('#mainEpisode').offset().top - 40;
            
            $('html,body').animate({
                scrollTop:videoOffset
            },500,function(){
                _this.mainVideo.playVideo();
            });


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
                var foundValue = _.findWhere(this.allEpisodes,{
                    'coupleid':this.queryValue
                });
                if(foundValue){
                    this.mainEpisode = foundValue;
                }
            }

            if(typeof this.mainEpisode === "undefined"){
                this.mainEpisode = _.last(_.where(this.allEpisodes,{'published':'yes'}));
            }
        },

        animateHeader: function(){
            $('<img/>').attr('src', '{{assets}}/imgs/header_off.jpg').load(function() {
                var $header = $('#headerImage img');
                setInterval(function(){
                    var i = 0;
                    var state = {
                        off: "on",
                        on: "off"
                    }
                    function flicker(current){
                        $header.attr('src','{{assets}}/imgs/header_'+ current +'.jpg');
                        if(i<3){
                            i++;
                            setTimeout(function(){
                                 flicker(state[current]);
                             },100*(i/2))
                        }
                    }
                    flicker('off');
                },8000)
            });
        },

        initialize: function() {   
            this.mainVideo = new mainVideo();
            this.collection.on('sync', this.render, this);
        },

        render: function() {
            var _this = this;
            this.months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

            this.allEpisodes = _.map(this.collection.toJSON(),function(episode){
                var day = episode.date.split('/')[0];
                var monthNumber = parseInt(episode.date.split('/')[1]);
                var month = _this.months[monthNumber-1];
                episode.date = day + " " + month;
                return episode;
            });

            this.selectInitialDate();

            // Check if in app or on website
            var isWeb = true;
            if(typeof window.guardian === "undefined"){
                isWeb = true;
            }

            $('#article-body').addClass('interactivePadding');
           
            // Render main template
            this.$el.html(Mustache.render(template, {
                allEpisodes: this.allEpisodes,
                isWeb: isWeb
            }));

            // Render main video
            this.$('#mainVideoContainer').html(this.mainVideo.render(this.mainEpisode).el);
            
            this.animateHeader();
            this.updateActiveVideo();

            return this;
        }
    });
});

