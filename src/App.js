import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,// eslint-disable-next-line
  Navigate,
} from "react-router-dom";
import PatientPublicProfile from './Components/Paciente/Profile';
import MedicDashboard from "./Components/Medico";
import Login from "./Components/Login";
import { auth } from "./Context/firebaseConfig";
import { useClinica } from "./Context/ClinicaContextFb";

function AppRoutes() {
  // eslint-disable-next-line
  const { authUser, isAuthed, useAuth } = useClinica();
  console.log("auth :>> ", authUser);
  console.log(isAuthed);
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<MedicDashboard />} />
      <Route path="/paciente/:id" element={<PatientPublicProfile />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
}

export default App;
