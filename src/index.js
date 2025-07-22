import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import StarRating from "./StarRating";
import App from "./App";
import AppCopy from "./App copy";

const Test = () => {
  const [movieRating, setMovieRating] = useState(0);
  return (
    <div>
      <StarRating color="blue" onSetRating={setMovieRating} maxRating={5} />
      <h1> rating nya {movieRating}</h1>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <AppCopy />
    {/* <StarRating
      maxRating={6}
      messages={[
        "jelek banget",
        "jelek",
        "lumayan",
        "lumayan bagus",
        "bagus",
        "bagus banget",
      ]}
      defaultRating={2}
    /> */}
    {/* <StarRating maxRating={5} size={30} color="blue" /> */}
    {/* <Test /> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
