using System;
using System.Web;
using Newtonsoft.Json;

namespace RobloxWebSite.Game
{
    public sealed class Visit : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json";
            var game = context.Request["game"] ?? "neon-drift";
            context.Response.Write(JsonConvert.SerializeObject(new { ok = true, game, launchUrl = "/VoidVerse/Game.html?game=" + HttpUtility.UrlEncode(game), status = "ready" }));
        }
        public bool IsReusable => false;
    }
}