import React from "react";
import "../../assets/css/Utils.css";

// TODO: render if not signed in
export function renderNotSignedin() {
  return (
    <div class="not-signed-in-container">
      <h4>Please Sign in First.</h4>
    </div>
  );
}
