$(document).ready(iniciar);

//Variables Globales
var datos = new Array();	//Tabla de números
var objetivo;				//Valor objetivo a encontrar
var listaSoluciones;		//Lista de soluciones de la tabla
var solucionUsuario;		//La solución que está construyendo el usuario
var nivelActual;
var nCeldasSeleccionadas = 0;
//var sumaCeldasSeleccionadas = 0;
var encontradas = 0;
var rendido = false;

var nivel = new Array();
nivel[1] = {
	rangoInferior : 0,
	rangoSuperior : 9,
	secuencia : 2,
	orden : 5
}
nivel[2] = {
	rangoInferior : 0,
	rangoSuperior : 9,
	secuencia : 2,
	orden : 8
}
nivel[3] = {
	rangoInferior : -9,
	rangoSuperior : 9,
	secuencia : 2,
	orden : 5
}
nivel[4] = {
	rangoInferior : -9,
	rangoSuperior : 9,
	secuencia : 2,
	orden : 8
}
nivel[5] = {
	rangoInferior : -9,
	rangoSuperior : 9,
	secuencia : 3,
	orden : 5
}
nivel[6] = {
	rangoInferior : -9,
	rangoSuperior : 9,
	secuencia : 3,
	orden : 8
}
nivel[7] = {
	rangoInferior : -9,
	rangoSuperior : 9,
	secuencia : 3,
	orden : 10
}
nivel[8] = {
	rangoInferior : -19,
	rangoSuperior : 19,
	secuencia : 2,
	orden : 5
}
nivel[9] = {
	rangoInferior : -19,
	rangoSuperior : 19,
	secuencia : 3,
	orden : 8
}
nivel[10] = {
	rangoInferior : -99,
	rangoSuperior : 99,
	secuencia : 2,
	orden : 5
}
nivel[11] = {
	rangoInferior : -99,
	rangoSuperior : 99,
	secuencia : 3,
	orden : 8
}
nivel[12] = {
	rangoInferior : -99,
	rangoSuperior : 99,
	secuencia : 3,
	orden : 10
}

//Precarga de imágenes
var imagen1 = new Image();
imagen1.src = "img/vi.png";
var imagen2 = new Image();
imagen2.src = "img/vm.png";
var imagen3 = new Image();
imagen3.src = "img/vf.png";

var imagen4 = new Image();
imagen4.src = "img/hi.png";
var imagen5 = new Image();
imagen5.src = "img/hm.png";
var imagen6 = new Image();
imagen6.src = "img/hf.png";

var imagen7 = new Image();
imagen7.src = "img/dii.png";
var imagen8 = new Image();
imagen8.src = "img/dim.png";
var imagen9 = new Image();
imagen9.src = "img/dif.png";

var imagen10 = new Image();
imagen10.src = "img/idi.png";
var imagen11 = new Image();
imagen11.src = "img/idm.png";
var imagen12 = new Image();
imagen12.src = "img/idf.png";

//Clases
function Punto(fila, columna){
	this.fila = fila;
	this.columna = columna;
}
function Solucion(){
	this.punto = new Array();	//array de puntos de la solución
	this.td = new Array();		//array de tds que forman la solución.
	this.sentido = null;
	this.encontrada = false;
	
	this.esIgual = function (solucion){
		var numIguales = 0;
		
		for(var i = 0; i < this.punto.length; i++)
			for(var j = 0; j < solucion.punto.length; j++)
				if (this.punto[i].fila == solucion.punto[j].fila)
					if (this.punto[i].columna == solucion.punto[j].columna)
						numIguales++;

		return (numIguales == this.punto.length);
	}
}

//Funciones
function iniciar(){
	//$('#btnMeRindo').hide();
	$('#btnMeRindo').click(rendirse);
	nivelActual = 1;
	generar();
}

function rendirse(){
	if (confirm("¿Seguro que quieres rendirte?")){
		rendido = true;
		mostrarSoluciones();
		nivelActual = 1;
	}
}

function mostrarSoluciones(){
	for(var i=0; i< listaSoluciones.length; i++)
		if (!listaSoluciones[i].encontrada)
			for (var j=0; j < listaSoluciones[i].punto.length; j++){
				mostrar(listaSoluciones[i]);
				$("#td_" + listaSoluciones[i].punto[j].fila + "-" + listaSoluciones[i].punto[j].columna).addClass("seleccionada");
			}
}

