import Game from "./routes/Game";
import { useState, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Nomadcoding-React/" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;
