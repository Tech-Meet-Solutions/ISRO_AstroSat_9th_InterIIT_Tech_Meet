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

    // var marker1 = A.marker(270.332621, -23.078944, { popupTitle: 'PSR B1758-23', popupDesc: 'Object type: Pulsar' });
    // var marker2 = A.marker(270.63206, -22.905550, { popupTitle: 'HD 164514', popupDesc: 'Object type: Star in cluster' });
    // var marker3 = A.marker(270.598121, -23.030819, { popupTitle: 'HD 164492', popupDesc: 'Object type: Double star' });
    // var markerLayer = A.catalog({ color: '#800080' });
    // markerLayer.addSources([marker1, marker2, marker3]);
    // this.aladin.addCatalog(markerLayer);

    // this.aladin.addCatalog(A.catalogFromSimbad('M 20', 0.2, { shape: 'plus', color: '#5d5', onClick: 'showTable' }));
    // this.aladin.addCatalog(A.catalogFromVizieR('J/ApJ/562/446/table13', 'M 20', 0.2, { shape: 'square', sourceSize: 8, color: 'red', onClick: 'showPopup' }));
  }

  update(): void {
    var src_obs = [];
    var src_notobs = [];
    for (var i = 0; i < this.data.length; ++i) {
      let si = this.data[i];
      if (si.isObserved)
        src_obs.push(A.source(si.RA, si.Dec, { Name: si.Name, Desc: `<em>RA:</em> ${si.RA}<br/><em>Dec:</em> ${si.Dec}<br/><em>Cat:</em> ${si.category}<br/><a target="_blank" href="/object/${si.id}">More Info</a>` }));
      else
        src_notobs.push(A.source(si.RA, si.Dec, { Name: si.Name, Desc: `<em>RA:</em> ${si.RA}<br/><em>Dec:</em> ${si.Dec}<br/><em>Cat:</em> ${si.category}<br/><a target="_blank" href="/object/${si.id}">More Info</a>` }));
    }
    var cat_obs = A.catalog({ shape: 'square', color: '#5d5', onClick: 'showPopup', sourceSize: 16 });
    var cat_notobs = A.catalog({ shape: 'circle', color: '#f00', onClick: 'showPopup', sourceSize: 16 });
    this.aladin.addCatalog(cat_obs);
    this.aladin.addCatalog(cat_notobs);
    cat_obs.addSources(src_obs);
    cat_notobs.addSources(src_notobs);

    // this.aladin.gotoRaDec(0, 0);
  }

  mollweide(): void {
    this.plot.data = [{
      lon: this.data.map(function (value, index) { return value.RA; }),
      lat: this.data.map(function (value, index) { return value.Dec; }),
      type: 'scattergeo'
    }];

    this.plot.layout = {
      title: 'Mollweide',
      // autosize: false,
      // width: 750,
      // height: 750,
      // hovermode: 'closest',
      // scene: {
      //   xaxis: { showticklabels: false, zeroline: false, title: '' },
      //   yaxis: { showticklabels: false, zeroline: false, title: '' },
      //   zaxis: { showticklabels: false, title: '' },
      // }
      // clickmode: "event+select",
      // itemclick: false,
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
          dtick: 45,
          // tick0: 45,
          gridwidth: 1,
          gridcolor: '#000',
          range: [0, 360]
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
    console.log(event.points[0].lon);
    this.aladin.gotoRaDec(event.points[0].lon, event.points[0].lat);
  }
}
