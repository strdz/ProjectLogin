function Logar() {

    var data = new FormData();

    data.append("Usuario", $("#loginUsuario").val());
    data.append("Senha", $("#senhaUsuario").val());
    data.append("ValidaCaptcha", grecaptcha.getResponse());

    $.ajax({
        url: "/Login/Login",
        type: 'POST',
        async: false,
        contentType: false,
        processData: false,
        data: data,
        success: function (obj) {
            if (obj !== "[]") {
                if (obj.redirectToUrl !== undefined) {
                    window.location.href = obj.redirectToUrl;
                } else if (obj.error) {
                    alert("Usuario ou senha Incorreta.");
                } else {
                    sessionStorage.setItem("token", obj.token);
                    sessionStorage.setItem("Usuario", obj.user);
                    sessionStorage.setItem("Expira", obj.expira);
                    alert("Usuário logado com sucesso.");
                }
            }
        }
    });
}

function ValidaToken() {
    $("#exibirDados").click(function () {
        var options = {};
        options.url = "/api/values";
        options.type = "GET";
        options.beforeSend = function (request) {
            request.setRequestHeader("Authorization",
                "Bearer " + sessionStorage.getItem("token"));
        };
        options.dataType = "json";
        options.success = function (data) {
            var table = "<table border='1' cellpadding='10'>";
            data.forEach(function (element) {
                var row = "<tr>";
                row += "<td>";
                row += element.alunoId;
                row += "</td>";
                row += "<td>";
                row += element.nome;
                row += "</td>";
                row += "</tr>";
                table += row;
            });
            table += "</table>";
            $("#response").append(table);
        };
        options.error = function (a, b, c) {
            $("#response").html("<h1>Erro a chamar a Web API!(" + b + " - " + c + ")</h1>");
        };
        $.ajax(options);
    });
}

$("#logout").click(function () {
    sessionStorage.removeItem("token");
    $("#response").html("<h2>Usuário realizou o logout com sucesso.</h2 >");
});