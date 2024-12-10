import { CircularProgress, Container } from "@mui/material";
import React from "react";

function Carregando() {
  return (
    <Container maxWidth="xs">
      <CircularProgress />
    </Container>
  );
}

export default Carregando;
