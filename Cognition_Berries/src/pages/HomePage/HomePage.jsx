import Navbar from '../../components/Navbar/Navbar';
import './HomePage.css'; 

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <section className="hero">
        <div className="hero-left">
          <h1>Master Stock<br />Investing with<br />Confidence</h1>
          <p>
            Cognition Berries provides beginner-friendly education on stocks and investing
            through interactive courses, expert coaching, and practical resources.
          </p>
          <div className="hero-buttons">
            <button className="btn-explore">Explore More &gt;</button>
            <button className="btn-learn">Learn More</button>
          </div>
        </div>
        <div className="hero-right">
          {/* Placeholder for image or graphic */}
          <div className="image-placeholder"></div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
