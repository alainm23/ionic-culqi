# Ionic Culqi
Ejemplo de una pasarela de pago usando Ionic y Culqi (solo para Péru)

## Construccion
Clona el repositorio
```	
npm install
ionic serve
```

## Cosas a tener en cuenta
* Cree una cuenta en [Culqi](https://integ-panel.culqi.com/#/registro)
* Cree un comercio.
* Cambie el [Public Key](https://github.com/alainm23/ionic-culqi/blob/master/src/providers/pago/pago.ts#L59) y [Private Key]( https://github.com/alainm23/ionic-culqi/blob/master/src/providers/pago/pago.ts#L39) con los suyos que se optiene en el Panel de Culqi cuando ya haya creado una cuenta y un comercio
