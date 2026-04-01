# NestJS + PostgreSQL + Redis у Docker

## Опис
Практична робота №2: NestJS застосунок з підключенням PostgreSQL та Redis через Docker Compose.

## Запуск проєкту

Команда:```docker compose up --build```

## Вправа 2 — docker compose ps

Команда:```docker compose ps```
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

Команда:```curl http://localhost:3000```
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

Команда:```docker compose logs app --tail 30```
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

```PONG```
