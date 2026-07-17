
let arreglo = [];
//var ideRecup = null;


$(document).ready(function(){

    $("#agregar").click(function(){ 

        var  ideRecup = $("#hidText").val();
        var prioridad = $("#prioridad").val();
        let mensaje = $("#text_agre").val();
        let prioClass = "prioridad_"+ prioridad.toLowerCase();

        if( ideRecup == "" ){
            console.log("1111111111111111111111");
            const ide = crypto.randomUUID();
            const tarea1 = {'id':ide, 'texto':mensaje, 'fecha':new Date().toLocaleString(), 'prioridad':prioridad};
            arreglo.push(tarea1);
            $("#items").append(`
                    <div class="caja" id="caja${ide || 0}">
                        <div class="item" id="text${ide || 0}">
                            <p class="fech">Creacion: ${tarea1.fecha}</p>
                            <h4 class="tex">${tarea1.texto}</h4>
                            <h4 class="prio ${prioClass}">${tarea1.prioridad}</h4>
                        </div>  
                        <div class="botones">
                            <button class="eliminar" data-id="${ide || 0}" data-post="${mensaje}">Eliminar</button>
                            <button class="editar" data-id="${ide}">Editar</button>
                        </div>
                    </div>
                
                    `);
            $("#text_agre").val(" ");
            ideRecup = null;
            localStorage.setItem("mensajeArr", JSON.stringify(arreglo));
            
        }
        else if ( ideRecup != "" ){
            console.log("222222222222222222222");
            console.log("ideRecup");
            console.log(ideRecup);
            ides = ideRecup; 
            prioridads = $("#prioridad").val();
            mensajes = $("#text_agre").val();
            fechas = new Date().toLocaleString();
            console.log(prioridads);
            console.log(mensajes);
            console.log(fechas);
            //$("#text"+ides).text(mensajes);
            $("#text"+ides+" .fech").text("Creacion: "+ fechas);
            $("#text"+ides+" .tex").text(mensajes);
            $("#text"+ides+" .prio").text(prioridads);


            let indice = arreglo.findIndex(p => p.id === ides);
            console.log(arreglo);
            if (indice !== -1) {
                arreglo[indice] = {
                    id: ides,
                    texto: mensajes,
                    fecha: fechas,
                    prioridad: prioridads
                };
            }
        
            $("#text_agre").val(" ");
            localStorage.setItem("mensajeArr", JSON.stringify(arreglo));
            //console.log(mensajes);
            //ideRecup = null;
            //refrescar();
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
        for(i=0; i < arreglo.length; i++){
            var men = arreglo[i];
            if(men.id == ides){
                $("#text_agre").val(men.texto);
                $("#prioridad").val(men.prioridad);

            }          
        }
        $(".editar").prop("disabled", true);
        $(".eliminar").prop("disabled", true);
        
    });

    refrescar();
    

});

function refrescar(){
    
    if(arreglo != null){
            for(i=0; i < arreglo.length; i++){
                var men = arreglo[i];
                let prioClass = "prioridad_"+ men.prioridad.toLowerCase();
                $("#items").append(`
                    <div class="caja" id="caja${men.id}">
                        <div class="item" id="text${men.id}">
                                <p class="fech">Creacion: ${men.fecha}</p>
                                <h4 class="tex">${men.texto}</h4> 
                                <h4 class="prio ${prioClass}">${men.prioridad}</h4>   
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



