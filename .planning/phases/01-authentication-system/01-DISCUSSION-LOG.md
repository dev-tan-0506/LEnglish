# Phase 1: Authentication System - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-05
**Phase:** 1-Authentication System
**Areas discussed:** Authentication Strategy, Registration & Onboarding Flow, Profile & Avatar, Auth UI Style

---

## Authentication Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Email/Password Only | Đơn giản, kiểm soát hoàn toàn | ✓ |
| Email/Password + Google | Tiện lợi hơn | |
| Email/Password + Google + Facebook | Phủ rộng nhất | |

**User's choice:** 1 (Email/Password Only)
**Notes:** 

| Option | Description | Selected |
|--------|-------------|----------|
| httpOnly cookie | Bảo mật hơn, chống XSS | ✓ |
| localStorage + Bearer | Dễ implement nhưng dễ XSS | |
| Let agent decide | | |

**User's choice:** 1 (httpOnly cookie)
**Notes:** 

| Option | Description | Selected |
|--------|-------------|----------|
| Access (~15m) + Refresh (~7d) | Chuẩn security | ✓ |
| Single long-lived (~30d) | Đơn giản hơn | |
| Let agent decide | | |

**User's choice:** 1 (Access + Refresh token)
**Notes:** 

| Option | Description | Selected |
|--------|-------------|----------|
| 8+ chars | Đơn giản | |
| 8+ chars + upper, num, special | Truyền thống | ✓ |
| Let agent decide | | |

**User's choice:** 2 (8+ chars + upper, num, special)
**Notes:** 

---

## Registration & Onboarding Flow

| Option | Description | Selected |
|--------|-------------|----------|
| Require verify before access | Bảo mật cao | |
| Access immediately, verify later | Cân bằng bảo mật & UX | ✓ |
| No verify | Nhanh nhất | |

**User's choice:** 2 (Access immediately, verify later)
**Notes:** 

| Option | Description | Selected |
|--------|-------------|----------|
| Email + Password | Tối giản | |
| Email + Password + Name | Thêm cá nhân hóa | ✓ |
| Email + Password + Name + Score | Đầy đủ | |

**User's choice:** 2 (Email, Password, Name)
**Notes:** 

| Option | Description | Selected |
|--------|-------------|----------|
| 1-step (Target score) | User chọn mục tiêu ngay | ✓ |
| Multi-step | Trải nghiệm đầy đủ | |
| No onboarding | Nhanh nhất | |

**User's choice:** 1 (1-step Target score)
**Notes:** 

| Option | Description | Selected |
|--------|-------------|----------|
| Link via email | Chuẩn bảo mật | ✓ |
| OTP code via email | Hiện đại hơn | |
| Let agent decide | | |

**User's choice:** 1 (Link via email)
**Notes:** 

---

## Profile & Avatar

| Option | Description | Selected |
|--------|-------------|----------|
| Upload image | Cá nhân hóa cao | |
| Preset avatars | Drops style, vui nhộn | |
| Both | Tốt nhất nhưng phức tạp | ✓ |

**User's choice:** 3 (Both preset and upload)
**Notes:** 

| Option | Description | Selected |
|--------|-------------|----------|
| Name + Target + Avatar | Tối giản | |
| + Bio + Birthdate | Chuẩn bị cho social | |
| + Bio + Birthdate + Level | Chi tiết | ✓ |

**User's choice:** 3 (+ Bio + Birthdate + Level)
**Notes:** 

| Option | Description | Selected |
|--------|-------------|----------|
| Visual cards | Phong cách Drops | ✓ |
| Dropdown | Đơn giản | |
| Slider | Sáng tạo | |

**User's choice:** 1 (Visual cards)
**Notes:** 

| Option | Description | Selected |
|--------|-------------|----------|
| 3 levels | Rõ ràng | |
| 5 levels | Chi tiết | ✓ |
| Let agent decide | | |

**User's choice:** 2 (5 levels: Newbie / Beginner / Intermediate / Upper-Intermediate / Advanced)
**Notes:** 

---

## Auth UI Style

| Option | Description | Selected |
|--------|-------------|----------|
| Split-screen | Hiện đại | |
| Centered card | Đơn giản | |
| Full-screen immersive | Ấn tượng mạnh | ✓ |

**User's choice:** 3 (Full-screen immersive)
**Notes:** 

| Option | Description | Selected |
|--------|-------------|----------|
| 3D Flip | Vui nhộn, tương tác cao | ✓ |
| Horizontal Slide | Mượt mà | |
| Fade in/out | Đơn giản | |

**User's choice:** 1 (3D Flip)
**Notes:** 

| Option | Description | Selected |
|--------|-------------|----------|
| Pill shape + soft shadow | Playful, hợp Drops style | ✓ |
| Rounded corners + clear border| Hiện đại | |
| Underline | Tối giản | |

**User's choice:** 1 (Pill shape)
**Notes:** 

| Option | Description | Selected |
|--------|-------------|----------|
| Press down + hover scale | Giống physical game | ✓ |
| Ripple effect | Mượt mà | |
| Glow effect | Nổi bật | |

**User's choice:** 1 (Press down effect)
**Notes:** 
