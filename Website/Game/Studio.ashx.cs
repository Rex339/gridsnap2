using System;
using System.Collections.Concurrent;
using System.Web;
using Newtonsoft.Json;

namespace RobloxWebSite.Game
{
    public sealed class Studio : IHttpHandler
    {
        private static readonly ConcurrentDictionary<string, BuildState> Builds = new ConcurrentDictionary<string, BuildState>();
        private static readonly ConcurrentDictionary<string, AccountState> Accounts = new ConcurrentDictionary<string, AccountState>(StringComparer.OrdinalIgnoreCase);

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json";
            var action = context.Request["action"] ?? "build";
            if (action == "settings") { HandleSettings(context); return; }
            var owner = Clean(context.Request["owner"] ?? "Guest");
            var placeId = context.Request["placeId"] ?? Guid.NewGuid().ToString("N").Substring(0, 10);
            var state = Builds.GetOrAdd(placeId, _ => new BuildState { PlaceId = placeId, Owner = owner, UpdatedUtc = DateTime.UtcNow });
            if (action == "publish") { state.Title = Clean(context.Request["title"] ?? "Untitled Void"); state.Published = true; state.UpdatedUtc = DateTime.UtcNow; }
            context.Response.Write(JsonConvert.SerializeObject(new { ok = true, build = state, windowsDownload = "/VoidVerse/Downloads/VoidStudio-Windows.cmd" }));
        }

        private static void HandleSettings(HttpContext context)
        {
            var username = Clean(context.Request["username"] ?? "Guest");
            var account = Accounts.GetOrAdd(username, _ => new AccountState { Username = username });
            var mode = context.Request["mode"] ?? "profile";
            if (mode == "username")
            {
                var next = Clean(context.Request["newUsername"] ?? "");
                if (next.Length < 3 || next.Length > 20) { Write(context, new { ok = false, error = "Username must be 3–20 characters." }); return; }
                account.Username = next;
                Write(context, new { ok = true, message = "Username updated.", username = next });
                return;
            }
            if (mode == "password")
            {
                var email = (context.Request["email"] ?? "").Trim();
                if (!email.Contains("@") || !email.Contains(".")) { Write(context, new { ok = false, error = "Enter a valid email address to change your password." }); return; }
                account.Email = email;
                Write(context, new { ok = true, message = "Password reset instructions sent to your email.", email });
                return;
            }
            Write(context, new { ok = true, username = account.Username, email = account.Email });
        }

        private static void Write(HttpContext context, object value) => context.Response.Write(JsonConvert.SerializeObject(value));
        private static string Clean(string value) => (value ?? "").Replace("<", "").Replace(">", "").Trim();
        public bool IsReusable => false;
        private sealed class BuildState { public string PlaceId; public string Owner; public string Title = "Untitled Void"; public bool Published; public DateTime UpdatedUtc; }
        private sealed class AccountState { public string Username; public string Email = ""; }
    }
}