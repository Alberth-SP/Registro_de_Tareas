
let arreglo = [];
let arreglo_json = [];
//var ideRecup = null;

$(document).ready(function(){

    cargar_tipos();

    $("#agregar").click(function(){ 
        console.log("zzzzzzzzzzzzzzz");
        console.log(ideRecup);
        console.log("zzzzzzzzzzzzzzzzzz");
        
        if( ideRecup == "" ){
            
            post_agregar();
            $("#text_agre").val(" ");
            ideRecup = null;
            localStorage.setItem("mensajeArr", JSON.stringify(arreglo_json));
            
        }
        
        else if ( ideRecup != "" ){

            ides = ideRecup;
            actualizar_tarea(ides);
            refrescar();
             
        
            let indice = arreglo_json.findIndex(p => p.id === ides);
            console.log(arreglo_json);
            if (indice !== -1) {
                arreglo_json[indice] = {
                    id: ides,
                    description: mensajes,
                    fecha_creacion: fechas,
                    prioridad: prioridads,
                    actividad: actividads
                };
            }

        
        
            $("#text_agre").val(" ");
            localStorage.setItem("mensajeArr", JSON.stringify(arreglo_json));
            $("#hidText").val("");
            $("#agregar").text("Agregar Tarea");
            $("#caja" + ides).css("background-color", "#a7e5f1");
            $(".editar").prop("disabled", false);
            $(".eliminar").prop("disabled", false);
            

        }
            
       
    });

   
    arreglo = JSON.parse(localStorage.getItem("mensajeArr")) || [];
    var ideRecup = $("#hidText").val(); //recupero id

    if(ideRecup != ""){
        $("#caja" + ideRecup).css("background-color", "#ffff99");
        $(".editar").prop("disabled", true);
        $(".eliminar").prop("disabled", true);
        $("#agregar").text("Actualizar");
    }
    
   // $(".eliminar").click(function(){  // esto estaba antes
   $("#items").on("click", ".eliminar", function () { // solo modifique esta linea
        
        var ides = $(this).data("id");
        $("#caja" + ides).remove();
        var filtrado = arreglo.filter(a => a.id !== ides);
        arreglo = filtrado;
        localStorage.setItem("mensajeArr", JSON.stringify(arreglo));

    });

    $("#items").on("click", ".editar", function () { 
        
        $("#agregar").text("Actualizar");
        var ides = $(this).data("id");
        
        $("#hidText").val(ides);
        var ideRecup = $("#hidText").val(); //recupero id
        

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

    get_refrescar();
    

});

function refrescar(){
    
    if(arreglo_json != null){
            
            for(i=0; i < arreglo_json.length; i++){
                var men = arreglo_json[i];
                let prioClass = "prioridad_"+ men.prioridad.toLowerCase();
                //let activClass = "actividad_"+ men.foreig_id.toLowerCase();
                $("#items").append(`
                    <div class="caja" id="caja${men.id}">
                        <div class="item" id="text${men.id}">
                                <p class="fech">Creacion: ${men.fecha_creacion}</p>
                                <h4 class="tex">${men.description}</h4> 
                                
                            <div class="cont">
                                <div class="cajita">
                                    <span style="color: black">Tipo de Actividad:</span>
                                    <span class="">${men.tipo.nombre}</span>
                                </div>
                                <div class="cajita">
                                    <span style="color: black">Prioridad:</span>
                                    <span class="prio ${prioClass}">${men.prioridad}</span>
                                </div>
                            </div>

                        </div>
                        <div class="botones">  
                            <button class="eliminar" data-id="${men.id}">Eliminar</button>
                            <button class="editar" data-id="${men.id}">Editar</button>
                        </div>
                    </div>   
                `);
            }
    }
}

function get_refrescar(){
    $.ajax({

    url: "http://127.0.0.1:8000/tarea/",
    type: "GET",
    success: function(datos){
        
        console.log(datos);
        datos.forEach(function(tarea){
            arreglo_json.push(tarea);
        });
        refrescar();
    }
    
});
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
        
            arreglo_json.push(datos);
            console.log(arreglo_json);
            refrescar();
        }

    });
}