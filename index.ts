/**
 * env-switcher - A CLI tool for managing multiple environment configurations
 * @license MIT
 */

import { existsSync, copyFileSync, renameSync } from "bun:fs";
import path from "path";
import { Command } from "commander";
import readline from "readline";

// Types
type Environment = 'dev' | 'prod' | 'testing';
interface ProgramOptions {
  force: boolean;
}

// Constants
const VALID_ENVS: Environment[] = ["dev", "prod", "testing"];
const ENV_FILE_BASE = ".env";
const ENV_EXAMPLE = ".env.example";

// Logger
const logger = {
  info: (message: string) => console.log(`ℹ️ ${message}`),
  success: (message: string) => console.log(`✅ ${message}`),
  error: (message: string) => console.error(`❌ ${message}`),
};

// CLI Setup
const program = new Command();
program
  .name("env-switch")
  .version('1.0.0') // Match package.json version
  .description("Switch between multiple environment configurations")
  .argument("<new_env>", "New environment to switch to (dev, prod, or testing)")
  .option("-f, --force", "Force switch without confirmation")
  .parse(process.argv);

const options = program.opts<ProgramOptions>();
const newEnv = program.args[0].toLowerCase();
const force = options.force;

/**
 * Generates the environment file path based on environment and active status
 */
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

/**
 * Returns list of valid environments
 */
function getValidEnvironments(): Environment[] {
  return VALID_ENVS;
}

/**
 * Gets the currently active environment
 */
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

/**
 * Validates and returns the new environment
 */
class EnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvironmentError';
  }
}

function getNewEnvironment(env: string): Environment {
  if (!VALID_ENVS.includes(env as Environment)) {
    throw new EnvironmentError(
      `Invalid environment "${env}". Valid options are: ${VALID_ENVS.join(", ")}`
    );
  }
  return env as Environment;
}

/**
 * Safely copies a file with error handling
 */
function copyFile(source: string, destination: string): void {
  try {
    copyFileSync(source, destination);
    logger.success(`Copied ${source} to ${destination}`);
  } catch (error) {
    logger.error(`Error copying file from ${source} to ${destination}: ${error}`);
    process.exit(1);
  }
}

/**
 * Safely renames a file with error handling
 */
function renameFile(source: string, destination: string): void {
  try {
    renameSync(source, destination);
    logger.success(`Renamed ${source} to ${destination}`);
  } catch (error) {
    logger.error(`Error renaming file from ${source} to ${destination}: ${error}`);
    process.exit(1);
  }
}

/**
 * Switches to the specified environment
 */
function switchToEnvironment(newEnv: Environment, activeEnv: Environment | null): void {
  const envFile = getEnvFilePath();
  const newEnvFile = getEnvFilePath(newEnv);

  if (activeEnv) {
    const activeEnvFile = getEnvFilePath(activeEnv, true);
    copyFile(envFile, activeEnvFile);
    renameFile(activeEnvFile, getEnvFilePath(activeEnv));
  }

  if (!existsSync(newEnvFile)) {
    logger.info(`Environment file ${newEnvFile} does not exist. Creating from ${ENV_EXAMPLE}.`);
    copyFile(ENV_EXAMPLE, newEnvFile);
  }

  copyFile(newEnvFile, envFile);
  renameFile(newEnvFile, getEnvFilePath(newEnv, true));
}

/**
 * Prompts user for input with proper cleanup
 */
async function promptUser(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    return await new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  } finally {
    rl.close();
  }
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  try {
    const targetEnv = getNewEnvironment(newEnv);
    const activeEnv = getActiveEnvironment();

    logger.info(`New Environment:\t${targetEnv}`);
    logger.info(`Active Environment:\t${activeEnv || "None"}`);

    if (targetEnv === activeEnv) {
      logger.info(`No action needed. Already in "${targetEnv}" environment.`);
      return;
    }

    let proceed = force;
    if (!force) {
      const answer = await promptUser(
        `Are you sure you want to switch to "${targetEnv}"? (y/n): `
      );
      proceed = answer.trim().toLowerCase() === "y";
    }

    if (proceed) {
      switchToEnvironment(targetEnv, activeEnv);
      logger.success(`Successfully switched to "${targetEnv}" environment.`);
    } else {
      logger.info("Operation cancelled.");
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

// Execute with error handling
main().catch((error) => {
  logger.error(`Fatal error: ${error}`);
  process.exit(1);
});