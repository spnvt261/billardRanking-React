## CUE RANK — Ứng dụng quản lý xếp hạng billiards (Client)

Tài liệu mô tả mục đích, công nghệ, cấu trúc thư mục và các điểm kỹ thuật nổi bật của ứng dụng client.

## Giới thiệu tổng quan

CUE RANK là một ứng dụng front-end React + TypeScript dùng để quản lý giải đấu, trận đấu và bảng xếp hạng billiards. Ứng dụng cho phép:
- Quản lý giải đấu (tạo, xem chi tiết, danh sách người chơi, lịch thi đấu)
- Quản lý trận đấu và ghi điểm (Score Counter)
- Xem bảng xếp hạng tổng thể và theo từng giải đấu
- Tương tác với API backend để đồng bộ dữ liệu (players, matches, tournaments)

Ứng dụng được thiết kế để đóng vai trò client (SPA) kết nối với một backend thông qua REST API. Mục tiêu là cung cấp UI nhanh, responsive, dễ mở rộng và dễ bảo trì.

## Công nghệ sử dụng

- React (v19): Thư viện UI chính cho SPA.
- TypeScript: Kiểm tra kiểu tĩnh, giúp tăng độ an toàn và khả năng bảo trì mã.
- Vite: Build tooling / dev server nhanh.
- Tailwind CSS: Utility-first CSS để xây dựng giao diện nhanh, responsive.
- Redux + redux-thunk: Quản lý state toàn cục (store, reducers) và xử lý side-effects (async actions).
- react-router-dom: Routing, nested routes và guards (ProtectedRoute).
- Axios + axios-retry: Gọi API HTTP với cơ chế retry cho các request thất bại tạm thời.
- localforage: Lưu trữ cục bộ (IndexedDB) cho dữ liệu cần cache/offline.
- Formik + Yup: Xử lý và validate form.
- framer-motion: Animation động cho UI.
- react-icons: Icon hệ thống.

Ghi chú: trong `package.json` không thấy React Query, Zustand hoặc Redux Toolkit; dự án hiện dùng phiên bản Redux thuần cùng `redux-thunk`.

## Cấu trúc thư mục chính

- `src/` — mã nguồn chính
  - `assets/` — thành phần tĩnh, helpers nhỏ
  - `components/` — các component tái sử dụng, được tổ chức theo nhóm (layout, table, form controls, custom buttons...). Ví dụ:
    - `layout/` — chứa `MainLayout` (cấu trúc layout chung của app)
    - `loading/WithLoading.tsx` — HOC để wrap component với loading
  - `context/` — Context providers (ví dụ: `AppProviders`, `notifycationContext`, `workspaceContext`)
  - `customhook/` — custom hooks (ví dụ `useLocalStorage.ts`, `useNotifycation.ts`, `useWorkspace.tsx`)
  - `pages/` — các trang ứng dụng (HomePage, RankingPage, TournamentPage, TournamentDetailPage,...)
  - `redux/` — cấu hình Redux store, các feature reducers (workspace, player, match, tournament, ...)
  - `router/` — định nghĩa routes (`AppRouter.tsx`, `ProtectedRoute.tsx`, `path.ts`)
  - `types/` — các định nghĩa TypeScript (interface, type, enum)
  - `ultils/` — util helpers và cấu hình chung (ví dụ `axiosConfig.ts`, `localForage.ts`, `format.ts`)

## Full cấu trúc thư mục

