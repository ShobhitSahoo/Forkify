import * as model from "./model.js";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";

import "regenerator-runtime/runtime";
import "core-js/stable/";

const recipeContainer = document.querySelector(".recipe");

const controlRecipes = async function () {
  try {

    const id = window.location.hash.slice(1);
    if (!id) return;

    // Showing the spinner while model fetches the recipe data
    recipeView.renderSpinner();

    await model.loadRecipe(id);

    // Rendering the recipe into markup
    recipeView.render(model.state.recipe);
  } catch (e) {
    console.log(e);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();

    if(!query) return;

    await model.loadSearchResult(query);

    // Rendering the search results
    console.log(model.state.search.results);
  } catch (e) {
    console.log(e);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};

init();
