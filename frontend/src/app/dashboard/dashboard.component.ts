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

  constructor(
    private server: ServerService
  ) {
    this.data = Array<Source>();
  }

  ngOnInit(): void {
    this.aladin = A.aladin('#aladin-lite-div', { cooFrame: "galactic", survey: "P/Fermi/color", fov: 60 });
    this.server.get('/api/list/').subscribe(
      response => {
        this.data = response.sources;
        console.log(this.data[0]);
        this.update();
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
        src_obs.push(A.marker(si.RA, si.Dec, { popupTitle: si.Name, popupDesc: `<em>RA:</em> ${si.RA}<br/><em>Dec:</em> ${si.Dec}<br/><em>Cat:</em> ${si.category}<br/><a target="_blank" href="/object/${si.id}">More Info</a>` }));
      else
        src_notobs.push(A.marker(si.RA, si.Dec, { popupTitle: si.Name, popupDesc: `<em>RA:</em> ${si.RA}<br/><em>Dec:</em> ${si.Dec}<br/><em>Cat:</em> ${si.category}<br/><a target="_blank" href="/object/${si.id}">More Info</a>` }));
    }
    var cat_obs = A.catalog({ shape: 'square', color: '#5d5', onClick: 'showPopup', sourceSize: 16 });
    var cat_notobs = A.catalog({ shape: 'circle', color: '#f00', onClick: 'showPopup', sourceSize: 16 });
    this.aladin.addCatalog(cat_obs);
    this.aladin.addCatalog(cat_notobs);
    cat_obs.addSources(src_obs);
    cat_notobs.addSources(src_notobs);

    // this.aladin.gotoRaDec(0, 0);
  }
}
