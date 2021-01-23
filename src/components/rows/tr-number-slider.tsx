import { Component } from "react";
import * as Rx from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";
import "./tr-number-slider.scss";

interface IProps {
    title: string;
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
}

export class TrNumberSlider extends Component<IProps> {
    _subject = new Rx.Subject<number>();

    constructor(props: IProps) {
        super(props);
        this._subject
            .pipe(debounceTime(20))
            .subscribe((value) => {
                const { onChange } = this.props;
                onChange(value)
            });
    }

    render() {
        const { title, value, min, max } = this.props;

        const modified = (value: number) => this._subject.next(value);
        return (
            <tr className="tr-number-slider">
                <td className="tr-number-slider-title">{title}</td>
                <td>
                    <input
                        type="range"
                        value={value}
                        min={min}
                        max={max}
                        onChange={t => {
                            modified(parseInt(t.target.value));
                        }} />
                </td>
                <td>
                    <input
                        value={value}
                        type="number"
                        min={min}
                        max={max}
                        onChange={t => {
                            modified(parseInt(t.target.value));
                        }} />
                </td>
            </tr>
        );
    }
}