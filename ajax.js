




$.ajax({

    url: "http://127.0.0.1:8000/tarea/",
    type: "GET",
    success: function(datos){
        
        console.log(datos);
        datos.forEach(function(tarea){
        console.log(tarea.id);
        console.log(tarea.description);

        });
    }
    
});