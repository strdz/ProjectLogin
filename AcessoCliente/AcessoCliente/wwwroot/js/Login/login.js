function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}


function Logar() {
    var valida = true;

    if ($("#loginUsuario").val() === "") {
        valida = false;
        $("#invalidaLoginUsuario").removeClass("invisivel");
    }
    if ($("#senhaUsuario").val() === "") {
        valida = false;
        $("#invalidaLoginSenha").removeClass("invisivel");
    }
    if (grecaptcha.getResponse(recaptchaLogin) === "") {
        valida = false;
        $("#invalidaLoginCaptcha").removeClass("invisivel");
    }

    if (valida) {
        var data = new FormData();

        data.append("Usuario", $("#loginUsuario").val());
        data.append("Senha", $("#senhaUsuario").val());
        data.append("ValidaCaptcha", grecaptcha.getResponse(recaptchaLogin));

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
                        sessionStorage.setItem("token", obj.token);
                        sessionStorage.setItem("Usuario", obj.user);
                        sessionStorage.setItem("Expira", obj.expira);
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
}

function RegistrarUsuario() {
    var data = new Object();
    if (validaRegistro()) {
        data = {
            Nome: $("#txt_modalUsuarioNomeCompleto").val(),
            Usuario: $("#txt_modalUsuario").val(),
            Email: $("#txt_modalUsuarioEmail").val(),
            Senha: $("#txt_modalSenha").val(),
            Empresa: $("#txt_modalUsuarioEmpresa").val(),
            ValidaCaptcha: grecaptcha.getResponse(recaptchaCadastro)
        };

        $.ajax({
            url: "/Login/Registra",
            type: 'POST',
            datatype: "json",
            data: { usuario: data },
            success: function (obj) {
                if (obj !== "[]") {
                    alert(obj);
                }
            }
        });
    }
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

function validaRegistro() {
    var Nome = $("#txt_modalUsuarioNomeCompleto").val();
    var Empresa = $("#txt_modalUsuarioEmpresa").val();
    var Usuario = $("#txt_modalUsuario").val();
    var Email = $("#txt_modalUsuarioEmail").val();
    var ConfirmaEmail = $("#txt_modalConfirmaUsuarioEmail").val();
    var Senha = $("#txt_modalSenha").val();
    var ConfirmaSenha = $("#txt_modalConfirmaSenha").val();

    var valida = true;

    if (Nome === "") {
        valida = false;
        $("#invalidaNome").removeClass("invisivel");
    }
    if (Empresa === "") {
        valida = false;
        $("#invalidaEmpresa").removeClass("invisivel");
    }
    if (Usuario === "") {
        valida = false;
        $("#invalidaUsuario").removeClass("invisivel");
    }
    if (Email === "" || ConfirmaEmail !== Email || ConfirmaEmail === "") {
        valida = false;
        $("#invalidaEmail").removeClass("invisivel");
    }
    if (Senha === "") {
        valida = false;
        $("#invalidaSenha").removeClass("invisivel");
    }
    if (ConfirmaSenha === "" || ConfirmaSenha !== Senha) {
        valida = false;
        $("#invalidaSenhaConfirma").removeClass("invisivel");
    }
    if (grecaptcha.getResponse(recaptchaCadastro) === "") {
        valida = false;
        $("#invalidaCadastroCaptcha").removeClass("invisivel");
    }

    return valida;
}