// JAKE build file

/*
* Modules references */
var path = require('path');
var fs = require('fs-extra');
var jade = require('jade');
var yaml = require('js-yaml');

/*
* Global constants  */
var srcDir = "src";
var minFileName = path.join("out", "john-smith.min.js");
var jsTestDriverJarPath = process.env.JS_TEST_DRIVER;
var version = process.env.VERSION || "0.0.0.0";

/*
* Build options */
var buildOptions = {
    isDebug: true,
    outFileName: path.join("out", "john-smith.debug.js")
};

/** Return path to a resource in TempTools directory */
function getTempPath(filePath){
    return path.join(process.env.TEMP_TOOLS, filePath);
}

/* ================================================================================================================== */
desc("Builds using global options");
task("build", { async: true }, function(){
    var readSrcDir = function(dirPath, allFiles, isDebug){
        var dirContent = fs.readdirSync(dirPath);
        for (var i = 0; i < dirContent.length; i++){
            var childPath = path.join(dirPath, dirContent[i]);
            var childStat = fs.lstatSync(childPath);

            if (childStat.isDirectory()) {
                readSrcDir(childPath, allFiles, isDebug);
            } else if (childStat.isFile() && path.extname(childPath) === ".ts") {
                var needToSkip = (!isDebug) && childPath.toLowerCase().indexOf("debug") !== -1;
                if (!needToSkip) {
                    allFiles.push(childPath);
                }
            }
        }
    };

    var allSrcFiles = [];
    readSrcDir(srcDir, allSrcFiles, buildOptions.isDebug);
    console.log("  list of source files: ");

    for (var i = 0; i < allSrcFiles.length; i++) {
        console.log("    " + allSrcFiles[i]);
    }

    var buildCmd = "tsc --out " + buildOptions.outFileName;
    if (!buildOptions.isDebug){
        buildCmd += " --removeComments";
    }

    buildCmd += " " + allSrcFiles.join(" ");

    console.log("Running typescript compiler...");
    console.log(" command line is " + buildCmd);

    jake.exec([buildCmd], function () {
        complete();
    }, { printStdout: true, printStderr: true });
});

/* ================================================================================================================== */
desc("Builds debug version");
task("buildDebug", function(){
    buildOptions.isDebug = true;
    buildOptions.outFileName = path.join("out", "john-smith.debug.js");
    jake.Task["build"].reenable();
    jake.Task["build"].invoke();
});

/* ================================================================================================================== */
desc("Builds release version");
task("buildRelease", function(){
    buildOptions.isDebug = false;
    buildOptions.outFileName = path.join("out", "john-smith.js");
    jake.Task["build"].reenable();
    jake.Task["build"].invoke();
});

/* ================================================================================================================== */
desc("Builds min version");
task("buildMin", ["buildRelease"], function(){
    jake.exec(
        "ccjs " + buildOptions.outFileName + " > " + minFileName + "  --language_in=ECMASCRIPT5_STRICT",
        function(){
            complete();
        }, { printStdout: true, printStderr: true });
}, { async: true });

/* ================================================================================================================== */
desc("Build full");
task("buildFull", ["buildDebug", "buildMin"]);

/* ================================================================================================================== */
desc("Runs unit and system tests");
task("test", ["buildDebug"], function(){
    jake.exec(
        "java -jar " + jsTestDriverJarPath + " --config test/config.jstd --tests all --server http://localhost:9876 --testOutput out",
        function(){
            complete();
        },
        { printStdout: true, printStderr: true });
}, { async: true });

/* ================================================================================================================== */
desc("Creates versioned copies of artifacts files");
task("copyVersioned", ["buildFull"], function(){
    jake.cpR("out/john-smith.debug.js", "out/john-smith-" + version + ".debug.js");
    jake.cpR("out/john-smith.js", "out/john-smith-" + version + ".js");
    jake.cpR("out/john-smith.min.js", "out/john-smith-" + version + ".min.js");
});

/* ================================================================================================================== */
desc("Builds and publishes artifacts");
task("buildAndPublish", ["buildFull", "buildTutorial", "test", "copyVersioned", "packNuGet"]);

/* ================================================================================================================== */
desc("Packs NuGet package");
task("packNuGet", ["buildFull"], function(){
    jake.cpR(".build/Microsoft.Build.dll", getTempPath("Microsoft.Build.dll"));
    jake.cpR("out/john-smith.debug.js", getTempPath("john-smith.debug.js"));
    jake.cpR("out/john-smith.min.js", getTempPath("john-smith.min.js"));

    var renderSpec = jade.compile(fs.readFileSync("scripts/templates/nuspec.jade"));
    var renderedSpec = renderSpec({
        version: version
    });

    fs.writeFileSync(
        path.join(process.env.TEMP_TOOLS, "JohnSmith.nuspec"),
        renderedSpec);

    var nugetApiKey = process.env.NUGET_API_KEY;
    var relativePathToSpec = path.join(path.relative(process.cwd(), process.env.TEMP_TOOLS), "JohnSmith." + version + ".nupkg");
    jake.exec(
        ["mono --runtime=v4.0 " + process.env.NUGET + " pack " + getTempPath("JohnSmith.nuspec") + " -OutputDirectory " + process.env.TEMP_TOOLS,
         "mono --runtime=v4.0 " + process.env.NUGET + " push " + relativePathToSpec + " " + nugetApiKey + " -NonInteractive -Verbosity Detailed"],
        function() {
            complete();
        },
        { printStdout: true, printStderr: true });
}, { async: true });

/* ================================================================================================================== */
desc("Builds tutorial");
task("buildTutorial", ["buildFull"], function(){
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
    var sitemapTemplate = jade.compile(fs.readFileSync("scripts/templates/sitemap.jade"));

    if (!fs.existsSync("out")) {
        fs.mkdirSync("out");
    }

    var examplesBaseDir = "src_examples";
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
    discoverExamplesDirectory(examplesBaseDir, topics);
    generatePages(topics, topics);

    fs.writeFileSync(outSitemapPath, sitemapTemplate({
        topics: topics,
        version: version
    }));
});

console.log("");

console.log("========================================================== ");
console.log("       _       _              _____           _ _   _      ");
console.log("      | |     | |            / ____|         (_) | | |     ");
console.log("      | | ___ | |__  _ __   | (___  _ __ ___  _| |_| |__   ");
console.log("  _   | |/ _ \\| '_ \\| '_ \\   \\___ \\| '_ ` _ \\| | __| '_ \\  ");
console.log(" | |__| | (_) | | | | | | |  ____) | | | | | | | |_| | | | ");
console.log("  \\____/ \\___/|_| |_|_| |_| |_____/|_| |_| |_|_|\\__|_| |_| ");
console.log("========================================================== ");

(function(){
    function getStartCallback(key, currentTask){
        return function(){
            console.log("");
            console.log("=== Starting task " + key);
            console.log("=== [" + currentTask.description + "]");
            console.log("");
        };
    }

    for(var key in jake.Task){
        var t = jake.Task[key];
        if (t.addListener){
            t.addListener("start", getStartCallback(key, t));
        }
    }
}());

