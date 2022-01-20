function TabelaDinamica(tabela) {



    var colunas = (tabela["colunas"] ? tabela["colunas"] : []);
    var exibirFiltros = (tabela["exibirFiltros"] !== undefined ? tabela["exibirFiltros"] : true) ;
    var dados = (tabela["dados"] ? tabela["dados"] : []);
    var colunaEstiloLinhas = (tabela["colunaEstiloLinhas"] ? tabela["colunaEstiloLinhas"] : "");
    var navegacao = (tabela["navegacao"] !== undefined  ? tabela["navegacao"] : true);
    var legendas = (tabela["legendas"] ? tabela["legendas"] : []);
    var botoes = (tabela["botoes"]? tabela["botoes"] : []) ;
    var quantidadeLinhas = (tabela["quantidadeLinhas"] ? tabela["quantidadeLinhas"]: 1500) ;
    var elemento = (tabela["elemento"] ? tabela["elemento"] : "") ;
    var funcaoCliqueLinha = (tabela["funcaoCliqueLinha"] ? tabela["funcaoCliqueLinha"]: "selecionarItem(this);" );
    var posicaoInicialLinha = 0;

    var dadosfiltrados;
    var colunaFiltrada = "";

    this.Iniciar = function () {
        /*   Dados a serem recebidos:
               |-> Elemento (String): Propriedade 'id' do elemento HTML que ira comportar a tabela.
               |-> Colunas (Array): Array contendo:
               |    |-> Nome (String) : Nome do campo, geralmente do banco de dados que identifica a coluna e seus filhos.
               |    |-> Título das colunas (String): Nome que representará a coluna de forma visível.
               |    |-> Filtro (String) : Tipo de filtro que será utilizado para localizar e filtrar os dados das colunas.
               |    |       |-> Tipos Disponíveis (Select, Mult-Select, Data e Text)
               |    |-> Tipo de coluna (String) : Define o tipo de a forma de dados que será apresentado nas linhas.
               |    |       |-> Tipos Disponíveis (Text e button).
               |    |-> Tamanho (String): Recebe uma ou mais classes separadas por " " (espaço)  no padrão bootstrap para definir o espaço a ser utilizado pela coluna (Padrão col).
               |-> Dados (Array): Dados para o preenchimento das linhas. Os nomes de referencia devem ser iguais aos titulos das respectivas Colunas.
               |-> Coluna Estilo Linhas (String): O nome da coluna que contem o nome da classe a ser aplicada a linha.
               |-> Navegacao (Boolean): Indica se a tabela terá os botões de navegação.
               |-> Quantidade Linhas (Integer): Indica a quantidade de linhas exibidas por vez.
               |-> Legendas (Array): Array contendo:
               |    |-> Nome (String) : Nome que será exibido ao lado da cor na legenda.
               |    |-> Classe (String): Classe que definirá a cor da legenda.
               |-> Botões (Array): Array contendo:
               |    |-> Nome (String) : Nome que será exibido no botão.
               |    |-> Icone (String) : Icone que será exibido junto ao nome no botão.
               |    |-> Classe (String): Classe que definirá o estilo do botão.
               |    |-> Ação (String): Função que o botão irá chamar ao ser acionado.
               |    |-> Title (String): Título que será exibido ao passar o mouse no botão.
               |    |-> Id (String): propriedade id do botão.
               |-> Exibir Filtros (Boolean) : Informa se a linha com filtros deverá ser exibida ou não. 
            
        */
        $("#" + elemento).addClass("lista_overflow");
        this.Limpar(elemento);

        if (elemento !== "" && colunas !== []) {

            var cabecalho = '<div class="cabecalho_lista "><ul class="container_cabecalho">';
            var conteudo = '<div class=" conteudo_lista">';

            colunas.forEach(function (coluna, indice) {
                var nome = coluna[0].replaceAll(' ', '_');
                var titulo = coluna[1].toString();
                var filtro = coluna[2].toString().length > 0 ? coluna[2].toUpperCase() : "";
                var tipoFiltro = "";
      
                var tamanho = coluna[3].toString().length > 0 ? coluna[3].toLowerCase() : " col ";
                


                switch (filtro) {

                    case "SELECT":
                        tipoFiltro = "select";
                        break;
                    case "MULT-SELECT":
                        tipoFiltro = "mult-select";
                        break;
                    case "DATA":
                        tipoFiltro = "date";
                        break;
                    case "TEXT":
                        tipoFiltro = "text";
                        break;                    
                    case "NUMERO":
                        tipoFiltro = "number";
                        break;
                    case "BUTTON":
                        tipoFiltro = "btn";
                        break;

                }

                cabecalho += '<li id="' + nome + '" class=" tbd_filter ' + tamanho + '">';
                cabecalho += '<label for="' + tipoFiltro + '_' + nome + '"> ' + (titulo === "" ? nome : titulo) + ' <i class="fa fa-sort"></i></label>';

               
                switch (tipoFiltro) {


                        case "select":
                        cabecalho += '<select id="' + tipoFiltro + '_' + nome + '" class="form-control' + (exibirFiltros ? '' : ' invisible ' )  + '">';
                            cabecalho += '<option value="0" selected>Selecione...</option>';
                            cabecalho += BuscarOpcoes(nome, dados);
                            cabecalho += '</select>';
                            break;
                        case "mult-select":
                        cabecalho += '<select id="' + tipoFiltro + '_' + nome + '" class="form-control mult ' + (exibirFiltros ? '' : ' invisible ') + '" multiple="multiple">';
                            cabecalho += BuscarOpcoes(nome, dados);
                            cabecalho += '</select>';
                            break;
                    case "date":
                    case "number":
                        cabecalho += '<input type="text" class="form-control' + (exibirFiltros ? '' : ' invisible ') + '"  id="' + tipoFiltro + '_' + nome + '">';
                            break;
                        case "text":
                        cabecalho += '<input type="' + tipoFiltro + '" class="form-control' + (exibirFiltros ? '' : ' invisible ') + '"  id="' + tipoFiltro + '_' + nome + '">';
                            break;
                        case "btn":
                        cabecalho += '<input type="' + tipoFiltro + '" class="form-control' + (exibirFiltros ? '' : ' invisible ') + '"  id="' +  tipoFiltro + '_' + nome + '" disabled>';
                            break;

                }

                cabecalho += '</li>';

            });

            cabecalho += '</ul></div>';

            dados.forEach(function (linha, indiceLinha) {

                if (indiceLinha < posicaoInicialLinha || indiceLinha >= quantidadeLinhas + posicaoInicialLinha) {
                    return false;
                }

                conteudo += '<div class=" item ' + (colunaEstiloLinhas === "" || colunaEstiloLinhas === undefined ? "" : linha[colunaEstiloLinhas]) + '" onclick="' + funcaoCliqueLinha +'" id="' + linha.$id+'"><ul>';

                colunas.forEach(function (coluna, indice) {
                    var nome = coluna[0].replaceAll(' ', '_');
                    var tamanho = coluna[3].toString().length > 0 ? coluna[3].toLowerCase() : " col ";
                    var filtro = coluna[2].toString().length > 0 ? coluna[2].toUpperCase() : "";
                    var funcao = coluna[4] === undefined ? "" : coluna[4].toString().length > 0 ? coluna[4].toString() : "";
                    var parametro = coluna[5] === undefined ? "" : coluna[5].toString().length > 0 ? coluna[5].toString() : "";


                    if (filtro === "BUTTON") {
                        conteudo += '<li class="' + tamanho + '"> <button type="button" class="btn btn-primary" onclick="' + (funcao === "" ? "" : funcao + "(" + (linha[parametro] === null ? " - " : linha[parametro]) + ");") + '">' + (linha[nome] === null ? " - " : linha[nome]) + '</button> </li>';
                    } else {
                        conteudo += '<li class="' + tamanho + '">' + (linha[nome] === null ? " - " : linha[nome]) + '</li>';
                    }

              

                });
                conteudo += '</ul></div>';

            });

            conteudo += '</div>';

            $("#" + elemento).append(cabecalho + conteudo);
            dadosfiltrados = dados;

            if (navegacao || (legendas !== [] && legendas !== null) || (botoes !== [] && botoes !== null)) {

                var rodape = '<div class="card-footer"><nav class="navbar_bottom"> </nav> </div> ';
                var estruturaNavegacao = '<div class="" style="margin-right: 1em;"><button type="button" title="Registros anteriores" class="btn bg-navy-blue btn_navegacao_voltar"  onclick=""><i class="fa fa-arrow-left"></i></button> ';
                estruturaNavegacao += ' <button type="button" title="Próximos registros" class="btn bg-navy-blue btn_navegacao_avancar" onclick=""><i class="fa fa-arrow-right"></i></button>   ';
                estruturaNavegacao += ' <button  type="button" title="Itens localizados" class="btn bg-navy-blue btn_itens_localizados" ><i class="fa fa-tags"></i> ' + dados.length + '</button> </div> ';

                //Adiciona o rodapé caso não tenha
                if ($("#" + elemento).parent().children().hasClass("card-footer") ) {

                    $("#" + elemento).parent().children(".card-footer").remove();
                }
                $("#" + elemento).parent().append(rodape);

                if (navegacao) {
                    $("#" + elemento).parent().children(".card-footer").children(".navbar_bottom").append(estruturaNavegacao);
                }

                if (legendas !== [] && legendas !== null) {
                    var estruturaLegenda = ' <div class="">  <div class="alinhamento-legenda"> ';

                    legendas.forEach(function (item, indice) {

                        estruturaLegenda += ' <div class="item_legenda"><div class="' + item[1] + '"></div> <span>' + item[0] + '</span></div> ';
                    });

                    estruturaLegenda += ' </div> </div> ';

                    $("#" + elemento).parent().children(".card-footer").children(".navbar_bottom").append(estruturaLegenda);
                }

                if (botoes !== [] && botoes !== null) {

                    var estruturabotoes = ' <div class="footer_buttons"> ';

                              

                    botoes.forEach(function (item, indice) {
                        if (!item[6]) {
                            estruturabotoes += ' <button type="button"  id="' + item[5] + '" title="' + item[4] + '" class="btn ' + item[2] + '" onclick="' + item[3] + '"><i class="fa ' + item[1] + '"></i> ' + item[0] + '</button> ';
                        } else {
                            estruturabotoes += ' <div class="btn-group ' + (!item[7] ? 'dropup' : item[7]) + '">';
                            estruturabotoes += ' <button type="button"  id="' + item[5] + '" title="' + item[4] + '" class="btn dropdown-toggle ' + item[2] + '" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onclick="' + item[3] + '"><i class="fa ' + item[1] + '"></i> ' + item[0] + '</button>  <div class="' + item[2] +' dropdown-menu">';

                            item[6].forEach(function (subItem, indice) {
                                estruturabotoes += ' <button type="button" id="' + subItem[5] + '" title="' + subItem[4] + '" class="dropdown-item ' + subItem[2] + '" onclick="' + subItem[3] + '"><i class="fa ' + subItem[1] + '"></i> ' + subItem[0] + '</button> ';
        
                            });

                            estruturabotoes += '  </div></div>';
                        }
                    });


                    estruturabotoes += ' </div>';

                    $("#" + elemento).parent().children(".card-footer").children(".navbar_bottom").append(estruturabotoes);
                }


            }


        } else {
            Console.log("Erro: Dados em formato diferentes do esperado! (ER001).");

           
        }
    },

        $(document).ready(function () {
            $("li.tbd_filter label").on("click", function () {

                if (elemento === this.parentElement.parentElement.parentElement.parentElement.id) {

                    if (colunaFiltrada === this.parentElement.id) {
                        Atualizar(elemento, colunas, dadosfiltrados.reverse(), colunaEstiloLinhas, quantidadeLinhas, 0,funcaoCliqueLinha);
                        colunaFiltrada = "";
                    }
                    else {
                        dadosfiltrados = Ordenar(this.parentElement.id, dadosfiltrados, $(this).parent().children()[1].id);
                        Atualizar(elemento, colunas, dadosfiltrados, colunaEstiloLinhas, quantidadeLinhas, 0, funcaoCliqueLinha);
                        colunaFiltrada = this.parentElement.id;
                    }

                }

            });

            $("button.btn_navegacao_avancar ").on("click", function () {

                if (elemento === $(this).parent().parent().parent().parent().children("#" + elemento).prop('id')) {

                    if (posicaoInicialLinha > dadosfiltrados.length - quantidadeLinhas) {
                        modalDinamico("Ops!", "Estas já são as últimas linhas.", [["Ok", "fecharModalDinamico()", "btn-success", "fa-check"]]);
                      
                    } else {
                        posicaoInicialLinha = posicaoInicialLinha + quantidadeLinhas;
                        Atualizar(elemento, colunas, dadosfiltrados, colunaEstiloLinhas, quantidadeLinhas, posicaoInicialLinha, funcaoCliqueLinha);
                    }

                  

                }

            });


            $("button.btn_navegacao_voltar ").on("click", function () {

                if (elemento === $(this).parent().parent().parent().parent().children("#" + elemento).prop('id')) {


                    if (posicaoInicialLinha < quantidadeLinhas) {
                     
                        modalDinamico("Ops!", "Estas já são as primeiras linhas.", [["Ok", "fecharModalDinamico()", "btn-success", "fa-check"]]);
                    } else {
                        posicaoInicialLinha = posicaoInicialLinha - quantidadeLinhas;
                        Atualizar(elemento, colunas, dadosfiltrados, colunaEstiloLinhas, quantidadeLinhas, posicaoInicialLinha, funcaoCliqueLinha);
                    }
                  

                   

                }

            });


          
            //$("li.tbd_filter span div.btn-group button").on("focusout", function () {
            //    //if (this.hasAttribute("aria-expanded") && this.getAttribute("aria-expanded") === "false") {
            //    alert(this.getAttribute("aria-expanded"));
            //    //   };
            //});

           
            $(" li.tbd_filter select[multiple=multiple]").multiselect({
                onChange: function (option, checked, select) {
                 //   filtrar(this, elemento);
                }
            });

            $("li.tbd_filter input, li.tbd_filter select").on("change", function () {

                dadosfiltrados = Filtrar(this, elemento, dados);
                posicaoInicialLinha = 0;
                Atualizar(elemento, colunas, dadosfiltrados, colunaEstiloLinhas, quantidadeLinhas, posicaoInicialLinha, funcaoCliqueLinha);
                colunaFiltrada === "" ? "" : Ordenar();
              

            });


        });

    this.Limpar = function () {
        /*   Dados a serem recebidos:
                 |-> Elemento (String): Propriedade 'id' do elemento HTML que ira comporta a tabela.
        */

        if (elemento !== "") {
            $("#" + elemento).children().remove();
        } else {
            Console.log("Erro: elemento foi encontrado ou não existe! (ER002).");
        }


    },

        this.ExportarCsv = function () {

        tituloArquivo = "Resultados_Busca";
        var quebraLinha = "\n";
        var separador = ";";
        var conteudo = "";

            // Percorrer o array de colunas
        colunas.forEach(function (coluna, indice) {
                conteudo += coluna[1] + separador;
            });
            conteudo += quebraLinha;

                //Percorrer o array de dados 
        dadosfiltrados.forEach(function (dado, indice) {
            colunas.forEach(function (coluna, indice) {
                conteudo += (dado[coluna[0]] === null ? "" : dado[coluna[0]]) + separador;
                });
                conteudo += quebraLinha;
            });


        Exportar(conteudo, tituloArquivo);

        }

}

