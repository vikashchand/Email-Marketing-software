import './App.css';
import Registration from './Pages/Registration/Registration';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Pages/Login/Login';
import Home from './Pages/Home/Home';
import NotFound from './Pages/NotFound';

import Task from './Pages/tasks/Task';
import Email from './email temp/Email';
import ResetPassword from './Pages/Login/ResetPassword';




function App() {
  return (
    <Router>
      <div className="App">
      <Routes>
      <Route path="/" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/email" element={<Email />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/home/*" element={<Home />} />
      
      <Route path="/temp/*" element={<Task/>} />
      <Route path="*" element={<NotFound />} /> {/* Add a catch-all route */}
    </Routes>
    
      </div>
    </Router>
  );
}

export default App;
