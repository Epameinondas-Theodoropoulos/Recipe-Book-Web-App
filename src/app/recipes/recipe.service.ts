import { Injectable } from '@angular/core';
import { Subject, of } from 'rxjs';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Router } from '@angular/router';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Tasty Schnitzel',
  //     'A super-tasty Schnitzel - just awesome!',
  //     'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
  //     [new Ingredient('Meat', 1), new Ingredient('French Fries', 20)]
  //   ),
  //   new Recipe(
  //     'Big Fat Burger',
  //     'What else you need to say?',
  //     'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
  //     [new Ingredient('Buns', 2), new Ingredient('Meat', 1)]
  //   )
  // ];
  private recipes: Recipe[] = [];

  constructor(private slService: ShoppingListService, private router: Router) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
    localStorage.setItem('local-recipes', JSON.stringify(this.recipes));
    this.router.navigate(['/recipes']);
  }

  setLocalRecipes(recipes: Recipe[])
  {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getLocalRecipes ()
  {
    const localRecipes: {
      name: string;
      description: string;
      imagePath: string;
      ingredients: Ingredient[];
    } []= JSON.parse(localStorage.getItem('local-recipes'));
    if (!localRecipes) {
      return;
    }
    console.log('localRecipes');
    console.log(localRecipes);
    const recipes: Recipe[] = [];
    for(let i=0; i<localRecipes.length; i++)
    {
      recipes.push(localRecipes[i]);
    }
    this.setLocalRecipes(recipes);
    //return recipes;

  }

  getRecipes() {
    //tha koitaxei an yparxei sto localstorage kati gia ta recipes
    this.getLocalRecipes ();
   // return this.recipes.slice();
  }

  getRecipesObs() {
    return of(this.recipes.slice());
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    localStorage.setItem('local-recipes', JSON.stringify(this.recipes));
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipesLogout()
  {
    this.recipes = [];
  }
}
