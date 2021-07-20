import * as model from './model.js';
import recipeView from './views/recipeView';

import 'regenerator-runtime/runtime';
import 'core-js/stable/';

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function() {
  try {

    const id = window.location.hash.slice(1);
    if(!id) return;

    // Showing the spinner while model fetches the recipe data
    recipeView.renderSpinner();
    
    await model.loadRecipe(id);

    // Rendering the recipe into markup
    recipeView.render(model.state.recipe);

  } catch (e) {
    alert(e);
    console.log(e);
  }
};

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipes));
