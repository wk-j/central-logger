using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using CentralLogger.Models;
using CentralLogger.Controllers;

namespace CentralLogger.Hubs {
    public class LogHub : Hub {
        public async Task NewLog(LogInfo log) {
            await Clients.All.SendAsync("LogReceived", log);
        }
    }
}