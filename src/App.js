import React from "react";

class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = { count: 5 };
    this.increment = this.increment.bind(this); 
    this.decrement = this.decrement.bind(this);
  }

  increment() {
    this.setState((curState) => {
      return { count: curState.count + 1 };
    });
  }

  decrement() {
    this.setState((curState) => {
      return { count: curState.count - 1 };
    });
  }

  render() {
    const date = new Date("June 21, 2027");
    date.setDate(date.getDate() + this.state.count);

    return (
      <div>
        <button onClick={this.increment}>+</button>
        <span>
          {date.toDateString()} [{this.state.count}]
        </span>
        <button onClick={this.decrement}>-</button>
      </div>
    );
  }
}

export default Counter;
