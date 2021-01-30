import * as Rx from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";

export class Debounce<T> {
    _subject = new Rx.Subject<T>();

    constructor(time: number, onNext: (value: T) => void) {
        this._subject
            .pipe(debounceTime(time))
            .subscribe((value) => {
                onNext(value)
            });
    }

    next(value: T) {
        this._subject.next(value);
    }
}