import {Disposable} from '../../common';
import {ObservableList, DataChangeReason} from '../../reactive';
import {DomElement} from '../element';
import {ViewDefinition} from '../view';
import {ViewRenderer} from '../view-renderer';

interface IRenderedValueData {
    value: any;
    renderedValue: Disposable;
}

/**
 * Connects an observable list object to an HTML element.
 * Renders changed lists items on observable updates.
 */
export class ObservableListViewConnector<T> implements Disposable {
    private readonly _link: Disposable;

    private _renderedValues: IRenderedValueData[];

    constructor(
        private _observable: ObservableList<T>,
        private _contentDestination: DomElement,
        private _viewDefinition: ViewDefinition<T>,
        private _viewRenderer: ViewRenderer){

        this._renderedValues = [];
        this._link = _observable.listen(
            (value, oldValue, details) => {
                this.doRender(details.portion || [], details.reason);
            });
    }

    dispose():void {
        if (this._link) {
            this._link.dispose();
        }

        for (let i = 0; i < this._renderedValues.length; i++){
            if (this._renderedValues[i].renderedValue.dispose){
                this._renderedValues[i].renderedValue.dispose();
            }
        }
    }

    private findRenderedValue(value: any) : Disposable|null {
        for (let i = 0; i < this._renderedValues.length; i++){
            let renderedItem = this._renderedValues[i];
            if (renderedItem.value === value){
                return renderedItem.renderedValue;
            }
        }

        return null;
    }

    private removeRenderedValue(renderedValue: Disposable): void {
        let indexToRemove = -1;
        for (let i = 0; i < this._renderedValues.length; i++){
            if (this._renderedValues[i].renderedValue === renderedValue){
                indexToRemove = i;
            }
        }

        if (indexToRemove >=0) {
            this._renderedValues.splice(indexToRemove, 1);
        }
    }

    private doRender(value: T[], reason:DataChangeReason):void {
        let i;

        if (reason == DataChangeReason.remove){
            for (i = 0; i < value.length; i++){
                const
                    item = value[i],
                    itemRenderedValue = this.findRenderedValue(item);

                if (itemRenderedValue) {
                    itemRenderedValue.dispose();
                    this.removeRenderedValue(itemRenderedValue);
                }
            }
        } else if (reason == DataChangeReason.add) {
            this.appendItems(value);
        } else {
            for (i = 0; i < this._renderedValues.length; i++){
                this._renderedValues[i].renderedValue.dispose();
            }

            this._renderedValues = [];
            this.appendItems(value);
        }
    }

    private appendItems(items:any[]):void {
        if (!items) {
            return;
        }

        for (let i = 0; i < items.length; i++){
            const
                item = items[i],
                itemRenderedValue = this._viewRenderer.render(
                    this._contentDestination,
                    this._viewDefinition,
                    item);

            this._renderedValues.push({
                value: item,
                renderedValue: itemRenderedValue
            });
        }
    }
}