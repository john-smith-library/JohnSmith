import pug from "pug";
import fs from "fs-extra";
import path from "path";
import glob from "glob";
import yaml from "js-yaml";

console.log('Building tutorial...');

const topicTemplate = pug.compile(fs.readFileSync('_templates/topic.pug'));
const sitemapTemplate = pug.compile(fs.readFileSync('_templates/sitemap.pug'));

const inputPath = '.';
const outputPath = '../dist_tutorial';

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
}

const johnSmithPackageJson = fs.readJsonSync('node_modules/john-smith/package.json');
const version = johnSmithPackageJson.version;

const tutorialItems = glob.sync(path.join(inputPath, '/**/index.tsx')).map((indexPath) => {
    const tutorialDirectoryPath = indexPath.replace('/index.tsx', '');
    const tutorialDirectoryPathCode = indexPath
        .replace('/index.tsx', '')
        .substring(inputPath.length - 1);
    const idParts = tutorialDirectoryPathCode.split('/');

    const contentFile = path.join(tutorialDirectoryPath, "content.html");
    const codeFile = indexPath;
    const compiledCodePath = path.join(outputPath, tutorialDirectoryPath, 'index.js');
    const markupFile = path.join(tutorialDirectoryPath, "markup.html");
    const stylesFile = path.join(tutorialDirectoryPath, "styles.css");

    const configData = readConfig(tutorialDirectoryPath);
    if (!configData) {
        throw new Error('Config file not found in ' + tutorialDirectoryPath);
    }

    const visible = configData.visible !== false;
    const title = configData.title;
    const isNew = configData.isNew || false;
    const markup = readIfExists(markupFile);
    const compiledCode = readIfExists(compiledCodePath);
    const code = readIfExists(codeFile);
    const formattedCode = code ? formatCode(code, configData) : undefined;
    const description = readIfExists(contentFile);
    const styles = readIfExists(stylesFile);

    console.log('Detected tutorial directory ' + tutorialDirectoryPathCode + (visible ? '' : ' [hidden]'));

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
}).filter(x => x.visible);

const hierarchicalTutorialItems = tutorialItems.reduce((acc, item) => {
    let currentAcc = acc;

    for (let i = 0; i < item.idParts.length; i++){
        const part = item.idParts[i];

        const isLastLevel = i === item.idParts.length - 1;

        if (!currentAcc[part]) {
            if (isLastLevel) {
                currentAcc[part] = {
                    id: item.id,
                    title: item.title,
                    type: 'leaf'
                };
            } else {
                const categoryItem = {
                    type: 'node',
                    items: {}
                };

                currentAcc[part] = categoryItem;
                currentAcc = categoryItem.items
            }
        }
    }

    return acc;
}, {});

const composeTableOfContents = (currentLevel, baseIds) => {
    return Object.keys(currentLevel)
        .sort()
        .map(key => {
            const item = currentLevel[key];

            const fullIds = baseIds.concat([key]);

            if (item.type === 'leaf') {
                return {
                    id: item.id,
                    type: item.type,
                    title: item.title,
                    path: fullIds.join('/') + '/index.html'
                };
            }

            const config = readConfig(path.join(inputPath, fullIds.join('/')));

            return {
                type: 'node',
                title:  config ? config.title : key,
                items: composeTableOfContents(item.items, fullIds)
            }
        });
}

const tableOfContents = composeTableOfContents(hierarchicalTutorialItems, []);

tutorialItems.forEach((item, index) => {
    const currentTopicGlobalIndex = index;

    const nextTopic = currentTopicGlobalIndex === tutorialItems.length - 1
        ? null
        : tutorialItems[index + 1];

    const prevTopic = currentTopicGlobalIndex === 0
        ? null
        : tutorialItems[currentTopicGlobalIndex - 1];

    const outFile = path.join(outputPath, item.relativePath, "index.html");

    fs.writeFileSync(outFile, topicTemplate({
        tableOfContents: tableOfContents,
        topics: tutorialItems,
        currentTopic: item,
        nextTopic: nextTopic,
        prevTopic: prevTopic,
        pathToRoot: item.idParts.map(_ => '..').join('/'),
        version: version
    }));
});

var assetsSourcePath = path.join(inputPath, "assets");
var assetsDestPath = path.join(outputPath, "assets");
var rootAssets = path.join(assetsDestPath, "root");

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

function readConfig(directory) {
    const configFile = path.join(directory, "config.yaml");

    if (!fs.existsSync(configFile)) {
        return undefined;
    }

    return yaml.load(fs.readFileSync(configFile).toString());
}

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
