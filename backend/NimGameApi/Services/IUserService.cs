using NimGameApi.Models;

namespace NimGameApi.Services
{
    public interface IUserService
    {
        User? Authenticate(string username, string password);
        User Register(string username, string password);
        User? GetById(int id);
    }
}
