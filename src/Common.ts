var js = js || {};

module JohnSmith.Common {
    export interface IDisposable {
        dispose: () => void;
    }

    /////////////////////////////////
    // Collections
    /////////////////////////////////

    export interface IList {
        getAt: (index: number) => any;
        setAt: (index: number, item: any) => void;
        removeAt: (index: number) => void;
        insertAt: (index: number, item: any) => void;
        add: (item: any) => void;
        count: () => number;
        clear: () => void;
    }

    export class ArrayList implements IList {
        private items: any;

        constructor() {
            this.items = [];
        }

        public getAt(index: number): any {
            return this.items[index]
        }

        public setAt(index: number, item: any): void {
            this.items[index] = item;
        }

        public removeAt(index: number): void {
            this.items.splice(index, 1);
        }

        public insertAt(index: number, item: any): void {
            this.items.splice(index, 0, item);
        }

        public add(item: any): void {
            this.items.push(item);
        }

        public count():number {
            return this.items.length;
        }

        public clear():void {
            this.items.length = 0;
        }
    }

    /////////////////////////////////
    // Logging
    /////////////////////////////////

    export interface ILogger {
        info: (...args:any[]) => void;
        warn: (...args:any[]) => void;
        error: (...args:any[]) => void;
    }

    // Using no-op logger by default
    export var log:ILogger = {
        info: function(message:any) : void {},
        warn: function(message:any) : void {},
        error: function(message:any) : void {}
    };

    /////////////////////////////////
    // Events
    /////////////////////////////////

    export interface IEventBus {
        addListener: (eventType:string, callback:(data:any) => void) => void;
        trigger: (eventType:string, data: any) => void;
    }

    interface IListener {
        eventType: string;
        callback: (data:any) => void;
    }

    class DefaultEventBus implements IEventBus {
        private listeners: IList;

        constructor(){
            this.listeners = new ArrayList();
        }

        public addListener(eventType:string, callback:(data:any) => void):void {
            var listener:IListener = {
                eventType: eventType,
                callback: callback
            };

            this.listeners.add(listener);
        }

        public trigger(eventType:string, data: any) : void {
            var listenersCount = this.listeners.count();
            for (var i = 0; i < listenersCount; i++) {
                var listener:IListener = this.listeners.getAt(i);
                if (listener.eventType === eventType) {
                    listener.callback(data);
                }
            }
        }
    }

    js.event = {};
    js.event.bus = new DefaultEventBus();

    /////////////////////////////////
    // Dom services
    /////////////////////////////////

    export interface IElement {
        empty: () => void;
        append: (html:string) => IElement;
        getHtml: () => string;
        findRelative: (query:string) => IElement;
        remove: () => void;
    }

    export interface IElementFactory {
        createElement(query:string);
        createRelativeElement(parent:IElement, query:string);
    }

    /////////////////////////////////
    // Ioc
    /////////////////////////////////

    export interface IContainer {
        resolve(key:string);
        register(key:string, service: any);
    }

    var ioc:IContainer = {
        resolve: function(key:string){
            return this[key];
        },
        register: function(key:string, service: any){
            this[key] = service;
        }
    };

    js.ioc = ioc;
}