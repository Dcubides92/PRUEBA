var i, 
total = 0,
valorUno = 0,
valorDos = 0,
operacion = "",
area_t = document.getElementById("area");

function ocultar_todo(){
    var divs = document.getElementsByClassName("col-md-6");
    for(i = 0; i < divs.length; i++ ){
        document.getElementsByClassName("col-md-6").item(i).style.display= "none";
    }
}

function boton_cal() {
    let num = this.textContent;
    if (total>0){
        total= total + num;
        area_t.value= total;
    }
    if (total==0){
        area_t.value = num;
        total= num;
    }
    //num = num.substring(num.length,num.length-1); 
}
function boton_operador() {
    document.getElementById("area").value=""
    if(operacion==""){
        operacion = this.textContent;
        valorUno=total;
        total=0;
    }
    else{
        valorDos=total;
        operar();
    }
}

function operar() {
    if (operacion=='+'){
        total= parseInt(valorUno) + parseInt(valorDos);
        area_t.value=total;
    }
    if (operacion=='-'){
        total= parseInt(valorUno) - parseInt(valorDos);
        area_t.value=total;
    }
    if (operacion=="X"){
        total= parseInt(valorUno) * parseInt(valorDos);
        area_t.value=total;
    }
    if (operacion=="÷"){
        total= parseInt(valorUno) / parseInt(valorDos);
        area_t.value=total;
    }
    
}

window.addEventListener("load", function(){
    ocultar_todo();
})

btn_resultado = document.getElementById("btn_resul");
btn_resultado.addEventListener("click",function () {
    boton_operador()    
})

btn_borr = document.getElementById("btn_borrar");
btn_borr.addEventListener("click",function () {
    valorUno=0;
    valorDos=0;
    total=0;
    operacion="";
    area_t.value="";
})

var btn_calc = document.getElementById("but_cal");
btn_calc.addEventListener("click", function(){
    ocultar_todo();
    document.getElementById("div_calc").style.display= "block";
})

var btn_caracteres = document.getElementById("but_caracteres");
btn_caracteres.addEventListener("click", function(){
    ocultar_todo();
    document.getElementById("div_caracteres").style.display= "block";
})

var btn_texto = document.getElementById("but_text");
btn_texto.addEventListener("click", function(){
    ocultar_todo();
    document.getElementById("div_mayusculas_minisculas").style.display= "block";
})

var btn_sumatoria = document.getElementById("but_numbers");
btn_sumatoria.addEventListener("click", function(){
    ocultar_todo();
    document.getElementById("div_sumatoria").style.display= "block";
})

var btn_num = document.getElementsByClassName("btn_cal");
for(i = 0; i < btn_num.length; i++ ){
    btn_num[i].addEventListener("click", boton_cal);
}

var btn_oper = document.getElementsByClassName("btn_oper");
for(i = 0; i < btn_oper.length; i++ ){
    btn_oper[i].addEventListener("click", boton_operador);
}

var texto_contar = document.getElementById("text_contar");
var btn_contar = document.getElementById("btn_contar");
btn_contar.addEventListener("click",function () {
    let texto = texto_contar.value
    alert("El numero de caracteres son:\n" + texto.length);
})

var texto_convertir = document.getElementById("texto_convertir");
var btn_mayuscula = document.getElementById("btn_mayuscula");
btn_mayuscula.addEventListener("click",function () {
    let texto = texto_convertir.value
    alert("El texto en mayuscula es:\n" + texto.toUpperCase());
})

var btn_minuscula = document.getElementById("btn_minuscula");
btn_minuscula.addEventListener("click",function () {
    let texto = texto_convertir.value
    alert("El texto en minuscula es:\n" + texto.toLowerCase());
})

var num_sumatoria = document.getElementById("num_sumatoria");
var btn_sumatoria = document.getElementById("btn_sumatoria");
btn_sumatoria.addEventListener("click",function () {
    let num = num_sumatoria.value
    num = parseInt(num)
    var x = 1
    if(num < 1){
        alert("no hay factorial para numeros negativos")
    }
    for (var i=1; i < num ; i = i +1){
        x = x * (i + 1)
    }
    alert("el factorial es: " + x)
})

