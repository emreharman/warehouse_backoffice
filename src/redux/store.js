import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";

import authReducer from "./reducers/authReducer";
import categoryReducer from "./reducers/categoryReducer";
import productReducer from "./reducers/productReducer";
import variantOptionReducer from "./reducers/variantOptionReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  categories: categoryReducer,
  products: productReducer,
  variantOptions: variantOptionReducer
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
