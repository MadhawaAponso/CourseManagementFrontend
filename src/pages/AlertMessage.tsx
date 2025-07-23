import React from 'react';
import './style/AlertMessage.css';

interface AlertMessageProps {
  type: 'success' | 'error';
  message: string;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ type, message }) => {
  return (
    <div className={`alert ${type}`}>
      <span>{message}</span>
    </div>
  );
};

export default AlertMessage;
