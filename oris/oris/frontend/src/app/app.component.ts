import { AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Layout } from '@eds/vanilla/common/scripts/Layout';
import { Tree } from '@eds/vanilla/tree/Tree';
import { UsageTrackerService } from './services/usage-tracker.service';

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements AfterViewInit, OnInit, OnDestroy {

  layout!: Layout;
  tree!: Tree;
  title = 'EDS APP';
  username = 'Signum';
  
  constructor(private usageTarcker: UsageTrackerService) {}

  ngOnInit(): void {
      this.usageTarcker.setUserVisited({msg: 'Initial Visit', info: 'visited'});
  }

   
  ngAfterViewInit(){
    
    const bodyElement = document.querySelector('body');
    if(bodyElement){
      this.layout = new Layout(bodyElement);
      this.tree = new Tree(bodyElement);
      this.layout.init();
      this.tree.init();
    }
  }

  ngOnDestroy(): void {
    this.layout?.destroy();
    this.tree?.destroy();
    this.usageTarcker.removeCookie();
  }}
