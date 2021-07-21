import * as model from "./model.js";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import resultsView from "./views/resultsView";
import paginationView from "./views/paginationView";

import "regenerator-runtime/runtime";
import "core-js/stable/";

// if( module.hot ) module.hot.accept();

const controlRecipes = async function () {
  try {

    const id = window.location.hash.slice(1);
    if (!id) return;

    // Showing the spinner while model fetches the recipe data
    recipeView.renderSpinner();

    await model.loadRecipe(id);

    // Rendering the recipe into markup
    recipeView.render(model.state.recipe);
    // controlServings();

  } catch (e) {
    console.log(e);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();

    if(!query) return;

    await model.loadSearchResult(query);

    // Rendering the search results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // Render initial pagination button
    paginationView.render(model.state.search);

  } catch (e) {
    console.log(e);
  }
};

const controlPagination = function(gotoPage) {
  // Rendering new results
  resultsView.render(model.getSearchResultsPage(gotoPage));

  // Render new pagination button
  paginationView.render(model.state.search);
};

const controlServings = function(newServings) {
  // Update the recipe servings page
  model.updateServings(newServings);
  
  // Update the recipe servings page
  recipeView.render(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
