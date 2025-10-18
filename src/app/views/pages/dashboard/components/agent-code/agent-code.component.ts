import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialog } from '@angular/material/dialog';
import { DialogDiscontCodeListComponent } from './components/dialog-discont-code-list/dialog-discont-code-list.component';

@Component({
  selector: 'app-agent-code',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './agent-code.component.html',
  styleUrl: './agent-code.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AgentCodeComponent {

  // Input
  @Input() lastAgentCode: string;
  @Input() totalRegisterWithCode: number;

  constructor(
    private clipboard: Clipboard,
    private dialog: MatDialog,
  ) {
  }
  //==================================
  // #region LIFE CYCLE HOOK 
  //==================================
  ngOnInit(): void {
  }

  //#endregion
  //==================================
  // #region PUBLIC
  //==================================
  copyCode(): void {
    this.clipboard.copy(this.lastAgentCode);
  }


  showDiscountCodeListDialog(): void {
    const dialogRef = this.dialog.open(DialogDiscontCodeListComponent, {
      disableClose: true,
      width: '600px',
      maxWidth: '100vw',
      minHeight: '418px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog',
      autoFocus: false,
    });
    dialogRef.componentInstance.totalRegisterWithCode = this.totalRegisterWithCode;
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
      }
    });
  }

  //#endregion
}
