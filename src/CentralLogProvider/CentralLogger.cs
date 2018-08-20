using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;


namespace CentralLogProvider {


    public class CentralLogger : ILogger {

        private readonly CentralLogProvider provider;
        private readonly string categoryName;
        private readonly CentralLogOptions options;

        public CentralLogger(CentralLogProvider provider, string categoryName, CentralLogOptions options) {
            this.provider = provider;
            this.categoryName = categoryName;
            this.options = options;
        }
        public IDisposable BeginScope<TState>(TState state) {
            return null;
        }

        public bool IsEnabled(LogLevel logLevel) {
            return logLevel != LogLevel.None;
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter) {
            if (!IsEnabled(logLevel)) {
                return;
            }
            var states = formatter(state, exception);
            var date = DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss.fff zzz");
            var log = $"{date} [{logLevel.ToString()}] {categoryName}: {states}";
            Console.WriteLine(log);
        }
    }
}
