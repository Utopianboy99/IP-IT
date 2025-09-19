import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import './AboutUs.css'
import Footer from '../../components/Footer/Footer'




function AboutUs() {
    return (
        <>
            <Navbar />
            <div className="main-block">
                <div className="sec-box">
                    <div className="in-block blk1-1" >
                        <p>Impowerment</p>
                        <h1>Our Purpose Matters</h1>
                    </div>
                    <div className="in-block blk1-2">
                        <p>
                            At Cognition Berries, our mission is to empower individuals through
                            financial education, making investing accessible and engaging. We
                            envision a future where everyone, especially young adults, can confidently
                            navigate their financial journeys.
                        </p>
                        <p>
                            We are committed to breaking down barriers to financial literacy by providing
                            resources, tools, and a supportive community for learners at every stage.
                        </p>
                        <div className="abt-btns abt-btns-blk-1">
                            <Link>
                                <button>
                                    Learn
                                </button>
                            </Link>
                            <Link>
                                <button>
                                    Join
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="sec-box">
                    <div className="in-block blk2-1">
                        <h1>
                            Empowering the next generation through accessible
                            financial education and resources.
                        </h1>
                        <p>
                            At Cognition Berries, we believe that financial literacy
                            is essential for everyone. Our mission is to provide engaging
                            and impactful learning experiences that equip young adults with
                            the knowledge and skills they need to succeed in their financial
                            journeys.
                        </p>
                        <p>
                            Our team consists of passionate educators, finance professionals, and technologists
                            dedicated to making a difference in the lives of our users.
                        </p>
                    </div>
                    <div className="in-block"></div>
                </div>
                <div className="sec-box">
                    <div className="in-block blk3-1">
                        <h1>
                            Empowering the next generation through accessible financial education and resources.
                        </h1>
                        <p>
                            At Cognition Berries, we believe that financial literacy is essential for everyone. Our platform is designed to make learning about finance engaging and accessible.
                        </p>
                        <p>
                            Through interactive courses, real-world simulations, and community support, we help learners build confidence and practical skills for their financial future.
                        </p>
                        <div className="icon-blk">
                            <div className="i-Blocks">
                                <p>Icon</p>
                                <p>Our Mission</p>
                                <p>To provide innovative learning experiences that inspire confidence in financial decision-making.</p>
                            </div>
                            <div className="i-Blocks">
                                <p>icon</p>
                                <p>Our Vision</p>
                                <p>A world where financial knowledge empowers individuals to achieve their dreams.</p>
                            </div>
                        </div>
                    </div>
                    <div className="in-block"></div>
                </div>
                <div className="sec-box">
                    <div className="in-block">
                        <p>Empowerment</p>
                        <h1>Empowering the Next Generation of Investors</h1>
                        <p>At Cognition Berries, we believe in the potential of youth. Our mission is to equip young individuals with the financial knowledge they need to thrive.</p>
                        <p>
                            Join our growing community and start your journey towards financial independence today.
                        </p>
                        <div className="icon-blk">
                            <div className="i-Blocks">
                                <p>Our Vision</p>
                                <p>To create a financially literate society that empowers youth to make informed decisions.</p>
                            </div>
                            <div className="i-Blocks">
                                <p>Our Mission</p>
                                <p>To provide accessible financial education that inspires confidence and fosters growth.</p>
                            </div>
                        </div>
                        <div className="abt-btns abt-btns-blk-2">
                            <Link>
                                <button>
                                    Join
                                </button>
                            </Link>
                            <Link>
                                <button>
                                    Learn {`>`}
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="in-block"></div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default AboutUs
