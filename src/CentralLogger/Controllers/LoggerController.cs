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


namespace CentralLogger.Controllers {
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LoggerController : ControllerBase {

        private readonly CentralLoggerContext db;
        private readonly IHubContext<LogHub> hubContext;
        public LoggerController(CentralLoggerContext db, IHubContext<LogHub> hubContext) {
            this.db = db;
            this.hubContext = hubContext;
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
            db.SaveChanges();
            await hubContext.Clients.All.SendAsync("LogReceived", data);
            return Ok();
        }

        [HttpPost]
        public ActionResult LoginRequest([FromBody]GetLoginRequest request) {

            var checkUser = db.Users.Where(x => x.User.Equals(request.User));
            if (checkUser != null) {

                string password = request.Pass;
                var salt = System.Text.Encoding.UTF8.GetBytes("4DI0P3K6");
                string hashedKey = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));
                var checkpass = db.Users.Where(x => x.User.Equals(request.User)).Select(m => m.User.Equals(request.User) && m.Password.Equals(hashedKey));
                if (checkpass != null) {
                    return Ok();
                } else {
                    return Unauthorized();
                }
            } else {
                return Unauthorized();
            }

        }


        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value) {
        }

        [HttpDelete("{id}")]
        public async void Delete(int id) {
            await db.Database.EnsureDeletedAsync();
        }
    }
}
