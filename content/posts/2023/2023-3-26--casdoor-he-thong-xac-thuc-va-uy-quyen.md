---
title: Casdoor - Hệ thống xác thực và ủy quyền mạnh mẽ và đa tính năng/bugs
date: "2023-3-26"
template: "post"
draft: false
slug: casdoor-he-thong-xac-thuc-va-uy-quyen
category: "Tech"
tags:
  - "iam"
  - "Casdoor"
  - "SSO"
  - "2023"
description: Một UI-first Identity Access Management (IAM) / Single-Sign-On (SSO) platform hỗ trợ OAuth 2.0, OIDC, SAML and CAS, được tích hợp với Casbin - một thư viện quản lý quyền hỗ trợ mô hình RBAC và ABAC.
socialImage: media/2023/4/casdoor.png
thumbnail: media/2023/4/casdoor.png
---

Casdoor là một hệ thống xác thực và uỷ quyền mã nguồn mở và mạnh mẽ được thiết kế để dễ sử dụng và tích hợp vào bất kỳ dự án nào. Đó là một hệ thống quản lý truy cập tập trung, hỗ trợ multi-tenant, cung cấp giao diện xác thực và uỷ quyền chung cho các ứng dụng khác nhau.

Trong bài viết này, chúng ta sẽ ngó sơ qua về Casdoor, các tính năng mà mình thấy nổi bậc, kiến trúc và cách nó có thể được dùng để bảo mật dữ liệu của ứng dụng.

![How Casdoor work](/media/2023/4/casdoor-work.gif)

