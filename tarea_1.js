
let estados = ["Pendiente","En proceso","Finalizado" ];
let arreglo_json = [];
var ideRecup = "";

$(document).ready(function(){

    cargar_tipos();
    ideRecup = $("#hidText").val();
    
    $("#agregar").click(function(){  
        if( ideRecup == "" ){
            post_agregar();
            $("#text_agre").val(" ");
        }
        
        else if ( ideRecup != "" ){

            actualizar_tarea(ideRecup);
            var id = ideRecup;
            $("#text_agre").val(" ");
            $("#hidText").val("");
            $("#agregar").text("Agregar Tarea");
            $("#caja" + id).css("background-color", "#a7e5f1");
            $(".editar").prop("disabled", false);
            $(".eliminar").prop("disabled", false);
            ideRecup = "";
 
        }
        refrescar();
   
    });

    
  
   $("#items").on("click", ".eliminar", function () { // solo modifique esta linea
        
        var ides = $(this).data("id");
        eliminar_tarea(ides);
    });

    $("#items").on("click", ".editar", function () { 
        
        $("#agregar").text("Actualizar");
        var ides = $(this).data("id");
        $("#hidText").val(ides);
        ideRecup = $("#hidText").val(); //recupero id
        
        $("#caja" + ideRecup).css("background-color", "#ffff99");
        for(i=0; i < arreglo_json.length; i++){
            var men = arreglo_json[i];
            if(men.id == ides){
                $("#text_agre").val(men.description);
                $("#prioridad").val(men.prioridad);
                $("#actividad").val(men.tipo.id);

            }          
        }
        $(".editar").prop("disabled", true);
        $(".eliminar").prop("disabled", true);
        
    });

    $("#items").on("click", ".estado", function () { 
        var ides = $(this).data("id");
        for(i=0; i < arreglo_json.length; i++){
            var men = arreglo_json[i];
            if(men.id == ides){
                var estadoActual = men.estado;
            }          
        }
        
        actualizar_estado(ides, estadoActual);
        
    });

    $("#descargar").on("click", function () { 
        var valor = $("#export").val();
        if(valor == "todo"){
            exportarExcel();
        }
        else if(valor == "prioridad_vs_estado"){
            exportarExcelPrioEstado();
        }

    });



    get_refrescar();
    
});

function refrescar(){
    $("#items").empty();
    var cambEstado="";
    if(arreglo_json != null){
            for(i=0; i < arreglo_json.length; i++){
                var men = arreglo_json[i];
                //console.log(men);
                let prioClass = "prioridad_"+ men.prioridad.toLowerCase();
                cambEstado="";
                if(men.estado == "pendiente"){
                    cambEstado = estados[1];
                    
                }
                if(men.estado == "en proceso"){
                    cambEstado = estados[2];
                }
                
                console.log("..................");
                console.log(cambEstado);
                console.log(".................");
                
                $("#items").append(`
                        <div class="caja" id="caja${men.id}">
                            <div class="contenido">
                                <div class="informacion">
                                    <div class="fecha">
                                        <span>Creación</span>
                                        <strong>${men.fecha_creacion}</strong>
                                    </div>
                                    <h4 class="tex">${men.description}</h4>
                                    <div class="datos">
                                        <div class="dato">
                                            <span>Tipo de actividad</span>
                                            <strong>${men.tipo.nombre}</strong>
                                        </div>
                                        <div class="dato">
                                            <span>Prioridad</span>
                                            <strong class="prio ${prioClass}">
                                                ${men.prioridad}
                                            </strong>
                                        </div>
                                        <div class="dato">
                                            <span>Estado</span>
                                            <strong>${men.estado}</strong>
                                        </div>
                                    </div>
                                </div>

                                <div class="acciones">
                                    <button id="${men.id}" class="estado" data-id="${men.id}">Cambiar a ${cambEstado}</button>
                                    <button class="editar" data-id="${men.id}">Editar</button>
                                    <button class="eliminar" data-id="${men.id}">Eliminar</button>
                                </div>
                            </div>
                        </div>
                `);
                if(men.estado == "finalizado"){
                   $("#"+ men.id).hide();
                }
            }
    }
}

function get_refrescar(){
    $.ajax({

        url: "http://127.0.0.1:8000/tarea/",
        type: "GET",
        success: function(datos){
            
            console.log(datos);
            arreglo_json = [];
            datos.forEach(function(tarea){
                arreglo_json.push(tarea);
            });
            refrescar();
            actualizar_per();
        }
    
    });
}   

function actualizar_per(){
    if(ideRecup != ""){
        $("#caja" + ideRecup).css("background-color", "#ffff99");
        $(".editar").prop("disabled", true);
        $(".eliminar").prop("disabled", true);
        $("#agregar").text("Actualizar");
    }
}


