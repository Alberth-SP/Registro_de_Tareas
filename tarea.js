
let arreglo = [];

$(document).ready(function(){

    $("#agregar").click(function(){    
        let mensaje = $("#text_agre").val();
        //console.log(mensaje);
        $("#items").append(`
            <div class="caja" id="caja${arreglo.length || 0}">
                <div class="item">
                ${mensaje}
                </div>  
                <button class="eliminar" data-id="${arreglo.length || 0}" data-post="${mensaje}">Eliminar</button>
                <button class="editar" id="editar">Editar</button>
            </div>
        `);
        $("#text_agre").val(" ");
        arreglo.push(mensaje);
        //console.log(arreglo);
        localStorage.setItem("mensajeArr", JSON.stringify(arreglo));
        
    });
    

    arreglo = JSON.parse(localStorage.getItem("mensajeArr")) || [];
    console.log("22222222222222222");
    if(arreglo != null){
            for(i=0; i < arreglo.length; i++){
                var men = arreglo[i];
                $("#items").append(`
                <div class="caja" id="caja${i}">
                <div class="item">
                    ${men}
                </div>  <button class="eliminar" data-id="${i}" data-post="${men}">Eliminar</button>
                        <button class="editar" id="editar">Editar</button>
                </div>
                    `);
            }
    }
    


   // $(".eliminar").click(function(){  // esto estaba antes
   $("#items").on("click", ".eliminar", function () { // solo modifique esta linea
        console.log("777777777777777777777");
        var ide = $(this).data("id");
        var mensaCont = $(this).data("post");
        $("#caja" + ide).remove();

        arreglo.forEach(x => console.log(typeof x));
        var filtrado = arreglo.filter(a => a !== mensaCont);
        console.log(mensaCont);
        arreglo = filtrado;
        localStorage.setItem("mensajeArr", JSON.stringify(arreglo));
        console.log("11111111111");
        console.log(filtrado);
        console.log(typeof mensaCont);
        console.log("11111111111");
        //console.log($(this).data("id"));
    });



});



