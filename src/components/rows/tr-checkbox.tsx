import { Component } from "react";
import "./tr-checkbox.scss";

interface IProps {
    title: string;
    value: boolean;
    onChange: (value: boolean) => void;
}

export class TrCheckbox extends Component<IProps> {
    render() {
        const { title, value, onChange } = this.props;
        return (
            <tr className="tr-checkbox">
                <td className="tr-checkbox-title">{title}</td>
                <td className="tr-checkbox-checkbox" colSpan={2}>
                    <input type="checkbox" checked={value} onChange={(e) => {
                        onChange(e.target.checked);
                    }} />
                </td>
            </tr>
        )
    }
}