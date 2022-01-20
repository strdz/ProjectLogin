using SIRS.Servicos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AcessoCliente.Models
{
    public class UsuarioModel
    {
        public string Usuario { get; set; }
        public string Senha { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public string Nome { get; set; }
        public string Empresa { get; set; }
        public string ValidaCaptcha { get; set; }

        public string post_Registra(UsuarioModel usuario)
        {
            var retorno = "";
            try
            {
                retorno = Proxy.PostAsync($"api/AcessoCliente/UsuarioController/AcessoClienteUsuario/Registra", this).Result;
            }
            catch (Exception ex)
            {
                retorno = ex.Message;
            }
            return retorno;
        }

        public string post_Login(UsuarioModel usuario)
        {
            var retorno = "";
            try
            {
                retorno = Proxy.PostAsync($"api/AcessoCliente/UsuarioController/AcessoClienteUsuario/Login", this).Result;
            }
            catch (Exception ex)
            {
                retorno = ex.Message;
            }
            return retorno;
        }
    }
}
