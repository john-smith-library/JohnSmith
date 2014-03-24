function ui(content){
    var $content = content;
    $('body').html($content);
    return $content;
}


function describeAliases(aliases, payload){
    for(var alias in aliases) {
        (function(a){
            describe(a, function(){
                var arg = aliases[a]();
                payload(arg);
            });
        })(alias);

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