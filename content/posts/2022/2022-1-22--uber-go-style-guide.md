---
title: Golang Style Guide
date: "2022-1-22"
template: "post"
draft: false
slug: "golang-style-guide"
category: "Golang"
tags:
  - "Golang"
  - "Style guide"
description: Một vài quy ước khi code golang giúp code của mình dễ đọc, quản lý và nâng cấp hơn.
socialImage: "/media/2021/12/fast-food.png"
thumbnail: media/2022/1/uber-styles-guide.png
---

Có một số quy ước và lỗi thường gặp mà nếu mình biết ngay từ đầu khi học golang thì có lẽ sẽ dễ thở hơn cho mình ở đoạn sau. Dưới đây là một số code conventions mà mình học được hoặc là đã gặp qua ở đâu đó trong lúc mình code.

### Pointers to Interfaces

Go interface khá là đặc biệt so với interface của những ngôn ngữ khác, bạn không cần phải khai báo type của bạn implement interface, chỉ cần có đủ các method đã được định nghĩa trong interface, compiler sẽ lo phần còn lại.

Ex: https://go.dev/play/p/erodX-JplO

Một interface của go gồm 2 phần:

1. Con trỏ trỏ tới thông tin của một kiểu dữ liệu cụ thể nào đó. Có thể gọi nó là type.
2. Con trỏ tới data từ giá trị mà bạn truyền vào interface

```go
data := c
w := Walker{
    type: &InterfaceType{
              valtype: &typeof(c),
              func0: &Camel.Walk
          }
    data: &data
}
```

Thường bạn không cần con trỏ tới một interface trừ khi bạn muốn các method của interface thay đổi dữ liệu phía dưới.

### Verify Interface Compliance

<table>
<thead><tr><th>Bad</th><th>Good</th></tr></thead>
<tbody>
<tr><td>

```go
type Handler struct {
  // ...
}
func (h *Handler) ServeHTTP(
  w http.ResponseWriter,
  r *http.Request,
) {
  ...
}
```

</td><td>

```go
type Handler struct {
  // ...
}
var _ http.Handler = (*Handler)(nil)
func (h *Handler) ServeHTTP(
  w http.ResponseWriter,
  r *http.Request,
) {
  // ...
}
```

</td></tr>
</tbody></table>

Đoạn `var _ http.Handler = (*Handler)(nil)` sẽ fail lúc compile nếu `Handler` không khớp với `http.Handler` interface.

Phía bên phải của phép gán phải là `zero value` của kiểu dữ liệu, `nil` nếu đó là kiểu pointer (`*Handler`), slices, maps và empty struct nếu là struct type.
```go
type LogHandler struct {
  h   http.Handler
  log *zap.Logger
}

var _ http.Handler = LogHandler{}

func (h LogHandler) ServeHTTP(
  w http.ResponseWriter,
  r *http.Request,
) {
  // ...
}
```
See also: [Pointers vs. Values]: https://golang.org/doc/effective_go.html#pointers_vs_values
### Zero-value Mutexes are Valid
Zero-value của `sync.Mutex` và `sync.RWMutex` là hợp lệ, bạn không cần dùng con trỏ tới mutex.
<table>
<thead><tr><th>Bad</th><th>Good</th></tr></thead>
<tbody>
<tr><td>

```go
mu := new(sync.Mutex)
mu.Lock()
```

</td><td>

```go
var mu sync.Mutex
mu.Lock()
```

</td></tr>
</tbody></table>
Nếu bạn dùng con trỏ tới struct, con trỏ mutex phải là một trường non-pointer ở trong đó. Đừng gán mutex vào struct dù đó là unexported struct.
<table>
<thead><tr><th>Bad</th><th>Good</th></tr></thead>
<tbody>
<tr><td>

```go
type SMap struct {
  sync.Mutex
  data map[string]string
}
func NewSMap() *SMap {
  return &SMap{
    data: make(map[string]string),
  }
}
func (m *SMap) Get(k string) string {
  m.Lock()
  defer m.Unlock()
  return m.data[k]
}
```

</td><td>

```go
type SMap struct {
  mu sync.Mutex
  data map[string]string
}
func NewSMap() *SMap {
  return &SMap{
    data: make(map[string]string),
  }
}
func (m *SMap) Get(k string) string {
  m.mu.Lock()
  defer m.mu.Unlock()
  return m.data[k]
}
```

</td></tr>

<tr><td>

The `Mutex` field, and the `Lock` and `Unlock` methods are unintentionally part
of the exported API of `SMap`.

</td><td>

The mutex and its methods are implementation details of `SMap` hidden from its
callers.

</td></tr>
</tbody></table>

To be continue...

### References
1. [Effective Go](https://golang.org/doc/effective_go.html)
2. [Go Common Mistakes](https://github.com/golang/go/wiki/CommonMistakes)
3. [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)
4. [Uber Go Style Guide](https://github.com/uber-go/guide/blob/master/style.md)