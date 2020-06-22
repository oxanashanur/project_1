document.addEventListener('DOMContentLoaded', () => {

    //
    // Tabs (выбираем из меню стиль питания)

    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() { //эта функция скрывает табы
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');

        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        }); //удаляет класс активности
    }


    function showTabContent(i = 0) { //эта функция доб класс активности
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) { //нажатие на меню и рядом в родит-м контейнере
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    }); //делегирование событий


    //
    //Timer
    const deadLine = '2020-07-11';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()), //когда заканч-я время
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            // t это кол-во миллисекунд кот ост в разнице
            // кол-во дней кот отображ-я в таймере (Math.floor округление до целого)
            // t делим на (1000 миллисекунд * 60(кол-во миллисек-д в минуте) * 60(в часе) * 24(в сутках))
            hours = Math.floor((t / (1000 * 60 * 60) % 24)),
            // % возвращает остаток после деления
            // так как у нас есть дни, часы показ только до 24
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return { // возв-м объект из функции
            'total': t, // есть общее кол-во миллисек (total) в него помещ t
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds,
        };
    }

    //подставляем 0 перед числом, если оно одно (не 9, а 09)
    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) { //устан таймер на страницу
        const timer = document.querySelector(selector), // '.timer' это selector
            days = timer.querySelector('#days'), // #days это id на нашей стр
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000); //зап фун updateClock каж сек

        //в первые сек таймер показ время из верстки, убраем этот баг
        updateClock(); //вызываем в ручную

        function updateClock() { // фун-я кот обновляет таймер каж сек
            const t = getTimeRemaining(endtime); //рассчет остав времени на данную сек

            days.innerHTML = getZero(t.days); //days.innerHTML = t.days; //кол-во дней кот нуж отобр на стр
            hours.innerHTML = getZero(t.hours); //hours.innerHTML = t.hours;
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) { // остан-м таймер (если время вышло (ушло в минус))
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadLine);


    //
    // Modal (мод окно)

    const // modalTrigger = document.querySelector('[data-modal]'),
        modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal'),
        modalCloseBtn = document.querySelector('[data-close]');

    /*
    modalTrigger.addEventListener('click', () => {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden'; //что бы стр под мод окном не скроллилась
    });
    */

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId); //если польз сам откр мод окно, оно само не появиться
    }

    modalTrigger.forEach(btn => { //привяз мод окно к нескольким элементам
        btn.addEventListener('click', openModal);
    });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = ''; //что бы стр скроллилась после закрыт мод окна
    }

    modalCloseBtn.addEventListener('click', closeModal);

    /* 
    //2й способ
    //если испол toggle (переключ-ль)

    modalTrigger.addEventListener('click', () => {
        modal.classList.toggle('show');
        document.body.style.overflow = 'hidden';
    });

    modalCloseBtn.addEventListener('click', () => {
        modal.classList.toggle('show');
        document.body.style.overflow = '';
    });
    */

    modal.addEventListener('click', (e) => { //закрыт мод окна кликом в ост-ю часть экрана (не только на x) 
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => { //закрыт мод окна кнопкой esc
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });


    // const modalTimerId = setTimeout(openModal, 3000); //что бы мод окно вызыв через назнач-е нами время


    function showModalByScroll() { //когда польз проскроллил стр до низу мод окно всплывает
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll); // только 1н раз
        }
    }

    window.addEventListener('scroll', showModalByScroll);



    //
    // Class для карточек меню

    /*
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector); //дом элемент
            this.transfer = 55;
            this.changeToRUB();
        }

        changeToRUB() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');
            element.innerHTML = `
                <div class="menu__item">
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                    </div>
                </div>
            `;
            this.parent.append(element);
        }
    }
    */

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes; //массив
            this.parent = document.querySelector(parentSelector); //дом элемент
            this.transfer = 55;
            this.changeToRUB();
        }

        changeToRUB() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) { //если кол-во элем-в равно 0
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов.Продукт активных и здоровых людей.Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container',
        //добавляем
        'menu__item',
        'big'
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        14,
        '.menu .container',
        'menu__item'
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "vpost",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        21,
        '.menu .container',
        'menu__item'
    ).render();


});