function generar(){
	$('#nivel').html(nivelActual);
	$('#secuencia').html(nivel[nivelActual].secuencia);
	objetivo = generarObjetivo();
	$('#objetivo').html(objetivo);
	$('#encontradas').html(encontradas);
	divTabla = $('#divTabla');
	divTabla.html("");//borramos tablas anteriores
	tabla = document.createElement("table");
	tabla.className = "tabla";
	for (i=0; i<nivel[nivelActual].orden; i++){
		datos[i] = new Array();
		tr = document.createElement('tr');
		for(var j=0; j<nivel[nivelActual].orden; j++){
			datos[i][j] = generarAleatorio(nivel[nivelActual].rangoInferior,nivel[nivelActual].rangoSuperior);
			td = document.createElement('td');
			$(td).addClass('celdaJuego');
			$(td).attr("id", "td_" + i + "-" + j);
			$(td).on( "click", seleccionarCelda );
			td.fila = i;
			td.columna = j;
			td.innerHTML= datos[i][j];
			tr.appendChild(td);
		}
		tabla.appendChild(tr);
	}
	$('#divTabla').append(tabla);
	listaSoluciones = encontrarSoluciones();
	if (listaSoluciones.length == 0)
		generar();
	else{
		$('#soluciones').html(listaSoluciones.length);
		solucionUsuario = new Solucion();
	}
	$('#infoRespuesta').hide();
}

function generarAleatorio(inferior,superior){
    var rango = superior - inferior;
    var aleatorio = Math.random() * rango;
    aleatorio = Math.round(aleatorio);
    return parseInt(inferior) + aleatorio;
}

function generarObjetivo(){
	var media = ((nivel[nivelActual].rangoInferior + nivel[nivelActual].rangoSuperior) / 2) * nivel[nivelActual].secuencia;
	var objetivo = media + generarAleatorio(nivel[nivelActual].rangoInferior, nivel[nivelActual].rangoSuperior);
	
	return parseInt(objetivo);
}

function encontrarSoluciones(){
//TODO: Refactorizar. Crear un método genérico para los cuatro bucles.
	var listaSoluciones = new Array();
	
	//Comprobar Filas
	for (var i = 0; i < nivel[nivelActual].orden; i++){
		for (var j = 0; j <= (nivel[nivelActual].orden - nivel[nivelActual].secuencia); j++){
			var solucion = new Solucion();
			solucion.sentido = "h";
			var suma = 0;
			for (var k = 0; k < nivel[nivelActual].secuencia; k++){
				solucion.punto.push(new Punto(i, j+k));
				suma += datos[i][j+k];
			}
			if (suma == objetivo)
				listaSoluciones.push(solucion);
		}
	}
	listaSoluciones.numResFilas = listaSoluciones.length;
	
	//Comprobar Columnas
	for (var i = 0; i < nivel[nivelActual].orden; i++){
		for (var j = 0; j <= (nivel[nivelActual].orden - nivel[nivelActual].secuencia); j++){
			var solucion = new Solucion();
			solucion.sentido = "v";
			var suma = 0;
			for (var k = 0; k < nivel[nivelActual].secuencia; k++){
				solucion.punto.push(new Punto(j+k, i));
				suma += datos[j+k][i];
			}
			if (suma == objetivo)
				listaSoluciones.push(solucion);
		}
	}
	listaSoluciones.numResCols = listaSoluciones.length - listaSoluciones.numResFilas;
	
	//Comprobar diagonal izqda-dcha
	for(var i = 0; i <= (nivel[nivelActual].orden - nivel[nivelActual].secuencia); i++){
		for(j = 0; j <= (nivel[nivelActual].orden - nivel[nivelActual].secuencia); j++){
			var solucion = new Solucion();
			solucion.sentido = "id";
			var suma = 0;
			for (var k = 0; k < nivel[nivelActual].secuencia; k++){
				solucion.punto.push(new Punto(i+k, j+k));
				suma += datos[i+k][j+k];
			}
			if (suma == objetivo)
				listaSoluciones.push(solucion);
		}
	}
	listaSoluciones.numResIzqdaDcha = listaSoluciones.length - listaSoluciones.numResFilas - listaSoluciones.numResCols;
//	alert("En diagonal de izquierda a derecha hay " + listaResultados.numResIzqdaDcha);
	
	//Comprobar diagonal dcha-izqda
	for(var i = 0; i <= (nivel[nivelActual].orden - nivel[nivelActual].secuencia); i++){
		for(var j = nivel[nivelActual].secuencia - 1; j < nivel[nivelActual].orden; j++){
			var solucion = new Solucion();
			solucion.sentido = "di";
			var suma = 0;
			for (var k = 0; k < nivel[nivelActual].secuencia; k++){
				solucion.punto.push(new Punto(i+k, j-k));
				suma += datos[i+k][j-k];
			}
			if (suma == objetivo)
				listaSoluciones.push(solucion);
		}
	}
	listaSoluciones.numResDchaIzqda = listaSoluciones.length - listaSoluciones.numResFilas - listaSoluciones.numResCols - listaSoluciones.numResIzqdaDcha;
//	alert("En diagonal de derecha a izquierda hay " + listaResultados.numResDchaIzqda);
	
	//Generar array de td
	for(var i = 0; i < listaSoluciones.length; i++){
		for (var j = 0; j < listaSoluciones[i].punto.length; j++)
			listaSoluciones[i].td.push($("#td_" + listaSoluciones[i].punto[j].fila + "-" + listaSoluciones[i].punto[j].columna));
	}
	
	return listaSoluciones;
}