```
📦cuerank-clients
 ┣ 📂public
 ┃ ┗ 📂images
 ┣ 📂src
 ┃ ┣ 📂assets
 ┃ ┃ ┣ 📜Component.tsx
 ┃ ┃ ┣ 📜TestComponent.tsx
 ┃ ┃ ┗ 📜react.svg
 ┃ ┣ 📂components
 ┃ ┃ ┣ 📂common
 ┃ ┃ ┣ 📂customButtons
 ┃ ┃ ┃ ┣ 📜CustomButton.css
 ┃ ┃ ┃ ┗ 📜CustomButton.tsx
 ┃ ┃ ┣ 📂customCounter
 ┃ ┃ ┃ ┣ 📜CustomCounter.css
 ┃ ┃ ┃ ┗ 📜CustomCounter.tsx
 ┃ ┃ ┣ 📂customKeyField
 ┃ ┃ ┃ ┣ 📜CustomKeyField.css
 ┃ ┃ ┃ ┗ 📜CustomKeyField.tsx
 ┃ ┃ ┣ 📂customNote
 ┃ ┃ ┃ ┗ 📜CustomNote.tsx
 ┃ ┃ ┣ 📂customSelect
 ┃ ┃ ┃ ┗ 📜CustomSelect.tsx
 ┃ ┃ ┣ 📂customTextField
 ┃ ┃ ┃ ┣ 📜CustomTextField.css
 ┃ ┃ ┃ ┗ 📜CustomTextField.tsx
 ┃ ┃ ┣ 📂forms
 ┃ ┃ ┃ ┣ 📂addMatchForm
 ┃ ┃ ┃ ┃ ┗ 📜AddMatchForm.tsx
 ┃ ┃ ┃ ┣ 📂addPlayerForm
 ┃ ┃ ┃ ┃ ┗ 📜AddPlayerForm.tsx
 ┃ ┃ ┃ ┣ 📂addSpecialTournamentForm
 ┃ ┃ ┃ ┃ ┗ 📜AddSpecialTournamentForm.tsx
 ┃ ┃ ┃ ┣ 📂addTournamentForm
 ┃ ┃ ┃ ┃ ┗ 📜AddTournamentForm.tsx
 ┃ ┃ ┃ ┣ 📂confirm
 ┃ ┃ ┃ ┃ ┗ 📜FormConfirm.tsx
 ┃ ┃ ┃ ┣ 📂createScoreCounterForm
 ┃ ┃ ┃ ┃ ┗ 📜CreateScoreCounterForm.tsx
 ┃ ┃ ┃ ┣ 📂tournamentDetails
 ┃ ┃ ┃ ┃ ┣ 📂otherFormat
 ┃ ┃ ┃ ┃ ┃ ┗ 📜OtherRoundFormat.tsx
 ┃ ┃ ┃ ┃ ┗ 📂roundRobinForm
 ┃ ┃ ┃ ┃   ┗ 📜RoundRobinForm.tsx
 ┃ ┃ ┃ ┣ 📂workspace
 ┃ ┃ ┃ ┃ ┣ 📂addWorkspaceForm
 ┃ ┃ ┃ ┃ ┃ ┗ 📜FormAddWorkSpace.tsx
 ┃ ┃ ┃ ┃ ┗ 📂joinWorkspace
 ┃ ┃ ┃ ┃   ┗ 📜FormJoinWorkSpace.tsx
 ┃ ┃ ┃ ┣ 📜FormToggle.css
 ┃ ┃ ┃ ┗ 📜FormToggle.tsx
 ┃ ┃ ┣ 📂layout
 ┃ ┃ ┃ ┣ 📂MainLayout
 ┃ ┃ ┃ ┃ ┗ 📜MainLayout.tsx
 ┃ ┃ ┃ ┣ 📂footer
 ┃ ┃ ┃ ┃ ┗ 📜Footer.tsx
 ┃ ┃ ┃ ┣ 📂header
 ┃ ┃ ┃ ┃ ┣ 📜Header.css
 ┃ ┃ ┃ ┃ ┗ 📜Header.tsx
 ┃ ┃ ┃ ┣ 📂home
 ┃ ┃ ┃ ┃ ┣ 📜ListWorkspaces.tsx
 ┃ ┃ ┃ ┃ ┗ 📜WorkspaceCard.tsx
 ┃ ┃ ┃ ┣ 📂tournamentDetail
 ┃ ┃ ┃ ┃ ┣ 📂nav
 ┃ ┃ ┃ ┃ ┃ ┣ 📜Navbar.css
 ┃ ┃ ┃ ┃ ┃ ┗ 📜Navbar.tsx
 ┃ ┃ ┃ ┃ ┣ 📂tournamentMatches
 ┃ ┃ ┃ ┃ ┃ ┣ 📂editMatch
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜EditMatch.tsx
 ┃ ┃ ┃ ┃ ┃ ┣ 📂endRound
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜EndRoundForm.tsx
 ┃ ┃ ┃ ┃ ┃ ┣ 📂matchCard
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜MatchCard.tsx
 ┃ ┃ ┃ ┃ ┃ ┣ 📂matchTable
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜MacthTable.tsx
 ┃ ┃ ┃ ┃ ┃ ┣ 📂roundRobinRankings
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜RoundRobinRankings.tsx
 ┃ ┃ ┃ ┃ ┃ ┗ 📜TournamentMatchInRound.tsx
 ┃ ┃ ┃ ┃ ┗ 📂tournamentPlayers
 ┃ ┃ ┃ ┃   ┗ 📜playerCard.tsx
 ┃ ┃ ┃ ┗ 📂tournaments
 ┃ ┃ ┃   ┣ 📂tournamentCard
 ┃ ┃ ┃   ┃ ┣ 📜TournamentCard.css
 ┃ ┃ ┃   ┃ ┗ 📜TournamentCard.tsx
 ┃ ┃ ┃   ┗ 📂tournamentList
 ┃ ┃ ┃     ┣ 📜TournamentList.css
 ┃ ┃ ┃     ┗ 📜TournamentList.tsx
 ┃ ┃ ┣ 📂loading
 ┃ ┃ ┃ ┗ 📜WithLoading.tsx
 ┃ ┃ ┣ 📂nofitication
 ┃ ┃ ┃ ┗ 📜Notification.tsx
 ┃ ┃ ┗ 📂table
 ┃ ┃   ┣ 📂matchs
 ┃ ┃   ┃ ┗ 📜MatchsHistoryTable.tsx
 ┃ ┃   ┣ 📂pagination
 ┃ ┃   ┃ ┗ 📜Pagination.tsx
 ┃ ┃   ┣ 📂rackCheck
 ┃ ┃   ┃ ┗ 📜RackCheckTable.tsx
 ┃ ┃   ┣ 📂rankings
 ┃ ┃   ┃ ┣ 📜RankingTable.css
 ┃ ┃   ┃ ┗ 📜RankingTable.tsx
 ┃ ┃   ┣ 📜DataTable.css
 ┃ ┃   ┗ 📜DataTable.tsx
 ┃ ┣ 📂constants
 ┃ ┃ ┣ 📜apiResponseCode.ts
 ┃ ┃ ┣ 📜localStorage.ts
 ┃ ┃ ┣ 📜matchTypes.ts
 ┃ ┃ ┣ 📜navigation.ts
 ┃ ┃ ┗ 📜tournamentTypes.ts
 ┃ ┣ 📂context
 ┃ ┃ ┣ 📂notifycationContext
 ┃ ┃ ┃ ┗ 📜NotifycationContext.tsx
 ┃ ┃ ┣ 📂workspaceContext
 ┃ ┃ ┃ ┗ 📜WorkspaceContext.tsx
 ┃ ┃ ┗ 📜AppProviders.tsx
 ┃ ┣ 📂customhook
 ┃ ┃ ┣ 📜useLocalStorage.ts
 ┃ ┃ ┣ 📜useNotifycation.ts
 ┃ ┃ ┗ 📜useWorkspace.tsx
 ┃ ┣ 📂data
 ┃ ┃ ┣ 📜matchData.ts
 ┃ ┃ ┣ 📜rankingData.ts
 ┃ ┃ ┣ 📜tournamentData.ts
 ┃ ┃ ┗ 📜workspaces.ts
 ┃ ┣ 📂pages
 ┃ ┃ ┣ 📂CreateTournamentPage
 ┃ ┃ ┃ ┗ 📜CreateTournamentPage.tsx
 ┃ ┃ ┣ 📂HomePage
 ┃ ┃ ┃ ┣ 📜HomePage.css
 ┃ ┃ ┃ ┗ 📜HomePage.tsx
 ┃ ┃ ┣ 📂MatchsPage
 ┃ ┃ ┃ ┗ 📜MatchsPage.tsx
 ┃ ┃ ┣ 📂NotFoundPage
 ┃ ┃ ┃ ┗ 📜NotFoundPage.tsx
 ┃ ┃ ┣ 📂OverallPage
 ┃ ┃ ┃ ┗ 📜OverallPage.tsx
 ┃ ┃ ┣ 📂RankingPage
 ┃ ┃ ┃ ┣ 📜RankingPage.css
 ┃ ┃ ┃ ┗ 📜RankingPage.tsx
 ┃ ┃ ┣ 📂ScoreCounterPage
 ┃ ┃ ┃ ┗ 📜ScoreCounterPage.tsx
 ┃ ┃ ┣ 📂SettingPage
 ┃ ┃ ┃ ┗ 📜SettingPage.tsx
 ┃ ┃ ┣ 📂TournamentDetailPage
 ┃ ┃ ┃ ┣ 📂TournamentMatches
 ┃ ┃ ┃ ┃ ┗ 📜TournamentMatches.tsx
 ┃ ┃ ┃ ┣ 📂TournamentOverview
 ┃ ┃ ┃ ┃ ┗ 📜TournamentOverview.tsx
 ┃ ┃ ┃ ┣ 📂TournamentPlayers
 ┃ ┃ ┃ ┃ ┗ 📜TournamentPlayer.tsx
 ┃ ┃ ┃ ┣ 📂TournamentRanking
 ┃ ┃ ┃ ┃ ┗ 📜TournamentRanking.tsx
 ┃ ┃ ┃ ┗ 📜TournamentDetailLayout.tsx
 ┃ ┃ ┗ 📂TournamentPage
 ┃ ┃   ┗ 📜TournamentPage.tsx
 ┃ ┣ 📂redux
 ┃ ┃ ┣ 📂features
 ┃ ┃ ┃ ┣ 📂match
 ┃ ┃ ┃ ┃ ┣ 📜matchActions.ts
 ┃ ┃ ┃ ┃ ┣ 📜matchReducer.ts
 ┃ ┃ ┃ ┃ ┗ 📜matchTypes.ts
 ┃ ┃ ┃ ┣ 📂matchScoreEvent
 ┃ ┃ ┃ ┃ ┣ 📜matchScoreEventActions.ts
 ┃ ┃ ┃ ┃ ┣ 📜matchScoreEventReducer.ts
 ┃ ┃ ┃ ┃ ┗ 📜matchScoreEventTypes.ts
 ┃ ┃ ┃ ┣ 📂player
 ┃ ┃ ┃ ┃ ┣ 📜playerActions.ts
 ┃ ┃ ┃ ┃ ┣ 📜playerReducer.ts
 ┃ ┃ ┃ ┃ ┗ 📜playerTypes.ts
 ┃ ┃ ┃ ┣ 📂tournament
 ┃ ┃ ┃ ┃ ┣ 📜tournamentActions.ts
 ┃ ┃ ┃ ┃ ┣ 📜tournamentReducer.ts
 ┃ ┃ ┃ ┃ ┗ 📜tournamentTypes.ts
 ┃ ┃ ┃ ┣ 📂tournamentDetails
 ┃ ┃ ┃ ┃ ┣ 📜tournamentDetailAction.ts
 ┃ ┃ ┃ ┃ ┣ 📜tournamentDetailReducer.ts
 ┃ ┃ ┃ ┃ ┗ 📜tournamentDetailTypes.ts
 ┃ ┃ ┃ ┣ 📂workspace
 ┃ ┃ ┃ ┃ ┣ 📜workspaceAction.ts
 ┃ ┃ ┃ ┃ ┣ 📜workspaceReducer.ts
 ┃ ┃ ┃ ┃ ┗ 📜workspaceTypes.ts
 ┃ ┃ ┃ ┗ 📜common.ts
 ┃ ┃ ┣ 📂ui
 ┃ ┃ ┃ ┣ 📜viewActions.ts
 ┃ ┃ ┃ ┣ 📜viewReducer.ts
 ┃ ┃ ┃ ┗ 📜viewTypes.ts
 ┃ ┃ ┗ 📜store.ts
 ┃ ┣ 📂router
 ┃ ┃ ┣ 📜AppRouter.tsx
 ┃ ┃ ┣ 📜ProtectedRoute.tsx
 ┃ ┃ ┗ 📜path.ts
 ┃ ┣ 📂types
 ┃ ┃ ┣ 📜match.ts
 ┃ ┃ ┣ 📜matchScoreEvents.ts
 ┃ ┃ ┣ 📜player.ts
 ┃ ┃ ┣ 📜round.ts
 ┃ ┃ ┣ 📜tournament.ts
 ┃ ┃ ┗ 📜workspace.ts
 ┃ ┣ 📂ultils
 ┃ ┃ ┣ 📜axiosConfig.ts
 ┃ ┃ ┣ 📜format.ts
 ┃ ┃ ┣ 📜localForage.ts
 ┃ ┃ ┣ 📜locale-vi-short.ts
 ┃ ┃ ┣ 📜mapEnum.tsx
 ┃ ┃ ┗ 📜sortPlayerRanking.ts
 ┃ ┣ 📜App.css
 ┃ ┣ 📜App.tsx
 ┃ ┣ 📜index.css
 ┃ ┗ 📜main.tsx
 ┣ 📜.eslintrc.cjs
 ┣ 📜eslint.config.js
 ┣ 📜index.html
 ┣ 📜package.json
 ┣ 📜postcss.config.js
 ┣ 📜tailwind.config.js
 ┣ 📜tsconfig.app.json
 ┣ 📜tsconfig.json
 ┣ 📜tsconfig.node.json
 ┣ 📜vercel.json
 ┗ 📜vite.config.ts
```

