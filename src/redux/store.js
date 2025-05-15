import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';

import authReducer from './reducers/authReducer';
import categoryReducer from './reducers/categoryReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  categories: categoryReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
