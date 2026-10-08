using Microsoft.EntityFrameworkCore; //important import
using dotnet_backend.Models; //important import

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    //1. Object one users
    public DbSet<User> Users => Set<User>();
    //2. Object two employees
    public DbSet<Employee> Employees => Set<Employee>(); 
    //3. Object three projects
    public DbSet<Project> Projects => Set<Project>();
    //4. Object four project-employees
  
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Tell EF Core the exact table names to use.
        modelBuilder.Entity<Employee>().ToTable("employees");
        modelBuilder.Entity<User>().ToTable("users");
        modelBuilder.Entity<Project>().ToTable("projects");

        // Optional: also tell it about the primary key column names if they differ
        modelBuilder.Entity<Employee>().HasKey(e => e.employeeId);
        modelBuilder.Entity<Employee>().Property(e => e.employeeId).HasColumnName("employeeid");
        modelBuilder.Entity<Employee>().Property(e => e.firstName).HasColumnName("firstname");
        modelBuilder.Entity<Employee>().Property(e => e.lastName).HasColumnName("lastname");
        modelBuilder.Entity<Employee>().Property(e => e.emailId).HasColumnName("emailid");
        modelBuilder.Entity<Employee>().Property(e => e.mobileNo).HasColumnName("mobileno");
        modelBuilder.Entity<Employee>().Property(e => e.dateOfBirth).HasColumnName("dateofbirth");
        modelBuilder.Entity<Employee>().Property(e => e.gender).HasColumnName("gender");
        modelBuilder.Entity<Employee>().Property(e => e.department).HasColumnName("department");
        modelBuilder.Entity<Employee>().Property(e => e.jobTitle).HasColumnName("jobtitle");
        modelBuilder.Entity<Employee>().Property(e => e.hireDate).HasColumnName("hiredate");
        modelBuilder.Entity<Employee>().Property(e => e.employmentType).HasColumnName("employmenttype");
        modelBuilder.Entity<Employee>().Property(e => e.monthlySalary).HasColumnName("monthlysalary");
        modelBuilder.Entity<Employee>().Property(e => e.status).HasColumnName("status");
        modelBuilder.Entity<Employee>().Property(e => e.county).HasColumnName("county");
        modelBuilder.Entity<Employee>().Property(e => e.townCity).HasColumnName("towncity");
        modelBuilder.Entity<Employee>().Property(e => e.postalAddress).HasColumnName("postaladdress");
        modelBuilder.Entity<Employee>().Property(e => e.createdDate).HasColumnName("createddate");
        modelBuilder.Entity<Employee>().Property(e => e.updatedDate).HasColumnName("updateddate");
        modelBuilder.Entity<Employee>().Property(e => e.deletedDate).HasColumnName("deleteddate");
        modelBuilder.Entity<Employee>().Property(e => e.isDeleted).HasColumnName("isdeleted");
        modelBuilder.Entity<Employee>().Property(e => e.userId).HasColumnName("userid");
        modelBuilder.Entity<Employee>().Property(e => e.role).HasColumnName("role");
    }

    // ... SaveChanges override stays the same
}
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