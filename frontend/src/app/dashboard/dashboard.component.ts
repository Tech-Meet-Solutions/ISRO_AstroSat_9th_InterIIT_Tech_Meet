import { Component, OnInit } from '@angular/core';

declare var A: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    var aladin = A.aladin('#aladin-lite-div', { survey: "P/DSS2/color", fov: 1.5, target: "M 20" });

    $('input[name=survey]').change(function () {
      aladin.setImageSurvey($(this).val());
    });

    var marker1 = A.marker(270.332621, -23.078944, { popupTitle: 'PSR B1758-23', popupDesc: 'Object type: Pulsar' });
    var marker2 = A.marker(270.63206, -22.905550, { popupTitle: 'HD 164514', popupDesc: 'Object type: Star in cluster' });
    var marker3 = A.marker(270.598121, -23.030819, { popupTitle: 'HD 164492', popupDesc: 'Object type: Double star' });
    var markerLayer = A.catalog({ color: '#800080' });
    aladin.addCatalog(markerLayer);
    markerLayer.addSources([marker1, marker2, marker3]);

    aladin.addCatalog(A.catalogFromSimbad('M 20', 0.2, { shape: 'plus', color: '#5d5', onClick: 'showTable' }));
    aladin.addCatalog(A.catalogFromVizieR('J/ApJ/562/446/table13', 'M 20', 0.2, { shape: 'square', sourceSize: 8, color: 'red', onClick: 'showPopup' }));
  }

}
