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
  Link,
} from "@mui/material";
import {
  Favorite as HeartIcon,
  MedicalServices as MedicalIcon,
  Assignment as ReportIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  Plagiarism as PlagiarismIcon,
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
          <PersonIcon />
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
                secondary={
                  <Box
                    sx={{
                      maxHeight: "10rem", // Limita a altura
                      overflow: "auto", // Adiciona barra de rolagem se necessário
                      whiteSpace: "pre-wrap", // Quebra linhas automaticamente
                    }}
                  >
                    {paciente.observacaoDoMedico}
                  </Box>
                }
              />
            </ListItem>

            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <PlagiarismIcon color={getRiskColor(paciente.riscoCardiaco)} />
              </ListItemIcon>
              <ListItemText
                primary="Exames"
                secondary={
                  paciente.exames && paciente.exames.length > 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      {paciente.exames.map((exame, index) => (
                        <Link
                          key={index}
                          href={exame.url}
                          target="_blank"
                          rel="noopener"
                        >
                          {exame.nome}
                        </Link>
                      ))}
                    </Box>
                  ) : (
                    "Nenhum Exame informado"
                  )
                }
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
