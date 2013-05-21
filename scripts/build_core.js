var path = require('path');
var fs = require('fs-extra');
var exec = require('child_process').exec;
var argv = require('optimist').argv;

function readSrcDir(dirPath, allFiles, isDebug){
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
}

var srcDir = "src";
var allSrcFiles = [];

var properties = {
    outFileName: path.join("out", "john-smith.debug.js"),
    outMinFileName: null,
    configuration: "debug"
}

console.log("Start building JohnSmith...");
console.log("Reading build options...");

for (var key in properties) {
    if (argv[key]) {
        properties[key] = argv[key];

        console.log("  build option [" + key + "] was overridden with argument value '" + properties[key] + "'");
    }
}

console.log("  list of build options:");

for (var key in properties) {
    console.log("    " + key + "=" + properties[key]);
}

console.log("Reading source files list...");

var isDebug = properties.configuration === "debug";

readSrcDir(srcDir, allSrcFiles, isDebug);
console.log("  list of source files: ");

for (var i = 0; i < allSrcFiles.length; i++) {
    console.log("    " + allSrcFiles[i]);
}

var buildCmd = "tsc --out " + properties.outFileName;
if (isDebug){
    buildCmd += " --comments";
}

buildCmd += " " + allSrcFiles.join(" ");

console.log("Running typescript compiler...");
console.log(" command line is " + buildCmd);

exec(
    buildCmd,
    function (error, stdout, stderr) {
        if (stdout) {
            console.log(stdout);
        }

        if (stderr) {
            console.error(stderr);
        }

        if (error !== null) {
            stepCompleteWithErrors();
        } else {
            stepMinify();
        }
    });

function stepMinify(){
    if (properties.outMinFileName){
        console.log("Generating minimised file " + properties.outMinFileName + "...");
        exec(
            "ccjs " + properties.outFileName + " > " + properties.outMinFileName,
            function (error, stdout, stderr) {
                if (stdout) {
                    console.log(stdout);
                }

                if (stderr) {
                    console.error(stderr);
                }

                if (error !== null) {
                    console.error("error", error);
                    stepCompleteWithErrors();
                } else {
                    stepComplete();
                }
            });
    }
}

function stepComplete(){
    console.log("Build complete");
    process.exit(0);
}

function stepCompleteWithErrors(){
    console.error("Build complete with errors");
    process.exit(-1);
}






