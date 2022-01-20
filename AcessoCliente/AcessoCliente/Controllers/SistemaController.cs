using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AcessoCliente.Controllers
{
    public class SistemaController : Controller
    {
        public IActionResult Chamado()
        {
            return View();
        }
    }
}
