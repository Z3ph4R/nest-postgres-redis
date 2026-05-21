<img width="1372" height="150" alt="Screenshot 2026-05-21 162919" src="https://github.com/user-attachments/assets/ddc4f606-a3b8-46ee-8543-dc0a1373dde4" />
# NestJS + PostgreSQL + Redis у Docker

## Опис
Практична робота №2: NestJS застосунок з підключенням PostgreSQL та Redis через Docker Compose.

## Запуск проєкту

Команда: ```docker compose up --build```

## Вправа 2 — docker compose ps

Команда: ```docker compose ps```
```
Container postgres Healthy
Container redis Healthy
app-1     | [Nest] 1  - 04/01/2026, 2:49:50 PM     LOG [NestFactory] Starting Nest application...
app-1     | [Nest] 1  - 04/01/2026, 2:49:50 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +7ms
app-1     | [Nest] 1  - 04/01/2026, 2:49:50 PM     LOG [InstanceLoader] ConfigHostModule dependencies initialized +0ms
app-1     | [Nest] 1  - 04/01/2026, 2:49:50 PM     LOG [InstanceLoader] AppModule dependencies initialized +1ms
app-1     | [Nest] 1  - 04/01/2026, 2:49:50 PM     LOG [InstanceLoader] ConfigModule dependencies initialized +0ms
app-1     | [Nest] 1  - 04/01/2026, 2:49:50 PM     LOG [InstanceLoader] ConfigModule dependencies initialized +0ms
app-1     | [Nest] 1  - 04/01/2026, 2:49:50 PM     LOG [InstanceLoader] CacheModule dependencies initialized +32ms       app-1     | [Nest] 1  - 04/01/2026, 2:49:50 PM     LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized +34ms app-1     | [Nest] 1  - 04/01/2026, 2:49:50 PM     LOG [RoutesResolver] AppController {/}: +2ms                          app-1     | [Nest] 1  - 04/01/2026, 2:49:50 PM     LOG [RouterExplorer] Mapped {/, GET} route +2ms                       app-1     | [Nest] 1  - 04/01/2026, 2:49:50 PM     LOG [NestApplication] Nest application successfully started +2ms
```
## Вправа 3 — Hello World

Команда: ```curl http://localhost:3000```
```
StatusCode        : 200
StatusDescription : OK
Content           : Hello World!
RawContent        : HTTP/1.1 200 OK
                    Connection: keep-alive
                    Keep-Alive: timeout=5
                    Content-Length: 12
                    Content-Type: text/html; charset=utf-8
                    Date: Wed, 01 Apr 2026 14:52:39 GMT
                    ETag: W/"c-Lve95gjOVATpfV8EL5X4nxwjKHE"...
Forms             : {}
Headers           : {[Connection, keep-alive], [Keep-Alive, timeout=5], [Content-Length, 12], [Content-Type, text/html;
                    charset=utf-8]...}
Images            : {}
InputFields       : {}
Links             : {}
ParsedHtml        : System.__ComObject
RawContentLength  : 12
```
## Вправа 4 — Успішна ініціалізація TypeORM

Команда: ```docker compose logs app --tail 30```
```
app-1  | [Nest] 1  - 04/01/2026, 2:49:50 PM     LOG [NestFactory] Starting Nest application...
app-1  | [Nest] 1  - 04/01/2026, 2:49:50 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +7ms
app-1  | [Nest] 1  - 04/01/2026, 2:49:50 PM     LOG [InstanceLoader] ConfigHostModule dependencies initialized +0ms
app-1  | [Nest] 1  - 04/01/2026, 2:49:50 PM     LOG [InstanceLoader] AppModule dependencies initialized +1ms
app-1  | [Nest] 1  - 04/01/2026, 2:49:50 PM     LOG [InstanceLoader] ConfigModule dependencies initialized +0ms
app-1  | [Nest] 1  - 04/01/2026, 2:49:50 PM     LOG [InstanceLoader] ConfigModule dependencies initialized +0ms
app-1  | [Nest] 1  - 04/01/2026, 2:49:50 PM     LOG [InstanceLoader] CacheModule dependencies initialized +32ms
app-1  | [Nest] 1  - 04/01/2026, 2:49:50 PM     LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized +34ms
app-1  | [Nest] 1  - 04/01/2026, 2:49:50 PM     LOG [RoutesResolver] AppController {/}: +2ms
app-1  | [Nest] 1  - 04/01/2026, 2:49:50 PM     LOG [RouterExplorer] Mapped {/, GET} route +2ms
app-1  | [Nest] 1  - 04/01/2026, 2:49:50 PM     LOG [NestApplication] Nest application successfully started +2ms
```
## Вправа 5 — Redis Cache

