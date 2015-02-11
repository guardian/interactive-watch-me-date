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
            'click #mainEpisodeVideo': 'startVideo'
        },

        startVideo:function(){
            $('#mainEpisode').addClass('videoPlaying');
        },

        render: function(templateData){
            this.$el.html(Mustache.render(template, {mainEpisode: templateData}));
            return this;
        }


    });
});