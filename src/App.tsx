import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.less'

import Head from './pages/head';

function App() {

  return (
    <Router>
      <nav className='top-navbar'>
      <Link to="/head">Head</Link>
      </nav>
      <Routes>
        <Route path='/head' element={<Head/>}/>
      </Routes>
    </Router>
  )
}

export default App
