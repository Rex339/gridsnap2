using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using Newtonsoft.Json;

namespace RobloxWebSite.Game
{
    public class Moderation : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json";
            context.Response.Headers.Add("Access-Control-Allow-Origin", "*");

            string action = (context.Request["action"] ?? "list").Trim();

            switch (action)
            {
                case "report":
                    Write(context, HandleReport(context));
                    return;
                case "ban":
                    Write(context, HandleBan(context));
                    return;
                case "list":
                    Write(context, new { ok = true, reports = LoadReports(), bans = LoadBans() });
                    return;
                default:
                    Write(context, new { ok = false, error = "Unknown moderation action." });
                    return;
            }
        }

        public bool IsReusable => false;

        private static object HandleReport(HttpContext context)
        {
            string type = (context.Request["type"] ?? "Harassment").Trim();
            string user = (context.Request["user"] ?? "unknown-user").Trim();
            string reason = (context.Request["reason"] ?? "No reason provided").Trim();

            if (string.IsNullOrWhiteSpace(user))
                return new { ok = false, error = "Player name is required." };

            var reports = LoadReports();
            reports.Add(new ReportRecord
            {
                Type = type,
                User = user,
                Reason = reason,
                CreatedUtc = DateTime.UtcNow,
                Status = "Pending review"
            });
            SaveReports(reports);
            return new { ok = true, message = "Report submitted." };
        }

        private static object HandleBan(HttpContext context)
        {
            string user = (context.Request["user"] ?? "").Trim();
            string length = (context.Request["length"] ?? "1").Trim();
            string reason = (context.Request["reason"] ?? "No reason provided").Trim();

            if (string.IsNullOrWhiteSpace(user))
                return new { ok = false, error = "Player name is required." };

            var bans = LoadBans();
            bans.Add(new BanRecord
            {
                User = user,
                LengthDays = length,
                Reason = reason,
                CreatedUtc = DateTime.UtcNow,
                Active = true
            });
            SaveBans(bans);
            return new { ok = true, message = "Ban applied." };
        }

        private static List<ReportRecord> LoadReports()
        {
            string path = DataPath("reports.json");
            if (!File.Exists(path)) return new List<ReportRecord>();
            string json = File.ReadAllText(path, Encoding.UTF8);
            return string.IsNullOrWhiteSpace(json) ? new List<ReportRecord>() : JsonConvert.DeserializeObject<List<ReportRecord>>(json) ?? new List<ReportRecord>();
        }

        private static List<BanRecord> LoadBans()
        {
            string path = DataPath("bans.json");
            if (!File.Exists(path)) return new List<BanRecord>();
            string json = File.ReadAllText(path, Encoding.UTF8);
            return string.IsNullOrWhiteSpace(json) ? new List<BanRecord>() : JsonConvert.DeserializeObject<List<BanRecord>>(json) ?? new List<BanRecord>();
        }

        private static void SaveReports(List<ReportRecord> reports)
        {
            File.WriteAllText(DataPath("reports.json"), JsonConvert.SerializeObject(reports, Formatting.Indented), Encoding.UTF8);
        }

        private static void SaveBans(List<BanRecord> bans)
        {
            File.WriteAllText(DataPath("bans.json"), JsonConvert.SerializeObject(bans, Formatting.Indented), Encoding.UTF8);
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

        private sealed class ReportRecord
        {
            public string Type { get; set; }
            public string User { get; set; }
            public string Reason { get; set; }
            public DateTime CreatedUtc { get; set; }
            public string Status { get; set; }
        }

        private sealed class BanRecord
        {
            public string User { get; set; }
            public string LengthDays { get; set; }
            public string Reason { get; set; }
            public DateTime CreatedUtc { get; set; }
            public bool Active { get; set; }
        }
    }
}
