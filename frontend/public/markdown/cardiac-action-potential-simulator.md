# Symulator Potencjału Czynnościowego Kardiomiocytów

## Przegląd
Zaawansowany symulator elektrofizjologii serca w czasie rzeczywistym z interaktywną wizualizacją i modelowaniem wpływu leków.

## Funkcje
- **Symulacja w czasie rzeczywistym** potencjału czynnościowego
- **Modelowanie farmakologiczne** - TTX, Werapamil, Diltiazem
- **Interaktywna kontrola** częstotliwości i prędkości
- **Wizualizacja faz** potencjału czynnościowego
- **Analiza parametrów** w czasie rzeczywistym

## Fazy Potencjału Czynnościowego

### Faza 0 - Depolaryzacja
- Szybka depolaryzacja przez kanały Na+
- Nadstrzał do +35mV
- Blokowana przez TTX

### Faza 1 - Wstępna repolaryzacja
- Spadek potencjału przez kanały K+
- Krótka faza przejściowa

### Faza 2 - Plateau
- Długie plateau przez kanały Ca2+ L-type
- Blokowane przez Werapamil i Diltiazem
- Kluczowa dla kurczliwości

### Faza 3 - Repolaryzacja
- Szybka repolaryzacja przez kanały K+
- Powrót do potencjału spoczynkowego

### Faza 4 - Spoczynek
- Potencjał spoczynkowy -90mV (komorowe)
- Przygotowanie do następnego cyklu

## Leki i ich działanie

### Tetrodotoksyna (TTX)
- **Mechanizm**: Blokuje kanały Na+
- **Efekt**: Zmniejsza szybkość depolaryzacji (Faza 0)
- **IC50**: 0.01 μM

### Werapamil
- **Mechanizm**: Blokuje kanały Ca2+ L-type
- **Efekt**: Skraca plateau (Faza 2)
- **IC50**: 0.1 μM

### Diltiazem
- **Mechanizm**: Blokuje kanały Ca2+ L-type
- **Efekt**: Podobny do Werapamilu
- **IC50**: 0.05 μM

## Parametry kontrolne

### Typ komórki
- **Komorowe**: -90mV spoczynek, dłuższe APD
- **Przedsionkowe**: -80mV spoczynek, krótsze APD

### Częstotliwość stymulacji
- Zakres: 0.5-3 Hz
- Wpływa na długość cyklu

### Prędkość symulacji
- Zakres: 0.1x-5x czasu rzeczywistego
- Kontrola szybkości aktualizacji

## Interpretacja wyników

### Parametry kluczowe
- **Amplituda**: Różnica między szczytem a spoczynkiem
- **APD90**: Czas do 90% repolaryzacji
- **Szybkość depolaryzacji**: Nachylenie Fazy 0

### Wpływ leków
- **TTX**: Zmniejsza amplitudę i szybkość
- **Werapamil/Diltiazem**: Skraca plateau
- **Kombinacje**: Efekty addytywne

## Zastosowania kliniczne
- Badanie działania leków antyarytmicznych
- Modelowanie zaburzeń rytmu
- Edukacja w elektrofizjologii serca
- Badania farmakologiczne in silico 