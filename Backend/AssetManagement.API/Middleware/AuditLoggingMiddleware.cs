using System.Security.Claims;
using AssetManagement.Application.Interfaces;
using AssetManagement.Domain.Enums;

namespace AssetManagement.API.Middleware;

public class AuditLoggingMiddleware
{
    private readonly RequestDelegate _next;

    public AuditLoggingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, IAuditService auditService)
    {
        await _next(context);

        // Log tylko dla modyfikujących metod HTTP
        if (context.Request.Method is "POST" or "PUT" or "DELETE")
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = context.User.FindFirstValue(ClaimTypes.Name);
            var ipAddress = context.Connection.RemoteIpAddress?.ToString();

            var action = context.Request.Method switch
            {
                "POST" => AuditAction.Create,
                "PUT" => AuditAction.Update,
                "DELETE" => AuditAction.Delete,
                _ => AuditAction.Update
            };

            // Logowanie podstawowe
            if (!string.IsNullOrEmpty(userId) && context.Response.StatusCode < 400)
            {
                var path = context.Request.Path.Value ?? "";
                var entityName = path.Split('/').Skip(2).FirstOrDefault() ?? "Unknown";

                await auditService.LogAsync(
                    entityName,
                    Guid.Empty,
                    action,
                    null,
                    null,
                    Guid.Parse(userId),
                    userName,
                    ipAddress
                );
            }
        }
    }
}

public static class AuditLoggingMiddlewareExtensions
{
    public static IApplicationBuilder UseAuditLogging(this IApplicationBuilder app)
    {
        return app.UseMiddleware<AuditLoggingMiddleware>();
    }
}
