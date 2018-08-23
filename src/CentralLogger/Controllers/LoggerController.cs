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

namespace CentralLogger.Controllers {
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LoggerController : ControllerBase {

        private readonly CentralLoggerContext db;
        private readonly IHubContext<LogHub> hubContext;
        public LoggerController(CentralLoggerContext _db, IHubContext<LogHub> _hubContext) {
            db = _db;
            hubContext = _hubContext;
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
        public ActionResult<List<LogInfo>> Search(SearchLog search) {
            search.StartDate = search.StartDate.ToLocalTime();
            search.EndDate = search.EndDate.ToLocalTime();
            var data = db.LogInfos.Where(x => x.DateTime >= search.StartDate && x.DateTime <= search.EndDate);

            if (!string.IsNullOrEmpty(search.IpNow)) {
                data = data.Where(x => x.Ip.Equals(search.IpNow));
            }
            if (!string.IsNullOrEmpty(search.AppNow)) {
                data = data.Where(x => x.Application.Equals(search.AppNow));
            }

            var result = data.OrderByDescending(x => x.Id).ToList();
            return result;
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
            //var requestIp = System.Net.Dns.GetHostEntry(System.Net.Dns.GetHostName()).AddressList.GetValue(0).ToString();
            var requestIp = HttpContext.Request.HttpContext.Connection.RemoteIpAddress.ToString();
            if (requestIp.Equals("::1")) {
                requestIp = System.Net.Dns.GetHostEntry(System.Net.Dns.GetHostName()).AddressList.GetValue(0).ToString();
            }
            // var requestIp = System.Net.Dns.GetHostName();
            var date = DateTime.Now.ToString("MM/dd/yyyy hh:mm:ss.fff");
            var time = DateTime.Now;

            db.LogInfos.Add(new LogInfo() {
                LogLevel = x.LogLevel,
                Message = x.Message,
                DateTime = x.DateTime,
                Application = x.Application,
                Ip = requestIp,
                Category = x.Catelog
            });
            var data = new LogInfo() {
                LogLevel = x.LogLevel,
                Message = x.Message,
                DateTime = x.DateTime,
                Application = x.Application,
                Ip = requestIp,
                Category = x.Catelog
            };
            db.SaveChanges();
            await hubContext.Clients.All.SendAsync("LogReceived", data);
            return Ok();
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
