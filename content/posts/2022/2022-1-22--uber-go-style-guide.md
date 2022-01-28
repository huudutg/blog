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

### Slice và map

Slice và map chứa con trỏ tới dữ liệu bên dưới của chúng nên chúng ta cần phải cẩn thận khi sử dụng 2 kiểu dữ liệu này. Slice và map mà bạn nhận được dưới dạng đối số có thể bị thay đổi nếu bạn lưu một tham chiếu tới nó.

<table>
<thead><tr><th>Bad</th> <th>Good</th></tr></thead>
<tbody>
<tr>
<td>

```go
func (d *Driver) SetTrips(trips []Trip) {
  d.trips = trips
}
trips := ...
d1.SetTrips(trips)
// Did you mean to modify d1.trips?
trips[0] = ...
```

</td>
<td>

```go
func (d *Driver) SetTrips(trips []Trip) {
  d.trips = make([]Trip, len(trips))
  copy(d.trips, trips)
}
trips := ...
d1.SetTrips(trips)
// We can now modify trips[0] without affecting d1.trips.
trips[0] = ...
```

</td>
</tr>

</tbody>
</table>

Tương tự, bạn cũng cần phải cẩn thận khi trả về slice hoặc map.

<table>
<thead><tr><th>Bad</th><th>Good</th></tr></thead>
<tbody>
<tr><td>

```go
type Stats struct {
  mu sync.Mutex
  counters map[string]int
}
// Snapshot returns the current stats.
func (s *Stats) Snapshot() map[string]int {
  s.mu.Lock()
  defer s.mu.Unlock()
  return s.counters
}
// snapshot is no longer protected by the mutex, so any
// access to the snapshot is subject to data races.
snapshot := stats.Snapshot()
```

</td><td>

```go
type Stats struct {
  mu sync.Mutex
  counters map[string]int
}
func (s *Stats) Snapshot() map[string]int {
  s.mu.Lock()
  defer s.mu.Unlock()
  result := make(map[string]int, len(s.counters))
  for k, v := range s.counters {
    result[k] = v
  }
  return result
}
// Snapshot is now a copy.
snapshot := stats.Snapshot()
```

</td></tr>
</tbody></table>

### Defer trong go

Defer cho phép câu lệnh được gọi ra nhưng không thực hiện ngay mà hoãn lại cho đến khi những câu lệnh xung quanh trả về kết quả. Câu lệnh được gọi qua defer sẽ được đưa vào stack (LIFO). Defer thường được dùng để dọn dẹp các tài nguyên như file và lock hoặc đóng các kết nối khi chương trình kết thúc.

<table>
<thead><tr><th>Bad</th><th>Good</th></tr></thead>
<tbody>
<tr><td>

```go
p.Lock()
if p.count < 10 {
  p.Unlock()
  return p.count
}
p.count++
newCount := p.count
p.Unlock()
return newCount
// easy to miss unlocks due to multiple returns
```

</td><td>

```go
p.Lock()
defer p.Unlock()
if p.count < 10 {
  return p.count
}
p.count++
return p.count
// more readable
```

</td></tr>
</tbody></table>

### Bắt đầu Enums với 1
Bạn nên bắt đầu enum với 1, trừ khi biến của bạn có giá trị mặc định là 0.
<table>
<thead><tr><th>Bad</th><th>Good</th></tr></thead>
<tbody>
<tr><td>

```go
type Operation int
const (
  Add Operation = iota
  Subtract
  Multiply
)
// Add=0, Subtract=1, Multiply=2
```

</td><td>

```go
type Operation int
const (
  Add Operation = iota + 1
  Subtract
  Multiply
)
// Add=1, Subtract=2, Multiply=3
```

</td></tr>
</tbody></table>

Ví dụ trường hợp enum bắt đầu từ 0:
```go
type OS int
const (
  Unknown OS = iota
  Android
  IOS
)
// Unknown=0, Android=1, IOS=2
```

### Errors
Tùy vào mục đích và tình huống sử dụng, bạn nên cân nhắc các kiểu error và dùng cho phù hợp:
- Nếu bạn cần xử lý một error cụ thể nào đó, chúng ta cần phải khai báo một top-level error hoặc một custom type error và kết hợp với các hàm [`errors.Is`] hoặc [`errors.As`].
- Nếu error message là một static string, bạn có thể dùng `errors.New`, còn nếu là dynamic string thì dùng  `fmt.Errorf` hoặc một custom error.

[`errors.Is`]: https://golang.org/pkg/errors/#Is
[`errors.As`]: https://golang.org/pkg/errors/#As

| Error matching? | Error Message | Guidance                            |
|-----------------|---------------|-------------------------------------|
| No              | static        | [`errors.New`]                      |
| No              | dynamic       | [`fmt.Errorf`]                      |
| Yes             | static        | top-level `var` with [`errors.New`] |
| Yes             | dynamic       | custom `error` type                 |

[`errors.New`]: https://golang.org/pkg/errors/#New
[`fmt.Errorf`]: https://golang.org/pkg/fmt/#Errorf

Ví dụ, tạo một error với [`errors.New`] và static string, sau đó export error này như một biến và dùng `errors.Is` để bắt nó và xử lý.

