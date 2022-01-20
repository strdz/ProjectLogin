using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AcessoCliente.Controllers
{
    public class ClienteController : Controller
    {
        public IActionResult Dashboard()
        {
            var teste = Request.Cookies["token"];
            var usuario = Request.Cookies["usuario"];
            ViewData["Usuario"] = usuario;
            return View();
        }
    }
}
