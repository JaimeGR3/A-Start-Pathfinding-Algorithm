import React from 'react';
import { Route, Routes, HashRouter } from 'react-router-dom';
import Main from './Main';

function App() {
  return (
   
        <HashRouter>
          <Routes>
          <Route path='/' element={<Main />} />
          </Routes>
        </HashRouter>
    
  );
}

export default App;
