using System;
using System.Collections.Concurrent;
using System.Web;
using Newtonsoft.Json;

namespace RobloxWebSite.Game
{
    public sealed class Studio : IHttpHandler
    {
        private static readonly ConcurrentDictionary<string, BuildState> Builds = new ConcurrentDictionary<string, BuildState>();
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json";
            var owner = context.Request["owner"] ?? "Guest";
            var placeId = context.Request["placeId"] ?? Guid.NewGuid().ToString("N").Substring(0, 10);
            var state = Builds.GetOrAdd(placeId, _ => new BuildState { PlaceId = placeId, Owner = owner, UpdatedUtc = DateTime.UtcNow });
            if (context.Request["action"] == "publish") { state.Title = context.Request["title"] ?? "Untitled Void"; state.Published = true; state.UpdatedUtc = DateTime.UtcNow; }
            context.Response.Write(JsonConvert.SerializeObject(new { ok = true, build = state, windowsDownload = "/VoidVerse/Downloads/VoidStudio-Windows.cmd" }));
        }
        public bool IsReusable => false;
        private sealed class BuildState { public string PlaceId; public string Owner; public string Title = "Untitled Void"; public bool Published; public DateTime UpdatedUtc; }
    }
}