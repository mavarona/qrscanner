import { Injectable } from '@angular/core';
import { Register } from '../models/register.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File as ionFile } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  registers: Register[] = [];

  constructor( private storage: Storage,
               private navCtrl: NavController,
               private iab: InAppBrowser,
               private file: ionFile,
               private emailComposer: EmailComposer ) {
    this.loadStorage();
  }

  async loadStorage() {
    this.registers = await this.storage.get('registers') || [];
  }

  saveRegister( format: string, text: string ){
    const newRegister = new Register( format, text );
    this.registers.unshift( newRegister );
    this.storage.set('registers', this.registers);
    this.openRegister( newRegister );
  }

  openRegister( register: Register) {
    this.navCtrl.navigateForward('/tabs/tab2');
    switch ( register.type ) {
      case 'http':
        this.iab.create( register.text, '_system' );
        break;
      case 'geo':
        this.navCtrl.navigateForward(`/tabs/tab2/map/${ register.text }`);
        break;
    }
  }

  sendEmail(){
    const arrData = [];
    const titles = 'Typo, Formato, Creado en, Texto\n';
    arrData.push ( titles );

    this.registers.forEach( register => {
      const line = `${ register.type }, ${ register.format }, ${ register.created }, ${ register.text.replace(',', ' ') }\n`;
      arrData.push ( line );
    });

  }

  createAttachment( text: string ) {
    this.file.checkFile( this.file.dataDirectory, 'registers.csv' )
        .then( exists => {
          return this.writeFile(text);
        })
        .catch( err => {
          return this.file.createFile( this.file.dataDirectory, 'registers.csv', false )
                     .then( created => this.writeFile( text ))
                     .catch( err2 => console.log('No se pudo crear el archivo', err2))  ;
        });
  }

  async writeFile( text: string) {
    await this.file.writeExistingFile( this.file.dataDirectory, 'registers.csv', text);
    const fileAttachment = `${ this.file.dataDirectory }/registers.csv`;
    const email = {
      to: 'testtotal@gmail.com',
      //cc: 'erika@mustermann.de',
      bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        fileAttachment
      ],
      subject: 'Registros guardados',
      body: 'Aquí tiene el resumen de registros guardados',
      isHtml: true
    };
    this.emailComposer.open(email);
  }

}
