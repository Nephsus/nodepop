**NODEPOP**
==============================================================================
API para la aplicación de venta y compra de artículos nuevos y de segunda mano.

*Práctica MOD DEVOPS*
===========================================
Hola Alberto, he levantado una nueva máquina y he realizado los dos ejercicios de la práctica.
He comprado el dominio nephsus.net y he colocado el nginx de proxy inverso con node. Puedes probar a autenticarte con este usuario:
email:  prueba@hotmail.com
clave:  prueba
Método POST x-www-formurlencoded: http://www.nephsus.net/apiv1/usuarios/authenticate

La ejecución correcta te devolverá un token, este token lo añades a una cabecera nueva llamada x-access-token y haces un GET a esta url:
http://www.nephsus.net/apiv1/anuncios

Esto te devolverá el listado de anuncios, y cada anuncion tiene un recurso estático servido por nginx. Y para que lo puedas verificar he 
añadido la cabecera X-Owner con mi alias de github: Nephsus.

Para el segundo ejercicio puedes acceder a esta ip a través de un navegador y veras como se te despliega una plantilla que he cogido de startbootstrap.com:
http://34.192.102.128

Un saludo.
David.

*Instalación*
===========================================
La aplicación contiene un archivo de propiedades situado en config/application.properties. En este fichero 
se configura tanto la localización de la base de datos de MongoDB así como el número de registros, con el que se pagina, y 
la clave privada usada para el token jwt de sesión.

Una vez configurado esto, procedemos a ejecutar el siguiente comando en la carpeta principal:
         
         npm install

 
Para instalar todos lo módulos. Después ejecutamos el siguiente script:

        npm run installDB

Este script dará de alta 9 artículos y un usuario de pruebas(email: prueba@hotmail.com y clave: prueba ).
Posteriormente hay que ejecutar el siguiente script para levantar el servidor y la aplicación:

        npm start
 

Una vez realizado, se pasa a detallar el API.

*Métodos de Aplicación*
===========================================

 **Autenticación**
 Método que autentica a un usuario.
 
 * url:    apiv1/usuarios/authenticate
 * método: POST x-www-formurlencoded
 * parámetros in:  email (mail del usuario) y clave (clave de acceso)
 * parámetros out: <token de jwt necesario para obtener la lista de artículos>
 
 
 **Alta nuevo usuario**
 Método que añade un nuevo usuario.
  
 * url:    apiv1/usuarios/add
 * método: POST x-www-formurlencoded
 * parámetros in:  nombre (nombre del usuario), email (mail del usuario) y clave (clave de acceso)
 * parámetros out: En caso correcto devolverá un "success": "OK", si se ha producido un error devolverá un objeto del tipo "success": false, "error": {"code": "....","message": "........."} 
 
 
  **Listado de Anuncios**
  Método que añade un nuevo usuario.
   
  * url:    http://www.nephsus.net/apiv1/anuncios
  * método: GET 
  * parámetros in:  Estos parámetros actúan como filtros:
                        1. Por tag ?tag = [work, lifestyle, motor y mobile]
                        2. Si se vende o se busca. ?venta=false o true
                        3. Por rango de precio (precio min. y precio max.) :
                                    * 10-50 buscará anuncios con precio incluido entre estos valores
                                    * 10- buscará los que tengan precio mayor que 10.
                                    * -50 buscará los que tengan precio menor de 50.
                                    * 50 buscará los que tengan precio igual a 50. 
                        4. Por nombre del artículo ?nombre=bici
                        
   Ejemplo:
        _/apiv1/anuncios?nombre=mac&precio=10-&venta=false&tag=work_
            
    Nota(*):El número de registros por página está en el application.properties, y puede ser ampliado o reducido. 
             Para paginar hay que añadir el parámetro _id al querystring. El ObjectID que hay que enviar en 
             cada paginación es el último _id devuelto en la página anterior. Para saber si hay más registros, se envía 
             adicionalmente un flag llamado moreRecords, si este está activo(true) indica que se puede lanzar una paginación más.
  * parámetros out: En caso correcto devolverá la lista de anuncios: 
  
  
        "advertisements": [
                 {
                    "_id": "5813758602819f0563806d95",
                    "nombre": "MacBook Pro",
                    "venta": false,
                    "precio": 350,
                    "foto": "http://www.nephsus.net/images/anuncios/macbookpro.jpeg",
                    "tags": ["work"]
                 }
         ]
         
*Multiidioma*
===========================================
Existe un módulo de control de errores multi-idioma(ErrorManager) que usa
un módulo(i18-node https://www.npmjs.com/package/i18n-node) de locales para cargar
la traducción correcta. Si en la petición viene el parámetro 'lang' como queryString ó en el body ó 
en una cabecera especial llamada 'x-lang-user' se devolverá su traducción correspondiente en ese idioma,
sino, el idioma por defecto es el español. Por ahora sólo hay traducciones en Español e Ingles.