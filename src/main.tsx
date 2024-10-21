import React, { ReactNode, StrictMode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import LeaderBoard from './components/LeaderBoard';
import Map from './components/Map';
import Header from './components/Header';
import TeamRadioContainer from './components/TeamRadioContainer';
import { SocketProvider } from './SocketContext';

declare global {
  interface Window {
    __root?: ReactDOM.Root;
  }
}

const rootElement = document.getElementById('root') as HTMLElement;

// Check if the root already exists, if not, create it
if (!window.__root) {
  window.__root = ReactDOM.createRoot(rootElement);
}

window.__root.render(
  <React.StrictMode>
    <SocketProvider>
      <Header />
      <div className='flex flex-row'>
        <LeaderBoard />
        <div className='flex flex-col w-full h-full'>
          <Map />
          <TeamRadioContainer />
        </div>
      </div>
    </SocketProvider>
  </React.StrictMode>
);
