using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using NimGameApi.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configura a connection string do banco de dados SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configura os controllers (API)
builder.Services.AddControllers();

// Configura Swagger para documentação da API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configura JWT Authentication
var secret = builder.Configuration["JWTSecret"];
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
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});

// Configura autorização (necessário para usar o [Authorize] nos controllers)
builder.Services.AddAuthorization();

// Injeção de dependência dos seus serviços (exemplo)
// builder.Services.AddScoped<IUserService, UserService>();
// builder.Services.AddScoped<INimService, NimService>();

var app = builder.Build();

// Middleware para desenvolvimento
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// **A ordem importa:** primeiro autenticação, depois autorização
app.UseAuthentication();
app.UseAuthorization();

// Mapeia as rotas dos controllers
app.MapControllers();

app.Run();
