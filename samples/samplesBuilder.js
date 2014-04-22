(function(){
    'use strict';

    var gulp = require('gulp'),
        path = require('path'),
        fs = require('fs-extra'),
        util = require('util'),
        exec = require('gulp-exec'),
        rename = require("gulp-rename"),
        jade = require('jade'),
        yaml = require('js-yaml');

    function discoverExamplesDirectory(dirPath, topicCollection, flatTopics){
        var dirContent = fs.readdirSync(dirPath);
        for (var i = 0; i < dirContent.length; i++){
            var topicId = dirContent[i];

            var childPath = path.join(dirPath, topicId);
            var childStat = fs.lstatSync(childPath);

            if (childStat.isDirectory() && topicId !== "assets" && topicId !== "empty") {
                var title = null;
                var configFile = path.join(childPath, "config.yaml");
                var contentFile = path.join(childPath, "content.html");
                var codeFile = path.join(childPath, "code.js");
                var markupFile = path.join(childPath, "markup.html");
                var stylesFile = path.join(childPath, "styles.css");

                if (fs.existsSync(configFile)){
                    var configData = yaml.load(fs.readFileSync(configFile).toString());

                    if (configData.visible !== false){
                        title = configData.title;

                        var cleanTopicId = topicId.replace(/^\d\d_/, "");

                        console.log(cleanTopicId);

                        var topic = {
                            id: cleanTopicId,
                            title: title,
                            children: [],
                            isNew: configData.isNew || false
                        };

                        if (fs.existsSync(markupFile)){
                            topic.markup = fs.readFileSync(markupFile).toString();
                        }

                        if (fs.existsSync(codeFile)){
                            topic.code = fs.readFileSync(codeFile).toString();
                            topic.formattedCode = formatCode(topic.code, configData);

                        }

                        if (fs.existsSync(contentFile)){
                            topic.description = fs.readFileSync(contentFile).toString();
                        }

                        if (fs.existsSync(stylesFile)){
                            topic.styles = fs.readFileSync(stylesFile).toString();
                        }

                        topicCollection.push(topic);

                        if (topic.code && topic.markup) {
                            flatTopics.push(topic);
                        }

                        discoverExamplesDirectory(childPath, topic.children, flatTopics);
                    }
                }
            }
        }
    }

    function formatCode(code, configData){
        var escapedCode = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');

        var annotationIndex = 0;
        if (!configData.annotations){
            return escapedCode;
        }

        var annotaions = configData.annotations;

        return escapedCode.replace(
            /\/\*\(\*\/(.*)\/\*\)\*\//g,
            function(a, b){
                if (annotaions.length <= annotationIndex) {
                    return b;
                }

                var result = '<span class="codeAnnotation" title="' + annotaions[annotationIndex] + '">' + b + '</span>';
                annotationIndex++;

                return  result;
            }
        );

        //.replace('/*(*/', '<span style="background: red;">')
        //.replace('/*)*/', '</span>');
    }

    function getTopicIndex(topic, topicList){
        for (var i = 0; i < topicList.length; i++) {
            if (topic.id === topicList[i].id) {
                return i;
            }
        }
    }

    function generatePages(topics, allTopics, flatTopics, version, renderer){
        for (var i = 0; i < topics.length; i++) {
            var topic = topics[i];

            var currentTopicGlobalIndex = getTopicIndex(topic, flatTopics);
            var nextTopic = currentTopicGlobalIndex == flatTopics.length - 1 ? null : flatTopics[currentTopicGlobalIndex + 1];
            var prevTopic = currentTopicGlobalIndex == 0 ? null : flatTopics[currentTopicGlobalIndex -1];

            if (topic.description) {
                var outFile = path.join("out", topic.id + ".html");
                var outJsonFile = path.join(path.join("out", "ajax"), topic.id + ".json");

                fs.writeFileSync(outFile, renderer({
                    topics: allTopics,
                    currentTopic: topic,
                    nextTopic: nextTopic,
                    prevTopic: prevTopic,
                    version: version
                }));

                fs.writeFileSync(outJsonFile, JSON.stringify(topic));
            }

            if (topic.children) {
                generatePages(topic.children, allTopics, flatTopics, version, renderer);
            }
        }
    }

    exports.build = function(version){
        var fn = jade.compile(fs.readFileSync("templates/topic.jade"));
        var sitemapTemplate = jade.compile(fs.readFileSync("templates/sitemap.jade"));

        if (!fs.existsSync("out")) {
            fs.mkdirSync("out");
        }

        var examplesBaseDir = "samples";
        var assetsSourcePath = path.join(examplesBaseDir, "assets");
        var assetsDestPath = path.join("out", "assets");
        var outSitemapPath = path.join("out", "sitemap.xml");
        var rootAssets = path.join(assetsDestPath, "root");

        fs.mkdirsSync(path.join("out", "ajax"));

        fs.copy(assetsSourcePath, assetsDestPath, function(err){
            if (!err) {
                if (fs.existsSync(rootAssets)) {
                    var rootAssetsFiles = fs.readdirSync(rootAssets);
                    for (var i = 0; i < rootAssetsFiles.length; i++){
                        var rootAssetFile = path.join(rootAssets, rootAssetsFiles[i]);
                        console.log("Copy " + rootAssetFile + " to out root");
                        fs.createReadStream(rootAssetFile).pipe(fs.createWriteStream(path.join("out", rootAssetsFiles[i])));
                    }
                }
            }
        });

        var topics = [];
        var flatTopics = [];
        discoverExamplesDirectory(examplesBaseDir, topics, flatTopics);
        generatePages(topics, topics, flatTopics, version, fn);

        fs.writeFileSync(outSitemapPath, sitemapTemplate({
            topics: topics,
            version: version
        }));
    };
})();

