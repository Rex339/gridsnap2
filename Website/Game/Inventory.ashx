using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Web;
using Newtonsoft.Json;

namespace RobloxWebSite.Game
{
    public class Inventory : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json";
            context.Response.Headers.Add("Access-Control-Allow-Origin", "*");

            string action = (context.Request["action"] ?? "load").Trim();
            string username = (context.Request["username"] ?? "Nova").Trim();

            switch (action)
            {
                case "load":
                    Write(context, new { ok = true, items = LoadInventory(username) });
                    return;
                case "add":
                    var items = LoadInventory(username);
                    string item = (context.Request["item"] ?? "").Trim();
                    if (!string.IsNullOrWhiteSpace(item)) items.Add(item);
                    SaveInventory(username, items);
                    Write(context, new { ok = true, items = items });
                    return;
                case "remove":
                    var removeList = LoadInventory(username);
                    string token = (context.Request["item"] ?? "").Trim();
                    removeList.RemoveAll(x => string.Equals(x, token, StringComparison.OrdinalIgnoreCase));
                    SaveInventory(username, removeList);
                    Write(context, new { ok = true, items = removeList });
                    return;
                default:
                    Write(context, new { ok = false, error = "Unknown inventory action." });
                    return;
            }
        }

        public bool IsReusable => false;

        private static List<string> LoadInventory(string username)
        {
            string path = DataPath(username + "-inventory.json");
            if (!File.Exists(path)) return new List<string>();
            string json = File.ReadAllText(path, Encoding.UTF8);
            return string.IsNullOrWhiteSpace(json) ? new List<string>() : JsonConvert.DeserializeObject<List<string>>(json) ?? new List<string>();
        }

        private static void SaveInventory(string username, List<string> items)
        {
            File.WriteAllText(DataPath(username + "-inventory.json"), JsonConvert.SerializeObject(items, Formatting.Indented), Encoding.UTF8);
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
    }
}
