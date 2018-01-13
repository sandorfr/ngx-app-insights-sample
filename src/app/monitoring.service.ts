import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, ResolveEnd, ActivatedRouteSnapshot } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AppInsights } from 'applicationinsights-js';
import 'rxjs/add/operator/filter';


@Injectable()
export class MonitoringService {

    private routerSubscription: Subscription;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        if (environment.appInsightsConfig && environment.appInsightsConfig.instrumentationKey) {
            AppInsights.downloadAndSetup(environment.appInsightsConfig);
        }

        this.routerSubscription = this.router.events
            .filter(event => event instanceof ResolveEnd)
            .subscribe((event: ResolveEnd) => {
                const activatedComponent = this.getActivatedComponent(event.state.root);
                if (activatedComponent) {
                    this.logPageView(`${activatedComponent.name} ${this.getRouteTemplate(event.state.root)}`, event.urlAfterRedirects);
                }
            });
    }

    setAuthenticatedUserId(userId: string): void {
        AppInsights.setAuthenticatedUserContext(userId);
    }

    private getActivatedComponent(snapshot: ActivatedRouteSnapshot): any {

        if (snapshot.firstChild) {
            return this.getActivatedComponent(snapshot.firstChild);
        }

        return snapshot.component;
    }

    private getRouteTemplate(snapshot: ActivatedRouteSnapshot): string {
        let path = '';
        if (snapshot.routeConfig) {
            path += snapshot.routeConfig.path;
        }

        if (snapshot.firstChild) {
            return path + this.getRouteTemplate(snapshot.firstChild);
        }

        return path;
    }

    private AddGlobalProperties(properties?: { [key: string]: string }): { [key: string]: string } {
        if (!properties) {
            properties = {};
        }

        //add your custom properties such as app version

        return properties;
    }

    public logPageView(
        name: string,
        url?: string,
        properties?: { [key: string]: string },
        measurements?: { [key: string]: number },
        duration?: number) {

        AppInsights.trackPageView(name, url, this.AddGlobalProperties(properties), measurements, duration);
    }

    public logEvent(name: string, properties?: { [key: string]: string }, measurements?: { [key: string]: number }) {
        AppInsights.trackEvent(name, this.AddGlobalProperties(properties), measurements);
    }

    public logError(error: Error, properties?: { [key: string]: string }, measurements?: { [key: string]: number }) {
        AppInsights.trackException(error, null, this.AddGlobalProperties(properties), measurements);
    }
}
