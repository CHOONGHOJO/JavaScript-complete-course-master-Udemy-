const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

/////////////////////////////////////////
// forkify-v2.netlify.app
/////////////////////////////////////////
// 277. Project Overview and Planning (I)
///////////////////////////////////////
// 278. Loading a Recipe from API
// console.log('Hello dear!! Good To see U!!');

const showRecipe = async function() {
  try {
    // const res = await fetch('https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886');
    const res = await fetch('https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcc40');

    const data = await res.json();

    if  (!res.ok) throw new Error(`${data.message} (${res.status})`)

    let {recipe} = data.data;
    recepe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients 
    }
    console.log(recipe);

  } catch(err) {
    alert(err);
  }
};
showRecipe();


