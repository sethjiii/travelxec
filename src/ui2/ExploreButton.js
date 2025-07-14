// src/components/Button.js
"use client";
import React from 'react';
import styled from 'styled-components';

const Button = () => {
  return (
    <StyledWrapper>
      <button className="button" onClick={() => window.location.href = '/destinations'}>
        <svg className="svgIcon" viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg">
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm50.7-186.9L162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4zM288 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
        </svg>
        Explore Now
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button {
    width: 180px; /* Standard width for consistency */
    height: 50px; /* Standard height for consistency */
    display: flex;
    align-items: center;
    justify-content: center; /* Center both icon and text */
    gap: 12px; /* Adjusted gap to keep the elements spaced evenly */
    background-color: #A6B5B4;
    border-radius: 30px;
    color: #002D37;
    font-weight: 600;
    border: none;
    position: relative;
    cursor: pointer;
    transition-duration: 0.5s;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.116);
    padding-left: 10px;
    padding-right: 10px;
  }

  .svgIcon {
    height: 24px; /* Standard size for the icon */
    fill: #002D37;
    transition-duration: 1.5s;
  }

  .button:hover {
    background-color: #D2AF94;
  }

  .button:active {
    transform: scale(0.97);
    transition-duration: 0.2s;
  }

  .button:hover .svgIcon {
    transform: rotate(250deg);
  }
`;

export default Button;
