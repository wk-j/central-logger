using System;
using System.Linq;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Http;

namespace CentralLogger.Services {
    public class UserService {
        private readonly byte[] salt;
        private readonly CentralLoggerContext db;

        public UserService(CentralLoggerContext db) {
            this.db = db;
            this.salt = System.Text.Encoding.UTF8.GetBytes("4DI0P3K6");
        }

        public bool AddUser(string username, string password) {
            string hashedKey = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: password,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA1,
            iterationCount: 10000,
            numBytesRequested: 256 / 8));

            var hasUser = db.Users.Where(x => x.User.Equals(username)).Any();

            if (!hasUser) {
                db.Users.Add(new Users() {
                    User = username,
                    Password = hashedKey
                });
                db.SaveChanges();
            }

            return false;
        }
    }
}