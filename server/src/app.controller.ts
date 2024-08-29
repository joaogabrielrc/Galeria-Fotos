import { Controller, Get } from "@nestjs/common";

@Controller({
  path: "",
  version: "1",
})
export class AppController {
  @Get()
  public getHello(): string {
    return "Hello World!";
  }
}
