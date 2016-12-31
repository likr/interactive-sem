import {Component} from '@angular/core'

import {AbstractComponent} from './abstract'
import {AppDispatcher} from '../application/app'
import {ModalDialogActions} from '../application/modal-dialog'
import {ProjectsActions} from '../application/project/projects.actions'

@Component({
  selector : 'is-modal-dialog-load-file',
  styleUrls: ['src/shared-styles/modal-dialog.css'],
  template : `
    <style>
      .buttons {
        position: absolute;
        bottom: 20px/*modalDialogComponentCssBodyPadding*/;
        right:  20px/*modalDialogComponentCssBodyPadding*/;
      }
      .container,
      .csvContainer {
        margin-top: 8px;
      }
    </style>

    <h2>{{'ModalDialogLoadFile.Header' | translate}}</h2>

    <div class="container">
      <label for="projectName">{{'ModalDialogLoadFile.LabelProjectName' | translate}}</label>
      <input type="text" id="projectName" [(ngModel)]="projectName">
    </div>

    <div class="csvContainer">
      <label *ngFor="let encoding of encodings">
        <input
          type        ="radio"
          name        ="encoding"
          [attr.value]="encoding.value"
          [checked]   ="encoding.value === encodings[0].value"
          (change)    ="currentEncoding = encoding.value"
        >
        {{encoding.label}}
      </label>
      <div class="container">
        <label for="csvFile">{{'ModalDialogLoadFile.LabelCSVFile' | translate}}</label>
        <input
          type      ="file"
          [encoding]="currentEncoding"
          (result)  ="onResultInputFile($event)"
        >
      </div>
    </div>

    <div class="container">
      <p>{{'ModalDialogLoadFile.SampleFile' | translate}}</p>
    </div>
    
    <div class="buttons">
      <is-ui-button
        [label]="'Cancel' | translate"
        [type] ="'default'"
        (clickButton)="onClickSecondary($event)"
      ></is-ui-button>

      <is-ui-button
        [label]="'OK' | translate"
        [type] ="'primary'"
        (clickButton)="onClickPrimary($event)"
      ></is-ui-button>
    </div>
  `
})
export class ModalDialogLoadFileComponent extends AbstractComponent {

  private projectName: string
  private encodings: Array<{label: string, value: string}>
  private loadedCsv: string

  constructor(private projects: ProjectsActions,
              private modalDialog: ModalDialogActions,
              private dispatcher: AppDispatcher) {
    super()
  }

  ngOnInit() {
    this.encodings = [
      {label: 'UTF-8',     value: 'utf8'},
      {label: 'Shift_JIS', value: 'sjis'}
    ]
  }

  onClickPrimary() {
    this.dispatcher.emitAll([
      this.projects.createNewProject(this.projectName, this.loadedCsv),
      this.modalDialog.close()
    ])
  }

  onClickSecondary() {
    this.dispatcher.emit(this.modalDialog.close())
  }

  onResultInputFile(result: string) {
    this.loadedCsv = result
  }

}