function BuscarOpcoes(coluna = "", dados = []) {
    /*   Dados a serem recebidos:
             |-> Nome (String) : Nome do campo, geralmente do banco de dados que identifica a coluna e seus filhos.
             |-> Dados (Array): Dados para o preenchimento das linhas. Os nomes de referencia devem ser iguais aos titulos das respectivas Colunas.
    */
    var retorno = "";

    let unique = [...new Set(dados.map(item => item[coluna]))];

    unique.forEach(function (item, index) {
        if (item !== null) {
            retorno += '<option value="' + item + '" > <i class="fa fa-check"></i>' + item + '</option>';
        }
        

    });

    return retorno;
};

//function Ordenar (coluna  = "", dados = []) {
//    /*   Dados a serem recebidos:
//            |-> Elemento (String): Propriedade 'id' do elemento HTML que comporta a tabela.
//            |-> Coluna (String): Nome / Título da coluna que está realizando a ordenação.
//            |-> Tipo de ordenação (String): Qual a ordem que deverá ser aplicada a coluna selecionada
//            |       |-> Tipos Disponíveis (ASC e DESC). 
//            |       |       |-> ASC : Menor ao maior.
//            |       |       |-> DESC : Maior ao menor.
//    */

//    var retorno = dados.sort(function (itemA, itemB) {

