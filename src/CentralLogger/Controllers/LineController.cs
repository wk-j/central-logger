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
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace CentralLogger.Controllers {
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LineController : ControllerBase {
        private readonly CentralLoggerContext db;
        public LineController(CentralLoggerContext db) {
            this.db = db;
        }

        [HttpPost]
        public ActionResult AddLine([FromBody]GetLine code) {

            var lineList = db.Line.Where(c => c.LineId == code.LineId).Select(o => o.LineId).FirstOrDefault();
            if (lineList != code.LineId) {
                db.Line.Add(new Line {
                    LineId = code.LineId
                });
                db.SaveChanges();
                return Ok();
            } else
                return BadRequest();
        }

        [HttpPost]
        public ActionResult DeleteLine([FromBody]GetLine code) {
            var delLine = db.Line.FirstOrDefault(x => x.LineId == code.LineId);
            if (delLine != null) {
                db.Line.Remove(delLine);
                db.SaveChanges();
                return Ok();
            } else
                return BadRequest();

        }

    }
}