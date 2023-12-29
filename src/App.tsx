import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Single from './components/Single';
import List from './components/List'

function App({}) {

  return (
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/posts/:postId" element={<Single />} />
      </Routes>
  );
}

export default App;
