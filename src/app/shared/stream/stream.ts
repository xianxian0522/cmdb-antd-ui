import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

export function flow<T>(stream: Observable<T>,
                        onError?: (err: any, caught?: Observable<T>) => void): Observable<T> {
  if (!onError) {
    onError = err => console.error(err);
  }
  const streamMaker = () => stream.pipe(
    catchError((err, caught) => {
      onError(err, caught);
      return streamMaker();
    }));
  return streamMaker();
}
