# Basic Usage

Learn how to use Pika for viewing your local files.

## Starting the Server

### Basic Command

Start Pika in the current directory:

```bash
pika
```

This will:
- Start a local server on port 3000
- Open your default browser automatically
- Display all files in the current directory

### Specifying a Directory

View files in a specific directory:

```bash
pika /path/to/your/docs
```

### Custom Port

Use a different port:

```bash
pika -p 8080
```

## Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `-p, --port <number>` | Server port | 3000 |
| `-r, --recursive` | Enable recursive directory browsing | false |
| `-e, --exclude <pattern>` | Exclude files matching regex pattern | - |

## Examples

### View Markdown Documentation

```bash
cd my-project/docs
pika
```

### Recursive Browsing

Include all subdirectories:

```bash
pika -r
```

### Exclude Patterns

Exclude node_modules and hidden files:

```bash
pika -e "node_modules|^\."
```

### Multiple Options

Combine options:

```bash
pika -r -p 8080 -e "\.git|node_modules"
```

## Browser Interface

Once started, Pika provides:
- File tree navigation
- Markdown preview with syntax highlighting
- Mermaid diagram rendering
- HTML preview
- Raw file viewing

## Stopping the Server

Press `Ctrl+C` in the terminal to stop the server.