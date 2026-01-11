// PhotoCollageMaker - Основной файл фронтенда
// Инициализация приложения

// Глобальные переменные
let currentZoom = 1;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Документ загружен. Инициализируем редактор...');

    // 1. Получаем ссылку на canvas элемент
    const canvasElement = document.getElementById('main-canvas');
    
    // 2. Создаем холст Fabric.js
    const canvas = new fabric.Canvas('main-canvas', {
        backgroundColor: '#ffffff',
        width: 800,
        height: 1000,
        selection: true,
        preserveObjectStacking: true
    });

    // 3. Сохраняем ссылку на canvas в глобальной переменной
    window.mainCanvas = canvas;

    // 4. Добавляем тестовый текст
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
    canvas.renderAll();

    // 5. Массив для хранения загруженных изображений
    const imageLibrary = [];
    const libraryContainer = document.getElementById('image-library');

    // 6. Функция для отображения превью в библиотеке
    function addImageToLibrary(url, name) {
        // Создаем контейнер для превью
        const previewDiv = document.createElement('div');
        previewDiv.className = 'image-preview';
        previewDiv.draggable = true;
        previewDiv.dataset.url = url;
        previewDiv.dataset.name = name;

        // Создаем изображение для превью
        const img = document.createElement('img');
        img.src = url;
        img.alt = name;
        img.title = 'Перетащите на холст';

        // Создаем текст с именем файла
        const nameSpan = document.createElement('span');
        nameSpan.textContent = name.length > 15 ? name.substring(0, 12) + '...' : name;
        nameSpan.className = 'image-name';

        // Добавляем элементы в контейнер
        previewDiv.appendChild(img);
        previewDiv.appendChild(nameSpan);

        // Добавляем в библиотеку
        libraryContainer.appendChild(previewDiv);

        // Убираем сообщение "Загрузите фотографии", если оно есть
        const emptyMsg = libraryContainer.querySelector('.empty-library');
        if (emptyMsg) {
            emptyMsg.remove();
        }

        // Сохраняем в массив
        imageLibrary.push({
            url: url,
            name: name,
            element: previewDiv
        });

        // Добавляем обработчики для drag & drop
        setupDragAndDrop(previewDiv, url);
    }

    // 7. Функция для настройки перетаскивания
    function setupDragAndDrop(element, imageUrl) {
        element.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', imageUrl);
            console.log('Начато перетаскивание:', imageUrl);
        });
    }

    // 8. Обработчик загрузки файлов
    const fileInput = document.getElementById('file-input');
    document.getElementById('btn-upload').addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function(e) {
        const files = e.target.files;
        if (files.length === 0) return;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Проверяем, что это изображение
            if (!file.type.match('image.*')) {
                alert(`Файл "${file.name}" не является изображением.`);
                continue;
            }

            // Создаем URL для изображения
            const imageUrl = URL.createObjectURL(file);
            
            // Добавляем в библиотеку
            addImageToLibrary(imageUrl, file.name);
        }

        // Сбрасываем input, чтобы можно было загрузить те же файлы снова
        fileInput.value = '';
        console.log('Загружено изображений:', files.length);
    });

    // 9. Обработчик drop на холсте для перетаскивания из библиотеки
    // Важно: вешаем на canvas wrapper (родительский div), а не на canvas элемент
    const canvasContainer = document.querySelector('.canvas-container');
    
    canvasContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        canvasContainer.style.backgroundColor = '#f0f0f0'; // визуальный фидбек
    });

    canvasContainer.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        canvasContainer.style.backgroundColor = ''; // убираем подсветку
    });

    canvasContainer.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        canvasContainer.style.backgroundColor = ''; // убираем подсветку
        
        console.log('Drop event fired on canvas container!');
        const imageUrl = e.dataTransfer.getData('text/plain');
        console.log('Image URL from dataTransfer:', imageUrl);
        
        if (!imageUrl) {
            console.log('No image URL in data transfer');
            return;
        }

        console.log('Loading image from URL:', imageUrl);
        
        // Добавляем изображение на холст
        fabric.Image.fromURL(imageUrl, function(img) {
            if (!img) {
                console.error('Failed to load image from URL:', imageUrl);
                return;
            }
            
            console.log('Image loaded successfully, dimensions:', img.width, 'x', img.height);
            
            // Ограничиваем максимальный размер
            const maxWidth = 400;
            const maxHeight = 400;
            
            let scale = 1;
            if (img.width > maxWidth || img.height > maxHeight) {
                scale = Math.min(maxWidth / img.width, maxHeight / img.height);
            }

            // Настраиваем изображение
            img.set({
                left: 200,
                top: 200,
                scaleX: scale,
                scaleY: scale,
                hasControls: true,
                hasBorders: true,
                lockUniScaling: false
            });

            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
            console.log('Изображение добавлено на холст');
        }, {
            crossOrigin: 'anonymous'
        });
    });

    // 10. Обработчик для кнопки "Добавить фото" (теперь она работает)
    document.getElementById('btn-add-photo').addEventListener('click', function() {
        // Открываем диалог выбора файла
        fileInput.click();
    });

    // 11. Обработчик для кнопки "Добавить текст"
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
        canvas.setActiveObject(text);
        canvas.renderAll();
        console.log('Добавлен текстовый блок');
    });

    // 12. Обработчики для кнопок масштабирования
    document.getElementById('btn-zoom-in').addEventListener('click', function() {
        currentZoom *= 1.2;
        updateCanvasZoom();
    });

    document.getElementById('btn-zoom-out').addEventListener('click', function() {
        currentZoom /= 1.2;
        updateCanvasZoom();
    });

    document.getElementById('btn-zoom-fit').addEventListener('click', function() {
        currentZoom = 1;
        updateCanvasZoom();
    });

    function updateCanvasZoom() {
        canvas.setZoom(currentZoom);
        document.getElementById('zoom-level').textContent = Math.round(currentZoom * 100) + '%';
        console.log('Масштаб холста:', currentZoom);
    }

    // 13. Логируем успешную инициализацию
    console.log('Холст Fabric.js инициализирован:', canvas);
    console.log('Размер холста:', canvas.getWidth(), 'x', canvas.getHeight());
    console.log('Все обработчики настроены.');
});