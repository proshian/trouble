# trouble

## Игра незавершена
**На данный момент есть только код, создающий игральое поле и пара классов, которые пока не используются.** \
**До 00:00 24.01.2022 постараюсь довести проект до состояния, когда можно играть, но с одного компьютера.**

Оригинальная доска для игры выглядит так: \
![Если вы видите этот текст, картинка с игральным полем не отобразилась :(](resources/board.png?raw=true "Игральное поле")

## Правила игры

Игра рассчитана на четырех игроков.

Цель игрока - первым пройти всеми 4-мя пешками полный круг по полю.

Пешка начинает свой путь в “доме” и заканчивает в одном из финишных слотов игрока.
За один ход пешка проходит по часовой стрелке число клеток, равное выпавшему на игральном кубике. 
  
Чтобы пешка могла выйти из дома и начать двигаться по полю, необходимо, чтобы на кубике выпало 6. Однако, если у игрока нет пешек вне дома, выход из дома производится при любом числе на кубике.
 
Игроки посылают пешку оппонента в “дом” оппонента, если становятся на неё. 
Игроки не могут становиться на собственные пешки.
 
Решение, какой пешкой походить производится после броска кубика.
 
Когда пешка пришла на одну из финишных клеток, она на ней фиксируется. 
Если в соответветствии с числом на кубике пешка "перепрыгивает" все финишные слоты, считается, что она не может сделать ход.

Если у игрока не возможен ход, ход передается следующему.

## Открытие приложения

Для работы, нужно открывать через запуск web-сервера в корневой директории проекта.

Например, сделать это можно выполнив команду:

```
npx http-server
```

В браузере открываем http://localhost:8080/
