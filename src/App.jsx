import Game from "./routes/Game";
import { useState, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/React-Week3-Simple-2048/" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;
