const userReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ACTIVATE_NEW_PASSWORD':
      return { ...state, newPasswordActivate: action.payload }
    case 'SET_NEW_PASSWORD_BY_EMAIL':
      return { ...state, newPassword: action.payload }
    case 'SET_RESEND_EMAIL':
      return { ...state, resendEmail: action.payload }
    case 'SET_VALIDATE_USER':
      return { ...state, validate: action.payload }
    case 'CLEAR_USER_STATE':
      return { ...state, user: null, users: null }
    case 'USER_IS_LOADING':
      return { ...state, userIsLoading: action.payload }
    case 'SET_USER':
      return { ...state, user: action.payload, userIsLoading: false }
    case 'SET_USERS':
      return { ...state, users: action.payload }
    case 'SET_USER_UPDATE':
      return { ...state, user: action.payload }
    case 'SET_USER_PROFILE':
      return { ...state, user: action.payload, userIsLoading: false }
    case 'SUCCESS_MESSAGE':
      return { ...state, message: action.payload, savedMessage: 'Saved' }
    case 'CLEAR_MESSAGE':
      return { ...state, message: action.payload,  savedMessage: null }
    default:
      return state;
  }
};

export default userReducer;
