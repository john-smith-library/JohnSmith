function ui(content){
    var $content = $(content);
    $('body').html($content);
    return $content;
}

var context = {
    inputs: []
};

function input(description){
    context.inputs.push({
        description: description,
        inputArgs: Array.prototype.slice.call(arguments, 1)
    });
}

function describeInputs(description, specDefinition){
    for (var i = 0; i < context.inputs.length; i++) {
        var inputItem = context.inputs[i];
        (function(item){
            describe(description + inputItem.description, function(){
                specDefinition.apply(this, item.inputArgs);
            });
        })(inputItem);
    }

    context.inputs = [];
}

function describeNested(){
    var specDefinitions = arguments[1];
    var descr = arguments[0];

    if (arguments.length === 2) {
        describe(descr, specDefinitions);
    } else {
        var newArgs = [];
        for (var i = 1; i < arguments.length; i++) {
            newArgs.push(arguments[i]);
        }

        describe(descr, function(){
            describeNested.apply(this, newArgs);
        });
    }
}

function aliases(){
    return new AliasesHolder();
}

function alias(description) {
    var result = {};
    result.description = description;
    result.tail = [];
    for (var i = 1; i < arguments.length; i++) {
        result.tail.push(arguments[i]);
    }

    return result;
}

function AliasesHolder() {
    var that = this;

    this.items = [];

    this.add = function(){
        if (arguments.length === 1 && arguments[0].description) {
            that.items.push(arguments[0]);
            return that;
        }

        var description = arguments[0];
        var tail = [];
        for (var i = 1; i < arguments.length; i++) {
            tail.push(arguments[i]);
        }

        that.items.push({
            description: description,
            tail: tail
        });

        return that;
    };

    this.describeAll = function(specDefinitions){
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            describe(item.description, function(){
                specDefinitions.apply(this, item.tail);
            });
        }
    };
}