import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerService } from '../server.service';
import { SourceA, SourceB, Paper, Source_Visibility, Refs } from '../source';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { saveAs } from 'file-saver';


declare var A: any;

@Component({
  selector: 'app-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.scss']
})
export class ObjectComponent implements OnInit, AfterViewInit {
  myVar: number;
  id: string;
  dataA: SourceA;
  dataB: Array<SourceB>;
  dataSource = new MatTableDataSource<SourceB>();
  dataSourcePapers = new MatTableDataSource<Paper>();
  source_idx = new Set();
  selection = new SelectionModel<SourceB>(true, []);
  visibility_array: { [id: number]: Source_Visibility };
  selectionPaper = new SelectionModel<Paper>(true, []);
  displayedColumns: string[] = ['Object', 'obsid', 'RA', 'Dec', 'instrument', 'date_time',
    'proposal_id', 'target_id', 'observer', 'abstract', 'visibilility'];
  ColumnsPapers: string[] = ['Title', 'Authors', 'Keywords', 'Abstract'];
  sourceB_id_map = [];
  aladin: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private server: ServerService
  ) {
    this.dataA = {
      id: 0, Name: '', Type: '', RA: 0, Dec: 0, Opt: '', r_Fx: '', r_Opt: '', Vmag: '', B_V: '', U_B: '', E_BV: '', r_Vmag: '', Fx: '', Range: '', Porb: '', Porb2: '', GLON: '', GLAT: '', Ppulse: '',
      r_Ppulse: '', Cat: '', SpType: '', Class: '', publications: Array<Paper>(), uvit: Array<SourceB>(), sxt: Array<SourceB>(), laxpc: Array<SourceB>(),
      czti: Array<SourceB>(), refs: Array<Refs>()
    };
    this.dataB = Array<SourceB>();
    this.visibility_array = {};


  }

  ngOnInit(): void {
    //this.aladin = A.aladin('#aladin-lite-div', { cooFrame: "ICRS", survey: "P/Fermi/color", fov: 60, showSimbadPointerControl: true });
    //this.aladin.getBaseImageLayer().getColorMap().update('grayscale');
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      console.log(this.id);
    });

    this.server.get(`/api/info/${this.id}`).subscribe(
      response => {
        this.myVar = 0;
        console.log(response);
        this.dataA = response;

        this.fill_visibility_array();
        //this.changeIdSourceB();
        this.dataSource.data = this.dataB;
        this.fill_cat_span();
        this.fill_type_span();
        this.fill_refs();
        this.dataSourcePapers = new MatTableDataSource<Paper>(this.dataA.publications);
        console.log(this.dataB);
      },
      error => {
        console.log(error);
        this.router.navigateByUrl('');
      }
    );


  }

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fill_visibility_array() {
    console.log("inside vis func");
    let uvit = [];
    let czti = [];
    let laxpc = [];
    let sxt = [];

    for (var source of this.dataA.czti) {
      if (!this.source_idx.has(source.id)) {
        this.dataB.push(source);
      }
      this.source_idx.add(source.id);
      czti.push(source.id);
    }
    for (var source of this.dataA.uvit) {
      if (!this.source_idx.has(source.id)) {
        this.dataB.push(source);
      }
      this.source_idx.add(source.id);
      uvit.push(source.id);
    }
    for (var source of this.dataA.sxt) {
      if (!this.source_idx.has(source.id)) {
        this.dataB.push(source);
      }
      this.source_idx.add(source.id);
      sxt.push(source.id);
    }
    for (var source of this.dataA.laxpc) {
      if (!this.source_idx.has(source.id)) {
        this.dataB.push(source);
      }
      this.source_idx.add(source.id);
      laxpc.push(source.id);
    }
    for (var idx of this.source_idx) {
      //console.log(idx);



      this.visibility_array[Number(idx)] = {
        vis_uvit: uvit.includes(idx),
        vis_laxpc: uvit.includes(idx) || laxpc.includes(idx) || sxt.includes(idx),
        vis_czti: uvit.includes(idx) || laxpc.includes(idx) || sxt.includes(idx) || czti.includes(idx),
        vis_sxt: uvit.includes(idx) || sxt.includes(idx)
      };
    }
    //console.log(this.visibility_array);
    //console.log(this.dataA);
    //console.log(this.visibility_array[355].vis_czti);
    //this.FILL();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: SourceB): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
  assignClass(category: string): string {
    if (category.substring(0, 3) == "sxt") {
      return "sxt";
    }
    if (category.substring(0, 4) == "uvit") {
      return "uvit";
    }
    if (category.substring(0, 5) == "laxpc") {
      return "laxpc";
    }
    if (category.substring(0, 4) == "czti") {
      return "czti";
    }
    return "others";
  }

  check(id, ins): boolean {
    if (ins == "uvit") {
      return (this.visibility_array[id].vis_uvit);
    }
    else if (ins == "sxt") {
      return (this.visibility_array[id].vis_sxt);
    }
    else if (ins == "laxpc") {
      return (this.visibility_array[id].vis_laxpc);
    }
    else if (ins == "czti") {
      return (this.visibility_array[id].vis_czti);
    }
  }


  public toggleText(event, id) {

    // Get all the elements from the page 
    var points =
      document.getElementById("points" + String(id));

    var showMoreText =
      document.getElementById("moreText" + String(id));

    var buttonText =
      document.getElementById("textButton" + String(id));

    // If the display property of the dots  
    // to be displayed is already set to  
    // 'none' (that is hidden) then this  
    // section of code triggers 
    if (points.style.display === "none") {

      // Hide the text between the span 
      // elements 
      showMoreText.style.display = "none";

      // Show the dots after the text 
      points.style.display = "inline";

      // Change the text on button to  
      // 'Show More' 
      buttonText.innerHTML = "Show More";
    }

    // If the hidden portion is revealed, 
    // we will change it back to be hidden 
    else {

      // Show the text between the 
      // span elements 
      showMoreText.style.display = "inline";

      // Hide the dots after the text 
      points.style.display = "none";

      // Change the text on button 
      // to 'Show Less' 
      buttonText.innerHTML = "Show Less";
    }
  }

  public toggleAbs(event, id) {
    var points =
      document.getElementById("points_abs" + String(id));
    var showMoreText =
      document.getElementById("moreText_abs" + String(id));
    var buttonText =
      document.getElementById("textButton_abs" + String(id));
    if (points.style.display === "none") {
      showMoreText.style.display = "none";
      points.style.display = "inline";
      buttonText.innerHTML = "Show More";
    }

    else {
      showMoreText.style.display = "inline";
      points.style.display = "none";
      buttonText.innerHTML = "Show Less";
    }
  }
  public FILL() {
    for (var idx in this.source_idx) {
      var points =
        document.getElementById("CZTI" + String(idx));
      if (this.visibility_array[idx].vis_czti) {
        points.innerHTML = "Show More";
      }
      if (this.visibility_array[idx].vis_sxt) {
        points.innerHTML = "Show More";
      }
      if (this.visibility_array[idx].vis_uvit) {
        points.innerHTML = "Show More";
      }
      if (this.visibility_array[idx].vis_laxpc) {
        points.innerHTML = "Show More";
      }
    }
  }
  public toggleAuthor(event, id) {
    var points =
      document.getElementById("points_a" + String(id));
    var showMoreText =
      document.getElementById("moreText_a" + String(id));
    var buttonText =
      document.getElementById("textButton_a" + String(id));
    if (points.style.display === "none") {
      showMoreText.style.display = "none";
      points.style.display = "inline";
      buttonText.innerHTML = "Show More";
    }

    else {
      showMoreText.style.display = "inline";
      points.style.display = "none";
      buttonText.innerHTML = "Show Less";
    }
  }

  public toggleK(event, id) {
    var points =
      document.getElementById("points_k" + String(id));
    var showMoreText =
      document.getElementById("moreText_k" + String(id));
    var buttonText =
      document.getElementById("textButton_k" + String(id));
    if (points.style.display === "none") {
      showMoreText.style.display = "none";
      points.style.display = "inline";
      buttonText.innerHTML = "Show More";
    }

    else {
      showMoreText.style.display = "inline";
      points.style.display = "none";
      buttonText.innerHTML = "Show Less";
    }
  }
  //To check if some data value is "" i.e. empty
  public check_empty(data) {
    if (data == '') {
      return false;
    }
    return true;

  }

  public fill_cat_span() {
    var splitted = this.dataA.Cat.split(",");
    var mapping = {};
    mapping = {
      "A": "Ariel V sky survey", "AS": "ASCA", "B": "BeppoSAX", "C": "Compton Gamma-ray Observatory",
      "E": "Einstein Observatory", "Exo": "Exosat", "G": "Ginga", "Gr": "Granat", "H": "HEAO A-1 sky survey",
      "Ha": "Hakucho", "I": "Indian X-ray Astronomy Experiment (IXAE)", "K": "Kvant", "M": "MIT OSO-7 sky survey",
      "OAO": "Orbiting Astronomical Observatory", "R": "ROSAT", "S": "SAS 3", "SL": "Space Lab", "T": "Tenma",
      "U": "Uhuru sky survey", "V": "Vela-5 and -6 satellites", "X": "Rossi XTE"
    };
    var cat_verbose = "";
    for (var idx of splitted) {
      if (idx == splitted[splitted.length - 1]) {
        cat_verbose += mapping[idx];
      }
      else {
        cat_verbose += mapping[idx] + ", ";
      }

    }
    //console.log(cat_verbose);
    this.dataA.Cat = cat_verbose;
  }

  public fill_type_span() {
    if (this.dataA.Type.length == 0) {
      return;
    }
    var type_verbose = "";
    var mapping = {
      "A": "Atoll source", "B": "X-ray Burst", "D": "Dipping low-mass X-ray binary", "G": "Globular-cluster X-ray source",
      "P": "X-ray pulsar", "T": "Transient X-ray source", "U": "Ultra-soft X-ray spectrum", "Z": "Z-type"
    };
    for (let i = 0; i < this.dataA.Type.length; i++) {
      if (!(this.dataA.Type[i] in mapping)) {
        continue;
      }
      type_verbose += mapping[this.dataA.Type[i]] + ", ";

    }
    console.log(this.dataA.Type);
    this.dataA.Type = type_verbose.substring(0, type_verbose.length - 2);
  }
  public fill_refs() {
    //r_Opt r_Ppulse r_Fx r_Vmag
    var mapping = {};
    var count = 1;
    for (let ref of this.dataA.refs) {
      mapping[ref.id] = count;
      count += 1;
    }
    var splitted = this.dataA.r_Opt.split(",");
    var mapped_to = "";
    if (!(this.dataA.r_Opt.length == 0)) {
      for (var ref of splitted) {
        mapped_to += mapping[ref] + ", "
      }
      this.dataA.r_Opt = mapped_to.substring(0, mapped_to.length - 2);
    }

    var splitted = this.dataA.r_Vmag.split(",");
    var mapped_to = "";
    if (!(this.dataA.r_Vmag.length == 0)) {
      for (var ref of splitted) {
        mapped_to += mapping[ref] + ", "
      }
      this.dataA.r_Vmag = mapped_to.substring(0, mapped_to.length - 2);
    }

    var splitted = this.dataA.r_Ppulse.split(",");
    var mapped_to = "";
    if (!(this.dataA.r_Ppulse.length == 0)) {
      for (var ref of splitted) {
        mapped_to += mapping[ref] + ", "
      }
      this.dataA.r_Ppulse = mapped_to.substring(0, mapped_to.length - 2);
    }

    var splitted = this.dataA.r_Fx.split(",");
    var mapped_to = "";
    if (!(this.dataA.r_Fx.length == 0)) {
      for (var ref of splitted) {
        mapped_to += mapping[ref] + ", "
      }
      this.dataA.r_Fx = mapped_to.substring(0, mapped_to.length - 2);
    }
  }

  download_pub(): void {
    console.log(this.dataA.publications);
    let csvString = this.dataA.publications.map(
      item => [
        item.identifier,
        item.Name,
        item.Authors,
        item.Keywords,
        item.Abstract
      ]
    ).map(e => e.join(","))
      .join("\n");
    csvString = "id,Title,Authors,Keywords,Abstract\n" + csvString;
    console.log(csvString);
    const blobData = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blobData);
    console.log(blobData)
    saveAs(blobData, 'publications.csv');
  }

  download_obs(): void {
    console.log(this.dataB);
    let csvString = this.dataB.map(
      item => [
        item.Object, item.obsid, item.RA, item.Dec, item.instrument, item.date_time,
        item.proposal_id, item.target_id, item.observer, item.abstract
      ]
    ).map(e => e.join(","))
      .join("\n");
    csvString = "Object,obsid,RA,Dec,instrument,date_time,proposal_id,target_id,observer,abstract,visibilility\n" + csvString;
    console.log(csvString);
    const blobData = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blobData);
    console.log(blobData)
    saveAs(blobData, 'observations.csv');
  }
}
