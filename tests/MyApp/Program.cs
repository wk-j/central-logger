using System;
using Microsoft.Extensions.DependencyInjection;
using CentralLogProvider;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace MyApp {
    class Program {
        static async Task Main(string[] args) {
            // Setup
            var serviceCollection = new ServiceCollection();
            ConfigureServices(serviceCollection);
            var serviceProvider = serviceCollection.BuildServiceProvider();

            // Get instance
            var myService = serviceProvider.GetService(typeof(MyService)) as MyService;

            // Tests
            await myService.FunA();
            await myService.FunB();

            Console.ReadLine();
        }
        private static void ConfigureServices(IServiceCollection services) {
            var centralLogOptions = new CentralLogOptions("http://localhost:5000/api/Logger/addLog");
            services.AddLogging(configure => {
                configure.ClearProviders();
                configure.AddLog(centralLogOptions);
            });
            services.AddTransient<MyService>();
        }
    }

    class MyService {
        private readonly CentralLog log;
        public MyService(CentralLog log) {
            this.log = log;
        }

        public async Task FunA() {
            await log.WriteAsync(LogLevel.Information, "call function A 1");
            await log.WriteAsync(LogLevel.Information, "call function A 2");
            await log.WriteAsync(LogLevel.Information, "call function A 3");
            await log.WriteAsync(LogLevel.Error, "call function A failed");
        }

        public async Task FunB() {
            await log.WriteAsync(LogLevel.Information, "call function B 1");
            await log.WriteAsync(LogLevel.Information, "call function B 2");
            await log.WriteAsync(LogLevel.Information, "call function B 3");
            await log.WriteAsync(LogLevel.Error, "call function B failed");
        }
    }
}
