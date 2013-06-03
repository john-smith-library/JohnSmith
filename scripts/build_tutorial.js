var path = require('path');
var fs = require('fs-extra');
var jade = require('jade');
var yaml = require('js-yaml');

function discoverExamplesDirectory(dirPath, topicCollection){
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

            if (fs.existsSync(configFile)){
                var configData = yaml.load(fs.readFileSync(configFile).toString());
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
                }

                if (fs.existsSync(contentFile)){
                    topic.description = fs.readFileSync(contentFile).toString();
                }

                topicCollection.push(topic);
                discoverExamplesDirectory(childPath, topic.children);
            }
        }
    }
}

function generatePages(topics, allTopics){
    for (var i = 0; i < topics.length; i++) {
        var topic = topics[i];
        if (topic.description) {
            var outFile = path.join("out", topic.id + ".html");
            var outJsonFile = path.join(path.join("out", "ajax"), topic.id + ".json");

            fs.writeFileSync(outFile, fn({
                topics: allTopics,
                currentTopic: topic,
                version: version
            }));

            fs.writeFileSync(outJsonFile, JSON.stringify(topic));
        }

        if (topic.children) {
            generatePages(topic.children, allTopics);
        }
    }
}

var version = process.env.VERSION || "DEV";
var fn = jade.compile(fs.readFileSync("scripts/templates/topic.jade"));

if (!fs.existsSync("out")) {
    fs.mkdirSync("out");
}

var examplesBaseDir = "src_examples";
var outputHtmlFile = path.join("out", "index.html");

var assetsSourcePath = path.join(examplesBaseDir, "assets");
var assetsDestPath = path.join("out", "assets");
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

console.log("Building examples html...");

var topics = [];
discoverExamplesDirectory(examplesBaseDir, topics);
generatePages(topics, topics);