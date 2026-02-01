﻿using AssetManagement.Application.Interfaces;
using AssetManagement.Application.Mappings;
using AssetManagement.Application.Services;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;


namespace AssetManagement.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // AutoMapper
        services.AddAutoMapper(typeof(MappingProfile));

        // FluentValidation
        services.AddValidatorsFromAssemblyContaining<MappingProfile>();

        // Services
        services.AddScoped<IAssetService, AssetService>();
        services.AddScoped<IAssignmentService, AssignmentService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ILocationService, LocationService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAuditService, AuditService>();
        services.AddScoped<IDataCleanupService, DataCleanupService>();

        return services;
    }
}
