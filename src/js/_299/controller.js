import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {async} from 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
 
    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    // resultsView.update(model.getSearchResultsPage());
    resultsView.update(model.getSearchResultsPage());
    
    // 1) Updating book marks view
    bookmarksView.update(model.state.bookmarks);
    
    // 2) Loading recipe
    await model.loadRecipe(id);
    
    // 3) Rendering recipe
    recipeView.render(model.state.recipe);

  } catch (err) {
    recipeView.renderError();
    // console.error(err);
  }
};

const controlSearchResults = async function() {
  try {
    resultsView.renderSpinner();

    // console.log(resultsView);
    // await model.loadSearchResults('pizza');
    
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;
    
    // 2) Load search results
    await model.loadSearchResults(query);
    
    // 3) Render results
    // console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination button
    paginationView.render(model.state.search);
  } catch(err) {
    console.log(err);
  }
};

// controlSearchResults();


const controlPagination = function(goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW  pagination button
  // paginationView.render(model.state.search);
  paginationView.render(model.state.search);
};

const controlServings = function(newServings) {
  // Update the recipe sevings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);

}

const conrtrolAddBookmark = function() {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) RFender recipe view
  console.log(model.state.recipe);
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change ID in URL
    window.history.pushState(null, '', `#{model.state.recipe.id}`);
    // window.history.back(); // going back the last page

    // Close form window
    setTimeout(function() {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

  } catch(err) {
    console.error('😛', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(conrtrolAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();


