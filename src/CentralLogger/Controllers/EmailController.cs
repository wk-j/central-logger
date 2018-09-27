using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CentralLogger.Hubs;
using CentralLogger.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace CentralLogger.Controllers {
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EmailController : ControllerBase {
        private readonly EmailService email;
        private readonly CentralLoggerContext db;
        private readonly IHubContext<LogHub> hubContext;

        private readonly UserService userService;



        public EmailController(CentralLoggerContext db, IHubContext<LogHub> hubContext, EmailService email, UserService userService) {
            this.db = db;
            this.hubContext = hubContext;
            this.email = email;
            this.userService = userService;
        }
        [HttpPost]
        public ActionResult AddEmails([FromBody]GetEmail x) {
            var applist = db.Emails.Where(m => m.Application == x.Application).Select(m => m.Application).FirstOrDefault();
            if (applist != x.Application && x.Application != null) {
                db.Emails.Add(new Emails {
                    Application = x.Application,
                    Email_1 = x.Email_1,
                    Email_2 = x.Email_2,
                    Email_3 = x.Email_3,
                    Enable = x.Enable
                });
                db.SaveChanges();
                return Ok();
            } else {
                return BadRequest();
            }

        }
        [HttpGet]
        public async Task<IEnumerable<string>> SearchExceptApp() {
            /////ใช้ในการเลือกAppจากdata//////
            var appLog = await db.LogInfos.Select(m => m.Application).ToListAsync();
            var appMail = await db.Emails.Select(m => m.Application).ToListAsync();
            var result = appLog.Except(appMail);
            return result;
        }
        [HttpPost]
        public async Task<ActionResult> UpdateEmail([FromBody]GetEmail Mail) {
            var applist = db.Emails.Where(m => m.Application == Mail.Application).Select(m => m.Application).FirstOrDefault();
            if (applist == Mail.Application) {
                var value = await db.Emails.Where(o => o.Application == Mail.Application).ToListAsync();
                foreach (var data in value) {
                    data.Email_1 = Mail.Email_1;
                    data.Email_2 = Mail.Email_2;
                    data.Email_3 = Mail.Email_3;
                    data.Enable = Mail.Enable;
                }
                await db.SaveChangesAsync();
                return Ok();
            } else {
                return BadRequest();
            }
        }

        [HttpPost]
        public ActionResult SetEnable(Boolean data) {
            db.Emails.Update(new Emails {
                Enable = !data
            });
            db.SaveChanges();
            return Ok();
        }

        [HttpGet]
        public ActionResult DeleteApp(string AppName) {
            var del = db.Emails.FirstOrDefault(o => o.Application == AppName);
            if (del != null) {
                db.Emails.Remove(del);
                db.SaveChanges();
                return Ok();
            } else
                return BadRequest();
        }

        [HttpGet]
        public ActionResult<IEnumerable<GetEmail>> ShowMailApp() {
            try {
                var Application = db.Emails.OrderBy(x => x.Id).ToList();
                return Ok(Application);
            } catch (Exception ex) {
                return StatusCode(500, ex);
            }
        }

        [HttpGet]
        public string DisableEmail(string email) {
            var emaillist1 = db.Emails.Where(m => m.Email_1 == email).Select(m => m.Application).FirstOrDefault();
            var emaillist2 = db.Emails.Where(m => m.Email_2 == email).Select(m => m.Application).FirstOrDefault();
            var emaillist3 = db.Emails.Where(m => m.Email_3 == email).Select(m => m.Application).FirstOrDefault();
            //if (emaillist1 != null || emaillist2 != null || emaillist3 != null) {
            if (emaillist1 != null) {
                var update = db.Emails.FirstOrDefault(o => o.Application == emaillist1);
                update.Email_1 = "";
                db.SaveChanges();
                var text = "Your email has been unsubscribe. Thank you";
                return text;
            }
            if (emaillist2 != null) {
                var update = db.Emails.FirstOrDefault(o => o.Application == emaillist2);
                update.Email_2 = "";
                db.SaveChanges();
                var text = "Your email has been unsubscribe. Thank you";
                return text;
            }
            if (emaillist3 != null) {
                var update = db.Emails.FirstOrDefault(o => o.Application == emaillist3);
                update.Email_3 = "";
                db.SaveChanges();
                var text = "Your email has been unsubscribe. Thank you";
                return text;
            } else {
                var text = "Found something wrong. Please contact Admin. Thank you";
                return text;
            }
        }


    }

}
