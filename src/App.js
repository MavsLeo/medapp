import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,// eslint-disable-next-line
  Navigate,
} from "react-router-dom";
import PatientPublicProfile from './Components/Paciente/Profile';
import MedicDashboard from "./Components/Medico";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<MedicDashboard />} />
          <Route path="/paciente/:id" element={<PatientPublicProfile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
