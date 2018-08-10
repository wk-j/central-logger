using System;

namespace CentralLogProvider {
    public class GetLog {
        public string LogLevel { get; set; }
        public string Message { get; set; }
        public DateTime DateTime { set; get; } = DateTime.Now;
        public string Application { get; set; }
    }
}