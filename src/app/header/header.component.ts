import { Component, OnInit, OnDestroy, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;
  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;
  private closeSub: Subscription;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      console.log(!user);
      console.log(!!user);
    });
  }

  onSaveData() {
    //paremvasi gia na vgazei error otan einai keni i lista
  // this.dataStorageService.storeRecipes();
    this.dataStorageService.storeRecipes()
    .subscribe(
      resData => {
        console.log(resData);
      },
      errorMessage => {
        console.log('My error message: ', errorMessage);
        this.showErrorAlert(errorMessage);
      }
    )
  }



  onFetchData() {
    this.dataStorageService.fetchRecipes('header').subscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  private showErrorAlert(message: string) {
    // const alertCmp = new AlertComponent();
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}
