// Simple Roomba Challenge
// Generate button => takes file input to generate the output
// Reset button => reset files and so that user can reupload new input file

//Improvement
// table styling, UX, and logic.

import React, { useState, useEffect } from "react";
import "./styles.css";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Files from "react-files";

let reader = new FileReader();
let counter = 0;
export default function App() {
  const [roomba, setRoomba] = useState([1, 1]); //roomba Location
  const [input, setInput] = useState({}); //file input
  const [output, setOutput] = useState({
    step: [1],
    location: [roomba],
    action: ["-"],
    totalDirt: [0],
    totalWall: [0]
  }); //output object to be mapped
  const [uploadToggle, setUploadToggle] = useState(true); //toggling uploading to trigger useEffect
  const [uploadMessage, setUploadMessage] = useState(""); //display message according to the input
  useEffect(() => {
    reader.onload = (event) => {
      setInput(JSON.parse(event.target.result));
    };
  }, [uploadToggle]);

  function handleSubmit() {
    function validInput(obj) {
      let validKeys = [
        "roomDimensions",
        "initialRoombaLocation",
        "dirtLocations",
        "drivingInstructions"
      ];
      let isValid = false;
      Object.keys(obj).map((key) => {
        if (validKeys.includes(key)) isValid = true;
        else isValid = false;
      });
      setUploadMessage(isValid ? "Success" : "File doesnt match");

      return isValid;
    }
    if (validInput(input)) {
      let {
        roomDimensions,
        initialRoombaLocation,
        dirtLocations,
        drivingInstructions
      } = input;
      setRoomba(initialRoombaLocation);
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
      drivingInstructions.forEach((direction, index) => {
        let newLocX = temp[0] + obj[direction][0];
        let newLocY = temp[1] + obj[direction][1];
        outputObj.step.push(index + 2);
        outputObj.action.push(direction);

        if (
          newLocX >= 0 &&
          newLocX <= roomDimensions[0] &&
          newLocY >= 0 &&
          newLocY <= roomDimensions[1]
        ) {
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
    }
  }

  function renderInputs() {
    return (
      <>
        <Files
          className="files-dropzone"
          onChange={(file) => {
            setUploadToggle(!uploadToggle);
            reader.readAsText(file[counter]);
            counter++;
          }}
          onError={(err) => console.log(err)}
          accepts={[".json"]}
          clickable
        >
          Drop files here or click to upload
        </Files>
        <Button
          className="btn btn-success"
          style={{ margin: "10px 10px 10px 10px" }}
          onClick={handleSubmit}
        >
          Generate
        </Button>
        <Button
          className="btn btn-warning"
          style={{ margin: "10px 10px 10px 10px" }}
          onClick={() => {
            setInput({});
            setUploadMessage("");
            setUploadToggle(!uploadToggle);
            setRoomba([1, 1]);
            setOutput({
              step: [1],
              location: [roomba],
              action: ["-"],
              totalDirt: [0],
              totalWall: [0]
            });
          }}
        >
          Reset
        </Button>
        <h6>{uploadMessage}</h6>
      </>
    );
  }

  function renderOutput(objToRender) {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          justifySelf: "center",
          margin: "10px 0 10px 0"
        }}
      >
        {Object.entries(objToRender).map(([key, val]) => {
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

  return (
    <div className="App">
      {renderInputs()}
      {renderOutput(output)}
    </div>
  );
}
