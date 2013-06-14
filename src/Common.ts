module JohnSmith.Common {
    export interface IDisposable {
        dispose: () => void;
    }

    /////////////////////////////////
    // Utils
    /////////////////////////////////

    export class TypeUtils
    {
        /**
         * Checks if provided object is a function.
         * @param target An object to check.
         * @returns {boolean}
         */
        public static isFunction(target: any){
            var getType = {};
            return (target && getType.toString.call(target) === '[object Function]');
        }

        /**
         * Checks if provided object is actual object.
         * @param target An object to check.
         * @returns {boolean}
         */
        public static isObject(target: any){
            return target != null && typeof target === "object";
        }
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
    // Exposing public API
    /////////////////////////////////

    var jsVarName = "js";
    window[jsVarName] = window[jsVarName] || {}
    export var JS = window[jsVarName];

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

    JS.event = {};
    JS.event.bus = new DefaultEventBus();

    /////////////////////////////////
    // Dom services
    /////////////////////////////////

    /**
     * Describes the type of string value
     */
    export class ValueType {
        /** The value contains plain text */
        public static text = "text";

        /** The value contains prepared html */
        public static html = "html";

        /** The value contains an object that could be transformed to html */
        public static unknown = "unknown";
    }

    export interface IElement {
        isEmpty: () => bool;
        empty: () => void;
        appendHtml: (html:string) => IElement;
        appendText: (text:string) => IElement;
        getHtml: () => string;
        findRelative: (query:string) => IElement;
        remove: () => void;

        addClass: (className: string) => void;
        removeClass: (className: string) => void;

        setHtml(html:string);
        setText(text: string);

        getValue: () => string;
        setValue(value: string);

        attachClickHandler: (callback: () => void) => void;
    }

    export interface IElementFactory {
        createElement(query:string);
        createRelativeElement(parent:IElement, query:string);
    }

    export interface IMarkupResolver {
        /**
         * Resolves markup object and returns valid html string.
         * @param markup
         */
        resolve(markup: any): string;
    }

    /////////////////////////////////
    // Ioc
    /////////////////////////////////

    interface IDefinition {
        key?: string;
        dependencies: string[];
        factoryCallback: () => any;
    }

    interface IDependencyCallback {
        keys: any[];
        callback: () => any;
    }

    export interface IContainer {
        resolve(key:string):any;

        register(key:string, service: any);
        registerWithDependencies(key:string, createCallback: () => any, ...dependencies: string[]);

        withRegistered(...args: any[]);
        clear();
    }

    class Container implements IContainer {
        private _resolvedDependencies : any;
        private _definitions: IDefinition[];

        constructor(){
            this.clear();
        }

        public has(key:string): bool {
            return (this._resolvedDependencies[key] != null);
        }

        public resolve(key:string): any{
            var dependency = this._resolvedDependencies[key];

            if (!dependency){
                return null;
            }

            return dependency;
        }

        public register(key:string, service: any): void {
            this._resolvedDependencies[key] = service;
            this.checkCallbacks();
        }

        public registerWithDependencies(key:string, createCallback: () => any, ...dependencies: string[]) {
            this._definitions.push({
                key: key,
                dependencies: dependencies,
                factoryCallback: createCallback
            });

            this.checkCallbacks();
        }

        public withRegistered(...args: any[]){
            var callback = args[args.length - 1];
            args.pop();

            this._definitions.push({
                dependencies: args,
                factoryCallback: <() => any> callback
            });

            this.checkCallbacks();
        }

        public clear() {
            this._resolvedDependencies = {};
            this._definitions = [];
        }

        private checkCallbacks(){
            var isProcessed = false;
            var index = 0;
            var resolved = {};

            do {
                if (index >= this._definitions.length) {
                    isProcessed = true;
                }
                if (!isProcessed) {
                    var definition = this._definitions[index];
                    if (this.processCallback(definition, resolved)) {
                        this._definitions.splice(index, 1);
                    } else {
                        index++;
                    }
                }
            } while (!isProcessed);

            for (var key in resolved){
                this.register(key, resolved[key]);
            }
        }

        private processCallback(definition: IDefinition, resolved: any) : bool {
            var dependencies = [];

            for (var j = 0; j < definition.dependencies.length; j++) {
                var key = definition.dependencies[j];
                if (this.has(key)) {
                    var dependency = this.resolve(key);
                    dependencies.push(dependency);
                } else {
                    return false;
                }
            }

            var resolvedService = definition.factoryCallback.apply(this, dependencies);
            if (resolvedService && definition.key) {
                resolved[definition.key] = resolvedService;
            }

            return true;
        }
    }

    var ioc:IContainer = new Container();

    JS.ioc = ioc;

    JS.createIocContainer = function(){
        return new Container();
    }
}