import 'regenerator-runtime/runtime';
import { API_URL, RES_PER_PAGE } from './config';
import { getJSON } from './helper';

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RES_PER_PAGE,
        page: 1,
    },
    bookmarks: [],
};

export const loadRecipe = async function(id) {
    try {

        const data = await getJSON(`${API_URL}${id}`);

        const { recipe } = data.data;
        state.recipe = {
          id: recipe.id,
          title: recipe.title,
          publisher: recipe.publisher,
          sourceURL: recipe.source_url,
          image: recipe.image_url,
          servings: recipe.servings,
          cookingTime: recipe.cooking_time,
          ingredients: recipe.ingredients,
        };
        
        if(state.bookmarks.some(b => b.id === id))
            state.recipe.bookmarked = true;
        else
            state.recipe.bookmarked = false; 

        console.log(state.recipe);
    } catch (err) {
        console.error(`${err} 😑😑😑`);
        throw err;
    }
};

export const loadSearchResult = async function(query) {
    try {
        state.search.query = query;

        const data = await getJSON(`${API_URL}?search=${query}`);

        state.search.results = data.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url
            };
        });

    } catch (err) {
        console.error(`${err} 😑😑😑`);
        throw err;
    }
};

export const getSearchResultsPage = function( page = 1 ) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;
    return state.search.results.slice(start, end);
};

export const updateServings = function(newServings) {
    state.recipe.ingredients.forEach(ingredient => {
        ingredient.quantity = (ingredient.quantity * newServings) / state.recipe.servings; 
    });
    state.recipe.servings = newServings;
};

export const addBookmark = function(recipe) {
    // Add bookmark to state
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmark
    if( recipe.id === state.recipe.id ) state.recipe.bookmarked = true;
};

export const removeBookmark = function(id) {
    const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);

    // Remove bookmark from state
    state.bookmarks.splice(index, 1);

    if ( id === state.recipe.id ) state.recipe.bookmarked = false;
};
