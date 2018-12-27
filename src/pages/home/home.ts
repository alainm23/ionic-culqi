import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';

import { PagoProvider } from '../../providers/pago/pago';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  loading: Loading;
  monto: number;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public events: Events,
              private alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private pago: PagoProvider) {

  }

  ngOnInit () {
    this.loading = this.loadingCtrl.create({
      content: "Procesando informacion...",
      dismissOnPageChange: true
    });

    this.loading.present ();

    this.loading.dismiss ().then (() => {
      this.pago.initCulqi ()
    });
    
    this.events.subscribe('on_event_loading_pago', (data) => {
      this.loading = this.loadingCtrl.create ({
        content: "Procesando informacion...",
        dismissOnPageChange: true
      });

      this.loading.present ();
    });

    this.events.subscribe('on_event_pago', (data: any) =>{
      if (this.loading.present ()) {
        if (data.outcome.type == "venta_exitosa") {
          this.loading.dismiss ().then (() => {
            let alert = this.alertCtrl.create ({
              title: 'Pago exitoso',
              subTitle: 'Tu pago se realizo...',
              buttons: [
                {
                  text: 'OK',
                  role: 'cancel',
                  handler: () => {
                    // Hacer algo con el pago completo
                  }  
                }
              ]  
            });
            
            alert.present ();
          });
        }
      }
    });

    this.events.subscribe ('on_event_pago_error', (error: any) => {
      if (this.loading.present ()) {
        this.loading.dismiss ().then (() => {
          let alert = this.alertCtrl.create ({
            title: error.error.merchant_message,
            subTitle: error.error.user_message,
            buttons: [
              {
                text: 'OK',
                role: 'cancel',
                handler: () => {
                  // Haga algo con el error
                }  
              }
            ]
          });  
        
          alert.present ();
        
        });
      }
    });
  }

  openCheckout () {
    this.loading = this.loadingCtrl.create({
      content: "Procesando informacion...",
      dismissOnPageChange: true
    });

    this.loading.present ();
    
    this.pago.cfgFormulario ("Pago por servicio", this.monto * 100);

    // Cuando la configuracion termina, llamo al metodo open () para abrir el formulario 
    this.loading.dismiss ().then (() => {
      this.pago.open ();
    });
  }
}
