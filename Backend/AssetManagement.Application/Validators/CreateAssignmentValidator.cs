using AssetManagement.Application.DTOs.Assignments;
using FluentValidation;

namespace AssetManagement.Application.Validators;

public class CreateAssignmentValidator : AbstractValidator<CreateAssignmentDto>
{
    public CreateAssignmentValidator()
    {
        RuleFor(x => x.AssetId)
            .NotEmpty().WithMessage("Asset jest wymagany");

        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("Użytkownik jest wymagany");

        RuleFor(x => x.ExpectedReturnDate)
            .GreaterThan(DateTime.UtcNow)
            .When(x => x.ExpectedReturnDate.HasValue)
            .WithMessage("Oczekiwana data zwrotu musi być w przyszłości");

        RuleFor(x => x.Notes)
            .MaximumLength(1000).WithMessage("Notatki nie mogą przekraczać 1000 znaków");
    }
}
