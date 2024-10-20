import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  foods: [],  // Initialize foods as an empty array
  loading: false,
  food: undefined,
  error: "",
};

const getNewFoods = (id, foods) => {
  return foods.filter((food) => id !== food._id);
};

const foodSlice = createSlice({
  name: "Foods",
  initialState,
  reducers: {
    foodRequest: (state) => {
      state.loading = true;
    },
    foodSuccess: (state, action) => {
      state.foods = action.payload.foods; // Assuming action.payload.foods is an array
      state.loading = false;
    },
    addFoodSuccess: (state, action) => {
      console.log("state", state);
      console.log("action", action);
      state.foods.push(action.payload.food); // Now foods is an array, so push will work
      state.loading = false;
    },
    deleteFoodSuccess: (state, action) => {
      state.foods = getNewFoods(action.payload, current(state.foods));
      state.loading = false;
    },
    getFoodByIdSuccess: (state, action) => {
      state.food = action.payload.food;
      state.loading = false;
    },
    foodFail: (state, action) => {
      state.foods = []; // Clear the foods array in case of failure
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  foodRequest,
  foodSuccess,
  foodFail,
  getFoodByIdSuccess,
  addFoodSuccess,
  deleteFoodSuccess,
} = foodSlice.actions;

export default foodSlice.reducer;
