import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import AddRun from './AddRun';
import Runs from './Runs';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add-run" element={<AddRun />} />
      <Route path="/runs" element={<Runs />} />
    </Routes>
  );
}

export default App;

