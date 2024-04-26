import { Troubleshooter } from './troubleshooter';
import { Disposable, NoopDisposable } from '../common';

export class NoopTroubleshooter implements Troubleshooter {
  public bindingNotFound(): Disposable {
    return NoopDisposable;
  }

  public elementNotFound(): Disposable {
    return NoopDisposable;
  }

  public unknownHtmlDefinition(): Disposable {
    return NoopDisposable;
  }
}
