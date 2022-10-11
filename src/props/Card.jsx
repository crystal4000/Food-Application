import React from "react";
import Loader from "../assets/Landing Page/loader.svg";

function Card(props) {
  return (
    <div className="card">
      <div className="card-container">
        <img
          onLoad={props.handleLoad}
          src={`${props.image}`}
          alt={props.name}
          className="card-img"
        />
        <div className="loader">
          <img src={Loader} alt="" />
        </div>
      </div>
      <h2>{props.name}</h2>
      <p>Stir fry pasta yada yada yada because of Sasan.</p>
    </div>
  );
}

export default Card;
