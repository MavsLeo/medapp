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
import ConsultasPage from "./Components/Consultas";

function AppRoutes() {
  const { isAuthed, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>; // Exibe um placeholder enquanto verifica autenticação
  }

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
      <Route
        path="/consulta"
        element={isAuthed ? <ConsultasPage /> : <Navigate to="/login" />}
      />
      <Route path="/paciente/:id" element={<PatientPublicProfile />} />
      <Route
        path="/"
        element={<Navigate to={isAuthed ? "/dashboard" : "/login"} />}
      />
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
