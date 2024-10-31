import { existsSync, copyFileSync, renameSync } from "bun:fs";
import path from "path";
import { Command } from "commander";
import readline from "readline";
import chalk from "chalk";

// Types
type Environment =
  | "dev"
  | "prod"
  | "staging"
  | "qa"
  | "uat"
  | "testing"
  | "local"
  | "dev-test"
  | "ci"
  | "cd"
  | "preview";

interface ProgramOptions {
  force: boolean;
}

// Constants
const VALID_ENVS: Environment[] = [
  "dev",
  "prod",
  "staging",
  "qa",
  "uat",
  "testing",
  "local",
  "dev-test",
  "ci",
  "cd",
  "preview",
];
const ENV_FILE_BASE = ".env";
const ENV_EXAMPLE = ".env.example";

// Enhanced logger with chalk colors and emojis
const logger = {
  info: (message: string) => console.log(`${chalk.blue("ℹ️")} ${message}`),
  success: (message: string) => console.log(`${chalk.green("✅")} ${message}`),
  error: (message: string) => console.error(`${chalk.red("❌")} ${message}`),
  warn: (message: string) => console.log(`${chalk.yellow("⚠️")} ${message}`),
  env: (name: Environment) => {
    const colors = {
      dev: chalk.green,
      prod: chalk.red,
      staging: chalk.blue,
      qa: chalk.yellow,
      uat: chalk.magenta,
      testing: chalk.gray,
      local: chalk.green,
      "dev-test": chalk.blue,
      ci: chalk.yellow,
      cd: chalk.yellow,
      preview: chalk.blue,
    };
    return colors[name](name);
  },
};

// CLI Setup
const program = new Command();
program
  .name(chalk.bold("env-switch"))
  .version("1.0.0")
  .description(
    `${chalk.bold("🌐 Switch between multiple environment configurations")}

${chalk.yellow("🔹 Available Environments:")}
  ${chalk.cyan("Main:")}         ${logger.env("dev")}, ${logger.env(
      "prod"
    )}, ${logger.env("staging")}, ${logger.env("qa")}, ${logger.env(
      "uat"
    )}, ${logger.env("testing")}
  ${chalk.cyan("Development:")}  ${logger.env("local")}, ${logger.env(
      "dev-test"
    )}
  ${chalk.cyan("CI/CD:")}        ${logger.env("ci")}, ${logger.env(
      "cd"
    )}, ${logger.env("preview")}

${chalk.yellow("📋 Examples:")}
  $ ${chalk.green("env-switch dev")}     ${chalk.gray(
      "# 🌱 Switch to development environment"
    )}
  $ ${chalk.red("env-switch prod -f")} ${chalk.gray(
      "# 🚨 Force switch to production environment"
    )}`
  )
  .argument("<new_env>", "Environment to switch to")
  .option("-f, --force", "Force switch without confirmation")
  .parse(process.argv);

const options = program.opts<ProgramOptions>();
const newEnv = program.args[0].toLowerCase();
const force = options.force;

class EnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnvironmentError";
  }
}

function getEnvFilePath(env?: string, isActive = false): string {
  let envFilePath = path.join(process.cwd(), ENV_FILE_BASE);
  if (env) {
    envFilePath = `${envFilePath}.${env}`;
    if (isActive) {
      envFilePath += ".active";
    }
  }
  return envFilePath;
}

function getValidEnvironments(): Environment[] {
  return VALID_ENVS;
}

function getActiveEnvironment(): Environment | null {
  const validEnvs = getValidEnvironments();
  for (const env of validEnvs) {
    const activeEnvPath = getEnvFilePath(env, true);
    if (existsSync(activeEnvPath)) {
      return env;
    }
  }
  return null;
}

function getNewEnvironment(env: string): Environment {
  if (!VALID_ENVS.includes(env as Environment)) {
    throw new EnvironmentError(
      `❌ Invalid environment "${chalk.red(
        env
      )}". Valid options are:\n${VALID_ENVS.map((e) => logger.env(e)).join(
        ", "
      )}`
    );
  }
  return env as Environment;
}

function copyFile(source: string, destination: string): void {
  try {
    copyFileSync(source, destination);
    logger.success(
      `📁 Copied ${chalk.cyan(source)} to ${chalk.cyan(destination)}`
    );
  } catch (error) {
    logger.error(
      `Error copying file from ${chalk.cyan(source)} to ${chalk.cyan(
        destination
      )}: ${error}`
    );
    process.exit(1);
  }
}

function renameFile(source: string, destination: string): void {
  try {
    renameSync(source, destination);
    logger.success(
      `🔄 Renamed ${chalk.cyan(source)} to ${chalk.cyan(destination)}`
    );
  } catch (error) {
    logger.error(
      `Error renaming file from ${chalk.cyan(source)} to ${chalk.cyan(
        destination
      )}: ${error}`
    );
    process.exit(1);
  }
}

function switchToEnvironment(
  newEnv: Environment,
  activeEnv: Environment | null
): void {
  const envFile = getEnvFilePath();
  const newEnvFile = getEnvFilePath(newEnv);

  if (activeEnv) {
    const activeEnvFile = getEnvFilePath(activeEnv, true);
    copyFile(envFile, activeEnvFile);
    renameFile(activeEnvFile, getEnvFilePath(activeEnv));
  }

  if (!existsSync(newEnvFile)) {
    logger.warn(
      `Environment file ${chalk.cyan(
        newEnvFile
      )} does not exist. Creating from ${chalk.cyan(ENV_EXAMPLE)}.`
    );
    copyFile(ENV_EXAMPLE, newEnvFile);
  }

  copyFile(newEnvFile, envFile);
  renameFile(newEnvFile, getEnvFilePath(newEnv, true));
}

async function promptUser(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    return await new Promise((resolve) => {
      rl.question(chalk.yellow(`🤔 ${question}`), (answer) => {
        resolve(answer);
      });
    });
  } finally {
    rl.close();
  }
}

async function main(): Promise<void> {
  try {
    const targetEnv = getNewEnvironment(newEnv);
    const activeEnv = getActiveEnvironment();

    logger.info(`🌍 New Environment:\t${logger.env(targetEnv)}`);
    logger.info(
      `⚙️ Active Environment:\t${
        activeEnv ? logger.env(activeEnv) : chalk.gray("None")
      }`
    );

    if (targetEnv === activeEnv) {
      logger.info(
        `🎉 No action needed. Already in ${logger.env(targetEnv)} environment.`
      );
      return;
    }

    let proceed = force;
    if (!force) {
      const answer = await promptUser(
        `Are you sure you want to switch to ${logger.env(targetEnv)}? (y/n): `
      );
      proceed = answer.trim().toLowerCase() === "y";
    }

    if (proceed) {
      switchToEnvironment(targetEnv, activeEnv);
      logger.success(
        `🎊 Successfully switched to ${logger.env(targetEnv)} environment.`
      );
    } else {
      logger.info("❎ Operation cancelled.");
    }
  } catch (error) {
    if (error instanceof EnvironmentError) {
      logger.error(error.message);
    } else {
      logger.error(`Unexpected error: ${error}`);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  logger.error(`💥 Fatal error: ${error}`);
  process.exit(1);
});
