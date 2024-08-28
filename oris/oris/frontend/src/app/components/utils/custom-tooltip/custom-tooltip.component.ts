import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-custom-tooltip',
  templateUrl: './custom-tooltip.component.html',
  styleUrls: ['./custom-tooltip.component.scss'],
})
export class CustomTooltipComponent {
  @Input() content!: TemplateRef<unknown>;
  @Input() top!: string;
  @Input() left!: string;
  @Input() classes!: string[];
  
}