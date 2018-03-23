import {Component, OnInit} from '@angular/core';
import {Note, NoteTypes} from '../../models/Note';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  notes: Note[];
  NoteTypes = NoteTypes;

  titleInputValue: string;
  contentInputValue: string;
  typeValue: string;

  editableIndex: number;

  filter: number;

  constructor() {
    if (this.getNotesFromLocalStorage()) {
      this.notes = JSON.parse(this.getNotesFromLocalStorage());
    } else {
      this.notes = [];
    }

    this.typeValue = '1';

    this.editableIndex = null;
    this.filter = null;
  }

  addNote(): void {
    const note = new Note(this.titleInputValue, this.contentInputValue, Number(this.typeValue));
    this.notes.push(note);

    this.saveNotesToLocalStorage();
  }

  ngOnInit() {
  }

  deleteNote(index: number): void {
    this.notes.splice(index, 1);
    this.saveNotesToLocalStorage();
  }

  toggleEdit(index: number): void {
    if (index !== this.editableIndex) {
      this.editableIndex = index;
    } else {
      this.editableIndex = null;
      this.saveNotesToLocalStorage();
    }
  }

  saveNotesToLocalStorage(): void {
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  getNotesFromLocalStorage(): string {
    return localStorage.getItem('notes');
  }
}
