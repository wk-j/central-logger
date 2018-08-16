using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Runtime.Serialization.Json;
using System.Text;
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
            var url = options.ServiceUrl;
            var states = formatter(state, exception);
            var builder = new StringBuilder();
            builder.Append(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff zzz"));
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
            var program = Process.GetCurrentProcess().MainModule.FileName;
            Type types = Type.GetType(program);
            var thisGetLog = new GetLog() {
                DateTime = DateTime.Now,
                LogLevel = logLevel.ToString(),
                Message = states,
                Application = Path.GetFileName(Assembly.GetEntryAssembly().Location)

            };
            var serializer = new DataContractJsonSerializer(typeof(GetLog));
            using (var stream = new MemoryStream()) {
                serializer.WriteObject(stream, thisGetLog);
                var data = Encoding.UTF8.GetString(stream.ToArray());


                var url = "http://localhost:5000/api/Logger/writeLog";
                using (var client = new HttpClient()) {
                    var response = await client.PostAsync(url, new StringContent(data, Encoding.UTF8, "application/json"));
                }
            }
        }
    }
}