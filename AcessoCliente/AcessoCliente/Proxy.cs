using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SIRS.Servicos
{
    public static class Proxy
    {

        //public const string BaseUrl = "http://192.168.5.163:90/";//prudcao (inativo)       
        //public const string BaseUrl = "http://localhost:90/";//produção (inativo)    
        //public const string BaseUrl = "http://192.168.5.99:90/";//prodrução (IP ANTIGO)(inativo) 

        //public const string BaseUrl = "http://10.4.3.14:999/";//IP de teste
        //public const string BaseUrl = "http://10.4.3.14:90/"; //Novo IP serviço - usar para produção
        public const string BaseUrl = "http://localhost:63119/";//maquina local


        public static async Task<string> GetAsync(string url)
        {
            try
            {
                HttpClient client = new HttpClient();
                client.Timeout = TimeSpan.FromMinutes(10);
                client.BaseAddress = new Uri(BaseUrl);
                HttpResponseMessage response = await client.GetAsync(url);
                if (response.StatusCode != HttpStatusCode.OK) return null;
                HttpContent content = response.Content;
                return await content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }

        public static async Task<string> PostAsync<T>(string url, T parametros)
        {
            try
            {
                HttpClient client = new HttpClient();
                client.Timeout = TimeSpan.FromMinutes(10);
                client.BaseAddress = new Uri(BaseUrl);
                string req = JsonConvert.SerializeObject(parametros);
                HttpResponseMessage response = await client.PostAsync(url, new StringContent(req, Encoding.Default, "application/json"));
                HttpContent content = response.Content;
                return await content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }

        public static async Task<string> PostAsync(string url)
        {
            try
            {
                HttpClient client = new HttpClient();
                client.Timeout = TimeSpan.FromMinutes(10);
                client.BaseAddress = new Uri(BaseUrl);
                HttpResponseMessage response = await client.PostAsync(url, new StringContent(""));
                HttpContent content = response.Content;
                return await content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }
        public static async Task<string> PutAsync(string url)
        {
            try
            {
                HttpClient client = new HttpClient();
                client.Timeout = TimeSpan.FromMinutes(10);
                client.BaseAddress = new Uri(BaseUrl);
                HttpResponseMessage response = await client.PutAsync(url, new StringContent(""));
                HttpContent content = response.Content;
                return await content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }
        public static async Task<string> DeleteAsync(string url)
        {
            try
            {
                HttpClient client = new HttpClient();
                client.Timeout = TimeSpan.FromMinutes(10);
                client.BaseAddress = new Uri(BaseUrl);
                HttpResponseMessage response = await client.DeleteAsync(url);
                HttpContent content = response.Content;
                return await content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }

    }
}
