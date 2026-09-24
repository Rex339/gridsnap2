using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Security;
using Newtonsoft.Json;

namespace RobloxWebSite.Game
{
    public sealed class VoidVerseAuth : IHttpHandler
    {
        private static readonly object Sync = new object();
        private static readonly Regex UsernamePattern = new Regex("^[A-Za-z0-9_]{3,20}$", RegexOptions.Compiled);
        private static readonly Regex EmailPattern = new Regex("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", RegexOptions.Compiled);

        public bool IsReusable { get { return false; } }

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json";
            context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
            context.Response.Cache.SetNoStore();

            try
            {
                string action = (context.Request.Form["action"] ?? context.Request["action"] ?? "me").Trim().ToLowerInvariant();
                switch (action)
                {
                    case "signup": Write(context, Signup(context)); return;
                    case "signin": Write(context, Signin(context)); return;
                    case "logout": FormsAuthentication.SignOut(); Write(context, new { ok = true, authenticated = false }); return;
                    case "me": Write(context, CurrentUser()); return;
                    default: Write(context, new { ok = false, error = "Unknown authentication action." }); return;
                }
            }
            catch (Exception)
            {
                context.Response.StatusCode = 500;
                Write(context, new { ok = false, error = "Authentication service unavailable." });
            }
        }

        private static object Signup(HttpContext context)
        {
            string username = (context.Request.Form["username"] ?? "").Trim();
            string email = (context.Request.Form["email"] ?? "").Trim().ToLowerInvariant();
            string password = context.Request.Form["password"] ?? "";

            if (!UsernamePattern.IsMatch(username)) return Error("Username must be 3–20 letters, numbers, or underscores.");
            if (email.Length > 254 || !EmailPattern.IsMatch(email)) return Error("Enter a valid email address.");
            if (password.Length < 10 || password.Length > 128) return Error("Password must be 10–128 characters.");

            lock (Sync)
            {
                List<AccountRecord> accounts = LoadAccounts();
                if (accounts.Any(x => x.Username.Equals(username, StringComparison.OrdinalIgnoreCase))) return Error("That username is already in use.");
                if (accounts.Any(x => x.Email.Equals(email, StringComparison.OrdinalIgnoreCase))) return Error("That email is already registered.");

                AccountRecord account = new AccountRecord
                {
                    Id = Guid.NewGuid().ToString("N"),
                    Username = username,
                    Email = email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(password, 12),
                    CreatedUtc = DateTime.UtcNow
                };
                accounts.Add(account);
                SaveAccounts(accounts);
                SignIn(account);
                return PublicUser(account);
            }
        }

        private static object Signin(HttpContext context)
        {
            string identifier = (context.Request.Form["username"] ?? "").Trim();
            string password = context.Request.Form["password"] ?? "";
            if (identifier.Length == 0 || password.Length == 0) return Error("Username and password are required.");

            AccountRecord account;
            lock (Sync)
            {
                account = LoadAccounts().FirstOrDefault(x =>
                    x.Username.Equals(identifier, StringComparison.OrdinalIgnoreCase) ||
                    x.Email.Equals(identifier, StringComparison.OrdinalIgnoreCase));
            }

            if (account == null || !BCrypt.Net.BCrypt.Verify(password, account.PasswordHash)) return Error("Invalid username or password.");
            SignIn(account);
            return PublicUser(account);
        }

        private static object CurrentUser()
        {
            if (HttpContext.Current.User == null || !HttpContext.Current.User.Identity.IsAuthenticated)
                return new { ok = true, authenticated = false };

            AccountRecord account;
            lock (Sync) account = LoadAccounts().FirstOrDefault(x => x.Id == HttpContext.Current.User.Identity.Name);
            return account == null ? (object)new { ok = true, authenticated = false } : PublicUser(account);
        }

        private static object Error(string error) { return new { ok = false, error }; }
        private static void SignIn(AccountRecord account) { FormsAuthentication.SetAuthCookie(account.Id, false); }
        private static object PublicUser(AccountRecord account) { return new { ok = true, authenticated = true, id = account.Id, username = account.Username, email = account.Email }; }

        private static List<AccountRecord> LoadAccounts()
        {
            string path = DataPath();
            if (!File.Exists(path)) return new List<AccountRecord>();
            string json = File.ReadAllText(path, Encoding.UTF8);
            return string.IsNullOrWhiteSpace(json) ? new List<AccountRecord>() : JsonConvert.DeserializeObject<List<AccountRecord>>(json) ?? new List<AccountRecord>();
        }

        private static void SaveAccounts(List<AccountRecord> accounts)
        {
            string path = DataPath();
            string temp = path + ".tmp";
            File.WriteAllText(temp, JsonConvert.SerializeObject(accounts, Formatting.Indented), Encoding.UTF8);
            if (File.Exists(path)) File.Replace(temp, path, null);
            else File.Move(temp, path);
        }

        private static string DataPath()
        {
            string directory = HttpContext.Current.Server.MapPath("~/App_Data/VoidVerse");
            Directory.CreateDirectory(directory);
            return Path.Combine(directory, "accounts.json");
        }

        private static void Write(HttpContext context, object payload) { context.Response.Write(JsonConvert.SerializeObject(payload)); }

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
