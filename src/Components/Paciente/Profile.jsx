import React from 'react';
import { 
  Box, 
  Typography, // eslint-disable-next-line
  Card, 
  CardContent, 
  Avatar, 
  Divider, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Container,
  Paper
} from '@mui/material';
import {
  Favorite as HeartIcon,
  MedicalServices as MedicalIcon,
  Assignment as ReportIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon
} from '@mui/icons-material';
import { useClinica } from '../../Context/ClinicaContext ';
import { useParams } from 'react-router-dom';

const PatientPublicProfile = ({ patient }) => {
  // Dados mockados - na implementação real, estes viriam de uma API/backend
  const {id} = useParams();
  const{buscarPacientePorId} =useClinica()

  const paciente = buscarPacientePorId(id)

    console.log('pacientes :>> ', paciente);
  const mockPatient = {
    nome: patient?.nome || "João Silva",
    idade: patient?.idade || 45,
    ultimaConsulta: patient?.ultimaConsulta || "15/11/2024",
    proximaConsulta: patient?.proximaConsulta || "20/12/2024",
    riscoCardiaco: patient?.riscoCardiaco || "Alto",
    medicacoes: patient?.medicacoes || [
      "Metoprolol 50mg",
      "Atorvastatina 20mg"
    ],
    observacoesDoMedico: patient?.observacoesDoMedico || "Manter dieta e exercícios regulares. Monitorar pressão arterial."
  };
  const getRiskColor = (risk) => {
    switch(risk) {
      case 'Alto': return 'error';
      case 'Moderado': return 'warning';
      default: return 'success';
    }
  };
  const getRiskColorHex = (risk) => {
    switch(risk) {
      case 'Alto': return '#d32f2f';
      case 'Moderado': return '#ed6c02';
      default: return '#1976d2';
    }
  };

  return (
    <Container 
    maxWidth="xs"
    sx={{ 
      // height: '100dvh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center',
      padding: 2  
    }}>
      <Paper elevation={3} sx={{ 
        borderRadius: 4, 
        overflow: 'hidden',
        backgroundColor: '#f4f4f4'
      }}>
        <Box
          sx={{ 
            backgroundColor: (getRiskColorHex(paciente.riscoCardiaco)), 
            color: 'white', 
            textAlign: 'center', 
            padding: 2 
          }}
        >
          <Avatar 
            sx={{ 
              width: 100, 
              height: 100, 
              margin: '0 auto 16px',
              border: '4px solid white'
            }}
            src="https://st3.depositphotos.com/10168920/13600/i/450/depositphotos_136001788-stock-photo-a-white-man-with-a.jpg"  // Substituir com foto real do paciente
          />
          <Typography variant="h5">
            {paciente.nome}
          </Typography>
          <Typography variant="subtitle1">
            Idade: {paciente.dataNascimento 
                            ? new Date().getFullYear() - new Date(paciente.dataNascimento).getFullYear()
                            : 'N/A'}
          </Typography>
        </Box>

        <CardContent>
          <List>
            <ListItem>
              <ListItemIcon>
                <HeartIcon color={getRiskColor(paciente.riscoCardiaco)} />
              </ListItemIcon>
              <ListItemText 
                primary="Risco Cardíaco" 
                secondary={paciente.riscoCardiaco} 
              />
            </ListItem>
            
            <Divider variant="inset" component="li" />
            
            <ListItem>
              <ListItemIcon>
                <MedicalIcon color={getRiskColor(paciente.riscoCardiaco)} />
              </ListItemIcon>
              <ListItemText 
                primary="Medicações de uso Continuo" 
                secondary={paciente.medicacoes ? paciente.medicacoes.map(med => med.nome).join(", ") : "Nenhuma medicação informada"}
              />
            </ListItem>
            
            <Divider variant="inset" component="li" />
            
            <ListItem>
              <ListItemIcon>
                <ReportIcon color={getRiskColor(paciente.riscoCardiaco)} />
              </ListItemIcon>
              <ListItemText 
                primary="Última Consulta" 
                secondary={mockPatient.ultimaConsulta} 
              />
            </ListItem>
            
            <Divider variant="inset" component="li" />
            
            <ListItem>
              <ListItemIcon>
                <HospitalIcon color={getRiskColor(paciente.riscoCardiaco)} />
              </ListItemIcon>
              <ListItemText 
                primary="Próxima Consulta" 
                secondary={mockPatient.proximaConsulta} 
              />
            </ListItem>
            
            <Divider variant="inset" component="li" />
            
            <ListItem>
              <ListItemIcon>
                <PersonIcon color={getRiskColor(paciente.riscoCardiaco)} />
              </ListItemIcon>
              <ListItemText 
                primary="Observações do Médico" 
                secondary={mockPatient.observacoesDoMedico} 
              />
            </ListItem>
          </List>
        </CardContent>
      </Paper>

      <Typography 
        variant="caption" 
        display="block" 
        align="center" 
        sx={{ marginTop: 2, color: 'text.secondary' }}
      >
        Informações confidenciais - Uso restrito
      </Typography>
    </Container>
  );
};

export default PatientPublicProfile;