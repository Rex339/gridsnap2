using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Security;
using Newtonsoft.Json;

namespace RobloxWebSite.Game
{
    public sealed class GetCurrentUser : IHttpHandler
    {
        public bool IsReusable { get { return false; } }

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json";
            context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
            context.Response.Cache.SetNoStore();

            if (context.User == null || !context.User.Identity.IsAuthenticated)
            {
                context.Response.Write(JsonConvert.SerializeObject(new { ok = true, authenticated = false }));
                return;
            }

            string path = context.Server.MapPath("~/App_Data/VoidVerse/accounts.json");
            if (!File.Exists(path))
            {
                FormsAuthentication.SignOut();
                context.Response.Write(JsonConvert.SerializeObject(new { ok = true, authenticated = false }));
                return;
            }

            string json = File.ReadAllText(path, Encoding.UTF8);
            var accounts = JsonConvert.DeserializeObject<AccountRecord[]>(json) ?? new AccountRecord[0];
            AccountRecord account = accounts.FirstOrDefault(x => x.Id == context.User.Identity.Name);
            if (account == null)
            {
                FormsAuthentication.SignOut();
                context.Response.Write(JsonConvert.SerializeObject(new { ok = true, authenticated = false }));
                return;
            }

            context.Response.Write(JsonConvert.SerializeObject(new
            {
                ok = true,
                authenticated = true,
                id = account.Id,
                username = account.Username,
                email = account.Email
            }));
        }

        private sealed class AccountRecord
        {
            public string Id { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string PasswordHash { get; set; }
            public DateTime CreatedUtc { get; set; }
        }
    }
}
