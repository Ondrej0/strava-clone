import './Home.css';

const Home = () => {
    return (
        <div className="container">
            <div className="card">
                <h1 className="title">Ondrej's Pal</h1>
                <nav className="nav-container">
                    <a href="/strava-clone/#/add-run" className="nav-link">Add Run</a>
                    <a href="/strava-clone/#/runs" className="nav-link">Runs</a>
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
