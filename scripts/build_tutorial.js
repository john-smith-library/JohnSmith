var path = require('path');
var fs = require('fs-extra');
var jade = require('jade');
var yaml = require('js-yaml');

var fn = jade.compile(fs.readFileSync("scripts/examples_template.jade"));

if (!fs.existsSync("out")) {
    fs.mkdirSync("out");
}

var examplesBaseDir = "src_examples";
var outputHtmlFile = path.join("out", "examples.html");

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

            //fs.removeSync(rootAssets);
        }


    }
});

console.log("Building examples html...");

var examples = [];
var exampleDirs = fs.readdirSync(examplesBaseDir);
var examplesCount = exampleDirs.length;

console.log(examplesCount + " examples found");

for (var i = 0; i < examplesCount; i++){
    var exampleId = exampleDirs[i];
    var exampleDir = path.join(examplesBaseDir, exampleId);
    if (exampleId !== "assets" && exampleId !== "empty"){
        console.log("Building example " + exampleId);

        var title = null;
        var configFile = path.join(exampleDir, "config.yaml");
        var contentFile = path.join(exampleDir, "content.html");
        var codeFile = path.join(exampleDir, "code.js");
        var markupFile = path.join(exampleDir, "markup.html");

        if (fs.existsSync(configFile)){
            var configData = yaml.load(fs.readFileSync(configFile).toString());
            title = configData.title;
        }

        if (!fs.existsSync(contentFile)){
            throw new Error("Required file " + contentFile + " not found!");
        }

        examples.push({
            id: exampleId,
            title: title,
            markup: fs.readFileSync(markupFile).toString(),
            code: fs.readFileSync(codeFile).toString(),
            description: fs.readFileSync(contentFile)
        });
    }
}

fs.writeFileSync(outputHtmlFile, fn({ examples: examples }));
console.log(process.env.TRAVIS_BUILD_NUMBER);