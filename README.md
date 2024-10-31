# 🌍 env-switcher

A powerful and easy-to-use CLI tool for managing multiple environment configurations. Effortlessly switch between development, production, and other environments with a single command!

## 📝 What It Does

`env-switcher` simplifies environment management by allowing you to switch between different environment configurations for your application with ease. Here’s how it works:

- **Switching Environments**: With a single command, `env-switcher` updates your project’s `.env` file to reflect the specified environment (e.g., `dev`, `prod`, `testing`).
- **File Management**: The tool automatically manages environment files, ensuring that each environment has a corresponding `.env.<env>` file.
- **Backs Up Active Configurations**: If an environment is already active, it backs up the current `.env` configuration, so you can revert if needed.
- **Customizable Behavior**: You can force a switch without confirmation using the `-f` flag, or receive a prompt for added safety when switching to a sensitive environment like `prod`.
- **Supports Various Environments**: Out-of-the-box support for common environments like `dev`, `prod`, `staging`, and `qa`, as well as custom options like `ci`, `cd`, and `preview`.

This tool is designed for CI/CD workflows, staging deployments, and multi-environment development, making it ideal for projects that require frequent and smooth transitions between configurations.

## 🌟 Example

Let’s say you have the following environment files:

```
.env               # The active environment file
.env.dev           # Development environment
.env.prod          # Production environment
.env.staging       # Staging environment
.env.example       # Example template for new environments
```

Suppose you're currently in the `dev` environment and want to switch to `prod`. Here’s how `env-switcher` works in practice:

1. Run the command to switch to `prod`:
   ```bash
   env-switch prod
   ```
   
2. `env-switcher` will:
   - **Backup** the current `.env` file as `.env.dev.active` (marking `dev` as previously active).
   - **Rename** `.env.prod` to `.env.prod.active` to indicate it's currently in use.
   - **Copy** the contents of `.env.prod` into `.env`, making it the new active environment configuration.

### 📝 Example with Force Option
Use the `--force` option to switch without confirmation:
```bash
env-switch prod -f   # 🔒 Force switch to production
```

### After Switching
Your environment files would look like this:
```
.env               # Now contains production settings
.env.dev.active    # Backup of the previous development environment
.env.prod.active   # Indicates that production is the current environment
.env.staging       # Unchanged, still available if needed
.env.example       # Example template
```

This keeps all your environment configurations organized and ensures a safe, quick switch between environments.

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

## 📝 Example Commands

- **Switch to Development**:
   ```bash
   env-switch dev
   ```

- **Switch to Production with Force Option**:
   ```bash
   env-switch prod -f   # 🔒 Force switch to production without confirmation
   ```

