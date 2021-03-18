import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerService } from '../server.service';
import { Source } from '../source';

@Component({
  selector: 'app-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.scss']
})
export class ObjectComponent implements OnInit {

  id: string;
  data: Source;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private server: ServerService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      console.log(this.id);
    });


  }

}
