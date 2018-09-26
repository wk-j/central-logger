using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Timers;
using Microsoft.Extensions.Configuration;

namespace CentralLogger.Services {
    public class EmailService {

        private readonly ConcurrentQueue<LogInfo> queue = new ConcurrentQueue<LogInfo>();
        private readonly ConcurrentQueue<string> queueMail = new ConcurrentQueue<string>();

        private readonly Timer timer;
        private readonly IConfiguration configuration;
        public EmailService(IConfiguration configuration) {

            Console.WriteLine("Create MailService instance");

            this.configuration = configuration;
            timer = new Timer(100);
            timer.Start();
            timer.AutoReset = false;
            timer.Elapsed += SendEmail;
        }

        public void Enqueue(LogInfo info) {
            queue.Enqueue(info);
        }
        public void EnqueueMail(string email) {
            queueMail.Enqueue(email);
        }

        private async void SendEmail(object sender, ElapsedEventArgs args) {
            while (queue.TryDequeue(out var data)) {
                while (queueMail.TryDequeue(out var mail)) {
                    await CheckEmail(data, mail);
                }
            }
            timer.Start();
        }
        public async Task CheckEmail(LogInfo data, string mail) {
            if (!string.IsNullOrEmpty(mail)) {
                await SendEmail(data, mail);
            }
        }

        public async Task SendEmail(LogInfo data, string Email) {
            var subject = $"Critical Alert {data.Application} [ {data.Ip} ]";
            var body = $"Found Critical:@Application : {data.Application}@Datetime : {data.DateTime}@Category : {data.Category}@IP : {data.Ip}@Message : {data.Message}\n\n\n\nถ้าต้องการยกเลิกการติดตามโปรดคลิกลิงค์ด้านล่าง :@";
            body = body.Replace("@", Environment.NewLine);
            var FromMail = configuration["Email:Account"];
            var Password = configuration["Email:Password"];
            var emailTo = Email;

            using (var mail = new MailMessage())
            using (SmtpClient smtpServer = new SmtpClient("smtp.gmail.com")) {
                smtpServer.UseDefaultCredentials = false;
                smtpServer.EnableSsl = true;
                smtpServer.Port = 587;
                smtpServer.Credentials = new System.Net.NetworkCredential(FromMail, Password);
                mail.From = new MailAddress(FromMail);
                mail.To.Add(emailTo);
                mail.Subject = subject;
                mail.Body = body;
                await smtpServer.SendMailAsync(mail);
            }
        }
    }
}