## Các kỹ thuật / pattern nổi bật

1) Custom hooks
- Mục đích: tách logic tái sử dụng khỏi component UI. Thư mục `src/customhook/` chứa hook cho localStorage, workspace management, notification.

2) Context API và Providers
- `src/context/AppProviders.tsx` gói các provider như `NotificationProvider` và `WorkspaceProvider`. Dùng Context để chia sẻ state hoặc helper không cần Redux (ví dụ UI notifications, workspace local state).

3) State management (Redux)
- Ứng dụng dùng `redux` + `redux-thunk`. Store được cấu hình trong `src/redux/store.ts`. Các feature được tách thành reducers riêng (ví dụ `workspaceReducer`, `playerReducer`, `matchReducer`...).
- Có một action `CLEAR_CACHE` để reset toàn bộ store (xem `rootReducer` trong `store.ts`).

4) Routing
- `react-router-dom` với nested routes. `AppRouter.tsx` cấu hình routes và nested routes cho `TournamentDetail` với các sub-pages (Overview, Players, Matches, Rankings).
- `ProtectedRoute` được dùng để bọc các route cần xác thực (guard).

5) Lazy loading / code splitting
- Hiện tại project sử dụng HOC `WithLoading` để bọc component với logic hiển thị loading. Có thể nâng cấp bằng `React.lazy` + `Suspense` để split code theo route nhằm giảm bundle size.

