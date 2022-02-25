import pug from "pug";
import fs from "fs-extra";
import path from "path";
import glob from "glob";
import yaml from "js-yaml";

class TutorialItem {
    constructor(
        idParts,
        relativePath
    ) {
        this.idParts = idParts;
    }
}

console.log('Building tutorial...');

const topicTemplate = pug.compile(fs.readFileSync('_templates/topic.pug'));
const sitemapTemplate = pug.compile(fs.readFileSync('_templates/sitemap.pug'));

const inputPath = '.';
const outputPath = '../dist_tutorial';

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
}

const tutorialItems = glob.sync(path.join(inputPath, '/**/index.tsx')).map((indexPath) => {
    const tutorialDirectoryPath = indexPath.replace('/index.tsx', '');
    const tutorialDirectoryPathCode = indexPath
        .replace('/index.tsx', '')
        .substring(inputPath.length - 1);
    const idParts = tutorialDirectoryPathCode.split('/');

    const configFile = path.join(tutorialDirectoryPath, "config.yaml");
    const contentFile = path.join(tutorialDirectoryPath, "content.html");
    const codeFile = indexPath;
    const compiledCodePath = path.join(outputPath, tutorialDirectoryPath, 'index.js');
    const markupFile = path.join(tutorialDirectoryPath, "markup.html");
    const stylesFile = path.join(tutorialDirectoryPath, "styles.css");

    if (!fs.existsSync(configFile)) {
        throw new Error('Config file not found in ' + tutorialDirectoryPath);
    }

    const configData = yaml.load(fs.readFileSync(configFile).toString());
    const visible = configData.visible !== false;
    const title = configData.title;
    const cleanTopicId = tutorialDirectoryPathCode.replace(/^\d\d_/, "");
    const isNew = configData.isNew || false;
    const markup = readIfExists(markupFile);
    const compiledCode = readIfExists(compiledCodePath);
    const code = readIfExists(codeFile);
    const formattedCode = code ? formatCode(code, configData) : undefined;
    const description = readIfExists(contentFile);
    const styles = readIfExists(stylesFile);

    return {
        id: tutorialDirectoryPathCode,
        relativePath: tutorialDirectoryPathCode,
        idParts,
        visible,
        title,
        isNew,
        markup,
        compiledCode,
        formattedCode,
        description,
        styles
    }
});

tutorialItems.forEach((item, index) => {
    const currentTopicGlobalIndex = index;

    const nextTopic = currentTopicGlobalIndex === tutorialItems.length - 1
        ? null
        : tutorialItems[index + 1];

    const prevTopic = currentTopicGlobalIndex === 0
        ? null
        : tutorialItems[currentTopicGlobalIndex - 1];

    if (item.visible) {
        const outFile = path.join(outputPath, item.relativePath, "index.html");

        // var outJsonFile = path.join(path.join("out", "ajax"), topic.id + ".json");

        fs.writeFileSync(outFile, topicTemplate({
            topics: tutorialItems,
            currentTopic: item,
            nextTopic: nextTopic,
            prevTopic: prevTopic,
            pathToRoot: item.idParts.map(_ => '..').join('/'),
            version: 'todo'
        }));

        // fs.writeFileSync(outJsonFile, JSON.stringify(topic));
    }
});

var assetsSourcePath = path.join(inputPath, "assets");
var assetsDestPath = path.join(outputPath, "assets");
var rootAssets = path.join(assetsDestPath, "root");

fs.mkdirsSync(path.join("out", "ajax"));

fs.copy(assetsSourcePath, assetsDestPath, function(err){
    if (!err) {
        if (fs.existsSync(rootAssets)) {
            const rootAssetsFiles = fs.readdirSync(rootAssets);
            for (var i = 0; i < rootAssetsFiles.length; i++){
                const rootAssetFile = path.join(rootAssets, rootAssetsFiles[i]);
                console.log("Copy " + rootAssetFile + " to out root");
                fs.createReadStream(rootAssetFile).pipe(fs.createWriteStream(path.join(outputPath, rootAssetsFiles[i])));
            }
        }
    }
});

console.log(tutorialItems, path.separator);

function readIfExists(filePath) {
    return fs.existsSync(filePath)
        ? fs.readFileSync(filePath).toString()
        : undefined;
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
