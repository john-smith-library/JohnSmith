import { ObservableList } from '../reactive';
import { ErrorInfo } from './debug-troubleshooter';

export class ErrorsViewModel {
  public errors = new ObservableList<ErrorInfo>();
}
