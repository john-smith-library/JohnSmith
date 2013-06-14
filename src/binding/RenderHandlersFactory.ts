///// <reference path="Contracts.ts"/>
///// <reference path="Handling.ts"/>
///// <reference path="RenderValueHandler.ts"/>
///// <reference path="RenderListHandler.ts"/>
//
//module JohnSmith.Binding {
//    export class RenderHandlerFactory implements IHandlerFactory {
//        private _destinationFactory: Common.IElementFactory;
//        private _markupResolver: Common.IMarkupResolver;
//        private _mapper: IValueToElementMapper;
//
//        constructor(destinationFactory: Common.IElementFactory, markupResolver: Common.IMarkupResolver, mapper: IValueToElementMapper){
//            this._destinationFactory = destinationFactory;
//            this._markupResolver = markupResolver;
//            this._mapper = mapper;
//        }
//
//        public createHandler(handlerData: any, bindable:IBindable, context: Common.IElement): IBindableHandler {
//            if (!handlerData) {
//                return null;
//            }
//
//            var options: RenderHandlerOptions = handlerData;
//            if (options.handler && options.handler !== "render"){
//                return null;
//            }
//
//            if (options.type && options.type !== "list") {
//                return null;
//            }
//
//            var isList = false;
//            if (!options.type) {
//                isList = this.isList(bindable);
//                options.type = isList ? "list" : "value";
//            } else {
//                isList = options.type === "list";
//            }
//
//            this.fillContentDestination(options, context);
//            this.fillRenderer(options);
//
//            switch (){
//
//            }
//
//            this.fillListOptions(options);
//
//            var isSelectable = options.selectable || false;
//            var selectionOptions:SelectionOptions = {
//                isSelectable: isSelectable,
//                selectedItem: options.selectedItem,
//                setSelectedCallback: options.setSelection
//            };
//
//            var handler = new RenderListHandler(
//                options.contentDestination,
//                options.renderer,
//                options.mapper,
//                selectionOptions);
//
//            return handler;
//        }
//
//        public fillContentDestination(options:RenderHandlerOptions, context:Common.IElement){
//            if (!options.contentDestination) {
//                options.contentDestination = context == null ?
//                    this._destinationFactory.createElement(options.to) :
//                    context.findRelative(options.to);
//            }
//        }
//
//        public fillRenderer(options:RenderHandlerOptions){
//            if (!options.renderer) {
//                if (!options.formatter) {
//                    var encode = true;
//                    if (options.encode !== undefined){
//                        encode = options.encode;
//                    }
//
//                    var defaultValueType = encode ? Common.ValueType.text : Common.ValueType.html;
//                    options.formatter =  new DefaultFormatter(defaultValueType);
//                }
//
//                options.renderer = new FormatterBasedRenderer(options.formatter, this._markupResolver);
//            }
//        }
//
//        private fillListOptions(options:RenderListOptions){
//            if (!options.mapper) {
//                options.mapper = this._mapper;
//            }
//
//            if (options.selectedItem){
//                options.selectable = true;
//
//                if (!options.setSelection){
//                    options.setSelection = function(value: any){
//                        options.selectedItem.setValue(value);
//                    }
//                }
//            }
//
//
//        }
//
//        /**
//         * Checks id the bindable stores an array.
//         */
//        public isList(bindable:IBindable):bool {
//            if (bindable instanceof BindableList){
//                return true;
//            } else if (bindable){
//                var value = bindable.getValue();
//                if (value instanceof Array){
//                    return true;
//                }
//            }
//
//            return false;
//        }
//    }
//
//}
