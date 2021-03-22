import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerService } from '../server.service';
import { SourceA, SourceB } from '../source';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import { stringify } from '@angular/compiler/src/util';


@Component({
  selector: 'app-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.scss']
})
export class ObjectComponent implements OnInit {

  id: string;
  dataA: SourceA;
  dataSource = new MatTableDataSource<SourceB>();
  dummy: string;
  selection = new SelectionModel<SourceB>(true, []);
  displayedColumns: string[] = [  'Name','abstract', 'RA, Dec','category', 'PL', ];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private server: ServerService
  ) {
    this.dataA = {
      id: 0,
      Name: '',
      RA: 0,
      Dec: 0,
      Publications: {},
      isObserved_uvit: false,
      isObserved_laxpc: false,
      isObserved_czti: false,
      isObserved_sxt: false,
      category: '',
      uvit:Array<SourceB>(),
      sxt:Array<SourceB>(),
      laxpc:Array<SourceB>(),
      czti:Array<SourceB>()
    };
    
    this.dummy = "lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi a consectetur facilis facere hic quidem atque ullam culpa, dolor sint, aspernatur repellat nobis, vitae tempora quia. Facilis quo tenetur quibusdam.lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi a consectetur facilis facere hic quidem atque ullam culpa, dolor sint, aspernatur repellat nobis, vitae tempora quia. Facilis quo tenetur quibusdam.lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi a consectetur facilis facere hic quidem atque ullam culpa, dolor sint, aspernatur repellat nobis, vitae tempora quia. Facilis quo tenetur quibusdam.lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi a consectetur facilis facere hic quidem atque ullam culpa, dolor sint, aspernatur repellat nobis, vitae tempora quia. Facilis quo tenetur quibusdam."
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      console.log(this.id);
    });

    this.server.get(`/api/info/${this.id}`).subscribe(
      response => {
        this.dataA = response;
        this.dataSource = new MatTableDataSource<SourceB>(this.dataA.czti.concat(this.dataA.czti,this.dataA.sxt,this.dataA.uvit,this.dataA.laxpc));
        
        console.log("Done");
      },
      error => {
        console.log(error);
        this.router.navigateByUrl('');
      }
    );


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
   
}
