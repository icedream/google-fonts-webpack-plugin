'use strict';
var _ = require('lodash');
var path = require('path');
var Downloader = require('./lib/downloader');

let googleFontsUrl = "fonts.googleapis.com/css?family=";


function GoogleFontsWebpackPlugin(options) {
    // Default options
    this.options = _.extend({
        fonts: [],
        ssl: true,
        download: false,
        path: __dirname
    }, options);
}

GoogleFontsWebpackPlugin.prototype.apply = function(compiler) {

    // Generate Font URL's
        var fontUrls = this.options.fonts.map(function(font,index){
            let fontName = Object.keys(font)[0];
            let fontOptions = fontName[fontName];

            let fontUrl = (this.options.ssl ? "https://" : "http://") 
                + googleFontsUrl + fontName.replace(' ', '+') + ':' + font[fontName];
            return fontUrl;
        });

    compiler.plugin('compilation', function(compilation) {

        if (this.download) {
            var dl = new Downloader();

            this.options.fonts.map(function(font) {
                dl.requestFonts(font, this.options.path);
            })
        }
        else {

            

            compilation.plugin('html-webpack-plugin-before-html-generation', function(htmlPLuginData, callback) {
                let cssAssets = htmlPLuginData.assets.css;

                // Add fonts to beginning of CSS Assets
                fontUrls.map(function(url) {
                    cssAssets.unshift(url);
                })
                

                callback();
            });
        }
    });
};

module.exports = GoogleFontsWebpackPlugin;
