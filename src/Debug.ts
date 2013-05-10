/// <reference path="Common.ts"/>

// Replace no-op logger with console-based implementation
JohnSmith.Common.log = {
    info: function(args) : void {
        try
        {
            console.log.apply(console, arguments);
        } catch (Error) {}
    },

    warn: function(args) : void {
        try
        {
            console.warn.apply(console, arguments);
        } catch (Error) {}
    },

    error: function(args) : void {
        try
        {
            console.error.apply(console, arguments);
        } catch (Error) {}
    }
}

declare var $;

var log = JohnSmith.Common.log;

log.info("========================================================== ");
log.info("       _       _              _____           _ _   _      ");
log.info("      | |     | |            / ____|         (_) | | |     ");
log.info("      | | ___ | |__  _ __   | (___  _ __ ___  _| |_| |__   ");
log.info("  _   | |/ _ \\| '_ \\| '_ \\   \\___ \\| '_ ` _ \\| | __| '_ \\  ");
log.info(" | |__| | (_) | | | | | | |  ____) | | | | | | | |_| | | | ");
log.info("  \\____/ \\___/|_| |_|_| |_| |_____/|_| |_| |_|_|\\__|_| |_| ");
log.info("========================================================== ");

log.info("  Configuration details:");
log.info("    Handler data transformers:");

var handlerDataTransformers = js.getHandlerDataTransformers();
for (var i = 0; i < handlerDataTransformers.count(); i++){
    log.info("      - [" + i + "] " + (handlerDataTransformers.getAt(i).description || "No description"));
}

log.warn("You are using debug version of JohnSmith. Do not use this version in production code.");

/*
js.event.bus.addListener(
    "valueRendered",
    function(data: any){
        var $destination = data.destination.target;
        var $badge = $("<div style='position: absolute; background: greenyellow; padding: 2px 5px; font-size: 11px; opacity: 0.95; right: 2px; top: 2px;'>bound</div>");
        $destination
            .css("position", "relative")
            .append($badge);
    }
)

js.event.bus.addListener(
    "viewRendered",
    function(data: any){
        var $destination = data.root.target;
        var $badge = $("<div style='position: absolute; background: yellow; padding: 2px 5px; font-size: 11px; opacity: 0.95;'>view</div>");

            $badge
                .css("left", $($destination[1]).offset().left + "px")
                .css("top", $($destination[1]).offset().top + "px");


        $("body").append($badge);

        $badge.click(function(){
            $destination.css("border", "2px solid yellow");
        });

//        $destination
//            .css("position", "relative")
//            .append($badge);
    }
)

 */