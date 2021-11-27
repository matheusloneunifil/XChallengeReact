import React, { Component } from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import {
  hasNumber,
  hasUpperCase,
  hasLowerCase,
  hasSpecialChar,
} from "../utilities/helper";
import { colors } from "../utilities/constants";

class PasswordValidator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rules: [
        {
          id: "uppercase",
          label: "Uma letra maiúscula",
          isPassed: false,
        },
        {
          id: "lowercase",
          label: "Uma letra minúscula",
          isPassed: false,
        },
        { id: "number", label: "Um numeral", isPassed: false },
        // {
        //   id: "sChar",
        //   label: "deve ter caractere especial",
        //   isPassed: false,
        // },
        { id: "8char", label: "Entre 8 - 16 caracteres", isPassed: false },
      ],
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.password !== prevProps.password) {
      this.validatePassword();
    }
  }

  validatePassword = () => {
    const { password } = this.props;
    let modifiedRules = this.state.rules.map((rule, key) => {
      switch (rule.id) {
        case "uppercase":
          rule.isPassed = hasUpperCase(password);
          break;
        case "lowercase":
          rule.isPassed = hasLowerCase(password);
          break;
        case "number":
          rule.isPassed = hasNumber(password);
          break;
        case "sChar":
          rule.isPassed = hasSpecialChar(password);
          break;
        case "8char":
          rule.isPassed = password.length >= 8 && password.length <= 16;
          break;
      }
      return rule;
    });

    let validRules = modifiedRules.filter((rule) => rule.isPassed).length;

    this.setState(
      {
        rules: modifiedRules,
      },
      () => {
        this.props.checkValidity(validRules);
      }
    );
  };

  render() {
    return (
      <div className="passwordValidatorWrapper">
        {this.state.rules.map((rule, key) => {
          return (
            <div key={key}>
              <CheckCircleIcon
                className="icon"
                style={{
                  color: rule.isPassed ? colors.GREEN : colors.BODY1,
                }}
              />
              {rule.label}
            </div>
          );
        })}
      </div>
    );
  }
}

export default PasswordValidator;
