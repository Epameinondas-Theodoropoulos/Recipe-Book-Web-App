import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Recipe } from './recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<void> {
  constructor(private dataStorageService: DataStorageService, private recipeService: RecipeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  // return this.dataStorageService.fetchRecipes('resolver');
   return this.recipeService.getLocalRecipes();
  }
}