function post_agregar(){

    const tarea = {
        description: $("#text_agre").val(),
        foreig_id: Number($("#actividad").val()),
        prioridad: $("#prioridad").val()
    };
  
    $.ajax({

    url: "http://127.0.0.1:8000/tarea/",
    type: "POST",
    data: JSON.stringify(tarea),
    contentType: "application/json",
    success: function(datos){ // Se ejecuta cuando la peticion sea exitosa
        
        arreglo_json.push(datos);
        console.log(arreglo_json);
        refrescar();
    },
    error: function(xhr, status, error) {
        console.error("Error:", error);
        console.error("Status:", xhr.status);
        console.error("Respuesta:", xhr.responseText);
        const detalle = JSON.parse(xhr.responseText);
        alert("Ocurrio un error! "+ detalle.detail);
    }

    });

    
}

function cargar_tipos() {
    $.ajax({
        url: "http://127.0.0.1:8000/tipo/",
        type: "GET",

        success: function(datos) {
            const select = $("#actividad");

            // Limpiar las opciones actuales
            select.empty();

            // Opción inicial
            select.append(
                '<option value="">-- Opciones --</option>'
            );

            // Pintar los datos de la API
            datos.forEach(function(tipo) {
                select.append(
                    `<option value="${tipo.id}">${tipo.nombre}</option>`
                );
            });
        },

        error: function(error) {
            console.log("Error al obtener los tipos:", error);
        }
    });
}

function actualizar_tarea(id){

    const tarea = {
        description: $("#text_agre").val(),
        foreig_id: Number($("#actividad").val()),
        prioridad: $("#prioridad").val()
    };

    $.ajax({
        url: "http://127.0.0.1:8000/tarea/" + id,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(tarea),
        success: function(datos){ // Se ejecuta cuando la peticion sea exitosa
            var idess = datos.id; // datos es el objeto actualizado
        
            let indice = arreglo_json.findIndex(p => p.id === idess);
            console.log(arreglo_json);
            if (indice !== -1) {
                arreglo_json[indice] = datos;
            }
            refrescar();
        }

    });
}
function eliminar_tarea(id){
    $.ajax({
        url: "http://127.0.0.1:8000/tarea/" + id,
        type: "DELETE",
        contentType: "application/json",
        success: function(datos){ // Se ejecuta cuando la peticion sea exitosa
            console.log("Tarea eliminada:", datos);
            let indice = arreglo_json.findIndex(p => p.id === id);
            if (indice !== -1) {
                arreglo_json.splice(indice, 1);
            }
            console.log(arreglo_json);
            refrescar();
            }
    });
}

function actualizar_estado(id, estadoActual){
     let siguienteEstado;
    if (estadoActual === "pendiente") {
        siguienteEstado = "en proceso";
    } else if (estadoActual === "en proceso") {
        siguienteEstado = "finalizado";
    } else if (estadoActual === "finalizado") {
        return; // Ya no hay siguiente estado
    }
    const tarea = {
        estado: siguienteEstado
    };

    $.ajax({
        url: "http://127.0.0.1:8000/tarea/" + id + "/estad",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(tarea),
        success: function(datos){ 
            alert("Cambio de estado exitoso! ");
            get_refrescar();
        },
        error: function(xhr, status, error) {
        console.error("Error:", error);
        console.error("Status:", xhr.status);
        console.error("Respuesta:", xhr.responseText);
        const detalle = JSON.parse(xhr.responseText);
        alert("Ocurrio un error! "+ detalle.detail);
    }
 
    });
}

function exportarExcel(){
    console.log("0000000000000000000");
    $.ajax({
        url: "http://127.0.0.1:8000/tarea/exportar-excel",
        type: "GET",
        xhrFields: {
        responseType: "blob"
        },
        success: function(datos){ 
             // Crear un Blob con el Excel recibido
                const blob = new Blob(
                    [datos],
                    {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    }
                );

                // Crear URL temporal
                const url = window.URL.createObjectURL(blob);

                // Crear enlace para descargar
                const link = document.createElement("a");
                link.href = url;
                link.download = "tareas.xlsx";

                document.body.appendChild(link);
                link.click();

                // Limpiar
                link.remove();
                window.URL.revokeObjectURL(url);

                alert("Exportación exitosa!");
        },
        error: function(xhr, status, error) {
        console.error("Error:", error);
        console.error("Status:", xhr.status);
        console.error("Respuesta:", xhr.responseText);
        const detalle = JSON.parse(xhr.responseText);
        alert("Ocurrio un error! "+ detalle.detail);
        }
    });
}

function exportarExcelPrioEstado(){
    $.ajax({
        url: "http://127.0.0.1:8000/tarea/prioridad-estado",
        type: "GET",
        xhrFields: {
        responseType: "blob"
        },
        success: function(datos){ 
             // Crear un Blob con el Excel recibido
                const blob = new Blob(
                    [datos],
                    {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    }
                );

                // Crear URL temporal
                const url = window.URL.createObjectURL(blob);

                // Crear enlace para descargar
                const link = document.createElement("a");
                link.href = url;
                link.download = "tareas.xlsx";

                document.body.appendChild(link);
                link.click();

                // Limpiar
                link.remove();
                window.URL.revokeObjectURL(url);

                alert("Exportación exitosa!");
        },
        error: function(xhr, status, error) {
        console.error("Error:", error);
        console.error("Status:", xhr.status);
        console.error("Respuesta:", xhr.responseText);
        const detalle = JSON.parse(xhr.responseText);
        alert("Ocurrio un error! "+ detalle.detail);
        }
    });
}