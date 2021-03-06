import React, { Component } from "react";
import oldPaper from '../../images/oldpaper.jpg'
import './Canvas.css'
export default class extends Component {
  
  componentDidUpdate(prevProps){

if (prevProps.lines !== this.props.lines){
  this.props.lines[0].map(line=>{
    return this.drawLine(line)
  })
}

  }
  static defaultProps = {
    loadTimeOffset: 5,
    brushSize: 12,
    brushColor: "#000",
    canvasWidth: 600,
    canvasHeight: 600,
    disabled: false
  };

  constructor(props) {
    super(props);

    this.isMouseDown = false;
    this.linesArray = [];
    this.startDrawIdx = [];
    this.timeoutValidity = 0;
  }

  // getSaveData = () => {

  //   const saveData = {
  //     linesArray: this.linesArray,
  //     width: this.props.canvasWidth,
  //     height: this.props.canvasHeight
  //   };
  //   return JSON.stringify(saveData);
  // };

  // loadSaveData = (saveData, immediate) => {
  //   try {
  //     if (typeof saveData !== "string") {
  //       throw new Error("saveData needs to be a stringified array!");
  //     }
  //     // parse first to catch any possible errors before clear()
  //     const { linesArray, width, height } = JSON.parse(saveData);

  //     if (!linesArray || typeof linesArray.push !== "function") {
  //       throw new Error("linesArray needs to be an array!");
  //     }

  //     // start the load-process
  //     this.clear();

  //     if (
  //       width === this.props.canvasWidth &&
  //       height === this.props.canvasHeight
  //     ) {
  //       this.linesArray = linesArray;
  //     } else {
  //       // we need to rescale the lines based on saved & current dimensions
  //       const scaleX = this.props.canvasWidth / width;
  //       const scaleY = this.props.canvasHeight / height;
  //       const scaleAvg = (scaleX + scaleY) / 2;

  //       this.linesArray = linesArray.map(line => ({
  //         ...line,
  //         endX: line.endX * scaleX,
  //         endY: line.endY * scaleY,
  //         startX: line.startX * scaleX,
  //         startY: line.startY * scaleY,
  //         size: line.size * scaleAvg
  //       }));
  //     }

  //     this.redraw(immediate);
  //   } catch (err) {
  //     throw err;
  //   }
  // };

  redraw = immediate => {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.props.canvasWidth, this.props.canvasHeight);
    }

    this.timeoutValidity++;
    const timeoutValidity = this.timeoutValidity;
    this.linesArray.forEach((line, idx) => {
      // draw the line with a time offset
      // creates the cool drawing-animation effect
      if (!immediate) {
        window.setTimeout(
          () => {
            if (timeoutValidity === this.timeoutValidity) {
              this.drawLine(line);
            }
          },
          idx * this.props.loadTimeOffset
        );
      } else {
        // if the immediate flag is true, draw without timeout
        this.drawLine(line);
      }
    });
  };

  getMousePos = e => {
    const rect = this.canvas.getBoundingClientRect();
    // console.log(this.linesArray)

    // use cursor pos as default
    let clientX = e.clientX;
    let clientY = e.clientY;
    // console.log(" x Coord = "+ clientX + ": Y Coord = " + clientY);
    // use first touch if available
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    // return mouse/touch position inside canvas
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  clear = () => {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.props.canvasWidth, this.props.canvasHeight);
    }
    this.timeoutValidity++;
    this.linesArray = [];
    this.startDrawIdx = [];
  };

  undo = () => {
    if (this.startDrawIdx.length > 0) {
      this.linesArray.splice(
        this.startDrawIdx.pop()
      );
      this.redraw(true);
      return true;
    }
    return false;
  };

  drawLine = line => {
    if (!this.ctx) return;
    this.ctx.strokeStyle = line.color;
    this.ctx.lineWidth = line.size;
    this.ctx.lineCap = "round";
    this.ctx.beginPath();
    this.ctx.moveTo(line.startX, line.startY);
    this.ctx.lineTo(line.endX, line.endY);
    this.ctx.stroke();
  };

  drawStart = e => {
    this.isMouseDown = true;
    this.startDrawIdx.push(this.linesArray.length);
    const { x, y } = this.getMousePos(e);
    this.x = x;
    this.y = y;
  
    // make sure we start painting, useful to draw simple dots
    this.draw(e);
  };
  
  drawEnd = () => {
    this.isMouseDown = false;
  };
  
  draw = e => {
    if (!this.isMouseDown || this.props.disabled) return;
    
    // calculate the current x, y coords
    const { x, y } = this.getMousePos(e);
    
    // Offset by 1 to ensure drawing a dot on click
    const newX = x + 1;
    const newY = y + 1;
    
    // create current line object
    const line = {
      color: this.props.brushColor,
      size: this.props.brushSize,
      startX: this.x,
      startY: this.y,
      endX: newX,
      endY: newY
    };
    
    // actually draw the line
    this.drawLine(line);
    // console.log(this.props.newCanvas)
    
    // push it to our array of lines
    this.linesArray.push(line);
    this.props.trackCanvas(this.linesArray)
    
    // notify parent that a new line was added
    if (typeof this.props.onChange === "function") {
      this.props.onChange(this.linesArray);
    }
    
    // set current x, y coords
    this.x = newX;
    this.y = newY;
  };
  
  render() {
  
    return (
      <div>
      <canvas
        width={this.props.canvasWidth}
        height={this.props.canvasHeight}
        className="Custom"
        style={{
          // display: "block",
          // backgroundImage: `url(${oldPaper})`,
          // backgroundSize: `cover`,
          border: `black groove 10px`, 
          touchAction: "none",
          ...this.props.style
        }}
        ref={canvas => {
          if (canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext("2d");
          }
        }}
        onMouseDown={this.drawStart}
        onClick={() => false}
        onMouseUp={this.drawEnd}
        onMouseOut={this.drawEnd}
        onMouseMove={this.draw}
        onTouchStart={this.drawStart}
        onTouchMove={this.draw}
        onTouchEnd={this.drawEnd}
        onTouchCancel={this.drawEnd}
      /><br/>
      <button onClick={this.clear}>Clear Canvas</button>
      <button onClick={this.undo}>Undo last</button>
      </div>
    );
  }
}
