using System;
using System.Collections.Concurrent;
using Microsoft.Extensions.Logging;

namespace CentralLogProvider {
    public class CentralLogProvider : ILoggerProvider {
        private readonly CentralLogProvider provider;
        private readonly ConcurrentDictionary<string, CentralLogger> loggers = new ConcurrentDictionary<string, CentralLogger>();


        public CentralLogProvider(CentralLogProvider provider) {
            this.provider = provider;
        }
        public ILogger CreateLogger(string categoryName) {
            return new CentralLogger(provider, categoryName);
        }
        public void Dispose() {
            loggers.Clear();
        }
    }
}
