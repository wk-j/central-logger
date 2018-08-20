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
using Newtonsoft.Json;

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
            var builder = new StringBuilder();
            builder.Append(DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss.fff zzz"));
            builder.Append(" [");
            builder.Append(logLevel.ToString());
            builder.Append("] ");
            builder.Append(categoryName);
            builder.Append(": ");
            builder.AppendLine(formatter(state, exception));
            Console.Write(builder.ToString());
            GetLog(logLevel, categoryName, states);
        }

        public async void GetLog(LogLevel logLevel, string categoryName, string states) {
            var thisGetLog = new GetLog() {
                DateTime = DateTime.Now,
                LogLevel = logLevel.ToString(),
                Message = states,
                Application = Path.GetFileName(Assembly.GetEntryAssembly().Location)
            };
            using (var client = new HttpClient()) {
                string data = JsonConvert.SerializeObject(thisGetLog);
                try {
                    var response = await client.PostAsync(options.serviceUrl, new StringContent(data, Encoding.UTF8, "application/json"));
                } catch (HttpRequestException) { }
            }
        }
    }
}
