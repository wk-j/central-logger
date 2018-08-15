using System;


namespace CentralLogger.Model {

    public class SearchDate {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

    }
    public class SearchIp {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public string IpNow { get; set; }
    }
    public class SearchApp {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public string Appnow { get; set; }
    }
    public class SearchAll {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Appnow { get; set; }
        public string IpNow { get; set; }

    }
}