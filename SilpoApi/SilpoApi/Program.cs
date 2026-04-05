using Infrastructure;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, context, cancellationToken) =>
    {
        document.Servers = [
                new OpenApiServer
            {
                Url = builder.Configuration["ServerRunUrl"]
            }
            ];

        return Task.CompletedTask;
    });
});

// Мтод що будує залежності у infrstructure рівні
builder.Services.AddInfrastructureServices(builder.Configuration);

builder.Services.AddCors();

var app = builder.Build();

app.UseCors(x => x.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

// Configure the HTTP request pipeline.

app.MapOpenApi();

app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/openapi/v1.json", "v1");
    options.OAuthUsePkce();
});

app.UseAuthorization();

app.MapControllers();



app.Run();
