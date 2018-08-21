using System;
using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Configs;
using BenchmarkDotNet.Environments;
using BenchmarkDotNet.Horology;
using BenchmarkDotNet.Jobs;
using BenchmarkDotNet.Running;
using CentralLogProvider;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Core;

namespace MyApp.Performance {
    class Program {
        static void Main(string[] args) {
            BenchmarkRunner.Run<MyService>();
        }
    }

    public class Config : ManualConfig {
        public Config() {
            Add(
                Job.Dry
                .With(Platform.X64)
                .With(Jit.RyuJit)
                .With(Runtime.Core)
                .WithMinIterationTime(TimeInterval.FromMicroseconds(100))
                .WithLaunchCount(1));
        }
    }

    [Config(typeof(Config))]
    [MemoryDiagnoser]
    public class MyService {

        private Microsoft.Extensions.Logging.ILogger console;
        private Microsoft.Extensions.Logging.ILogger central;
        private Logger seri;

        [Params(10, 100)]
        public int Count { set; get; }

        [GlobalSetup]
        public void GlobalSetup() {
            console = CreateConsole();
            central = CreateCentral();
            seri = CreateSeri();
        }

        private Microsoft.Extensions.Logging.ILogger CreateConsole() {
            var factory = new LoggerFactory(new ILoggerProvider[] {
            });
            factory.AddConsole();
            return factory.CreateLogger("MyService");
        }

        private Microsoft.Extensions.Logging.ILogger CreateCentral() {
            var factories = new[] {
                new CentralLogProvider.CentralLogProvider(new CentralLogOptions("http://localhost:5000") {})
            };
            var factory = new LoggerFactory(factories);
            return factory.CreateLogger("MyService");
        }

        private Logger CreateSeri() {
            var logger = new LoggerConfiguration()
                .WriteTo.Console()
                .CreateLogger();
            return logger;
        }

        [Benchmark]
        public void Console() {
            for (var i = 0; i < Count; i++) {
                console.LogError("Console Logger A");
            }
        }

        [Benchmark]
        public void Seri() {
            for (var i = 0; i < Count; i++) {
                seri.Error("Seri Logger A");
            }
        }

        [Benchmark]
        public void Central() {
            for (var i = 0; i < Count; i++) {
                central.LogError("Central Logger A");
            }
        }
    }
}
