using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace RobloxWebSite.Game
{
    public sealed class ChatFilter : IHttpHandler
    {
        private static readonly ConcurrentDictionary<string, ConcurrentQueue<ChatMessage>> Rooms = new ConcurrentDictionary<string, ConcurrentQueue<ChatMessage>>();
        private static readonly string[] Blocked = { "badword", "spamword" };

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json";
            var room = context.Request["room"] ?? "lobby";
            var queue = Rooms.GetOrAdd(room, _ => new ConcurrentQueue<ChatMessage>());
            if (string.Equals(context.Request.HttpMethod, "POST", StringComparison.OrdinalIgnoreCase))
            {
                var name = Clean(context.Request["user"] ?? "Guest");
                var text = Clean(context.Request["message"] ?? "");
                if (text.Length > 0) queue.Enqueue(new ChatMessage { user = name, message = Filter(text), sentUtc = DateTime.UtcNow });
                while (queue.Count > 100 && queue.TryDequeue(out _)) { }
            }
            var messages = queue.ToArray().OrderBy(x => x.sentUtc).TakeLast(50);
            context.Response.Write(JsonConvert.SerializeObject(new { ok = true, room, messages }));
        }

        private static string Clean(string value) => value.Replace("<", "&lt;").Replace(">", "&gt;").Trim();
        private static string Filter(string value) { foreach (var word in Blocked) value = value.Replace(word, "***", StringComparison.OrdinalIgnoreCase); return value.Length > 240 ? value.Substring(0, 240) : value; }
        public bool IsReusable => false;
        private sealed class ChatMessage { public string user; public string message; public DateTime sentUtc; }
    }
}