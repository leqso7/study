import React, { useCallback } from 'react';
import styled from 'styled-components';

const UploadContainer = styled.div`
  width: 300px;
  height: 200px;
  border: 3px dashed #4CAF50;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  margin: 20px;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
    transform: scale(1.02);
  }
`;

const UploadText = styled.p`
  color: #2196F3;
  font-size: 1.2rem;
  text-align: center;
  margin: 10px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ImageUploader = ({ onImageUpload }) => {
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageUpload(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageUpload(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <UploadContainer
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
    >
      <UploadText>🖼️ ჩააგდე ფოტო აქ</UploadText>
      <UploadText>ან</UploadText>
      <UploadButton onClick={() => document.getElementById('file-input').click()}>
        აირჩიე ფოტო
      </UploadButton>
      <HiddenInput
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
      />
    </UploadContainer>
  );
};

export default ImageUploader;
