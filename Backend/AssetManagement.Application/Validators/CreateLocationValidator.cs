using AssetManagement.Application.DTOs.Locations;
using FluentValidation;

namespace AssetManagement.Application.Validators;

public class CreateLocationValidator : AbstractValidator<CreateLocationDto>
{
    public CreateLocationValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Nazwa jest wymagana")
            .MaximumLength(200).WithMessage("Nazwa nie może przekraczać 200 znaków");

        RuleFor(x => x.Address)
            .MaximumLength(500).WithMessage("Adres nie może przekraczać 500 znaków");

        RuleFor(x => x.Building)
            .MaximumLength(100).WithMessage("Budynek nie może przekraczać 100 znaków");

        RuleFor(x => x.Floor)
            .MaximumLength(50).WithMessage("Piętro nie może przekraczać 50 znaków");

        RuleFor(x => x.Room)
            .MaximumLength(50).WithMessage("Pokój nie może przekraczać 50 znaków");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Opis nie może przekraczać 1000 znaków");
    }
}
