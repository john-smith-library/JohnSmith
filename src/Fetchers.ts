export class FetcherType {
    public static Value: string = "value";
    public static CheckedAttribute: string = "checkedAttribute";
}

export interface IFetcherFactory {
    getByKey(key: string):IFetcher;
    getForElement(element: IElement);
}

export interface IFetcher {
    isSuitableFor(element: IElement): boolean;
    valueToElement(value: any, element: IElement): void;
    valueFromElement(element: IElement): any;
}

export class ValueFetcher implements IFetcher {
    public isSuitableFor(element: IElement): boolean {
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

    public valueToElement(value: any, element: IElement): void {
        element.setValue(value);
    }

    public valueFromElement(element: IElement): any {
        return element.getValue();
    }
}

export class CheckedAttributeFetcher implements IFetcher {
    public isSuitableFor(element: IElement): boolean {
        var nodeName = element.getNodeName();
        if (nodeName) {
            nodeName = nodeName.toUpperCase();
            var type = element.getAttribute("type");
            return nodeName === "INPUT" && type && type.toUpperCase() === "CHECKBOX";
        }

        return false;
    }

    public valueToElement(value: any, element: IElement): void {
        element.setProperty("checked", value);
    }

    public valueFromElement(element: IElement): any {
        var isChecked = false;
        if (element.getProperty("checked")){
            isChecked = true;
        }

        return isChecked;
    }
}

export class FetcherFactory implements IFetcherFactory {
    private _items = {};

    public getForElement(element: IElement) {
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