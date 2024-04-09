import React, { useEffect, useState } from "react";

const HEIGHT = 500;
const WIDTH = 450;

const SpinWheel = ({
  segments,
  segmentColors,
  // winningSegment,
  onFinish,
  primaryColor = "black",
  contrastColor = "white",
  size = 200,
  upDuration = 500,
  downDuration = 600,
  fontFamily = "proxima-nova",
  buttonText = "Spin",
}) => {
  let canvasContext = null;
  // const centerX = 250 // width 500 / 2 centner circle
  const centerX = WIDTH / 2; // width 500 / 2 centner circle
  // const centerY = 225 // height 450 / 2
  const centerY = HEIGHT / 2; // height 450 / 2
  let winningSegment;
  let currentSegment = "";

  let angleCurrent = 0;
  let angleDelta = 0; // ! ? for spin
  let spinStart = 0; // ! ?
  let frames = 0;
  // let maxSpeed = Math.PI / `${segments.length}`
  // let maxSpeed = Math.PI / segments.length
  let maxSpeed = 0.05;
  // console.log('maxSpeed app ', maxSpeed) // maxSpeed 0.20943951023931953
  let timerHandle = 0;
  const timerDelay = segments.length;
  const upTime = segments.length * upDuration; // ! ?
  const downTime = segments.length * downDuration;

  let isStarted = false;
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    initWheel();
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 0);
    return () => clearInterval(timerHandle);
  }, []);

  const initWheel = () => {
    initCanvas();
    clear();
    drawWheel();
    drawNeedle();
  };

  const clear = () => {
    const ctx = canvasContext;
    // ctx.clearRect(0, 0, 600, 500)
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    // CanvasRect.clearRect(x: number, y: number, w: number, h: number): void
  };

  const initCanvas = () => {
    let canvas = document.getElementById("canvas");
    // old browser support:
    // console.log('navigator initCanvas', navigator)
    if (navigator.userAgent.indexOf("MSIE") !== -1) {
      canvas = document.createElement("canvas");
      // canvas.setAttribute('width', 600)
      canvas.setAttribute("width", WIDTH);
      // canvas.setAttribute('height', 450)
      canvas.setAttribute("height", HEIGHT);
      canvas.setAttribute("id", "canvas");
      document.getElementById("wheel").appendChild(canvas);
    }
    // end old browser support
    canvas.addEventListener("click", spinWheel, false);
    canvasContext = canvas.getContext("2d"); // ! ?
    // console.log('canvasContext initCanvas', canvasContext)
    // canvasContext CanvasRenderingContext2D {canvas: canvas#canvas, globalAlpha: 1, globalCompositeOperation: 'source-over', filter: 'none', etc, ... }
  };

  const drawWheel = () => {
    const ctx = canvasContext;
    let lastAngle = angleCurrent; // ! ?
    const length = segments.length;
    const PI2 = Math.PI * 2; // ! ? * 1 half circle make
    ctx.lineWidth = 1;
    ctx.strokeStyle = primaryColor; // separator black lines make between each segment
    // ctx.textBaseline = 'middle'
    // ctx.textAlign = 'center'
    // ctx.font = '1em ' + fontFamily

    for (let index = 1; index <= length; index++) {
      const angle = PI2 * (index / length) + angleCurrent; // ! ?
      drawSegment(index - 1, lastAngle, angle); // ! ?
      lastAngle = angle; // ! ?
    }

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, PI2, false); // ! from center circle
    // (x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void
    ctx.closePath();
    ctx.fillStyle = primaryColor; // black circle inside
    ctx.lineWidth = 10;
    ctx.strokeStyle = contrastColor; // white border outside
    ctx.fill();
    ctx.font = "bold 1em " + fontFamily;
    ctx.fillStyle = contrastColor; // center 'Spin' text color
    ctx.textAlign = "center";
    ctx.fillText(buttonText, centerX, centerY);
    ctx.stroke();

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, PI2, false); // size 200 cirlce
    // CanvasPath.arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void
    ctx.closePath();

    ctx.lineWidth = 10;
    ctx.strokeStyle = primaryColor;
    ctx.stroke();
  };

  const drawSegment = (index, lastAngle, angle) => {
    const ctx = canvasContext;
    const value = segments[index];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, size, lastAngle, angle, false);
    // ctx.arc(centerX, centerY, size, 0, 0, false) // ! tak no style, no segments white cirlce wiht 90degree 1 black line
    // CanvasPath.arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fillStyle = segmentColors[index];
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(centerX, centerY);
    // ctx.rotate((0 + 45) / 2) // ! on 10'o lccokc angle all text
    // ctx.rotate((0 + 0) / 2) // ! 90 degree all text
    ctx.rotate((lastAngle + angle) / 2); // ! move text / rotate, to fit segments, otherwise on 90 degree angle text together
    ctx.fillStyle = contrastColor;
    ctx.font = "0.8em " + fontFamily;
    ctx.fillText(value.substr(0, 21), size / 2 + 20, 0); // ! move close/away from center
    ctx.restore();
  };

  const drawNeedle = () => {
    const ctx = canvasContext;
    ctx.lineWidth = 1;
    ctx.strokeStyle = contrastColor;
    ctx.fileStyle = contrastColor;
    ctx.beginPath();
    ctx.moveTo(centerX + 20, centerY - 50);
    ctx.lineTo(centerX - 20, centerY - 50);
    ctx.lineTo(centerX, centerY - 70); // ! all 3 need to triangle?
    ctx.closePath();
    ctx.fill();

    const change = angleCurrent + Math.PI / 2; // ! ?

    let index =
      segments.length -
      Math.floor((change / (Math.PI * 2)) * segments.length) -
      1; // ! ?
    if (index < 0) index = index + segments.length;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "red";
    ctx.font = "bold 1.5em " + fontFamily;

    currentSegment = segments[index];

    isStarted &&
      ctx.fillText(currentSegment, centerX + 10, centerY + size + 35); // current segment label text
    // console.log('currentSegment drawNeedle', currentSegment) // currentSegment won 2
  };

  const spinWheel = () => {
    const randomNum = Math.floor(Math.random() * segments.length - 1);
    // console.log('randomNum spinWheel', randomNum)
    winningSegment = segments[randomNum];
    isStarted = true;
    if (timerHandle === 0) {
      spinStart = new Date().getTime(); // ! ?
      // console.log('spinStart', spinStart)
      // maxSpeed = Math.PI / ((segments.length*2) + Math.random()) // old code
      // maxSpeed = Math.PI / segments.length // ! ?
      // maxSpeed = 0.05
      // console.log('maxSpeed spinWheel', maxSpeed)
      frames = 0; // ! ?
      timerHandle = setInterval(timerTick, timerDelay); // !
      // console.log('timerHandle spinWheel', timerHandle)
    }
  };

  const timerTick = () => {
    frames++; // ! ?
    // draw()
    clear();
    drawWheel();
    drawNeedle();

    const duration = new Date().getTime() - spinStart; // !
    //console.log('duration timerTick', duration)  duration 4096 increasing, etc.
    let progress = 0; // ! ?
    let finished = false; // ! ?

    if (upTime > duration) {
      progress = duration / upTime; // ! ?
      // console.log('progress upTime > duration', progress)
      // duration 23
      // progress 0.015333333333333332
      // duration 39
      // progress 0.026
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2); // ! ?
      // console.log('upTime > duration angleDelta', angleDelta)
    } else {
      // ! ?
      if (winningSegment) {
        if (currentSegment === winningSegment && frames > segments.length) {
          // progress = duration / upTime
          progress = duration / (upTime * 2); // ! slowdown
          // console.log('winningSegment - progress = duration / upTime', progress)
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
          // progress = 1 // ! ?
          // console.log('currentSegment === winningSegment && frames > segments.length angleDelta',angleDelta)
        } else {
          progress = duration / downTime; // ! ?
          // console.log('winningSegment else - progress = duration / downTime', progress)
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
          // console.log('else angleDelta', angleDelta)
        }
      } else {
        // not winning segment:
        progress = duration / downTime; // ! ?
        // console.log(' else - progress = duration / downTime', progress)
        angleDelta =
          maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
        // console.log('else2 angleDelta', angleDelta)
      }
      if (progress >= 1) finished = true;
    }

    // ! ?
    angleCurrent += angleDelta;
    while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2;

    if (finished) {
      setIsFinished(true);
      onFinish(currentSegment); // console logs winner
      clearInterval(timerHandle);
      timerHandle = 0;
      angleDelta = 0;
    }
  };

  return (
    <div id="wheel">
      <canvas
        id="canvas"
        // width={500}
        width={WIDTH}
        // height={500}
        height={HEIGHT}
        
      />
    </div>
  );
};

export default SpinWheel;
