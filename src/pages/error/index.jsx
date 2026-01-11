import React from 'react';
import './NotFound.scss';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="!min-h-[100vh] nf-wrapper md:pt-[170px] pt-[100px] ">
      <div className="nf-main-container nf-container-star">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={`star1-${i}`} className="nf-star-1"></div>
        ))}
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={`star2-${i}`} className="nf-star-2"></div>
        ))}
      </div>

      <div className="nf-main-container nf-container-bird">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={`bird-${i}`} className="nf-bird nf-bird-anim">
            <div className="nf-bird-container">
              <div className="nf-wing nf-wing-left">
                <div className="nf-wing-left-top"></div>
              </div>
              <div className="nf-wing nf-wing-right">
                <div className="nf-wing-right-top"></div>
              </div>
            </div>
          </div>
        ))}

        <div className="nf-container-title">
          <div className="nf-title-group">
            <div className="nf-number">4</div>
            <div className="nf-moon">
              <div className="nf-face">
                <div className="nf-mouth"></div>
                <div className="nf-eyes">
                  <div className="nf-eye-left"></div>
                  <div className="nf-eye-right"></div>
                </div>
              </div>
            </div>
            <div className="nf-number">4</div>
          </div>
          <div className="nf-subtitle">
            OOops. Looks like you took a wrong turn.
          </div>
          <Link to={"/"} className="nf-btn-back" onClick={handleGoBack}>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;