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
    font-size: 18px;
    color: #e1e1e1;
    font-family: PlayfairDisplay, sans-serif;
    font-weight: 600px;
    cursor: pointer;
    position: relative;
    border: none;
    background: none;
    transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
    transition-duration: 400ms;
    transition-property: color;
    top: 5.5px;
    left: 5px;
  }

  button:focus,
  button:hover {
    color: #D2AF94;
  }

  button:focus:after,
  button:hover:after {
    width: 100%;
    left: 0%;
  }

  button:after {
    content: "";
    pointer-events: none;
    bottom: -2px;
    left: 50%;
    position: absolute;
    width: 0%;
    height: 2px;
    background-color:rgb(255, 255, 255);
    transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
    transition-duration: 400ms;
    transition-property: width, left;
  }
`;

export default ViewPackagesButton;
