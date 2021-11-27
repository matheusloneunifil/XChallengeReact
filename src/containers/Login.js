import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import {
  InputAdornment,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  Icon,
  Button,
  CircularProgress,
  Divider,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { colors } from "../utilities/constants";
import * as CryptoJS from "crypto-js";
import Logo from "../assets/logo.png";
import { isLoading, updateAuthentication, loginRequest } from "../store/action";
import { isValidEmail } from "../utilities/helper";

const useStyles = (theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",

    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  logo: {
    [theme.breakpoints.up("sm")]: {
      width: 350,
      margin: "0 auto",
    },
    [theme.breakpoints.down("sm")]: {
      width: 250,
      margin: "30px auto",
    },
  },
  divider: {
    width: 3,
    maxHeight: "70%",
    [theme.breakpoints.down("sm")]: {
      display: "none",
      height: "0%",
    },
  },

  eyeIcon: {
    cursor: "pointer",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "90%", // Conserta o erro do IE 11.
    [theme.breakpoints.up("sm")]: {
      width: "80%",
    },
    [theme.breakpoints.up("md")]: {
      width: "60%",
    },

    margin: "0 auto",
    textAlign: "left",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    fontWeight: "bold",
  },
  buttonWrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -8,
    marginLeft: -12,
  },
});

const initialFieldData = {
  email: "",
  password: "",
  showPassword: false,
  rememberMe: false,
};

const initialErrors = {
  email: false,
  password: false,
  message: "",
  loading: false,
};

const Login = (props) => {
  const [fieldData, setFieldData] = useState(initialFieldData);
  const iv1 = CryptoJS.enc.Utf8.parse("hf8685nfhfhjs9h8");
  const [errors, setErrors] = useState(initialErrors);

  useEffect(() => {
    // Se lembre de mim alocado precisamente na memoria, parsa os dados e preenche automaticamente
    const data = JSON.parse(window.localStorage.getItem("remember"));
    if (data) {
      const decryptPass = CryptoJS.AES.decrypt(data.pass, data.email, {
        keySize: 16,
        iv: iv1,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }).toString(CryptoJS.enc.Utf8);

      setFieldData({
        ...fieldData,
        email: data.email,
        password: decryptPass,
        rememberMe: true,
      });
    }
  }, []);
  const { classes } = props;

  const onChange = (e) => {
    setErrors(initialErrors);
    setFieldData({
      ...fieldData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const toggleState = (e, name) => {
    setFieldData({
      ...fieldData,
      [name]: !fieldData[name],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, rememberMe } = fieldData;
    if (email.length > 0) {
      if (isValidEmail(email)) {
        if (password.length) {
          try {
            setFieldData({
              ...fieldData,
              loading: true,
            });
            await props.loginRequest({
              email: email,
              password: password,
            });
            setFieldData(initialFieldData);
            if (rememberMe) {
              const encryptedPass = CryptoJS.AES.encrypt(password, email, {
                keySize: 16,
                iv: iv1,
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
              }).toString();

              window.localStorage.setItem(
                "remember",
                JSON.stringify({
                  email: email,
                  pass: encryptedPass,
                })
              );
            } else {
              window.localStorage.removeItem("remember");
            }
          } catch (e) {
            props.updateLoading(false);
          }
        } else {
          setErrors({
            ...errors,
            password: true,
            message: "Favor preencher o campo!",
          });
        }
      } else {
        setErrors({
          ...errors,
          email: true,
          message: "Email inválido",
        });
      }
    } else {
      setErrors({
        ...errors,
        email: true,
        message: "Favor preencher o campo!",
      });
    }
  };

  return (
    <Grid style={{ height: "100vh" }}>
      <Box className={classes.root}>
        <Grid container item sm={12} md={6}>
          <img src={Logo} className={classes.logo} alt="logo"></img>
        </Grid>
        <Divider orientation="vertical" className={classes.divider} />
        <Grid container item sm={12} md={6}>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Typography
              variant="h5"
              component="h5"
              style={{ textAlign: "center", marginBottom: 20 }}
            >
              Faça seu login
            </Typography>
            <TextField
              error={errors.email}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail"
              name="email"
              autoComplete="email"
              value={fieldData.email}
              onChange={onChange}
              autoFocus
              helperText={
                props.message &&
                errors.email && <span className="error">{props.message}</span>
              }
            />
            <TextField
              error={errors.password}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type={fieldData.showPassword ? "text" : "password"}
              id="password"
              value={fieldData.password}
              onChange={onChange}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Icon
                      aria-label="toggle password visibility"
                      size="small"
                      onClick={(e) => toggleState(e, "showPassword")}
                      className={classes.eyeIcon}
                    >
                      {!fieldData.showPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </Icon>
                  </InputAdornment>
                ),
              }}
              helperText={
                props.message &&
                errors.password && (
                  <span className="error">{props.message}</span>
                )
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={fieldData.rememberMe}
                  onChange={(e) => toggleState(e, "rememberMe")}
                  value="remember"
                  color="default"
                />
              }
              label="Manter conectado"
            />
            {errors.message && (
              <Typography
                component="p"
                variant="caption"
                style={{ color: "#f44336" }}
              >
                {errors.message}
              </Typography>
            )}
            <div className={classes.buttonWrapper}>
              <Button
                type="submit"
                fullWidth
                variant="outlined"
                color="primary"
                disabled={
                  fieldData.loading || errors.email || errors.password
                    ? true
                    : false
                }
                classes={{
                  root: `${classes.submit}`,
                }}
                onClick={handleSubmit}
              >
                ENTRAR
              </Button>
              {fieldData.loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                  color="primary"
                />
              )}
            </div>
            <Grid container>
              <Grid item xs>
                <Link
                  to="/forgotpassword"
                  component={RouterLink}
                  variant="body2"
                >
                  Esqueci minha senha?
                </Link>
              </Grid>
              <Grid item>
                Usuário novo?
                <Link variant="body2" to="/signup" component={RouterLink}>
                  {" Cadastre-se"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Box>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.appState.isLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loginRequest: (data) => dispatch(loginRequest(data)),
    updateLoading: (bool) => dispatch(isLoading(bool)),
    updateAuth: (bool, data) => dispatch(updateAuthentication(bool, data)),
  };
};

export default withStyles(useStyles)(
  connect(mapStateToProps, mapDispatchToProps)(Login)
);
