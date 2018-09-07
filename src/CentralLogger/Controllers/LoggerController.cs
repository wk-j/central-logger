using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using System.Web;
using CentralLogger.Model;
using System.Globalization;
using Microsoft.AspNetCore.SignalR;
using CentralLogger.Hubs;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using CentralLogger.Services;
using System.Net.Mail;
using System.Net;
using Microsoft.Extensions.Configuration;

namespace CentralLogger.Controllers {
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LoggerController : ControllerBase {

        private readonly CentralLoggerContext db;
        private readonly IHubContext<LogHub> hubContext;
        private readonly IConfiguration configuration;
        public LoggerController(CentralLoggerContext db, IHubContext<LogHub> hubContext, IConfiguration configuration) {
            this.db = db;
            this.hubContext = hubContext;
            this.configuration = configuration;
        }

        [HttpGet]
        public ActionResult<IEnumerable<string>> ShowAll() {
            try {
                var Logger = db.LogInfos.OrderBy(x => x.Id).ToList();
                return Ok(Logger);
            } catch (Exception ex) {
                return StatusCode(500, ex);
            }
        }

        [HttpPost]
        public async Task<ActionResult<List<LogInfo>>> Search(SearchLog search) {
            int perSection = 50;
            search.StartDate = search.StartDate.ToLocalTime();
            search.EndDate = search.EndDate.ToLocalTime();
            var data = db.LogInfos.Where(x => x.DateTime >= search.StartDate && x.DateTime <= search.EndDate);

            var skip = (search.Section - 1) * perSection;

            if (!string.IsNullOrEmpty(search.IpNow)) {
                data = data.Where(x => x.Ip.Equals(search.IpNow));
            }
            if (!string.IsNullOrEmpty(search.AppNow)) {
                data = data.Where(x => x.Application.Equals(search.AppNow));
            }

            var dataLength = await data.CountAsync();
            var result = await data.OrderByDescending(x => x.DateTime).Skip(skip).Take(perSection).ToListAsync();
            return Ok(new { LogInfo = result, DataLength = dataLength });
        }

        [HttpGet]
        public IEnumerable<string> GetIP() {
            var Ip = db.LogInfos.Select(m => m.Ip).Distinct();
            return Ip.ToList();
        }

        [HttpGet("{ip}")]
        public IEnumerable<string> GetApp(string ip) {
            if (!string.IsNullOrEmpty(ip)) {
                var App = db.LogInfos.Where(x => x.Ip.Equals(ip)).Select(m => m.Application).Distinct();
                return App.ToList();
            }
            return Enumerable.Empty<string>();
        }
        [HttpPost]
        public async Task<ActionResult> AddLog([FromBody]GetLogInfos x) {

            var date = DateTime.Now.ToString("MM/dd/yyyy hh:mm:ss.fff");
            var time = DateTime.Now;

            db.LogInfos.Add(new LogInfo() {
                LogLevel = x.LogLevel,
                Message = x.Message,
                DateTime = x.DateTime,
                Application = x.Application,
                Ip = x.Ip,
                Category = x.Catelog
            });
            var data = new LogInfo() {
                LogLevel = x.LogLevel,
                Message = x.Message,
                DateTime = x.DateTime,
                Application = x.Application,
                Ip = x.Ip,
                Category = x.Catelog
            };
            if (data.LogLevel == LogLevel.Critical) {
                // var Email = db.Emails.Where(z => z.Enable == true && z.Application == data.Application ).Select(m => new { m.Email_1,  m.Email_2, m.Email_3 }).ToList();
                var Email1 = db.Emails.Where(z => z.Enable == true && z.Application == data.Application ).Select(m => m.Email_1).ToList();
                var Email2 = db.Emails.Where(z => z.Enable == true && z.Application == data.Application ).Select(m => m.Email_2).ToList();
                var Email3 = db.Emails.Where(z => z.Enable == true && z.Application == data.Application ).Select(m => m.Email_3).ToList();
                var allEmail = Email1.Union(Email2).Union(Email3).ToArray();
                foreach(var email in allEmail)
                {
                    if(!string.IsNullOrEmpty(email)){
                        await sendMail(data,email);
                    }
                }
            }
            db.SaveChanges();
            await hubContext.Clients.All.SendAsync("LogReceived", data);
            return Ok();
        }
        public async Task sendMail(LogInfo data, string Email) {
            string subject = $"Critical Alert {data.Application} [ {data.Ip} ]";
            string body = $"Found Critical:@Application : {data.Application}@Datetime : {data.DateTime}@Category : {data.Category}@IP : {data.Ip}@Message : {data.Message}";
            body = body.Replace("@", Environment.NewLine);
            string FromMail = configuration["Email:Account"];
            string Password = configuration["Email:Password"];
            string emailTo = Email;
            MailMessage mail = new MailMessage();
            SmtpClient SmtpServer = new SmtpClient("smtp.gmail.com");
            SmtpServer.UseDefaultCredentials = false;
            SmtpServer.EnableSsl = true;
            SmtpServer.Port = 587; 
            SmtpServer.Credentials = new System.Net.NetworkCredential(FromMail, Password);
            mail.From = new MailAddress(FromMail);
            mail.To.Add(emailTo);
            mail.Subject = subject;
            mail.Body = body;
            await SmtpServer.SendMailAsync(mail);
        }

        [HttpPost]
        public async Task<ActionResult> LoginRequest([FromBody]GetLoginRequest request, [FromServices] UserService userService) {

            var IsAuthorized = await userService.IsAuthorized(request.User, request.Pass);
            if (IsAuthorized) {
                if (request.User != null) {
                    //  base64 UTF8 (request.User:request.pass)
                    var account = $"{request.User}:{request.Pass}";
                    var accountBytes = System.Text.Encoding.UTF8.GetBytes(account);

                    var result = new { accessToken = Convert.ToBase64String(accountBytes) };
                    return Ok(result);
                }
            }
            return Unauthorized();
        }

        [HttpDelete("{id}")]
        public async void Delete(int id) {
            await db.Database.EnsureDeletedAsync();
        }
    }

}
