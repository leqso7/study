import React, { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h2`
  color: #2196F3;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 2px solid #2196F3;
  border-radius: 8px;
  font-size: 16px;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
  }
`;

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover {
    background-color: #388E3C;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const NameModal = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      localStorage.setItem('playerName', name.trim());
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <Title>გამარჯობა! 👋</Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="შეიყვანე შენი სახელი"
            autoFocus
          />
          <Button type="submit" disabled={!name.trim()}>
            დაწყება 🎮
          </Button>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default NameModal;
