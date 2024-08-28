import { ComponentRef, Directive, ElementRef, HostListener, Input, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { CustomTooltipComponent } from '../app/components/utils/custom-tooltip/custom-tooltip.component';

@Directive({
  selector: '[appCustomTooltip]'
})
export class CustomTooltipDirective {

  @Input('appCustomTooltip') content!: TemplateRef<unknown>;
  @Input() yOffset = 0;
  @Input() xOffset = 0;
  @Input() delay = 0;
  @Input() classes!: string[];

  private componentRef?: ComponentRef<CustomTooltipComponent>;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) { }

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.componentRef) {
        this.componentRef = this.viewContainerRef.createComponent(CustomTooltipComponent);
        
        this.componentRef.instance.content = this.content;
        this.componentRef.instance.classes = this.classes;
        this.renderer.addClass(this.componentRef.location.nativeElement, 'show');

        const hostPos = this.el.nativeElement.getBoundingClientRect();
        const offsetParent = this.el.nativeElement.offsetParent
      const top = `${hostPos.top + window.scrollY - offsetParent.top }px`;
      const left = `${hostPos.left + window.scrollX - offsetParent.left}px`;
      console.log( offsetParent.offsetTop,  offsetParent.offsetLeft );
      

        const tooltipElement = this.componentRef.location.nativeElement;
        tooltipElement.style.top = top;
        tooltipElement.style.left = left;

        this.renderer.setStyle(tooltipElement, 'position', 'absolute');
        this.renderer.appendChild(this.el.nativeElement, this.componentRef.location.nativeElement);
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.componentRef) {
      this.renderer.removeClass(this.componentRef.location.nativeElement, 'show');
      setTimeout(() => {
        // this.componentRef?.destroy();
        // this.componentRef = undefined;
      }, this.delay);
    }
  }

}