### Tính năng
[Casdoor](https://casdoor.org/) cung cấp một loạt các tính năng để quản lý xác thực và uỷ quyền dễ dàng hơn. Nổi bậc trong số đó (theo mình nhận định) gồm:

#### Multi-Tenancy
Casdoor hỗ trợ multi-tenant, có nghĩa là bạn có thể sử dụng nó để quản lý nhiều nhóm hoặc tổ chức. Mỗi tenant có policy, role và permission riêng, giúp admin dễ dàng quản lý các ứng dụng quy mô lớn.

#### Role-Based Access Control
Casdoor quản lý quyền dựa trên Casbin, cho phép bạn xác định role và permission, có thể được cấp cho người dùng hoặc nhóm. Điều này đảm bảo rằng chỉ những user có quyền mới có thể truy cập vào các tài nguyên hoặc tính năng cụ thể.

#### Support OAuth2 and OIDC
Casdoor hỗ trợ OAuth2 và OIDC, giúp dễ dàng tích hợp với các ứng dụng khác hỗ trợ các giao thức này. Chúng ta có thể sử dụng Casdoor để xác thực và uỷ quyền cho những user sử dụng các giao thức này mà không phải dựng riêng một authentication server.

#### Multi-Factor Authentication (MFA)
Casdoor hỗ trợ xác thực đa yếu tố (MFA) bằng TOTP hoặc email. MFA cung cấp một lớp bảo mật bổ sung, khiến người dùng không được uỷ quyền khó truy cập vào ứng dụng của bạn hơn.

#### Logs auditing
Casdoor cho phép ghi lại lịch sử của các request đến và xem lại chúng, đảm bảo có thể truy soát lại mọi request đến nếu cần thiết.

#### CDN cloud storage
Casdoor hỗ trợ nhiều CDN cloud storage: Alibaba Cloud, Tencent Cloud, Qiniu Cloud.

#### Customizable pages
Casdoor hỗ trợ tuỳ chỉnh các trang đăng nhập, đăng ký, quên mật khẩu,… theo thiết kế riêng của chúng ta.

#### Third-party applications login
Casdoor hỗ trợ đăng nhập với auth provider khác nhau, chẳng hạn như GitHub, Google, QQ, WeChat, v.v., và hỗ trợ mở rộng đăng nhập bên thứ ba với các plugin.

![Casdoor login](/media/2023/4/casdoor-login.png)

## Thiết kế

Front-end và back-end của Casdoor được tách biệt hoàn toàn và được phát triển bằng ngôn ngữ Golang + Reactjs, hỗ trợ tốt cho high concurrency, cung cấp một admin site (hỗ trợ nhiều ngôn ngữ) để quản lý mọi thứ.  Các thành phần chính của Casdoor bao gồm:

#### Cơ sở dữ liệu
Casdoor hỗ trợ nhiều loại database phổ biến như: MySQL, PostgreSQL, SQL Server, etc., và hỗ trợ mở rộng các loại database mới với các plugin.

#### API RESTful
Casdoor cung cấp API RESTful cho phép chúng ta quản lý user, policy, permission, role và nhiều đối tượng khác trong hệ thống một cách dễ dàng. Bạn có thể sử dụng API để tích hợp Casdoor vào ứng dụng của mình hoặc tự động hoá các tác vụ.

#### Frontend
Casdoor có giao diện người dùng tích hợp cho phép bạn quản lý người dùng, chính sách và quyền thông qua giao diện web. Giao diện người dùng có thể tuỳ chỉnh, cho phép bạn thay đổi giao diện để phù hợp với thiết kế ứng dụng của bạn.

#### Xác thực và uỷ quyền
Casdoor xử lý xác thực và uỷ quyền bằng cách cung cấp một bộ API mà bạn có thể sử dụng để xác thực người dùng và kiểm tra quyền của họ. Casdoor hỗ trợ các phương thức xác thực khác nhau, bao gồm OAuth2, OIDC và username/password.

### Casdoor SDK
[Casdoor SDK](https://casdoor.org/docs/how-to-connect/sdk) cung cấp nhiều function để giao tiếp với Casdoor như xác thực user, quản lý người dùng, upload các resource, v.v. Casdoor SDK hỗ trợ nhiều ngôn ngữ, giúp bạn dễ dàng tích hợp các ứng dụng của bạn với Casdoor.

#### 1. Backend SDK configuration
```go
var CasdoorEndpoint = "https://door.casdoor.com"
var ClientId = "541738959670d221d59d"
var ClientSecret = "66863369a64a5863827cf949bab70ed560ba24bf"
var CasdoorOrganization = "casbin"
var CasdoorApplication = "app-casnode"

//go:embed token_jwt_key.pem
var JwtPublicKey string

func init() {
    auth.InitConfig(CasdoorEndpoint, ClientId, ClientSecret, JwtPublicKey, CasdoorOrganization, CasdoorApplication)
}
```

#### 2. Frontend SDK configuration
```bash
npm install casdoor-js-sdk
```
Sau đó viết các function sau (nên bỏ trong file global Setting.js):

```js
import Sdk from "casdoor-js-sdk";

export function initCasdoorSdk(config) {
  CasdoorSdk = new Sdk(config);
}

export function getSignupUrl() {
  return CasdoorSdk.getSignupUrl();
}

export function getSigninUrl() {
  return CasdoorSdk.getSigninUrl();
}

export function getUserProfileUrl(userName, account) {
  return CasdoorSdk.getUserProfileUrl(userName, account);
}

export function getMyProfileUrl(account) {
  return CasdoorSdk.getMyProfileUrl(account);
}

export function getMyResourcesUrl(account) {
  return CasdoorSdk.getMyProfileUrl(account).replace("/account?", "/resources?");
}

export function signin() {
  return CasdoorSdk.signin(ServerUrl);
}

export function showMessage(type, text) {
  if (type === "") {
    return;
  } else if (type === "success") {
    message.success(text);
  } else if (type === "error") {
    message.error(text);
  }
}

export function goToLink(link) {
  window.location.href = link;
}
```
Trong index.js (hoặc app.js của React), chúng ta cần khởi tạo casdoor-js-sdk bằng cách gọi hàm InitConfig() với các tham số bắt buộc. 4 tham số đầu tiên phải giống với Casdoor-sdk ở backend lúc nãy. Tham số cuối cùng `redirectPath` là đường dẫn sẽ được chuyển hướng tới sau khi đăng nhập vào Casdoor thành công.
```js
const config = {
  serverUrl: "https://door.casdoor.com",
  clientId: "014ae4bd048734ca2dea",
  organizationName: "casbin",
  appName: "app-casnode",
  redirectPath: "/callback",
};

xxx.initCasdoorSdk(config);
```


### References

[Casdoor](https://casdoor.org/)
