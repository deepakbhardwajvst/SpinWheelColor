import SpinWheel from "./components/SpinWheel";

function App() {
  const ColorName = [
    "Red",
    "Yellow",
    "Purple",
    "Blue",
    "Green",
    "Orange",
    "Pink",
    "Gold",
    "Yellow",
    "Purple",
    "Blue",
    "Green",
    "Orange",
    "Pink",
    "Gold",
  ];

  const segmentColors = [
    "#FF0000", // Red
    "#FFFF00", // Yellow
    "#800080", // Purple
    "#0000FF", // Blue
    "#008000", // Green
    "#FFA500", // Orange
    "#FF69B4", // Pink
    "#FFD700", // Gold
    "#FFFF00", // Yellow
    "#800080", // Purple
    "#0000FF", // Blue
    "#008000", // Green
    "#FFA500", // Orange
    "#FF69B4", // Pink
    "#FFD700", // Gold
  ];

  const onFinished = (winner) => {
    console.log(winner);
  };

  return (
    <div className="App">
      <h1>Spin Wheel - Vite + React</h1>
      <SpinWheel
        segments={ColorName}
        segmentColors={segmentColors}
        onFinish={(winner) => onFinished(winner)}
        upDuration={300}
        downDuration={600}
      />
    </div>
  );
}

export default App;
