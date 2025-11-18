using F1Journal.Models;
using Microsoft.EntityFrameworkCore;

namespace F1Journal.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        
    }
    
    public DbSet<Team> Teams { get; set; }
    public DbSet<Driver> Drivers { get; set; }
    public DbSet<Season> Seasons { get; set; }
    public DbSet<Race> Races { get; set; }
    public DbSet<RaceResult> RaceResults { get; set; }
    
    public DbSet<User> Users { get; set; }
    
    public DbSet<RaceReview> RaceReviews { get; set; }
    public DbSet<DriverPerformanceReview> DriverPerformanceReviews { get; set; }
    public DbSet<TeamPerformanceReview> TeamPerformanceReviews { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Season>()
            .HasIndex(s => s.Year)
            .IsUnique();
        
        modelBuilder.Entity<Race>()
            .HasIndex(r => new { r.Name, r.SeasonId })
            .IsUnique();
        modelBuilder.Entity<RaceReview>()
            .HasIndex(r => new { r.RaceId, r.UserId })
            .IsUnique();
        modelBuilder.Entity<DriverPerformanceReview>()
            .HasIndex(d => new { d.UserId, d.DriverId, d.RaceId})
            .IsUnique();
        modelBuilder.Entity<TeamPerformanceReview>()
            .HasIndex(t => new { t.UserId, t.TeamId, t.RaceId })
            .IsUnique();
        modelBuilder.Entity<RaceResult>()
            .HasIndex(r => new { r.DriverId, r.RaceId })
            .IsUnique();
        modelBuilder.Entity<Driver>()
            .HasIndex(d => d.DriverNumber)
            .IsUnique();
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
        modelBuilder.Entity<Team>()
            .HasIndex(t => t.Name)
            .IsUnique();
    }
}