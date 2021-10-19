var operador = prompt("ingrese una operacion una operción:\n1. +\n2. -\n3. *\n4. /" )
var num1 = prompt("Digite el numero 1")
var num2 = prompt("Digite el numero 2")
var resultado = 0

if (operador == '+'){
    resultado = parseInt(num1) + parseInt(num2)
    alert("el resultado es: " + resultado)
} else if (operador == '-'){
    resultado = num1 - num2
    alert("el resultado es: " + resultado)
} else if (operador == '*'){
    resultado = num1 * num2
    alert("el resultado es: " + resultado)
} else if (operador == '/'){
    if(num2 == 0){
        alert("el resultado es un error, división por 0")
        }
    else{
        resultado = num1 / num2
        alert("el resultado es: " + resultado)
    }
} else {
    alert("No ha seleccionado un operador valido")
}


for (var i=0; i < 3; i = i +1)
case i {
    switch(i){
        case 0:
            resultado = parseInt(num1) + parseInt(num2) + parseInt(num3)
            alert("la suma de sus numeros es: " + resultado)
        case 1:
            resultado = num1 - num2 - num3
            alert("la resta del numero 2 y 3 al 1 es: " + resultado)

    }
