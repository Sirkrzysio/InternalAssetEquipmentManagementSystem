using System.Security.Cryptography;
using AssetManagement.Application.Interfaces.Security;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace AssetManagement.Infrastructure.Security;

public class PasswordHasher : IPasswordHasher
{
    private const int SaltSize = 128 / 8;
    private const int KeySize = 256 / 8;
    private const int Iterations = 100000;
    private static readonly HashAlgorithmName HashAlgorithm = HashAlgorithmName.SHA256;
    private const char Delimiter = ';';

    public string HashPassword(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(SaltSize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            Iterations,
            HashAlgorithm,
            KeySize
        );

        return string.Join(
            Delimiter,
            Convert.ToBase64String(salt),
            Convert.ToBase64String(hash)
        );
    }

    public bool VerifyPassword(string password, string hashedPassword)
    {
        var elements = hashedPassword.Split(Delimiter);
        if (elements.Length != 2)
        {
            return false;
        }

        var salt = Convert.FromBase64String(elements[0]);
        var hash = Convert.FromBase64String(elements[1]);

        var hashToCompare = Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            Iterations,
            HashAlgorithm,
            KeySize
        );

        return CryptographicOperations.FixedTimeEquals(hash, hashToCompare);
    }
}