//        return (itemA[coluna] === null ? '' : itemA[coluna].toString().toUpperCase()) < (itemB[coluna] === null ? '' : itemB[coluna].toString().toUpperCase()) ? -1 : (itemA[coluna] === null ? '' : itemA[coluna].toString().toUpperCase()) > (itemB[coluna] === null ? '' : itemB[coluna].toString().toUpperCase()) ? 1 : 0;
//    });

//    return retorno;

//}


function Ordenar(coluna = "", dados = [], idElemento = "") {
    /*   Dados a serem recebidos:
            |-> Elemento (String): Propriedade 'id' do elemento HTML que comporta a tabela.
            |-> Coluna (String): Nome / Título da coluna que está realizando a ordenação.
            |-> Tipo de ordenação (String): Qual a ordem que deverá ser aplicada a coluna selecionada
            |       |-> Tipos Disponíveis (ASC e DESC). 
            |       |       |-> ASC : Menor ao maior.
            |       |       |-> DESC : Maior ao menor.
    */

   

    if (idElemento !== "") {
        var id_elemento = idElemento.substring(0, idElemento.indexOf('_'));
    } 

    var retorno = dados.sort(function (itemA, itemB) {

       
        if (id_elemento === "date" && id_elemento !== undefined) {

            var dadoA = (itemA[coluna] === null ? '' : itemA[coluna].toString().toUpperCase());
            var dadoB = (itemB[coluna] === null ? '' : itemB[coluna].toString().toUpperCase());

            if (dadoA !== "" && dadoB !== "") {


                dadoA = trocarformatoData(dadoA);
                dadoB = trocarformatoData(dadoB);


                var dataA = dadoA.replace('/', '').replace('/', '');
                var dataB = dadoB.replace('/', '').replace('/', '');

                return dataA - dataB;
            }
        } else if (id_elemento === "number" && id_elemento !== undefined) {
            return (itemA[coluna] === null ? 0 : parseFloat(itemA[coluna])) < (itemB[coluna] === null ? 0 : parseFloat(itemB[coluna])) ? -1 : (itemA[coluna] === null ? 0 : parseFloat(itemA[coluna])) > (itemB[coluna] === null ? 0 : parseFloat(itemB[coluna])) ? 1 : 0;
        }

       
        return (itemA[coluna] === null ? '' : itemA[coluna].toString().toUpperCase()) < (itemB[coluna] === null ? '' : itemB[coluna].toString().toUpperCase()) ? -1 : (itemA[coluna] === null ? '' : itemA[coluna].toString().toUpperCase()) > (itemB[coluna] === null ? '' : itemB[coluna].toString().toUpperCase()) ? 1 : 0;
      

    });

    return retorno;

}

