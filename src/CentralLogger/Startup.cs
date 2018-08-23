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

namespace CentralLogger
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddCors();
            services.AddDbContext<CentralLoggerContext>(options => options.UseNpgsql(Configuration.GetValue("ConnectionString", "")));
            services.AddSignalR();
            services.AddScoped<UserService>();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "My API", Version = "v1" });
            });

        }
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, CentralLoggerContext db, UserService userService)
        {

            GenrateDatabase(db, userService);
            if (env.IsDevelopment())
            {
                var asm = Assembly.GetEntryAssembly();
                var asmName = asm.GetName().Name;
                var defaultOptions = new DefaultFilesOptions();
                defaultOptions.DefaultFileNames.Clear();
                defaultOptions.DefaultFileNames.Add("index.html");
                defaultOptions.FileProvider =
                  new EmbeddedFileProvider(asm, $"{asmName}.wwwroot");
                app
                  .UseDefaultFiles(defaultOptions)
                  .UseStaticFiles(new StaticFileOptions
                  {
                      FileProvider =
                     new EmbeddedFileProvider(asm, $"{asmName}.wwwroot")
                  });

                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }


            app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().AllowCredentials());
            app.UseSwagger();

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
            });

            /* app.UseSignalR(routes =>
            {
                routes.MapHub<ChatHub>("/chatHub");
            });*/

            // app.UseHttpsRedirection();
            app.UseMvc();
            app.UseSignalR(options =>
            {
                options.MapHub<LogHub>("/LogHub");
            });

        }


        private void GenrateDatabase(CentralLoggerContext db, UserService userService)
        {
            var createData = db.Database.EnsureCreated();
            if (createData)
            {
                userService.AddUser("admin", "admin");
            }
        }
    }
}