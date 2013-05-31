var name = js.bindableValue();

js.bind(name).to(function(){
    $("#callbacksConsole").append('simple callback called');
});

name.setValue("John Smith");