У файлі ```src/app.module.ts``` підключено:
```
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-yet';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        isGlobal: true,
        store: redisStore,
        url: `redis://${configService.get<string>('REDIS_HOST')}:${configService.get<number>('REDIS_PORT')}`,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```
## Вправа 6 — Перевірка баз даних

PostgreSQL: ```docker compose exec postgres psql -U postgres -c "\l"```
```
                                                     List of databases
   Name    |  Owner   | Encoding | Locale Provider |  Collate   |   Ctype    | ICU Locale | ICU Rules |   Access privileges
-----------+----------+----------+-----------------+------------+------------+------------+-----------+-----------------------
 nestdb    | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           |
 postgres  | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           |
 template0 | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | =c/postgres          +
           |          |          |                 |            |            |            |           | postgres=CTc/postgres
 template1 | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | =c/postgres          +
           |          |          |                 |            |            |            |           | postgres=CTc/postgres
(4 rows)
```
Redis: ```docker compose exec redis redis-cli ping```

Вивід: ```PONG```

## Практичне заняття №4 — DTO + class-validator + Pipes
 
### Структура репозиторію
```
.
├── src/
│   ├── categories/
│   │   ├── dto/
│   │   │   ├── create-category.dto.ts
│   │   │   └── update-category.dto.ts
│   │   ├── category.entity.ts
│   │   ├── categories.module.ts
│   │   ├── categories.service.ts
│   │   └── categories.controller.ts
│   ├── products/
│   │   ├── dto/
│   │   │   ├── create-product.dto.ts
│   │   │   └── update-product.dto.ts
│   │   ├── product.entity.ts
│   │   ├── products.module.ts
│   │   ├── products.service.ts
│   │   └── products.controller.ts
│   ├── common/
│   │   └── pipes/
│   │   	└── trim.pipe.ts
│   ├── migrations/
│   ├── data-source.ts
│   ├── main.ts
│   └── app.module.ts
├── Dockerfile
├── docker-compose.yml
└── README.md
```
 
### Запуск проекту
```bash
cp .env.example .env
docker compose up --build
```
 
### Тест валідації — порожнє ім'я категорії
```text
<вивід curl POST /api/categories з {"name": ""}>
```
<img width="1123" height="966" alt="image" src="https://github.com/user-attachments/assets/123ec348-c02a-406f-9a54-0f8e9c377f98" />
 
### Тест валідації — від'ємна ціна продукту
```text
<вивід curl POST /api/products з {"name": "Test", "price": -5}>
```
<img width="1173" height="1001" alt="image" src="https://github.com/user-attachments/assets/19c79da6-eb2e-4688-8c7a-af54e1713de8" />
 
### Тест валідації — зайве поле
```text
<вивід curl POST /api/categories з {"name": "Test", "isAdmin": true}>
```
<img width="1187" height="1023" alt="image" src="https://github.com/user-attachments/assets/8aadaa45-6962-4f76-a978-17a2f7c125e4" />
 
### Тест TrimPipe
```text
<вивід curl POST /api/categories з {"name": "  Trimmed  "}>
```
<img width="1171" height="895" alt="image" src="https://github.com/user-attachments/assets/5e9239b3-8dcd-4b1a-9955-86c2000e4223" />
 
