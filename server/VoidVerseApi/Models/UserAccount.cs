using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VoidVerseApi.Models;

public class UserAccount
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required, MaxLength(40)]
    public string Username { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public int Tix { get; set; } = 150;
    public int VvTokens { get; set; } = 0;
    public string AvatarColor { get; set; } = "violet";
    public string EquippedItemId { get; set; } = string.Empty;
    public string EquippedEmoteId { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;

    public ICollection<InventoryItem> Inventory { get; set; } = new List<InventoryItem>();
    public ICollection<QuestProgress> QuestProgress { get; set; } = new List<QuestProgress>();
}

public class InventoryItem
{
    [Key]
    public int Id { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [Required, MaxLength(120)]
    public string ItemId { get; set; } = string.Empty;

    [Required, MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string Kind { get; set; } = string.Empty;

    public int Price { get; set; }
    public bool IsEquipped { get; set; }
    public DateTime PurchasedAtUtc { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(UserId))]
    public UserAccount User { get; set; } = null!;
}

public class QuestProgress
{
    [Key]
    public int Id { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [Required, MaxLength(80)]
    public string QuestKey { get; set; } = string.Empty;

    public bool IsCompleted { get; set; }
    public bool RewardClaimed { get; set; }
    public int Progress { get; set; }
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(UserId))]
    public UserAccount User { get; set; } = null!;
}
