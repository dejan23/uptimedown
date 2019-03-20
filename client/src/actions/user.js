import axios from 'axios';

export const clearUserState = () => ({
  type: 'CLEAR_USER_STATE'
});

export const successMessage = (message) => ({
    type: 'SUCCESS_MESSAGE',
    payload: message
})

export const clearMessage2 = () => ({
    type: 'CLEAR_MESSAGE',
    payload: null
})

// SET_USER
export const setUser = user => ({
  type: 'SET_USER',
  payload: user
});

export const userIsLoading = (bool) => ({
  type: 'USER_IS_LOADING',
  payload: bool
});

export const startSetUser = username => {
  return dispatch => {
    dispatch(userIsLoading(true))
    axios.get(`${process.env.API_URL}/accounts/${username}`)
      .then(response => {
        dispatch(setUser(response.data));
      })
      .catch(error => {
        dispatch(userIsLoading(false))
      })
  };
};

// SET_USERS ALL
export const setUsers = users => ({
  type: 'SET_USERS',
  payload: users
});

export const startSetUsers = () => {
  return dispatch => {
    dispatch(userIsLoading(true))
    axios.get(`${process.env.API_URL}/users`)
      .then(response => {
        dispatch(userIsLoading(false))
        dispatch(setUsers(response.data));
      })
      .catch(error => {
        dispatch(userIsLoading(false))
      })
  };
};

// SET_USER_UPDATE
export const setUserUpdate = user => ({
  type: 'SET_USER_UPDATE',
  payload: user
});

export const startSetUserUpdate = (formData) => {
  return async dispatch => {
    return axios.put(`${process.env.API_URL}/accounts/user`, formData, {
      headers: {authorization: localStorage.getItem('token')}
    })
    .then(async (response) => {
      await dispatch(setUserUpdate(response.data.user));
      await localStorage.setItem('username', response.data.user.username);
      return response.data
    })
    .catch(error => {
      dispatch(userIsLoading(false))
      return error.response.data
    })
  };
};

export const setUserProfile = profile => ({
  type: 'SET_USER_PROFILE',
  payload: profile
});

export function startSetUserProfile() {
  return function(dispatch) {
    dispatch(userIsLoading(true))
    return axios.get(`${process.env.API_URL}/accounts/user`, {
      headers: {authorization: localStorage.getItem('token')}
    })
    .then(async (response) => {
      dispatch(setUserProfile(response.data.user))
      await localStorage.setItem('username', response.data.user.username);

    })
    .catch(error => {
      dispatch(userIsLoading(false))
    });
  };
}

export const setValidateUser = validate => ({
  type: 'SET_VALIDATE_USER',
  payload: validate
});

export function startSetValidateUser(token) {
  return function(dispatch) {
    axios.get(`${process.env.API_URL}/accounts/validate/${token}`)
      .then(response => {
        dispatch(setValidateUser(response.data))
      })
      .catch(error => {
        dispatch(setValidateUser(error.response.data));

      });
  };
}

export const setResendEmail = resentEmail => ({
  type: 'SET_RESEND_EMAIL',
  payload: resentEmail
});


export function startSetResendEmail(email) {
  return function(dispatch) {
    return axios.post(`${process.env.API_URL}/accounts/resend-email`, email)
      .then(response => {
        dispatch(setResendEmail(response.data))
        return response.data
      })
      .catch(error => {
        return error.response.data
      });
  };
}

export const setResetPasswordByEmail = newPassword => ({
  type: 'SET_NEW_PASSWORD_BY_EMAIL',
  payload: newPassword
});


export function startSetResetPasswordByEmail(email) {
  return function(dispatch) {
    return axios.post(`${process.env.API_URL}/accounts/reset-password-by-email`, email)
      .then(response => {
        dispatch(setResendEmail(response.data))
        return response.data
      })
      .catch(error => {
        return error.response.data
      });
  };
}

export const setActivateNewPassword = newPasswordActivate => ({
  type: 'SET_ACTIVATE_NEW_PASSWORD',
  payload: newPasswordActivate
});

export function startSetActivateNewPassword(token) {
  return function(dispatch) {
    return axios.get(`${process.env.API_URL}/accounts/activate-new-password?token=${token}`)
      .then(response => {
        dispatch(setActivateNewPassword(response.data))
        return response.data
      })
      .catch(error => {
        dispatch(setActivateNewPassword(error.response.data))
        return error.response.data
      });
  };
}
