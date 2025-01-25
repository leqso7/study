import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #1565C0;
  text-align: center;
  margin-bottom: 40px;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
`;

const ButtonsContainer = styled.div`
  display: grid;
  gap: 20px;
  max-width: 600px;
  width: 100%;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  padding: 20px;
  font-size: 1.5rem;
  border-radius: 15px;
  background: white;
  color: #1565C0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const Emoji = styled.span`
  font-size: 2rem;
`;

const HomePage = () => {
  return (
    <Container>
      <Title>თამაშები 🎮</Title>
      <ButtonsContainer>
        <StyledLink to="/tasks">
          <Emoji>🎯</Emoji>
          ამოცანები
        </StyledLink>
        <StyledLink to="/puzzle">
          <Emoji>🧩</Emoji>
          ფაზლი
        </StyledLink>
      </ButtonsContainer>
    </Container>
  );
};

export default HomePage;
