import React, { useState } from "react";
import { connect } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  InputAdornment,
  Icon,
  CircularProgress,
  Divider,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { isValidEmail } from "../utilities/helper";
import {
  isLoading,
  updateAuthentication,
  signupRequest,
} from "../store/action";
import PasswordValidator from "./PasswordValidator";
import Logo from "../assets/logo.png";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
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
  eyeIcon: {
    cursor: "pointer",
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
  fName: "",
  birthday: new Date("2014-08-18T21:11:54"),
  password: "",
  showPassword: false,
  validPassword: 0,
  phone: "",
  cep: "",
  cpf: "",
  loading: false,
  acceptPolicy: false,
  submitEnabled: false,
};
const initialErrors = {
  fname: "",
  cep: "",
  cpf: "",
  email: "",
  phone: "",
  address: "",
  password: false,
  acceptPolicy: false,
};

const SignUp = (props) => {
  const [fieldData, setFieldData] = useState(initialFieldData);
  const [errors, setErrors] = useState(initialErrors);
  const { classes } = props;
  let timeout;
  const isSubmitEnabled = (data) => {
    const { showPassword, loading, acceptPolicy, submitEnabled, ...fields } =
      data;
    let output = Object.keys(fields).find((key) => !data[key]);
    return output && output.length ? false : true;
  };

  const onChange = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setErrors({
      ...errors,
      [e.target.name]:
        e.target.name === "acceptPolicy" || e.target.name === "password"
          ? false
          : "",
    });
    let data;
    if (e.target.name === "acceptPolicy") {
      data = {
        ...fieldData,
        [e.target.name]: !fieldData[e.target.name],
      };
    } else {
      data = {
        ...fieldData,
        [e.target.name]: e.target.value.trim(),
      };
    }

    setErrors({
      ...errors,
      [e.target.name]: false,
    });
    setFieldData({
      ...data,
      submitEnabled: isSubmitEnabled(data),
    });
  };

  const onNumberChange = (newData, key) => {
    handleValidateField({}, key, newData);
    setErrors({
      ...errors,
      [key]: key === "acceptPolicy" || key === "password" ? false : "",
    });
    let data = {
      ...fieldData,
      [key]: newData,
    };
    setFieldData({
      ...data,
      submitEnabled: isSubmitEnabled(data),
    });
  };

  const toggleState = (e, name) => {
    setFieldData({
      ...fieldData,
      [name]: !fieldData[name],
    });
  };

  const resetForm = () => {
    setFieldData(initialFieldData);
    setErrors(initialErrors);
  };

  const checkValidity = (validRules) => {
    setFieldData({
      ...fieldData,
      validPassword: validRules,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFieldData({
      ...fieldData,
      loading: true,
    });

    const { email, password, phone, fName, birthday, address, cep, cpf } =
      fieldData;
    if (
      !fName.length ||
      !email.length ||
      !password.length ||
      !address.length ||
      !cep ||
      !birthday ||
      !address
    ) {
      setFieldData({
        ...fieldData,
        loading: false,
        submitEnabled: false,
      });
      return;
    }
    if (errors.email || email.length === 0) {
      setFieldData({
        ...fieldData,
        loading: false,
      });
      setErrors({
        ...errors,
        email: true,
        message: "",
      });
    } else if (errors.password || password.length === 0) {
      // toast.error("Senha invalida.");
      setFieldData({
        ...fieldData,
        loading: false,
      });
      setErrors({
        ...errors,
        password: true,
      });
    } else if (errors.phone || phone.length === 0) {
      setFieldData({
        ...fieldData,
        loading: false,
      });
      setErrors({
        ...errors,
        phone: true,
      });
    } else if (!fieldData.acceptPolicy) {
      setFieldData({
        ...fieldData,
        loading: false,
        submitEnabled: false,
      });
      setErrors({
        ...errors,
        acceptPolicy: true,
      });
    } else {
      let params = {
        fullname: fName.trim(),
        birthday: birthday,
        password: password.trim(),
        phone: phone,
        email: email,
        address: address.trim(),
        cep: cep,
        cpf: cpf,
      };
      try {
        await props.signupRequest(params);
        setFieldData(initialFieldData);
        const locationObj = {
          pathname: "/login",
          state: {
            signup: true,
          },
        };
        props.history.push(locationObj);
      } catch (error) {
        setFieldData({
          ...fieldData,
          loading: false,
        });
      }
    }
  };

  const handleValidateField = (event, key, value) => {
    const target = event.target;

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
      fieldData.phone === "" &&
      key === "phone"
    ) {
      setErrors({
        ...errors,
        phone: false,
      });
    } else {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout((event) => {
        let err = {};
        if (key === "email") {
          err.email = isValidEmail(value.trim()) ? "" : "Email inválido";
        } else if (key === "cep") {
          err.cep = value && `${value}`.length === 8 ? "" : "CEP inválido";
        } else if (key === "cpf") {
          err.cpf = value && `${value}`.length === 11 ? "" : "CPF inválido";
        } else if (key === "fName") {
          err.fName =
            value && value.length > 0 ? "" : "Favor preencher o campo!";
        } else if (key === "phone") {
          err.phone =
            value && `${value}`.length === 11 ? "" : "Favor preencher o campo!";
        } else {
          err.password = fieldData.validPassword === 4 ? false : true;
        }
        setErrors({
          ...errors,
          ...err,
        });
      }, 1000);
    }
  };

  const handleBack = () => {
    props.history.push("/login");
  };

  return (
    <Grid container spacing={2} style={{ height: "100vh" }}>
      <Box className={classes.root}>
        <Grid container item sm={12} md={6}>
          <img src={Logo} className={classes.logo} alt="logo"></img>
        </Grid>
        <Divider orientation="vertical" className={classes.divider} />
        <Grid container item sm={12} md={6}>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <TextField
                  error={errors.fName && errors.fName.length ? true : false}
                  autoComplete="fname"
                  name="fName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="Nome Completo"
                  autoFocus
                  onChange={onChange}
                  onKeyUp={(e) =>
                    handleValidateField(e, "fName", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    fullWidth
                    // disableToolbar
                    disableFuture
                    autoOk
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="birthday"
                    name="birthday"
                    style={{
                      margin: 0,
                    }}
                    label="Data de nascimento"
                    inputVariant="outlined"
                    value={fieldData.birthday}
                    onChange={(data) => onNumberChange(data, "birthday")}
                    KeyboardButtonProps={{
                      "aria-label": "Data de nascimento",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  error={errors.email && errors.email.length ? true : false}
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="E-mail"
                  name="email"
                  autoComplete="email"
                  onChange={onChange}
                  onKeyUp={(e) =>
                    handleValidateField(e, "email", e.target.value)
                  }
                  helperText={errors.email.length ? errors.email : ""}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <NumberFormat
                  error={errors.phone && errors.phone.length ? true : false}
                  onValueChange={(values) => {
                    onNumberChange(values.floatValue, "phone");
                  }}
                  format="(##) #####-####"
                  mask="_ "
                  required
                  value={fieldData.phone}
                  isNumericString
                  fullWidth
                  type="phone"
                  variant="outlined"
                  label="Telefone"
                  helperText={
                    typeof errors.phone === "string" && errors.phone.length > 0
                      ? errors.phone
                      : ""
                  }
                  customInput={TextField}
                />
              </Grid>
              <Grid item xs={12}>
                <NumberFormat
                  error={errors.cpf && errors.cpf.length ? true : false}
                  onValueChange={(values) => {
                    onNumberChange(values.floatValue, "cpf");
                  }}
                  format="###.###.###-##"
                  mask="_ "
                  required
                  value={fieldData.cpf}
                  isNumericString
                  fullWidth
                  type="text"
                  variant="outlined"
                  label="CPF"
                  helperText={
                    typeof errors.cpf === "string" && errors.cpf.length > 0
                      ? errors.cpf
                      : "Apenas números por favor"
                  }
                  customInput={TextField}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={errors.address && errors.address.length ? true : false}
                  variant="outlined"
                  required
                  fullWidth
                  multiline
                  minRows={2}
                  id="address"
                  label="Endereço"
                  name="address"
                  autoComplete="address"
                  onChange={onChange}
                  onKeyUp={(e) =>
                    handleValidateField(e, "address", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <NumberFormat
                  error={errors.cep && errors.cep.length ? true : false}
                  onValueChange={(values) => {
                    onNumberChange(values.floatValue, "cep");
                  }}
                  format="#####-###"
                  mask="_ "
                  required
                  value={fieldData.cep}
                  isNumericString
                  fullWidth
                  type="text"
                  variant="outlined"
                  label="CEP"
                  helperText={
                    typeof errors.cep === "string" && errors.cep.length > 0
                      ? errors.cep
                      : "Apenas números por favor"
                  }
                  customInput={TextField}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={errors.password}
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Senha"
                  type={fieldData.showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  onChange={onChange}
                  onKeyUp={(e) =>
                    handleValidateField(e, "password", e.target.value)
                  }
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
                />
                <PasswordValidator
                  password={fieldData.password}
                  checkValidity={checkValidity}
                />
              </Grid>
            </Grid>

            <FormControlLabel
              onChange={onChange}
              name="acceptPolicy"
              control={
                <Checkbox
                  //error={errors.acceptPolicy}
                  color="default"
                  checked={fieldData.acceptPolicy}
                />
              }
              label={"Eu aceito os termos de uso e privacidade"}
            />

            {errors.acceptPolicy && (
              <Typography
                component="p"
                variant="caption"
                style={{ color: "#f44336" }}
              >
                Por favor, aceite os termos de uso e privacidade
              </Typography>
            )}

            <div className={classes.buttonWrapper}>
              <Button
                type="submit"
                fullWidth
                variant="outlined"
                color="primary"
                className={classes.submit}
                disabled={
                  fieldData.loading ||
                  Object.keys(errors).find(
                    (key) => errors[key] || !fieldData.submitEnabled
                  )
                    ? true
                    : false
                }
              >
                Cadastrar
              </Button>
              {fieldData.loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                  color="primary"
                />
              )}
            </div>
            <Grid container justifyContent="flex-end">
              <Grid item>
                Já possui uma conta?
                <Link to="/login" variant="body2" component={RouterLink}>
                  {` Log in`}
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
    signupRequest: (data) => (
      dispatch(signupRequest(data)), dispatch(isLoading(true))
    ),
    updateLoading: (bool) => dispatch(isLoading(bool)),
    updateAuth: (bool, data) => (
      dispatch(updateAuthentication(bool, data)), dispatch(isLoading(true))
    ),
  };
};

export default withStyles(useStyles)(
  connect(mapStateToProps, mapDispatchToProps)(SignUp)
);
