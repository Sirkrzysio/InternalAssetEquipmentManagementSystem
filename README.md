# 🏢 System Zarządzania Majątkiem Firmy

**Kompletny system enterprise do zarządzania aktywami, sprzętem i przypisaniami pracowników**

## 📋 Opis Projektu

System umożliwia kompleksowe zarządzanie majątkiem firmy z pełną kontrolą dostępu i audytem działań. Zawiera backend .NET z Clean Architecture oraz nowoczesny frontend Angular z enterprise komponentami.

### Główne Funkcjonalności
- **Zarządzanie Aktywami** - dodawanie, edycja, usuwanie sprzętu z kategoriami i lokalizacjami
- **Przypisania Sprzętu** - przydzielanie aktywów pracownikom (stałe, tymczasowe, wypożyczenia)
- **Użytkownicy i Role** - system ról (Admin, Manager, Employee) z autoryzacją JWT
- **Kategorie i Lokalizacje** - organizacja aktywów w strukturę firmową  
- **Audit Trail** - kompletne logowanie wszystkich akcji w systemie
- **Wyszukiwanie i Filtrowanie** - zaawansowane opcje znajdowania sprzętu
- **Responsywny Interface** - działający na komputerach i telefonach

## 🏗️ Architektura Systemu

### Backend (.NET 8 - Clean Architecture)
```
Backend/
├── AssetManagement.API/           # Warstwa Prezentacji
│   ├── Controllers/               # REST API (Assets, Users, Auth, etc.)  
│   ├── Middleware/                # Obsługa błędów, audit logging
│   └── Extensions/                # Konfiguracja DI
│
├── AssetManagement.Application/   # Warstwa Aplikacji
│   ├── Services/                  # Logika biznesowa
│   ├── DTOs/                      # Modele danych API
│   ├── Interfaces/                # Kontrakty serwisów
│   └── Validators/                # Walidacja danych
│
├── AssetManagement.Domain/        # Warstwa Domeny  
│   ├── Entities/                  # Encje biznesowe
│   └── Enums/                     # Typy domenowe
│
└── AssetManagement.Infrastructure/ # Warstwa Infrastruktury
    ├── Data/                      # Entity Framework DbContext
    ├── Repositories/              # Dostęp do danych
    ├── Security/                  # JWT, autoryzacja
    └── Migrations/                # Migracje bazy danych
```

### Frontend (Angular 17+ - Enterprise Structure)
```
Frontend/src/app/
├── core/                          # Warstwa Core (singletons)
│   ├── models/                    # TypeScript interfejsy  
│   ├── services/                  # Serwisy API + auth
│   ├── guards/                    # Ochrona tras
│   └── interceptors/              # HTTP interceptory (JWT, błędy)
│
├── shared/                        # Komponenty współdzielone
│   ├── components/                # DataTable, LoadingSpinner, Modals
│   ├── pipes/                     # Formatowanie statusów
│   └── directives/                # Role-based visibility
│
└── features/                      # Moduły biznesowe (lazy-loaded)
    ├── auth/                      # Logowanie/wylogowanie
    ├── dashboard/                 # Dashboard z metrykami
    ├── assets/                    # Zarządzanie aktywami
    ├── assignments/               # Przypisania sprzętu
    ├── users/                     # Zarządzanie użytkownikami
    ├── categories/                # Kategorie aktywów
    ├── locations/                 # Lokalizacje  
    └── audit-logs/                # Logi audytu (tylko admin)
```

## 🚀 Uruchomienie Systemu

### Wymagania
- **.NET 8 SDK** 
- **Node.js 18+**  
- **PostgreSQL**

### Krok 1: Baza Danych
```bash
# Utwórz bazę PostgreSQL
createdb -U postgres AssetManagementDb
```

### Krok 2: Backend API
```bash
cd Backend/AssetManagement.API

# Zainstaluj zależności
dotnet restore

# Uruchom migracje
dotnet ef database update --project ../AssetManagement.Infrastructure

# Uruchom serwer API
dotnet run
```
**✅ Backend działa na: http://localhost:5235**

### Krok 3: Frontend
```bash  
cd Frontend

# Zainstaluj zależności
npm install

# Uruchom aplikację
ng serve
```
**✅ Frontend działa na: http://localhost:4200**

### Pierwsze Logowanie
```
Email: admin@assetmanagement.local
Hasło: Admin123!
```

