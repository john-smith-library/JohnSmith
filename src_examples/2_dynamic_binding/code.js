var currentTime = js.bindableValue();                    // create bindable value
currentTime.setValue("...");                             // set default value (not required)

window.setInterval(function(){                           // this code will update bindable
    var timeString = new Date().toLocaleTimeString();    // value every second
    currentTime.setValue(timeString);
}, 1000);

js.bind(currentTime).to("#currentTime");                 // do binding
