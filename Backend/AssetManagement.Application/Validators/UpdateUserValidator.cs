using AssetManagement.Application.DTOs.Users;
using FluentValidation;

namespace AssetManagement.Application.Validators;

public class UpdateUserValidator : AbstractValidator<UpdateUserDto>
{
    public UpdateUserValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email jest wymagany")
            .EmailAddress().WithMessage("Nieprawidłowy format email")
            .MaximumLength(256).WithMessage("Email nie może przekraczać 256 znaków");

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("Imię jest wymagane")
            .MaximumLength(100).WithMessage("Imię nie może przekraczać 100 znaków");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Nazwisko jest wymagane")
            .MaximumLength(100).WithMessage("Nazwisko nie może przekraczać 100 znaków");

        RuleFor(x => x.Department)
            .MaximumLength(100).WithMessage("Dział nie może przekraczać 100 znaków");

        RuleFor(x => x.PhoneNumber)
            .MaximumLength(20).WithMessage("Numer telefonu nie może przekraczać 20 znaków");

        RuleFor(x => x.Role)
            .IsInEnum().WithMessage("Nieprawidłowa rola użytkownika");
    }
}
