using AssetManagement.Application.DTOs.Assets;
using FluentValidation;

namespace AssetManagement.Application.Validators;

public class UpdateAssetValidator : AbstractValidator<UpdateAssetDto>
{
    public UpdateAssetValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Nazwa jest wymagana")
            .MaximumLength(200).WithMessage("Nazwa nie może przekraczać 200 znaków");

        RuleFor(x => x.SerialNumber)
            .NotEmpty().WithMessage("Numer seryjny jest wymagany")
            .MaximumLength(100).WithMessage("Numer seryjny nie może przekraczać 100 znaków");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Opis nie może przekraczać 1000 znaków");

        RuleFor(x => x.PurchasePrice)
            .GreaterThanOrEqualTo(0).WithMessage("Cena zakupu musi być większa lub równa 0");

        RuleFor(x => x.PurchaseDate)
            .NotEmpty().WithMessage("Data zakupu jest wymagana")
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("Data zakupu nie może być w przyszłości");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Nieprawidłowy status aktywa");

        RuleFor(x => x.CategoryId)
            .NotEmpty().WithMessage("Kategoria jest wymagana");
    }
}
