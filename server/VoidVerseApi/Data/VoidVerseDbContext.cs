using Microsoft.EntityFrameworkCore;
using VoidVerseApi.Models;

namespace VoidVerseApi.Data;

public class VoidVerseDbContext : DbContext
{
    public VoidVerseDbContext(DbContextOptions<VoidVerseDbContext> options) : base(options)
    {
    }

    public DbSet<UserAccount> Users => Set<UserAccount>();
    public DbSet<InventoryItem> Inventory => Set<InventoryItem>();
    public DbSet<QuestProgress> QuestProgress => Set<QuestProgress>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserAccount>(entity =>
        {
            entity.HasIndex(u => u.Username).IsUnique();
            entity.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<InventoryItem>()
            .HasOne(i => i.User)
            .WithMany(u => u.Inventory)
            .HasForeignKey(i => i.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<QuestProgress>()
            .HasOne(q => q.User)
            .WithMany(u => u.QuestProgress)
            .HasForeignKey(q => q.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        base.OnModelCreating(modelBuilder);
    }
}
