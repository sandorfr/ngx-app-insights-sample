import { MonitoringService } from './monitoring.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';


import { AppComponent } from './app.component';
import { MonitoringErrorHandler } from './error.handler';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    MonitoringService,
    {
      provide: ErrorHandler,
      useClass: MonitoringErrorHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
