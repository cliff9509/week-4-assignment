import React from 'react';

function Message({ variant = 'info', children }) {
  const getStyle = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb',
        };
      case 'danger':
        return {
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
        };
      case 'warning':
        return {
          backgroundColor: '#fff3cd',
          color: '#856404',
          border: '1px solid #ffeeba',
        };
      default:
        return {
          backgroundColor: '#d1ecf1',
          color: '#0c5460',
          border: '1px solid #bee5eb',
        };
    }
  };

  return (
    <div
      style={{
        padding: '1rem',
        borderRadius: '0.25rem',
        marginBottom: '1rem',
        ...getStyle(),
      }}
    >
      {children}
    </div>
  );
}

export default Message;