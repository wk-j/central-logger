using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using CentralLogProvider;

namespace MyWeb {
    public class Program {
        public static void Main(string[] args) {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseUrls("http://*:6000")
                .ConfigureLogging(builder => {
                    builder.ClearProviders();
                    builder.AddLog(new CentralLogOptions("http://localhost:5000/api/Logger/addLog"));
                })
                .UseStartup<Startup>();
    }
}
