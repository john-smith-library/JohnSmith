import {HtmlDefinition} from '../view-definition';

export const JxsInitializer = () => {
    function domConstruct(): HtmlDefinition {
        const
            argsCount = arguments.length,
            nested = [];

        for (let i = 2; i < argsCount; i++) {
            nested.push(arguments[i]);
        }

        return {
            element: arguments[0],
            attributes: argsCount > 1 ? arguments[1] : null,
            nested: nested
        };
    }

    (window as any)['JS'] = {
        d: domConstruct
    };
};
