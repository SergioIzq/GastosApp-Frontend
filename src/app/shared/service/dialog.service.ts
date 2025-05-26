import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DialogBlurService {
  private dialogOpenSubject = new BehaviorSubject<boolean>(false);
  dialogOpen$ = this.dialogOpenSubject.asObservable();

  setDialogOpen(isOpen: boolean) {
    this.dialogOpenSubject.next(isOpen);
  }
}
