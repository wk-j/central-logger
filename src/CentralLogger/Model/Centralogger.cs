using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace CentralLogger {

    public class LogInfo {
        [Key]
        public int Id { set; get; }
        public LogLevel LogLevel { set; get; }
        public string Message { set; get; }
        public DateTime DateTime { set; get; } = DateTime.Now;
        public string Application { set; get; }
        public string Ip { set; get; }
    }
    public enum LogLevel {
        Info, Wramming, Error
    }

    public class CentralLoggerContext : DbContext {
        public DbSet<LogInfo> LogInfo { get; set; }
        public CentralLoggerContext(DbContextOptions<CentralLoggerContext> options) : base(options) { }
    }
}
