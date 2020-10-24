let objectManager;
let objectId = 0;
let adress;
let reviews = [];
let coords;
let myMap;

// const dataBase = [];

// console.log(reviews);

// reviews[objectId].review.name = 'дима';

// console.log(reviews);

function mapInit() { 
  ymaps.ready(() => { 
    myMap = new ymaps.Map('map', {
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

    coords = e.get('coords');
    
    let posX = e.getSourceEvent().originalEvent.domEvent.originalEvent
        .clientX;
    let posY = e.getSourceEvent().originalEvent.domEvent.originalEvent
        .clientY;
    
    onPopup(posX, posY);
  });

  myMap.geoObjects.events.add('click', function (e) {
    
    let pos = e.get('position');
    showReview();
    onPopup(pos[0], pos[1]);
    // Получение ссылки на дочерний объект, на котором произошло событие.
    
  });
}

function onPopup(posX, posY){
	const popup = document.querySelector('.popup');
	const adressMap = document.querySelector('.header__adress');
  const btn = document.querySelector('.form__btn');
  const close = document.querySelector('#popup__close');
  
  getAdress(coords)
    .then(res => {
      adress = res,
      adressMap.textContent = adress
    })
 

  popup.style.left = posX + 'px';
  popup.style.top = posY + 'px';

  btn.addEventListener('click', recordForm);

  close.addEventListener('click', (e) => {
    e.preventDefault();
    closePopup();
  });
};

function recordForm() {
  const form = document.querySelector('.form');

    let pl = {
      objectId: objectId,
      coords: coords,
      adress: adress,
      review: {}
    }

    const formElements = [...form.elements]
    .filter(elem => elem.tagName !== 'BUTTON');

    for(const elem of formElements){
      pl.review[elem.name] = elem.value;
    }

    reviews.push(pl);
    createPlacemark(pl);
    clearForm();
    objectId++;
    closePopup();
    // console.log(reviews);
};

function createPlacemark(obj){
  let featuresObj = {
    'type': 'Feature',
    'id': obj.objectId,
    'geometry': {
      'type': 'Point',
      'coordinates': obj.coords
    },
    'properties': {}
  };

  objectManager.add({
    'type': 'FeatureCollection',
    'features': [featuresObj]
  });
};

function getAdress(coords){
  return new Promise((resolve, reject) => {
    ymaps.geocode(coords)
      .then(response => resolve(response.geoObjects.get(0).getAddressLine()))
      .catch(e => reject(e))
  })
};

function clearForm(){
  document.querySelector('.form__name').value = '';
  document.querySelector('.form__spot').value = '';
  document.querySelector('.form__comment').value = '';
};

function closePopup(){
  const popup = document.querySelector('.popup');
  popup.style.left = -9999 + 'px';
};

function showReview(){
  // let data = [];
  // console.log(adress);
  // for(let i in reviews){
  //   let items = reviews[i];
  //   // console.log(items.adress);

  //   if(items.adress === adress){
  //     console.log(items.review);
  //     // data.push(items.review);
  //     // console.log(data);
  //     // createReview(obj);
  //   }
  // }
};

function createReview(obj){
  const reviewsItem = document.createElement('div');
        reviewsItem.classList.add('reviews__item');
        reviewsItem.innerHTML = `            
          <div class="reviews__item-header">
          <span class="reviews__item-name">${review.name}</span>
          <span class="reviews__item-spot">${review.spot}</span>
          <span class="reviews__data">${review.data}</span>
          </div>
          <div class="reviews__item-text">${review.comment}</div>          
        `;
};


 // Создание метки.
// var myPlacemark;
// function createPlacemark(coords) {
//   return new ymaps.Placemark(coords,  {
//     preset: 'islands#violetDotIconWithCaption',
//   });
// }

// Определяем адрес по координатам (обратное геокодирование).
// function getAddress(coords) {
//   // myPlacemark.properties.set();
//   ymaps.geocode(coords).then(function (res) {
//    var firstGeoObject = res.geoObjects.get(0);
//    adress = firstGeoObject.getAddressLine();
//    //  console.log(adress);

//    // myPlacemark.properties
//   //   .set({
//   //       // Формируем строку с данными об объекте.
//   //       hintContent: [
//   //         // Название населенного пункта или вышестоящее административно-территориальное образование.
//   //         firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
//   //         // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
//   //         firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
//   //       ].filter(Boolean).join(', '),
//   //       // В качестве контента балуна задаем строку с адресом объекта.
//   //       balloonContent: adress
//   //     });
//     // return adress;
//   });
// }