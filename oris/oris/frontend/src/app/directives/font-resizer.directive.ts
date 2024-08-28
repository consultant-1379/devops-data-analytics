import { AfterViewInit, Directive, ElementRef, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appFontResizer]'
})
export class FontResizerDirective implements AfterViewInit {

  private renderer = inject(Renderer2);
  private eleRef = inject(ElementRef);

  ngAfterViewInit(): void {
    setTimeout(()=>{
      const parentHeight = this.eleRef.nativeElement.clientHeight;
      let countFontSize = '4em';
      let textFontSize = '2em';

      if(parentHeight > 120) {
        countFontSize = '6em';
        textFontSize = '3em';
      }
  
      this.renderer.setStyle(this.eleRef.nativeElement.querySelector('.builds-count'), 'font-size', countFontSize);
      this.renderer.setStyle(this.eleRef.nativeElement.querySelector('.builds-text'), 'font-size', textFontSize);
    }, 0);
  }



}
