using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CentralLogProvider {
    public static class CentralLogExtensions {
        public static ILoggingBuilder addLog(this ILoggingBuilder builder) {
            builder.Services.AddSingleton<ILoggerProvider, CentralLogProvider>();
            return builder;
        }
    }
}