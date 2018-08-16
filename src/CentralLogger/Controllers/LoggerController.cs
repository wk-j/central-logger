using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using System.Web;
using CentralLogger.Model;
namespace CentralLogger.Controllers {
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LoggerController : ControllerBase {

        private readonly CentralLoggerContext db;
        public LoggerController(CentralLoggerContext _db) {
            db = _db;
        }


        // GET api/values
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
        public List<LogInfo> FilterAll(SearchAll all) {
            all.StartDate = all.StartDate.ToLocalTime();
            all.EndDate = all.EndDate.ToLocalTime();
            var SelectAll = (from c in db.LogInfos
                             where c.DateTime >= all.StartDate && c.DateTime <= all.EndDate
                             && c.Ip == all.IpNow && c.Application == all.Appnow
                             orderby c.DateTime
                             select c).ToList();

            return SelectAll;
        }
        [HttpPost]
        public List<LogInfo> FilterIp(SearchIp ip) {
            ip.StartDate = ip.StartDate.ToLocalTime();
            ip.EndDate = ip.EndDate.ToLocalTime();
            var SelectIp = (from c in db.LogInfos
                            where c.DateTime >= ip.StartDate && c.DateTime <= ip.EndDate
                            && c.Ip == ip.IpNow
                            orderby c.DateTime
                            select c).ToList();

            return SelectIp;
        }
        [HttpPost]
        public List<LogInfo> FilterApp(SearchApp searchApp) {
            searchApp.StartDate = searchApp.StartDate.ToLocalTime();
            searchApp.EndDate = searchApp.EndDate.ToLocalTime();
            var SelectApp = (from c in db.LogInfos
                             where c.DateTime >= searchApp.StartDate && c.DateTime <= searchApp.EndDate
                             && c.Application == searchApp.Appnow
                             orderby c.DateTime
                             select c).ToList();

            return SelectApp;
        }
        [HttpPost]
        public List<LogInfo> FilterDate(SearchDate searchDate) {
            searchDate.StartDate = searchDate.StartDate.ToLocalTime();
            searchDate.EndDate = searchDate.EndDate.ToLocalTime();
            //var LogDate = db.LogInfos.Select(c => c.DateTime).ToList();

            // Get data from LogInfos
            var SelectDate = (from c in db.LogInfos
                              where c.DateTime >= searchDate.StartDate && c.DateTime <= searchDate.EndDate
                              orderby c.DateTime
                              select c).ToList();

            return SelectDate;
        }

        [HttpGet]
        public IEnumerable<string> getIP() {
            var Ip = db.LogInfos.Select(m => m.Ip).Distinct();
            return Ip.ToList();
        }

        [HttpGet]
        public IEnumerable<string> getApp() {
            var App = db.LogInfos.Select(m => m.Application).Distinct();
            return App.ToList();
        }
        [HttpPost]
        public ActionResult WriteLog([FromBody]GetLogInfos x) {
            var requestIp = System.Net.Dns.GetHostEntry(System.Net.Dns.GetHostName()).AddressList.GetValue(0).ToString();
            db.LogInfos.Add(new LogInfo() {
                LogLevel = x.LogLevel,
                Message = x.Message,
                DateTime = x.DateTime,
                Application = x.Application,
                Ip = requestIp
            });
            db.SaveChanges();
            return Ok();
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value) {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public async void Delete(int id) {
            await db.Database.EnsureDeletedAsync();
        }
    }
}
