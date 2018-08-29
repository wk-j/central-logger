using System;
using System.ComponentModel.DataAnnotations;

namespace CentralLogger.Model {

    public class SearchLog {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string IpNow { get; set; }
        public string AppNow { get; set; }
        public string CatelogNow { get; set; }
        [Range(1, Int32.MaxValue)]
        public int Section { get; set; }
    }
}