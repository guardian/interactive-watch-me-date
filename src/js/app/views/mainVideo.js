define([
    'backbone',
    'mustache',
    'text!templates/mainVideo.html',
    'underscore'
], function(
    Backbone,
    Mustache,
    template,
    _
) {
    'use strict';

    return Backbone.View.extend({
        events: {
            'click #mainEpisodeVideo': 'playVideo',
            'click #shareButtons button': 'shareVideo'
        },

        shareVideo:function(e){
            var twitterBaseUrl = "https://twitter.com/home?status=";
            var facebookBaseUrl = "https://www.facebook.com/dialog/feed?display=popup&app_id=741666719251986&link=";
            var sharemessage = this.mainVideo.couple + " were both given Google Glass and sent on a date. What happens next? #WatchMeDate ";
            var network = $(e.currentTarget).attr('data-source'); //make sure to add the network (pinterest,twitter,etc) as a classname to the target
            var shareWindow = "";
            var queryString = "?date="+this.mainVideo.coupleid;
            var coupleImage = "{{assets}}/imgs/dates/" + this.mainVideo.coupleid + '_1260.jpg';
            var guardianUrl = "http://www.theguardian.com/lifeandstyle/ng-interactive/2015/feb/12/watch-me-date" + queryString;
            

            if(network === "twitter"){
                shareWindow = 
                    twitterBaseUrl + 
                    encodeURIComponent(sharemessage) + 
                    "%20" + 
                    encodeURIComponent(guardianUrl)
                
            }else if(network === "facebook"){
                shareWindow = 
                    facebookBaseUrl + 
                    encodeURIComponent(guardianUrl) + 
                    "&picture=" + 
                    encodeURIComponent(coupleImage) + 
                    "&redirect_uri=http://www.theguardian.com";
            }else if(network === "pinterest"){
                shareWindow = 
                    pinterestBaseUrl + 
                    encodeURIComponent(guardianUrl) + 
                    "&media=" + 
                    encodeURIComponent(gifUrl) + 
                    "&description=" + 
                    encodeURIComponent(sharemessage);
            }else if(network === "tumblr"){
                shareWindow = 
                    tumblrBaseUrl + 
                    encodeURIComponent(guardianUrl) + 
                    '&description=' + 
                    encodeURIComponent(imageHTML)
            }  
            window.open(shareWindow, network + "share", "width=640,height=320");
        },

        playVideo:function(e){
            $('#mainEpisode #videoContainer').html('<iframe src="http://embed.theguardian.com/embed/video/' + this.mainVideo.embedpath + '#autoplay" scrolling="no" frameborder="none" width="100%" height="100%"></iframe>');
            $('#mainEpisode #backgroundImage').fadeOut(500,function(){
               $('#mainEpisode').addClass('videoPlaying');
            });
            var coupleGa = this.mainVideo.coupleid;
             window.ga('send', {
              'hitType': 'event',          // Required.
              'eventCategory': 'play video',   // Required.
              'eventAction': 'play',      // Required.
              'eventLabel': coupleGa
            });
        },

        render: function(templateData){
            this.mainVideo = templateData;
            this.$el.html(Mustache.render(template, {mainEpisode: templateData}));
            return this;
        }


    });
});