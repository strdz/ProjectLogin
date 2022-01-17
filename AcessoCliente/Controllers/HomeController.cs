﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AcessoCliente.Models;

namespace AcessoCliente.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index(string mensagem)
        {
            if(mensagem != "")
            ViewData["Retorno"] = mensagem;
            return View();
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
