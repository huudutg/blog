---
title: Authorization in microservices at Fossil
date: "2023-2-7"
template: "post"
draft: false
slug: authorization-in-microservices-at-fossil
category: "Tech"
tags:
  - "Authorization"
  - "Fossil"
  - "Microservice"
description: Quản lý quyền truy cập đóng vai trò vô cùng quan trọng trong việc bảo mật hệ thống và dữ liệu của người dùng. Tuy nhiên, việc thực hiện phân quyền trong các ứng dụng phức tạp lại không phải là điều đơn giản. Để giải quyết vấn đề này, nhiều thư viện phân quyền đã được phát triển như OPA, Keycloak, Shiro,...  và Casbin chính là một ứng cử viên nổi bậc trong số đó.
socialImage: media/2023/4/golang-casbin.svg
thumbnail: media/2023/4/golang-casbin.svg
---

Mỗi thư viện phân quyền đều có ưu điểm và nhược điểm riêng nên việc lựa chọn thư viện phân quyền phù hợp cần phải dựa trên nhiều tiêu chí như tech stacks của team, hiệu suất, độ linh hoạt,… Sau khi cân đo đong đếm hết các tiêu chí thì Casbin chính là sự lựa chọn phù hợp nhất cho các service của team (tính đến thời điểm hiện tại).

Casbin là một thư viện phân quyền được sử dụng để quản lý quyền truy cập cho các ứng dụng và dịch vụ. Nó cung cấp cho người dùng một cách tiếp cận linh hoạt để xác định quyền truy cập cho các tài nguyên khác nhau, trong bài viết này, chúng ta sẽ tìm hiểu về Casbin và cách nó hoạt động.

### Giới thiệu về Casbin
Casbin là một thư viện phân quyền mã nguồn mở và được phát triển bởi Casbin team. Casbin được viết bằng Golang và hỗ trợ nhiều ngôn ngữ lập trình khác nhau như Java, Python, Node.js, C++, PHP và Rust. Nó là một thư viện phân quyền mạnh mẽ, linh hoạt và dễ sử dụng, cho phép bạn định nghĩa và quản lý các quyền truy cập dựa trên `model` và `policy`.

Trong Casbin, một mô hình phân quyền được trừu tượng hóa thành file .CONF dựa trên mô hình PERM (Policy, Effect, Request, Matchers). Vì vậy, việc thay đổi hoặc nâng cấp cơ chế phân quyền chỉ đơn giản là sửa đổi file .CONF.

```sql
# Request definition
[request_definition]
r = sub, obj, act

# Policy definition
[policy_definition]
p = sub, obj, act

# Policy effect
[policy_effect]
e = some(where (p.eft == allow))

# Matchers
[matchers]
m = r.sub == p.sub && r.obj == p.obj && r.act == p.act
```

```sql
p, alice, data1, read
p, bob, data2, write
```

Nghĩa là:

- `alice` có thể `read` `data1`
- `bob` có thể  `write` `data2`

Ngoài ra bạn cũng có thể dùng toán tử `in` (và nhiều toán tử khác - tham khảo [govaluate](https://github.com/Knetic/govaluate#what-operators-and-types-does-this-support))

```sql
# Matchers
[matchers]
m = r.obj == p.obj && r.act == p.act || r.obj in ('data2', 'data3')
```

### Các tính năng của Casbin
Casbin cung cấp một số tính năng hữu ích để quản lý quyền truy cập, bao gồm:

1. Hỗ trợ nhiều mô hình phân quyền:
Casbin hỗ trợ nhiều mô hình phân quyền, bao gồm RBAC (Role-Based Access Control), ABAC (Attribute-Based Access Control), và các mô hình phân quyền tùy chỉnh. Bạn có thể chọn mô hình phù hợp với nhu cầu của ứng dụng của bạn. Xem các mô hình được hỗ trợ và ví dụ tại [đây](https://github.com/casbin/casbin/tree/master/examples).
2. Hỗ trợ nhiều ngôn ngữ lập trình:
Casbin hỗ trợ nhiều ngôn ngữ lập trình như Golang, Java, Python, C++, Rust và Node.js, cho phép bạn tích hợp Casbin vào ứng dụng của bạn dễ dàng hơn.
3. Xác định quyền truy cập dựa trên nhiều yếu tố:
Casbin cho phép xác định quyền truy cập dựa trên nhiều yếu tố như vai trò, thuộc tính, ngày giờ, địa điểm và các yếu tố tùy chỉnh khác.
4. Hỗ trợ nhiều loại nguồn dữ liệu chính sách:
Casbin hỗ trợ nhiều loại nguồn dữ liệu chính sách như CSV, JSON, TOML, YAML và các loại cơ sở dữ liệu như MySQL, PostgreSQL, SQLite và MongoDB.
5. Tích hợp với nhiều framework:
Casbin có thể tích hợp với nhiều framework phổ biến như Gin, Beego, Echo, Spring và Django.
6. Hỗ trợ phân quyền truy cập trên nhiều cấp độ:
Casbin hỗ trợ phân quyền truy cập trên nhiều cấp độ, từ các yêu cầu HTTP đến các hành động tương tác với cơ sở dữ liệu hoặc tài nguyên khác.
7. Dễ sử dụng và cấu hình:
Casbin có cấu trúc đơn giản, dễ sử dụng và cấu hình, cho phép bạn tùy chỉnh các quy tắc chính sách một cách dễ dàng.

### Kết luận
Casbin là một thư viện phân quyền mạnh mẽ và dễ sử dụng, được phát triển bởi ngôn ngữ lập trình Go. Nó cung cấp cho chúng ta một cách tiếp cận linh hoạt và dễ dàng để quản lý quyền truy cập trong các service.