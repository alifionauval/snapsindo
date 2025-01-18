import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Projects.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import projectslide1 from '../assets/projectslide1.jpg'; // Gambar 1
import projectslide2 from '../assets/projectslide2.jpg'; // Gambar 2
import projectslide3 from '../assets/projectslide3.jpg'; // Gambar 3

// Custom arrow components for next and previous
const NextArrow = (props) => {
    const { className, onClick } = props;
    return (
        <div className={`${className} custom-arrow next-arrow`} onClick={onClick}>
            &#x203A; {/* Right arrow symbol */}
        </div>
    );
};

const PrevArrow = (props) => {
    const { className, onClick } = props;
    return (
        <div className={`${className} custom-arrow prev-arrow`} onClick={onClick}>
            &#x2039; {/* Left arrow symbol */}
        </div>
    );
};

const Projects = () => {
    const [fullscreenImage, setFullscreenImage] = useState(null); // State untuk gambar fullscreen
    const [projects, setProjects] = useState([]); // State untuk data API

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        autoplay: true,
        autoplaySpeed: 350,
        centerPadding: '0px',
        focusOnSelect: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: false,
                    arrows: false,
                    autoplay: true,
                    autoplaySpeed: 2500,
                    infinite: true,
                    adaptiveHeight: true,
                    variableWidth: false,
                    swipeToSlide: true,
                },
            },
        ],
    };

    const handleImageClick = (imageSrc) => {
        setFullscreenImage(imageSrc); // Set gambar fullscreen
    };

    const handleCloseFullscreen = () => {
        setFullscreenImage(null); // Reset gambar fullscreen
    };

    // Fetch data dari API
    useEffect(() => {
        fetch('https://backend-dsnap.vercel.app/api/portfolio')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then((data) => {
                setProjects(data);
            })
            .catch((error) => {
                console.error('Error fetching portfolio:', error);
            });
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                handleCloseFullscreen(); // Tutup fullscreen jika ESC ditekan
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div>
            {/* Header Section */}
            <header className="projects-section">
                <img 
                    src={require('../assets/header-desktop-project.png')} 
                    alt="Header Project" 
                    style={{ width: '100%', height: 'auto' }}
                />
                <div className="explore-text">Explore Our Project !</div>
            </header>

            {/* Slider Section */}
            <section className="slider-section">
                <Slider {...sliderSettings}>
                    <div onClick={(e) => { e.stopPropagation(); handleImageClick(projectslide1); }}>
                        <img src={projectslide1} alt="Project 1" className="slider-image" />
                    </div>
                    <div onClick={(e) => { e.stopPropagation(); handleImageClick(projectslide2); }}>
                        <img src={projectslide2} alt="Project 2" className="slider-image" />
                    </div>
                    <div onClick={(e) => { e.stopPropagation(); handleImageClick(projectslide3); }}>
                        <img src={projectslide3} alt="Project 3" className="slider-image" />
                    </div>
                </Slider>
            </section>

            {/* Projects Grid Section */}
            <section className="projects-grid">
                <div className="grid-container-wrapper">
                    <h2 className="grid-title">Our Projects</h2>
                    <div className="grid-container">
                        {projects.map((project) => (
                            <div key={project.id} 
                                className="grid-item" 
                                onClick={() => handleImageClick(`${project.imageUrl}`)}>
                                <img 
                                    src={`${project.imageUrl}`} 
                                    alt={project.eventName} 
                                    className="grid-item-image"
                                />
                                <p>{project.eventName}</p>
                            </div>
                        ))}
                    </div>
        </div>
    </section>

    {/* Fullscreen Image Overlay */}
    {fullscreenImage && (
        <div className="fullscreen-overlay" onClick={handleCloseFullscreen}>
            <img src={fullscreenImage} alt="Fullscreen" className="fullscreen-image" />
        </div>
    )}

    {/* CTA Section */}
    <section className="cta-section">
        <h3 className="cta-text">Give Some Snaps To</h3>
        <h4 className="cta-text">Your Brand !</h4>
        <Link to="/kontak-kami">
            <button className="cta-button">Contact Us !</button>
        </Link>
    </section>
</div>
    );
};

export default Projects;
