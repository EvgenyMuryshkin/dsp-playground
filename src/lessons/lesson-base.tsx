import React from "react";

export abstract class LessonBase<TProps, TState> extends React.Component<TProps, TState> {
    abstract renderControls(): JSX.Element;
    abstract renderContent(): JSX.Element;

    render() {
        return (
            <div className="lesson-layout">
                <div>
                    {this.renderControls()}
                </div>
                <div className="lesson-content">
                    {this.renderContent()}
                </div>
            </div>
        )
    }
}