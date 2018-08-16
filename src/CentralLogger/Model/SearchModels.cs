using System;


namespace CentralLogger.Model {

    public class SearchLog {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string IpNow { get; set; }
        public string Appnow { get; set; }
    }
}