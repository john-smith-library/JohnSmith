var fs = require('fs');
var path = require('path');
//var ent = require('ent');

var examplesBaseDir = "src_examples";
var outputHtmlFile = path.join("out", "examples.html");

console.log("Building examples html...");

var exampleDirs = fs.readdirSync(examplesBaseDir);
var examplesCount = exampleDirs.length;

console.log(examplesCount + " examples found");

var examplesFileHeader =
"<!DOCTYPE html>" +
"<head></head>" +
"<html>" +
"   <body>";

var examplesFileFooter =
"   </body>" +
"</html>";


fs.writeFileSync(outputHtmlFile, "");
fs.appendFileSync(outputHtmlFile, examplesFileHeader);

for (var i = 0; i < examplesCount; i++){
    var exampleId = exampleDirs[i];
    var exampleDir = path.join(examplesBaseDir, exampleId);
    var contentFile = path.join(exampleDir, "content.html");
    var codeFile = path.join(exampleDir, "code.js");
    var markupFile = path.join(exampleDir, "markup.html");

    if (!fs.existsSync(contentFile)){
        throw new Error("Required file " + contentFile + " not found!");
    }

    console.log("Building example " + exampleId);

    fs.appendFileSync(outputHtmlFile, "<div id='" + exampleId + "' class='example'>");
    fs.appendFileSync(outputHtmlFile, fs.readFileSync(contentFile));

    fs.appendFileSync(outputHtmlFile, "<h3>HTML:</h3>");
    fs.appendFileSync(outputHtmlFile, "<section class='html'>");
    fs.appendFileSync(outputHtmlFile, "<pre><code class='html'>");
    //fs.appendFileSync(outputHtmlFile, ent.encode(fs.readFileSync(markupFile).toString()));
    fs.appendFileSync(outputHtmlFile, "</code></pre>");
    fs.appendFileSync(outputHtmlFile, "</section>");

    fs.appendFileSync(outputHtmlFile, "<h3>JavaScript:</h3>");
    fs.appendFileSync(outputHtmlFile, "<section class='javascript'>");
    fs.appendFileSync(outputHtmlFile, "</section>");

    fs.appendFileSync(outputHtmlFile, "<h3>Result:</h3>");
    fs.appendFileSync(outputHtmlFile, "<section class='result'>");
    fs.appendFileSync(outputHtmlFile, "</section>");
    fs.appendFileSync(outputHtmlFile, "</div>");
}

fs.appendFileSync(outputHtmlFile, examplesFileFooter);