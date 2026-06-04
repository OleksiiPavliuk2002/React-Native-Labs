# RN Labs App

React Native (Expo) app built as one consistent project for 4 lab works.

## Lab 1
- Data models/classes: `Task`, `Project`, `UserProfile`.
- Navigation: stack + bottom tabs.
- Screens: list, details, plus additional screens (`Projects`, `Profile`, `Realtime`, `Security`, `Login`, `Lock`, `CriticalAction`).
- List/detail screens consume model objects from app state.

## Lab 2
- Local storage: AsyncStorage with CRUD in `StorageService`.
- Entities persisted between restarts: tasks, projects, profile.
- API contract and mock service in `ApiService`.
- Offline strategy: UI reads local storage first, API is optional mock sync.

## Lab 3
- WebSocket channel manager in `SocketManager`.
- Required methods: `connect`, `disconnect`, `send`, `onMessage`.
- Connection states: Disconnected -> Connecting -> Connected -> Reconnecting -> Disconnected.
- Mock real-time source: `MockSocketManager` emits events every 4 seconds.
- UI integration: `RealtimeScreen` updates task list automatically.

## Lab 4
- Biometric manager in `BiometricManager`.
- Methods: `checkAvailability`, `authenticate`, `isEnabledByUser`.
- Auth states: Idle -> Authenticating -> Success -> Failed -> Unavailable.
- Security settings screen: toggle biometric preference, shows supported type, persists setting.
- UI integration: biometric login, lock screen, critical action confirmation.

## Run
1. `npm install`
2. `npm run start`
3. `npm run test`

## Demo script for defense

### Lab 1 (navigation + models)
- Show model classes: `src/models/Task.ts`, `src/models/Project.ts`, `src/models/UserProfile.ts`.
- Explain field types (string/number/boolean/date) and constructors.
- Open app: `Tasks` list -> tap item -> `TaskDetails` -> back navigation.
- Show bottom tabs (`Tasks`, `Projects`, `Realtime`, `Profile`, `Security`) as multi-section navigation.

### Lab 2 (local storage + API contract)
- Show `src/storage/StorageService.ts` with CRUD for tasks/projects/profile.
- On `Tasks` screen create new task, restart app, verify task is still there.
- Show API contract + mock API in `src/api/ApiService.ts` (3 REST endpoints).
- Explain offline strategy: UI reads AsyncStorage first, API layer can sync later.

### Lab 3 (WebSocket + tests)
- Show `src/realtime/SocketManager.ts` states and reconnect flow.
- Open `Realtime` tab and wait 4 seconds: task count updates automatically from mock WS events.
- Show tests: `__tests__/socket.test.ts`, `__tests__/storage-api.test.ts`.
- Run `npm run test` and point to passing suite (>=15 tests for lab requirement).

### Lab 4 (biometric auth + security settings)
- Show `src/security/BiometricManager.ts` methods:
  - `checkAvailability()`
  - `authenticate(reason)`
  - `isEnabledByUser()`
- Demonstrate biometric login in `Login` and secure toggle in `Security`.
- Show `Lock` or `CriticalAction` screens that require biometric confirmation.
- Show tests in `__tests__/biometric.test.ts` and explain mocked scenarios.
