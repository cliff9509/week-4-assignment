import React from 'react';

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#333',
        color: 'white',
        textAlign: 'center',
        padding: '1rem',
        position: 'relative',
        bottom: 0,
        width: '100%',
        marginTop: '2rem',
      }}
    >
      <p>&copy; {new Date().getFullYear()} MERN Blog. All rights reserved.</p>
    </footer>
  );
}

export default Footer;