function trocarformatoData(dado) {

    var indexDia;
    var indexMes;
    var indexAno;

    var ano;
    var dia;
    var mes;
    var data;

    indexDia = dado.indexOf('/', 1);
    indexAno = dado.indexOf('/', 3);
    indexMes = dado.indexOf('/', 1);

  
    dia = dado.substring(indexDia, - 2);
    mes = dado.substring(indexDia, 6);
    ano = dado.substring(indexAno + 1);

    dado = "";

    data = dado.concat(ano).concat(mes).concat(dia);

    return data; 
   
}

function Atualizar(elemento = "", colunas = [], dados = [], colunaEstiloLinhas = "", quantidadeLinhas = 0, posicaoInicialLinha = 0, funcaoCliqueLinha = "") {
    /*   Dados a serem recebidos:
             |-> Elemento (String): Propriedade 'id' do elemento HTML que ira comporta a tabela.
             |-> Dados (Array): Dados para o preenchimento das linhas. Os nomes de referencia devem ser iguais aos titulos das respectivas Colunas.
    */
    var conteudo = "";

    $("#" + elemento + " div.conteudo_lista").children().remove();
    $("#" + elemento).parent().children("div.card-footer").children().children().children("button.btn_itens_localizados").text("");
    $("#" + elemento).parent().children("div.card-footer").children().children().children("button.btn_itens_localizados").append('<i class="fa fa-tags"></i> ' + dados.length);
    dados.forEach(function (linha, indiceLinha) {

        if (indiceLinha < posicaoInicialLinha || indiceLinha >= quantidadeLinhas + posicaoInicialLinha) {
            return false;
        }
        conteudo += '<div class=" item ' + (colunaEstiloLinhas === "" || colunaEstiloLinhas === undefined ? "" : linha[colunaEstiloLinhas]) + '" onclick="' + funcaoCliqueLinha +'" id="' + linha.$id + '" ><ul>';

        colunas.forEach(function (coluna, indice) {
            var nome = coluna[0].replaceAll(' ', '_');
            var tamanho = coluna[3].toString().length > 0 ? coluna[3].toLowerCase() : " col ";
            var filtro = coluna[2].toString().length > 0 ? coluna[2].toUpperCase() : "";
            var funcao = coluna[4] === undefined ? "" : coluna[4].toString().length > 0 ? coluna[4].toString() : "";
            var parametro = coluna[5] === undefined ? "" : coluna[5].toString().length > 0 ? coluna[5].toString() : "";

            if (filtro === "BUTTON") {
                conteudo += '<li class="' + tamanho + '"> <button type="button" class="btn btn-primary" onclick="' + (funcao === "" ? "" : funcao + "(" + (linha[parametro] === null ? " - " : linha[parametro]) + ");") + '">' + (linha[nome] === null ? " - " : linha[nome]) + '</button> </li>';
            } else {
                conteudo += '<li class="' + tamanho + '">' + (linha[nome] === null ? " - " : linha[nome]) + '</li>';
            }

        });
        conteudo += '</ul></div>';
    });
    $("#" + elemento + " div.conteudo_lista").append(conteudo);
};

