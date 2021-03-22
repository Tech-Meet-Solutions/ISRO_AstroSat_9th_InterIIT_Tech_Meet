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

  data: Array<Source>;
  aladin: any;
  plot: any;

  constructor(
    private server: ServerService
  ) {
    this.data = Array<Source>();
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
        this.data = response.sources;
        console.log(this.data[0]);
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
    for (var i = 0; i < this.data.length; ++i) {
      let si = this.data[i];
      if (si.category === "lmxb")
        src_lmxb.push(A.source(si.RA, si.Dec, { Name: si.Name, RA: si.RA, Dec: si.Dec, '': `<a target="_blank" href="/object/${si.id}">More Info</a>` }));
      if (si.category == 'hmxb')
        src_hmxb.push(A.source(si.RA, si.Dec, { Name: si.Name, RA: si.RA, Dec: si.Dec, '': `<a target="_blank" href="/object/${si.id}">More Info</a>` }));
    }
    var cat_lmxb = A.catalog({ shape: 'square', color: '#5d5', onClick: 'showPopup', sourceSize: 16 });
    var cat_hmxb = A.catalog({ shape: 'circle', color: '#f00', onClick: 'showPopup', sourceSize: 16 });
    this.aladin.addCatalog(cat_lmxb);
    this.aladin.addCatalog(cat_hmxb);
    cat_lmxb.addSources(src_lmxb);
    cat_hmxb.addSources(src_hmxb);

    // this.aladin.gotoRaDec(0, 0);
  }

  mollweide(): void {
    this.plot.data = [{
      lon: this.data.map(function (value, index) { return -value.RA; }),
      lat: this.data.map(function (value, index) { return value.Dec; }),
      text: this.data.map(function (value, index) { return `(${value.RA}, ${value.Dec})` }),
      hoverinfo: 'text',
      hoverlabel: { bgcolor: '#41454c' },
      type: 'scattergeo'
    },
    {
      type: 'scattergeo',
      lat: [90, -90],
      lon: [-360, -360],
      mode: 'lines',
      line: {
        width: 1,
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
