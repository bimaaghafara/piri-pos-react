import { ActionConst } from 'react-native-router-flux';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { reducer as formReducer } from 'redux-form';
import thunk from 'redux-thunk';

const sceneReducer = (state = {}, { type, scene }) => {
  switch (type) {
    case ActionConst.FOCUS:
      return { ...state, scene };
    default:
      return state;
  }
};

const allReducer = combineReducers({
  form: formReducer,
  scene: sceneReducer,
});

export const STORE = createStore(
  allReducer,
  applyMiddleware(thunk),
);