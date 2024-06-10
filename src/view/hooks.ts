/**
 * Hooks allow to intercept particular View rendering stages.
 *
 * Approximate rendering diagram to understand the Hooks order:
 *
 * ![Hooks Diagram](media://hooks.png)
 *
 * @module
 */

import { OptionalDisposables } from '../common';
import { DomElement } from './element';
import { DomEngine } from './dom-engine';

/**
 * Defines On Before Init view hook.
 *
 * This hook is called after view markup composed and attached to the DOM
 * but before any bindings and listeners connected. This is a good point
 * to manually modify the DOM, setup manual bindings and so on.
 *
 */
export interface OnBeforeInit {
  /**
   * A callback method that is invoked right after the corresponding View
   * is processed and added to the DOM but before any connectors are activated.
   *
   * Any changes to View Model would not take any affects on DOM right away at this
   * stage so this hook is not recommended for such manipulations (use {@link OnInit}
   * instead). The hook thought can be used for subscribing to View Model events.
   * In such case please make sure the unsubscribe call is returned as result.
   *
   * ```typescript
   * [[include:view/hooks-onbeforeinit.tsx]]
   * ```
   *
   * View hosting DOM element and DOM Engine service are provided in case of any manual
   * changes should be applied.
   *
   * @param root rendered component root DOM Element. Can be null if the corresponding view
   * does not render any HTML and just renders another component as a root.
   * @param domEngine a helper service to build DOM manually.
   */
  onBeforeInit(
    root: DomElement | null,
    domEngine: DomEngine
  ): OptionalDisposables;
}

/**
 * Describes OnInit view hook.
 */
export interface OnInit {
  onInit(root: DomElement | null, domEngine: DomEngine): OptionalDisposables;
}

/**
 * Defines On Unrender view hook.
 */
export interface OnUnrender {
  onUnrender(
    unrender: () => void,
    root: DomElement | null,
    domEngine: DomEngine
  ): void;
}
