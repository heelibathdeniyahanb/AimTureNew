using Google.Api;
using LearningPathGeneration_Backend.Controllers;
using LearningPathGeneration_Backend.Data;
using LearningPathGeneration_Backend.Interfaces;
using LearningPathGeneration_Backend.Models;
using LearningPathGeneration_Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Load configuration from environment variables
// If using DotNetEnv make sure the package is properly referenced
try
{
    DotNetEnv.Env.Load();
}
catch (Exception ex)
{
    Console.WriteLine($"Error loading .env file: {ex.Message}");
    // Continue execution - we'll try to use configuration from appsettings
}

// Add environment variables to configuration
builder.Configuration.AddEnvironmentVariables();

// Get connection string - try from env vars first, then from config
var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DBCon")
                     ?? builder.Configuration.GetConnectionString("DBCon")
                     ?? throw new ArgumentException("Database connection string is not configured.");

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Use your frontend's URL
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Add JWT authentication with safer configuration
var jwtKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY")
           ?? builder.Configuration["JWT:SecretKey"]
           ?? "defaultSecretKeyForDevelopmentOnly12345678901234567890";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtKey)),
        ValidateIssuer = false,    // For development, can be true in production
        ValidateAudience = false,  // For development, can be true in production
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// Add database context
builder.Services.AddDbContext<DatabaseContext>(options => options.UseNpgsql(connectionString));

builder.Services.AddAuthorization();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.WriteIndented = false; // (Optional) no indentation
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register services
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<GoogleAiService>();
builder.Services.AddScoped<YouTubeService>();
builder.Services.AddTransient<EmailController>();
builder.Services.AddScoped<ImageService>();
builder.Services.AddScoped<IAdvertisementService, AdvertismentService>();
builder.Services.AddScoped<ISpecificationService, SpecificationService>();
builder.Services.AddScoped<IAdvertisementProviderService, AdvertisementProviderService>();
builder.Services.AddScoped<IAdSpecificationService,AdSpecificationService>();

builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddHttpClient();
var configuration = builder.Configuration;
var cloudinarySettings = configuration.GetSection("CloudinarySettings").Get<CloudinarySettings>();

var app = builder.Build();

// Apply migrations at startup (optional)
try
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<DatabaseContext>();
        dbContext.Database.Migrate();
    }
}
catch (Exception ex)
{
    // Log the error but don't stop the app
    Console.WriteLine($"Error applying migrations: {ex.Message}");
}

app.UseCors("AllowSpecificOrigin");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();