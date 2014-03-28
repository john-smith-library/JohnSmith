(function(exp){
    "use strict";

    var path = require('path'),
        fs = require('fs-extra'),
        vm = require('vm'),
        util = require('util'),
        endOfLine = require('os').EOL;

    var Seed = function(seedDataArray){
        this.name = null;
        this.categories = [];
        this.aliases = [];

        if (seedDataArray.length > 0) {
            for (var i = 0; i < seedDataArray.length; i++) {
                var arg = seedDataArray[i];
                if (typeof arg === 'string') {
                    if (this.name !== null) {
                        this.categories.push(this.name);
                    }

                    this.name = arg;
                } else {
                    this.specDefinition = arg;
                }
            }
        }

        //this.fileName = fileName;

        this.withCategory = function(){
            this.categories = [];

            for (var i = 0; i < arguments.length; i++) {
                this.categories.push(arguments[i]);
            }

            return this;
        };

        this.withName = function(name){
            this.name = name;
            return this;
        };

        this.withAlias = function(alias, argumentsFactory){
            this.aliases.push({
                name: alias,
                argumentsFactory: argumentsFactory
            });

            return this;
        };

        this.define = function(specDefinition){
            this.specDefinition = specDefinition;
            return this;
        };
    };

    var IncubatedSeeds = function(){
        var findCategory = function(categories, name){
            for (var i = 0; i < categories.length; i++) {
                if (categories[i].name === name) {
                    return categories[i];
                }
            }

            var category = new SpecCategory(name);
            categories.push(category);
            return category;
        };

        this.categories = [];

        this.addCategory = function(categories) {
            var currentCategory = null;
            if (categories && categories.length > 0) {
                for (var i = 0; i < categories.length; i++) {
                    var categoryName = categories[i];
                    if (currentCategory === null) {
                        currentCategory = findCategory(this.categories, categoryName);
                    } else {
                        currentCategory = findCategory(currentCategory.children, categoryName);
                    }
                }
            }

            return currentCategory;
        };
    };

    var SpecCategory = function(name){
        this.name = name;
        this.children = [];
        this.specs = [];
        this.add = function(spec){
            this.specs.push(spec);
        };
    };

    var SpecDefinition = function(name, definitionFunc, alias){
        this.name = name;
        this.definitionFunc = definitionFunc;
        this.alias = alias;
    };

    var SeedGrabber = function(){
        var readSrcDir = function(dirPath, allFiles){
            var dirContent = fs.readdirSync(dirPath);
            for (var i = 0; i < dirContent.length; i++){
                var childPath = path.join(dirPath, dirContent[i]);
                var childStat = fs.lstatSync(childPath);

                if (childStat.isDirectory()) {
                    readSrcDir(childPath, allFiles);
                } else if (childStat.isFile() && childPath.indexOf('SpecDef.js') !== -1) {
                    allFiles.push(childPath);
                }
            }
        };

        this.grab = function(sourcePath){
            var files = [];
            readSrcDir(sourcePath, files);

            var specs = [];
            for (var i = 0; i < files.length; i++) {

                var code = fs.readFileSync(files[i]);
                var context = {
                    inputs: [],
                    spec: function(){
                        context.seedArgs = Array.prototype.slice.call(arguments, 0);
                        return new Seed(arguments);
                    },
                    input: function(){
                        context.inputs.push(Array.prototype.slice.call(arguments, 0));
                    }
                };

                vm.runInNewContext(code, context);

                var spec = new Seed(context.seedArgs);
                for (var j = 0; j < context.inputs.length; j++) {
                    var input = context.inputs[j];
                    spec.withAlias(input[0], input[1]);
                }
                spec.fileName = files[i];

                specs.push(spec);
            }

            return specs;
        };
    };

    var SeedIncubator = function(){
        var putItemToResults = function(result, categories, name, specDefinition){
            var allCategories = (categories || []).slice(0);
            allCategories.push(name);

            var seedTargetCategory = result.addCategory(categories);
            seedTargetCategory.add(specDefinition);
        };

        this.incubate = function(seeds){
            var result = new IncubatedSeeds();
            for (var i = 0; i < seeds.length; i++) {
                var seed = seeds[i];
                if (seed.aliases.length > 0) {
                    for (var j = 0; j < seed.aliases.length; j++) {
                        var alias = seed.aliases[j];
                        putItemToResults(result, seed.categories, alias.name, new SpecDefinition(alias.name, seed.specDefinition, alias));
                    }
                } else {
                    putItemToResults(result, seed.categories, seed.name, new SpecDefinition(seed.name, seed.specDefinition, null));
                }

            }

            return result;
        };
    };

    var FuncUtils = {
        getFunctionInfo:  function(func){
            var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

            var fnStr = func.toString().replace(STRIP_COMMENTS, '');
            var args = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
            var bodyStart = fnStr.indexOf('{');
            var bodyEnd = fnStr.lastIndexOf('}');
            var body = fnStr.substr(bodyStart + 1, bodyEnd - bodyStart - 2);

            if(args === null) {
                args = [];
            }
            return {
                args: args,
                body: body
            };
        },

        pretify: function(func, desiredSpaces, skipFirstLine){
            var funcLines = func.split(endOfLine);
            var spacesToDeleteCount = FuncUtils.getSpacesToDeleteCount(funcLines, skipFirstLine);

            var spacesToDelete = Array(spacesToDeleteCount + 1).join(' ');
            var resultLines = [];

            for (var i = 0; i < funcLines.length; i++) {
                var line = funcLines[i];
                if (line.length > spacesToDeleteCount) {
                    if (line.substr(0, spacesToDeleteCount) === spacesToDelete) {
                        line = line.substr(spacesToDeleteCount);
                    }

                    if (!(skipFirstLine && i === 0)) {
                        line = desiredSpaces + line;
                        //line = Array(desiredSpaces.length + 1).join('-') + line;
                    }
                }

                resultLines.push(line);
            }

            var result = resultLines.join(endOfLine);

            while (result.length > 0 && (result[result.length - 1] === ' ' || result[result.length - 1] === endOfLine)){
                result = result.substr(0, result.length - 1);
            }

            return result;
        },

        getSpacesToDeleteCount: function(lines, skipFirstLine){
            var counts = [];
            var firstLine = skipFirstLine ? 1 : 0;

            for (var i = firstLine; i < lines.length; i++) {
                var line = lines[i];
                var index = 0;
                while (line[index] === ' ' && index < line.length) {
                    index++;
                }

                //if (index > 0 && index < line.length) {
                    counts.push(index);
                //}
            }

            if (counts.length > 0) {
                var result = counts[0];
                for (var i = 0; i < counts.length; i++) {
                    if (result > counts[i]) {
                        result = counts[i];
                    }
                }

                return result;
            }

            return 0;
        }
    };

    var SeedWriter = function(fileName){
        var level = 0;
        var tab = '    ';

        var makeTabs = function(count) {
            return Array(count + 1).join(tab);
        };

        var append = function(value){
            fs.appendFileSync(fileName, value);
        };

        var start = function(){
            if (fs.existsSync(fileName)) {
                fs.deleteSync(fileName);
            }

            fs.createFileSync(fileName);
        };

        var startDescribe = function(category){
            append(makeTabs(level));
            append('describe(\'' + category.name + '\', function(){' + endOfLine);
            level++;
        };

        var endDescribe = function(){
            level--;
            append(makeTabs(level));
            append('});');
            append(endOfLine);

        };

        var renderSpec = function(spec){
            append(makeTabs(level));
            append('describe(\'' + spec.name + '\', ');
            if (spec.alias) {
                var functionInfo = FuncUtils.getFunctionInfo(spec.definitionFunc);

                var aliasDefinition =
                    'function(){' + endOfLine +
                    makeTabs(level + 1) + 'var argsFactory = ' + FuncUtils.pretify(spec.alias.argumentsFactory.toString(), makeTabs(level + 2), true) + ';' + endOfLine +
                    makeTabs(level + 1) + 'var args = argsFactory();' + endOfLine;

                if (functionInfo.args.length === 1) {
                    aliasDefinition += makeTabs(level + 1) + 'var ' + functionInfo.args[0] + ' = args;' + endOfLine;
                } else {
                    for (var j = 0; j < functionInfo.args.length; j++) {
                        var argName = functionInfo.args[j];
                        aliasDefinition += makeTabs(level + 1) + 'var ' + argName + ' = args[' + j + '];' + endOfLine;
                    }
                }

                aliasDefinition += FuncUtils.pretify(functionInfo.body, makeTabs(level + 1), false);
                aliasDefinition += makeTabs(level) + '}';

                append(aliasDefinition);
            } else {
                append(FuncUtils.pretify(spec.definitionFunc.toString(), makeTabs(level), true));
            }

            append(');');
            append(endOfLine);
            append(endOfLine);
        };

        var processCategories = function(categories){
            for (var i = 0; i < categories.length; i++) {
                var category = categories[i];
                startDescribe(category);
                if (category.children.length > 0) {
                    processCategories(category.children);
                }

                if (category.specs.length > 0) {
                    for (var j = 0; j < category.specs.length; j++) {
                        renderSpec(category.specs[j]);
                    }
                }

                endDescribe();
            }
        };

        this.write = function(incubatedSeeds){
            start();
            processCategories(incubatedSeeds.categories);
        };
    };

    exp.generate = function(sourcePath, resultFile){
        var grabber = new SeedGrabber();
        var incubator = new SeedIncubator();
        var writer = new SeedWriter(resultFile);

        var seeds = grabber.grab(sourcePath);
        console.log(util.inspect(seeds, false, 10));
        var incubatedSeeds = incubator.incubate(seeds);
        writer.write(incubatedSeeds);


//        for (var i = 0; i < incubatedSeeds.categories.length; i++) {
  //          var spec = incubatedSeeds.categories[i];
//
  //          var caption =
    //            '/**' + endOfLine +
      //              ' * Spec generated by definition: ' + spec.fileName + endOfLine +
        //            ' */' + endOfLine;
//
  //          fs.appendFileSync(resultFile, caption);
    //        fs.appendFileSync(resultFile, util.inspect(spec, false, 10));
      //  }
    };
})(exports);