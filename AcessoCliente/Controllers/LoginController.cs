using AcessoCliente.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Http;

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
        [Route("/Login/Registra")]
        public string Registra(UsuarioModel usuario)
        {
            string retorno = "";
            try
            {
                usuario.Senha = HashSenha(usuario.Senha);

                retorno = usuario.post_Registra(usuario);
            }
            catch (Exception ex)
            {
                retorno = ex.Message;
            }
            return retorno;
        }

        [HttpPost]
        public async Task<ActionResult<dynamic>> Login(UsuarioModel loginDetails)
        {
            UsuarioModel objUsuario = new UsuarioModel();
            if (ValidaCaptcha(loginDetails))
            {
                // Recupera o usuário no banco
                var user = loginDetails.post_Login(loginDetails);
                var usuario = Json(user);

                string jsonString = usuario.Value.ToString().Replace("[", "").Replace("]","");

                 objUsuario = JsonConvert.DeserializeObject<UsuarioModel>(jsonString);     

                var valida = VerifyHashedPassword(objUsuario.Senha, loginDetails.Senha);
      
                if (user == "[]" || valida == false)
                {
                    return Json(new { redirectToUrl = Url.Action("Index", "Home", new { mensagem = "Usuario ou senha incorreta!" }) });
                }
                else
                {
                    // Gera o Token
                    var token = GerarTokenJwt(loginDetails);

                    setTokenCookie(token, loginDetails.Usuario);

                    // Oculta a senha
                    loginDetails.Senha = "";

                    if (token != "")
                    {
                        try
                        {
                            return Json(new { redirectToUrl = Url.Action("Dashboard", "Cliente"),
                                user = loginDetails.Usuario,
                                token = token,
                                expira = DateTime.Now.AddMinutes(120),
                                error = false });
                        }
                        catch (Exception ex)
                        {
                            return ex.Message;
                        }

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
                    return Json(new { redirectToUrl = Url.Action("Index", "Home", new { mensagem = "Validação reCaptcha falhou!" })});
                } catch (Exception ex)
                {
                    return ex.Message;
                }
               // return ViewData["Retorno"] = "Validação reCaptcha FALHOU !!!";
            }
        }

        public string HashSenha(string senha)
        {
            byte[] salt;
            byte[] buffer2;
            if (senha == null)
            {
                throw new ArgumentNullException("password");
            }
            using (Rfc2898DeriveBytes bytes = new Rfc2898DeriveBytes(senha, 0x10, 0x3e8))
            {
                salt = bytes.Salt;
                buffer2 = bytes.GetBytes(0x20);
            }
            byte[] dst = new byte[0x31];
            Buffer.BlockCopy(salt, 0, dst, 1, 0x10);
            Buffer.BlockCopy(buffer2, 0, dst, 0x11, 0x20);
            return Convert.ToBase64String(dst);
        }

        public static bool VerifyHashedPassword(string hashedPassword, string password)
        {
            byte[] buffer4;
            if (hashedPassword == null)
            {
                return false;
            }
            if (password == null)
            {
                throw new ArgumentNullException("password");
            }
            byte[] src = Convert.FromBase64String(hashedPassword);
            if ((src.Length != 0x31) || (src[0] != 0))
            {
                return false;
            }
            byte[] dst = new byte[0x10];
            Buffer.BlockCopy(src, 1, dst, 0, 0x10);
            byte[] buffer3 = new byte[0x20];
            Buffer.BlockCopy(src, 0x11, buffer3, 0, 0x20);

            using (Rfc2898DeriveBytes bytes = new Rfc2898DeriveBytes(password, dst, 0x3e8))
            {
                buffer4 = bytes.GetBytes(0x20);
            }
            return ByteArraysEqual(buffer3, buffer4);
        }

        public static bool ByteArraysEqual(byte[] a, byte[] b)
        {
            if (object.ReferenceEquals(a, b))
            {
                return true;
            }
            if (a == null || b == null || a.Length != b.Length)
            {
                return false;
            }
            bool flag = true;
            for (int i = 0; i < a.Length; i++)
            {
                flag &= (a[i] == b[i]);
            }
            return flag;
        }

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

        public bool ValidaCaptcha(UsuarioModel loginDetails)
        {
                string secretKey = "";
                var cliente = new WebClient();
                var resultado = cliente.DownloadString(string.Format("https://www.google.com/recaptcha/api/siteverify?secret={0}&response={1}", secretKey, loginDetails.ValidaCaptcha));
                var obj = JObject.Parse(resultado);
                var status = (bool)obj.SelectToken("success");

            return status;
        }

        private void setTokenCookie(string token, string usuario)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddHours(2)
            };
            Response.Cookies.Append("Token", token, cookieOptions);
            Response.Cookies.Append("usuario", usuario, cookieOptions);
        }
    }
}
