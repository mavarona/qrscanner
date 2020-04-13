import { Injectable } from '@angular/core';
import { Register } from '../models/register.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  registers: Register[] = [];

  constructor( private storage: Storage,
               private navCtrl: NavController,
               private iab: InAppBrowser ) {
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

}
