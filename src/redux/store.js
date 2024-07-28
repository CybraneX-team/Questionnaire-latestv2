import { createStore } from "redux";

const jwtReducer = (state, action) => {
  state = action.payload;
  return state;
};

const qReducer = (state, action) => {
  state = action.payload;
  return state;
};

const gridReducer = (state, action) => {
  state = action.payload;
  return state;
};

const answerRequestReducer = (state, action) => {
  state = action.payload;
  return state;
};

const answerReducer = (state, action) => {
  state = action.payload;
  return state;
};

const scoreReducer = (state, action) => {
  state = action.payload;
  return state;
};

const bubbleReducer = (state, action) => {
  state = action.payload;
  return state;
};

const qTitleReducer = (state, action) => {
  state = action.payload;
  return state;
};

const mapDataReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD":
      return [...state, action.payload];

    case "UPDATE":
      return state.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );

    default:
      return state;
  }
};

export const jwtStore = createStore(jwtReducer);
export const qStore = createStore(qReducer);
export const gridStore = createStore(gridReducer);
export const answerStore = createStore(answerRequestReducer);
export const solnStore = createStore(answerReducer);
export const scoreStore = createStore(scoreReducer);
export const bubbleStore = createStore(bubbleReducer);
export const mapStore = createStore(mapDataReducer);
export const qTitleStore = createStore(qTitleReducer);
