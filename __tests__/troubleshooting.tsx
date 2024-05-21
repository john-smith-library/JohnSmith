import { Troubleshooter } from '../src/troubleshooting/troubleshooter';
import { DomElement, HtmlDefinition } from '../src/view';
import { Disposable, NoopDisposable } from '../src/common';
import { Application } from '../src';
import { setupAppContainer } from './_helpers';
import '../src/view/jsx';

interface Issue {
  code: string;
}

interface BindingNotFoundIssue extends Issue {
  code: 'bindingNotFound';
  binding: string;
  context: DomElement;
}

interface ElementNotFoundIssue extends Issue {
  code: 'elementNotFound';
  element: HTMLElement | string;
  context: DomElement | null;
}

interface UnknownHtmlDefinitionIssue extends Issue {
  code: 'unknownHtmlDefinition';
  source: HtmlDefinition;
  context: DomElement;
}

type AnyIssue =
  | BindingNotFoundIssue
  | ElementNotFoundIssue
  | UnknownHtmlDefinitionIssue;

class TroubleshootingSpy implements Troubleshooter {
  public issues: AnyIssue[] = [];

  public bindingNotFound(code: string, context: DomElement): Disposable {
    this.issues.push({
      code: 'bindingNotFound',
      binding: code,
      context: context,
    });

    return NoopDisposable;
  }

  public elementNotFound(
    element: HTMLElement | string,
    context: DomElement | null
  ): Disposable {
    this.issues.push({
      code: 'elementNotFound',
      element: element,
      context: context,
    });

    return NoopDisposable;
  }

  public unknownHtmlDefinition(
    source: HtmlDefinition,
    context: DomElement
  ): Disposable {
    this.issues.push({
      code: 'unknownHtmlDefinition',
      source: source,
      context: context,
    });

    return NoopDisposable;
  }
}

describe('troubleshooting', () => {
  describe('application startup error', () => {
    it('reports an error', () => {
      const troubleshootingSpy = new TroubleshootingSpy();

      const application = new Application({
        troubleshooter: troubleshootingSpy,
      });

      application.render<null>('nonExistingElement', () => <span></span>, null);

      expect(troubleshootingSpy.issues.length).toBeGreaterThan(0);
      expect(troubleshootingSpy.issues[0]).toMatchObject({
        code: 'elementNotFound',
        element: 'nonExistingElement',
      });
    });
  });
  describe('unknown binding', () => {
    it(
      'reports an error',
      setupAppContainer(container => {
        const troubleshootingSpy = new TroubleshootingSpy();

        const application = new Application({
          troubleshooter: troubleshootingSpy,
        });

        application.render<null>(
          container,
          () => <span $unknown={'test'}></span>,
          null
        );

        expect(troubleshootingSpy.issues.length).toBeGreaterThan(0);
        expect(troubleshootingSpy.issues[0]).toMatchObject({
          code: 'bindingNotFound',
          binding: '$unknown',
        });
      })
    );
  });
});
