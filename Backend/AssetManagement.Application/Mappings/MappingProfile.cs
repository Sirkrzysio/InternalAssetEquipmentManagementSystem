﻿using AssetManagement.Application.DTOs.Assets;
using AssetManagement.Application.DTOs.Assignments;
using AssetManagement.Application.DTOs.Categories;
using AssetManagement.Application.DTOs.Locations;
using AssetManagement.Application.DTOs.Users;
using AssetManagement.Domain.Entities;
using AutoMapper;

namespace AssetManagement.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Asset mappings
        CreateMap<Asset, AssetDto>()
            .ForMember(d => d.CategoryName, o => o.MapFrom(s => s.Category != null ? s.Category.Name : null))
            .ForMember(d => d.LocationName, o => o.MapFrom(s => s.Location != null ? s.Location.Name : null));
        CreateMap<CreateAssetDto, Asset>();
        CreateMap<UpdateAssetDto, Asset>();

        // Assignment mappings
        CreateMap<Assignment, AssignmentDto>()
            .ForMember(d => d.AssetName, o => o.MapFrom(s => s.Asset.Name))
            .ForMember(d => d.AssetSerialNumber, o => o.MapFrom(s => s.Asset.SerialNumber))
            .ForMember(d => d.UserFullName, o => o.MapFrom(s => s.User.FullName))
            .ForMember(d => d.UserEmail, o => o.MapFrom(s => s.User.Email))
            .ForMember(d => d.IsActive, o => o.MapFrom(s => s.ReturnedAt == null));
        CreateMap<CreateAssignmentDto, Assignment>();

        // User mappings
        CreateMap<User, UserDto>()
            .ForMember(d => d.FullName, o => o.MapFrom(s => s.FullName));
        CreateMap<CreateUserDto, User>()
            .ForMember(d => d.PasswordHash, o => o.Ignore())
            .ForMember(d => d.Username, o => o.MapFrom(s => s.Email));
        CreateMap<UpdateUserDto, User>()
            .ForMember(d => d.PasswordHash, o => o.Ignore())
            .ForMember(d => d.Username, o => o.MapFrom(s => s.Email))
            .ForMember(d => d.IsActive, o => o.Ignore());

        // Location mappings
        CreateMap<Location, LocationDto>()
            .ForMember(d => d.AssetCount, o => o.MapFrom(s => s.Assets.Count));
        CreateMap<CreateLocationDto, Location>();
        CreateMap<UpdateLocationDto, Location>();

        // Category mappings
        CreateMap<Category, CategoryDto>()
            .ForMember(d => d.AssetCount, o => o.MapFrom(s => s.Assets.Count));
        CreateMap<CreateCategoryDto, Category>();
        CreateMap<UpdateCategoryDto, Category>();
    }
}
