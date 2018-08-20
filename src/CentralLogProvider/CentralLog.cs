using System;
using System.IO;
using System.Net.Http;
using System.Reflection;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using ServiceStack.Text;
namespace CentralLogProvider {
    public class CentralLog {

        private readonly ILogger<CentralLog> log;
        private readonly CentralLogOptions centralLogOptions;

        public CentralLog(ILogger<CentralLog> log, CentralLogOptions centralLogOptions) {
            this.log = log;
            this.centralLogOptions = centralLogOptions;
        }
        public async Task<bool> WriteAsync(LogLevel logLevel, string states) {

            ShowLogLevel(logLevel, states);

            var thisGetLog = new GetLog() {
                DateTime = DateTime.Now,
                LogLevel = logLevel.ToString(),
                Message = states,
                Application = Path.GetFileName(Assembly.GetEntryAssembly().Location)
            };
            var data = JsonSerializer.SerializeToString(thisGetLog);
            using (var client = new HttpClient()) {
                try {
                    var response = await client.PostAsync(centralLogOptions.ServiceUrl, new StringContent(data, Encoding.UTF8, "application/json"));
                } catch (HttpRequestException) {
                    Console.WriteLine("Can't connect database.");
                    return false;
                }
            }
            return true;
        }

        private void ShowLogLevel(LogLevel logLevel, string states) {
            switch (logLevel) {
                case LogLevel.Trace:
                    log.LogTrace(states);
                    break;
                case LogLevel.Debug:
                    log.LogDebug(states);
                    break;
                case LogLevel.Information:
                    log.LogInformation(states);
                    break;
                case LogLevel.Warning:
                    log.LogWarning(states);
                    break;
                case LogLevel.Error:
                    log.LogError(states);
                    break;
                case LogLevel.Critical:
                    log.LogCritical(states);
                    break;
                default:
                    throw new ArgumentException();
            }
        }
    }
}