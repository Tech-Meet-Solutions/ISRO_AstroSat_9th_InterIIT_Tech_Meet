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
  mollweide_lat_long: boolean;
  moll_button_title: string;
  radec: any;
  latlon: any;


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
    this.mollweide_lat_long = true;
    this.moll_button_title = "Switch to RA/Dec (J2000)";
  }

  ngOnInit(): void {
    this.aladin = A.aladin('#aladin-lite-div', { cooFrame: "ICRS", survey: "P/Fermi/color", fov: 60, showSimbadPointerControl: true });
    this.aladin.getBaseImageLayer().getColorMap().update('grayscale');
    this.server.get('/api/list/').subscribe(
      response => {
        console.log(response.sources)
        for (var i = 0; i < response.sources.length; ++i) {
          if (response.sources[i].Class === "lmxb")
            this.lmxb.push(response.sources[i]);
          if (response.sources[i].Class == 'hmxb')
            this.hmxb.push(response.sources[i]);
        }
        this.update();
        this.mollweide();
        console.log("Done");
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );
    this.plot.layout = {
      title: 'Mollweide',
      autosize: true,
      hovermode: 'closest',
      dragmode: false,
      showlegend: false,
      geo: {
        projection: {
          type: 'mollweide',
          scale: 1
        },
        showcoastlines: false,
        lonaxis: {
          showgrid: true,
          dtick: 30,
          gridwidth: 0.5,
          gridcolor: '#000',
          range: [-360, 0]
        },
        lataxis: {
          showgrid: true,
          dtick: 15,
          gridwidth: 0.5,
          gridcolor: '#000',
        },
        visible: false,
        bgcolor: '#fff'
      },
    };

    this.plot.config = {
      displaylogo: false,
      modeBarButtonsToRemove: [
        // 'toImage',
        'pan2d',
        'select2d',
        'lasso2d',
        'zoomInGeo',
        'zoomOutGeo',
        'resetGeo',
        'hoverClosestGeo',
      ]
    };
  }

  update(): void {
    console.log(window.location.href);
    var src_lmxb = [];
    var src_hmxb = [];
    for (var i = 0; i < this.lmxb.length; ++i) {
      let vis = "";
      if (this.lmxb[i].isObserved_uvit)
        vis = "UVIT, SXT, LAXPC, CZTI";
      else if (this.lmxb[i].isObserved_sxt)
        vis = "SXT, LAXPC, CZTI";
      else if (this.lmxb[i].isObserved_laxpc)
        vis = "LAXPC, CZTI";
      else if (this.lmxb[i].isObserved_czti)
        vis = "CZTI";
      else
        vis = "None";

      src_lmxb.push(
        A.source(
          this.lmxb[i].RA,
          this.lmxb[i].Dec,
          {
            Name: this.lmxb[i].Name,
            RA: this.lmxb[i].RA,
            Dec: this.lmxb[i].Dec,
            Visibilty: vis,
            '': `<a target="_blank" href="./object/${this.lmxb[i].id}">More Info</a><br><a target="_blank" href="http://simbad.u-strasbg.fr/simbad/sim-id?output.format=HTML&Ident=${this.lmxb[i].Name.replace('+', '%2B')}">Simbad</a>`
          }
        )
      );
    }
    for (var i = 0; i < this.hmxb.length; ++i) {
      let vis = "";
      if (this.hmxb[i].isObserved_uvit)
        vis = "UVIT, SXT, LAXPC, CZTI";
      else if (this.hmxb[i].isObserved_sxt)
        vis = "SXT, LAXPC, CZTI";
      else if (this.hmxb[i].isObserved_laxpc)
        vis = "LAXPC, CZTI";
      else if (this.hmxb[i].isObserved_czti)
        vis = "CZTI";
      else
        vis = "None";

      src_hmxb.push(
        A.source(
          this.hmxb[i].RA,
          this.hmxb[i].Dec,
          {
            Name: this.hmxb[i].Name,
            RA: this.hmxb[i].RA,
            Dec: this.hmxb[i].Dec,
            Visibilty: vis,
            '': `<a target="_blank" href="./object/${this.hmxb[i].id}">More Info</a><br><a target="_blank" href="http://simbad.u-strasbg.fr/simbad/sim-id?output.format=HTML&Ident=${this.hmxb[i].Name.replace('+', '%2B')}">Simbad</a>`
          }
        )
      );
    }
    var cat_lmxb = A.catalog({ name: 'LMXB', shape: 'circle', color: '#1A85FF', onClick: 'showPopup', sourceSize: 16 });
    var cat_hmxb = A.catalog({ name: 'HMXB', shape: 'circle', color: '#D41159', onClick: 'showPopup', sourceSize: 16 });
    this.aladin.addCatalog(cat_lmxb);
    this.aladin.addCatalog(cat_hmxb);
    cat_lmxb.addSources(src_lmxb);
    cat_hmxb.addSources(src_hmxb);

    // this.aladin.gotoRaDec(0, 0);
  }

  mollweide(): void {
    this.radec = [{
      lon: this.lmxb.map(function (value, index) { return -value.RA; }),
      lat: this.lmxb.map(function (value, index) { return value.Dec; }),
      text: this.lmxb.map(function (value, index) { return `(${value.RA}, ${value.Dec})` }),
      hoverinfo: 'text',
      hoverlabel: { bgcolor: '#41454c' },
      marker: {
        color: '#1A85FF',
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
        color: '#D41159',
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
    this.latlon = [{
      lon: this.lmxb.map(function (value, index) { return -value.GLON; }),
      lat: this.lmxb.map(function (value, index) { return value.GLAT; }),
      text: this.lmxb.map(function (value, index) { return `(${value.GLON}, ${value.GLAT})` }),
      extra: this.lmxb,
      hoverinfo: 'text',
      hoverlabel: { bgcolor: '#41454c' },
      marker: {
        color: '#1A85FF',
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
      lon: this.hmxb.map(function (value, index) { return -value.GLON; }),
      lat: this.hmxb.map(function (value, index) { return value.GLAT; }),
      text: this.hmxb.map(function (value, index) { return `(${value.GLON}, ${value.GLAT})` }),
      extra: this.hmxb,
      hoverinfo: 'text',
      hoverlabel: { bgcolor: '#41454c' },
      marker: {
        color: '#D41159',
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
    this.plot.data = this.latlon;
    this.mollweide_lat_long = true;
    this.moll_button_title = "Switch to RA/Dec (J2000)";
  }

  click_plot(event): void {
    console.log('xx');
    console.log(event.points[0]);
    console.log(event.points[0].lat);
    console.log(-event.points[0].lon);
    if (this.mollweide_lat_long) {
      let p = event.points[0].data.extra[event.points[0].pointIndex];
      console.log(p);
      this.aladin.gotoRaDec(p.RA, p.Dec);
    }
    else {
      this.aladin.gotoRaDec(-event.points[0].lon, event.points[0].lat);
    }
  }

  moll_switch(): void {
    if (this.mollweide_lat_long) {
      this.plot.data = this.radec;
      this.mollweide_lat_long = false;
      this.moll_button_title = "Switch to Galactic Coords";
    } else {
      this.plot.data = this.latlon;
      this.mollweide_lat_long = true;
      this.moll_button_title = "Switch to RA/Dec (J2000)";
    }
  }

  update_survey(survey, is_color = true): void {
    console.log(is_color);
    this.aladin.setBaseImageLayer(survey);
    if (!is_color)
      this.aladin.getBaseImageLayer().getColorMap().update('grayscale');
  }
}
