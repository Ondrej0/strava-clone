import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import './Runs.css';

const Runs = () => {
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const BIN_ID = "68bb4696ae596e708fe3f137";
  const MASTER_KEY = "$2a$10$Nm3KfsWepRLgzqkGmoZxGODIbXuck65ARDGAichqW1i1d2ab9/ta2";
  const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`;

  useEffect(() => {
    const fetchRuns = async () => {
      try {
        const res = await fetch(BIN_URL, {
          headers: { "X-Master-Key": MASTER_KEY }
        });
        const data = await res.json();
        const allRuns = data.record.runs || [];
        const lastFive = allRuns.slice(-5).reverse(); // last 5 runs, newest first
        setRuns(lastFive);
      } catch (err) {
        console.error("Error fetching runs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRuns();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Prepare data for chart
  const chartData = runs.map((run, index) => ({
    name: `Run ${index + 1}`,
    Distance: (run.distance / 1000).toFixed(2), // in km
    Time: (run.time / 60).toFixed(1), // in minutes
  }));

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Last 5 Runs</h1>
        {loading ? (
          <p>Loading...</p>
        ) : runs.length > 0 ? (
          <>
            <ul className="runs-list">
              {runs.map((run, index) => (
                <li key={index} className="run-item">
                  <p><strong>Date:</strong> {new Date(run.date).toLocaleString()}</p>
                  <p><strong>Distance:</strong> {(run.distance / 1000).toFixed(2)} km</p>
                  <p><strong>Time:</strong> {formatTime(run.time)}</p>
                </li>
              ))}
            </ul>

            {/* Chart */}
            <div className="chart-container">
              <h2 className="chart-title">Run Progress</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" label={{ value: "Distance (km)", angle: -90, position: "insideLeft" }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: "Time (min)", angle: -90, position: "insideRight" }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="Distance" stroke="#8884d8" />
                  <Line yAxisId="right" type="monotone" dataKey="Time" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <p>No runs found.</p>
        )}
         <button onClick={() => navigate('/')}>⬅ Back Home</button>
      </div>
    </div>
  );
};

export default Runs;
