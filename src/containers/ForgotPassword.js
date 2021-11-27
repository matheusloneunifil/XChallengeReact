import React, { useState } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  InputAdornment,
  TextField,
  Box,
  Typography,
  IconButton,
  Icon,
  CircularProgress,
  Button,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import PasswordValidator from "./PasswordValidator";
import { colors } from "../utilities/constants";
import Logo from "../assets/logo.png";
import { isValidEmail } from "../utilities/helper";
import {
  isLoading,
  updateAuthentication,
  forgotPasswordChange,
  sendOTP,
} from "../store/action";
import NumberFormat from "react-number-format";

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

  paper: {
    marginTop: theme.spacing(2),
  },
  eyeIcon: {
    cursor: "pointer",
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
  },
  radioGroup: {
    marginBottom: 15,
  },
  submit: {
    margin: theme.spacing(2, 0, 2),
  },
  resend: {
    fontWeight: 700,
    cursor: "pointer",
    color: colors.PRIMARY,
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
  phone: "",
  otp: "",
  password: "",
  confirmpassword: "",
  otpSent: false,
  showPassword: false,
  validPassword: 0,
  loading: false,
  verificationType: "email",
};

const initialErrors = {
  email: "",
  phone: "",
  password: false,
  confirmpassword: "",
  otp: "",
};

