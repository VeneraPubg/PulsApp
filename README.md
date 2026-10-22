# Pulse

**Pulse** is an offline workout tracker for Android. It tells you what to train today, walks you through the workout with a built-in timer, and turns your training history into clear progress charts — all stored locally on your phone, with no account or internet required.

**[Download the latest APK](https://github.com/VeneraPubg/PulsApp/releases/latest)** · [Русская версия ниже](#pulse-на-русском)

---

## Features

- **Today screen** — always-on dashboard: week calendar with completed days, current streak, today's workout card and a daily activity ring (calories / goal).
- **4-week training plan** — 16 pre-built strength workouts (Upper / Lower body split). Each day is marked done, skipped or "today". Weeks are generated automatically around the plan start date.
- **Workout player** — anchored exercise timer with pauses, skip and auto-advance; vibration and beep when a workout ends naturally. Every card shows exact prescriptions (sets × reps × weight) and suggests weight progression (+2.5 kg per week for the same exercise).
- **Progress screen** — Week / Month / Year filters that recompute everything: weight chart with editable history, training volume by week/month with deltas, and personal records with a "NEW RECORD" highlight.
- **Profile** — user profile, statistics (workouts count, time in motion, plan completion), reminders and settings.
- **Local-first storage** — workouts, custom plan start date and weight history are stored in AsyncStorage (`pulse_activity_v2`) and survive restarts without any server.
- **Dark theme** — designed after the app mockups with SVG icons only (no emoji).

| Today | Plan | Progress | Player |
| :---: | :---: | :---: | :---: |
| Dashboard + calendar | 16 workouts / 4 weeks | Volume, weight, PRs | Anchored timer |

## Tech stack

| Component | Version |
|---|---|
| React Native | 0.88.0 (New Architecture) |
| React | 19.3.0 |
| Hermes | built-in JS engine |
| Gradle | 9.4.1 |
| Java | JDK 17+ |
| Android SDK | compile 37 / target 36 / min 24 (Android 7.0+) |
| Navigation | React Navigation 7 (bottom tabs + stack) |
| Storage | AsyncStorage 3 |
| Graphics | react-native-svg |

## Run on another PC (Android Studio)

### 1. Prerequisites

- **Node.js ≥ 22.11.0** (plain JS project — no TypeScript compilation needed)
- **Android Studio** with:
  - Android SDK 37 (installed via SDK Manager), Build tools 37.0.0
  - NDK 27.1.12297006 (used by the C++ part of React Native)
  - Platform tools + an emulator, *or* a real phone with USB debugging
- **JDK 17 or 21** (bundled with recent Android Studio versions or installed separately from `adoptium.net`)
- Windows-only (long paths): it is recommended to enable Win32 long path support once, otherwise the C++ build may fail with *"Filename longer than 260 characters"*:
  ```powershell
  # Run in an Administrator PowerShell
  New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
  ```

### 2. Clone and install

```bash
git clone https://github.com/VeneraPubg/PulsApp.git
cd PulsApp
npm install
```

### 3. Configure the SDK path

Make sure `android/local.properties` exists (create it if needed) and points to your SDK:

```properties
sdk.dir=C\:\\Users\\<you>\\AppData\\Local\\Android\\Sdk
```

### 4. Start the app

**Option A — via Android Studio UI**

1. Open Android Studio → **File → Open…** → select the `android` folder of the project.
2. Wait for the Gradle sync to finish (first sync downloads a lot of dependencies).
3. Pick a device (emulator or plugged phone) and press **Run ▶**.
4. Android Studio starts Metro and installs the debug build automatically.

**Option B — via the command line**

```bash
npm start        # starts Metro in a separate terminal
npm android      # builds and installs the app on the connected device
```

> **Note:** the debug build loads JavaScript from Metro. If you change app code, the screen updates automatically (Fast Refresh). If Metro is stopped, the debug app will not run — use the release APK for standalone use.

### 5. Build a standalone release APK (no Metro needed)

```bash
cd android
gradlew assembleRelease
```

The APK appears in `android/app/build/outputs/apk/release/app-release.apk` (signed with the debug key, ~76 MB) and contains the bundled JavaScript — it runs fully offline.

**Windows 260-character path fix** (only if the C++ step fails): the build is preconfigured to use a fresh **Ninja ≥ 1.12** and short object paths. If you see the ninja error, download [ninja ≥ 1.12](https://github.com/ninja-build/ninja/releases), place it anywhere, and confirm these arguments are present in `android/app/build.gradle`:

```groovy
defaultConfig {
    externalNativeBuild {
        cmake {
            arguments "-DCMAKE_MAKE_PROGRAM=<path>\\ninja.exe", "-DCMAKE_OBJECT_PATH_MAX=1024"
        }
    }
}
```

## Project structure

```
PulsApp/
├─ src/
│  ├─ App.js                  # navigation: bottom tabs, auth gate
│  ├─ data.js                 # workout templates, 4-week plan, progression
│  ├─ store.js                # AsyncStorage DB (sessions, weights, planStart)
│  ├─ userStore.js            # user profile storage
│  ├─ context.js              # global app context
│  ├─ assets/                 # images for workout cards
│  ├─ components/             # shared UI (icons, etc.)
│  └─ screens/
│     ├─ AuthScreen.js        # sign up / sign in (local)
│     ├─ HomeScreen.js        # today dashboard
│     ├─ PlanScreen.js        # 4-week plan by weeks
│     ├─ workout/…            # player + detail
│     ├─ ProgressScreen.js    # charts, volume, PRs, weight
│     ├─ ProfileScreen.js     # profile + settings entry points
│     └─ …
└─ android/
   ├─ app/src/main/java/com/pulseapp/
   │  ├─ MainActivity.kt / MainApplication.kt
   │  └─ PulseBeepModule/Package   # short beep via ToneGenerator
   └─ app/build.gradle             # RN app module (with CMake long-path fix)
```

## Data note

All user data is stored locally. **Uninstalling the app erases the training history** — export via Profile → Backup before switching devices.

---

# Pulse (на русском)

**Pulse** — офлайн-трекер тренировок для Android. Показывает, что тренировать сегодня, проводит по тренировке со встроенным таймером и превращает историю тренировок в понятные графики прогресса. Все данные хранятся локально на телефоне — аккаунт и интернет не нужны.

**[Скачать свежий APK](https://github.com/VeneraPubg/PulsApp/releases/latest)**

## Возможности

- **Экран «Сегодня»** — дашборд: недельный календарь с отмеченными днями, стрик, карточка тренировки дня и кольцо активности (ккал / цель).
- **План на 4 недели** — 16 силовых тренировок (сплит «верх / низ» с плечами и руками). Каждый день помечается как пройденный, пропущенный или «сегодня». Недели строятся автоматически от даты старта плана.
- **Плеер тренировки** — якорный таймер по упражнениям с паузами, skip и авто-переходом; вибро и сигнал при естественном завершении. У каждой карточки точное предписание (подходы × повторы × вес) и авто-прогрессия (+2,5 кг в неделю для того же упражнения).
- **Экран «Прогресс»** — фильтры Неделя / Месяц / Год пересчитывают всё: график веса с редактируемой историей, объём по неделям/месяцам с дельтами, личные рекорды с пометкой «НОВЫЙ РЕКОРД».
- **Профиль** — профиль пользователя, статистика (количество тренировок, время в движении, выполнение плана), напоминания и настройки.
- **Локальное хранилище** — тренировки, дата старта плана и история веса хранятся в AsyncStorage (`pulse_activity_v2`) и переживают перезапуск без сервера.
- **Тёмная тема** — свёрстано по мокапам приложения, только SVG-иконки (без эмодзи).

## Запуск на другом ПК (Android Studio)

### 1. Что нужно

- **Node.js ≥ 22.11.0**
- **Android Studio** с SDK 37, Build tools 37.0.0, **NDK 27.1.12297006** и платформенными инструментами; эмулятор или телефон с USB-отладкой
- **JDK 17 или 21** (входит в свежие версии Android Studio, либо standalone с `adoptium.net`)
- Windows: рекомендуется один раз включить поддержку длинных путей, иначе C++-сборка может упасть с ошибкой *"Filename longer than 260 characters"*, как описано выше в английской части.

### 2. Клонировать и установить зависимости

```bash
git clone https://github.com/VeneraPubg/PulsApp.git
cd PulsApp
npm install
```

### 3. Указать путь к SDK

Проверьте `android/local.properties` (создайте при необходимости):

```properties
sdk.dir=C\:\\Users\\<вы>\\AppData\\Local\\Android\\Sdk
```

### 4. Запустить приложение

**Вариант A — через Android Studio**

1. Android Studio → **File → Open…** → выбрать папку `android` проекта.
2. Дождаться Gradle-синхронизации (первый запуск скачивает зависимости).
3. Выбрать устройство и нажать **Run ▶** — Studio сама поднимет Metro и поставит debug-сборку.

**Вариант B — через терминал**

```bash
npm start        # Metro в отдельном терминале
npm android      # сборка и установка на устройство
```

> **Важно:** debug-сборка грузит JS с Metro. Без Metro debug-версия не работает — для автономного использования собирайте release APK.

### 5. Собрать автономный release APK (без Metro)

```bash
cd android
gradlew assembleRelease
```

Готовый APK: `android/app/build/outputs/apk/release/app-release.apk` (подписан debug-ключом, ~76 МБ) — JavaScript вшит внутрь, приложение работает полностью офлайн.

**Фикс длинных путей Windows** (если C++-шаг падает): сборка уже настроена на свежий **Ninja ≥ 1.12** и короткие пути объектных файлов. Скачайте [ninja ≥ 1.12](https://github.com/ninja-build/ninja/releases), положите куда удобно и проверьте аргументы в `android/app/build.gradle` (пример выше, в английской версии).

## Важно про данные

Все данные хранятся локально. **Удаление приложения стирает историю тренировок** — перед сменой телефона сделайте резервную копию через Профиль → Резервная копия.