function seleccionarCelda(evt){
	if (rendido) return;
	if ($(evt.currentTarget).hasClass('seleccionada')){
		$(evt.currentTarget).removeClass('seleccionada');
		nCeldasSeleccionadas--;
	}
	else{
		$(evt.currentTarget).addClass('seleccionada');
		nCeldasSeleccionadas++;
	}
	if (nCeldasSeleccionadas == nivel[nivelActual].secuencia){
		
		//Generamos la solución del usuario
		solucionUsuario = new Solucion();
		$('.seleccionada').each(function (index){
			var punto = new Punto(this.fila, this.columna);
			solucionUsuario.punto.push(punto);
			solucionUsuario.td.push(this);
		});
		
		$('#infoRespuesta').show();
		$('#infoRespuesta').removeClass('alert-success');
		$('#infoRespuesta').removeClass('alert-danger');
		$('#infoRespuesta').removeClass('alert-warning');
		
		switch(valorar(solucionUsuario, listaSoluciones)){
			case "valida":
				$('#infoRespuesta').addClass('alert-success');
				$('#infoRespuesta').html("¡¡Correcto!! Busca la siguiente.");
				document.getElementById('audio-acierto').play();
				mostrar(solucionUsuario);
				encontradas++;
				break;
			case "repetida":
				$('#infoRespuesta').addClass('alert-warning');
				$('#infoRespuesta').html("¡Repetida! Busca otra.");
				document.getElementById('audio-error').play();
				break;
			case "erronea":
				$('#infoRespuesta').addClass('alert-danger');
				$('#infoRespuesta').html("¡¡Errónea!! Sigue buscando.");
				document.getElementById('audio-error').play();
				break;
		}
		
		$('.celdaJuego').removeClass('seleccionada');
		nCeldasSeleccionadas = 0;
		$('#encontradas').html(encontradas);
		if (encontradas == listaSoluciones.length){
			$('#infoRespuesta').removeClass('alert-danger');
			$('#infoRespuesta').addClass('alert-success');
			if (nivelActual == (nivel.length - 1)){
				$('#infoRespuesta').html('<h4>¡¡ENHORABUENA!!</h4><p>Has superado todos los niveles. Haremos más pronto.</p>');
			}
			else{
				$('#infoRespuesta').html("<p>¡¡PERFECTO!!</p><p>Has superado este nivel. <button id=\"btnSiguienteNivel\" type=\"button\" class=\"btn btn-success\">Siguiente Nivel</button>");
				nivelActual++;
				encontradas = 0;
				$('#btnSiguienteNivel').click(generar);
			}
		}
	}
}

function valorar(solucionUsuario, listaSoluciones){
	var solucion = verSolucion(solucionUsuario, listaSoluciones);
	if (solucion === null)
		return "erronea";
	
	if (solucion.encontrada)
		return "repetida";
	
	solucion.encontrada = true;
	solucionUsuario.sentido = solucion.sentido; //Necesitamos el sentido para dibujarla
	
	return "valida";
}

function verSolucion(solucionUsuario, listaSoluciones){
//Busca la solucionUsuario en listaSoluciones y la devuelve
	
	for(var i=0; i< listaSoluciones.length; i++){
		if (listaSoluciones[i].esIgual(solucionUsuario))
			return listaSoluciones[i];
	}
	return null;
}

function mostrar(solucion){
	var imgI = document.createElement("img");
	imgI.src = "img/" + solucion.sentido + "i.png";
	imgI.className = "marca";
	$(solucion.td[0]).append(imgI);
	for (var i=1; i < solucion.td.length - 1; i++){
		var img = document.createElement("img");
		img.src = "img/" + solucion.sentido + "m.png";
		img.className = "marca";
		//Correcciones
		if (solucion.sentido == "id"){
			img.style.top = "-20px";
			img.style.left = "-20px";
		}
		if (solucion.sentido == "di"){
			img.style.left = "-20px";
			img.style.top = "-20px";
		}
		$(solucion.td[i]).append(img);
	}
	var imgF = document.createElement("img");
	imgF.src = "img/" + solucion.sentido + "f.png";
	imgF.className = "marca";
	$(solucion.td[solucion.td.length - 1]).append(imgF);
	
	//Correcciones
	if (solucion.sentido == "id"){
		imgI.style.left = "-3px";
		imgF.style.top = "-22px";
		imgF.style.left = "-20px";
	}
	if (solucion.sentido == "di"){
		imgI.style.left = "-20px";
		imgF.style.top = "-22px";
		imgF.style.left = "-3px";
	}

}