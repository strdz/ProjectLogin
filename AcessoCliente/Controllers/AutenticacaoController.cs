using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AcessoCliente.Models;

namespace AcessoCliente.Controllers
{
    public class AutenticacaoController : Controller
    {
        public IActionResult UsuarioNaoAutenticado(string mensagem)
        {
            if (mensagem != "")
            ViewData["Retorno"] = mensagem;
            return View();
        }

    }
}
