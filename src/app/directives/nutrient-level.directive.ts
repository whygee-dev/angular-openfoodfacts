import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appNutrientLevel]',
  standalone: true,
})
export class NutrientLevelDirective {
  @Input() level?: string;

  constructor(private readonly el: ElementRef) {
    this.highlight();
  }

  highlight(level = this.level) {
    if (level === 'high') {
      this.el.nativeElement.style.color = 'red';
    }

    if (level === 'moderate') {
      this.el.nativeElement.style.color = 'orange';
    }

    if (level === 'low') {
      this.el.nativeElement.style.color = 'green';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['level']) {
      this.highlight(changes['level'].currentValue);
    }
  }
}