const ForgotPassword = (props) => {
  const [fieldData, setFieldData] = useState(initialFieldData);

  const [errors, setErrors] = useState(initialErrors);
  let timeout;
  const onChange = (e) => {
    e.preventDefault();
    e.persist();

    setErrors({
      ...errors,
      [e.target.name]: e.target.name === "password" ? false : "",
    });

    setFieldData({
      ...fieldData,
      [e.target.name]: e.target.value,
    });
  };

  const onNumberChange = (newData, key) => {
    handleValidateField({}, key, newData);
    setErrors({
      ...errors,
      [key]: false,
    });
    let data = {
      ...fieldData,
      [key]: newData,
    };
    setFieldData({
      ...data,
    });
  };

  const checkValidity = (validRules) => {
    setFieldData({
      ...fieldData,
      validPassword: validRules,
    });
  };

  const toggleState = (e, name) => {
    setFieldData({
      ...fieldData,
      [name]: !fieldData[name],
    });
  };

  const sendOTP = async (event) => {
    event.preventDefault();
    const { verificationType, email, phone } = fieldData;
    if (
      (verificationType === "email" &&
        !errors.email &&
        email.length > 0 &&
        isValidEmail(email)) ||
      (verificationType === "phone" &&
        !errors.phone &&
        phone &&
        `${phone}`.length === 11)
    ) {
      setFieldData({
        ...fieldData,
        loading: true,
      });
      let params = {
        verificationType: verificationType,
      };
      if (verificationType === "email") {
        params.email = email;
      } else {
        params.phone = phone;
      }
      await props.sendOTP(params);
      setFieldData({
        ...fieldData,
        otpSent: true,
        loading: false,
      });
    } else {
      let err = {
        ...errors,
      };
      if (verificationType === "email") {
        err.email = "Email inválido";
      } else {
        err.phone = "Favor preencher o campo!";
      }
      setErrors({
        ...err,
      });
    }
  };

  const saveNewPassword = async (event) => {
    event.preventDefault();
    const { email, password, confirmpassword, otp } = fieldData;
    if (otp) {
      if (
        !errors.password &&
        !errors.confirmpassword &&
        password === confirmpassword &&
        password.length > 0
      ) {
        setFieldData({
          ...fieldData,
          loading: true,
        });
        await props.forgotPasswordChange({
          email: email.toLowerCase().toString().trim(),
          otp: otp.toString().trim(),
          password: password.toString().trim(),
        });
        setFieldData({
          ...fieldData,
          loading: false,
        });
        const locationObj = {
          pathname: "/login",
          state: {
            passwordUpdated: true,
          },
        };
        props.history.push(locationObj);
      } else {
        setErrors({
          ...errors,
          password: true,
        });
      }
    } else {
      setErrors({
        ...errors,
        otp: "Favor preencher o campo!",
      });
    }
  };

  const handleValidateField = (event, key, value) => {
    const eventTarget = event.target;
    // captura o delete e backspace
    let KeyID = event.keyCode;
    if (
      (KeyID === 8 || KeyID === 46) &&
      fieldData.email === "" &&
      key === "email"
    ) {
      setErrors({
        ...errors,
        email: false,
      });
    } else if (
      (KeyID === 8 || KeyID === 46) &&
      fieldData.password === "" &&
      key === "password"
    ) {
      setErrors({
        ...errors,
        password: false,
      });
    } else if (
      (KeyID === 8 || KeyID === 46) &&
      fieldData.password === "" &&
      key === "confirmpassword"
    ) {
      setErrors({
        ...errors,
        confirmpassword: false,
      });
    } else if (
      (KeyID === 8 || KeyID === 46) &&
      fieldData.otp === "" &&
      key === "otp"
    ) {
      setErrors({
        ...errors,
        otp: false,
      });
    } else {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout((event) => {
        let err = {};
        if (key === "email") {
          err.email = value && isValidEmail(value) ? "" : "Email inválido";
        } else if (key === "phone") {
          err.phone =
            value && `${value}`.length === 11 ? "" : "Favor preencher o campo!";
        } else if (key === "password") {
          err.password = fieldData.validPassword === 4 ? false : true;
        } else if (key === "confirmpassword") {
          err.confirmpassword =
            fieldData.password === value ? "" : "Senhas não são iguais!";
        } else if (key === "otp") {
          err.otp = value && value.length > 0 ? "" : "Favor preencher o campo!";
        }

        setErrors({
          ...errors,
          ...err,
        });
      }, 1200);
    }
  };

  const handleBack = () => {
    if (fieldData.otpSent) {
      setFieldData({
        ...fieldData,
        otpSent: false,
      });
    } else {
      props.history.push("/login");
    }
  };

  const { classes } = props;
  return (
    <Grid style={{ height: "100vh" }}>
      <Box className={classes.root}>
        <Grid container item sm={12} md={6}>
          <img src={Logo} className={classes.logo} alt="logo"></img>
        </Grid>
        <Divider orientation="vertical" className={classes.divider} />
        <Grid container item sm={12} md={6}>
          <form className={classes.form} noValidate onSubmit={saveNewPassword}>
            <Typography
              variant="h5"
              component="h5"
              style={{ textAlign: "center" }}
            >
              <IconButton onClick={handleBack}>
                <KeyboardBackspaceIcon />
              </IconButton>
              Esqueci senha?
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              style={{ textAlign: "center", marginBottom: 20 }}
            >
              {fieldData.otpSent
                ? fieldData.verificationType === "phone"
                  ? `Você recebera um código por SMS no telefone informado, favor digitar-lo no campo abaixo para continuar`
                  : "Você receberá um código E-mail no endereço informado, favor digitar-lo no campo abaixo para continuar"
                : ""}
            </Typography>
            {!fieldData.otpSent ? (
              <>
                <FormControl
                  component="fieldset"
                  className={classes.radioGroup}
                >
                  <FormLabel component="legend">
                    Favor escolher qual o método de verificação
                  </FormLabel>
                  <RadioGroup
                    aria-label="verification type"
                    name="verificationType"
                    value={fieldData.verificationType}
                    onChange={onChange}
                    row
                  >
                    <FormControlLabel
                      value="email"
                      control={<Radio color="primary" />}
                      label="E-mail"
                    />
                    <FormControlLabel
                      value="phone"
                      control={<Radio color="primary" />}
                      label="Telefone"
                    />
                  </RadioGroup>
                </FormControl>
                {fieldData.verificationType === "email" && (
                  <TextField
                    error={errors.email && errors.email.length ? true : false}
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
                    onKeyUp={(e) =>
                      handleValidateField(e, "email", e.target.value)
                    }
                    autoFocus
                    style={{
                      margin: 0,
                    }}
                    helperText={
                      typeof errors.email === "string" &&
                      errors.email.length > 0
                        ? errors.email
                        : ""
                    }
                  />
                )}
                {fieldData.verificationType === "phone" && (
                  <NumberFormat
                    error={errors.phone && errors.phone.length ? true : false}
                    onValueChange={(values) => {
                      onNumberChange(values.floatValue, "phone");
                    }}
                    format="(##) #####-####"
                    mask="_ "
                    required
                    autoFocus
                    value={fieldData.phone}
                    isNumericString
                    fullWidth
                    type="phone"
                    variant="outlined"
                    label="Telefone"
                    helperText={
                      typeof errors.phone === "string" &&
                      errors.phone.length > 0
                        ? errors.phone
                        : ""
                    }
                    customInput={TextField}
                  />
                )}

                <div className={classes.buttonWrapper}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    style={{ fontWeight: "bold" }}
                    disabled={
                      fieldData.loading ||
                      (fieldData.verificationType === "email" &&
                        errors.email &&
                        errors.email.length) ||
                      (fieldData.verificationType === "phone" &&
                        errors.phone &&
                        errors.phone.length)
                    }
                    classes={{
                      root: `${classes.submit}`,
                    }}
                    onClick={sendOTP}
                  >
                    Gerar senha única
                  </Button>
                  {fieldData.loading && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                      color="primary"
                    />
                  )}
                </div>
              </>
            ) : (
              <>
                <TextField
                  error={errors.otp && errors.otp.length ? true : false}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="otp"
                  label="Senha única"
                  type="text"
                  id="otp"
                  value={fieldData.otp}
                  onChange={onChange}
                  onKeyUp={(e) => handleValidateField(e, "otp", e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <span className={classes.resend} onClick={sendOTP}>
                          Reenviar senha única
                        </span>
                      </InputAdornment>
                    ),
                  }}
                  helperText={
                    typeof errors.otp === "string" && errors.otp.length > 0
                      ? errors.otp
                      : ""
                  }
                />
                <TextField
                  error={errors.password}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Digite a nova senha"
                  type={fieldData.showPassword ? "text" : "password"}
                  id="password"
                  value={fieldData.password}
                  onChange={onChange}
                  onKeyUp={(e) =>
                    handleValidateField(e, "password", e.target.value)
                  }
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icon
                          aria-label="toggle password visibility"
                          size="small"
                          onClick={(e) =>
                            toggleState(e, "showPassword", "password")
                          }
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
                  helperText=""
                />
                <PasswordValidator
                  password={fieldData.password}
                  checkValidity={checkValidity}
                />
                <TextField
                  error={
                    errors.confirmpassword && errors.confirmpassword.length
                      ? true
                      : false
                  }
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="confirmpassword"
                  label="Confirme a nova senha"
                  type={fieldData.showPassword ? "text" : "password"}
                  id="confirmpassword"
                  value={fieldData.confirmpassword}
                  onChange={onChange}
                  onKeyUp={(e) =>
                    handleValidateField(e, "confirmpassword", e.target.value)
                  }
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icon
                          aria-label="toggle password visibility"
                          size="small"
                          onClick={(e) =>
                            toggleState(e, "showPassword", "confirmpassword")
                          }
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
                    typeof errors.confirmpassword === "string" &&
                    errors.confirmpassword.length > 0
                      ? errors.confirmpassword
                      : ""
                  }
                />
                <div className={classes.buttonWrapper}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    style={{ fontWeight: "bold" }}
                    disabled={
                      fieldData.loading ||
                      (fieldData.verificationType === "email" &&
                        errors.email) ||
                      (fieldData.verificationType === "phone" &&
                        errors.phone) ||
                      errors.password ||
                      errors.confirmpassword
                    }
                    classes={{
                      root: `${classes.submit}`,
                    }}
                    onClick={saveNewPassword}
                  >
                    Salvar nova senha
                  </Button>
                  {fieldData.loading && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                      color="primary"
                    />
                  )}
                </div>
              </>
            )}
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
    sendOTP: (data) => dispatch(sendOTP(data)),
    forgotPasswordChange: (data) => dispatch(forgotPasswordChange(data)),
    updateLoading: (bool) => dispatch(isLoading(bool)),
    updateAuth: (bool, data) => dispatch(updateAuthentication(bool, data)),
  };
};

export default withStyles(useStyles)(
  connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
);
