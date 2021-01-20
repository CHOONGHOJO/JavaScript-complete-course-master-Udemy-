import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

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
    // resultsView.render(model.getSearchResultsPage());
    resultsView.update(model.getSearchResultsPage());

    // 1) Loading recipe
    await model.loadRecipe(id);

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);

  //     // test
  // controlServings();
  } catch (err) {
    recipeView.renderError();
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
  paginationView.update(model.state.search);
};

const controlServings = function(newServings) {
  // Update the recipe sevings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.render(model.state.recipe);

}
const init = function() {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
