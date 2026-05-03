using Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Auth.Register;

public class RegisterCommand : IRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}

public class RegisterCommandHandler(UserManager<UserEntity> userManager) : IRequestHandler<RegisterCommand>
{
    public async Task Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // написати логіку ств. користувача в бд
        var user = await userManager.FindByEmailAsync(request.Email);
        if(user != null)
        {
            throw new Exception("Дана електронна пошта уже зареєстрована!");
        }

        user = new UserEntity()
        {
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            UserName = request.Email
        };


        var res = await userManager.CreateAsync(user, request.Password);
        if (!res.Succeeded)
        {
            string errMsg = "";
            foreach (var error in res.Errors)
            {
                errMsg += error.Description + "\n";
            }
            throw new Exception(errMsg);
        }
    }
}
