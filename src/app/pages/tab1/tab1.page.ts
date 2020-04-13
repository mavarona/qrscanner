import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DataLocalService } from '../../services/data-local.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  slidesOptions = {
    allowSlidePrev: false,
    allowSlideNext: false
  }

  ionViewWillEnter() {
    this.scan();
  }

  constructor( private barcodeScanner: BarcodeScanner,
               private dataLocal: DataLocalService ) {}

  scan() {
    this.barcodeScanner.scan().then( barcodeData => {
      if ( !barcodeData.cancelled ) {
        this.dataLocal.saveRegister( barcodeData.format, barcodeData.text );
      }

     }).catch(err => {
         console.log('Error', err);
         //this.dataLocal.saveRegister( 'http', 'https://ionicframework.com/docs/native/in-app-browser' );
         this.dataLocal.saveRegister( 'QRCode', 'geo:40.73151796986687,-74.06087294062502' );

        });
  }

}
