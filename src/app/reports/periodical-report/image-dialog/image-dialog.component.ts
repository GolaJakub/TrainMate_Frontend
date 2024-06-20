import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {FileStorageDto} from "../reports.model";

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  standalone: true,
  styleUrls: ['./image-dialog.component.css']
})
export class ImageDialog {
  constructor(
    public dialogRef: MatDialogRef<ImageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: FileStorageDto
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
