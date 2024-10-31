# env-switcher

A CLI tool for managing multiple environment configurations.

## Development Setup

To install dependencies:
```bash
bun install
```

To run in development:
```bash
bun run index.ts
```

## Building the Executable

Build the standalone executable:
```bash
bun run build
```

This will create a compiled binary in the `dist` folder called `env-switch<platform>`. For example, on Windows, the executable will be called `env-switch.exe`.

## Installation

1. Navigate to the `dist` folder.
2. Copy the `env-switch` executable to a directory in your PATH (instructions below for each OS).
3. Once added, the `env-switch` command will be available globally in any terminal.

## Adding Executable to PATH

### Windows

1. Open the Start Search, type in "Environment Variables," and choose "Edit the system environment variables."
2. In the System Properties window, click on the "Environment Variables" button.
3. Under "System variables," scroll down and select the "Path" variable, then click "Edit."
4. Click "New" and add the path to the directory where you copied `env-switch.exe` (e.g., `C:\Users\<username>\AppData\Local\Microsoft\WindowsApps`).
5. Click "OK" to close each window and apply the changes.

To verify, open a new Command Prompt or PowerShell and type:
```bash
env-switch --help
```

If successful, this should display the help instructions for the `env-switch` command.

### Linux

1. Copy the `env-switch` binary to a directory in your PATH, such as `/usr/local/bin`:
   ```bash
   sudo cp dist/env-switch /usr/local/bin/
   ```
2. Ensure the binary has executable permissions:
   ```bash
   sudo chmod +x /usr/local/bin/env-switch
   ```

To verify, open a new terminal and type:
```bash
env-switch --help
```

If successful, this should display the help instructions for the `env-switch` command.

### macOS

1. Copy the `env-switch` binary to a directory in your PATH, such as `/usr/local/bin`:
   ```bash
   sudo cp dist/env-switch /usr/local/bin/
   ```
2. Ensure the binary has executable permissions:
   ```bash
   sudo chmod +x /usr/local/bin/env-switch
   ```

To verify, open a new terminal and type:
```bash
env-switch --help
```

If successful, this should display the help instructions for the `env-switch` command.

## Usage

Switch environments using:
```bash
env-switch dev    # Switch to development environment
env-switch prod   # Switch to production environment
env-switch test   # Switch to testing environment
```

