namespace CentralLogProvider {

    public class CentralLogOptions {
        public string serviceUrl { get; set; }
        public CentralLogOptions(string serviceUrl) {
            this.serviceUrl = serviceUrl;
        }
    }
}