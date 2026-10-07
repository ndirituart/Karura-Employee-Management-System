public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }


      public DbSet<User> Users => Set<User>();
    public DbSet<Employee> Employees => Set<Employee>(); 
  

    public override int SaveChanges()
    {
        StampAuditFields();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        StampAuditFields();
        return base.SaveChangesAsync(ct);
    }

    private void StampAuditFields()
    {
        var now = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries<Employee>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.createdDate = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.updatedDate = now;
            }
        }
    }
}