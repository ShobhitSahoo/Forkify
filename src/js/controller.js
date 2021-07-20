import * as model from './model.js';
import recipeView from './views/recipeView';

import 'regenerator-runtime/runtime';
import 'core-js/stable/';

const recipeContainer = document.querySelector('.recipe');



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

const init = function() {
  recipeView.addHandlerRender(controlRecipes);
}

init();