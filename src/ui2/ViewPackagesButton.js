"use client";
import React from "react";
import styled from "styled-components";
import Link from "next/link";

const ViewPackagesButton = () => {
  return (
    <StyledWrapper>
      <Link href="/packages">
        <button>
          View Packages
        </button>
      </Link>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  button {
    width: 180px; /* Standard width for consistency */
    height: 50px; /* Standard height for consistency */
    display: flex;
    font-size: 16px;
    align-items: center;
    justify-content: center; /* Center both icon and text */
    gap: 12px; /* Adjusted gap to keep the elements spaced evenly */
    background: #A6B5B4;
    border-radius: 30px;
    color: #002D37;
    font-weight: 400px;
    border: none;
    position: relative;
    cursor: pointer;
    transition-duration: 0.5s;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.116);
    padding-left: 10px;
    padding-right: 10px;
    font-family: PlayfairDisplay, sans-serif;
  }

  button:hover {
    background-color: #D2AF94;
  }

  button:active {
    transform: scale(0.97);
    transition-duration: 0.2s;
  }
`;

export default ViewPackagesButton;
