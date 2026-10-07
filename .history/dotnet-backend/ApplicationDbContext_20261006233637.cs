public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    //1. Object one users
    public DbSet<User> Users => Set<User>();
    //2. Object two employees
    public DbSet<Employee> Employees => Set<Employee>(); 
    //3. Object three projects

    //4. Object four pr
  

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