import "dotenv/config";

class Config {
  static factoryAddress(required = true): string {
    return this.getEnv("FACTORY_ADDRESS", required);
  }

  static jsonRpcUrl(required = true): string {
    return this.getEnv("JSON_RPC_URL", required);
  }

  static port(required = true): string {
    return this.getEnv("PORT", required);
  }

  static mnemonics(required = true): string {
    return this.getEnv("MNEMONICS", required);
  }

  private static getEnv(name: string, required: boolean): string {
    if (!process.env[name]) {
      if (required) {
        throw new Error(`${name} is not set`);
      } else {
        return "";
      }
    }
    return process.env[name] as string;
  }
}

export default Config;
