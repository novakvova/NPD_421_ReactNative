using Application.Interfaces;
using Bogus;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using static Bogus.DataSets.Name;

namespace Application.Services;

public class SeederService(UserManager<UserEntity> userManager) : ISeederService
{
    public async Task SeedUsersAsync()
    {
        if(await userManager.Users.AnyAsync())
        {
            return;
        }
        int count = 10;
        for (int i = 0; i < count; i++)
        {
            var faker = new Faker("uk");
            var gender = faker.PickRandom<Gender>();

            var user = new UserEntity
            {
                FirstName = faker.Name.FirstName(gender),
                LastName = faker.Name.LastName(gender),
                Email = faker.Internet.Email()
            };
            user.UserName = user.Email;
            await userManager.CreateAsync(user, "123456");
        }
    }
}
