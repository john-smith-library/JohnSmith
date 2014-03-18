/// <reference path="Common.ts"/>
/// <reference path="view/Contracts.ts"/>
/// <reference path="view/Integration.ts"/>
/// <reference path="JQuery.ts"/>
/// <reference path="../libs/jquery.d.ts"/>

// Replace no-op logger with console-based implementation
JohnSmith.Common.log = {
    info: function(...args:any[]) : void {
        try
        {
            console.log.apply(console, args);
        } catch (Error) {}
    },

    warn: function(...args:any[]) : void {
        try
        {
            console.warn.apply(console, args);
        } catch (Error) {}
    },

    error: function(...args:any[]) : void {
        try
        {
            console.error.apply(console, args);
        } catch (Error) {}
    }
}

var log = JohnSmith.Common.log;

log.info("========================================================== ");
log.info("       _       _              _____           _ _   _      ");
log.info("      | |     | |            / ____|         (_) | | |     ");
log.info("      | | ___ | |__  _ __   | (___  _ __ ___  _| |_| |__   ");
log.info("  _   | |/ _ \\| '_ \\| '_ \\   \\___ \\| '_ ` _ \\| | __| '_ \\  ");
log.info(" | |__| | (_) | | | | | | |  ____) | | | | | | | |_| | | | ");
log.info("  \\____/ \\___/|_| |_|_| |_| |_____/|_| |_| |_|_|\\__|_| |_| ");
log.info("========================================================== ");
log.warn("You are using debug version of JohnSmith. Do not use this version in production code.");
