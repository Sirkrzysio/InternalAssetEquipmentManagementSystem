using AssetManagement.Application.DTOs.Categories;
using FluentValidation;

namespace AssetManagement.Application.Validators;

public class CreateCategoryValidator : AbstractValidator<CreateCategoryDto>
{
    public CreateCategoryValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Nazwa jest wymagana")
            .MaximumLength(100).WithMessage("Nazwa nie może przekraczać 100 znaków");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Opis nie może przekraczać 500 znaków");

        RuleFor(x => x.Code)
            .MaximumLength(20).WithMessage("Kod nie może przekraczać 20 znaków");
    }
}
