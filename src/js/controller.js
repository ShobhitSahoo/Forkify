import * as model from "./model.js";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import resultsView from "./views/resultsView";
import bookmarksView from "./views/bookmarksView";
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

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    
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
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function() {
  if(!model.state.recipe.bookmarked) 
    model.addBookmark(model.state.recipe);
  else
    model.removeBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
