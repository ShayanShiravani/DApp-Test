import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import SendEth from './components/SendEth';
import ShowAccountInfo from './components/ShowAccountInfo';

class App extends Component {
  render() {
    return(
      <Router>
        <Routes>
          <Route exact path="/" element={<SendEth />} />
          <Route exact path="/account-info" element={<ShowAccountInfo />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
