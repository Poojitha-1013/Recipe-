const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

// Fetch ingredients as list items
const fetchIngredients = (meal) => {
  let ingredientsList = '';
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientsList;
};

// Show recipe popup
const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingredientList">${fetchIngredients(meal)}</ul>
    <div>
      <h3>Instructions:</h3>
      <p class="recipeInstructions">${meal.strInstructions}</p>
    </div>
  `;
  recipeDetailsContent.parentElement.style.display = 'block';
};

// Hide recipe popup
recipeCloseBtn.addEventListener('click', () => {
  recipeDetailsContent.parentElement.style.display = 'none';
});

// Fetch recipes
const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = '<h2>Fetching Recipes...</h2>';
  try {
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();
    recipeContainer.innerHTML = ''; // Clear previous results

    if (response.meals) {
      response.meals.forEach((meal) => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');
        recipeDiv.innerHTML = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
          <h3>${meal.strMeal}</h3>
          <p><span>${meal.strArea}</span> Dish</p>
          <p>Belongs to <span>${meal.strCategory}</span> Category</p>
        `;

        const button = document.createElement('button');
        button.textContent = 'View Recipe';
        button.addEventListener('click', () => openRecipePopup(meal));

        recipeDiv.appendChild(button);
        recipeContainer.appendChild(recipeDiv);
      });
    } else {
      recipeContainer.innerHTML = `<p>No recipes found for "${query}".</p>`;
    }
  } catch (error) {
    recipeContainer.innerHTML = '<p>Error fetching recipes. Please try again later.</p>';
    console.error('Error:', error);
  }
};

// Handle search
searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const query = searchBox.value.trim();
  if (query) {
    fetchRecipes(query);
  }
});
