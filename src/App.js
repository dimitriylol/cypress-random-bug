import React from "react";
import ReactDOM from "react-dom";

class ToolTip extends React.Component {
  constructor(props) {
    super(props);

    this.state = { visible: false, x: 0, y: 0, type: "none" };
  }
  render() {
    let { state } = this;

    let visibility = state.visible === true ? "on" : "off";

    let style = {
      left: state.x + window.scrollX + "px",
      top: state.y + window.scrollY + "px"
    };

    let classNames = {};

    if (state.type !== null && state.type !== "none") {
      classNames[state.type] = true;
    }

    classNames[visibility] = true;

    return (
      <div
        id="tooltip"
        className={Object.keys(classNames).join(" ")}
        style={style}
      >
        <div className="tooltip-arrow" />
        <div className="tooltip-inner">ToolTip Component</div>
      </div>
    );
  }
  componentDidMount() {}
  componentWillUnmount() {}
  pastShow(hoverRect) {
    // position the tooltip after showing it

    let ttNode = ReactDOM.findDOMNode(this);

    if (ttNode != null) {
      let x = 0,
        y = 0;

      const docWidth = document.documentElement.clientWidth,
        docHeight = document.documentElement.clientHeight;

      let rx = hoverRect.x + hoverRect.width, // most right x
        lx = hoverRect.x, // most left x
        ty = hoverRect.y, // most top y
        by = hoverRect.y + hoverRect.height; // most bottom y

      // tool tip rectange
      let ttRect = ttNode.getBoundingClientRect();

      let bRight = rx + ttRect.width <= window.scrollX + docWidth;
      let bLeft = lx - ttRect.width >= 0;

      let bAbove = ty - ttRect.height >= 0;
      let bBellow = by + ttRect.height <= window.scrollY + docHeight;

      let newState = {};

      // the tooltip doesn't fit to the right
      if (bRight) {
        x = rx;

        y = ty + (hoverRect.height - ttRect.height);

        if (y < 0) {
          y = ty;
        }

        newState.type = "right";
      } else if (bBellow) {
        y = by;

        x = lx + (hoverRect.width - ttRect.width);

        if (x < 0) {
          x = lx;
        }

        newState.type = "bottom";
      } else if (bLeft) {
        x = lx - ttRect.width;

        y = ty + (hoverRect.height - ttRect.height);

        if (y < 0) {
          y = ty;
        }

        newState.type = "left";
      } else if (bAbove) {
        y = ty - ttRect.height;

        x = lx + (hoverRect.width - ttRect.width);

        if (x < 0) {
          x = lx;
        }

        newState.type = "top";
      }

      newState = { ...newState, x: x, y: y };

      this.setState(newState);
    }
  }
  show(hoverRect) {
    let { pastShow } = this;

    // setState will execute the pastShow with hoverRect as the tool tip becomes visible
    this.setState({ visible: true }, pastShow.bind(this, hoverRect));
  }
  hide() {
    this.setState({ visible: false });
  }
}

class Btn extends React.Component {
  events = {};
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      text: props.children
    };

    this.events.onMouseOver = props.onMouseOver;
    this.events.onMouseOut = props.onMouseOut;
  }
  render() {
    return (
      <button
        type="button"
        id={this.state.id}
        style={{width: '49%', height: '49%'}}
        onMouseOver={this.events.onMouseOver}
        onMouseLeave={this.events.onMouseOut}
      >
        {this.state.text}
      </button>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    console.log("* app constructor");

    this.setupRefs();

    this.setupEvents();
  }
  setupRefs() {
    this.toolTip = React.createRef();
  }
  setupEvents() {
    this.createBtn = this.createBtn.bind(this);
    this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
    this.handleOnMouseOut = this.handleOnMouseOut.bind(this);
  }
  handleOnMouseOut(evt) {
    this.toolTip.current.hide();
  }
  handleOnMouseOver(evt) {
    // get hovered element reference
    let el = evt.currentTarget;

    if (el != null) {
      let rect = el.getBoundingClientRect();

      this.toolTip.current.show(rect);
    }
  }
  createBtn(id, text) {
    var { handleOnMouseOver, handleOnMouseOut } = this;

    return (
      <Btn
        id={id}
        onMouseOver={handleOnMouseOver}
        onMouseOut={handleOnMouseOut}
      >
        {text}
      </Btn>
    );
  }
  render() {
    let { createBtn } = this;

    return (
      <div>
        {createBtn("btnLeft", "click 1")}
        {createBtn("btnRight", "click 2")}
        {createBtn("btnBtmR", "click 3")}
        {createBtn("btnBtmL", "click 4")}
        <ToolTip ref={this.toolTip} />
      </div>
    );
  }
  componentDidMount() {}
}

export default App;
