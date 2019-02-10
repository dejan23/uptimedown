const eventReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CLEAR_EVENT_STATE':
      return { ...state, event: null, events: null }
    case 'SET_EVENT':
      return { ...state, event: action.payload }
    case 'SET_EVENTS':
      return { ...state, events: action.payload }
    default:
      return state;
  }
};

export default eventReducer;
