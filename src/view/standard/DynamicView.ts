/**
 * Standard views module contains some predefined helper views.
 *
 * Import statement:
 *
 *     import { DynamicView } from 'john-smith/view/standard';
 *
 * @module view-standard
 */

/** */

import {HtmlDefinition, View, RenderingContext} from '../view-definition';

/**
 * Defines standard view that resolves nested content by calling
 * provided function.
 *
 * This example demonstrates how to use DynamicView for polymorphic
 * rendering:
 *
 *     // Define shapes hierarchy
 *     class Shape {}
 *     class Rectangle extends Shape {}
 *     class Circle extends Shape {}
 *
 *     // View model
 *     class ViewModel {
 *         constructor(public shape: Shape) {
 *         }
 *     }
 *
 *     // View
 *     class ApplicationView implements View<ViewModel> {
 *         template(viewModel: ViewModel): HtmlDefinition {
 *             return <section>
 *                        <DynamicView viewModel={viewModel.shape}>{
 *                            (shape: Shape) => {
 *                                if (shape instanceof Circle) {
 *                                    return <span>Circle</span>;
 *                                }
 *                                if (shape instanceof Rectangle) {
 *                                    return <span>Rectangle</span>;
 *                                }
 *
 *                                return <span>Unknown shape</span>
 *                             }
 *                        }</DynamicView>
 *                    </section>;
 *         }
 *     }
 */
export class DynamicView implements View<any> {
    template(viewModel: any, renderingContext: RenderingContext): HtmlDefinition {
        if (renderingContext.inner && renderingContext.inner.length === 1 && typeof renderingContext.inner[0] === 'function') {
            const viewResolver: (vm: any) => HtmlDefinition = renderingContext.inner[0];

            return viewResolver(viewModel);
        }

        throw Error('Unexpected dynamic view input');
    }

}