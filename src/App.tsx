import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import AddRun from './AddRun';
import Runs from './Runs';

function App() {
  return (
    <Routes>
      <Route path="/strava-clone/#" element={<Home />} />
      <Route path="/strava-clone/#/add-run" element={<AddRun />} />
      <Route path="/strava-clone/#/runs" element={<Runs />} />
    </Routes>
  );
}

export default App;

