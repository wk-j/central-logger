using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace CentralLogger {

    public class LogInfo {
        [Key]
        [JsonIgnore]
        public int Id { set; get; }
        public LogLevel LogLevel { set; get; }
        public string Message { set; get; }
        public DateTime DateTime { set; get; } = DateTime.Now;
        public string Application { set; get; }
        public string Ip { set; get; }
        public string Category { set; get; }
    }

    public class User {
        [Key]
        public int Id_User { set; get; }
        public string Users { set; get; }
        public string Password { set; get; }
    }

    public enum LogLevel {
        Trace, Debug, Information, Warning, Error, Critical
    }

    public class CentralLoggerContext : DbContext {
        public DbSet<LogInfo> LogInfos { get; set; }
        public DbSet<User> Users { get; set; }
        public CentralLoggerContext(DbContextOptions<CentralLoggerContext> options) : base(options) { }
    }
}
