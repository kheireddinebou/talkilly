export const validateEmail = text => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  return reg.test(text);
};

export const validatePassword = text => {
  if (!text) {
    return false;
  } else {
    return text.trim().length >= 6 === true;
  }
};

export const validateName = text => {
  if (!text) {
    return false;
  } else {
    return text.trim().length >= 4 === true;
  }
};


