export class Note {
  constructor(public title: string, public content: string, public type: number) {
  }
}

export const NoteTypes = {
  Regular: 1,
  Urgent: 2
}
