"use client";
import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const LoginButton = () => {
  return (
    <StyledWrapper>
        <Link href="/auth/login">
      <button>Login</button>
        </Link>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  button {
    margin: 12px;
    height: 50px;
    width: 120px;
    border-radius: 10px;
    background: #A6B5B4;
    justify-content: center;
    align-items: center;
    box-shadow: -2px -2px 10px #444, 5px 5px 15px #222, inset 5px 5px 10px #444,
      inset -5px -5px 10px #222;
    font-family: playfairdisplay, sans-serif;
    cursor: pointer;
    border: none;
    font-size: 16px;
    color: #A6B5B4;
    transition: 500ms;
  }

  button:hover {
    box-shadow: -5px -5px 15px #444, 5px 5px 15px #222, inset 5px 5px 10px #222,
      inset -5px -5px 10px #444;
    color: #A6B5B4;
    transition: 500ms;
  }
`;

export default LoginButton;
