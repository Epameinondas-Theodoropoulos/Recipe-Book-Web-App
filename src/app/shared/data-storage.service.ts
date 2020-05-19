import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap, switchMap, catchError } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) { }

  storeRecipes() {
    //paremvasi gia na vgazei error otan einai keni i lista
    //const recipes = this.recipeService.getRecipes();
    // this.http
    //   .put(
    //     'https://angular8-http.firebaseio.com/recipes.json',
    //     recipes
    //   )
    //   .subscribe(response => {
    //     console.log("Response from Store "+response);
    //   });

    return this.recipeService.getRecipesObs().pipe(
      map((recipes) => {
        if (!recipes.length) {
          throw throwError('You have not any recipes')
        }
        return recipes;
      }),
      catchError(err => throwError('You have not any recipessss')),// doueuei kai ayto me to apo panw na einai throw throwError('You have not any recipes')),
      switchMap(recipes => {
        return this.http
          .put(
            'https://angular8-http.firebaseio.com/recipes.json',
            recipes
          )
      }),
      tap(response => {
        console.log("Response from Store " + response);
      })
    )

  }

  fetchRecipes(from: string) {
    if(from === 'header')
    {
      return this.http
      .get<Recipe[]>(
        'https://angular8-http.firebaseio.com/recipes.json'
      )
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        tap(recipes => {
          console.log("Response from fetch " + recipes);
          localStorage.removeItem('local-recipes');
          this.recipeService.setRecipes(recipes);
        })
      );
  }
    }

}
