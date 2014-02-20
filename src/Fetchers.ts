/// <reference path="Common.ts"/>

module JohnSmith.Fetchers {
    export class FetcherType {
        public static Value: string = "value";
        public static CheckedAttribute: string = "checkedAttribute";
    }

    export interface IFetcherFactory {
        getByKey(key: string):IFetcher;
        getForElement(element: Common.IElement);
    }

    export interface IFetcher {
        isSuitableFor(element: Common.IElement): boolean;
        valueToElement(value: any, element: Common.IElement): void;
        valueFromElement(element: Common.IElement): any;
    }

    class ValueFetcher implements IFetcher {
        public isSuitableFor(element: Common.IElement): boolean {
            var nodeName = element.getNodeName();
            if (nodeName) {
                nodeName = nodeName.toUpperCase();

                if (nodeName === "TEXTAREA" || nodeName === "SELECT") {
                    return true;
                }

                if (nodeName === "INPUT") {
                    var inputType = element.getAttribute("type");
                    if ((!inputType) || inputType.toUpperCase() === "TEXT") {
                        return true;
                    }
                }
            }

            return false;
        }

        public valueToElement(value: any, element: Common.IElement): void {
            element.setValue(value);
        }

        public valueFromElement(element: Common.IElement): any {
            return element.getValue();
        }
    }

    class CheckedAttributeFetcher implements IFetcher {
        public isSuitableFor(element: Common.IElement): boolean {
            var nodeName = element.getNodeName();
            if (nodeName) {
                nodeName = nodeName.toUpperCase();
                var type = element.getAttribute("type");
                return nodeName === "INPUT" && type && type.toUpperCase() === "CHECKBOX";
            }

            return false;
        }

        public valueToElement(value: any, element: Common.IElement): void {
            element.setProperty("checked", value);
        }

        public valueFromElement(element: Common.IElement): any {
            var isChecked = false;
            if (element.getProperty("checked")){
                isChecked = true;
            }

            return isChecked;
        }
    }

    class FetcherFactory implements IFetcherFactory {
        private _items = {};

        public getForElement(element: Common.IElement) {
            for (var key in this._items) {
                var fetcher = this._items[key];
                if (fetcher.isSuitableFor(element)){
                    return fetcher;
                }
            }

            return null;
        }

        public getByKey(key: string):IFetcher {
            return this._items[key];
        }

        public registerFetcher(key: string, fetcher:IFetcher):FetcherFactory {
            this._items[key] = fetcher;
            return this;
        }
    }

    export var factory:IFetcherFactory = new FetcherFactory()
        .registerFetcher(FetcherType.Value, new ValueFetcher())
        .registerFetcher(FetcherType.CheckedAttribute, new CheckedAttributeFetcher());
}
