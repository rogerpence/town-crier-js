import * as tc  from './town-crier.js';
import * as dom from './rp.dom.js';

const sleep = (milliseconds) => {
   return new Promise(resolve => setTimeout(resolve, milliseconds))
}


// const addCrier = function() {
//     const crierMainContainer = document.querySelector('.all-criers-container');
//     const  placeholderDiv =
//  `<div id="crier-placeholder" style="width: 175px; height: 0; opacity: 0; background-color: red;">
//  </div>`
//     crierMainContainer.insertAdjacentHTML('afterbegin', placeholderDiv);
//  }


const crierOptions = [];

crierOptions.push({
   heading: "Heading 1",
   msg: "Wouldn't it be nice if we were older, then we wouldn't have to wait so long.",
   status: "primary",
   closeType: 'user',
   duration: 2000
});

crierOptions.push({
   heading: "Heading 2",
   msg: "Rolland the Thompson Headless Gunner.",
   status: "secondary",
   closeType: 'auto',
   duration: 4000
});

crierOptions.push({
   heading: "Heading 3",
   msg: "I'm tied to you like the buttons on your blouse.",
   status: "success",
   closeType: 'both',
   duration: 6000
});

crierOptions.push({
   heading: "Heading 4",
   msg: "Wouldn't it be nice if we were older, then we wouldn't have to wait so long.",
   status: "danger",
   closeType: 'manual',
   duration: 200000
});

crierOptions.push({
   heading: "Heading 5",
   msg: "Rolland the Thompson Headless Gunner.",
   status: "warning",
   closeType: 'auto',
   duration: 16000
});

crierOptions.push({
   heading: "Heading 6",
   msg: "I'm tied to you like the buttons on your blouse.",
   status: "info",
   closeType: 'manual',
   duration: 18000
});


setTimeout(()=> {
   new tc.TownCrier(crierOptions[0]);
}, 1000);

setTimeout(()=> {
    new tc.TownCrier(crierOptions[1]);
}, 3000);

setTimeout(()=> {
   new tc.TownCrier(crierOptions[2]);
}, 5000);


// //instanceCrier(crierOptions[0]);
// const index = 0;

// setTimeout((index) => {
//    new tc.TownCrier(crierOptions[index])
// },2000);


//const addCrierClick = Array.from(document.querySelectorAll('.add-crier'));

// setTimeout(showCrier, 2000);
// setTimeout(showCrier, 3000);
// setTimeout(showCrier, 4000);



//  addCrierClick.forEach(clicker => {
//    clicker.addEventListener('click', e => {
//       console.log('clicked');
//       showCrier();
//       // const townCrier = new tc.TownCrier({name: 'roger'});
//       // const html = townCrier.getHTML();
//       // townCrier.addCrier(html);
//    });
//  });



