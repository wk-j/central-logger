using System;
using System.Text;
using Microsoft.Extensions.Logging;

namespace CentralLogProvider {

    public class CentralLogger : ILogger {
        /* 
        public LogLevel LogLevel { get; set; } = LogLevel.Warning;
        public int EventId { get; set; } = 0;
        public ConsoleColor Color { get; set; } = ConsoleColor.Yellow;
        */
        private readonly CentralLogProvider provider;
        private readonly string categoryName;
        public CentralLogger(CentralLogProvider provider, string categoryName) {
            this.provider = provider;
            this.categoryName = categoryName;
        }
        public IDisposable BeginScope<TState>(TState state) {
            return null;
        }

        public bool IsEnabled(LogLevel logLevel) {
            return logLevel == LogLevel.None;
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter) {
            if (!IsEnabled(logLevel)) {
                return;
            }
            var builder = new StringBuilder();
            builder.Append(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff zzz"));
            builder.Append(" [");
            builder.Append(logLevel.ToString());
            builder.Append("] ");
            builder.Append(categoryName);
            builder.Append(": ");
            builder.AppendLine(formatter(state, exception));
            Console.WriteLine(builder.ToString());
        }
    }
}