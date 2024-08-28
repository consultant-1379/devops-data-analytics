import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Breadcrumb, Dropdown } from '@eds/vanilla';
import { SUPPORT_URL, USER_GUIDE_URL } from 'src/constants/external-urls.constant';
import { BreadcrumbItem } from 'src/interfaces/breadcrumb-item.interface';
import { UsageTrackerService } from 'src/services/usage-tracker.service';

const allRoutes : { [key: string] : string } = {
  '/': 'Home',
  '/footer' : 'Footer',
  '/eic/application-product-dora': 'DORA Metrics',
  '/feedback': 'Feedback',
}

// TODO
// export type Chat = {
//   id: number;
//   text: string;
//   from: 'bot' | 'user';
// }

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

  // TODO
  // input = '';

  // conversation: Chat[] = [
  //   { id: 1, text: 'How can I help you today?',  from: 'bot'},
  //   { id: 2, text: 'Help me find a microservice.',  from: 'user'},
  //   { id: 3, text: 'Yeah I can help you with that.',  from: 'bot'}
  // ]

  // sendMsg() {
  //   this.conversation.push({
  //     id: this.conversation.length + 1, text: this.input, from: this.conversation.at(this.conversation.length -1)?.from === 'bot' ? 'user' : 'bot'
  //   });
  //   this.input = '';
  // }

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
