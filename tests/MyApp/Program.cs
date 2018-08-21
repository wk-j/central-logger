using System;
using Microsoft.Extensions.DependencyInjection;
using CentralLogProvider;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace MyApp {
    class Program {
        static void Main(string[] args) {
            var serviceCollection = new ServiceCollection();
            ConfigureServices(serviceCollection);
            var serviceProvider = serviceCollection.BuildServiceProvider();

            var myService = serviceProvider.GetService(typeof(MyService)) as MyService;

            myService.FunA();
            myService.FunA();

            Console.ReadLine();
        }
        private static void ConfigureServices(IServiceCollection services) {
            var centralLogOptions = new CentralLogOptions("http://localhost:5000");
            services.AddLogging(configure => {
                configure.ClearProviders();
                configure.AddLog(centralLogOptions);
            });
            services.AddTransient<MyService>();
        }
    }

    class MyService {
        private ILogger<MyService> logger;
        public MyService(ILogger<MyService> logger) {
            this.logger = logger;
        }

        public void FunA() {
            logger.LogInformation("Log A");
            logger.LogInformation("Log B");
            logger.LogInformation("Log C");
        }
    }
}
