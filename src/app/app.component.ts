import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private http:HttpClient, private spinner:NgxSpinnerService){

  }
  allpost;
  notEmptypost=true;
  notScrolly=true;
  ngOnInit(){
    this.loadInitPost();
  }
  //load initial 6 posts
  loadInitPost() {
    const url = 'http://tlino.96.lt/api/getblogpost';
    this.http.get(url).subscribe(data => {
      this.allpost = data[0];
    });
  }
  onScroll()
  {
    if(this.notScrolly && this.notEmptypost){
      this.spinner.show();
      this.notScrolly=false;
      this.loadNextPost();
    }
    
  }
  // load th next 6 posts
 loadNextPost() {
  const url = 'http://tlino.96.lt/api/getnextpost';
  // return last post from the array
  const lastPost = this.allpost[this.allpost.length - 1];
  // get id of last post
  //  backend of this app use this id to get next 6 post
  const lastPostId = lastPost.id;
  // sent this id as key value pare using formdata()
  const dataToSend = new FormData();
  dataToSend.append('id', lastPostId);
  // call http request
  this.http.post(url, dataToSend)
  .subscribe( (data: any) => {

     const newPost = data[0];
    this.loadNextPost();
     
     if (newPost.length === 0 ) {
       this.notEmptypost =  true;
       this.loadNextPost();
       
     }
     // add newly fetched posts to the existing post
     this.allpost = this.allpost.concat(newPost);

     this.notScrolly = false;
   });
}


  
}
