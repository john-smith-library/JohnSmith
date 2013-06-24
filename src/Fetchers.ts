/// <reference path="Common.ts"/>

module JohnSmith.Fetchers {
    export class FetcherType {
        public static Value: string = "value";
        public static CheckedAttribute: string = "checkedAttribute";
    }

    export interface IFetcherFactory {
        getByKey(key: string):IFetcher;
    }

    export interface IFetcher {
        valueToElement(value: any, element: Common.IElement): void;
        valueFromElement(element: Common.IElement): any;
    }

    class ValueFetcher implements IFetcher {
        public valueToElement(value: any, element: Common.IElement): void {
            element.setValue(value);
        }

        public valueFromElement(element: Common.IElement): any {
            return element.getValue();
        }
    }

    class CheckedAttributeFetcher implements IFetcher {
        public valueToElement(value: any, element: Common.IElement): void {
            element.setAttribute("checked", value);
        }

        public valueFromElement(element: Common.IElement): any {
            var isChecked = false;
            if (element.getAttribute("checked")){
                isChecked = true;
            }

            return isChecked;
        }
    }

    class FetcherFactory implements IFetcherFactory {
        private _items = {};

        public getByKey(key: string):IFetcher {
            return this._items[key];
        }

        public registerFetcher(key: string, fetcher:IFetcher):void {
            this._items[key] = fetcher;
        }
    }

    var factory = new FetcherFactory();
    factory.registerFetcher(FetcherType.Value, new ValueFetcher());
    factory.registerFetcher(FetcherType.CheckedAttribute, new CheckedAttributeFetcher());

    Common.JS.ioc.register("fetcherFactory", factory);
}
