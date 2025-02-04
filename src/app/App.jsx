import React from 'react';
import { Route, Routes, HashRouter, BrowserRouter } from 'react-router-dom';
import Main from './Main';

function App() {
  return (
   
        <BrowserRouter>
          <Routes>
          <Route path='/' element={<Main />} />
          </Routes>
        </BrowserRouter>
    
  );
}

export default App;
