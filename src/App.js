import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Portfolio from "./Portfolio/Portfolio";
import Dashboard from "./Admin/Dashboard";
import Users from "./Admin/Users";
import Videos from "./Admin/Videos";
import Contacts from "./Admin/Contacts";
import Appointments from "./Admin/Appointments";
import Layout from './Admin/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        
        {/* Admin Routes without guard */}
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Dashboard />} /> {/* /admin */}
          <Route path="dashboard" element={<Dashboard />} /> {/* /admin/dashboard */}
          <Route path="users" element={<Users />} />
          <Route path="videos" element={<Videos />} />
          <Route path="appointments" element={<Appointments />} />
            <Route path="contacts" element={<Contacts />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;