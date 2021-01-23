import { Icon, IconifyIcon } from "@iconify/react";
import { Component } from "react";
import removeIcon from '@iconify-icons/el/remove-circle';
import addIcon from '@iconify-icons/el/plus-sign';
import questionIcon from '@iconify-icons/el/question';

interface IGlyphProps {
    glyph: "remove" | "add";
    onClick?: () => void;
}

interface IconifyIconExcule {
    icon: object;
}

type IconifyPassThroughProps = Omit<IconifyIcon, keyof IconifyIconExcule>;
type IProps = IGlyphProps & IconifyPassThroughProps;

export class Glyph extends Component<IProps> {
    resolveIcon(): object {
        switch (this.props.glyph) {
            case "remove": return removeIcon;
            case "add": return addIcon;
            default: return questionIcon;
        }
    }
    render() {
        const { onClick } = this.props;

        return <div style={{ display: "inline-block" }} onClick={() => onClick?.()}><Icon icon={this.resolveIcon()} {...this.props} /></div> 
    }
}