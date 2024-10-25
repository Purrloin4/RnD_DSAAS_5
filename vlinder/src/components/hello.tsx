import React from 'react';

const Hello = () => {
    const landingText = process.env.LANDING_TEXT || 'Hello World!';
    return (
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-gray-800 font-bold text-4xl">{landingText}</h1>
        </div>
      );
}

export default Hello;