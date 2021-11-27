import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Divider, Typography } from "@material-ui/core";

const Home = (props) => {
  return (
    <div className="app">
      <Typography variant="h2" component="h2">
        Bem vindo
      </Typography>
      <Typography variant="body2" component="p">
        Páginas de autenticação
      </Typography>
      <Divider />
      <div className="links">
        <Link to="/login">Página de Login</Link>
        <Link to="/signup">Página de inscrever-se</Link>
        <Link to="/forgotpassword">Página esqueci minha senha</Link>
      </div>
    </div>
  );
};

export default Home;
