import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

declare let Culqi: any;

@Injectable()
export class PagoProvider {
  settings: any = {
    title: '',
    currency: '',
    description: '',
    amount: 0
  };

  constructor(public http: HttpClient, 
              private events: Events) {
    document.addEventListener ('payment_event', (token: any) => {
      // Capturamos el token que se creo
      let token_id = token.detail;
        
      // URL de API 
      let url = 'https://api.culqi.com/v2/charges';

      /*
        Disparamos este evento para que mientras el pago se procese, 
        un loading cargue la pantalla principal y no se pueda hacer nada
      */
      this.events.publish ('on_event_loading_pago', "xdxd");

      /*
        Creamos el headers con el token privado que nos da culqi
        * Recuerda que el Token Privado es diferente al Token Publico
      */ 

      let headers = new HttpHeaders ()
        .set ('Content-Type', 'application/json')
        .set ('Authorization', 'Bearer sk_test_pcdFpAKB5XDzxV2O'); // Ingresa tu Private Key Aqui

      let body = JSON.stringify ({
        amount: this.settings.amount,
        currency_code: "PEN",
        email: "alainhuntt@gmail.com",
        source_id: token_id
      });

      this.http.post (url, body, {headers: headers}).subscribe (
        response => {
          // Si el pago se realiza, disparamos este evento
          this.events.publish ('on_event_pago', response);
        }, error => {
          // Si el pago tiene algun error, disparamos otro evento con el error
          this.events.publish ('on_event_pago_error', error);
        });
    }, false);
  }

  initCulqi () {
    // Ingresa tu "Puclic Key" que te da Culqi aqui
    Culqi.publicKey = 'pk_test_D8qvuHVR5j4fucze';
  }

  cfgFormulario (descripcion: string, cantidad: number) {
    this.settings.title = 'Culqi - Ionic';
    this.settings.currency = "PEN";
    this.settings.description = descripcion;
    this.settings.amount = cantidad;

    Culqi.settings ({
      title: 'Culqi - Ionic',     // Nombre de la empresa
      currency: 'PEN',            
      description: descripcion,
      amount: cantidad
    });
  }

  open () {
    Culqi.open ();
  }
}
