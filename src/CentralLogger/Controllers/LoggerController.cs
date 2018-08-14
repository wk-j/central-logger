using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using System.Web;
using CentralLogger.Model;
namespace CentralLogger.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LoggerController : ControllerBase
    {

        private readonly CentralLoggerContext db;
        public LoggerController(CentralLoggerContext _db)
        {
            db = _db;
        }


        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<string>> ShowAll()
        {

            try
            {
                var Logger = db.LogInfos.OrderBy(x => x.Id).ToList();
                return Ok(Logger);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }

        }
        [HttpPost]
        public List<LogInfo> FilterDate(SearchDate searchDate)
        {
            searchDate.StartDate = searchDate.StartDate.ToLocalTime();
            searchDate.EndDate = searchDate.EndDate.ToLocalTime();
            //var LogDate = db.LogInfos.Select(c => c.DateTime).ToList();

            // Get data from LogInfos
            var SelectDate = (from c in db.LogInfos
                              where c.DateTime >= searchDate.StartDate && c.DateTime <= searchDate.EndDate
                              select c).ToList();

            return SelectDate;
        }
        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public ActionResult WriteLog([FromBody]GetLogInfos x)
        {
            var requestIp = System.Net.Dns.GetHostEntry(System.Net.Dns.GetHostName()).AddressList.GetValue(0).ToString();
            db.LogInfos.Add(new LogInfo()
            {
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
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public async void Delete(int id)
        {
            await db.Database.EnsureDeletedAsync();
        }
    }
}
