const checkReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CHECK_IS_LOADING':
      return { ...state, checkIsLoading: action.payload }
    case 'CLEAR_CHECK_STATE':
      return { ...state, check: null }
    case 'SET_CHECK_COUNT':
      return { ...state, checkCount: action.payload }
    case 'SET_CHECKS':
      return { ...state, checks: action.payload, checkIsLoading: false }
    case 'SET_CHECK':
      return { ...state, check: action.payload, checkIsLoading: false }
    default:
      return state;
  }
};

export default checkReducer;
