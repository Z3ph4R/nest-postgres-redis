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





