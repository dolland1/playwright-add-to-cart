import { type Locator, type Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.locator("#user-name");
    this.passwordField = page.locator("#password");
    this.loginButton = page.locator("#login-button");
  }

  async goTo(link: string) {
    await this.page.goto("https://www.saucedemo.com/" + link);
  }

  async login() {
    await this.usernameField.fill("standard_user");
    await this.passwordField.fill("secret_sauce");
    await this.loginButton.click();
  }
}