### Тест валідне створення продукту
```text
<вивід curl POST /api/products з валідними даними>
```
<img width="2232" height="1093" alt="Screenshot 2026-04-26 215100" src="https://github.com/user-attachments/assets/f9f37dea-afeb-4858-bf74-3b80c692ea4c" />

# Звіт про виконання практичної роботи: JWT-авторизація та безпека

## Виконані завдання

### 1. Реєстрація та безпека даних
*   Реалізовано сутність `User` з ролями та автоматичним хешуванням паролів.
*   Для безпечного збереження використано **bcrypt** (10 раундів солі).
*   Паролі в базі даних зберігаються виключно у вигляді незворотних хешів.

### 2. JWT-авторизація
*   Налаштовано видачу токенів через `JwtModule`.
*   Реалізовано `AuthService` для перевірки облікових даних (логін/пароль).
*   Створено **`JwtAuthGuard`**, який блокує запити без валідного токена.

### 3. Захист API (Controller Protection)
*   Контролер продуктів (`ProductsController`) захищено на рівні класу префіксом `/api/products`.
*   Доступ до ресурсів мають лише користувачі з валідним токеном.

## Результати тестування (Скріншоти)

## Скріншот 1:
<img width="1536" height="342" alt="Screenshot 2026-04-30 222042" src="https://github.com/user-attachments/assets/c576a433-c3d6-42a5-975f-73c4d4afda3e" />

## Скріншот 2:
<img width="2021" height="983" alt="Screenshot 2026-04-30 222346" src="https://github.com/user-attachments/assets/ac5fffac-d78e-4aab-a44b-d00603d53397" />


## Скріншот 3:
<img width="930" height="813" alt="Screenshot 2026-04-30 222422" src="https://github.com/user-attachments/assets/d85f99e7-8ca8-4905-8b19-6e774aa19232" />

## Інфраструктура
Проєкт повністю розгорнутий у Docker:
*   **App**: NestJS API
*   **DB**: PostgreSQL
*   **Cache**: Redis

Для запуску: `docker compose up --build -d`

## Практичне заняття №6 — Interceptors + Exception Filters + Swagger
 
### Структура репозиторію
```
.
├── src/
│   ├── auth/ ...
│   ├── users/ ...
│   ├── categories/ ...
│   ├── products/ ...
│   ├── common/
│   │   ├── enums/
│   │   │   └── role.enum.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── interceptors/
│   │   │   ├── logging.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   └── pipes/
│   │   	└── trim.pipe.ts
│   ├── migrations/
│   ├── main.ts
│   └── app.module.ts
├── swagger-screenshot.png
├── Dockerfile
├── docker-compose.yml
└── README.md
```
 
### Запуск проекту
```bash
cp .env.example .env
docker compose up --build
```
 
### Swagger UI
http://localhost:3000/api/docs
 
<img width="3439" height="1389" alt="image" src="https://github.com/user-attachments/assets/514a2883-1079-4f9d-bb25-0d03fd14fbbd" />

### Формат успішної відповіді
```json
{
  "data": { ... },
  "statusCode": 200,
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```
 
### Формат помилки
```json
{
  "error": {
	"code": 400,
	"message": "Validation failed",
	"details": ["name must be longer..."],
	"traceId": "a1b2c3..."
  },
  "timestamp": "2025-01-15T10:31:00.000Z"
}
```
 
