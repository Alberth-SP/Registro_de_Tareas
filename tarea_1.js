
let arreglo = [];
//var ideRecup = null;


$(document).ready(function(){

    $("#agregar").click(function(){ 
        var  ideRecup = $("#hidText").val();
        console.log("uuuuuuuuuuuuu");
        console.log(ideRecup);
        console.log("uuuuuuuuuuuu");
        let mensaje = $("#text_agre").val();
        if( ideRecup == "" ){
            const ide = crypto.randomUUID();
            const tarea1 = {'id':ide, 'texto':mensaje};
            arreglo.push(tarea1);
            $("#items").append(`
                    <div class="caja" id="caja${ide || 0}">
                        <div class="item" id="text${ide || 0}">
                        ${tarea1.texto}
                        </div>  
                        <button class="eliminar" data-id="${ide || 0}" data-post="${mensaje}">Eliminar</button>
                        <button class="editar" data-id="${ide}">Editar</button>
                    </div>
                    `);
            $("#text_agre").val(" ");
            ideRecup = null;
            localStorage.setItem("mensajeArr", JSON.stringify(arreglo));
            
        }
        else if ( ideRecup != "" ){
            console.log("ideRecup");
            console.log(ideRecup);
            ides = ideRecup; 
            mensajes = $("#text_agre").val();
            $("#text"+ides).text(mensajes);

            let indice = arreglo.findIndex(p => p.id === ides);
            if (indice !== -1) {
                arreglo[indice] = {
                    id: ides,
                    texto: mensajes
                };
            }
            $("#text_agre").val(" ");
            localStorage.setItem("mensajeArr", JSON.stringify(arreglo));
            console.log(mensajes);
            //ideRecup = null;
            $("#hidText").val("");
            
            $("#agregar").text("Agregar Tarea");
            $("#caja" + ides).css("background-color", "#a7e5f1");
            $(".editar").prop("disabled", false);
            $(".eliminar").prop("disabled", false);
        }
       
    });

    arreglo = JSON.parse(localStorage.getItem("mensajeArr")) || [];
    
    if(arreglo != null){
            for(i=0; i < arreglo.length; i++){
                var men = arreglo[i];
                $("#items").append(`
                    <div class="caja" id="caja${men.id}">
                    <div class="item" id="text${men.id}">
                        ${men.texto}
                    </div>  <button class="eliminar" data-id="${men.id}">Eliminar</button>
                            <button class="editar" data-id="${men.id}">Editar</button>
                    </div>
                `);
            }
    }

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
            }          
        }
        $(".editar").prop("disabled", true);
        $(".eliminar").prop("disabled", true);
        
    });

});



