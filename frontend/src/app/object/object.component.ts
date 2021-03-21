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
  ) {
    this.data = {
      id: 0,
      Name: '',
      RA: 0,
      Dec: 0,
      isObserved: false,
      Publications: {},
      category: ''
    };
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      console.log(this.id);
    });

    this.server.get(`/api/info/${this.id}`).subscribe(
      response => {
        this.data = response;
        console.log(this.data);
        console.log("Done");
      },
      error => {
        console.log(error);
        this.router.navigateByUrl('');
      }
    );


  }

}
