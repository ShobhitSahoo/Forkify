import 'regenerator-runtime/runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config';
// import { getJSON, sendJSON } from './helper';
import { AJAX } from './helper';

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

const createRecipeObject = function(data) {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceURL: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key })
    };
};

export const loadRecipe = async function(id) {
    try {

        const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

        state.recipe = createRecipeObject(data);
        
        if(state.bookmarks.some(b => b.id === id))
            state.recipe.bookmarked = true;
        else
            state.recipe.bookmarked = false; 

        // console.log(state.recipe);
    } catch (err) {
        console.error(`${err} 😑😑😑`);
        throw err;
    }
};

export const loadSearchResult = async function(query) {
    try {
        state.search.query = query;

        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

        state.search.results = data.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
                ...(recipe.key && { key: recipe.key })
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

const persistBookmark = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function(recipe) {
    // Add bookmark to state
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmark
    if( recipe.id === state.recipe.id ) state.recipe.bookmarked = true;
    persistBookmark();
};

export const removeBookmark = function(id) {
    const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);

    // Remove bookmark from state
    state.bookmarks.splice(index, 1);

    if ( id === state.recipe.id ) state.recipe.bookmarked = false;
    persistBookmark();
};

const init = function() {
    const storage = localStorage.getItem('bookmarks');

    if(storage) {
        state.bookmarks = JSON.parse(storage);
    }
};

init();

export const uploadRecipe = async function(newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe)
        .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
        .map(ing => {
            const ingArr = ing[1].split(',').map(el => el.trim());
            if(ingArr.length !== 3) throw new Error('Invalid ingredient format! Please use the correct format 😅');
            const [quantity, unit, description] = ingArr;
            return { quantity: quantity ? +quantity : null, unit, description };
        });
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };

        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
    } catch (err) {
        throw err;
    }

};