6) API handling
- `src/ultils/axiosConfig.ts` (cấu hình axios) và `axios-retry` dùng để retry request khi có lỗi tạm thời.
- `localforage` được dùng cho caching/offline storage.

7) Forms & Validation
- `formik` + `yup` để xây dựng form và khai báo schema validation.

8) UI / Styling
- Tailwind CSS cùng với `index.css`/`App.css` để style. `framer-motion` để thêm hoạt ảnh mượt.

9) TypeScript best practices (hiện trạng)
- Có folder `src/types/` để tập trung các `interface`/`type`/`enum` giúp kiểm soát kiểu dữ liệu giữa components, reducers và API.
- Nên tiếp tục dùng: cụ thể hóa props, tránh `any`, dùng `ReturnType`/`Pick`/`Omit` khi cần, và định nghĩa rõ shape cho redux state & actions.

10) Reusable components & patterns
- Components được nhóm theo chức năng (custom buttons, text fields, tables, pagination). Điều này giúp tái sử dụng và dễ bảo trì.

## Cách chạy dự án (quick start)

Mở PowerShell (Windows) trong thư mục dự án `d:\Projects\BillardRankings\cuerank-clients` và chạy:

```powershell
# cài dependencies
npm install

# chạy dev server (Vite)
npm run dev

# build production
npm run build

# preview build (local)
npm run preview
```

