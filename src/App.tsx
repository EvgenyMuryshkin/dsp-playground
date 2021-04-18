import React from 'react';
import './App.scss';
import { Lesson1, Lesson2, Lesson3 } from './lessons';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Lesson0 } from './lessons/lesson0';

interface ILesson {
  title: string;
  render: () => JSX.Element;
}

interface IState {
  lessons: ILesson[];
  current: number;
}

export class App extends React.Component<{}, IState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      lessons: [
        {
          title: "Generator",
          render: () => <Lesson0 />
        },
        {
          title: "Signals",
          render: () => <Lesson1 />
        },
        {
          title: "Signals",
          render: () => <Lesson2 />
        }
      ],
      current: 0
    }
  }

  render() {
    const { lessons, current } = this.state;
    const lesson = lessons[current];

    return (
      <div className="App">
        <div className="footer">
          {lessons.map((l, idx) => <div className="menu-lesson" key={idx} onClick={() => this.setState({ current: idx })}>{l.title}</div>)}
        </div>
        <div className="main">
          {lesson.render()}
        </div>
      </div>
    )
  }
}

export default App;
