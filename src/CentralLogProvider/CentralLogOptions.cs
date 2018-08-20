namespace CentralLogProvider {

    public class CentralLogOptions {
        public string ServiceUrl { get; set; }
        public CentralLogOptions(string serviceUrl) {
            this.ServiceUrl = serviceUrl;
        }
    }
}