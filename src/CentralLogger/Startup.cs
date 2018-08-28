using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.Swagger;
using CentralLogger.Hubs;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using CentralLogger.Services;
using System.Threading;

namespace CentralLogger {
    public class Startup {
        public Startup(IConfiguration configuration, IHostingEnvironment env) {
            var builder = new ConfigurationBuilder()
              .SetBasePath(env.ContentRootPath)
              .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
              .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services) {

            var conn = Configuration.GetValue("ConnectionString", "");
            Console.WriteLine($"ConnectionString = {conn}");

            services.AddCors();
            services.AddDbContext<CentralLoggerContext>(options => options.UseNpgsql(conn));
            services.AddSignalR();
            services.AddScoped<UserService>();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            services.AddSwaggerGen(c => {
                c.SwaggerDoc("v1", new Info { Title = "My API", Version = "v1" });
            });
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, CentralLoggerContext db, UserService userService) {

            var defaultOptions = new DefaultFilesOptions();
            defaultOptions.DefaultFileNames.Clear();
            defaultOptions.DefaultFileNames.Add("index.html");

            if (env.IsDevelopment()) {
                app
                  .UseDeveloperExceptionPage()
                  .UseDefaultFiles(defaultOptions)
                  .UseStaticFiles();
            } else {
                var asm = Assembly.GetEntryAssembly();
                var asmName = asm.GetName().Name;
                defaultOptions.FileProvider = new EmbeddedFileProvider(asm, $"{asmName}.wwwroot");

                app
                  .UseHsts()
                  .UseDefaultFiles(defaultOptions)
                  .UseStaticFiles(new StaticFileOptions {
                      FileProvider = new EmbeddedFileProvider(asm, $"{asmName}.wwwroot")
                  });
            }

            app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().AllowCredentials());
            app.UseSwagger();

            app.UseSwaggerUI(c => {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
            });

            app.UseMvc();
            app.UseSignalR(options => {
                options.MapHub<LogHub>("/LogHub");
            });

            if (env.IsProduction()) {
                Thread.Sleep(5000);
                GenrateDatabase(db, userService);
            } else {
                GenrateDatabase(db, userService);
            }
        }

        private void GenrateDatabase(CentralLoggerContext db, UserService userService) {
            Console.WriteLine("Create DB");
            var createData = db.Database.EnsureCreated();
            if (createData) {
                userService.AddUser("admin", "admin");
            }
            Console.WriteLine("Create success");
        }
    }
}