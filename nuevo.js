var opcion = prompt("Seleccione la opción de helado:\n opción 0: sin toping\n opcion 1: oreo\n opción 2: kitkat\n opción 3: brownie");




if(opcion==0){
    var topp=1.9;
     alert("El helado sin topping cuesta $1.90");
     var precio=topp;
}
 if(opcion==1){
    var topp=1;
     alert("El topping de oreo cuesta $1");
     var precio=1.9 + topp;
}
 if(opcion==2){
    var topp=1.5;
    alert("El topping de KitKat cuesta $1.50");
    var precio=1.9 + topp;
}
if(opcion==3){
    var topp=0.75;
    
    var precio=1.9 + topp;
    alert("El topping de brownie cuesta:"+precio);
}
//if(opcion!=0 || opcion!=1 || opcion!=2 |2| opcion!=3){
if(opcion>=4) {
    console4.log("no tenemos este topping, lo sentimos.");
    alert("El helado sin topping cuesta $1.90");
}

alert("El topping de brownie cuesta:"+topp);