### Приклад логів (LoggingInterceptor)
```text
app-1     | [Nest] 1  - 05/06/2026, 6:29:35 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +0ms
app-1     | [Nest] 1  - 05/06/2026, 6:29:35 PM     LOG [InstanceLoader] UsersModule dependencies initialized +1ms
app-1     | [Nest] 1  - 05/06/2026, 6:29:35 PM     LOG [InstanceLoader] AuthModule dependencies initialized +0ms
app-1     | [Nest] 1  - 05/06/2026, 6:29:35 PM     LOG [RoutesResolver] AppController {/}: +31ms
app-1     | [Nest] 1  - 05/06/2026, 6:29:35 PM     LOG [RouterExplorer] Mapped {/, GET} route +4ms
app-1     | [Nest] 1  - 05/06/2026, 6:29:35 PM     LOG [RoutesResolver] CategoriesController {/categories}: +0ms
app-1     | [Nest] 1  - 05/06/2026, 6:29:35 PM     LOG [RouterExplorer] Mapped {/categories, POST} route +1ms
app-1     | [Nest] 1  - 05/06/2026, 6:29:35 PM     LOG [RouterExplorer] Mapped {/categories, GET} route +0ms
app-1     | [Nest] 1  - 05/06/2026, 6:29:35 PM     LOG [RoutesResolver] ProductsController {/api/products}: +1ms
app-1     | [Nest] 1  - 05/06/2026, 6:29:35 PM     LOG [RouterExplorer] Mapped {/api/products, POST} route +0ms
app-1     | [Nest] 1  - 05/06/2026, 6:29:35 PM     LOG [RouterExplorer] Mapped {/api/products, GET} route +0ms
app-1     | [Nest] 1  - 05/06/2026, 6:29:35 PM     LOG [RoutesResolver] AuthController {/auth}: +0ms
app-1     | [Nest] 1  - 05/06/2026, 6:29:35 PM     LOG [RouterExplorer] Mapped {/auth/register, POST} route +0ms
app-1     | [Nest] 1  - 05/06/2026, 6:29:35 PM     LOG [RouterExplorer] Mapped {/auth/login, POST} route +1ms
app-1     | [Nest] 1  - 05/06/2026, 6:29:35 PM     LOG [NestApplication] Nest application successfully started +2ms
```
 
### Тест помилки з traceId
```text
{
  "error": {
    "code": 404,
    "message": "Product with ID 999 not found",
    "traceId": "eff456-gh78-99"
  },
  "timestamp": "2026-05-06T17:40:12.000Z"
}
```
## Student
- Name: Михайлюк Валентин Валентинович
- Group: 232/1
 
## Практичне заняття №7 — Redis + Pagination + Filtering
 
### Запуск проекту
```bash
cp .env.example .env
docker compose up --build
docker compose run --rm app npm run seed
```
 
### API: GET /api/products
 
| Параметр | Тип | Default | Опис |
|----------|-----|---------|------|
| page | number | 1 | Номер сторінки |
| pageSize | number | 10 | Елементів на сторінку (max 100) |
| sort | string | createdAt | Поле сортування |
| order | asc/desc | desc | Напрямок |
| categoryId | number | - | Фільтр за категорією |
| minPrice | number | - | Мінімальна ціна |
| maxPrice | number | - | Максимальна ціна |
| search | string | - | Пошук за назвою (ILIKE) |

 
### Тест пагінації
```text
<img width="1372" height="150" alt="Screenshot 2026-05-21 162919" src="https://github.com/user-attachments/assets/2d9ab0c3-83d3-4ae6-aaa2-ce4de6b29dd2" />
```
 
### Тест фільтрації
```text
<img width="1363" height="82" alt="image" src="https://github.com/user-attachments/assets/9b9b6c67-a9ac-4e42-a87b-44d266ba9125" />
```
 
### Тест пошуку
```text
<img width="1365" height="67" alt="image" src="https://github.com/user-attachments/assets/cb5fc668-cd1a-4c44-a338-f23dbc858164" />
```
 
### Тест кешування (Redis)
```text
<img width="1359" height="37" alt="image" src="https://github.com/user-attachments/assets/5e12bf6a-1fab-4c88-b68b-3b9d316ff0b8" />
```
 
### Тест інвалідації кешу
```text
<img width="833" height="35" alt="image" src="https://github.com/user-attachments/assets/a98e3ea3-bcb1-4a14-af55-d1a305678344" />
```