## 🔐 System Ról i Uprawnień

| Rola | Uprawnienia |
|------|-------------|
| **Admin** | Wszystko - CRUD na aktywach, użytkownikach, audit logi, zarządzanie systemem |
| **Manager** | Zarządzanie aktywami, przypisania, kategorie, lokalizacje, użytkownicy |
| **Employee** | Tylko odczyt własnych przypisań i dostępnych aktywów |

## 📊 Funkcjonalności Systemu

### Dashboard
- Metryki systemu (liczba aktywów, przypisań, użytkowników)
- Szybkie akcje dla każdej roli
- Przegląd statusów aktywów

### Zarządzanie Aktywami  
- Lista z wyszukiwaniem i filtrowaniem
- Dodawanie/edycja aktywów z walidacją
- Statusy: Dostępny, Przypisany, W serwisie, Wycofany, Zgubiony
- Kategorie i lokalizacje
- Historia zmian

### Przypisania Sprzętu
- Przypisywanie aktywów do pracowników
- Typy: Stałe, Tymczasowe, Wypożyczenie  
- Zwracanie sprzętu
- Historia przypisań

### Panel Administracyjny
- Zarządzanie użytkownikami (tylko Admin/Manager)
- Logi audytu wszystkich akcji (tylko Admin)
- Konfiguracja kategorii i lokalizacji

## 🔧 Konfiguracja

### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=AssetManagementDb;Username=postgres;Password=postgres"
  },
  "JwtSettings": {
    "Secret": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "ExpirationInMinutes": 60
  }
}
```

### Frontend (environment.ts)  
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5235/api'
};
```

## 📱 Interface Użytkownika

- **Responsywny design** - działa na desktop i mobile
- **Material Design inspirowany** - nowoczesny, czysty wygląd
- **Data Tables** - sortowanie, wyszukiwanie, paginacja
- **Modale** - potwierdzenia akcji z loading states
- **Breadcrumbs** - nawigacja hierarchiczna
- **Role-based UI** - różne widoki dla różnych ról

## 🔒 Bezpieczeństwo

- **JWT Authentication** - bezpieczne logowanie z tokenami
- **Role-based Authorization** - kontrola dostępu na poziomie API i UI
- **Audit Trail** - logowanie wszystkich akcji użytkowników
- **Input Validation** - walidacja danych na frontend i backend
- **SQL Injection Protection** - Entity Framework zapobiega atakom

## 📈 Technologie

### Backend
- **.NET 8** - najnowsza wersja platformy
- **Entity Framework Core** - ORM z Code First
- **PostgreSQL** - relacyjna baza danych
- **JWT Bearer** - autoryzacja
- **AutoMapper** - mapowanie obiektów
- **FluentValidation** - walidacja

### Frontend  
- **Angular 17+** - najnowsza wersja z standalone components
- **TypeScript** - silne typowanie  
- **RxJS** - reaktywne programowanie
- **Angular Material inspire** - komponenty UI
- **Lazy Loading** - optymalizacja wydajności

## 📋 API Endpoints

**Autoryzacja:**
- `POST /api/auth/login` - Logowanie
- `POST /api/auth/logout` - Wylogowanie  
- `GET /api/auth/me` - Profil użytkownika

**Aktywa:**
- `GET /api/assets` - Lista aktywów
- `GET /api/assets/paged` - Paginowana lista
- `POST /api/assets` - Dodaj aktywo
- `PUT /api/assets/{id}` - Edytuj aktywo
- `DELETE /api/assets/{id}` - Usuń aktywo

**Użytkownicy (Admin/Manager):**
- `GET /api/users` - Lista użytkowników
- `POST /api/users` - Dodaj użytkownika
- `PUT /api/users/{id}` - Edytuj użytkownika

**Audit (Admin):**
- `GET /api/auditlogs/paged` - Logi audytu

## 🎯 Status Projektu

**✅ GOTOWE DO UŻYCIA**

- Backend z pełną funkcjonalnością
- Frontend z enterprise UI
- Baza danych PostgreSQL
- System autoryzacji JWT
- Audit trail
- Responsywny design
- Dokumentacja API (Swagger)

## 📞 Wsparcie

System jest gotowy do wdrożenia i użytkowania. Wszystkie podstawowe funkcjonalności zostały zaimplementowane zgodnie z najlepszymi praktykami enterprise development.

---
**Projekt enterprise-level gotowy do produkcji! 🚀**
