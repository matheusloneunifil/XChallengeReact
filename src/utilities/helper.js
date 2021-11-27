export const updateDocTitle = (titleText, isFullTitle) => {
  if (isFullTitle) {
    document.title = titleText;
  } else {
    document.title = `${titleText} • Admin Console`;
  }
};

export const hasUpperCase = (value) => {
  return new RegExp(/[A-Z]/).test(value);
};

export const hasLowerCase = (value) => {
  return new RegExp(/[a-z]/).test(value);
};

export const hasNumber = (value) => {
  return new RegExp(/[0-9]/).test(value);
};

export const hasSpecialChar = (value) => {
  return new RegExp(/[!#@$%^&*)(+=._-]/).test(value);
};

export const isValidEmail = (email) => {
  let re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// Checa se o telefone tem digitos suficientes
export const isValidPhoneNumber = (phoneNumber, countryCode) => {
  let slicedPhone;
  let err = "";
  const phoneRegex = /[^0-9]+/g;
  const checkCountryCode = phoneNumber.match(phoneRegex);

  // if (checkCountryCode && checkCountryCode.length > 0)
  //     slicedPhone = phoneNumber
  //         .replace(phoneRegex, "")
  //         .slice(countryCode.length);
  // else slicedPhone = phoneNumber;
  slicedPhone = phoneNumber.substring(3);

  let valid = false;
  if (slicedPhone.length === 10) {
    valid = true;
  } else if (slicedPhone.length > 10) {
    err = "more than 10 digits";
  } else {
    err = "less than 10 digits";
  }
  return {
    valid,
    err,
  };
};
