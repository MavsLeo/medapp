import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CardContent,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Paper,
} from "@mui/material";
import {
  Favorite as HeartIcon,
  MedicalServices as MedicalIcon,
  Assignment as ReportIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useClinica } from "../../Context/ClinicaContextFb";

const PatientPublicProfile = () => {
  const { id } = useParams(); // Pega o id do paciente da URL
  const { buscarPacientePorId } = useClinica(); // Função para buscar paciente
  const [paciente, setPaciente] = useState(null); // Armazena os dados do paciente
  const [erro, setErro] = useState(null); // Armazena erro caso não encontre paciente

  useEffect(() => {
    // Chama a função para buscar o paciente assim que o componente for montado
    const fetchPaciente = async () => {
      try {
        const pacienteEncontrado = await buscarPacientePorId(id);
        if (pacienteEncontrado) {
          setPaciente(pacienteEncontrado);
        } else {
          setErro("Paciente não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar paciente:", error);
        setErro("Ocorreu um erro ao carregar os dados do paciente.");
      }
    };

    fetchPaciente();
  }, [id, buscarPacientePorId]); // Executa sempre que o id mudar

  if (erro) {
    return <Typography color="error">{erro}</Typography>;
  }

  if (!paciente) {
    return <Typography>Carregando...</Typography>; // Exibe enquanto os dados estão sendo carregados
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case "Alto":
        return "error";
      case "Moderado":
        return "warning";
      default:
        return "success";
    }
  };

  const getRiskColorHex = (risk) => {
    switch (risk) {
      case "Alto":
        return "#d32f2f";
      case "Moderado":
        return "#ed6c02";
      case "Baixo":
        return "#2E7D32";
      default:
        return "#1976d2";
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          backgroundColor: "#f4f4f4",
        }}
      >
        <Box
          sx={{
            backgroundColor: getRiskColorHex(paciente.riscoCardiaco),
            color: "white",
            textAlign: "center",
            padding: 2,
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              margin: "0 auto 16px",
              border: "4px solid white",
            }}
            src="https://st3.depositphotos.com/10168920/13600/i/450/depositphotos_136001788-stock-photo-a-white-man-with-a.jpg" // Substituir com foto real do paciente
          />
          <Typography variant="h5">{paciente.nome}</Typography>
          <Typography variant="subtitle1">
            Idade:{" "}
            {paciente.dataNascimento
              ? new Date().getFullYear() -
                new Date(paciente.dataNascimento).getFullYear()
              : "N/A"}
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
                secondary={
                  paciente.medicacoes
                    ? paciente.medicacoes.map((med) => med.nome).join(", ")
                    : "Nenhuma medicação informada"
                }
              />
            </ListItem>

            <Divider variant="inset" component="li" />

            <ListItem>
              <ListItemIcon>
                <ReportIcon color={getRiskColor(paciente.riscoCardiaco)} />
              </ListItemIcon>
              <ListItemText primary="Última Consulta" secondary="11/05/2024" />
            </ListItem>

            <Divider variant="inset" component="li" />

            <ListItem>
              <ListItemIcon>
                <HospitalIcon color={getRiskColor(paciente.riscoCardiaco)} />
              </ListItemIcon>
              <ListItemText primary="Próxima Consulta" secondary="22/12/2024" />
            </ListItem>

            <Divider variant="inset" component="li" />

            <ListItem>
              <ListItemIcon>
                <PersonIcon color={getRiskColor(paciente.riscoCardiaco)} />
              </ListItemIcon>
              <ListItemText
                primary="Observações do Médico"
                secondary={paciente.observacoesDoMedico}
              />
            </ListItem>
          </List>
        </CardContent>
      </Paper>

      <Typography
        variant="caption"
        display="block"
        align="center"
        sx={{ marginTop: 2, color: "text.secondary" }}
      >
        Informações confidenciais - Uso restrito
      </Typography>
    </Container>
  );
};

export default PatientPublicProfile;
