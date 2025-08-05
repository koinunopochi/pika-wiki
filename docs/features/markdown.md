# Markdown Support

Pika provides full GitHub-flavored markdown support with additional features.

## Basic Formatting

### Text Styles

- **Bold text** using `**text**`
- *Italic text* using `*text*`
- ***Bold and italic*** using `***text***`
- ~~Strikethrough~~ using `~~text~~`
- `Inline code` using backticks

### Lists

#### Unordered Lists
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

#### Ordered Lists
1. First step
2. Second step
   1. Sub-step A
   2. Sub-step B
3. Third step

## Code Blocks

```javascript
// JavaScript example
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet('Pika User');
```

```python
# Python example
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))  # Output: 120
```

## Tables

| Feature | Description | Status |
|---------|-------------|--------|
| Markdown | GitHub-flavored markdown | ✅ Supported |
| Mermaid | Diagram support | ✅ Supported |
| Syntax Highlighting | Code highlighting | ✅ Supported |

## Links and Images

- [External Link](https://github.com/koinunopochi/pika)
- [Internal Link](../getting-started/installation.md)

## Blockquotes

> This is a blockquote.
> It can span multiple lines.
>
> > And can be nested too!

## Horizontal Rule

---

## Task Lists

- [x] Completed task
- [ ] Incomplete task
- [ ] Another todo item