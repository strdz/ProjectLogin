using AcessoCliente.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Net;
using System.Net.Http;
using Newtonsoft.Json.Linq;

namespace AcessoCliente.Controllers
{
    public class LoginController : Controller
    {
        private readonly IConfiguration _config;

        public LoginController(IConfiguration configuration)
        {
            _config = configuration;
        }

        [HttpPost]
        public async Task<ActionResult<dynamic>> Login(UsuarioModel loginDetails)
        {
            if (await ValidaCaptcha(loginDetails))
            {
                loginDetails.Senha = HashSenha(loginDetails.Senha);
                // Recupera o usuário no banco
                var user = loginDetails.post_Login(loginDetails);

                // Verifica se o usuário existe
                if (user == null)
                {
                    return new
                    {
                        error = true
                    };
                }
                else
                {
                    var usuario = Newtonsoft.Json.JsonConvert.DeserializeObject(user);
                    // Gera o Token
                    var token = GerarTokenJwt(loginDetails);

                    // Oculta a senha
                    loginDetails.Senha = "";

                    if (token != "")
                    {
                        return new
                        {
                            user = loginDetails.Usuario,
                            token = token,
                            expira = DateTime.Now.AddMinutes(120),
                            error = false
                        };
                    }
                    else
                    {
                        return RedirectToAction("UsuarioNaoAutenticado", "Autenticacao");
                    }
                }
            } else
            {
                try
                {
                    return Json(new { redirectToUrl = Url.Action("Index", "Home", new { mensagem = "Validação reCaptcha Failed!" })});
                } catch (Exception ex)
                {
                    return ex.Message;
                }
               // return ViewData["Retorno"] = "Validação reCaptcha FALHOU !!!";
            }
        }

        public string HashSenha(string senha)
        {
            byte[] salt = new byte[128 / 8];
            using (var rngCsp = new RNGCryptoServiceProvider())
            {
                rngCsp.GetNonZeroBytes(salt);
            }
            Convert.ToBase64String(salt);

            // derive a 256-bit subkey (use HMACSHA256 with 100,000 iterations)
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: senha,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));

            return hashed;
        }
        //public IActionResult Login(UsuarioModel loginDetails)
        //{
        //    bool resultado = ValidarUsuario(loginDetails);
        //    if (resultado)
        //    {
        //        var tokenString = GerarTokenJwt(loginDetails);
        //        return Ok(new { token = tokenString });
        //    }
        //    else
        //    {
        //        return Unauthorized();
        //    }
        //}

        public string GerarTokenJwt(UsuarioModel loginDetails)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();

                var issuer = _config["Jwt:Issuer"];
                var audience = _config["Jwt:Audience"];

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:key"]));
                var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(issuer: issuer, audience: audience,
                expires: DateTime.Now.AddMinutes(120), signingCredentials: credentials);

                return tokenHandler.WriteToken(token);
            } catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes =
        JwtBearerDefaults.AuthenticationScheme)]

        public ActionResult Authenticated() {
                // return View();
                return RedirectToAction("Error", "Home");
        }

        public async Task<bool> ValidaCaptcha(UsuarioModel loginDetails)
        {
                string secretKey = "";
                var cliente = new WebClient();
                var resultado = cliente.DownloadString(string.Format("https://www.google.com/recaptcha/api/siteverify?secret={0}&response={1}", secretKey, loginDetails.ValidaCaptcha));
                var obj = JObject.Parse(resultado);
                var status = (bool)obj.SelectToken("success");

            return status;
        }

    }
}
