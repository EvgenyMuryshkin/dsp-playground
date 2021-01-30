import { Component } from "react";
import * as Rx from "rxjs";
import { debounceTime } from "rxjs/operators";
import { IMinMax } from "../../lib";
import "./tr-number-slider.scss";

interface IProps {
    title: string;
    value: number;
    minMax: IMinMax;
    onChange: (value: number) => void;
}

export class TrNumberSlider extends Component<IProps> {
    _subject = new Rx.Subject<number>();

    constructor(props: IProps) {
        super(props);
        this._subject
            .pipe(debounceTime(10))
            .subscribe((value) => {
                const { onChange } = this.props;
                onChange(value)
            });
    }

    render() {
        const { title, value, minMax, onChange } = this.props;
        const { min, max } = minMax;

        const modified = (value: number) => onChange(value);//this._subject.next(value);
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