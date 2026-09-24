using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VoidVerseApi.Data;

namespace VoidVerseApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PlayerController : ControllerBase
{
    private readonly VoidVerseDbContext _db;

    public PlayerController(VoidVerseDbContext db)
    {
        _db = db;
    }

    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

        var user = await _db.Users
            .Include(u => u.Inventory)
            .Include(u => u.QuestProgress)
            .FirstOrDefaultAsync(u => u.Id.ToString() == userId);

        if (user == null) return NotFound();

        return Ok(new
        {
            user.Id,
            user.Username,
            user.Email,
            user.Tix,
            user.VvTokens,
            user.AvatarColor,
            user.EquippedItemId,
            user.EquippedEmoteId,
            inventory = user.Inventory.Select(i => new { i.ItemId, i.Name, i.Kind, i.IsEquipped }),
            quests = user.QuestProgress.Select(q => new { q.QuestKey, q.IsCompleted, q.Progress, q.RewardClaimed })
        });
    }

    [HttpGet("catalog")]
    public IActionResult Catalog()
    {
        return Ok(new
        {
            items = new[]
            {
                new { id = "nebula-hood", name = "Nebula Hood", kind = "Headwear", price = 8 },
                new { id = "orbit-aura", name = "Orbit Aura", kind = "Aura", price = 12 },
                new { id = "void-wings", name = "Void Wings", kind = "Back item", price = 18 },
                new { id = "pixel-crown", name = "Pixel Crown", kind = "Headwear", price = 25 }
            },
            emotes = new[]
            {
                new { id = "wave", name = "Cosmic Wave", price = 4 },
                new { id = "spark", name = "Sparkle", price = 6 },
                new { id = "dance", name = "Zero-G Dance", price = 10 },
                new { id = "laugh", name = "Star Laugh", price = 7 }
            }
        });
    }

    [HttpPost("purchase")]
    public async Task<IActionResult> Purchase([FromBody] PurchaseRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

        var user = await _db.Users.Include(u => u.Inventory).FirstOrDefaultAsync(u => u.Id.ToString() == userId);
        if (user == null) return NotFound();

        var itemCatalog = new Dictionary<string, int>
        {
            ["nebula-hood"] = 8,
            ["orbit-aura"] = 12,
            ["void-wings"] = 18,
            ["pixel-crown"] = 25,
            ["wave"] = 4,
            ["spark"] = 6,
            ["dance"] = 10,
            ["laugh"] = 7
        };

        if (!itemCatalog.TryGetValue(request.ItemId, out var price))
            return BadRequest(new { message = "Unknown item." });

        if (user.VvTokens < price)
            return BadRequest(new { message = "Not enough VV tokens." });

        if (!user.Inventory.Any(i => i.ItemId == request.ItemId))
        {
            user.Inventory.Add(new Models.InventoryItem
            {
                ItemId = request.ItemId,
                Name = request.ItemId.Replace('-', ' '),
                Kind = request.ItemId.Contains("wave") || request.ItemId.Contains("spark") || request.ItemId.Contains("dance") || request.ItemId.Contains("laugh") ? "Emote" : "Item",
                Price = price,
                IsEquipped = false
            });
        }

        user.VvTokens -= price;
        user.UpdatedAtUtc = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(new { message = "Purchase successful." });
    }

    [HttpPost("equip-item")]
    public async Task<IActionResult> EquipItem([FromBody] EquipRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

        var user = await _db.Users.Include(u => u.Inventory).FirstOrDefaultAsync(u => u.Id.ToString() == userId);
        if (user == null) return NotFound();

        var target = user.Inventory.FirstOrDefault(i => i.ItemId == request.ItemId);
        if (target == null) return BadRequest(new { message = "Item not owned." });

        foreach (var item in user.Inventory)
            item.IsEquipped = false;

        target.IsEquipped = true;
        user.EquippedItemId = request.ItemId;
        user.UpdatedAtUtc = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(new { message = "Item equipped." });
    }

    [HttpPost("equip-emote")]
    public async Task<IActionResult> EquipEmote([FromBody] EquipRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

        var user = await _db.Users.Include(u => u.Inventory).FirstOrDefaultAsync(u => u.Id.ToString() == userId);
        if (user == null) return NotFound();

        if (!user.Inventory.Any(i => i.ItemId == request.ItemId))
            return BadRequest(new { message = "Emote not owned." });

        user.EquippedEmoteId = request.ItemId;
        user.UpdatedAtUtc = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(new { message = "Emote equipped." });
    }

    [HttpPost("quests/{questKey}/claim")]
    public async Task<IActionResult> ClaimQuest(string questKey)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

        var user = await _db.Users.Include(u => u.QuestProgress).FirstOrDefaultAsync(u => u.Id.ToString() == userId);
        if (user == null) return NotFound();

        var quest = user.QuestProgress.FirstOrDefault(q => q.QuestKey == questKey);
        if (quest == null)
        {
            quest = new Models.QuestProgress
            {
                QuestKey = questKey,
                IsCompleted = true,
                RewardClaimed = false,
                Progress = 100
            };
            user.QuestProgress.Add(quest);
        }

        if (quest.RewardClaimed)
            return Ok(new { message = "Quest already claimed." });

        quest.IsCompleted = true;
        quest.RewardClaimed = true;
        quest.Progress = 100;

        var rewards = new Dictionary<string, int>
        {
            ["customize"] = 10,
            ["portal"] = 25,
            ["emote"] = 15,
            ["world"] = 20
        };

        if (rewards.TryGetValue(questKey, out var reward))
            user.Tix += reward;

        user.UpdatedAtUtc = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(new { message = $"Quest claimed: +{rewards[questKey]} TIX." });
    }
}

public record PurchaseRequest(string ItemId);
public record EquipRequest(string ItemId);
