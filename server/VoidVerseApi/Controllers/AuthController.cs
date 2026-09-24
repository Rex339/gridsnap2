using System.Security.Claims;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VoidVerseApi.Data;
using VoidVerseApi.Models;
using VoidVerseApi.Services;

namespace VoidVerseApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly VoidVerseDbContext _db;
    private readonly TokenService _tokenService;

    public AuthController(VoidVerseDbContext db, TokenService tokenService)
    {
        _db = db;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password) || string.IsNullOrWhiteSpace(request.Email))
            return BadRequest(new { message = "Username, email, and password are required." });

        if (request.Username.Length < 3 || request.Username.Length > 20)
            return BadRequest(new { message = "Username must be 3-20 characters." });

        if (request.Password.Length < 8 || request.Password.Length > 128)
            return BadRequest(new { message = "Password must be 8-128 characters." });

        var userExists = await _db.Users.AnyAsync(u => u.Username == request.Username || u.Email == request.Email);
        if (userExists)
            return Conflict(new { message = "That username or email is already in use." });

        var user = new UserAccount
        {
            Username = request.Username.Trim(),
            Email = request.Email.Trim(),
            PasswordHash = BCrypt.HashPassword(request.Password),
            AvatarColor = "violet"
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            token = _tokenService.CreateToken(user.Id.ToString(), user.Username),
            user = new
            {
                user.Id,
                user.Username,
                user.Email,
                user.Tix,
                user.VvTokens,
                user.AvatarColor,
                user.EquippedItemId,
                user.EquippedEmoteId
            }
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Identifier) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Identifier and password are required." });

        var user = await _db.Users.FirstOrDefaultAsync(u =>
            u.Username == request.Identifier || u.Email == request.Identifier);

        if (user == null || !BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid credentials." });

        user.UpdatedAtUtc = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(new
        {
            token = _tokenService.CreateToken(user.Id.ToString(), user.Username),
            user = new
            {
                user.Id,
                user.Username,
                user.Email,
                user.Tix,
                user.VvTokens,
                user.AvatarColor,
                user.EquippedItemId,
                user.EquippedEmoteId
            }
        });
    }
}

public record RegisterRequest(string Username, string Email, string Password);
public record LoginRequest(string Identifier, string Password);