Lưu ý:
- `vite.config.ts` hiện có cấu hình proxy cho `/api` trỏ đến `https://billardranking-sever.onrender.com`. Khi phát triển local với backend khác (ví dụ `http://localhost:8080`), cập nhật `target` trong `vite.config.ts` hoặc thiết lập biến môi trường phù hợp.

## Những file / điểm quan trọng nên xem
- `package.json` — liệt kê dependencies và scripts
- `vite.config.ts` — dev server & proxy
- `src/router/AppRouter.tsx` — cấu trúc routes, nested routes và protected routes
- `src/redux/store.ts` — cách cấu hình store và CLEAR_CACHE pattern
- `src/context/AppProviders.tsx` — nơi gói các Context providers
- `src/ultils/axiosConfig.ts` — cấu hình axios + retry, interceptors

## Điểm nổi bật / cải tiến kỹ thuật

- Clear-cache global: Ứng dụng có action `CLEAR_CACHE` để reset store — tiện khi logout hoặc cần refresh toàn bộ state.
- HOC `WithLoading`: pattern tái sử dụng để xử lý trạng thái loading, có thể kết hợp với react-query hoặc RTK Query để tối ưu data fetching.
- Sử dụng `axios-retry` + `localforage` giúp tăng độ bền mạng và cache cục bộ.
- Mã đã được tổ chức rõ ràng: `components`, `pages`, `redux`, `context`, `ultils`, `types` — thuận tiện cho mở rộng đội nhóm.

