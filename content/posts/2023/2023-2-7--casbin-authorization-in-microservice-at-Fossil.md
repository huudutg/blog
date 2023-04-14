---
title: Authorization in microservices at Fossil using Casbin
date: "2023-2-7"
template: "post"
draft: false
slug: authorization-in-microservices-at-fossil
category: "Tech"
tags:
  - "Authorization"
  - "Fossil"
  - "Microservice"
  - "2023"
description: Quản lý quyền truy cập đóng vai trò vô cùng quan trọng trong việc bảo mật hệ thống và dữ liệu của người dùng. Tuy nhiên, việc thực hiện phân quyền trong các ứng dụng phức tạp lại không phải là điều đơn giản. Để giải quyết vấn đề này, nhiều thư viện phân quyền đã được phát triển như OPA, Keycloak, Shiro,...  và Casbin chính là một ứng cử viên nổi bậc trong số đó.
socialImage: media/2023/4/golang-casbin.svg
thumbnail: media/2023/4/golang-casbin.svg
---

Mỗi thư viện phân quyền đều có ưu điểm và nhược điểm riêng nên việc lựa chọn thư viện phân quyền phù hợp cần phải dựa trên nhiều tiêu chí như tech stacks của team, hiệu suất, độ linh hoạt,… Sau khi cân đo đong đếm hết các tiêu chí thì Casbin chính là sự lựa chọn phù hợp nhất cho các service của team mình (hoặc ít nhất là mình nghĩ vậy :D).

Casbin là một thư viện phân quyền được sử dụng để quản lý quyền truy cập cho các ứng dụng và dịch vụ. Nó cung cấp cho người dùng một cách tiếp cận linh hoạt để xác định quyền truy cập cho các tài nguyên khác nhau, trong bài viết này, chúng ta sẽ tìm hiểu về Casbin và cách nó hoạt động.

### Giới thiệu về Casbin
[Casbin](https://casbin.org/) là một thư viện phân quyền mã nguồn mở và được phát triển bởi Casbin team. Casbin được viết bằng Golang và hỗ trợ nhiều ngôn ngữ lập trình khác nhau như Java, Python, Node.js, C++, PHP và Rust. Nó là một thư viện phân quyền mạnh mẽ, linh hoạt và dễ sử dụng, cho phép bạn định nghĩa và quản lý các quyền truy cập dựa trên model và policy.

![Languages supported](/media/2023/4/casbin-languages.png)

Trong Casbin, một mô hình phân quyền được trừu tượng hóa thành file .CONF dựa trên mô hình PERM (Policy, Effect, Request, Matchers). Vì vậy, việc thay đổi hoặc nâng cấp cơ chế phân quyền chỉ đơn giản là sửa đổi file .CONF.

`model.conf`
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

`policy.csv`
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
#### Online Editor
Bạn cũng có thể sử dụng trình chỉnh sửa trực tuyến (https://casbin.org/editor) để test model và policy của Casbin.

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

Tuy nhiên, Casbin không hỗ trợ:
1. Authentication (xác minh người dùng), nhưng nếu bạn tìm kiếm một `authentication platform`, tham khảo [Casdoor](https://casdoor.org/).
2. Quản lý danh sách user hoặc role. Việc tự quản lý user và role sẽ tiện lợi hơn cho các service. Casbin không được thiết kế để lưu trữ các yếu tố dùng dể xác minh người dùng (như username hay password). Tuy nhiên, Casbin lưu trữ ánh xạ user-role cho RBAC model.

### Cách dùng

#### 1. Khởi tạo `enforcer` với model và policy:

```sql
e, _ := casbin.NewEnforcer("path/to/model.conf", "path/to/policy.csv")
```

Bạn cũng có thể khởi tạo `enforcer` với policy được lưu trong Database thay vì file, xem phần [Policy-persistence](https://github.com/casbin/casbin#policy-persistence).

#### 2. Dùng enforcer hook để kiểm tra quyền ngay trước khi một `action/operation` nào đó diễn ra.

```sql
sub := "alice" // user muốn tham quan resource.
obj := "data1" // resource sắp được tham quan.
act := "read" // action/operation mà user muốn thực hiện trên resource.

if isAllowed, _ := e.Enforce(sub, obj, act); res {
    // cho phép alice xem data1
} else {
    // ứ cho
}
```

#### 3. Ngoài file policy ra, Casbin cũng có cung cấp API để quản lý quyền trong lúc runtime. Ví dụ: Chúng ta có thể xem tất cả các role của user:

```sql
roles, _ := e.GetImplicitRolesForUser(sub)
```

### Benchmark

So sánh với thư viện OPA, Casbin có hiệu suất vượt trội ở các service vừa và nhỏ (<800 rules), còn OPA luôn giữ vững phong độ và sự ổn định ở bất kỳ các thể loại service dù to hay nhỏ.

```sql
cpu: Intel(R) Xeon(R) Platinum 8259CL CPU @ 2.50GHz
```

```sql
| BenchmarkCasbinCan/xxsmall(4 rules)         	  140871	      8868 ns/op	    1790 B/op	      26 allocs/op
| BenchmarkCasbinCan/xsmall(20 rules)          	   97291	     12282 ns/op	    2370 B/op	      42 allocs/op
| BenchmarkCasbinCan/small(200 rules)              25354	     51982 ns/op	    9149 B/op	     222 allocs/op
| BenchmarkCasbinCan/medium(800 rules)             10000	    107197 ns/op	   16631 B/op	     422 allocs/op
| BenchmarkCasbinCan/large(1000 rules)              4203	    245478 ns/op	   38426 B/op	    1029 allocs/op
| BenchmarkCasbinCan/xlarge(2000 rules)             3050	    354988 ns/op	   73992 B/op	    1997 allocs/op
```

```sql
| BenchmarkOPACan/xxsmall         	            7021	    162238 ns/op	   35553 B/op	     695 allocs/op
| BenchmarkOPACan/xsmall          	            5041	    272975 ns/op	   34693 B/op	     686 allocs/op
| BenchmarkOPACan/small           	            7336	    283521 ns/op	   34510 B/op	     684 allocs/op
| BenchmarkOPACan/medium          	            7945	    257603 ns/op	   34496 B/op	     684 allocs/op
| BenchmarkOPACan/large           	            7657	    245168 ns/op	   34490 B/op	     685 allocs/op
| BenchmarkOPACan/xlarge          	            6612	    287445 ns/op	   34489 B/op	     685 allocs/op
```

### Nói chung
Casbin là một thư viện phân quyền mạnh mẽ, linh hoạt và dễ sử dụng, được phát triển bởi ngôn ngữ lập trình Go. Nó cung cấp cho chúng ta một cách tiếp cận linh hoạt và dễ dàng để quản lý quyền truy cập trong các service, là một thư viện đáng để cân nhắc khi chúng ta nghĩ đến việc phân quyền ở các service hoặc các hệ thống.

### References

[Casbin](https://casbin.org/)
