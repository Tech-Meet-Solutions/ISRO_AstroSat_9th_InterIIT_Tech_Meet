import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerService } from '../server.service';
import { SourceA, SourceB, Paper, Source_Visibility } from '../source';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';



@Component({
  selector: 'app-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.scss']
})
export class ObjectComponent implements OnInit {
  myVar: number;
  id: string;
  dataA: SourceA;
  dataSource = new MatTableDataSource<SourceB>();
  dataSourcePapers = new MatTableDataSource<Paper>();
  source_idx = new Set();
  selection = new SelectionModel<SourceB>(true, []);
  visibility_array : { [id : number ] : Source_Visibility} ;
  selectionPaper = new SelectionModel<Paper>(true, []);
  displayedColumns: string[] = [  'Object','obsid','RA','Dec','instrument','date_time',
                                'proposal_id','target_id','observer','abstract','visibilility'];
  ColumnsPapers: string[] = ['Title', 'Authors','Keywords','Abstract']
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private server: ServerService
  ) {
    this.dataA = {
      id: 0,
      Name : '',
      Type: '',
      RA: 0,
      Dec: 0,
      Opt:'',
      r_Opt:'',
      Vmag:'',
      B_V:'',
      U_B:'',
      E_BV:'',
      r_Vmag:'',
      Fx:'',
      Range:'',
      Porb:'',
      Ppulse:'',
      r_Ppulse:'',
      Cat:'',
      SpType:'',
      Class:'',

      publications: Array<Paper>(),
      
      uvit:Array<SourceB>(),
      sxt:Array<SourceB>(),
      laxpc:Array<SourceB>(),
      czti:Array<SourceB>()
    };
    this.visibility_array = {};
    
    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      console.log(this.id);
    });

    this.server.get(`/api/info/${this.id}`).subscribe(
      response => {
        this.myVar = 0;
        this.dataA = response;
        this.dataSource = new MatTableDataSource<SourceB>(this.dataA.czti.concat(this.dataA.czti,this.dataA.sxt,this.dataA.uvit,this.dataA.laxpc));
        console.log(this.dataA.publications);
        console.log(this.dataA.czti);
        console.log("Done");
        this.fill_visibility_array();
        this.dataSourcePapers = new MatTableDataSource<Paper>(this.dataA.publications);
      },
      error => {
        console.log(error);
        this.router.navigateByUrl('');
      }
    );


  }


    fill_visibility_array(){
      console.log("inside vis func");
      //let source_idx = new Set();
      for(var source of this.dataA.czti ){
        this.source_idx.add(source.id);
      }
      for(var source of this.dataA.uvit ){
        this.source_idx.add(source.id);
      }
      for(var source of this.dataA.sxt ){
        this.source_idx.add(source.id);
      }
      for(var source of this.dataA.laxpc ){
        this.source_idx.add(source.id);
      }
      for(var idx of this.source_idx){
        //console.log(idx);
        
       

        this.visibility_array[Number(idx)] = {
          vis_uvit : true,
          vis_laxpc : true,
          vis_czti : true,
          vis_sxt : true
        };
      }
      console.log(this.visibility_array);
      this.FILL();
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
    assignClass(category: string): string{
      if (category.substring(0,3)=="sxt"){
        return "sxt";
      }
      if (category.substring(0,4)=="uvit"){
        return "uvit";
      }
      if (category.substring(0,5)=="laxpc"){
        return "laxpc";
      }
      if (category.substring(0,4)=="czti"){
        return "czti";
      }
      return "others";
    }

    check(): boolean{
        return false;
    }
     
      public toggleText(event, id) { 
  
            // Get all the elements from the page 
            var points =  
                document.getElementById("points"+String(id)); 
  
            var showMoreText = 
                document.getElementById("moreText"+String(id)); 
  
            var buttonText = 
                document.getElementById("textButton"+String(id)); 
  
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
              document.getElementById("points_abs"+String(id)); 
          var showMoreText = 
              document.getElementById("moreText_abs"+String(id)); 
          var buttonText = 
              document.getElementById("textButton_abs"+String(id)); 
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
      public FILL(){  
          for(var idx in this.source_idx){
            var points =  
              document.getElementById("CZTI"+String(idx)); 
              if(this.visibility_array[idx].vis_czti){
                points.innerHTML = "Show More"; 
              }
              if(this.visibility_array[idx].vis_sxt){
                points.innerHTML = "Show More"; 
              }
              if(this.visibility_array[idx].vis_uvit){
                points.innerHTML = "Show More"; 
              }
              if(this.visibility_array[idx].vis_laxpc){
                points.innerHTML = "Show More"; 
              }
          }
      }
      public toggleAuthor(event, id) { 
        var points =  
            document.getElementById("points_a"+String(id)); 
        var showMoreText = 
            document.getElementById("moreText_a"+String(id)); 
        var buttonText = 
            document.getElementById("textButton_a"+String(id)); 
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
          document.getElementById("points_k"+String(id)); 
      var showMoreText = 
          document.getElementById("moreText_k"+String(id)); 
      var buttonText = 
          document.getElementById("textButton_k"+String(id)); 
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
   
}
