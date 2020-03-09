import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-path-task',
  templateUrl: './path-task.component.html',
  styleUrls: ['./path-task.component.scss']
})
export class PathTaskComponent implements OnInit {
  @Input() analyzer: any
  constructor() { }

  ngOnInit(): void {
  }

}
