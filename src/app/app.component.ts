import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
// import 'rxjs/add/observable/of';
import {map, startWith} from 'rxjs/operators';

import { AngularFirestore } from 'angularfire2/firestore';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AutocompleteSearchBar';
  myControl = new FormControl();
  schools = [];
  filteredOptions: Observable<string[]>;

  constructor(private _firestoreService: AngularFirestore) { }

  ngOnInit() {
    this._firestoreService.collection('Schools').snapshotChanges().subscribe(result => {
      this.schools = [];
      for (let res of result) {
        this.schools.push(res.payload.doc.id)
        console.log(this.schools);
      }
    });

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.schools.filter(option => option.toLowerCase().includes(filterValue));
  }
}
