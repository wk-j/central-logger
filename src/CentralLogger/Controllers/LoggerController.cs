using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

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
        public ActionResult<IEnumerable<string>> Get() {

            /* db.LogInfos.Add(new LogInfo() {
                 Id = 001,
                 LogLevel = 0,
                 Message = "Hellow",
                 DateTime = DateTime.Now,
                 Application = "Hi guy !!!!!",
                 Ip = "192.168.1.1",
             });
             db.SaveChanges();*/



            try {
                var Logger = db.LogInfos.OrderBy(x => x.Id).ToList();
                return Ok(Logger);
            } catch (Exception ex) {
                return StatusCode(500, ex);
            }
            //return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id) {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public ActionResult writeLog([FromBody]GetLogInfos x) {
            db.LogInfos.Add(new LogInfo() {
                LogLevel = x.LogLevel,
                Message = x.Message,
                DateTime = x.DateTime,
                Application = x.Application,
                Ip = x.Ip,
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
