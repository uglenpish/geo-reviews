let objectManager;
let objectId = 0;
let adress;
let reviews = {}

// const dataBase = [];

// console.log(reviews);

// reviews[objectId].review.name = 'дима';

// console.log(reviews);

function mapInit() { 
  ymaps.ready(() => { 
    let myMap = new ymaps.Map('map', {
      center: [51.67, 39.22],
      zoom: 13,
      controls: ['zoomControl'],
      behaviors: ['drag']
    });

    objectManager = new ymaps.ObjectManager({
      clusterize: true,
    });

    myMap.geoObjects.add(objectManager);

    addListeners(myMap);
	})
}

mapInit();

function addListeners(myMap) {
  myMap.events.add('click', function (e) {

    var coords = e.get('coords');
    // console.log(coords);
    // console.log(objectId);
    

    let posX = e.getSourceEvent().originalEvent.domEvent.originalEvent
        .clientX;
    let posY = e.getSourceEvent().originalEvent.domEvent.originalEvent
        .clientY;
    
    onPopup(posX, posY, coords);
  });

  myMap.geoObjects.events.add('click', function (e) {
    // Получение ссылки на дочерний объект, на котором произошло событие.
    var object = e.get('target');
    console.log(1);
  });
}

 // Создание метки.
// var myPlacemark;
// function createPlacemark(coords) {
//   return new ymaps.Placemark(coords,  {
//     preset: 'islands#violetDotIconWithCaption',
//   });
// }

// Определяем адрес по координатам (обратное геокодирование).
function getAddress(coords) {
  // myPlacemark.properties.set();
  ymaps.geocode(coords).then(function (res) {
  	var firstGeoObject = res.geoObjects.get(0);
  	adress = firstGeoObject.getAddressLine();

		// myPlacemark.properties
  //   .set({
  //       // Формируем строку с данными об объекте.
  //       hintContent: [
  //         // Название населенного пункта или вышестоящее административно-территориальное образование.
  //         firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
  //         // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
  //         firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
  //       ].filter(Boolean).join(', '),
  //       // В качестве контента балуна задаем строку с адресом объекта.
  //       balloonContent: adress
  //     });
    return adress;
  });
}

function onPopup(posX, posY, coords){
	const popup = document.querySelector('.popup');
	const adressMap = document.querySelector('.header__adress');
  const btn = document.querySelector('.form__btn');
  const close = document.querySelector('#popup__close');
  
  getAddress(coords);
  console.log(coords);
  console.log(adress);
  adressMap.textContent = adress;

  popup.style.left = posX + 'px';
  popup.style.top = posY + 'px';

  btn.addEventListener('click', function(event) {
    event.preventDefault();
    createPlacemark(coords);
    recordForm(coords);
    popup.style.left = -9999 + 'px';
    
  });

  close.addEventListener('click', (e) => {
    e.preventDefault();
    popup.style.left = -9999 + 'px';
  })
}

function recordForm(coords) {
  const form = document.querySelector('.form');
  const nameForm = document.querySelector('.form__name').value;
  const spotForm = document.querySelector('.form__spot').value;
  const commentForm = document.querySelector('.form__comment').value;
    
    let pl = {
      objectId: objectId,
      coords: coords,
      review: {}
    }

    const formElements = [...form.elements]
    .filter(elem => elem.tagName !== 'BUTTON');

    for(const elem of formElements){
      pl.review[elem.name] = elem.value;
    }

    console.log(pl);
    // reviews.push(pl);
    objectId++;
  

  console.log(reviews);
}

function createPlacemark(coords){
  // return new ymaps.Placemark(coords,  {
  //   preset: 'islands#violetDotIconWithCaption',
  // });
};


