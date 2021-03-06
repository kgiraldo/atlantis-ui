import {
  Component,
  ElementRef,
  Injector
} from '@angular/core';

export default class gridCellComponent {
  static get annotations() {
    return [
      new Component({
        selector: 'atlui-grid-cell',
        template: `{{content}}`,
        inputs: ['content', 'type', 'format', 'pipes']
      })
    ];
  }

  constructor(elementRef, injector) {

    this.injector = injector;

  }

  //Use pipe if necessary in our content before show content
  ngOnInit() {
    var index = -1;
    var self = this;
    this.pipes.forEach(function(pipe, i) {
      if (pipe.type === self.type) {
        index = i;
      }
    });
    if (index !== -1) {
      if (Array.isArray(this.pipes[index])) {
        this.pipes[index].forEach(function(pipeType) {
          pipeType.pipeInjected = self.injector.get(pipeType.pipe, null);
          if (pipeType.pipeInjected !== null) {
            var option = self.format || pipeType.option;
            var args = [self.content].concat(option);
            self.content = pipeType.pipeInjected.transform.apply(pipeType.pipeInjected, args);
          }
        });
      } else {
        self.pipes[index].pipeInjected = self.injector.get(self.pipe[index], null);
        if (self.pipes[index].pipeInjected !== null) {
          var option = self.format || self.pipes[index].option;
          var args = [self.content].concat(option);
          self.content = self.pipes[index].pipeInjected.transform.apply(self.pipes[index].pipeInjected, args);
        }
      }
    }
  }

}

gridCellComponent.parameters = [ElementRef, Injector];
