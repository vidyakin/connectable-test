1. Нужно скачать утилиту https://www.mongodb.com/download-center/community?jmp=docs
2. Создать раздел для БД. Это лучше делать на диске С:\. Для этого нужно зайты на диск и создать папку data и в ней db, пример:https://monosnap.com/file/MJQ7Sv630SXfuob40GLuqrrB56KJ86
3. Установить модули node . Для этого нужно зайти в корень проекта, завпустить git bush, и выполнить команду npm install, пример: https://monosnap.com/file/YcNEiA1EKhtb6qay0DDSqCIW2WKBz8 . Тоже самое нужно проделать для vue-client директории, пример: https://monosnap.com/file/QXGdOqSWxhfDatwpxqXmD6GD5vw7Ed
4. Запуск приложения
4.1. Зайти в директорию bin где было установлено MongoDB, например у меня это C:\Program Files\MongoDB\Server\4.2\bin , пример: https://monosnap.com/file/0F8LOblwdAJegL3pMAzxXWQ1cwwUZ0 . Выполнить команду: mongod.exe --dbpath C:\data\db , пример: https://monosnap.com/file/dBbo2OICR9NjM6cRxzptfIR9giGsgh
4.2. Запустить сервер node командой: node index.js, пример https://monosnap.com/file/QsltEW7sgEFJuKhhBz6cqRx63ZhDRr
4.3. Запустить встроенный сервер командой: npm run serve, пример: https://monosnap.com/file/hyAerd0X62gCZ7N3N5pBqm1vwzRNAu
5. Если все успешно запущено то Вы можете перейти по адресу http://localhost:8080 и тестировать приложение