## Đề xuất phát triển trong tương lai

1) Migration sang Redux Toolkit (RTK) hoặc RTK Query để giảm boilerplate và cải thiện hiệu suất fetch/cache.
2) Thêm React Query nếu muốn caching & background refetch mạnh mẽ cho data fetching.
3) Áp dụng code-splitting bằng `React.lazy` và `Suspense` cho các route lớn (TournamentDetail, Ranking) để giảm bundle size ban đầu.
4) Thêm unit tests (Jest + React Testing Library) cho reducers, custom hooks và components then E2E tests (Cypress).
5) Thêm pipeline CI (GitHub Actions) để chạy lint & tests trên mỗi PR.
6) Cải thiện hệ thống i18n nếu cần multi-language (ví dụ react-i18next).

## Contributing / Cách đóng góp

- Fork repository, tạo branch mới cho feature/fix, mở PR mô tả thay đổi rõ ràng.
- Chạy `npm run lint` trước khi mở PR; nếu có tests, thêm test tương ứng.

## Tóm tắt hoàn thành

- README này được viết bằng tiếng Việt, chi tiết và tham chiếu các file cấu hình chính trong dự án (`package.json`, `vite.config.ts`, `src/router/AppRouter.tsx`, `src/redux/store.ts`, `src/context/AppProviders.tsx`).

Nếu bạn muốn tôi thêm ví dụ cấu trúc component cụ thể, hoặc tự động tạo mục "Ví dụ chạy component" trong README, hãy cho biết — tôi sẽ cập nhật README theo yêu cầu.