function Filtrar(elemento, grid = "", dados = []) {

    if (grid === elemento.parentElement.parentElement.parentElement.parentElement.id || grid === elemento.parentElement.parentElement.parentElement.parentElement.parentElement.id) {
        var dadosfiltrados = dados;
        var coluna = "";

        $("#" + grid + " div.cabecalho_lista .tbd_filter select ," + "#" + grid + " div.cabecalho_lista  li.tbd_filter input[type='text'] , " + "#" + grid + " div.cabecalho_lista  li.tbd_filter input[type='date']").each(function (index, item) {
            coluna = $(item).attr('id').substr($(item).attr('id').indexOf('_') + 1, $(item).attr('id').length);

            switch (item.type) {
                case "select-one":
                    if (item.value !== "0") {

                        dadosfiltrados = dadosfiltrados.filter(dado => dado[coluna] === $(item).val());

                    }
                    break;
                case "text":
                    if (item.value !== "") {

                        dadosfiltrados = dadosfiltrados.filter(dado => (dado[coluna] === null ? ' - ' : dado[coluna].toString().toUpperCase().indexOf($(item).val().toUpperCase())) >= 0);
                    }
                    break;
                case "select-multiple":
                    if ($(item).val().length > 0) {

                        var dadosfiltradosAux =[];
                        $(item).val().forEach(function (valor, index) {
                            dadosfiltradosAux = dadosfiltradosAux.concat(dadosfiltrados.filter(dado => (dado[coluna] === null ?  ' - ' : dado[coluna].toString()) === (valor === null? ' - ' : valor.toString())));
                        });
                        
                        dadosfiltrados = dadosfiltradosAux;
                    }
            }

           
        });

        return dadosfiltrados;

    }

}


function Exportar(conteudo, nomeArquivo) {
    var contentType = "text/csv;charset=UTF-8";
    if (!contentType) contentType = 'application/octet-stream';
    var linkDocumento = document.createElement('a');
    var blob = new Blob(["\ufeff" + conteudo], { 'type': contentType });
    linkDocumento.href = window.URL.createObjectURL(blob);
    linkDocumento.download =   nomeArquivo ;
    linkDocumento.click();
}

