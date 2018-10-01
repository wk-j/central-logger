using System;
using System.Linq;
using System.Text;
using CentralLogger.Models;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace CentralLogger.Attributes {
    [AttributeUsage(AttributeTargets.Method)]
    public class BasicAuthorizeAttribute : TypeFilterAttribute {
        public BasicAuthorizeAttribute(Type type) : base(type) {
        }
    }

    public class BasicAuthorizeFilter : IAuthorizationFilter {
        private readonly CentralLoggerContext db;
        public BasicAuthorizeFilter(CentralLoggerContext db) {
            this.db = db;
        }

        public void OnAuthorization(AuthorizationFilterContext context) {
            string au = context.HttpContext.Request.Headers["Authorization"];
            if (au != null && au.StartsWith("Basic ")) {
                var encodedUsernamePassword = au.Split(' ', 2, StringSplitOptions.RemoveEmptyEntries)[1]?.Trim();
                try {
                    var decodedUsernamePassword = Encoding.UTF8.GetString(Convert.FromBase64String(encodedUsernamePassword));
                    var username = decodedUsernamePassword.Split(':', 2)[0];
                    var password = decodedUsernamePassword.Split(':', 2)[1];
                    if (IsAuthorized(username, password)) {
                        return;
                    }
                } catch (Exception) {
                    context.HttpContext.Response.Headers["WWW-Authenticate"] = "Basic";
                    context.Result = new UnauthorizedResult();
                }
            }
            // Return authentication type (causes browser to show login dialog)
            context.HttpContext.Response.Headers["WWW-Authenticate"] = "Basic";
            context.Result = new UnauthorizedResult();
        }
        public bool IsAuthorized(string username, string password) {

            var salt = System.Text.Encoding.UTF8.GetBytes("4DI0P3K6");
            var Password = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                    password: password,
                    salt: salt,
                    prf: KeyDerivationPrf.HMACSHA1,
                    iterationCount: 10000,
                    numBytesRequested: 256 / 8));
            var hasUser = db.Users.Any(x => x.User.Equals(username) && x.Password.Equals(Password));
            // Check that username and password are correct
            return hasUser;
        }
    }
}