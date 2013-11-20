var name = js.bindableValue();

js.bind(name).to(function(){
    $("#callbacksConsole").append('<p>simple callback called</p>');
});

name.setValue("John Smith");