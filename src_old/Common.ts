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

    export class ArrayUtils
    {
        public static removeItem<T>(array: T[], itemToRemove:T):void {
            var indexToRemove: number = -1;
            for (var i = 0; i < array.length; i++) {
                if (array[i] === itemToRemove) {
                    indexToRemove = i;
                }
            }

            if (indexToRemove >= 0) {
                array.splice(indexToRemove, 1);
            }
        }
    }

    /**
     * Process an argument passed to BindableManager as handler data.
     */
    export interface IArgumentProcessor {
        canProcess(argument:any, argumentIndex: number, options: any, context: IElement) : boolean;
        process(argument:any, options: any, context: IElement);
    }

    export class ArgumentProcessorsBasedHandler {
        private _processors: IArgumentProcessor[];

        constructor(processors: IArgumentProcessor[]){
            this._processors = processors;
        }

        public processArguments(args: any[], context:IElement): any {
            var lastArgument = args[args.length - 1];
            var options: any;
            if (this.isOptionsArgument(lastArgument)) {
                options = lastArgument;
                args.pop();
            } else {
                options = {};
            }

            var argumentIndex = 0;
            while (args.length > 0) {
                var argument = args[0];
                this.processHandlerArgument(argument, argumentIndex, options, context);
                args.splice(0, 1);
                argumentIndex++;
            }

            return options;
        }

        private processHandlerArgument(argument:any, index: number, options: any, context:IElement): void {
            for (var i = 0; i < this._processors.length; i++){
                var processor = this._processors[i];
                if (processor.canProcess(argument, index, options, context)) {
                    processor.process(argument, options, context);
                    return;
                }
            }

            throw new Error("Could not process argument " + argument);
        }

        /**
         * @protected
         */
        public isOptionsArgument(value: any): boolean {
            return JohnSmith.Common.TypeUtils.isObject(value);
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
        info: function(...args:any[]) : void {},
        warn: function(...args:any[]) : void {},
        error: function(...args:any[]) : void {}
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

    export class DefaultEventBus implements IEventBus {
        private _listeners: IListener[];

        constructor(){
            this._listeners = [];
        }

        public addListener(eventType:string, callback:(data:any) => void):void {
            var listener:IListener = {
                eventType: eventType,
                callback: callback
            };

            this._listeners.push(listener);
        }

        public trigger(eventType:string, data: any) : void {
            var listenersCount = this._listeners.length;
            for (var i = 0; i < listenersCount; i++) {
                var listener:IListener = this._listeners[i];
                if (listener.eventType === eventType) {
                    listener.callback(data);
                }
            }
        }
    }



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
        isEmpty: () => boolean;
        empty: () => void;
        appendHtml: (html:string) => IElement;
        appendText: (text:string) => IElement;
        getHtml: () => string;
        findRelative: (query:string) => IElement;
        remove: () => void;
        getNodeName: () => string;

        addClass: (className: string) => void;
        removeClass: (className: string) => void;

        setHtml(html:string);
        setText(text: string);

        getValue: () => string;
        setValue(value: string);

        getAttribute(attribute: string);
        setAttribute(attribute: string, value: string);

        getProperty(property: string):any;
        setProperty(property: string, value: any);

        attachEventHandler(event: string, callback: (target:IElement) => void) : any;
        detachEventHandler(event: string, handler: any);
        // [OBSOLETE]
        attachClickHandler: (callback: () => void) => void;
    }

    export interface IElementFactory {
        createElement(query:string);
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
}