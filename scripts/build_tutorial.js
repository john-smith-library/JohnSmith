var path = require('path');
var fs = require('fs-extra');
var jade = require('jade');

var fn = jade.compile(fs.readFileSync("scripts/examples_template.jade"));

if (!fs.existsSync("out")) {
    fs.mkdirSync("out");
}

var examplesBaseDir = "src_examples";
var outputHtmlFile = path.join("out", "examples.html");

fs.copy(
    path.join(examplesBaseDir, "assets"),
    path.join("out", "assets"));

console.log("Building examples html...");

var examples = [];
var exampleDirs = fs.readdirSync(examplesBaseDir);
var examplesCount = exampleDirs.length;

console.log(examplesCount + " examples found");

for (var i = 0; i < examplesCount; i++){
    var exampleId = exampleDirs[i];
    var exampleDir = path.join(examplesBaseDir, exampleId);
    if (exampleId !== "assets"){
        console.log("Building example " + exampleId);

        var contentFile = path.join(exampleDir, "content.html");
        var codeFile = path.join(exampleDir, "code.js");
        var markupFile = path.join(exampleDir, "markup.html");

        if (!fs.existsSync(contentFile)){
            throw new Error("Required file " + contentFile + " not found!");
        }

        examples.push({
            id: exampleId,
            markup: fs.readFileSync(markupFile).toString(),
            code: fs.readFileSync(codeFile).toString(),
            description: fs.readFileSync(contentFile)
        });
    }
}

fs.writeFileSync(outputHtmlFile, fn({ examples: examples }));