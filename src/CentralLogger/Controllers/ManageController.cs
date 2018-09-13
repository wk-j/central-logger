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
using System.Collections.Concurrent;
using System.Timers;
using CentralLogger;


namespace CentralLogger.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ManageController : ControllerBase
    {
        private readonly CentralLoggerContext db;
        private readonly UserService userService;
        public ManageController(CentralLoggerContext db, UserService userService)
        {
            this.db = db;
            this.userService = userService;
        }

        [HttpPost]
        public ActionResult AddManager([FromBody]GetUsers data)
        {
            var userlist = db.Users.Where(x => x.User == data.Users).Select(x => x.User).FirstOrDefault();
            if (userlist != data.Users && data.Users != null)
            {
                userService.AddUser(data.Users, data.Password);
                return Ok();
            }
            else
            {
                return BadRequest();
            }

        }

        [HttpGet]
        public ActionResult DeleteManager(string User)
        {
            var del = db.Users.Where(data => data.User == User).FirstOrDefault();
            if (del != null && User != "admin")
            {
                db.Users.Remove(del);
                db.SaveChanges();
                return Ok();
            }
            else
                return BadRequest();
        }

        [HttpGet]
        public ActionResult<IEnumerable<GetUsers>> ShowMyUser()
        {
            try
            {
                var showUsers = db.Users.Select(data => data.User).ToArray();
                return Ok(showUsers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

    }
}