import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import PatientPublicProfile from "./Components/Paciente/Profile";
import MedicDashboard from "./Components/Medico";
import Login from "./Components/Login";
import { useAuth } from "./Context/authUser";

function AppRoutes() {
  // eslint-disable-next-line
  const { isAuthed } = useAuth();
  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthed ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/dashboard"
        element={isAuthed ? <MedicDashboard /> : <Navigate to="/login" />}
      />
      {/* Outras rotas */}
      <Route
        path="/"
        element={isAuthed ? <MedicDashboard /> : <Navigate to="/login" />}
      />
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
