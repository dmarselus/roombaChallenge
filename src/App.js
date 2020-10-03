import React, { useState } from "react";
import "./styles.css";
import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
export default function App() {
  const [roomba, setRoomba] = useState([1, 1]);
  const [width, setWidth] = useState(5);
  const [height, setHeight] = useState("");
  const [dirt, setDirt] = useState([]);
  const [output, setOutput] = useState({
    step: [1],
    location: [roomba],
    action: ["-"],
    totalDirt: [0],
    totalWall: [0]
  });
  let ins = [
    "N",
    "E",
    "E",
    "N",
    "N",
    "N",
    "E",
    "E",
    "S",
    "W",
    "S",
    "S",
    "S",
    "S",
    "S"
  ];
  let step = [];
  let posHist = [roomba];

  let dirtLocations = [
    [1, 2],
    [3, 5],
    [5, 5],
    [7, 9]
  ];

  function handleSubmit() {
    let outputObj = { ...output };
    let obj = {
      N: [0, 1],
      S: [0, -1],
      W: [-1, 0],
      E: [1, 0]
    };
    let temp = [...roomba];
    let totalWallHitCounter = 0;
    let dirtCounter = 0;
    ins.forEach((direction, index) => {
      let newLocX = temp[0] + obj[direction][0];
      let newLocY = temp[1] + obj[direction][1];
      outputObj.step.push(index + 2);
      outputObj.action.push(direction);
      //todo add max w and h
      if (newLocX >= 0 && newLocY >= 0) {
        //no hit
        temp = [temp[0] + obj[direction][0], temp[1] + obj[direction][1]];
        outputObj.location.push(temp);
        if (JSON.stringify(dirtLocations).includes(JSON.stringify(temp)))
          dirtCounter++;
      } else {
        totalWallHitCounter++;
        outputObj.location.push([temp[0], temp[1]]);
      }
      outputObj.totalWall.push(totalWallHitCounter);
      outputObj.totalDirt.push(dirtCounter);
    });
    setRoomba(temp);
    setOutput(outputObj);
    console.log(outputObj);
  }

  function renderInputs() {
    return (
      <>
        <div>
          <label for="exampleFormControlInput1">Width: </label>
          <input type="number" placeholder="0" value={width} />
        </div>
        <div>
          <label for="exampleFormControlInput1">Height: </label>
          <input type="number" placeholder="0" value={height} />
        </div>
        <div>
          <label for="exampleFormControlInput1">Dirt X: </label>
          <input type="number" placeholder="0" value={""} />
        </div>
        <div>
          <label for="exampleFormControlInput1">Dirt Y: </label>
          <input type="number" placeholder="0" value={""} />
        </div>
        <Button class="btn btn-secondary" onClick={handleSubmit}>
          Submit
        </Button>
      </>
    );
  }

  function renderOutput(objToRender) {
    return (
      <div
        style={{
          width: "100%",
          backgroundColor: "red",
          display: "flex",
          justifySelf: "center",
          margin: "10px 0 10px 0"
        }}
      >
        {Object.entries(objToRender).map(([key, val]) => {
          console.log(key, val);
          return (
            <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
              <div style={{ borderStyle: "solid" }}>
                <h1 style={{ fontSize: 25 }}>{key}</h1>
              </div>
              {val.map((item) => (
                <div style={{ borderStyle: "solid" }}>
                  <h3>
                    {key === "location" ? `${item[0]}, ${item[1]}` : item}
                  </h3>{" "}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>): void {
    const files = Array.from(e.target.files);
    console.log("files:", files);
  }

  return (
    <div className="App">
      {renderInputs()}
      <Form.File
        className="position-relative"
        required
        name="file"
        label="File"
        onChange={handleFileSelected}
        // isInvalid={!!errors.file}
        // feedback={errors.file}
        id="validationFormik107"
        feedbackTooltip
      />
      {renderOutput(output)}
      <h1>
        {roomba[0]},{roomba[1]}
      </h1>
    </div>
  );
}
