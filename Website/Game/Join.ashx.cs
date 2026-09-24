using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace RobloxWebSite.Game
{
    public sealed class Join : IHttpHandler
    {
        private static readonly ConcurrentDictionary<string, Player> Players = new ConcurrentDictionary<string, Player>();

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json";
            var user = (context.Request["user"] ?? "Guest").Trim();
            var game = context.Request["game"] ?? "neon-drift";
            var id = Guid.NewGuid().ToString("N").Substring(0, 8);
            Players[id] = new Player { Id = id, Name = user.Length > 24 ? user.Substring(0, 24) : user, Game = game, JoinedUtc = DateTime.UtcNow };
            var players = Players.Values.Where(p => p.Game == game).ToArray();
            context.Response.Write(JsonConvert.SerializeObject(new { ok = true, sessionId = id, game, players, server = "voidverse-local-01" }));
        }

        public bool IsReusable => false;
        private sealed class Player { public string Id; public string Name; public string Game; public DateTime JoinedUtc; }
    }
}