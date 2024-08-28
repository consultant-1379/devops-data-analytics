import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Breadcrumb, Dropdown } from '@eds/vanilla';
import { BreadcrumbItem } from 'src/app/interfaces/breadcrumb-item.interface';
import { UsageTrackerService } from 'src/app/services/usage-tracker.service';
import { SUPPORT_URL, USER_GUIDE_URL } from 'src/constants/external-urls.constant';

const allRoutes : { [key: string] : string } = {
  '/': 'Home',
  '/footer' : 'Footer',
  '/table': 'EIC Application/Product Staging Pass Rates',
  '/feedback': 'Feedback',
}

@Component({
  selector: 'app-nav-layout',
  templateUrl: './nav-layout.component.html',
  styleUrls: ['./nav-layout.component.scss'],
})
export class NavLayoutComponent implements AfterViewInit {
  
  breadcrumb !: Breadcrumb;
  rootElement = this.renderer.selectRootElement(this.el.nativeElement);
  breadCrumbs : BreadcrumbItem[] = [
    { title: 'Home', action: () => this.updateRoutes('/')},
  ]

  menuTooltip = 'Expand';
  dashboardTitle = "DevOps Data Analytics";
  supportUrl = SUPPORT_URL;
  userGuideUrl = USER_GUIDE_URL;


  constructor(private router: Router, private el: ElementRef, private renderer: Renderer2, private usageTracker: UsageTrackerService){
    router.events.subscribe(event => {
      if(event instanceof NavigationEnd){
        const route = event.url;
        const breadcrumbs = [{ title: 'Home', action: () => this.updateRoutes('/')}];
        
        if(route !== '/home' && route !== '/'){
          breadcrumbs.push({ title: allRoutes[route], action: () => this.updateRoutes(route)});
        }
        
        ///TODO: I think one of these or both seem to be doing some redundant work. Optimize it
        //// Also, need to handle multi layer breadcrums
        this.updateBreadcrumbs(breadcrumbs);
        this.appendRouterLinks();
      }
    })
  }

  ngAfterViewInit(): void {
    const breadcrumbElement = document.querySelector<HTMLElement>('#breadcrumb-action');
    if(breadcrumbElement){
      this.breadcrumb = new Breadcrumb(breadcrumbElement);
      this.breadcrumb.init(this.breadCrumbs);
    }
    const dropdowns = document.querySelectorAll<HTMLElement>('.dropdown');

    if (dropdowns) {
      Array.from(dropdowns).forEach((dropdownDOM) => {
        const dropdown = new Dropdown(dropdownDOM);
        dropdown.init();
      });
    }
    this.handleAppNav();
  }

 switchTheme() {

    document.body.classList.toggle('dark');
    document.body.classList.toggle('dark-mat-theme');
    document.body.classList.toggle('light');
  }

  appendRouterLinks () {
        const breadcrumb = this.el.nativeElement.querySelector('.breadcrumb');
        const links : NodeListOf<Element> = breadcrumb.querySelectorAll('.link');
        links.forEach(link => {
          const val = link.textContent;
          const key = Object.keys(allRoutes).find(k => allRoutes[k] === val);
          if (key) {
            this.renderer.setAttribute(link, 'routerLink', key);
          }
        });
  }

  updateRoutes(routeTo: string) {
    this.breadcrumb.destroy();
    this.router.navigate([routeTo]);
  }

  updateBreadcrumbs(breadcrumbs: Array<BreadcrumbItem>){
    this.breadcrumb.destroy();
    this.breadcrumb.init(breadcrumbs);
  }

  handleAppNav(){
    const navToggle = this.renderer.parentNode(this.rootElement).querySelector('.navigation-toggle');
    setTimeout(()=>{
      const navHeaders : NodeListOf<Element> = this.renderer.parentNode(this.rootElement).querySelectorAll('.nav-header');
      const toBeClosed = navToggle.classList.contains('closed');
      this.menuTooltip = toBeClosed ? 'Close' : 'Expand'
      navHeaders.forEach(el =>  toBeClosed ? this.renderer.removeStyle(el, 'display'): this.renderer.setStyle(el, 'display', 'none') );
    });
  }

  logout() {
    this.usageTracker.removeCookie();
    console.log("Logged out successfully");
  }
}
