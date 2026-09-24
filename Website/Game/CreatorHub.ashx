using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Web;
using Newtonsoft.Json;

namespace RobloxWebSite.Game
{
    public class CreatorHub : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json";
            context.Response.Headers.Add("Access-Control-Allow-Origin", "*");

            string action = (context.Request["action"] ?? "list").Trim();
            switch (action)
            {
                case "create":
                    Write(context, HandleCreate(context));
                    return;
                case "list":
                    Write(context, new { ok = true, games = LoadGames() });
                    return;
                default:
                    Write(context, new { ok = false, error = "Unknown creator action." });
                    return;
            }
        }

        public bool IsReusable => false;

        private static object HandleCreate(HttpContext context)
        {
            string name = (context.Request["name"] ?? "Untitled Void").Trim();
            string owner = (context.Request["owner"] ?? "Creator").Trim();
            if (string.IsNullOrWhiteSpace(name)) return new { ok = false, error = "Game name is required." };

            var games = LoadGames();
            var entry = new GameRecord { Name = name, Owner = owner, CreatedUtc = DateTime.UtcNow, Visibility = context.Request["visibility"] ?? "public" };
            games.Add(entry);
            SaveGames(games);
            return new { ok = true, game = entry };
        }

        private static List<GameRecord> LoadGames()
        {
            string path = DataPath("games.json");
            if (!File.Exists(path)) return new List<GameRecord>();
            string json = File.ReadAllText(path, Encoding.UTF8);
            return string.IsNullOrWhiteSpace(json) ? new List<GameRecord>() : JsonConvert.DeserializeObject<List<GameRecord>>(json) ?? new List<GameRecord>();
        }

        private static void SaveGames(List<GameRecord> games)
        {
            File.WriteAllText(DataPath("games.json"), JsonConvert.SerializeObject(games, Formatting.Indented), Encoding.UTF8);
        }

        private static string DataPath(string file)
        {
            string dir = HttpContext.Current.Server.MapPath("~/App_Data/VoidVerse");
            Directory.CreateDirectory(dir);
            return Path.Combine(dir, file);
        }

        private static void Write(HttpContext context, object payload)
        {
            context.Response.Write(JsonConvert.SerializeObject(payload));
        }

        private sealed class GameRecord
        {
            public string Name { get; set; }
            public string Owner { get; set; }
            public DateTime CreatedUtc { get; set; }
            public string Visibility { get; set; }
        }
    }
}
