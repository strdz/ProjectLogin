// <-- Pagina Principal --> //

var isNumeric = function (value) {
    return /^\d+(?:\.\d+)?$/.test(value);
};


function modalDinamico(titulo, conteudo, botao = []) {


    //Abrir Modal
    $("#modalDinamico").modal("show");
    //Preencher o titulo
    $("#modalDinamico_titulo").text(titulo);
    //Prencher o conteudo
    $("#modalDinamico_conteudo").text(conteudo);
    $(".modalDinamico_btn").remove();
    //Preencher com os botões novos
    botao.forEach(function (elemento, index) {
        $("#modalDinamico_botoes").append('<button type="button" class= "modalDinamico_btn btn ' + elemento[2] + '" id = "btn_modalFunction" onclick = "' + elemento[1] + '" > <i class="fa ' + elemento[3] + '"></i> ' + elemento[0] + '</button > ');
    }); 
}

function fecharModalDinamico()
{
    $("#modalDinamico_titulo").text("");
    $("#modalDinamico_conteudo").text("");
    $(".modalDinamico_btn").remove();
    $("#modalDinamico").modal("hide");

    $("#modalDinamico").on('hidden.bs.modal', function (e) {
        if ($(".show").length >= 2 )
        $("body").addClass("modal-open");
    });
}