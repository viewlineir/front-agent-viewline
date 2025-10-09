import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Clipboard } from '@angular/cdk/clipboard';

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

  constructor(private clipboard: Clipboard) { }

  copyCode(): void {
    this.clipboard.copy(this.lastAgentCode);
  }

}
