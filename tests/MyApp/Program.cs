using System;
using Microsoft.Extensions.DependencyInjection;
using CentralLogProvider;
using Microsoft.Extensions.Logging;

namespace MyApp {
    class Program {
        static void Main(string[] args) {
            // Setup
            var serviceCollection = new ServiceCollection();
            ConfigureServices(serviceCollection);
            var serviceProvider = serviceCollection.BuildServiceProvider();

            // Get instance
            var myService = serviceProvider.GetService(typeof(MyService)) as MyService;

            // Tests
            myService.FunA();
            myService.FunB();

            while (Console.ReadLine() != "Q") {

            }
        }
        private static void ConfigureServices(IServiceCollection services) {
            services.AddLogging(configure => {
                configure.ClearProviders();

                configure.AddLog(new CentralLogOptions("http://localhost:5000/api/Logger/addLog"));
                // configure.AddConsole();
            });
            services.AddTransient<MyService>();
        }
    }

    class MyService {
        ILogger<MyService> logger;
        public MyService(ILogger<MyService> logger) {
            this.logger = logger;
        }

        public void FunA() {
            logger.LogInformation("call function A 1");
            logger.LogInformation("call function A 2");
            logger.LogInformation("call function A 3");
            logger.LogError("call function A failed");
        }

        public void FunB() {
            logger.LogInformation("call function B 1");
            logger.LogInformation("call function B 2");
            logger.LogInformation("call function B 3");
            logger.LogError("call function B failed");
        }
    }
}
