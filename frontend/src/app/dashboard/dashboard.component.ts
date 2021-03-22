import { Component, OnInit } from '@angular/core';
import { ServerService } from '../server.service';
import { Source } from '../source';

declare var A: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  lmxb: Array<Source>;
  hmxb: Array<Source>;
  aladin: any;
  plot: any;

  constructor(
    private server: ServerService
  ) {
    this.lmxb = Array<Source>();
    this.hmxb = Array<Source>();
    this.plot = {
      data: [],
      layout: {},
      config: {},
    };
  }

  ngOnInit(): void {
    this.aladin = A.aladin('#aladin-lite-div', { cooFrame: "ICRS", survey: "P/Fermi/color", fov: 60, showSimbadPointerControl: true });
    this.aladin.getBaseImageLayer().getColorMap().update('grayscale');
    this.server.get('/api/list/').subscribe(
      response => {
        for (var i = 0; i < response.sources.length; ++i) {
          if (response.sources[i].category === "lmxb")
            this.lmxb.push(response.sources[i]);
          if (response.sources[i].category == 'hmxb')
            this.hmxb.push(response.sources[i]);
        }
        this.update();
        this.mollweide();
        console.log("Done");
      },
      error => {
        console.log(error);
      }
    );

  }

  update(): void {
    var src_lmxb = [];
    var src_hmxb = [];
    for (var i = 0; i < this.lmxb.length; ++i) {
      src_lmxb.push(
        A.source(
          this.lmxb[i].RA,
          this.lmxb[i].Dec,
          {
            Name: this.lmxb[i].Name,
            RA: this.lmxb[i].RA,
            Dec: this.lmxb[i].Dec,
            '': `<a target="_blank" href="/object/${this.lmxb[i].id}">More Info</a>`
          }
        )
      );
    }
    for (var i = 0; i < this.hmxb.length; ++i) {
      src_hmxb.push(
        A.source(
          this.hmxb[i].RA,
          this.hmxb[i].Dec,
          {
            Name: this.hmxb[i].Name,
            RA: this.hmxb[i].RA,
            Dec: this.hmxb[i].Dec,
            '': `<a target="_blank" href="/object/${this.hmxb[i].id}">More Info</a>`
          }
        )
      );
    }
    var cat_lmxb = A.catalog({ name: 'lmxb', shape: 'circle', color: '#5d5', onClick: 'showPopup', sourceSize: 16 });
    var cat_hmxb = A.catalog({ name: 'hmxb', shape: 'circle', color: '#f00', onClick: 'showPopup', sourceSize: 16 });
    this.aladin.addCatalog(cat_lmxb);
    this.aladin.addCatalog(cat_hmxb);
    cat_lmxb.addSources(src_lmxb);
    cat_hmxb.addSources(src_hmxb);

    // this.aladin.gotoRaDec(0, 0);
  }

  mollweide(): void {
    this.plot.data = [{
      lon: this.lmxb.map(function (value, index) { return -value.RA; }),
      lat: this.lmxb.map(function (value, index) { return value.Dec; }),
      text: this.lmxb.map(function (value, index) { return `(${value.RA}, ${value.Dec})` }),
      hoverinfo: 'text',
      hoverlabel: { bgcolor: '#41454c' },
      marker: {
        color: '#5d5',
        opacity: 0.5,
        size: 7,
        line: {
          color: 'rgb(231, 99, 250)',
          width: 1
        }
      },
      type: 'scattergeo'
    },
    {
      lon: this.hmxb.map(function (value, index) { return -value.RA; }),
      lat: this.hmxb.map(function (value, index) { return value.Dec; }),
      text: this.hmxb.map(function (value, index) { return `(${value.RA}, ${value.Dec})` }),
      hoverinfo: 'text',
      hoverlabel: { bgcolor: '#41454c' },
      marker: {
        color: '#f00',
        opacity: 0.5,
        size: 7,
        line: {
          color: 'rgb(231, 99, 250)',
          width: 1
        }
      },
      type: 'scattergeo'
    },
    {
      type: 'scattergeo',
      hoverinfo: false,
      lat: [90, -90],
      lon: [-360, -360],
      mode: 'lines',
      line: {
        width: 0.5,
        color: 'black'
      }
    }];

    this.plot.layout = {
      title: 'Mollweide',
      hovermode: 'closest',
      dragmode: false,
      margin: {
        l: 20,
        b: 0,
        r: 20,
        t: 0
      },
      geo: {
        projection: {
          type: 'mollweide',
          scale: 0.8
        },
        showcoastlines: false,
        lonaxis: {
          showgrid: true,
          dtick: 30,
          gridwidth: 1,
          gridcolor: '#000',
          range: [-360, 0]
        },
        lataxis: {
          showgrid: true,
          dtick: 10,
          gridwidth: 1,
          gridcolor: '#000',
        },
        visible: false,
        bgcolor: '#fff'
      },
    };

    this.plot.config = { displaylogo: false };
  }

  click_plot(event): void {
    console.log('xx');
    console.log(event);
    console.log(event.points[0].lat);
    console.log(-event.points[0].lon);
    this.aladin.gotoRaDec(-event.points[0].lon, event.points[0].lat);
  }
}