<table>
<thead><tr><th>No error matching</th><th>Error matching</th></tr></thead>
<tbody>
<tr><td>

```go
// package foo
func Open() error {
  return errors.New("could not open")
}
// package bar
if err := foo.Open(); err != nil {
  // Can't handle the error.
  panic("unknown error")
}
```

</td><td>

```go
// package foo
var ErrCouldNotOpen = errors.New("could not open")
func Open() error {
  return ErrCouldNotOpen
}
// package bar
if err := foo.Open(); err != nil {
  if errors.Is(err, foo.ErrCouldNotOpen) {
    // handle the error
  } else {
    panic("unknown error")
  }
}
```

</td></tr>
</tbody></table>

Đối với dynamic string error, dùng `fmt.Errorf` nếu không cần phải xử lý error đó, ngược lại, dùng một custom error.
<table>
<thead><tr><th>No error matching</th><th>Error matching</th></tr></thead>
<tbody>
<tr><td>

```go
// package foo
func Open(file string) error {
  return fmt.Errorf("file %q not found", file)
}
// package bar
if err := foo.Open("testfile.txt"); err != nil {
  // Can't handle the error.
  panic("unknown error")
}
```

</td><td>

```go
// package foo
type NotFoundError struct {
  File string
}
func (e *NotFoundError) Error() string {
  return fmt.Sprintf("file %q not found", e.File)
}
func Open(file string) error {
  return &NotFoundError{File: file}
}
// package bar
if err := foo.Open("testfile.txt"); err != nil {
  var notFound *NotFoundError
  if errors.As(err, &notFound) {
    // handle the error
  } else {
    panic("unknown error")
  }
}
```

</td></tr>
</tbody></table>

Có 3 cách để truyền error nếu hàm gọi bị lỗi:
- Trả về error gốc
- Thêm thông tin, context với `fmt.Errorf` và `%w`
- Thêm thông tin, context với `fmt.Errorf` và `%v`

Trả về error gốc khi bạn không thêm bất kỳ context nào, việc này sẽ giúp giữ nguyên type và message của error. Thích hợp cho các error có đầy đủ các thông tin cần thiết khi kiểm tra lỗi.

Nếu bạn muốn thêm các thông tin khác vào error (VD: thay vì nhận được một error với message mơ hồ "connection refused", bạn sẽ nhận được "call service abc: connection refused") thì hãy dùng `fmt.Errorf` kết hợp với `%w` hoặc `%v`.

- Dùng `%w` để wrap error lại và sau đó có thể upwrap với [errors.Unwrap](https://go.dev/blog/go1.13-errors), nhờ vậy mà chúng ta có thể xử lý error với `errors.Is` và `errors.As`.

- Dùng `%v` sẽ không thể bắt được các error với các hàm `errors.Is` và `errors.As`.

Khi thêm thông tin vào error, hạn chế dùng cụm từ "failed to", ví dụ:
<table>
<thead><tr><th>Bad</th><th>Good</th></tr></thead>
<tbody>
<tr><td>

```go
s, err := store.New()
if err != nil {
    return fmt.Errorf(
        "failed to create new store: %w", err)
}
```

</td><td>

```go
s, err := store.New()
if err != nil {
    return fmt.Errorf(
        "new store: %w", err)
}
```

</td></tr><tr><td>

```
failed to x: failed to y: failed to create new store: the error
```

</td><td>

```
x: y: new store: the error
```

</td></tr>
</tbody></table>
See also [Don't just check errors, handle them gracefully].

  [`"pkg/errors".Cause`]: https://godoc.org/github.com/pkg/errors#Cause
  [Don't just check errors, handle them gracefully]: https://dave.cheney.net/2016/04/27/dont-just-check-errors-handle-them-gracefully

### Error Naming 
Đối với các biến error global, sử dụng các prefix `Err` hoặc `err` (tùy theo bạn có muốn export nó hay không).
```go
var (
  // The following two errors are exported
  // so that users of this package can match them
  // with errors.Is.
  ErrBrokenLink = errors.New("link is broken")
  ErrCouldNotOpen = errors.New("could not open")
  // This error is not exported because
  // we don't want to make it part of our public API.
  // We may still use it inside the package
  // with errors.Is.
  errNotFound = errors.New("not found")
)
```

Đối với các kiểu custom error, dùng suffix `Error`.

```go
// Similarly, this error is exported
// so that users of this package can match it
// with errors.As.
type NotFoundError struct {
  File string
}
func (e *NotFoundError) Error() string {
  return fmt.Sprintf("file %q not found", e.File)
}
// And this error is not exported because
// we don't want to make it part of the public API.
// We can still use it inside the package
// with errors.As.
type resolveError struct {
  Path string
}
func (e *resolveError) Error() string {
  return fmt.Sprintf("resolve %q", e.Path)
}
```



To be continue...

### References

1. [Effective Go](https://golang.org/doc/effective_go.html)
2. [Go Common Mistakes](https://github.com/golang/go/wiki/CommonMistakes)
3. [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)
4. [Uber Go Style Guide](https://github.com/uber-go/guide/blob/master/style.md)
