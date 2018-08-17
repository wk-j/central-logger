using System;
using System.Collections.Concurrent;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CentralLogProvider {

    public class CentralLogOptions {

        private string serviceUrl;
        public CentralLogOptions(string servicUrl) {
            this.serviceUrl = servicUrl;
        }

        public async Task<bool> WriteLogAsync(String data) {
            //var url = "http://localhost:5000/api/Logger/writeLog";
            using (var client = new HttpClient()) {
                var response = await client.PostAsync($"{serviceUrl}/api/Logger/writeLog", new StringContent(data, Encoding.UTF8, "application/json"));

                if (response.IsSuccessStatusCode) {
                    return true;
                }
                return false;
            }
        }

    }


    public class CentralLogProvider : ILoggerProvider {
        private readonly ConcurrentDictionary<string, CentralLogger> loggers = new ConcurrentDictionary<string, CentralLogger>();

        private readonly CentralLogOptions options;

        public CentralLogProvider(CentralLogOptions options) {
            this.options = options;
        }

        public ILogger CreateLogger(string categoryName) {
            return new CentralLogger(this, categoryName, options);
        }
        public void Dispose() {
            loggers.Clear();
        }
    }
}
