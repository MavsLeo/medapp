import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,// eslint-disable-next-line
  Navigate,
} from "react-router-dom";
import PatientPublicProfile from './Components/Paciente/Profile';
import MedicDashboard from './Components/Medico';
import { useState } from 'react';
import Seletor from './Components/Seletor/Seletor';



function App() {
  const [medicoId, setMedicoId]= useState('');
  const [clinicaId, setClinicaId] = useState('')

  return (
      <div className="App">
        <Router>
          <Routes>
            <Route path='/' element={<Seletor setMedicoId={setMedicoId} setClinicaId={setClinicaId}/>}/>
            <Route path='/dashboard' element={<MedicDashboard medicoId={medicoId} clinicaId={clinicaId}/>}/>
            <Route path='paciente/:id' element={<PatientPublicProfile/>}/>
          </Routes>
        </Router>
      </div>
  );
}

export default App;
