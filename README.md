# trouble

Играется на одном компьютере.

Чтобы сделать ход пешкой, необходимо на нее кликнуть / нажать.

Интерфейс: \
![Если вы видите этот текст, картинка с интерфейсом не отобразилась :(](resources/screenShot.png?raw=true "Интерфейс")

## Правила игры

Игра рассчитана на четырех игроков.

Цель игрока – первым пройти всеми 4-мя пешками полный круг по полю.

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

### Github Pages
Приложение доступно по ссылке https://proshian.github.io/trouble/

### Запуск со своего компьютера
Для работы, нужно открывать через запуск web-сервера в корневой директории проекта.

Например, сделать это можно выполнив команду:

```
npx http-server
```

В браузере открываем http://localhost:8080/