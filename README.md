# 🌍 env-switcher

A powerful and easy-to-use CLI tool for managing multiple environment configurations. Effortlessly switch between development, production, and other environments with a single command!

## 🚀 Development Setup

### 📦 Installing Dependencies
To install all required dependencies, run:
```bash
bun install
```

### 🛠️ Running in Development
To start the CLI in development mode, run:
```bash
bun run index.ts
```

## 📦 Building the Executable

To create a standalone executable:
```bash
bun run build
```

This will generate a compiled binary in the `dist` folder called `env-switch<platform>`. For example, on Windows, it will be named `env-switch.exe`.

## 💾 Installation

1. Navigate to the `dist` folder.
2. Copy the `env-switch` executable to a directory in your PATH (see instructions for each OS below).
3. After adding it to your PATH, the `env-switch` command will be accessible globally from any terminal.

## ⚙️ Adding Executable to PATH

### 🖥️ Windows

1. Open Start, type "Environment Variables," and select "Edit the system environment variables."
2. In System Properties, click "Environment Variables."
3. Under "System variables," locate and select the "Path" variable, then click "Edit."
4. Click "New" and add the path to the directory containing `env-switch.exe` (e.g., `C:\Users\<username>\AppData\Local\Microsoft\WindowsApps`).
5. Click "OK" to apply changes and close each window.

To verify, open a new Command Prompt or PowerShell and type:
```bash
env-switch --help
```
You should see the help instructions for the `env-switch` command if everything is set up correctly.

### 🐧 Linux

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

### 🍏 macOS

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
This should display the help instructions for the `env-switch` command if the installation was successful.

## 📚 Usage

Switch between environments effortlessly:
```bash
env-switch dev    # 🌱 Switch to development environment
env-switch prod   # 🚀 Switch to production environment
env-switch test   # 🔍 Switch to testing environment
```

### 📝 Example
Use the `--force` option to switch without confirmation:
```bash
env-switch prod -f   # 🔒 Force switch to production
```

