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

                var topic = {
                    id: topicId,
                    title: title,
                    children: []
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

var version = process.env.VERSION || "DEV";
var fn = jade.compile(fs.readFileSync("scripts/examples_template.jade"));

if (!fs.existsSync("out")) {
    fs.mkdirSync("out");
}

var examplesBaseDir = "src_examples";
var outputHtmlFile = path.join("out", "index.html");

var assetsSourcePath = path.join(examplesBaseDir, "assets");
var assetsDestPath = path.join("out", "assets");
var rootAssets = path.join(assetsDestPath, "root");

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

var examples = [];
var exampleDirs = fs.readdirSync(examplesBaseDir);
var examplesCount = exampleDirs.length;

console.log(examplesCount + " examples found");

//for (var i = 0; i < examplesCount; i++){
//    var exampleId = exampleDirs[i];
//    var exampleDir = path.join(examplesBaseDir, exampleId);
//    if (exampleId !== "assets" && exampleId !== "empty"){
//        console.log("Building example " + exampleId);
//
//        var title = null;
//        var configFile = path.join(exampleDir, "config.yaml");
//        var contentFile = path.join(exampleDir, "content.html");
//        var codeFile = path.join(exampleDir, "code.js");
//        var markupFile = path.join(exampleDir, "markup.html");
//
//        if (fs.existsSync(configFile)){
//            var configData = yaml.load(fs.readFileSync(configFile).toString());
//            title = configData.title;
//        }
//
//        if (!fs.existsSync(contentFile)){
//            throw new Error("Required file " + contentFile + " not found!");
//        }
//
//        examples.push({
//            id: exampleId,
//            title: title,
//            markup: fs.readFileSync(markupFile).toString(),
//            code: fs.readFileSync(codeFile).toString(),
//            description: fs.readFileSync(contentFile)
//        });
//    }
//}

var topics = [];
discoverExamplesDirectory(examplesBaseDir, topics);

fs.writeFileSync(outputHtmlFile, fn({
    topics: topics,
    version: version
}));
