using AssetManagement.Application.DTOs.Users;
using FluentValidation;

namespace AssetManagement.Application.Validators;

public class CreateUserValidator : AbstractValidator<CreateUserDto>
{
    public CreateUserValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email jest wymagany")
            .EmailAddress().WithMessage("Nieprawidłowy format email")
            .MaximumLength(256).WithMessage("Email nie może przekraczać 256 znaków");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Hasło jest wymagane")
            .MinimumLength(8).WithMessage("Hasło musi mieć minimum 8 znaków")
            .Matches("[A-Z]").WithMessage("Hasło musi zawierać przynajmniej jedną wielką literę")
            .Matches("[a-z]").WithMessage("Hasło musi zawierać przynajmniej jedną małą literę")
            .Matches("[0-9]").WithMessage("Hasło musi zawierać przynajmniej jedną cyfrę");

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
    }
}
