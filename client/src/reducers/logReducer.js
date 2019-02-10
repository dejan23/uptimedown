const logReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CLEAR_LOG_STATE':
      return { ...state, log: null, logStats: null }
    case 'LOG_IS_LOADING':
      return { ...state, logIsLoading: action.payload }
    case 'SET_LOG_STATS':
      return { ...state, logStats: action.payload, logIsLoading: false }
    case 'SET_LOG':
      return { ...state, log: action.payload, logIsLoading: false }



    default:
      return state;
  }
};

export default logReducer;
