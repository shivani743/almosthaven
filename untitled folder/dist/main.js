"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {});
    app.useStaticAssets(path_1.join(__dirname, '..', 'www'));
    app.enableCors();
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    await app.listen(80);
    console.log('app listening on port ', 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map