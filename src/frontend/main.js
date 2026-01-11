// PhotoCollageMaker - Основной файл фронтенда
// Инициализация приложения

document.addEventListener('DOMContentLoaded', function() {
    console.log('Документ загружен. Инициализируем редактор...');

    // 1. Получаем ссылку на canvas элемент
    const canvasElement = document.getElementById('main-canvas');
    
    // 2. Создаем холст Fabric.js с белым фоном
    // Размеры холста A4 в пикселях для 300 DPI: 2480x3508 (при 300 DPI)
    // Пока возьмем меньший размер для удобства разработки
    const canvas = new fabric.Canvas('main-canvas', {
        backgroundColor: '#ffffff',
        width: 800,
        height: 1000,
        selection: true, // разрешаем выделение объектов
        preserveObjectStacking: true // сохраняем порядок объектов
    });

    // 3. Сохраняем ссылку на canvas в глобальной переменной для доступа из других функций
    window.mainCanvas = canvas;

    // 4. Добавляем тестовый текст, чтобы убедиться, что Fabric.js работает
    const welcomeText = new fabric.Textbox('Добро пожаловать в редактор альбомов!\nПеретащите сюда фотографии.', {
        left: 100,
        top: 100,
        width: 400,
        fontSize: 24,
        fill: '#333333',
        textAlign: 'center',
        fontFamily: 'Arial'
    });
    
    canvas.add(welcomeText);
    canvas.renderAll(); // перерисовываем холст

    // 5. Логируем успешную инициализацию
    console.log('Холст Fabric.js инициализирован:', canvas);
    console.log('Размер холста:', canvas.getWidth(), 'x', canvas.getHeight());

    // 6. Простая функция для кнопки "Добавить фото" (временная, для теста)
    document.getElementById('btn-add-photo').addEventListener('click', function() {
        alert('Функция "Добавить фото" будет реализована в следующей задаче!');
    });

    // 7. Простая функция для кнопки "Добавить текст"
    document.getElementById('btn-add-text').addEventListener('click', function() {
        const text = new fabric.Textbox('Новый текст', {
            left: 50,
            top: 200,
            width: 200,
            fontSize: 20,
            fill: '#0066cc',
            fontFamily: 'Arial'
        });
        canvas.add(text);
        canvas.setActiveObject(text); // выделяем новый текст
        canvas.renderAll();
        console.log('Добавлен текстовый блок');
    });

    // 8. Обработчик для кнопки загрузки файлов
    const fileInput = document.getElementById('file-input');
    document.getElementById('btn-upload').addEventListener('click', function() {
        fileInput.click(); // симулируем клик по скрытому input
    });

    // 9. Пока просто показываем, что файл выбран
    fileInput.addEventListener('change', function(e) {
        const files = e.target.files;
        if (files.length > 0) {
            alert(`Выбрано ${files.length} файлов. Загрузка будет реализована позже.`);
        }
    });
});