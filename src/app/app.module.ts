import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import {
  SocketService,
  LoginModule,
  UserModule,
  RegisterModule,
  GamesListModule,
} from '@ovnigames/framework';
import { AppRoutingModule } from './app-routing.module';
import { GraphQLModule } from './graphql.module';
import { ListsService } from './lists.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    GraphQLModule,
    HttpClientModule,
    RouterModule,

    MatProgressSpinnerModule,

    UserModule,
    GamesListModule,

    LoginModule,
    RegisterModule,
    AppRoutingModule,
    MatIconModule,
  ],
  providers: [
    SocketService,
    ListsService,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {
}
