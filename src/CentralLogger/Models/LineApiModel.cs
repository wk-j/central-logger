using System.Collections.Generic;

namespace CentralLogger.Models {
    public class LineContent {
        public List<string> To { get; set; }
        public List<LineMessage> Messages { get; set; }

        public LineContent() {
            Messages = new List<LineMessage>();
        }
    }

    public class LineMessage {
        public string Type { get; set; }
        public string Text { get; set; }
    }
}