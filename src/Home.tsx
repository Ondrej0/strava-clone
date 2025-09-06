import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container">
            <div className="card">
                <h1 className="title">Ondrej's Pal</h1>
                <nav className="nav-container">
                    <Link to="/add-run" className="nav-link">Add Run</Link>
                     <Link to="/runs" className="nav-link">Runs</Link>
                </nav>
                <section className="section">
                    <h2>Welcome!</h2>
                    <p>Track your runs, view your running history, and manage your profile.</p>
                </section>
            </div>
        </div>
    );
};

export default Home;
