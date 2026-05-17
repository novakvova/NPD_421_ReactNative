using Microsoft.AspNetCore.SignalR;

namespace SilpoApi.Hubs;

public class ChatHub : Hub
{
    public async Task Send(string message)
    {
        await this.Clients.All.SendAsync("Send", message);
    }
}
