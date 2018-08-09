using System;
using System.Collections.Concurrent;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CentralLogProvider {
    public class CentralLogOptions {
        public string ServiceUrl { set; get; }
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
