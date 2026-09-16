using dotnet_backend.Models;
using Microsoft.EntityFrameworkCore;
using static dotnet_backend.Models.UserDbContext;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

//links to user connction service
builder.Services.AddDbContext<UserDbContext>(options =>
    options.useSQLServer(builder.Configuration.GetConnectionString("UserDbConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();;

app.MapControllers();

app.Run();
