


var opcion = prompt("Seleccione la opción de helado:\n opción 0: sin toping\n opcion 1: oreo\n opción 2: kitkat\n opción 3: brownie");

 if(opcion==0){
     alert("El helado sin topping cuesta $1.90");
     console.log(1.9);
 }
 if(opcion==1){
     alert("El topping de oreo cuesta $1");
     console.log(1.9 + 1);
 }
 if(opcion==2){
    alert("El topping de KitKat cuesta $1.50");
    console.log(1.9 + 1.5);
}
if(opcion==3){
    alert("El topping de brownie cuesta $0.75");
    console.log(1.9 + 0.75);
}
//if(opcion!=0 || opcion!=1 || opcion!=2 |2| opcion!=3){
if(opcion>=4) {
    console4.log("no tenemos este topping, lo sentimos.");
    alert("El helado sin topping cuesta $1.90");
    console.log(1.9);
}





/* EJERCICIO GRUPAL
Escribe un programa que responda a un usuario que quiere comprar un helado, 
cuanto le costará el mismo, en función del topping que elija.

- El helado sin topping cuesta $1.90 [opcion 0]
- El topping de oreo cuesta $1 [opcion 1]
- El topping de KitKat cuesta $1.50 [opcion 2]
- El topping de brownie cuesta $0.75 [opcion 3]
En caso de NO disponer del topping solicitado por el usuario el programa mostrará por consola 
"no tenemos este topping, lo sentimos. " y a continuación informar del precio del helado sin ningún topping.

Finalmente, el programa escribe por consola el precio del helado con el topping seleccionado (o ninguno).
*/